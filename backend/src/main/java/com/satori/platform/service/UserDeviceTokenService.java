package com.satori.platform.service;

import com.satori.platform.domain.UserProfile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;
import java.util.Map;

/**
 * Service for managing user device tokens for push notifications.
 * Uses in-memory storage for device tokens (can be enhanced with Redis later).
 */
@Service
public class UserDeviceTokenService {

    private static final Logger LOG = LoggerFactory.getLogger(UserDeviceTokenService.class);

    // In-memory storage for device tokens (replace with Redis in production)
    private final Map<Long, String> deviceTokens = new ConcurrentHashMap<>();

    public UserDeviceTokenService() {
        // Initialize with empty map
        LOG.debug("UserDeviceTokenService initialized with in-memory storage");
    }

    /**
     * Store device token for a user
     */
    public void storeDeviceToken(UserProfile user, String deviceToken) {
        if (user == null || deviceToken == null || deviceToken.trim().isEmpty()) {
            LOG.warn("Invalid user or device token provided");
            return;
        }

        try {
            deviceTokens.put(user.getId(), deviceToken);
            LOG.debug("Stored device token for user: {}", user.getUsername());
        } catch (Exception e) {
            LOG.error("Failed to store device token for user: {}", user.getUsername(), e);
        }
    }

    /**
     * Get device token for a user
     */
    public String getDeviceToken(UserProfile user) {
        if (user == null) {
            return null;
        }

        try {
            return deviceTokens.get(user.getId());
        } catch (Exception e) {
            LOG.error("Failed to retrieve device token for user: {}", user.getUsername(), e);
            return null;
        }
    }

    /**
     * Remove device token for a user (e.g., on logout)
     */
    public void removeDeviceToken(UserProfile user) {
        if (user == null) {
            return;
        }

        try {
            deviceTokens.remove(user.getId());
            LOG.debug("Removed device token for user: {}", user.getUsername());
        } catch (Exception e) {
            LOG.error("Failed to remove device token for user: {}", user.getUsername(), e);
        }
    }

    /**
     * Check if user has a valid device token
     */
    public boolean hasDeviceToken(UserProfile user) {
        String token = getDeviceToken(user);
        return token != null && !token.trim().isEmpty();
    }

    /**
     * Update device token expiry (no-op for in-memory implementation)
     */
    public void refreshTokenExpiry(UserProfile user) {
        if (user == null) {
            return;
        }

        try {
            // For in-memory implementation, this is a no-op
            // In Redis implementation, this would refresh the expiry
            LOG.debug("Refreshed device token expiry for user: {}", user.getUsername());
        } catch (Exception e) {
            LOG.error("Failed to refresh device token expiry for user: {}", user.getUsername(), e);
        }
    }
}