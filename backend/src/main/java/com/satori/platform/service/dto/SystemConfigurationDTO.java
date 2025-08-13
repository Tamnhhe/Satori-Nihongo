package com.satori.platform.service.dto;

import java.util.Map;

/**
 * DTO for system configuration management.
 */
public class SystemConfigurationDTO {

    private SecurityConfigurationDTO security;
    private OAuth2ConfigurationDTO oauth2;
    private Map<String, FeatureToggleDTO> featureToggles;
    private Map<String, String> systemParameters;

    public SecurityConfigurationDTO getSecurity() {
        return security;
    }

    public void setSecurity(SecurityConfigurationDTO security) {
        this.security = security;
    }

    public OAuth2ConfigurationDTO getOauth2() {
        return oauth2;
    }

    public void setOauth2(OAuth2ConfigurationDTO oauth2) {
        this.oauth2 = oauth2;
    }

    public Map<String, FeatureToggleDTO> getFeatureToggles() {
        return featureToggles;
    }

    public void setFeatureToggles(Map<String, FeatureToggleDTO> featureToggles) {
        this.featureToggles = featureToggles;
    }

    public Map<String, String> getSystemParameters() {
        return systemParameters;
    }

    public void setSystemParameters(Map<String, String> systemParameters) {
        this.systemParameters = systemParameters;
    }

    /**
     * DTO for security configuration settings.
     */
    public static class SecurityConfigurationDTO {
        private String contentSecurityPolicy;
        private int sessionTimeoutMinutes;
        private boolean requireHttps;
        private boolean enableCsrfProtection;
        private int maxLoginAttempts;
        private int lockoutDurationMinutes;

        public String getContentSecurityPolicy() {
            return contentSecurityPolicy;
        }

        public void setContentSecurityPolicy(String contentSecurityPolicy) {
            this.contentSecurityPolicy = contentSecurityPolicy;
        }

        public int getSessionTimeoutMinutes() {
            return sessionTimeoutMinutes;
        }

        public void setSessionTimeoutMinutes(int sessionTimeoutMinutes) {
            this.sessionTimeoutMinutes = sessionTimeoutMinutes;
        }

        public boolean isRequireHttps() {
            return requireHttps;
        }

        public void setRequireHttps(boolean requireHttps) {
            this.requireHttps = requireHttps;
        }

        public boolean isEnableCsrfProtection() {
            return enableCsrfProtection;
        }

        public void setEnableCsrfProtection(boolean enableCsrfProtection) {
            this.enableCsrfProtection = enableCsrfProtection;
        }

        public int getMaxLoginAttempts() {
            return maxLoginAttempts;
        }

        public void setMaxLoginAttempts(int maxLoginAttempts) {
            this.maxLoginAttempts = maxLoginAttempts;
        }

        public int getLockoutDurationMinutes() {
            return lockoutDurationMinutes;
        }

        public void setLockoutDurationMinutes(int lockoutDurationMinutes) {
            this.lockoutDurationMinutes = lockoutDurationMinutes;
        }
    }

    /**
     * DTO for OAuth2 configuration settings.
     */
    public static class OAuth2ConfigurationDTO {
        private boolean enabled;
        private String redirectBaseUrl;
        private Map<String, OAuth2ProviderDTO> providers;
        private TokenConfigDTO token;
        private EncryptionConfigDTO encryption;

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getRedirectBaseUrl() {
            return redirectBaseUrl;
        }

        public void setRedirectBaseUrl(String redirectBaseUrl) {
            this.redirectBaseUrl = redirectBaseUrl;
        }

        public Map<String, OAuth2ProviderDTO> getProviders() {
            return providers;
        }

        public void setProviders(Map<String, OAuth2ProviderDTO> providers) {
            this.providers = providers;
        }

        public TokenConfigDTO getToken() {
            return token;
        }

        public void setToken(TokenConfigDTO token) {
            this.token = token;
        }

        public EncryptionConfigDTO getEncryption() {
            return encryption;
        }

        public void setEncryption(EncryptionConfigDTO encryption) {
            this.encryption = encryption;
        }
    }

    /**
     * DTO for OAuth2 provider configuration.
     */
    public static class OAuth2ProviderDTO {
        private String clientId;
        private String clientSecret;
        private String scope;
        private boolean enabled;

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
    }

    /**
     * DTO for token configuration.
     */
    public static class TokenConfigDTO {
        private int refreshThresholdMinutes;
        private int defaultExpiryHours;
        private int cleanupDays;

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
     * DTO for encryption configuration.
     */
    public static class EncryptionConfigDTO {
        private String key;

        public String getKey() {
            return key;
        }

        public void setKey(String key) {
            this.key = key;
        }
    }

    /**
     * DTO for feature toggle configuration.
     */
    public static class FeatureToggleDTO {
        private String name;
        private String description;
        private boolean enabled;
        private String category;

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }
}