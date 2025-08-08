package com.satori.platform.service;

import com.satori.platform.domain.OAuth2Account;
import com.satori.platform.domain.enumeration.OAuth2Provider;
import com.satori.platform.service.dto.OAuth2TokenValidationResult;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Service interface for OAuth2 token lifecycle management.
 * Handles token refresh, validation, renewal, and cleanup operations.
 */
public interface OAuth2TokenService {

    /**
     * Refresh an OAuth2 access token using the refresh token.
     *
     * @param account the OAuth2 account with tokens to refresh
     * @return true if token was successfully refreshed, false otherwise
     */
    boolean refreshAccessToken(OAuth2Account account);

    /**
     * Validate if an OAuth2 token is still valid and not expired.
     *
     * @param account the OAuth2 account to validate
     * @return validation result with token status
     */
    OAuth2TokenValidationResult validateToken(OAuth2Account account);

    /**
     * Check if a token needs to be refreshed (expires within threshold).
     *
     * @param account the OAuth2 account to check
     * @return true if token needs refresh, false otherwise
     */
    boolean needsTokenRefresh(OAuth2Account account);

    /**
     * Renew token if it's expired or about to expire.
     *
     * @param account the OAuth2 account
     * @return true if token was renewed, false if not needed or failed
     */
    boolean renewTokenIfNeeded(OAuth2Account account);

    /**
     * Revoke OAuth2 tokens with the provider.
     *
     * @param account the OAuth2 account
     * @return true if tokens were successfully revoked, false otherwise
     */
    boolean revokeTokens(OAuth2Account account);

    /**
     * Find all accounts with expired tokens.
     *
     * @return list of accounts with expired tokens
     */
    List<OAuth2Account> findAccountsWithExpiredTokens();

    /**
     * Find all accounts that haven't been used for a specified period.
     *
     * @param cutoffDate the cutoff date for unused accounts
     * @return list of unused accounts
     */
    List<OAuth2Account> findUnusedAccounts(Instant cutoffDate);

    /**
     * Cleanup expired and unused tokens.
     * This method should be called periodically to maintain token hygiene.
     *
     * @return number of accounts cleaned up
     */
    int cleanupExpiredTokens();

    /**
     * Cleanup unused accounts older than specified days.
     *
     * @param daysOld number of days to consider an account unused
     * @return number of accounts cleaned up
     */
    int cleanupUnusedAccounts(int daysOld);

    /**
     * Update token expiration time for an account.
     *
     * @param account   the OAuth2 account
     * @param expiresAt the new expiration time
     */
    void updateTokenExpiration(OAuth2Account account, Instant expiresAt);

    /**
     * Get token refresh URL for a specific provider.
     *
     * @param provider the OAuth2 provider
     * @return the token refresh URL
     */
    Optional<String> getTokenRefreshUrl(OAuth2Provider provider);

    /**
     * Encrypt and store tokens securely.
     *
     * @param account      the OAuth2 account
     * @param accessToken  the access token to encrypt and store
     * @param refreshToken the refresh token to encrypt and store (optional)
     * @param expiresIn    the token expiration time in seconds
     */
    void storeTokensSecurely(OAuth2Account account, String accessToken, String refreshToken, Long expiresIn);

    /**
     * Get decrypted access token for an account.
     *
     * @param account the OAuth2 account
     * @return the decrypted access token, or null if not available
     */
    String getDecryptedAccessToken(OAuth2Account account);

    /**
     * Get decrypted refresh token for an account.
     *
     * @param account the OAuth2 account
     * @return the decrypted refresh token, or null if not available
     */
    String getDecryptedRefreshToken(OAuth2Account account);

    /**
     * Batch refresh tokens for multiple accounts.
     *
     * @param accounts the list of OAuth2 accounts to refresh
     * @return number of successfully refreshed tokens
     */
    int batchRefreshTokens(List<OAuth2Account> accounts);
}