package com.satori.platform.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.config.OAuth2Properties;
import com.satori.platform.domain.OAuth2Account;
import com.satori.platform.domain.enumeration.OAuth2Provider;
import com.satori.platform.repository.OAuth2AccountRepository;
import com.satori.platform.service.OAuth2TokenService;
import com.satori.platform.service.dto.OAuth2TokenValidationResult;
import com.satori.platform.service.util.OAuth2TokenEncryption;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicInteger;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

/**
 * Service implementation for OAuth2 token lifecycle management.
 */
@Service
@Transactional
public class OAuth2TokenServiceImpl implements OAuth2TokenService {

    private static final Logger log = LoggerFactory.getLogger(OAuth2TokenServiceImpl.class);

    private static final int DEFAULT_REFRESH_THRESHOLD_MINUTES = 5;
    private static final int DEFAULT_CLEANUP_DAYS = 30;
    private static final int DEFAULT_TOKEN_EXPIRY_HOURS = 1;

    private final OAuth2AccountRepository oauth2AccountRepository;
    private final OAuth2TokenEncryption tokenEncryption;
    private final OAuth2Properties oauth2Properties;
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${application.oauth2.token.refresh-threshold-minutes:5}")
    private int refreshThresholdMinutes;

    @Value("${application.oauth2.token.cleanup-days:30}")
    private int cleanupDays;

    @Value("${application.oauth2.token.default-expiry-hours:1}")
    private int defaultExpiryHours;

