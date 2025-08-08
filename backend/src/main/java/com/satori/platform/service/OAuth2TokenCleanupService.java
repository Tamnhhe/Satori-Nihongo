package com.satori.platform.service;

import com.satori.platform.domain.OAuth2Account;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service for scheduled OAuth2 token cleanup and maintenance tasks.
 */
@Service
public class OAuth2TokenCleanupService {

    private static final Logger log = LoggerFactory.getLogger(OAuth2TokenCleanupService.class);

    private final OAuth2TokenService oauth2TokenService;

    @Value("${application.oauth2.cleanup.enabled:true}")
    private boolean cleanupEnabled;

    @Value("${application.oauth2.cleanup.unused-account-days:30}")
    private int unusedAccountDays;

    @Value("${application.oauth2.cleanup.batch-size:100}")
    private int batchSize;

    public OAuth2TokenCleanupService(OAuth2TokenService oauth2TokenService) {
        this.oauth2TokenService = oauth2TokenService;
    }

    /**
     * Scheduled task to clean up expired tokens.
     * Runs every hour to refresh or clean expired tokens.
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void cleanupExpiredTokens() {
        if (!cleanupEnabled) {
            log.debug("OAuth2 token cleanup is disabled");
            return;
        }

        log.info("Starting scheduled cleanup of expired OAuth2 tokens");

        try {
            int cleanedUp = oauth2TokenService.cleanupExpiredTokens();
            log.info("Scheduled cleanup completed: {} expired tokens processed", cleanedUp);
        } catch (Exception e) {
            log.error("Error during scheduled token cleanup", e);
        }
    }

    /**
     * Scheduled task to clean up unused accounts.
     * Runs daily to remove accounts that haven't been used for a specified period.
     */
    @Scheduled(cron = "0 0 2 * * ?") // Daily at 2 AM
    public void cleanupUnusedAccounts() {
        if (!cleanupEnabled) {
            log.debug("OAuth2 account cleanup is disabled");
            return;
        }

        log.info("Starting scheduled cleanup of unused OAuth2 accounts");

        try {
            int cleanedUp = oauth2TokenService.cleanupUnusedAccounts(unusedAccountDays);
            log.info("Scheduled account cleanup completed: {} unused accounts removed", cleanedUp);
        } catch (Exception e) {
            log.error("Error during scheduled account cleanup", e);
        }
    }

    /**
     * Scheduled task to proactively refresh tokens that are about to expire.
     * Runs every 30 minutes to refresh tokens before they expire.
     */
    @Scheduled(fixedRate = 1800000) // 30 minutes
    public void proactiveTokenRefresh() {
        if (!cleanupEnabled) {
            log.debug("OAuth2 proactive token refresh is disabled");
            return;
        }

        log.debug("Starting proactive OAuth2 token refresh");

        try {
            List<OAuth2Account> accountsNeedingRefresh = oauth2TokenService.findAccountsWithExpiredTokens();

            if (accountsNeedingRefresh.isEmpty()) {
                log.debug("No tokens need proactive refresh");
                return;
            }

            // Process in batches to avoid overwhelming the system
            int totalAccounts = accountsNeedingRefresh.size();
            int processed = 0;
            int successfulRefreshes = 0;

            for (int i = 0; i < totalAccounts; i += batchSize) {
                int endIndex = Math.min(i + batchSize, totalAccounts);
                List<OAuth2Account> batch = accountsNeedingRefresh.subList(i, endIndex);

                int batchSuccess = oauth2TokenService.batchRefreshTokens(batch);
                successfulRefreshes += batchSuccess;
                processed += batch.size();

                log.debug("Processed batch {}/{}: {} successful refreshes out of {} accounts",
                        (i / batchSize) + 1, (totalAccounts + batchSize - 1) / batchSize,
                        batchSuccess, batch.size());
            }

            log.info("Proactive token refresh completed: {}/{} tokens refreshed successfully",
                    successfulRefreshes, processed);

        } catch (Exception e) {
            log.error("Error during proactive token refresh", e);
        }
    }

    /**
     * Manual cleanup method that can be called on-demand.
     * 
     * @return summary of cleanup operations
     */
    public String performManualCleanup() {
        log.info("Starting manual OAuth2 cleanup");

        try {
            int expiredCleaned = oauth2TokenService.cleanupExpiredTokens();
            int unusedCleaned = oauth2TokenService.cleanupUnusedAccounts(unusedAccountDays);

            String summary = String.format(
                    "Manual cleanup completed: %d expired tokens processed, %d unused accounts removed",
                    expiredCleaned, unusedCleaned);

            log.info(summary);
            return summary;

        } catch (Exception e) {
            log.error("Error during manual cleanup", e);
            return "Manual cleanup failed: " + e.getMessage();
        }
    }

    /**
     * Get cleanup statistics.
     * 
     * @return cleanup statistics as a formatted string
     */
    public String getCleanupStatistics() {
        try {
            List<OAuth2Account> expiredAccounts = oauth2TokenService.findAccountsWithExpiredTokens();
            List<OAuth2Account> unusedAccounts = oauth2TokenService.findUnusedAccounts(
                    java.time.Instant.now().minus(unusedAccountDays, java.time.temporal.ChronoUnit.DAYS));

            return String.format(
                    "OAuth2 Cleanup Statistics: %d accounts with expired tokens, %d unused accounts (older than %d days)",
                    expiredAccounts.size(), unusedAccounts.size(), unusedAccountDays);

        } catch (Exception e) {
            log.error("Error getting cleanup statistics", e);
            return "Error retrieving cleanup statistics: " + e.getMessage();
        }
    }

    /**
     * Enable or disable cleanup operations.
     * 
     * @param enabled true to enable cleanup, false to disable
     */
    public void setCleanupEnabled(boolean enabled) {
        this.cleanupEnabled = enabled;
        log.info("OAuth2 cleanup operations {}", enabled ? "enabled" : "disabled");
    }

    /**
     * Check if cleanup is enabled.
     * 
     * @return true if cleanup is enabled, false otherwise
     */
    public boolean isCleanupEnabled() {
        return cleanupEnabled;
    }
}