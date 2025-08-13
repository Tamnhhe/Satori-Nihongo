package com.satori.platform.service;

import com.satori.platform.config.OAuth2Properties;
import com.satori.platform.service.dto.SystemConfigurationDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import tech.jhipster.config.JHipsterProperties;

import java.util.HashMap;
import java.util.Map;

/**
 * Service for managing system configuration.
 */
@Service
public class SystemConfigurationService {

    private final Logger log = LoggerFactory.getLogger(SystemConfigurationService.class);

    private final JHipsterProperties jHipsterProperties;
    private final OAuth2Properties oAuth2Properties;
    private final Environment environment;

    @Value("${server.servlet.session.timeout:30m}")
    private String sessionTimeout;

    @Value("${server.ssl.enabled:false}")
    private boolean sslEnabled;

    public SystemConfigurationService(
            JHipsterProperties jHipsterProperties,
            OAuth2Properties oAuth2Properties,
            Environment environment) {
        this.jHipsterProperties = jHipsterProperties;
        this.oAuth2Properties = oAuth2Properties;
        this.environment = environment;
    }

    /**
     * Get current system configuration.
     */
    public SystemConfigurationDTO getSystemConfiguration() {
        log.debug("Getting system configuration");

        SystemConfigurationDTO config = new SystemConfigurationDTO();

        // Security configuration
        config.setSecurity(getSecurityConfiguration());

        // OAuth2 configuration
        config.setOauth2(getOAuth2Configuration());

        // Feature toggles
        config.setFeatureToggles(getFeatureToggles());

        // System parameters
        config.setSystemParameters(getSystemParameters());

        return config;
    }

    /**
     * Update system configuration.
     */
    public SystemConfigurationDTO updateSystemConfiguration(SystemConfigurationDTO configurationDTO) {
        log.debug("Updating system configuration: {}", configurationDTO);

        // Note: In a real implementation, you would update the actual configuration
        // This is a simplified version that returns the input for demonstration
        // In practice, you'd need to update configuration files, environment variables,
        // or database settings depending on your configuration management strategy

        return configurationDTO;
    }

    /**
     * Validate system configuration.
     */
    public Map<String, String> validateConfiguration(SystemConfigurationDTO configurationDTO) {
        log.debug("Validating system configuration");

        Map<String, String> validationErrors = new HashMap<>();

        // Validate security settings
        if (configurationDTO.getSecurity() != null) {
            validateSecurityConfiguration(configurationDTO.getSecurity(), validationErrors);
        }

        // Validate OAuth2 settings
        if (configurationDTO.getOauth2() != null) {
            validateOAuth2Configuration(configurationDTO.getOauth2(), validationErrors);
        }

        return validationErrors;
    }

    /**
     * Create configuration backup.
     */
    public String createConfigurationBackup() {
        log.debug("Creating configuration backup");

        SystemConfigurationDTO config = getSystemConfiguration();
        // In a real implementation, you would serialize and store the configuration
        // This is a simplified version that returns a backup ID
        return "backup_" + System.currentTimeMillis();
    }

    /**
     * Restore configuration from backup.
     */
    public void restoreConfigurationFromBackup(String backupId) {
        log.debug("Restoring configuration from backup: {}", backupId);

        // In a real implementation, you would load and apply the backup
        // This is a placeholder for the actual restoration logic
    }

    private SystemConfigurationDTO.SecurityConfigurationDTO getSecurityConfiguration() {
        SystemConfigurationDTO.SecurityConfigurationDTO security = new SystemConfigurationDTO.SecurityConfigurationDTO();

        security.setContentSecurityPolicy(jHipsterProperties.getSecurity().getContentSecurityPolicy());
        security.setSessionTimeoutMinutes(parseSessionTimeout());
        security.setRequireHttps(sslEnabled);
        security.setEnableCsrfProtection(true); // Default value
        security.setMaxLoginAttempts(5); // Default value
        security.setLockoutDurationMinutes(15); // Default value

        return security;
    }

    private SystemConfigurationDTO.OAuth2ConfigurationDTO getOAuth2Configuration() {
        SystemConfigurationDTO.OAuth2ConfigurationDTO oauth2 = new SystemConfigurationDTO.OAuth2ConfigurationDTO();

        oauth2.setEnabled(oAuth2Properties.isEnabled());
        oauth2.setRedirectBaseUrl(oAuth2Properties.getRedirectBaseUrl());

        // Convert providers
        Map<String, SystemConfigurationDTO.OAuth2ProviderDTO> providers = new HashMap<>();
        oAuth2Properties.getProviders().forEach((key, value) -> {
            SystemConfigurationDTO.OAuth2ProviderDTO provider = new SystemConfigurationDTO.OAuth2ProviderDTO();
            provider.setClientId(value.getClientId());
            provider.setClientSecret(maskSecret(value.getClientSecret()));
            provider.setScope(value.getScope());
            provider.setEnabled(value.isEnabled());
            providers.put(key, provider);
        });
        oauth2.setProviders(providers);

        // Token configuration
        SystemConfigurationDTO.TokenConfigDTO token = new SystemConfigurationDTO.TokenConfigDTO();
        token.setRefreshThresholdMinutes(oAuth2Properties.getToken().getRefreshThresholdMinutes());
        token.setDefaultExpiryHours(oAuth2Properties.getToken().getDefaultExpiryHours());
        token.setCleanupDays(oAuth2Properties.getToken().getCleanupDays());
        oauth2.setToken(token);

        // Encryption configuration
        SystemConfigurationDTO.EncryptionConfigDTO encryption = new SystemConfigurationDTO.EncryptionConfigDTO();
        encryption.setKey(maskSecret(oAuth2Properties.getEncryption().getKey()));
        oauth2.setEncryption(encryption);

        return oauth2;
    }

