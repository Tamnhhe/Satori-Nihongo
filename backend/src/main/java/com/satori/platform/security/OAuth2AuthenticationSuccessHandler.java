package com.satori.platform.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.domain.OAuth2Account;
import com.satori.platform.domain.User;
import com.satori.platform.domain.enumeration.AuditAction;
import com.satori.platform.domain.enumeration.OAuth2Provider;
import com.satori.platform.service.AuditLogService;
import com.satori.platform.service.JWTTokenService;
import com.satori.platform.service.OAuth2Service;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.service.UserService;
import com.satori.platform.service.dto.AdminUserDTO;
import com.satori.platform.service.dto.JWTToken;
import com.satori.platform.service.dto.OAuth2AuthenticationResult;
import com.satori.platform.service.dto.OAuth2UserProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Map;

/**
 * OAuth2 authentication success handler that processes successful OAuth2
 * authentication,
 * handles user account creation and linking, and returns a JWT token for the
 * authenticated user.
 */
@Component
public class OAuth2AuthenticationSuccessHandler implements AuthenticationSuccessHandler {

    private static final Logger log = LoggerFactory.getLogger(OAuth2AuthenticationSuccessHandler.class);

    private final OAuth2Service oAuth2Service;
    private final JWTTokenService jwtTokenService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;
    private final ObjectMapper objectMapper;

    public OAuth2AuthenticationSuccessHandler(
            OAuth2Service oAuth2Service,
            JWTTokenService jwtTokenService,
            UserService userService,
            UserRepository userRepository,
            AuditLogService auditLogService,
            ObjectMapper objectMapper) {
        this.oAuth2Service = oAuth2Service;
        this.jwtTokenService = jwtTokenService;
        this.userService = userService;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
        this.objectMapper = objectMapper;
    }

