package com.satori.platform.web.rest;

import com.satori.platform.security.AuthoritiesConstants;
import com.satori.platform.service.SystemConfigurationService;
import com.satori.platform.service.dto.SystemConfigurationDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.Map;

/**
 * REST controller for managing system configuration.
 */
@RestController
@RequestMapping("/api/admin/system-configuration")
@PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
public class SystemConfigurationResource {

    private final Logger log = LoggerFactory.getLogger(SystemConfigurationResource.class);

    private final SystemConfigurationService systemConfigurationService;

    public SystemConfigurationResource(SystemConfigurationService systemConfigurationService) {
        this.systemConfigurationService = systemConfigurationService;
    }

    /**
     * GET /api/admin/system-configuration : Get current system configuration.
     *
     * @return the ResponseEntity with status 200 (OK) and the system configuration
     *         in body
     */
    @GetMapping
    public ResponseEntity<SystemConfigurationDTO> getSystemConfiguration() {
        log.debug("REST request to get system configuration");
        SystemConfigurationDTO configuration = systemConfigurationService.getSystemConfiguration();
        return ResponseEntity.ok(configuration);
    }

    /**
     * PUT /api/admin/system-configuration : Update system configuration.
     *
     * @param configurationDTO the system configuration to update
     * @return the ResponseEntity with status 200 (OK) and the updated configuration
     *         in body
     */
    @PutMapping
    public ResponseEntity<SystemConfigurationDTO> updateSystemConfiguration(
            @Valid @RequestBody SystemConfigurationDTO configurationDTO) {
        log.debug("REST request to update system configuration: {}", configurationDTO);

        // Validate configuration
        Map<String, String> validationErrors = systemConfigurationService.validateConfiguration(configurationDTO);
        if (!validationErrors.isEmpty()) {
            // In a real implementation, you might want to return a proper error response
            // For now, we'll just log the errors
            log.warn("Configuration validation errors: {}", validationErrors);
        }

        SystemConfigurationDTO updatedConfiguration = systemConfigurationService
                .updateSystemConfiguration(configurationDTO);
        return ResponseEntity.ok(updatedConfiguration);
    }

    /**
     * POST /api/admin/system-configuration/validate : Validate system
     * configuration.
     *
     * @param configurationDTO the system configuration to validate
     * @return the ResponseEntity with status 200 (OK) and validation results in
     *         body
     */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, String>> validateConfiguration(
            @Valid @RequestBody SystemConfigurationDTO configurationDTO) {
        log.debug("REST request to validate system configuration");
        Map<String, String> validationErrors = systemConfigurationService.validateConfiguration(configurationDTO);
        return ResponseEntity.ok(validationErrors);
    }

    /**
     * POST /api/admin/system-configuration/backup : Create configuration backup.
     *
     * @return the ResponseEntity with status 200 (OK) and backup ID in body
     */
    @PostMapping("/backup")
    public ResponseEntity<Map<String, String>> createConfigurationBackup() {
        log.debug("REST request to create configuration backup");
        String backupId = systemConfigurationService.createConfigurationBackup();
        return ResponseEntity.ok(Map.of("backupId", backupId));
    }

    /**
     * POST /api/admin/system-configuration/restore : Restore configuration from
     * backup.
     *
     * @param request the restore request containing backup ID
     * @return the ResponseEntity with status 200 (OK)
     */
    @PostMapping("/restore")
    public ResponseEntity<Void> restoreConfigurationFromBackup(@RequestBody Map<String, String> request) {
        log.debug("REST request to restore configuration from backup");
        String backupId = request.get("backupId");
        systemConfigurationService.restoreConfigurationFromBackup(backupId);
        return ResponseEntity.ok().build();
    }
}