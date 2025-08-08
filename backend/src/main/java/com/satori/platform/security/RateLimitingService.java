package com.satori.platform.security;

import com.satori.platform.config.RateLimitingConfiguration;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service for rate limiting functionality.
 */
@Service
public class RateLimitingService {

    private final RateLimitingConfiguration config;
    private final ConcurrentHashMap<String, RateLimitInfo> rateLimitMap = new ConcurrentHashMap<>();
    private final ConcurrentHashMap<String, Instant> bannedIps = new ConcurrentHashMap<>();

    public RateLimitingService(RateLimitingConfiguration config) {
        this.config = config;
    }

    /**
     * Checks if a request is allowed based on rate limiting rules.
     */
    public boolean isRequestAllowed(String clientId, RateLimitType type) {
        // Check if IP is banned
        if (isBanned(clientId)) {
            return false;
        }

        String key = clientId + ":" + type.name();
        RateLimitInfo info = rateLimitMap.computeIfAbsent(key, k -> new RateLimitInfo());

        synchronized (info) {
            Instant now = Instant.now();

            // Reset counter if window has passed
            if (now.isAfter(info.windowStart.plusSeconds(60))) {
                info.requestCount.set(0);
                info.windowStart = now;
            }

            int limit = getLimitForType(type);

            if (info.requestCount.get() >= limit) {
                // Check for potential ban
                info.violationCount.incrementAndGet();
                if (info.violationCount.get() >= config.getMaxFailedAttempts()) {
                    banClient(clientId);
                }
                return false;
            }

            info.requestCount.incrementAndGet();
            info.lastRequest = now;
            return true;
        }
    }

    /**
     * Records a failed request for potential banning.
     */
    public void recordFailedRequest(String clientId) {
        String key = clientId + ":FAILED";
        RateLimitInfo info = rateLimitMap.computeIfAbsent(key, k -> new RateLimitInfo());

        synchronized (info) {
            Instant now = Instant.now();

            // Reset counter if window has passed
            if (now.isAfter(info.windowStart.plusSeconds(300))) { // 5-minute window for failed attempts
                info.requestCount.set(0);
                info.windowStart = now;
            }

            info.requestCount.incrementAndGet();

            if (info.requestCount.get() >= config.getMaxFailedAttempts()) {
                banClient(clientId);
            }
        }
    }

    /**
     * Checks if a client is currently banned.
     */
    public boolean isBanned(String clientId) {
        Instant banExpiry = bannedIps.get(clientId);
        if (banExpiry != null) {
            if (Instant.now().isBefore(banExpiry)) {
                return true;
            } else {
                bannedIps.remove(clientId);
            }
        }
        return false;
    }

    /**
     * Bans a client for the configured duration.
     */
    private void banClient(String clientId) {
        Instant banExpiry = Instant.now().plusSeconds(config.getBanDurationMinutes() * 60);
        bannedIps.put(clientId, banExpiry);
    }

    /**
     * Gets the rate limit for a specific type.
     */
    private int getLimitForType(RateLimitType type) {
        return switch (type) {
            case AUTH -> config.getAuthRequestsPerMinute();
            case FILE_UPLOAD -> config.getFileUploadRequestsPerMinute();
            case API -> config.getApiRequestsPerMinute();
            case QUIZ_SUBMISSION -> config.getQuizSubmissionRequestsPerMinute();
            case NOTIFICATION -> config.getNotificationRequestsPerMinute();
            case DEFAULT -> config.getDefaultRequestsPerMinute();
        };
    }

    /**
     * Gets current rate limit status for a client.
     */
    public RateLimitStatus getRateLimitStatus(String clientId, RateLimitType type) {
        if (isBanned(clientId)) {
            Instant banExpiry = bannedIps.get(clientId);
            return new RateLimitStatus(true, 0, banExpiry);
        }

        String key = clientId + ":" + type.name();
        RateLimitInfo info = rateLimitMap.get(key);

        if (info == null) {
            int limit = getLimitForType(type);
            return new RateLimitStatus(false, limit, null);
        }

        synchronized (info) {
            Instant now = Instant.now();

            // Check if window has reset
            if (now.isAfter(info.windowStart.plusSeconds(60))) {
                int limit = getLimitForType(type);
                return new RateLimitStatus(false, limit, null);
            }

            int limit = getLimitForType(type);
            int remaining = Math.max(0, limit - info.requestCount.get());
            return new RateLimitStatus(false, remaining, null);
        }
    }

    /**
     * Clears rate limit data for a client (admin function).
     */
    public void clearRateLimit(String clientId) {
        rateLimitMap.entrySet().removeIf(entry -> entry.getKey().startsWith(clientId + ":"));
        bannedIps.remove(clientId);
    }

    /**
     * Rate limit types for different operations.
     */
    public enum RateLimitType {
        DEFAULT,
        AUTH,
        FILE_UPLOAD,
        API,
        QUIZ_SUBMISSION,
        NOTIFICATION
    }

    /**
     * Internal class to track rate limit information.
     */
    private static class RateLimitInfo {
        AtomicInteger requestCount = new AtomicInteger(0);
        AtomicInteger violationCount = new AtomicInteger(0);
        Instant windowStart = Instant.now();
        Instant lastRequest = Instant.now();
    }

    /**
     * Rate limit status information.
     */
    public static class RateLimitStatus {
        private final boolean banned;
        private final int remainingRequests;
        private final Instant banExpiry;

        public RateLimitStatus(boolean banned, int remainingRequests, Instant banExpiry) {
            this.banned = banned;
            this.remainingRequests = remainingRequests;
            this.banExpiry = banExpiry;
        }

        public boolean isBanned() {
            return banned;
        }

        public int getRemainingRequests() {
            return remainingRequests;
        }

        public Instant getBanExpiry() {
            return banExpiry;
        }
    }
}