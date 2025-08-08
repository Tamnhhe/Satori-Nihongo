package com.satori.platform.web.rest;

import com.satori.platform.domain.OAuth2Account;
import com.satori.platform.domain.User;
import com.satori.platform.domain.enumeration.OAuth2Provider;
import com.satori.platform.security.SecurityUtils;
import com.satori.platform.service.JWTTokenService;
import com.satori.platform.service.OAuth2Service;
import com.satori.platform.service.UserService;
import com.satori.platform.service.dto.*;
import com.satori.platform.service.exception.*;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * REST controller for OAuth2 authentication.
 */
@RestController
@RequestMapping("/api/oauth2")
public class OAuth2AuthController {

    private static final Logger LOG = LoggerFactory.getLogger(OAuth2AuthController.class);
    private static final String ENTITY_NAME = "oauth2Auth";

    private final OAuth2Service oauth2Service;
    private final JWTTokenService jwtTokenService;
    private final UserService userService;
    private final SecureRandom secureRandom;

    public OAuth2AuthController(OAuth2Service oauth2Service, JWTTokenService jwtTokenService, UserService userService) {
        this.oauth2Service = oauth2Service;
        this.jwtTokenService = jwtTokenService;
        this.userService = userService;
        this.secureRandom = new SecureRandom();
    }

    /**
     * GET /oauth2/authorize/{provider} : Generate OAuth2 authorization URL.
     *
     * @param provider    the OAuth2 provider
     * @param redirectUrl optional redirect URL after authentication
     * @return the authorization response with URL and state
     */
    @GetMapping("/authorize/{provider}")
    public ResponseEntity<OAuth2AuthorizationResponse> authorize(
            @PathVariable String provider,
            @RequestParam(required = false) String redirectUrl) {

        LOG.debug("REST request to get OAuth2 authorization URL for provider: {}", provider);

        try {
            OAuth2Provider oauth2Provider = OAuth2Provider.fromProviderId(provider);
            String state = generateSecureState();
            String authorizationUrl = oauth2Service.generateAuthorizationUrl(oauth2Provider, state);

            OAuth2AuthorizationResponse response = new OAuth2AuthorizationResponse(
                    authorizationUrl, state, provider);

            return ResponseEntity.ok(response);

        } catch (IllegalArgumentException e) {
            LOG.error("Invalid OAuth2 provider: {}", provider, e);
            throw new BadRequestAlertException("Invalid OAuth2 provider", ENTITY_NAME, "invalidprovider");
        } catch (OAuth2ProviderDisabledException e) {
            LOG.error("OAuth2 provider disabled: {}", provider, e);
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(null);
        } catch (Exception e) {
            LOG.error("Error generating OAuth2 authorization URL for provider: {}", provider, e);
            throw new BadRequestAlertException("Failed to generate authorization URL", ENTITY_NAME,
                    "authorizationerror");
        }
    }

