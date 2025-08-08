package com.satori.platform.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.config.OAuth2Properties;
import com.satori.platform.domain.OAuth2Account;
import com.satori.platform.domain.User;
import com.satori.platform.domain.enumeration.OAuth2Provider;
import com.satori.platform.repository.OAuth2AccountRepository;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.service.OAuth2Service;
import com.satori.platform.service.OAuth2TokenService;
import com.satori.platform.service.UserService;
import com.satori.platform.service.dto.AdminUserDTO;
import com.satori.platform.service.dto.OAuth2AuthenticationResult;
import com.satori.platform.service.dto.OAuth2UserProfile;
import com.satori.platform.service.util.OAuth2TokenEncryption;
import com.satori.platform.web.rest.errors.BadRequestAlertException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

/**
 * Service implementation for OAuth2 authentication and account management.
 */
@Service
@Transactional
public class OAuth2ServiceImpl implements OAuth2Service {

    private static final Logger log = LoggerFactory.getLogger(OAuth2ServiceImpl.class);

    private final OAuth2Properties oauth2Properties;
    private final OAuth2AccountRepository oauth2AccountRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final OAuth2TokenEncryption tokenEncryption;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    private final OAuth2TokenService oauth2TokenService;

    public OAuth2ServiceImpl(
            OAuth2Properties oauth2Properties,
            OAuth2AccountRepository oauth2AccountRepository,
            UserRepository userRepository,
            UserService userService,
            OAuth2TokenEncryption tokenEncryption,
            RestTemplate restTemplate,
            ObjectMapper objectMapper,
            OAuth2TokenService oauth2TokenService) {
        this.oauth2Properties = oauth2Properties;
        this.oauth2AccountRepository = oauth2AccountRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.tokenEncryption = tokenEncryption;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
        this.oauth2TokenService = oauth2TokenService;
    }

    @Override
    public String generateAuthorizationUrl(OAuth2Provider provider, String state) {
        log.debug("Generating authorization URL for provider: {}", provider);

        OAuth2Properties.ProviderConfig config = getProviderConfig(provider);
        if (!config.isEnabled()) {
            throw new BadRequestAlertException("OAuth2 provider is disabled", "oauth2", "provider.disabled");
        }

        String authUrl = getAuthorizationUrl(provider);
        String redirectUri = oauth2Properties.getRedirectBaseUrl() + "/api/oauth2/callback/"
                + provider.name().toLowerCase();

        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(authUrl)
                .queryParam("client_id", config.getClientId())
                .queryParam("redirect_uri", redirectUri)
                .queryParam("scope", config.getScope())
                .queryParam("response_type", "code")
                .queryParam("state", state);

        // Add provider-specific parameters
        config.getAdditionalParameters().forEach(builder::queryParam);

        return builder.toUriString();
    }