    private Map<String, SystemConfigurationDTO.FeatureToggleDTO> getFeatureToggles() {
        Map<String, SystemConfigurationDTO.FeatureToggleDTO> featureToggles = new HashMap<>();

        // Example feature toggles - in a real implementation, these would come from
        // configuration
        addFeatureToggle(featureToggles, "oauth2-login", "OAuth2 Social Login", true, "Authentication");
        addFeatureToggle(featureToggles, "file-upload", "File Upload Feature", true, "Content");
        addFeatureToggle(featureToggles, "push-notifications", "Push Notifications", true, "Notifications");
        addFeatureToggle(featureToggles, "analytics-tracking", "Analytics Tracking", true, "Analytics");
        addFeatureToggle(featureToggles, "maintenance-mode", "Maintenance Mode", false, "System");

        return featureToggles;
    }

    private Map<String, String> getSystemParameters() {
        Map<String, String> parameters = new HashMap<>();

        // Example system parameters
        parameters.put("max-file-size", environment.getProperty("spring.servlet.multipart.max-file-size", "10MB"));
        parameters.put("max-request-size",
                environment.getProperty("spring.servlet.multipart.max-request-size", "10MB"));
        parameters.put("database-pool-size",
                environment.getProperty("spring.datasource.hikari.maximum-pool-size", "20"));
        parameters.put("cache-ttl-seconds", environment.getProperty("application.cache.timeToLiveSeconds", "3600"));
        parameters.put("api-rate-limit", environment.getProperty("application.api.rateLimit", "1000"));

        return parameters;
    }

    private void addFeatureToggle(Map<String, SystemConfigurationDTO.FeatureToggleDTO> toggles,
            String name, String description, boolean enabled, String category) {
        SystemConfigurationDTO.FeatureToggleDTO toggle = new SystemConfigurationDTO.FeatureToggleDTO();
        toggle.setName(name);
        toggle.setDescription(description);
        toggle.setEnabled(enabled);
        toggle.setCategory(category);
        toggles.put(name, toggle);
    }

    private void validateSecurityConfiguration(SystemConfigurationDTO.SecurityConfigurationDTO security,
            Map<String, String> errors) {
        if (security.getSessionTimeoutMinutes() < 5) {
            errors.put("security.sessionTimeout", "Session timeout must be at least 5 minutes");
        }

        if (security.getMaxLoginAttempts() < 1 || security.getMaxLoginAttempts() > 10) {
            errors.put("security.maxLoginAttempts", "Max login attempts must be between 1 and 10");
        }

        if (security.getLockoutDurationMinutes() < 1) {
            errors.put("security.lockoutDuration", "Lockout duration must be at least 1 minute");
        }
    }

    private void validateOAuth2Configuration(SystemConfigurationDTO.OAuth2ConfigurationDTO oauth2,
            Map<String, String> errors) {
        if (oauth2.isEnabled() && oauth2.getProviders() != null) {
            oauth2.getProviders().forEach((providerId, provider) -> {
                if (provider.isEnabled()) {
                    if (provider.getClientId() == null || provider.getClientId().trim().isEmpty()) {
                        errors.put("oauth2.providers." + providerId + ".clientId",
                                "Client ID is required for enabled providers");
                    }
                    if (provider.getClientSecret() == null || provider.getClientSecret().trim().isEmpty()) {
                        errors.put("oauth2.providers." + providerId + ".clientSecret",
                                "Client Secret is required for enabled providers");
                    }
                }
            });
        }
    }

    private String maskSecret(String secret) {
        if (secret == null || secret.length() < 4) {
            return "****";
        }
        return secret.substring(0, 2) + "****" + secret.substring(secret.length() - 2);
    }

    private int parseSessionTimeout() {
        try {
            String timeout = sessionTimeout.toLowerCase();
            if (timeout.endsWith("m")) {
                return Integer.parseInt(timeout.substring(0, timeout.length() - 1));
            } else if (timeout.endsWith("s")) {
                return Integer.parseInt(timeout.substring(0, timeout.length() - 1)) / 60;
            } else {
                return Integer.parseInt(timeout) / 60;
            }
        } catch (Exception e) {
            return 30; // Default 30 minutes
        }
    }
}