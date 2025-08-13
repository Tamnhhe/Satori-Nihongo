package com.satori.platform.web.rest;

import com.satori.platform.security.AuthoritiesConstants;
import com.satori.platform.service.SystemMonitoringService;
import com.satori.platform.service.dto.SystemMonitoringDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * REST controller for system monitoring and health checks.
 */
@RestController
@RequestMapping("/api/admin/system-monitoring")
@PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
public class SystemMonitoringResource {

    private final Logger log = LoggerFactory.getLogger(SystemMonitoringResource.class);

    private final SystemMonitoringService systemMonitoringService;

    public SystemMonitoringResource(SystemMonitoringService systemMonitoringService) {
        this.systemMonitoringService = systemMonitoringService;
    }

    /**
     * GET /api/admin/system-monitoring : Get comprehensive system monitoring data.
     *
     * @return the ResponseEntity with status 200 (OK) and the monitoring data in
     *         body
     */
    @GetMapping
    public ResponseEntity<SystemMonitoringDTO> getSystemMonitoring() {
        log.debug("REST request to get system monitoring data");
        SystemMonitoringDTO monitoring = systemMonitoringService.getSystemMonitoring();
        return ResponseEntity.ok(monitoring);
    }

    /**
     * POST /api/admin/system-monitoring/alerts/{alertId}/acknowledge : Acknowledge
     * an alert.
     *
     * @param alertId the ID of the alert to acknowledge
     * @return the ResponseEntity with status 200 (OK)
     */
    @PostMapping("/alerts/{alertId}/acknowledge")
    public ResponseEntity<Void> acknowledgeAlert(@PathVariable String alertId) {
        log.debug("REST request to acknowledge alert: {}", alertId);
        systemMonitoringService.acknowledgeAlert(alertId);
        return ResponseEntity.ok().build();
    }

    /**
     * GET /api/admin/system-monitoring/metrics/historical : Get historical
     * performance metrics.
     *
     * @param timeRange the time range for historical data (1h, 24h, 7d)
     * @return the ResponseEntity with status 200 (OK) and historical metrics in
     *         body
     */
    @GetMapping("/metrics/historical")
    public ResponseEntity<Map<String, List<Map<String, Object>>>> getHistoricalMetrics(
            @RequestParam(defaultValue = "1h") String timeRange) {
        log.debug("REST request to get historical metrics for time range: {}", timeRange);
        Map<String, List<Map<String, Object>>> historicalMetrics = systemMonitoringService
                .getHistoricalMetrics(timeRange);
        return ResponseEntity.ok(historicalMetrics);
    }
}