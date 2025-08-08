package com.satori.platform.service;

import com.satori.platform.domain.OAuth2Account;
import com.satori.platform.domain.User;
import com.satori.platform.domain.enumeration.OAuth2Provider;
import com.satori.platform.service.dto.OAuth2AuthenticationResult;
import com.satori.platform.service.dto.OAuth2UserProfile;

import java.util.List;
import java.util.Optional;

/**
 * Service interface for OAuth2 authentication and account management.
 */
public interface OAuth2Service {

    /**
     * Generate authorization URL for the specified OAuth2 provider.
     *
     * @param provider the OAuth2 provider
     * @param state    the state parameter for CSRF protection
     * @return the authorization URL
     */
    String generateAuthorizationUrl(OAuth2Provider provider, String state);

    /**
     * Handle OAuth2 callback and perform authentication.
     *
     * @param provider the OAuth2 provider
     * @param code     the authorization code
     * @param state    the state parameter
     * @return the authentication result
     */
    OAuth2AuthenticationResult handleCallback(OAuth2Provider provider, String code, String state);

    /**
     * Link an OAuth2 account to an existing user.
     *
     * @param user     the existing user
     * @param provider the OAuth2 provider
     * @param code     the authorization code
     * @return the linked OAuth2 account
     */
    OAuth2Account linkAccount(User user, OAuth2Provider provider, String code);

    /**
     * Unlink an OAuth2 account from a user.
     *
     * @param user     the user
     * @param provider the OAuth2 provider
     */
    void unlinkAccount(User user, OAuth2Provider provider);

    /**
     * Get all linked OAuth2 accounts for a user.
     *
     * @param user the user
     * @return list of linked OAuth2 accounts
     */
    List<OAuth2Account> getUserLinkedAccounts(User user);

    /**
     * Find user by OAuth2 provider account.
     *
     * @param provider       the OAuth2 provider
     * @param providerUserId the provider user ID
     * @return optional user
     */
    Optional<User> findUserByProviderAccount(OAuth2Provider provider, String providerUserId);

    /**
     * Refresh OAuth2 token if needed.
     *
     * @param account the OAuth2 account
     */
    void refreshTokenIfNeeded(OAuth2Account account);

    /**
     * Get user profile from OAuth2 provider.
     *
     * @param provider    the OAuth2 provider
     * @param accessToken the access token
     * @return the user profile
     */
    OAuth2UserProfile getUserProfile(OAuth2Provider provider, String accessToken);

    /**
     * Exchange authorization code for access token.
     *
     * @param provider the OAuth2 provider
     * @param code     the authorization code
     * @return the access token
     */
    String exchangeCodeForToken(OAuth2Provider provider, String code);

    /**
     * Process OAuth2 authentication from provider attributes.
     *
     * @param registrationId the OAuth2 registration ID
     * @param providerUserId the provider user ID
     * @param attributes     the OAuth2 user attributes
     * @return the authentication result
     */
    OAuth2AuthenticationResult processOAuth2Authentication(String registrationId, String providerUserId, java.util.Map<String, Object> attributes);
}