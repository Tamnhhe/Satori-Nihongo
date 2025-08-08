package com.satori.platform.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.oauth2.client.registration.ClientRegistration;
import org.springframework.security.oauth2.client.registration.ClientRegistrationRepository;
import org.springframework.security.oauth2.client.registration.InMemoryClientRegistrationRepository;
import org.springframework.security.oauth2.client.web.OAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.web.HttpSessionOAuth2AuthorizedClientRepository;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProvider;
import org.springframework.security.oauth2.client.OAuth2AuthorizedClientProviderBuilder;
import org.springframework.security.oauth2.client.web.DefaultOAuth2AuthorizedClientManager;
import org.springframework.security.oauth2.core.AuthorizationGrantType;
import org.springframework.security.oauth2.core.ClientAuthenticationMethod;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * OAuth2 configuration for client registrations and authorized client
 * management.
 */
@Configuration
@EnableConfigurationProperties(OAuth2Properties.class)
public class OAuth2Configuration {

    private final OAuth2Properties oAuth2Properties;

    public OAuth2Configuration(OAuth2Properties oAuth2Properties) {
        this.oAuth2Properties = oAuth2Properties;
    }

    /**
     * Creates a client registration repository with configured OAuth2 providers.
     */
    @Bean
    public ClientRegistrationRepository clientRegistrationRepository() {
        List<ClientRegistration> registrations = new ArrayList<>();

        for (Map.Entry<String, OAuth2Properties.ProviderConfig> entry : oAuth2Properties.getProviders().entrySet()) {
            String providerId = entry.getKey();
            OAuth2Properties.ProviderConfig config = entry.getValue();

            if (config.isEnabled() && StringUtils.hasText(config.getClientId())
                    && StringUtils.hasText(config.getClientSecret())) {
                ClientRegistration registration = createClientRegistration(providerId, config);
                registrations.add(registration);
            }
        }

        // If no registrations are configured, create a dummy one to prevent startup
        // failure
        if (registrations.isEmpty()) {
            ClientRegistration dummyRegistration = ClientRegistration.withRegistrationId("dummy")
                    .clientId("dummy")
                    .clientSecret("dummy")
                    .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                    .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                    .redirectUri("{baseUrl}/api/oauth2/callback/dummy")
                    .scope("dummy")
                    .authorizationUri("https://example.com/oauth/authorize")
                    .tokenUri("https://example.com/oauth/token")
                    .userInfoUri("https://example.com/oauth/userinfo")
                    .userNameAttributeName("id")
                    .clientName("Dummy")
                    .build();
            registrations.add(dummyRegistration);
        }

        return new InMemoryClientRegistrationRepository(registrations);
    }

    /**
     * Creates an OAuth2 authorized client repository for storing authorized
     * clients.
     */
    @Bean
    public OAuth2AuthorizedClientRepository authorizedClientRepository() {
        return new HttpSessionOAuth2AuthorizedClientRepository();
    }

    /**
     * Creates an OAuth2 authorized client manager for managing authorized clients.
     */
    @Bean
    public OAuth2AuthorizedClientManager authorizedClientManager(
            ClientRegistrationRepository clientRegistrationRepository,
            OAuth2AuthorizedClientRepository authorizedClientRepository) {

        OAuth2AuthorizedClientProvider authorizedClientProvider = OAuth2AuthorizedClientProviderBuilder.builder()
                .authorizationCode()
                .refreshToken()
                .build();

        DefaultOAuth2AuthorizedClientManager authorizedClientManager = new DefaultOAuth2AuthorizedClientManager(
                clientRegistrationRepository, authorizedClientRepository);
        authorizedClientManager.setAuthorizedClientProvider(authorizedClientProvider);

        return authorizedClientManager;
    }

    /**
     * Creates a RestTemplate for OAuth2 HTTP requests.
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    /**
     * Creates a client registration for a specific OAuth2 provider.
     */
    private ClientRegistration createClientRegistration(String providerId, OAuth2Properties.ProviderConfig config) {
        ClientRegistration.Builder builder = ClientRegistration.withRegistrationId(providerId)
                .clientId(config.getClientId())
                .clientSecret(config.getClientSecret())
                .clientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC)
                .authorizationGrantType(AuthorizationGrantType.AUTHORIZATION_CODE)
                .redirectUri("{baseUrl}/api/oauth2/callback/" + providerId);

        // Set provider-specific configurations
        switch (providerId.toLowerCase()) {
            case "google":
                builder
                        .scope("openid", "profile", "email")
                        .authorizationUri("https://accounts.google.com/o/oauth2/v2/auth")
                        .tokenUri("https://www.googleapis.com/oauth2/v4/token")
                        .userInfoUri("https://www.googleapis.com/oauth2/v3/userinfo")
                        .userNameAttributeName("sub")
                        .jwkSetUri("https://www.googleapis.com/oauth2/v3/certs")
                        .clientName("Google");
                break;
            case "facebook":
                builder
                        .scope("email", "public_profile")
                        .authorizationUri("https://www.facebook.com/v18.0/dialog/oauth")
                        .tokenUri("https://graph.facebook.com/v18.0/oauth/access_token")
                        .userInfoUri("https://graph.facebook.com/me?fields=id,name,email,picture")
                        .userNameAttributeName("id")
                        .clientName("Facebook");
                break;
            case "github":
                builder
                        .scope("user:email", "read:user")
                        .authorizationUri("https://github.com/login/oauth/authorize")
                        .tokenUri("https://github.com/login/oauth/access_token")
                        .userInfoUri("https://api.github.com/user")
                        .userNameAttributeName("id")
                        .clientName("GitHub");
                break;
            default:
                throw new IllegalArgumentException("Unsupported OAuth2 provider: " + providerId);
        }

        // Override with custom scope if provided
        if (StringUtils.hasText(config.getScope())) {
            String[] scopes = config.getScope().split(",");
            builder.scope(scopes);
        }

        return builder.build();
    }
}