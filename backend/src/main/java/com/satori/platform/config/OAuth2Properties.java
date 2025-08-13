package com.satori.platform.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.HashMap;
import java.util.Map;

/**
 * Configuration properties for OAuth2 providers.
 */
@ConfigurationProperties(prefix = "oauth2")
public class OAuth2Properties {

    private Map<String, ProviderConfig> providers = new HashMap<>();
    private String redirectBaseUrl;
    private boolean enabled = true;
    private EncryptionConfig encryption = new EncryptionConfig();
    private TokenConfig token = new TokenConfig();
    private CleanupConfig cleanup = new CleanupConfig();

    public Map<String, ProviderConfig> getProviders() {
        return providers;
    }

    public void setProviders(Map<String, ProviderConfig> providers) {
        this.providers = providers;
    }

    public String getRedirectBaseUrl() {
        return redirectBaseUrl;
    }

    public void setRedirectBaseUrl(String redirectBaseUrl) {
        this.redirectBaseUrl = redirectBaseUrl;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public EncryptionConfig getEncryption() {
        return encryption;
    }

    public void setEncryption(EncryptionConfig encryption) {
        this.encryption = encryption;
    }

    public TokenConfig getToken() {
        return token;
    }

    public void setToken(TokenConfig token) {
        this.token = token;
    }

    public CleanupConfig getCleanup() {
        return cleanup;
    }

    public void setCleanup(CleanupConfig cleanup) {
        this.cleanup = cleanup;
    }

    /**
     * Configuration for individual OAuth2 providers.
     */
    public static class ProviderConfig {
        private String clientId;
        private String clientSecret;
        private String scope;
        private boolean enabled = true;
        private Map<String, String> additionalParameters = new HashMap<>();

        public String getClientId() {
            return clientId;
        }

        public void setClientId(String clientId) {
            this.clientId = clientId;
        }

        public String getClientSecret() {
            return clientSecret;
        }

        public void setClientSecret(String clientSecret) {
            this.clientSecret = clientSecret;
        }

        public String getScope() {
            return scope;
        }

        public void setScope(String scope) {
            this.scope = scope;
        }

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public Map<String, String> getAdditionalParameters() {
            return additionalParameters;
        }

        public void setAdditionalParameters(Map<String, String> additionalParameters) {
            this.additionalParameters = additionalParameters;
        }
    }

    /**
     * Configuration for OAuth2 token encryption.
     */
    public static class EncryptionConfig {
        private String key;

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }
    }

    /**
     * Configuration for OAuth2 token management.
     */
    public static class TokenConfig {
        private int refreshThresholdMinutes = 5;
        private int defaultExpiryHours = 1;
        private int cleanupDays = 30;

        public int getRefreshThresholdMinutes() {
            return refreshThresholdMinutes;
        }

        public void setRefreshThresholdMinutes(int refreshThresholdMinutes) {
            this.refreshThresholdMinutes = refreshThresholdMinutes;
        }

        public int getDefaultExpiryHours() {
            return defaultExpiryHours;
        }

        public void setDefaultExpiryHours(int defaultExpiryHours) {
            this.defaultExpiryHours = defaultExpiryHours;
        }

        public int getCleanupDays() {
            return cleanupDays;
        }

        public void setCleanupDays(int cleanupDays) {
            this.cleanupDays = cleanupDays;
        }
    }

    /**
     * Configuration for OAuth2 cleanup operations.
     */
    public static class CleanupConfig {
        private boolean enabled = true;
        private int unusedAccountDays = 30;
        private int batchSize = 100;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public int getUnusedAccountDays() {
            return unusedAccountDays;
        }

        public void setUnusedAccountDays(int unusedAccountDays) {
            this.unusedAccountDays = unusedAccountDays;
        }

        public int getBatchSize() {
            return batchSize;
        }

        public void setBatchSize(int batchSize) {
            this.batchSize = batchSize;
        }
    }
}