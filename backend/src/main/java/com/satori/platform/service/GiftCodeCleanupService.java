package com.satori.platform.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

/**
 * Service for scheduled cleanup of gift codes.
 */
@Service
public class GiftCodeCleanupService {

    private static final Logger log = LoggerFactory.getLogger(GiftCodeCleanupService.class);

    private final GiftCodeService giftCodeService;

    public GiftCodeCleanupService(GiftCodeService giftCodeService) {
        this.giftCodeService = giftCodeService;
    }

    /**
     * Scheduled task to clean up expired gift codes.
     * Runs every hour.
     */
    @Scheduled(fixedRate = 3600000) // 1 hour = 3600000 milliseconds
    public void cleanupExpiredGiftCodes() {
        log.debug("Starting scheduled cleanup of expired gift codes");

        try {
            int expiredCount = giftCodeService.cleanupExpiredCodes();
            int usageLimitCount = giftCodeService.cleanupCodesAtUsageLimit();

            if (expiredCount > 0 || usageLimitCount > 0) {
                log.info("Gift code cleanup completed: {} expired codes, {} usage limit codes deactivated",
                        expiredCount, usageLimitCount);
            } else {
                log.debug("Gift code cleanup completed: no codes needed cleanup");
            }
        } catch (Exception e) {
            log.error("Error during gift code cleanup", e);
        }
    }

    /**
     * Scheduled task to log statistics about gift codes.
     * Runs daily at 2 AM.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void logGiftCodeStatistics() {
        log.debug("Logging gift code statistics");

        try {
            // This could be extended to provide more detailed statistics
            // For now, we'll just trigger the cleanup to ensure consistency
            cleanupExpiredGiftCodes();

            log.info("Daily gift code maintenance completed");
        } catch (Exception e) {
            log.error("Error during gift code statistics logging", e);
        }
    }
}