    /**
     * POST /oauth2/callback/{provider} : Handle OAuth2 callback and authenticate
     * user.
     *
     * @param provider the OAuth2 provider
     * @param request  the callback request with code and state
     * @return the JWT token response
     */
    @PostMapping("/callback/{provider}")
    public ResponseEntity<JWTToken> handleCallback(
            @PathVariable String provider,
            @Valid @RequestBody OAuth2CallbackRequest request) {

        LOG.debug("REST request to handle OAuth2 callback for provider: {}", provider);

        try {
            OAuth2Provider oauth2Provider = OAuth2Provider.fromProviderId(provider);
            OAuth2AuthenticationResult authResult = oauth2Service.handleCallback(
                    oauth2Provider, request.getCode(), request.getState());

            if (!authResult.isSuccessful()) {
                LOG.error("OAuth2 authentication failed for provider: {}", provider);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Generate JWT token
            String jwtToken = jwtTokenService.createToken(authResult.getUser());
            long expiresIn = jwtTokenService.getTokenValidityInSeconds(false);

            JWTToken tokenResponse = new JWTToken(jwtToken, expiresIn);
            tokenResponse.setNewUser(authResult.isNewUser());
            tokenResponse.setProvider(provider);

            LOG.debug("OAuth2 authentication successful for provider: {}, user: {}, isNewUser: {}",
                    provider, authResult.getUser().getLogin(), authResult.isNewUser());

            return ResponseEntity.ok(tokenResponse);

        } catch (IllegalArgumentException e) {
            LOG.error("Invalid OAuth2 provider: {}", provider, e);
            throw new BadRequestAlertException("Invalid OAuth2 provider", ENTITY_NAME, "invalidprovider");
        } catch (OAuth2AuthenticationException e) {
            LOG.error("OAuth2 authentication failed for provider: {}", provider, e);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        } catch (Exception e) {
            LOG.error("Error handling OAuth2 callback for provider: {}", provider, e);
            throw new BadRequestAlertException("OAuth2 authentication failed", ENTITY_NAME, "callbackerror");
        }
    }

    /**
     * POST /oauth2/link/{provider} : Link OAuth2 account to authenticated user.
     *
     * @param provider the OAuth2 provider
     * @param request  the link request with code and state
     * @return success response
     */
    @PostMapping("/link/{provider}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> linkAccount(
            @PathVariable String provider,
            @Valid @RequestBody OAuth2LinkRequest request) {

        LOG.debug("REST request to link OAuth2 account for provider: {}", provider);

        try {
            String currentUserLogin = SecurityUtils.getCurrentUserLogin()
                    .orElseThrow(() -> new BadRequestAlertException("User not authenticated", ENTITY_NAME,
                            "notauthenticated"));

            Optional<User> userOptional = userService.getUserWithAuthoritiesByLogin(currentUserLogin);
            if (userOptional.isEmpty()) {
                throw new BadRequestAlertException("User not found", ENTITY_NAME, "usernotfound");
            }

            User user = userOptional.get();
            OAuth2Provider oauth2Provider = OAuth2Provider.fromProviderId(provider);

            oauth2Service.linkAccount(user, oauth2Provider, request.getCode());

            LOG.debug("OAuth2 account linked successfully for provider: {}, user: {}", provider, user.getLogin());
            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {
            LOG.error("Invalid OAuth2 provider: {}", provider, e);
            throw new BadRequestAlertException("Invalid OAuth2 provider", ENTITY_NAME, "invalidprovider");
        } catch (OAuth2AccountLinkingException e) {
            LOG.error("OAuth2 account linking failed for provider: {}", provider, e);
            throw new BadRequestAlertException(e.getMessage(), ENTITY_NAME, "linkingerror");
        } catch (Exception e) {
            LOG.error("Error linking OAuth2 account for provider: {}", provider, e);
            throw new BadRequestAlertException("Failed to link OAuth2 account", ENTITY_NAME, "linkingerror");
        }
    }

    /**
     * DELETE /oauth2/unlink/{provider} : Unlink OAuth2 account from authenticated
     * user.
     *
     * @param provider the OAuth2 provider
     * @return success response
     */
    @DeleteMapping("/unlink/{provider}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> unlinkAccount(@PathVariable String provider) {

        LOG.debug("REST request to unlink OAuth2 account for provider: {}", provider);

        try {
            String currentUserLogin = SecurityUtils.getCurrentUserLogin()
                    .orElseThrow(() -> new BadRequestAlertException("User not authenticated", ENTITY_NAME,
                            "notauthenticated"));

            Optional<User> userOptional = userService.getUserWithAuthoritiesByLogin(currentUserLogin);
            if (userOptional.isEmpty()) {
                throw new BadRequestAlertException("User not found", ENTITY_NAME, "usernotfound");
            }

            User user = userOptional.get();
            OAuth2Provider oauth2Provider = OAuth2Provider.fromProviderId(provider);

            oauth2Service.unlinkAccount(user, oauth2Provider);

            LOG.debug("OAuth2 account unlinked successfully for provider: {}, user: {}", provider, user.getLogin());
            return ResponseEntity.ok().build();

        } catch (IllegalArgumentException e) {
            LOG.error("Invalid OAuth2 provider: {}", provider, e);
            throw new BadRequestAlertException("Invalid OAuth2 provider", ENTITY_NAME, "invalidprovider");
        } catch (Exception e) {
            LOG.error("Error unlinking OAuth2 account for provider: {}", provider, e);
            throw new BadRequestAlertException("Failed to unlink OAuth2 account", ENTITY_NAME, "unlinkingerror");
        }
    }

    /**
     * GET /oauth2/linked-accounts : Get linked OAuth2 accounts for authenticated
     * user.
     *
     * @return list of linked accounts
     */
    @GetMapping("/linked-accounts")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<LinkedAccountDTO>> getLinkedAccounts() {

        LOG.debug("REST request to get linked OAuth2 accounts");

        try {
            String currentUserLogin = SecurityUtils.getCurrentUserLogin()
                    .orElseThrow(() -> new BadRequestAlertException("User not authenticated", ENTITY_NAME,
                            "notauthenticated"));

            Optional<User> userOptional = userService.getUserWithAuthoritiesByLogin(currentUserLogin);
            if (userOptional.isEmpty()) {
                throw new BadRequestAlertException("User not found", ENTITY_NAME, "usernotfound");
            }

            User user = userOptional.get();
            List<OAuth2Account> linkedAccounts = oauth2Service.getUserLinkedAccounts(user);

            List<LinkedAccountDTO> accountDTOs = linkedAccounts.stream()
                    .map(this::convertToLinkedAccountDTO)
                    .collect(Collectors.toList());

            LOG.debug("Retrieved {} linked OAuth2 accounts for user: {}", accountDTOs.size(), user.getLogin());
            return ResponseEntity.ok(accountDTOs);

        } catch (Exception e) {
            LOG.error("Error retrieving linked OAuth2 accounts", e);
            throw new BadRequestAlertException("Failed to retrieve linked accounts", ENTITY_NAME, "retrievalerror");
        }
    }

    /**
     * Handle OAuth2 authentication exceptions.
     */
    @ExceptionHandler(OAuth2AuthenticationException.class)
    public ResponseEntity<OAuth2ErrorResponse> handleOAuth2AuthenticationException(
            OAuth2AuthenticationException ex, HttpServletRequest request) {

        LOG.error("OAuth2 authentication error: {}", ex.getMessage(), ex);

        OAuth2ErrorResponse errorResponse = new OAuth2ErrorResponse(
                "oauth2_authentication_failed",
                ex.getMessage(),
                ex.getProvider(),
                ex.getErrorCode());
        errorResponse.setPath(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(errorResponse);
    }

    /**
     * Handle OAuth2 account linking exceptions.
     */
    @ExceptionHandler(OAuth2AccountLinkingException.class)
    public ResponseEntity<OAuth2ErrorResponse> handleOAuth2AccountLinkingException(
            OAuth2AccountLinkingException ex, HttpServletRequest request) {

        LOG.error("OAuth2 account linking error: {}", ex.getMessage(), ex);

        OAuth2ErrorResponse errorResponse = new OAuth2ErrorResponse(
                "oauth2_account_linking_failed",
                ex.getMessage(),
                ex.getProvider(),
                ex.getErrorCode());
        errorResponse.setPath(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
    }

    /**
     * Handle OAuth2 provider disabled exceptions.
     */
    @ExceptionHandler(OAuth2ProviderDisabledException.class)
    public ResponseEntity<OAuth2ErrorResponse> handleOAuth2ProviderDisabledException(
            OAuth2ProviderDisabledException ex, HttpServletRequest request) {

        LOG.error("OAuth2 provider disabled error: {}", ex.getMessage(), ex);

        OAuth2ErrorResponse errorResponse = new OAuth2ErrorResponse(
                "oauth2_provider_disabled",
                ex.getMessage(),
                ex.getProvider(),
                ex.getErrorCode());
        errorResponse.setPath(request.getRequestURI());

        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE).body(errorResponse);
    }

    /**
     * Generate secure random state parameter.
     */
    private String generateSecureState() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    /**
     * Convert OAuth2Account to LinkedAccountDTO.
     */
    private LinkedAccountDTO convertToLinkedAccountDTO(OAuth2Account account) {
        boolean tokenExpired = account.getTokenExpiresAt() != null &&
                account.getTokenExpiresAt().isBefore(Instant.now());

        return new LinkedAccountDTO(
                account.getId(),
                account.getProvider(),
                account.getProviderUserId(),
                account.getProviderUsername(),
                account.getLinkedAt(),
                account.getLastUsedAt(),
                tokenExpired);
    }
}