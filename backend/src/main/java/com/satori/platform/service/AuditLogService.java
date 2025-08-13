package com.satori.platform.service;

import com.satori.platform.service.dto.AuditLogDTO;
import com.satori.platform.service.dto.AuditSearchCriteriaDTO;
import com.satori.platform.service.dto.SecurityEventDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for audit logging and security monitoring.
 */
@Service
public class AuditLogService {

    private final Logger log = LoggerFactory.getLogger(AuditLogService.class);

    // Mock data storage - in a real implementation, this would be a database
    private final List<AuditLogDTO> auditLogs = new ArrayList<>();
    private final List<SecurityEventDTO> securityEvents = new ArrayList<>();

    public AuditLogService() {
        initializeMockData();
    }

    /**
     * Search audit logs based on criteria.
     */
    public Page<AuditLogDTO> searchAuditLogs(AuditSearchCriteriaDTO criteria) {
        log.debug("Searching audit logs with criteria: {}", criteria);

        List<AuditLogDTO> filteredLogs = auditLogs.stream()
                .filter(log -> matchesCriteria(log, criteria))
                .sorted((a, b) -> {
                    if ("desc".equals(criteria.getSortDirection())) {
                        return b.getTimestamp().compareTo(a.getTimestamp());
                    } else {
                        return a.getTimestamp().compareTo(b.getTimestamp());
                    }
                })
                .collect(Collectors.toList());

        Pageable pageable = PageRequest.of(criteria.getPage(), criteria.getSize());
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredLogs.size());