    public OAuth2TokenServiceImpl(
        OAuth2AccountRepository oauth2AccountRepository,
        OAuth2TokenEncryption tokenEncryption,
        OAuth2Properties oauth2Properties,
        RestTemplate restTemplate,
        ObjectMapper objectMapper
    ) {
        this.oauth2AccountRepository = oauth2AccountRepository;
        this.tokenEncryption = tokenEncryption;
        this.oauth2Properties = oauth2Properties;
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    @Override
    public boolean refreshAccessToken(OAuth2Account account) {
        log.debug("Refreshing access token for account: {} with provider: {}", account.getId(), account.getProvider());

        if (account.getRefreshToken() == null || account.getRefreshToken().isEmpty()) {
            log.warn("No refresh token available for account: {}", account.getId());
            return false;
        }

        try {
            String refreshToken = tokenEncryption.decrypt(account.getRefreshToken());
            if (refreshToken == null || refreshToken.isEmpty()) {
                log.warn("Failed to decrypt refresh token for account: {}", account.getId());
                return false;
            }

            Optional<String> tokenUrl = getTokenRefreshUrl(account.getProvider());
            if (!tokenUrl.isPresent()) {
                log.warn("Token refresh not supported for provider: {}", account.getProvider());
                return false;
            }

            OAuth2Properties.ProviderConfig config = getProviderConfig(account.getProvider());
            if (config == null || !config.isEnabled()) {
                log.warn("Provider {} is not configured or disabled", account.getProvider());
                return false;
            }

            // Prepare refresh request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("client_id", config.getClientId());
            params.add("client_secret", config.getClientSecret());
            params.add("refresh_token", refreshToken);
            params.add("grant_type", "refresh_token");

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

            // Make refresh request
            ResponseEntity<String> response = restTemplate.exchange(tokenUrl.orElseThrow(), HttpMethod.POST, entity, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                return processTokenRefreshResponse(account, response.getBody());
            } else {
                log.error("Token refresh failed with status: {} for account: {}", response.getStatusCode(), account.getId());
                return false;
            }
        } catch (Exception e) {
            log.error("Error refreshing token for account: {}", account.getId(), e);
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public OAuth2TokenValidationResult validateToken(OAuth2Account account) {
        log.debug("Validating token for account: {}", account.getId());

        if (account.getAccessToken() == null || account.getAccessToken().isEmpty()) {
            return OAuth2TokenValidationResult.invalid("No access token available");
        }

        if (account.getTokenExpiresAt() == null) {
            return OAuth2TokenValidationResult.invalid("No expiration time available");
        }

        Instant now = Instant.now();
        long secondsUntilExpiry = ChronoUnit.SECONDS.between(now, account.getTokenExpiresAt());

        if (account.getTokenExpiresAt().isBefore(now)) {
            return OAuth2TokenValidationResult.expired(account.getTokenExpiresAt());
        }

        if (needsTokenRefresh(account)) {
            return OAuth2TokenValidationResult.needsRefresh(account.getTokenExpiresAt(), secondsUntilExpiry);
        }

        return OAuth2TokenValidationResult.valid(account.getTokenExpiresAt(), secondsUntilExpiry);
    }

    @Override
    @Transactional(readOnly = true)
    public boolean needsTokenRefresh(OAuth2Account account) {
        if (account.getTokenExpiresAt() == null) {
            return false;
        }

        Instant refreshThreshold = Instant.now().plus(refreshThresholdMinutes, ChronoUnit.MINUTES);
        return account.getTokenExpiresAt().isBefore(refreshThreshold);
    }

    @Override
    public boolean renewTokenIfNeeded(OAuth2Account account) {
        log.debug("Checking if token renewal is needed for account: {}", account.getId());

        OAuth2TokenValidationResult validation = validateToken(account);

        if (validation.isExpired() || validation.isNeedsRefresh()) {
            log.debug(
                "Token needs renewal for account: {}, expired: {}, needsRefresh: {}",
                account.getId(),
                validation.isExpired(),
                validation.isNeedsRefresh()
            );
            return refreshAccessToken(account);
        }

        log.debug("Token renewal not needed for account: {}", account.getId());
        return false;
    }

    @Override
    public boolean revokeTokens(OAuth2Account account) {
        log.debug("Revoking tokens for account: {} with provider: {}", account.getId(), account.getProvider());

        try {
            Optional<String> revokeUrl = getTokenRevokeUrl(account.getProvider());
            if (!revokeUrl.isPresent()) {
                log.warn("Token revocation not supported for provider: {}", account.getProvider());
                return false;
            }

            String accessToken = getDecryptedAccessToken(account);
            if (accessToken == null) {
                log.warn("No access token to revoke for account: {}", account.getId());
                return false;
            }

            OAuth2Properties.ProviderConfig config = getProviderConfig(account.getProvider());
            if (config == null) {
                log.warn("Provider {} is not configured", account.getProvider());
                return false;
            }

            // Prepare revoke request
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
            params.add("client_id", config.getClientId());
            params.add("client_secret", config.getClientSecret());
            params.add("token", accessToken);

            HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(params, headers);

            // Make revoke request
            ResponseEntity<String> response = restTemplate.exchange(revokeUrl.orElseThrow(), HttpMethod.POST, entity, String.class);

            boolean success = response.getStatusCode() == HttpStatus.OK;
            if (success) {
                log.debug("Successfully revoked tokens for account: {}", account.getId());

                // Clear tokens from database
                account.setAccessToken(null);
                account.setRefreshToken(null);
                account.setTokenExpiresAt(null);
                oauth2AccountRepository.save(account);
            } else {
                log.error("Token revocation failed with status: {} for account: {}", response.getStatusCode(), account.getId());
            }

            return success;
        } catch (Exception e) {
            log.error("Error revoking tokens for account: {}", account.getId(), e);
            return false;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<OAuth2Account> findAccountsWithExpiredTokens() {
        log.debug("Finding accounts with expired tokens");
        return oauth2AccountRepository.findAccountsWithExpiredTokens(Instant.now());
    }

    @Override
    @Transactional(readOnly = true)
    public List<OAuth2Account> findUnusedAccounts(Instant cutoffDate) {
        log.debug("Finding unused accounts older than: {}", cutoffDate);
        return oauth2AccountRepository.findUnusedAccountsOlderThan(cutoffDate);
    }

    @Override
    public int cleanupExpiredTokens() {
        log.debug("Starting cleanup of expired tokens");

        List<OAuth2Account> expiredAccounts = findAccountsWithExpiredTokens();
        AtomicInteger cleanedUp = new AtomicInteger(0);

        expiredAccounts.forEach(account -> {
            try {
                // Try to refresh token first
                if (refreshAccessToken(account)) {
                    log.debug("Successfully refreshed expired token for account: {}", account.getId());
                } else {
                    // If refresh fails, clear the tokens
                    log.debug("Failed to refresh token, clearing tokens for account: {}", account.getId());
                    account.setAccessToken(null);
                    account.setRefreshToken(null);
                    account.setTokenExpiresAt(null);
                    oauth2AccountRepository.save(account);
                    cleanedUp.incrementAndGet();
                }
            } catch (Exception e) {
                log.error("Error cleaning up expired token for account: {}", account.getId(), e);
            }
        });

        log.info("Cleaned up {} expired tokens", cleanedUp.get());
        return cleanedUp.get();
    }

    @Override
    public int cleanupUnusedAccounts(int daysOld) {
        log.debug("Starting cleanup of unused accounts older than {} days", daysOld);

        Instant cutoffDate = Instant.now().minus(daysOld, ChronoUnit.DAYS);
        List<OAuth2Account> unusedAccounts = findUnusedAccounts(cutoffDate);

        AtomicInteger cleanedUp = new AtomicInteger(0);

        unusedAccounts.forEach(account -> {
            try {
                // Revoke tokens before deletion
                revokeTokens(account);

                // Delete the account
                oauth2AccountRepository.delete(account);
                cleanedUp.incrementAndGet();

                log.debug("Cleaned up unused account: {}", account.getId());
            } catch (Exception e) {
                log.error("Error cleaning up unused account: {}", account.getId(), e);
            }
        });

        log.info("Cleaned up {} unused accounts", cleanedUp.get());
        return cleanedUp.get();
    }

    @Override
    public void updateTokenExpiration(OAuth2Account account, Instant expiresAt) {
        log.debug("Updating token expiration for account: {} to: {}", account.getId(), expiresAt);

        account.setTokenExpiresAt(expiresAt);
        account.setLastUsedAt(Instant.now());
        oauth2AccountRepository.save(account);
    }

    @Override
    public Optional<String> getTokenRefreshUrl(OAuth2Provider provider) {
        switch (provider) {
            case GOOGLE:
                return Optional.of("https://oauth2.googleapis.com/token");
            case FACEBOOK:
                return Optional.of("https://graph.facebook.com/v18.0/oauth/access_token");
            case GITHUB:
                // GitHub doesn't support refresh tokens
                return Optional.empty();
            default:
                return Optional.empty();
        }
    }

    @Override
    public void storeTokensSecurely(OAuth2Account account, String accessToken, String refreshToken, Long expiresIn) {
        log.debug("Storing tokens securely for account: {}", account.getId());

        try {
            // Encrypt and store access token
            if (accessToken != null && !accessToken.isEmpty()) {
                account.setAccessToken(tokenEncryption.encrypt(accessToken));
            }

            // Encrypt and store refresh token
            if (refreshToken != null && !refreshToken.isEmpty()) {
                account.setRefreshToken(tokenEncryption.encrypt(refreshToken));
            }

            // Set expiration time
            if (expiresIn != null && expiresIn > 0) {
                account.setTokenExpiresAt(Instant.now().plus(expiresIn, ChronoUnit.SECONDS));
            } else {
                // Default expiration
                account.setTokenExpiresAt(Instant.now().plus(defaultExpiryHours, ChronoUnit.HOURS));
            }

            account.setLastUsedAt(Instant.now());
            oauth2AccountRepository.save(account);

            log.debug("Successfully stored encrypted tokens for account: {}", account.getId());
        } catch (Exception e) {
            log.error("Error storing tokens securely for account: {}", account.getId(), e);
            throw new RuntimeException("Failed to store tokens securely", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String getDecryptedAccessToken(OAuth2Account account) {
        if (account.getAccessToken() == null || account.getAccessToken().isEmpty()) {
            return null;
        }

        try {
            return tokenEncryption.decrypt(account.getAccessToken());
        } catch (Exception e) {
            log.error("Error decrypting access token for account: {}", account.getId(), e);
            return null;
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String getDecryptedRefreshToken(OAuth2Account account) {
        if (account.getRefreshToken() == null || account.getRefreshToken().isEmpty()) {
            return null;
        }

        try {
            return tokenEncryption.decrypt(account.getRefreshToken());
        } catch (Exception e) {
            log.error("Error decrypting refresh token for account: {}", account.getId(), e);
            return null;
        }
    }

    @Override
    public int batchRefreshTokens(List<OAuth2Account> accounts) {
        log.debug("Starting batch refresh for {} accounts", accounts.size());

        AtomicInteger successCount = new AtomicInteger(0);

        // Process accounts in parallel for better performance
        List<CompletableFuture<Boolean>> futures = accounts
            .stream()
            .map(account ->
                CompletableFuture.supplyAsync(() -> {
                    try {
                        boolean success = refreshAccessToken(account);
                        if (success) {
                            successCount.incrementAndGet();
                        }
                        return success;
                    } catch (Exception e) {
                        log.error("Error in batch refresh for account: {}", account.getId(), e);
                        return false;
                    }
                })
            )
            .toList();

        // Wait for all futures to complete
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        log.info("Batch refresh completed: {}/{} tokens refreshed successfully", successCount.get(), accounts.size());

        return successCount.get();
    }

    private OAuth2Properties.ProviderConfig getProviderConfig(OAuth2Provider provider) {
        return oauth2Properties.getProviders().get(provider.name().toLowerCase());
    }

    private Optional<String> getTokenRevokeUrl(OAuth2Provider provider) {
        switch (provider) {
            case GOOGLE:
                return Optional.of("https://oauth2.googleapis.com/revoke");
            case FACEBOOK:
                return Optional.of("https://graph.facebook.com/me/permissions");
            case GITHUB:
                return Optional.of("https://api.github.com/applications/{client_id}/grant");
            default:
                return Optional.empty();
        }
    }

    private boolean processTokenRefreshResponse(OAuth2Account account, String responseBody) {
        try {
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            String newAccessToken = jsonNode.has("access_token") ? jsonNode.get("access_token").asText() : null;
            String newRefreshToken = jsonNode.has("refresh_token") ? jsonNode.get("refresh_token").asText() : null;
            Long expiresIn = jsonNode.has("expires_in") ? jsonNode.get("expires_in").asLong() : null;

            if (newAccessToken != null) {
                // Store new tokens
                account.setAccessToken(tokenEncryption.encrypt(newAccessToken));

                if (newRefreshToken != null) {
                    account.setRefreshToken(tokenEncryption.encrypt(newRefreshToken));
                }

                if (expiresIn != null && expiresIn > 0) {
                    account.setTokenExpiresAt(Instant.now().plus(expiresIn, ChronoUnit.SECONDS));
                } else {
                    account.setTokenExpiresAt(Instant.now().plus(defaultExpiryHours, ChronoUnit.HOURS));
                }

                account.setLastUsedAt(Instant.now());
                oauth2AccountRepository.save(account);

                log.debug("Successfully processed token refresh response for account: {}", account.getId());
                return true;
            } else {
                log.error("No access token in refresh response for account: {}", account.getId());
                return false;
            }
        } catch (Exception e) {
            log.error("Error processing token refresh response for account: {}", account.getId(), e);
            return false;
        }
    }
}