    @Override
    public OAuth2AuthenticationResult handleCallback(OAuth2Provider provider, String code, String state) {
        log.debug("Handling OAuth2 callback for provider: {}", provider);

        try {
            // Exchange code for access token
            String accessToken = exchangeCodeForToken(provider, code);

            // Get user profile from provider
            OAuth2UserProfile userProfile = getUserProfile(provider, accessToken);

            // Find or create user
            Optional<User> existingUser = findUserByProviderAccount(provider, userProfile.getId());
            User user;
            boolean isNewUser = false;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                log.debug("Found existing user for OAuth2 account: {}", user.getLogin());
            } else {
                // Check if user exists by email
                Optional<User> userByEmail = userRepository.findOneByEmailIgnoreCase(userProfile.getEmail());
                if (userByEmail.isPresent()) {
                    user = userByEmail.get();
                    log.debug("Found existing user by email: {}", user.getLogin());
                } else {
                    // Create new user
                    user = createUserFromProfile(userProfile);
                    isNewUser = true;
                    log.debug("Created new user from OAuth2 profile: {}", user.getLogin());
                }
            }

            // Create or update OAuth2 account
            OAuth2Account oauth2Account = createOrUpdateOAuth2Account(user, provider, userProfile, accessToken);

            return OAuth2AuthenticationResult.builder()
                    .user(user)
                    .isNewUser(isNewUser)
                    .oauth2Account(oauth2Account)
                    .userProfile(userProfile)
                    .accountLinked(true)
                    .build();

        } catch (Exception e) {
            log.error("Error handling OAuth2 callback for provider: {}", provider, e);
            throw new BadRequestAlertException("OAuth2 authentication failed", "oauth2", "callback.failed");
        }
    }

    @Override
    public OAuth2Account linkAccount(User user, OAuth2Provider provider, String code) {
        log.debug("Linking OAuth2 account for user: {} with provider: {}", user.getLogin(), provider);

        // Check if account is already linked
        Optional<OAuth2Account> existingAccount = oauth2AccountRepository
                .findByUserAndProvider(user, provider);
        if (existingAccount.isPresent()) {
            throw new BadRequestAlertException("Account already linked", "oauth2", "account.already.linked");
        }

        try {
            // Exchange code for access token
            String accessToken = exchangeCodeForToken(provider, code);

            // Get user profile from provider
            OAuth2UserProfile userProfile = getUserProfile(provider, accessToken);

            // Check if this OAuth2 account is already linked to another user
            Optional<User> existingUser = findUserByProviderAccount(provider, userProfile.getId());
            if (existingUser.isPresent() && !existingUser.get().getId().equals(user.getId())) {
                throw new BadRequestAlertException("OAuth2 account already linked to another user", "oauth2",
                        "account.linked.other.user");
            }

            // Create OAuth2 account
            return createOrUpdateOAuth2Account(user, provider, userProfile, accessToken);

        } catch (Exception e) {
            log.error("Error linking OAuth2 account for user: {} with provider: {}", user.getLogin(), provider, e);
            throw new BadRequestAlertException("Failed to link OAuth2 account", "oauth2", "link.failed");
        }
    }

    @Override
    public void unlinkAccount(User user, OAuth2Provider provider) {
        log.debug("Unlinking OAuth2 account for user: {} with provider: {}", user.getLogin(), provider);

        Optional<OAuth2Account> oauth2Account = oauth2AccountRepository
                .findByUserAndProvider(user, provider);

        if (oauth2Account.isPresent()) {
            oauth2AccountRepository.delete(oauth2Account.get());
            log.debug("Successfully unlinked OAuth2 account for user: {} with provider: {}", user.getLogin(), provider);
        } else {
            throw new BadRequestAlertException("OAuth2 account not found", "oauth2", "account.not.found");
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<OAuth2Account> getUserLinkedAccounts(User user) {
        log.debug("Getting linked OAuth2 accounts for user: {}", user.getLogin());
        return oauth2AccountRepository.findByUserOrderByLinkedAtDesc(user);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<User> findUserByProviderAccount(OAuth2Provider provider, String providerUserId) {
        log.debug("Finding user by provider account: {} - {}", provider, providerUserId);
        return oauth2AccountRepository.findByProviderAndProviderUserId(provider, providerUserId)
                .map(OAuth2Account::getUser);
    }

    @Override
    public void refreshTokenIfNeeded(OAuth2Account account) {
        log.debug("Checking if token refresh is needed for account: {}", account.getId());

        // Delegate to OAuth2TokenService for token management
        if (oauth2TokenService != null) {
            oauth2TokenService.renewTokenIfNeeded(account);
        } else {
            // Fallback to original implementation if service is not available
            if (account.getTokenExpiresAt() != null &&
                    account.getTokenExpiresAt().isBefore(Instant.now().plus(5, ChronoUnit.MINUTES))) {

                log.debug("Token is expiring soon, attempting refresh for account: {}", account.getId());

                try {
                    String refreshToken = tokenEncryption.decrypt(account.getRefreshToken());
                    if (refreshToken != null && !refreshToken.isEmpty()) {
                        String newAccessToken = refreshAccessToken(account.getProvider(), refreshToken);

                        account.setAccessToken(tokenEncryption.encrypt(newAccessToken));
                        account.setTokenExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS)); // Default 1 hour
                        account.setLastUsedAt(Instant.now());

                        oauth2AccountRepository.save(account);
                        log.debug("Successfully refreshed token for account: {}", account.getId());
                    }
                } catch (Exception e) {
                    log.error("Failed to refresh token for account: {}", account.getId(), e);
                }
            }
        }
    }

    @Override
    public OAuth2UserProfile getUserProfile(OAuth2Provider provider, String accessToken) {
        log.debug("Getting user profile from provider: {}", provider);

        String profileUrl = getProfileUrl(provider);

        HttpHeaders headers = new HttpHeaders();
        headers.setBearerAuth(accessToken);
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    profileUrl, HttpMethod.GET, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return parseUserProfile(provider, response.getBody());
            } else {
                throw new RuntimeException("Failed to get user profile: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error getting user profile from provider: {}", provider, e);
            throw new RuntimeException("Failed to get user profile", e);
        }
    }

    @Override
    public String exchangeCodeForToken(OAuth2Provider provider, String code) {
        log.debug("Exchanging authorization code for access token with provider: {}", provider);

        OAuth2Properties.ProviderConfig config = getProviderConfig(provider);
        String tokenUrl = getTokenUrl(provider);
        String redirectUri = oauth2Properties.getRedirectBaseUrl() + "/api/oauth2/callback/"
                + provider.name().toLowerCase();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("client_id", config.getClientId());
        params.add("client_secret", config.getClientSecret());
        params.add("code", code);
        params.add("grant_type", "authorization_code");
        params.add("redirect_uri", redirectUri);

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    tokenUrl, HttpMethod.POST, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return parseAccessToken(response.getBody());
            } else {
                throw new RuntimeException("Failed to exchange code for token: " + response.getStatusCode());
            }
        } catch (Exception e) {
            log.error("Error exchanging code for token with provider: {}", provider, e);
            throw new RuntimeException("Failed to exchange code for token", e);
        }
    }

    private OAuth2Properties.ProviderConfig getProviderConfig(OAuth2Provider provider) {
        OAuth2Properties.ProviderConfig config = oauth2Properties.getProviders().get(provider.name().toLowerCase());
        if (config == null) {
            throw new BadRequestAlertException("OAuth2 provider not configured", "oauth2", "provider.not.configured");
        }
        return config;
    }

    private String getAuthorizationUrl(OAuth2Provider provider) {
        switch (provider) {
            case GOOGLE:
                return "https://accounts.google.com/o/oauth2/v2/auth";
            case FACEBOOK:
                return "https://www.facebook.com/v18.0/dialog/oauth";
            case GITHUB:
                return "https://github.com/login/oauth/authorize";
            default:
                throw new IllegalArgumentException("Unsupported OAuth2 provider: " + provider);
        }
    }

    private String getTokenUrl(OAuth2Provider provider) {
        switch (provider) {
            case GOOGLE:
                return "https://oauth2.googleapis.com/token";
            case FACEBOOK:
                return "https://graph.facebook.com/v18.0/oauth/access_token";
            case GITHUB:
                return "https://github.com/login/oauth/access_token";
            default:
                throw new IllegalArgumentException("Unsupported OAuth2 provider: " + provider);
        }
    }

    private String getProfileUrl(OAuth2Provider provider) {
        switch (provider) {
            case GOOGLE:
                return "https://www.googleapis.com/oauth2/v2/userinfo";
            case FACEBOOK:
                return "https://graph.facebook.com/me?fields=id,name,email,first_name,last_name,picture";
            case GITHUB:
                return "https://api.github.com/user";
            default:
                throw new IllegalArgumentException("Unsupported OAuth2 provider: " + provider);
        }
    }

    private String parseAccessToken(String responseBody) {
        try {
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            return jsonNode.get("access_token").asText();
        } catch (Exception e) {
            log.error("Error parsing access token from response", e);
            throw new RuntimeException("Failed to parse access token", e);
        }
    }

    private OAuth2UserProfile parseUserProfile(OAuth2Provider provider, String responseBody) {
        try {
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            switch (provider) {
                case GOOGLE:
                    return parseGoogleProfile(jsonNode);
                case FACEBOOK:
                    return parseFacebookProfile(jsonNode);
                case GITHUB:
                    return parseGitHubProfile(jsonNode);
                default:
                    throw new IllegalArgumentException("Unsupported OAuth2 provider: " + provider);
            }
        } catch (Exception e) {
            log.error("Error parsing user profile from provider: {}", provider, e);
            throw new RuntimeException("Failed to parse user profile", e);
        }
    }

    private OAuth2UserProfile parseGoogleProfile(JsonNode jsonNode) {
        return OAuth2UserProfile.builder()
                .id(jsonNode.get("id").asText())
                .email(jsonNode.has("email") ? jsonNode.get("email").asText() : null)
                .firstName(jsonNode.has("given_name") ? jsonNode.get("given_name").asText() : null)
                .lastName(jsonNode.has("family_name") ? jsonNode.get("family_name").asText() : null)
                .displayName(jsonNode.has("name") ? jsonNode.get("name").asText() : null)
                .profilePictureUrl(jsonNode.has("picture") ? jsonNode.get("picture").asText() : null)
                .locale(jsonNode.has("locale") ? jsonNode.get("locale").asText() : null)
                .build();
    }

    private OAuth2UserProfile parseFacebookProfile(JsonNode jsonNode) {
        String pictureUrl = null;
        if (jsonNode.has("picture") && jsonNode.get("picture").has("data") &&
                jsonNode.get("picture").get("data").has("url")) {
            pictureUrl = jsonNode.get("picture").get("data").get("url").asText();
        }

        return OAuth2UserProfile.builder()
                .id(jsonNode.get("id").asText())
                .email(jsonNode.has("email") ? jsonNode.get("email").asText() : null)
                .firstName(jsonNode.has("first_name") ? jsonNode.get("first_name").asText() : null)
                .lastName(jsonNode.has("last_name") ? jsonNode.get("last_name").asText() : null)
                .displayName(jsonNode.has("name") ? jsonNode.get("name").asText() : null)
                .profilePictureUrl(pictureUrl)
                .build();
    }

    private OAuth2UserProfile parseGitHubProfile(JsonNode jsonNode) {
        String fullName = jsonNode.has("name") ? jsonNode.get("name").asText() : null;
        String[] nameParts = fullName != null ? fullName.split(" ", 2) : new String[] { null, null };

        return OAuth2UserProfile.builder()
                .id(jsonNode.get("id").asText())
                .email(jsonNode.has("email") ? jsonNode.get("email").asText() : null)
                .firstName(nameParts.length > 0 ? nameParts[0] : null)
                .lastName(nameParts.length > 1 ? nameParts[1] : null)
                .displayName(jsonNode.has("login") ? jsonNode.get("login").asText() : null)
                .profilePictureUrl(jsonNode.has("avatar_url") ? jsonNode.get("avatar_url").asText() : null)
                .build();
    }

    private User createUserFromProfile(OAuth2UserProfile profile) {
        AdminUserDTO userDTO = new AdminUserDTO();
        userDTO.setLogin(generateUniqueLogin(profile));
        userDTO.setEmail(profile.getEmail());
        userDTO.setFirstName(profile.getFirstName());
        userDTO.setLastName(profile.getLastName());
        userDTO.setActivated(true);
        userDTO.setLangKey(profile.getLocale() != null ? profile.getLocale().substring(0, 2) : "en");

        return userService.createUser(userDTO);
    }

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

    private OAuth2Account createOrUpdateOAuth2Account(User user, OAuth2Provider provider,
            OAuth2UserProfile profile, String accessToken) {
        Optional<OAuth2Account> existingAccount = oauth2AccountRepository
                .findByUserAndProvider(user, provider);

        OAuth2Account account;
        if (existingAccount.isPresent()) {
            account = existingAccount.get();
        } else {
            account = new OAuth2Account();
            account.setUser(user);
            account.setProvider(provider);
            account.setProviderUserId(profile.getId());
            account.setLinkedAt(Instant.now());
        }

        account.setProviderUsername(profile.getDisplayName());

        // Use OAuth2TokenService for secure token storage if available
        if (oauth2TokenService != null) {
            oauth2TokenService.storeTokensSecurely(account, accessToken, null, 3600L); // 1 hour default
        } else {
            // Fallback to direct encryption
            account.setAccessToken(tokenEncryption.encrypt(accessToken));
            account.setTokenExpiresAt(Instant.now().plus(1, ChronoUnit.HOURS)); // Default 1 hour
            account.setLastUsedAt(Instant.now());
        }

        try {
            account.setProfileData(objectMapper.writeValueAsString(profile));
        } catch (Exception e) {
            log.warn("Failed to serialize profile data for account: {}", account.getId(), e);
        }

        return oauth2AccountRepository.save(account);
    }

    @Override
    public OAuth2AuthenticationResult processOAuth2Authentication(String registrationId, String providerUserId,
            Map<String, Object> attributes) {
        log.debug("Processing OAuth2 authentication for provider: {} with user ID: {}", registrationId, providerUserId);

        try {
            OAuth2Provider provider = OAuth2Provider.valueOf(registrationId.toUpperCase());

            // Create OAuth2UserProfile from attributes
            OAuth2UserProfile userProfile = createUserProfileFromAttributes(provider, attributes);

            // Find or create user
            Optional<User> existingUser = findUserByProviderAccount(provider, providerUserId);
            User user;
            boolean isNewUser = false;

            if (existingUser.isPresent()) {
                user = existingUser.get();
                log.debug("Found existing user for OAuth2 account: {}", user.getLogin());
            } else {
                // Check if user exists by email
                String email = (String) attributes.get("email");
                if (email != null) {
                    Optional<User> userByEmail = userRepository.findOneByEmailIgnoreCase(email);
                    if (userByEmail.isPresent()) {
                        user = userByEmail.get();
                        log.debug("Found existing user by email: {}", user.getLogin());
                    } else {
                        // Create new user
                        user = createUserFromProfile(userProfile);
                        isNewUser = true;
                        log.debug("Created new user from OAuth2 profile: {}", user.getLogin());
                    }
                } else {
                    // Create new user without email
                    user = createUserFromProfile(userProfile);
                    isNewUser = true;
                    log.debug("Created new user from OAuth2 profile without email: {}", user.getLogin());
                }
            }

            // Create or update OAuth2 account (without access token for this flow)
            OAuth2Account oauth2Account = createOrUpdateOAuth2AccountFromAttributes(user, provider, userProfile);

            return OAuth2AuthenticationResult.builder()
                    .user(user)
                    .isNewUser(isNewUser)
                    .oauth2Account(oauth2Account)
                    .userProfile(userProfile)
                    .accountLinked(true)
                    .build();

        } catch (Exception e) {
            log.error("Error processing OAuth2 authentication for provider: {} with user ID: {}",
                    registrationId, providerUserId, e);
            throw new RuntimeException("OAuth2 authentication processing failed", e);
        }
    }

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

    private OAuth2Account createOrUpdateOAuth2AccountFromAttributes(User user, OAuth2Provider provider,
            OAuth2UserProfile profile) {
        Optional<OAuth2Account> existingAccount = oauth2AccountRepository
                .findByUserAndProvider(user, provider);

        OAuth2Account account;
        if (existingAccount.isPresent()) {
            account = existingAccount.get();
        } else {
            account = new OAuth2Account();
            account.setUser(user);
            account.setProvider(provider);
            account.setProviderUserId(profile.getId());
            account.setLinkedAt(Instant.now());
        }

        account.setProviderUsername(profile.getDisplayName());
        account.setLastUsedAt(Instant.now());

        try {
            account.setProfileData(objectMapper.writeValueAsString(profile));
        } catch (Exception e) {
            log.warn("Failed to serialize profile data for account: {}", account.getId(), e);
        }

        return oauth2AccountRepository.save(account);
    }

    private String refreshAccessToken(OAuth2Provider provider, String refreshToken) {
        // Implementation would depend on provider-specific refresh token flow
        // For now, return null to indicate refresh is not supported
        log.warn("Token refresh not implemented for provider: {}", provider);
        return null;
    }
}