        List<AuditLogDTO> pageContent = filteredLogs.subList(start, end);
        return new PageImpl<>(pageContent, pageable, filteredLogs.size());
    }

    /**
     * Get security events.
     */
    public Page<SecurityEventDTO> getSecurityEvents(int page, int size, String severity, boolean includeResolved) {
        log.debug("Getting security events - page: {}, size: {}, severity: {}, includeResolved: {}",
                page, size, severity, includeResolved);

        List<SecurityEventDTO> filteredEvents = securityEvents.stream()
                .filter(event -> includeResolved || !event.isResolved())
                .filter(event -> severity == null || severity.equals(event.getSeverity()))
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .collect(Collectors.toList());

        Pageable pageable = PageRequest.of(page, size);
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), filteredEvents.size());

        List<SecurityEventDTO> pageContent = filteredEvents.subList(start, end);
        return new PageImpl<>(pageContent, pageable, filteredEvents.size());
    }

    /**
     * Get audit statistics.
     */
    public Map<String, Object> getAuditStatistics(Instant startDate, Instant endDate) {
        log.debug("Getting audit statistics from {} to {}", startDate, endDate);

        List<AuditLogDTO> filteredLogs = auditLogs.stream()
                .filter(log -> log.getTimestamp().isAfter(startDate) && log.getTimestamp().isBefore(endDate))
                .collect(Collectors.toList());

        Map<String, Object> statistics = new HashMap<>();

        // Total events
        statistics.put("totalEvents", filteredLogs.size());

        // Events by action
        Map<String, Long> eventsByAction = filteredLogs.stream()
                .collect(Collectors.groupingBy(AuditLogDTO::getAction, Collectors.counting()));
        statistics.put("eventsByAction", eventsByAction);

        // Events by result
        Map<String, Long> eventsByResult = filteredLogs.stream()
                .collect(Collectors.groupingBy(AuditLogDTO::getResult, Collectors.counting()));
        statistics.put("eventsByResult", eventsByResult);

        // Events by user
        Map<String, Long> eventsByUser = filteredLogs.stream()
                .filter(log -> log.getUsername() != null)
                .collect(Collectors.groupingBy(AuditLogDTO::getUsername, Collectors.counting()));
        statistics.put("eventsByUser", eventsByUser);

        // Events by hour
        Map<String, Long> eventsByHour = filteredLogs.stream()
                .collect(Collectors.groupingBy(
                        log -> log.getTimestamp().truncatedTo(ChronoUnit.HOURS).toString(),
                        Collectors.counting()));
        statistics.put("eventsByHour", eventsByHour);

        return statistics;
    }

    /**
     * Get security statistics.
     */
    public Map<String, Object> getSecurityStatistics() {
        log.debug("Getting security statistics");

        Map<String, Object> statistics = new HashMap<>();

        // Total events
        statistics.put("totalEvents", securityEvents.size());

        // Unresolved events
        long unresolvedEvents = securityEvents.stream()
                .filter(event -> !event.isResolved())
                .count();
        statistics.put("unresolvedEvents", unresolvedEvents);

        // Events by severity
        Map<String, Long> eventsBySeverity = securityEvents.stream()
                .collect(Collectors.groupingBy(SecurityEventDTO::getSeverity, Collectors.counting()));
        statistics.put("eventsBySeverity", eventsBySeverity);

        // Events by type
        Map<String, Long> eventsByType = securityEvents.stream()
                .collect(Collectors.groupingBy(SecurityEventDTO::getEventType, Collectors.counting()));
        statistics.put("eventsByType", eventsByType);

        // Recent events (last 24 hours)
        Instant yesterday = Instant.now().minus(24, ChronoUnit.HOURS);
        long recentEvents = securityEvents.stream()
                .filter(event -> event.getTimestamp().isAfter(yesterday))
                .count();
        statistics.put("recentEvents", recentEvents);

        return statistics;
    }

    /**
     * Resolve a security event.
     */
    public void resolveSecurityEvent(String eventId, String resolvedBy) {
        log.debug("Resolving security event: {} by {}", eventId, resolvedBy);

        securityEvents.stream()
                .filter(event -> event.getId().equals(eventId))
                .findFirst()
                .ifPresent(event -> {
                    event.setResolved(true);
                    event.setResolvedBy(resolvedBy);
                    event.setResolvedAt(Instant.now());
                });
    }

    /**
     * Log an audit event.
     */
    public void logAuditEvent(String userId, String username, String action, String resource,
            String resourceId, String result, String details, String ipAddress, String userAgent) {
        log.debug("Logging audit event - user: {}, action: {}, resource: {}", username, action, resource);

        AuditLogDTO auditLog = new AuditLogDTO();
        auditLog.setId(UUID.randomUUID().toString());
        auditLog.setTimestamp(Instant.now());
        auditLog.setUserId(userId);
        auditLog.setUsername(username);
        auditLog.setAction(action);
        auditLog.setResource(resource);
        auditLog.setResourceId(resourceId);
        auditLog.setResult(result);
        auditLog.setDetails(details);
        auditLog.setIpAddress(ipAddress);
        auditLog.setUserAgent(userAgent);
        auditLog.setSessionId(UUID.randomUUID().toString());

        auditLogs.add(auditLog);
    }

    /**
     * Log a security event.
     */
    public void logSecurityEvent(String eventType, String severity, String source, String userId,
            String username, String description, String details, String ipAddress) {
        log.debug("Logging security event - type: {}, severity: {}, user: {}", eventType, severity, username);

        SecurityEventDTO securityEvent = new SecurityEventDTO();
        securityEvent.setId(UUID.randomUUID().toString());
        securityEvent.setTimestamp(Instant.now());
        securityEvent.setEventType(eventType);
        securityEvent.setSeverity(severity);
        securityEvent.setSource(source);
        securityEvent.setUserId(userId);
        securityEvent.setUsername(username);
        securityEvent.setDescription(description);
        securityEvent.setDetails(details);
        securityEvent.setIpAddress(ipAddress);
        securityEvent.setResolved(false);

        securityEvents.add(securityEvent);
    }

    private boolean matchesCriteria(AuditLogDTO log, AuditSearchCriteriaDTO criteria) {
        if (criteria.getStartDate() != null && log.getTimestamp().isBefore(criteria.getStartDate())) {
            return false;
        }
        if (criteria.getEndDate() != null && log.getTimestamp().isAfter(criteria.getEndDate())) {
            return false;
        }
        if (criteria.getUserId() != null && !criteria.getUserId().equals(log.getUserId())) {
            return false;
        }
        if (criteria.getUsername() != null && !criteria.getUsername().equalsIgnoreCase(log.getUsername())) {
            return false;
        }
        if (criteria.getActions() != null && !criteria.getActions().isEmpty() &&
                !criteria.getActions().contains(log.getAction())) {
            return false;
        }
        if (criteria.getResources() != null && !criteria.getResources().isEmpty() &&
                !criteria.getResources().contains(log.getResource())) {
            return false;
        }
        if (criteria.getResults() != null && !criteria.getResults().isEmpty() &&
                !criteria.getResults().contains(log.getResult())) {
            return false;
        }
        if (criteria.getIpAddress() != null && !criteria.getIpAddress().equals(log.getIpAddress())) {
            return false;
        }
        if (criteria.getSearchText() != null && !criteria.getSearchText().isEmpty()) {
            String searchText = criteria.getSearchText().toLowerCase();
            return (log.getUsername() != null && log.getUsername().toLowerCase().contains(searchText)) ||
                    (log.getAction() != null && log.getAction().toLowerCase().contains(searchText)) ||
                    (log.getResource() != null && log.getResource().toLowerCase().contains(searchText)) ||
                    (log.getDetails() != null && log.getDetails().toLowerCase().contains(searchText));
        }
        return true;
    }

    private void initializeMockData() {
        // Initialize mock audit logs
        String[] users = { "admin", "teacher1", "student1", "teacher2", "student2" };
        String[] actions = { "LOGIN", "LOGOUT", "CREATE", "UPDATE", "DELETE", "VIEW", "DOWNLOAD", "UPLOAD" };
        String[] resources = { "USER", "COURSE", "QUIZ", "FILE", "REPORT", "SYSTEM" };
        String[] results = { "SUCCESS", "FAILURE", "PARTIAL" };
        String[] ips = { "192.168.1.100", "192.168.1.101", "10.0.0.50", "172.16.0.10" };

        Random random = new Random();

        for (int i = 0; i < 100; i++) {
            AuditLogDTO log = new AuditLogDTO();
            log.setId(UUID.randomUUID().toString());
            log.setTimestamp(Instant.now().minus(random.nextInt(7), ChronoUnit.DAYS)
                    .minus(random.nextInt(24), ChronoUnit.HOURS)
                    .minus(random.nextInt(60), ChronoUnit.MINUTES));
            log.setUserId(UUID.randomUUID().toString());
            log.setUsername(users[random.nextInt(users.length)]);
            log.setAction(actions[random.nextInt(actions.length)]);
            log.setResource(resources[random.nextInt(resources.length)]);
            log.setResourceId(UUID.randomUUID().toString());
            log.setResult(results[random.nextInt(results.length)]);
            log.setDetails("Mock audit log entry for testing");
            log.setIpAddress(ips[random.nextInt(ips.length)]);
            log.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36");
            log.setSessionId(UUID.randomUUID().toString());

            auditLogs.add(log);
        }

        // Initialize mock security events
        String[] eventTypes = { "FAILED_LOGIN", "SUSPICIOUS_ACTIVITY", "PRIVILEGE_ESCALATION", "DATA_ACCESS",
                "SYSTEM_BREACH" };
        String[] severities = { "LOW", "MEDIUM", "HIGH", "CRITICAL" };
        String[] sources = { "WEB", "API", "SYSTEM", "DATABASE" };

        for (int i = 0; i < 20; i++) {
            SecurityEventDTO event = new SecurityEventDTO();
            event.setId(UUID.randomUUID().toString());
            event.setTimestamp(Instant.now().minus(random.nextInt(7), ChronoUnit.DAYS)
                    .minus(random.nextInt(24), ChronoUnit.HOURS));
            event.setEventType(eventTypes[random.nextInt(eventTypes.length)]);
            event.setSeverity(severities[random.nextInt(severities.length)]);
            event.setSource(sources[random.nextInt(sources.length)]);
            event.setUserId(UUID.randomUUID().toString());
            event.setUsername(users[random.nextInt(users.length)]);
            event.setDescription("Mock security event for testing");
            event.setDetails("Detailed information about the security event");
            event.setIpAddress(ips[random.nextInt(ips.length)]);
            event.setResolved(random.nextBoolean());

            if (event.isResolved()) {
                event.setResolvedBy("admin");
                event.setResolvedAt(event.getTimestamp().plus(random.nextInt(24), ChronoUnit.HOURS));
            }

            securityEvents.add(event);
        }
    }

    /**
     * Log a failed operation with audit action enum.
     */
    public void logFailedOperation(com.satori.platform.domain.enumeration.AuditAction action, 
            String username, Long userId, String details, String ipAddress) {
        logAuditEvent(
            userId != null ? userId.toString() : null,
            username,
            action.toString(),
            "OPERATION",
            null,
            "FAILURE",
            details,
            ipAddress,
            null
        );
    }

    /**
     * Log a security violation.
     */
    public void logSecurityViolation(String description, String ipAddress) {
        logSecurityEvent(
            "SECURITY_VIOLATION",
            "HIGH",
            "SYSTEM",
            null,
            "ANONYMOUS",
            description,
            "Security violation detected",
            ipAddress
        );
    }
}