    @Override
    public void onAuthenticationSuccess(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException, ServletException {

        log.debug("OAuth2 authentication successful for user: {}", authentication.getName());

        try {
            if (authentication instanceof OAuth2AuthenticationToken oAuth2Token) {
                OAuth2User oAuth2User = oAuth2Token.getPrincipal();
                String registrationId = oAuth2Token.getAuthorizedClientRegistrationId();
                OAuth2Provider provider = OAuth2Provider.valueOf(registrationId.toUpperCase());

                // Extract user information from OAuth2 provider
                Map<String, Object> attributes = oAuth2User.getAttributes();
                String providerUserId = extractProviderUserId(registrationId, attributes);

                // Process OAuth2 authentication (find or create user account)
                OAuth2AuthenticationResult authResult = processOAuth2Authentication(
                        provider, providerUserId, attributes);

                User user = authResult.getUser();
                String jwtToken = jwtTokenService.createToken(user);

                // Log successful authentication event
                logAuthenticationSuccess(user, provider, authResult);

                // Create response
                JWTToken tokenResponse = new JWTToken(jwtToken);

                // Set response headers
                response.setContentType(MediaType.APPLICATION_JSON_VALUE);
                response.setStatus(HttpServletResponse.SC_OK);

                // Write JSON response
                response.getWriter().write(objectMapper.writeValueAsString(tokenResponse));
                response.getWriter().flush();

                log.info("OAuth2 authentication completed successfully for user: {} (provider: {})",
                        user.getLogin(), registrationId);

            } else {
                log.error("Unexpected authentication type: {}", authentication.getClass().getSimpleName());
                auditLogService.logFailedOperation(
                        AuditAction.LOGIN,
                        "OAUTH2_AUTH",
                        null,
                        "Invalid authentication type",
                        "Unexpected authentication type: " + authentication.getClass().getSimpleName());
                response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                        "Invalid authentication type");
            }

        } catch (Exception e) {
            log.error("Error processing OAuth2 authentication success", e);
            auditLogService.logFailedOperation(
                    AuditAction.LOGIN,
                    "OAUTH2_AUTH",
                    null,
                    "OAuth2 authentication processing failed",
                    e.getMessage());
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR,
                    "Authentication processing failed");
        }
    }

    /**
     * Process OAuth2 authentication by finding or creating user account and linking
     * OAuth2 account.
     */
    private OAuth2AuthenticationResult processOAuth2Authentication(
            OAuth2Provider provider, String providerUserId, Map<String, Object> attributes) {

        log.debug("Processing OAuth2 authentication for provider: {} with user ID: {}", provider, providerUserId);

        // Create OAuth2UserProfile from attributes
        OAuth2UserProfile userProfile = createUserProfileFromAttributes(provider, attributes);

        // Find existing user by OAuth2 account
        User user = oAuth2Service.findUserByProviderAccount(provider, providerUserId).orElse(null);
        boolean isNewUser = false;
        boolean accountLinked = false;

        if (user != null) {
            // Existing user with linked OAuth2 account
            log.debug("Found existing user with linked OAuth2 account: {}", user.getLogin());
        } else {
            // Check if user exists by email for account linking
            String email = userProfile.getEmail();
            if (email != null) {
                user = userRepository.findOneByEmailIgnoreCase(email).orElse(null);
                if (user != null) {
                    // Link OAuth2 account to existing user
                    log.debug("Linking OAuth2 account to existing user: {}", user.getLogin());
                    accountLinked = true;
                } else {
                    // Create new user account
                    user = createUserFromProfile(userProfile);
                    isNewUser = true;
                    accountLinked = true;
                    log.debug("Created new user from OAuth2 profile: {}", user.getLogin());
                }
            } else {
                // Create new user without email
                user = createUserFromProfile(userProfile);
                isNewUser = true;
                accountLinked = true;
                log.debug("Created new user from OAuth2 profile without email: {}", user.getLogin());
            }
        }

        // Create or update OAuth2 account
        OAuth2Account oauth2Account = createOrUpdateOAuth2Account(user, provider, userProfile);

        return OAuth2AuthenticationResult.builder()
                .user(user)
                .isNewUser(isNewUser)
                .oauth2Account(oauth2Account)
                .userProfile(userProfile)
                .accountLinked(accountLinked)
                .build();
    }

    /**
     * Create OAuth2UserProfile from provider attributes.
     */
    private OAuth2UserProfile createUserProfileFromAttributes(OAuth2Provider provider, Map<String, Object> attributes) {
        switch (provider) {
            case GOOGLE:
                return OAuth2UserProfile.builder()
                        .id((String) attributes.get("sub"))
                        .email((String) attributes.get("email"))
                        .firstName((String) attributes.get("given_name"))
                        .lastName((String) attributes.get("family_name"))
                        .displayName((String) attributes.get("name"))
                        .profilePictureUrl((String) attributes.get("picture"))
                        .locale((String) attributes.get("locale"))
                        .build();
            case FACEBOOK:
                return OAuth2UserProfile.builder()
                        .id((String) attributes.get("id"))
                        .email((String) attributes.get("email"))
                        .firstName((String) attributes.get("first_name"))
                        .lastName((String) attributes.get("last_name"))
                        .displayName((String) attributes.get("name"))
                        .profilePictureUrl((String) attributes.get("picture"))
                        .build();
            case GITHUB:
                String fullName = (String) attributes.get("name");
                String[] nameParts = fullName != null ? fullName.split(" ", 2) : new String[] { null, null };
                return OAuth2UserProfile.builder()
                        .id(String.valueOf(attributes.get("id")))
                        .email((String) attributes.get("email"))
                        .firstName(nameParts.length > 0 ? nameParts[0] : null)
                        .lastName(nameParts.length > 1 ? nameParts[1] : null)
                        .displayName((String) attributes.get("login"))
                        .profilePictureUrl((String) attributes.get("avatar_url"))
                        .build();
            default:
                throw new IllegalArgumentException("Unsupported OAuth2 provider: " + provider);
        }
    }

    /**
     * Create new user from OAuth2 profile.
     */
    private User createUserFromProfile(OAuth2UserProfile profile) {
        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setLogin(generateUniqueLogin(profile));
        userDTO.setEmail(profile.getEmail());
        userDTO.setFirstName(profile.getFirstName());
        userDTO.setLastName(profile.getLastName());
        userDTO.setActivated(true);
        userDTO.setLangKey(profile.getLocale() != null ? profile.getLocale().substring(0, 2) : "en");

        User user = userService.createUser(userDTO);

        // Update user with OAuth2 registration flag and profile picture
        user.setOauth2Registration(true);
        if (profile.getProfilePictureUrl() != null) {
            user.setProfilePictureUrl(profile.getProfilePictureUrl());
        }

        // Save the updated user
        return userRepository.save(user);
    }

    /**
     * Generate unique login from OAuth2 profile.
     */
    private String generateUniqueLogin(OAuth2UserProfile profile) {
        String baseLogin = profile.getEmail() != null ? profile.getEmail().split("@")[0]
                : profile.getDisplayName() != null ? profile.getDisplayName().toLowerCase().replaceAll("[^a-z0-9]", "")
                        : "user";

        String login = baseLogin;
        int counter = 1;

        while (userRepository.findOneByLogin(login.toLowerCase()).isPresent()) {
            login = baseLogin + counter++;
        }

        return login.toLowerCase();
    }

    /**
     * Create or update OAuth2 account for user.
     */
    private OAuth2Account createOrUpdateOAuth2Account(User user, OAuth2Provider provider, OAuth2UserProfile profile) {
        // Use OAuth2Service to handle account creation/update
        return oAuth2Service.processOAuth2Authentication(
                provider.name().toLowerCase(), profile.getId(),
                Map.of(
                        "email", profile.getEmail() != null ? profile.getEmail() : "",
                        "name", profile.getDisplayName() != null ? profile.getDisplayName() : "",
                        "given_name", profile.getFirstName() != null ? profile.getFirstName() : "",
                        "family_name", profile.getLastName() != null ? profile.getLastName() : "",
                        "picture", profile.getProfilePictureUrl() != null ? profile.getProfilePictureUrl() : "",
                        "locale", profile.getLocale() != null ? profile.getLocale() : ""))
                .getOauth2Account();
    }

    /**
     * Log successful OAuth2 authentication event.
     */
    private void logAuthenticationSuccess(User user, OAuth2Provider provider, OAuth2AuthenticationResult authResult) {
        String description;
        if (authResult.isNewUser()) {
            description = String.format("New user account created via %s OAuth2 authentication", provider.name());
            auditLogService.logAuditEvent(
                    AuditAction.CREATE,
                    "USER",
                    user.getId(),
                    description);
        } else if (authResult.isAccountLinked()) {
            description = String.format("%s OAuth2 account linked to existing user", provider.name());
            auditLogService.logAuditEvent(
                    AuditAction.UPDATE,
                    "OAUTH2_ACCOUNT",
                    authResult.getOauth2Account().getId(),
                    description);
        }

        // Log successful login
        auditLogService.logAuditEvent(
                AuditAction.LOGIN,
                "OAUTH2_AUTH",
                user.getId(),
                String.format("Successful OAuth2 authentication via %s", provider.name()));
    }

    /**
     * Extract provider-specific user ID from OAuth2 attributes.
     */
    private String extractProviderUserId(String registrationId, Map<String, Object> attributes) {
        return switch (registrationId.toLowerCase()) {
            case "google" -> (String) attributes.get("sub");
            case "facebook" -> (String) attributes.get("id");
            case "github" -> String.valueOf(attributes.get("id"));
            default -> throw new IllegalArgumentException("Unsupported OAuth2 provider: " + registrationId);
        };
    }
}