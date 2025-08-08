package com.satori.platform.service.dto;

import java.time.Instant;

/**
 * DTO for OAuth2 token validation results.
 */
public class OAuth2TokenValidationResult {

    private boolean valid;
    private boolean expired;
    private boolean needsRefresh;
    private Instant expiresAt;
    private String errorMessage;
    private long secondsUntilExpiry;

    public OAuth2TokenValidationResult() {
    }

    public OAuth2TokenValidationResult(boolean valid, boolean expired, boolean needsRefresh,
            Instant expiresAt, String errorMessage, long secondsUntilExpiry) {
        this.valid = valid;
        this.expired = expired;
        this.needsRefresh = needsRefresh;
        this.expiresAt = expiresAt;
        this.errorMessage = errorMessage;
        this.secondsUntilExpiry = secondsUntilExpiry;
    }

    public static OAuth2TokenValidationResult valid(Instant expiresAt, long secondsUntilExpiry) {
        return new OAuth2TokenValidationResult(true, false, false, expiresAt, null, secondsUntilExpiry);
    }

    public static OAuth2TokenValidationResult needsRefresh(Instant expiresAt, long secondsUntilExpiry) {
        return new OAuth2TokenValidationResult(true, false, true, expiresAt, null, secondsUntilExpiry);
    }

    public static OAuth2TokenValidationResult expired(Instant expiresAt) {
        return new OAuth2TokenValidationResult(false, true, true, expiresAt, "Token has expired", 0);
    }

    public static OAuth2TokenValidationResult invalid(String errorMessage) {
        return new OAuth2TokenValidationResult(false, false, false, null, errorMessage, 0);
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public boolean isExpired() {
        return expired;
    }

    public void setExpired(boolean expired) {
        this.expired = expired;
    }

    public boolean isNeedsRefresh() {
        return needsRefresh;
    }

    public void setNeedsRefresh(boolean needsRefresh) {
        this.needsRefresh = needsRefresh;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public long getSecondsUntilExpiry() {
        return secondsUntilExpiry;
    }

    public void setSecondsUntilExpiry(long secondsUntilExpiry) {
        this.secondsUntilExpiry = secondsUntilExpiry;
    }

    @Override
    public String toString() {
        return "OAuth2TokenValidationResult{" +
                "valid=" + valid +
                ", expired=" + expired +
                ", needsRefresh=" + needsRefresh +
                ", expiresAt=" + expiresAt +
                ", errorMessage='" + errorMessage + '\'' +
                ", secondsUntilExpiry=" + secondsUntilExpiry +
                '}';
    }
}