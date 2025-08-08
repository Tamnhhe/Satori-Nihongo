package com.satori.platform.web.rest;

import com.satori.platform.domain.User;
import com.satori.platform.service.AuthenticationAuditService;
import com.satori.platform.service.UserService;
import com.satori.platform.service.UserSessionService;
import com.satori.platform.service.dto.ProfileCompletionDTO;
import com.satori.platform.service.dto.UserRegistrationDTO;
import com.satori.platform.service.dto.UserSessionDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import com.satori.platform.web.rest.errors.EmailAlreadyUsedException;
import com.satori.platform.web.rest.errors.LoginAlreadyUsedException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for enhanced authentication and user management.
 */
@RestController
@RequestMapping("/api/auth")
public class EnhancedAuthResource {

    private static final Logger LOG = LoggerFactory.getLogger(EnhancedAuthResource.class);

    private final UserService userService;
    private final UserSessionService sessionService;
    private final AuthenticationAuditService auditService;

    public EnhancedAuthResource(UserService userService, UserSessionService sessionService,
            AuthenticationAuditService auditService) {
        this.userService = userService;
        this.sessionService = sessionService;
        this.auditService = auditService;
    }

    /**
     * POST /auth/register-with-profile : Register a new user with profile creation.
     */
    @PostMapping("/register-with-profile")
    public ResponseEntity<User> registerWithProfile(@Valid @RequestBody UserRegistrationDTO registrationDTO,
            HttpServletRequest request) throws URISyntaxException {
        LOG.debug("REST request to register user with profile: {}", registrationDTO.getLogin());

        try {
            User newUser = userService.registerUserWithProfile(registrationDTO);
            return ResponseEntity.created(new URI("/api/auth/register-with-profile/" + newUser.getLogin()))
                    .body(newUser);
        } catch (EmailAlreadyUsedException e) {
            throw new BadRequestAlertException("Email is already in use", "userManagement", "emailexists");
        } catch (LoginAlreadyUsedException e) {
            throw new BadRequestAlertException("Login name already used", "userManagement", "userexists");
        }
    }

    /**
     * POST /auth/complete-profile : Complete user profile after registration.
     */
    @PostMapping("/complete-profile")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> completeProfile(@Valid @RequestBody ProfileCompletionDTO profileDTO,
            HttpServletRequest request) {
        String login = getCurrentUserLogin();
        LOG.debug("REST request to complete profile for user: {}", login);

        userService.completeUserProfile(login, profileDTO);
        return ResponseEntity.ok().build();
    }

    /**
     * POST /auth/request-password-reset : Request password reset.
     */
    @PostMapping("/request-password-reset")
    public ResponseEntity<Void> requestPasswordReset(@RequestBody String mail, HttpServletRequest request) {
        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");

        Optional<User> user = userService.requestPasswordResetEnhanced(mail, ipAddress, userAgent);
        if (user.isPresent()) {
            return ResponseEntity.ok().build();
        } else {
            // Always return 200 to prevent email enumeration
            return ResponseEntity.ok().build();
        }
    }

    /**
     * POST /auth/finish-password-reset : Finish password reset.
     */
    @PostMapping("/finish-password-reset")
    public ResponseEntity<Void> finishPasswordReset(@RequestBody PasswordResetFinishDTO passwordResetFinish,
            HttpServletRequest request) {
        String ipAddress = getClientIpAddress(request);
        String userAgent = request.getHeader("User-Agent");

        Optional<User> user = userService.completePasswordResetEnhanced(
                passwordResetFinish.getNewPassword(),
                passwordResetFinish.getKey(),
                ipAddress,
                userAgent);

        if (user.isEmpty()) {
            throw new BadRequestAlertException("No user was found for this reset key", "passwordReset", "keynotfound");
        }

        return ResponseEntity.ok().build();
    }

    /**
     * GET /auth/sessions : Get active sessions for current user.
     */
    @GetMapping("/sessions")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<UserSessionDTO>> getActiveSessions() {
        String login = getCurrentUserLogin();
        User user = userService.getUserWithAuthoritiesByLogin(login)
                .orElseThrow(() -> new BadRequestAlertException("User not found", "userManagement", "usernotfound"));

        List<UserSessionDTO> sessions = sessionService.getActiveUserSessions(user);
        return ResponseEntity.ok(sessions);
    }

    /**
     * DELETE /auth/sessions/{sessionId} : Invalidate a specific session.
     */
    @DeleteMapping("/sessions/{sessionId}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> invalidateSession(@PathVariable String sessionId) {
        LOG.debug("REST request to invalidate session: {}", sessionId);
        sessionService.invalidateSession(sessionId);
        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /auth/sessions : Invalidate all other sessions except current.
     */
    @DeleteMapping("/sessions")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> invalidateOtherSessions(@RequestParam String currentSessionId) {
        String login = getCurrentUserLogin();
        User user = userService.getUserWithAuthoritiesByLogin(login)
                .orElseThrow(() -> new BadRequestAlertException("User not found", "userManagement", "usernotfound"));

        sessionService.invalidateOtherUserSessions(user, currentSessionId);
        return ResponseEntity.ok().build();
    }

    /**
     * GET /auth/account-status : Check account status (locked, etc.).
     */
    @GetMapping("/account-status")
    public ResponseEntity<AccountStatusDTO> getAccountStatus(@RequestParam String login) {
        boolean isLocked = userService.isAccountLocked(login);
        long failedAttempts = auditService.getRecentFailedAttempts(login);

        AccountStatusDTO status = new AccountStatusDTO();
        status.setLocked(isLocked);
        status.setFailedAttempts(failedAttempts);

        return ResponseEntity.ok(status);
    }

    private String getCurrentUserLogin() {
        return com.satori.platform.security.SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new BadRequestAlertException("Current user login not found", "userManagement",
                        "usernotfound"));
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    // Inner DTOs
    public static class PasswordResetFinishDTO {
        private String key;
        private String newPassword;

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }

        public String getNewPassword() {
            return newPassword;
        }

        public void setNewPassword(String newPassword) {
            this.newPassword = newPassword;
        }
    }

    public static class AccountStatusDTO {
        private boolean locked;
        private long failedAttempts;

        public boolean isLocked() {
            return locked;
        }

        public void setLocked(boolean locked) {
            this.locked = locked;
        }

        public long getFailedAttempts() {
            return failedAttempts;
        }

        public void setFailedAttempts(long failedAttempts) {
            this.failedAttempts = failedAttempts;
        }
    }
}