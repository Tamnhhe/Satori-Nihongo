package com.satori.platform.web.rest;

import com.satori.platform.security.AuthoritiesConstants;
import com.satori.platform.service.AuditLogService;
import com.satori.platform.service.dto.AuditLogDTO;
import com.satori.platform.service.dto.AuditSearchCriteriaDTO;
import com.satori.platform.service.dto.SecurityEventDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;

/**
 * REST controller for audit logging and security monitoring.
 */
@RestController
@RequestMapping("/api/admin/audit")
@PreAuthorize("hasAuthority(\"" + AuthoritiesConstants.ADMIN + "\")")
public class AuditLogResource {

    private final Logger log = LoggerFactory.getLogger(AuditLogResource.class);

    private final AuditLogService auditLogService;

    public AuditLogResource(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    /**
     * POST /api/admin/audit/logs/search : Search audit logs.
     *
     * @param criteria the search criteria
     * @return the ResponseEntity with status 200 (OK) and the audit logs in body
     */
    @PostMapping("/logs/search")
    public ResponseEntity<Page<AuditLogDTO>> searchAuditLogs(@RequestBody AuditSearchCriteriaDTO criteria) {
        log.debug("REST request to search audit logs with criteria: {}", criteria);
        Page<AuditLogDTO> auditLogs = auditLogService.searchAuditLogs(criteria);
        return ResponseEntity.ok(auditLogs);
    }

    /**
     * GET /api/admin/audit/security-events : Get security events.
     *
     * @param page            the page number
     * @param size            the page size
     * @param severity        the severity filter
     * @param includeResolved whether to include resolved events
     * @return the ResponseEntity with status 200 (OK) and the security events in
     *         body
     */
    @GetMapping("/security-events")
    public ResponseEntity<Page<SecurityEventDTO>> getSecurityEvents(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String severity,
            @RequestParam(defaultValue = "false") boolean includeResolved) {
        log.debug("REST request to get security events - page: {}, size: {}, severity: {}, includeResolved: {}",
                page, size, severity, includeResolved);
        Page<SecurityEventDTO> securityEvents = auditLogService.getSecurityEvents(page, size, severity,
                includeResolved);
        return ResponseEntity.ok(securityEvents);
    }

    /**
     * GET /api/admin/audit/statistics : Get audit statistics.
     *
     * @param startDate the start date
     * @param endDate   the end date
     * @return the ResponseEntity with status 200 (OK) and the statistics in body
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getAuditStatistics(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {
        log.debug("REST request to get audit statistics from {} to {}", startDate, endDate);
        Map<String, Object> statistics = auditLogService.getAuditStatistics(startDate, endDate);
        return ResponseEntity.ok(statistics);
    }

    /**
     * GET /api/admin/audit/security-statistics : Get security statistics.
     *
     * @return the ResponseEntity with status 200 (OK) and the statistics in body
     */
    @GetMapping("/security-statistics")
    public ResponseEntity<Map<String, Object>> getSecurityStatistics() {
        log.debug("REST request to get security statistics");
        Map<String, Object> statistics = auditLogService.getSecurityStatistics();
        return ResponseEntity.ok(statistics);
    }

    /**
     * POST /api/admin/audit/security-events/{eventId}/resolve : Resolve a security
     * event.
     *
     * @param eventId the ID of the event to resolve
     * @param request the resolve request containing resolver information
     * @return the ResponseEntity with status 200 (OK)
     */
    @PostMapping("/security-events/{eventId}/resolve")
    public ResponseEntity<Void> resolveSecurityEvent(
            @PathVariable String eventId,
            @RequestBody Map<String, String> request) {
        log.debug("REST request to resolve security event: {}", eventId);
        String resolvedBy = request.get("resolvedBy");
        auditLogService.resolveSecurityEvent(eventId, resolvedBy);
        return ResponseEntity.ok().build();
    }
}