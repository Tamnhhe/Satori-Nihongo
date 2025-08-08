package com.satori.platform.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.domain.AuditLog;
import com.satori.platform.domain.enumeration.AuditAction;
import com.satori.platform.repository.AuditLogRepository;
import com.satori.platform.security.SecurityUtils;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.Instant;
import java.util.Optional;

/**
 * Service for audit logging operations.
 */
@Service
@Transactional
public class AuditLogService {

    private static final Logger log = LoggerFactory.getLogger(AuditLogService.class);

    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public AuditLogService(AuditLogRepository auditLogRepository, ObjectMapper objectMapper) {
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Logs an audit event asynchronously.
     */
    @Async
    public void logAuditEvent(AuditAction action, String resourceType, Long resourceId, String description) {
        try {
            String username = SecurityUtils.getCurrentUserLogin().orElse("anonymous");
            AuditLog auditLog = new AuditLog(username, action, resourceType, resourceId);
            auditLog.setDescription(description);

            enrichWithRequestInfo(auditLog);

            auditLogRepository.save(auditLog);
            log.debug("Audit event logged: {} {} {} by {}", action, resourceType, resourceId, username);
        } catch (Exception e) {
            log.error("Failed to log audit event", e);
        }
    }

    /**
     * Logs an audit event with old and new values.
     */
    @Async
    public void logAuditEventWithValues(AuditAction action, String resourceType, Long resourceId,
            String description, Object oldValue, Object newValue) {
        try {
            String username = SecurityUtils.getCurrentUserLogin().orElse("anonymous");
            AuditLog auditLog = new AuditLog(username, action, resourceType, resourceId);
            auditLog.setDescription(description);

            if (oldValue != null) {
                auditLog.setOldValues(objectMapper.writeValueAsString(oldValue));
            }
            if (newValue != null) {
                auditLog.setNewValues(objectMapper.writeValueAsString(newValue));
            }

            enrichWithRequestInfo(auditLog);

            auditLogRepository.save(auditLog);
            log.debug("Audit event with values logged: {} {} {} by {}", action, resourceType, resourceId, username);
        } catch (Exception e) {
            log.error("Failed to log audit event with values", e);
        }
    }

    /**
     * Logs a failed operation.
     */
    @Async
    public void logFailedOperation(AuditAction action, String resourceType, Long resourceId,
            String description, String errorMessage) {
        try {
            String username = SecurityUtils.getCurrentUserLogin().orElse("anonymous");
            AuditLog auditLog = new AuditLog(username, action, resourceType, resourceId);
            auditLog.setDescription(description);
            auditLog.setSuccess(false);
            auditLog.setErrorMessage(errorMessage);

            enrichWithRequestInfo(auditLog);

            auditLogRepository.save(auditLog);
            log.warn("Failed operation logged: {} {} {} by {} - {}", action, resourceType, resourceId, username,
                    errorMessage);
        } catch (Exception e) {
            log.error("Failed to log failed operation", e);
        }
    }

    /**
     * Logs a security violation.
     */
    @Async
    public void logSecurityViolation(String description, String details) {
        try {
            String username = SecurityUtils.getCurrentUserLogin().orElse("anonymous");
            AuditLog auditLog = new AuditLog(username, AuditAction.SECURITY_VIOLATION, "SECURITY", null);
            auditLog.setDescription(description);
            auditLog.setSuccess(false);
            auditLog.setErrorMessage(details);

            enrichWithRequestInfo(auditLog);

            auditLogRepository.save(auditLog);
            log.warn("Security violation logged by {}: {}", username, description);
        } catch (Exception e) {
            log.error("Failed to log security violation", e);
        }
    }

    /**
     * Enriches audit log with HTTP request information.
     */
    private void enrichWithRequestInfo(AuditLog auditLog) {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder
                    .getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                auditLog.setIpAddress(getClientIpAddress(request));
                auditLog.setUserAgent(request.getHeader("User-Agent"));
                auditLog.setRequestUrl(request.getRequestURL().toString());
                auditLog.setSessionId(request.getSession(false) != null ? request.getSession().getId() : null);
            }
        } catch (Exception e) {
            log.debug("Could not enrich audit log with request info", e);
        }
    }

    /**
     * Gets the client IP address from the request.
     */
    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }

        String xRealIp = request.getHeader("X-Real-IP");
        if (xRealIp != null && !xRealIp.isEmpty()) {
            return xRealIp;
        }

        return request.getRemoteAddr();
    }

    /**
     * Retrieves audit logs with pagination.
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogs(Pageable pageable) {
        return auditLogRepository.findAll(pageable);
    }

    /**
     * Retrieves audit logs for a specific user.
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogsByUser(String username, Pageable pageable) {
        return auditLogRepository.findByUsernameOrderByTimestampDesc(username, pageable);
    }

    /**
     * Retrieves audit logs for a specific resource.
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getAuditLogsByResource(String resourceType, Long resourceId, Pageable pageable) {
        return auditLogRepository.findByResourceTypeAndResourceIdOrderByTimestampDesc(resourceType, resourceId,
                pageable);
    }

    /**
     * Retrieves failed operations.
     */
    @Transactional(readOnly = true)
    public Page<AuditLog> getFailedOperations(Pageable pageable) {
        return auditLogRepository.findFailedOperations(pageable);
    }

    /**
     * Checks if there are suspicious activities from an IP address.
     */
    @Transactional(readOnly = true)
    public boolean hasSuspiciousActivity(String ipAddress, int maxFailedAttempts, int timeWindowMinutes) {
        Instant since = Instant.now().minusSeconds(timeWindowMinutes * 60L);
        long failedAttempts = auditLogRepository.countFailedAttemptsByIpSince(ipAddress, since);
        return failedAttempts >= maxFailedAttempts;
    }
}