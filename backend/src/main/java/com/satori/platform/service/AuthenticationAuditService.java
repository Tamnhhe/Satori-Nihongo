package com.satori.platform.service;

import com.satori.platform.domain.AuthenticationAuditLog;
import com.satori.platform.domain.enumeration.AuthenticationEventType;
import com.satori.platform.repository.AuthenticationAuditLogRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing authentication audit logs.
 */
@Service
@Transactional
public class AuthenticationAuditService {

    private static final Logger LOG = LoggerFactory.getLogger(AuthenticationAuditService.class);
    private static final int MAX_FAILED_ATTEMPTS = 5;
    private static final int LOCKOUT_DURATION_MINUTES = 30;

    private final AuthenticationAuditLogRepository auditLogRepository;

    public AuthenticationAuditService(AuthenticationAuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    /**
     * Log an authentication event asynchronously.
     */
    @Async
    public void logAuthenticationEvent(String username, AuthenticationEventType eventType,
            Boolean success, String ipAddress, String userAgent, String details) {
        LOG.debug("Logging authentication event: {} for user: {}", eventType, username);

        AuthenticationAuditLog auditLog = new AuthenticationAuditLog(username, eventType, success, ipAddress,
                userAgent);
        auditLog.setDetails(details);

        auditLogRepository.save(auditLog);
    }

    /**
     * Log successful login.
     */
    @Async
    public void logSuccessfulLogin(String username, String ipAddress, String userAgent) {
        logAuthenticationEvent(username, AuthenticationEventType.LOGIN_SUCCESS, true, ipAddress, userAgent, null);
    }

    /**
     * Log failed login attempt.
     */
    @Async
    public void logFailedLogin(String username, String ipAddress, String userAgent, String reason) {
        logAuthenticationEvent(username, AuthenticationEventType.LOGIN_FAILURE, false, ipAddress, userAgent, reason);
    }

    /**
     * Log logout event.
     */
    @Async
    public void logLogout(String username, String ipAddress, String userAgent) {
        logAuthenticationEvent(username, AuthenticationEventType.LOGOUT, true, ipAddress, userAgent, null);
    }

    /**
     * Log password reset request.
     */
    @Async
    public void logPasswordResetRequest(String username, String ipAddress, String userAgent) {
        logAuthenticationEvent(username, AuthenticationEventType.PASSWORD_RESET_REQUEST, true, ipAddress, userAgent,
                null);
    }

    /**
     * Log successful password reset.
     */
    @Async
    public void logPasswordResetSuccess(String username, String ipAddress, String userAgent) {
        logAuthenticationEvent(username, AuthenticationEventType.PASSWORD_RESET_SUCCESS, true, ipAddress, userAgent,
                null);
    }

    /**
     * Log password change.
     */
    @Async
    public void logPasswordChange(String username, String ipAddress, String userAgent) {
        logAuthenticationEvent(username, AuthenticationEventType.PASSWORD_CHANGE, true, ipAddress, userAgent, null);
    }

    /**
     * Log account activation.
     */
    @Async
    public void logAccountActivation(String username, String ipAddress, String userAgent) {
        logAuthenticationEvent(username, AuthenticationEventType.ACCOUNT_ACTIVATION, true, ipAddress, userAgent, null);
    }

    /**
     * Log account locked.
     */
    @Async
    public void logAccountLocked(String username, String ipAddress, String userAgent, String reason) {
        logAuthenticationEvent(username, AuthenticationEventType.ACCOUNT_LOCKED, true, ipAddress, userAgent, reason);
    }

    /**
     * Log user registration.
     */
    @Async
    public void logUserRegistration(String username, String ipAddress, String userAgent) {
        logAuthenticationEvent(username, AuthenticationEventType.REGISTRATION, true, ipAddress, userAgent, null);
    }

    /**
     * Log profile completion.
     */
    @Async
    public void logProfileCompletion(String username, String ipAddress, String userAgent) {
        logAuthenticationEvent(username, AuthenticationEventType.PROFILE_COMPLETION, true, ipAddress, userAgent, null);
    }

    /**
     * Check if user should be locked due to failed login attempts.
     */
    @Transactional(readOnly = true)
    public boolean shouldLockAccount(String username) {
        Instant since = Instant.now().minus(LOCKOUT_DURATION_MINUTES, ChronoUnit.MINUTES);
        long failedAttempts = auditLogRepository.countFailedAttemptsSince(
                username, AuthenticationEventType.LOGIN_FAILURE, since);

        return failedAttempts >= MAX_FAILED_ATTEMPTS;
    }

    /**
     * Get recent failed login attempts for a user.
     */
    @Transactional(readOnly = true)
    public long getRecentFailedAttempts(String username) {
        Instant since = Instant.now().minus(LOCKOUT_DURATION_MINUTES, ChronoUnit.MINUTES);
        return auditLogRepository.countFailedAttemptsSince(
                username, AuthenticationEventType.LOGIN_FAILURE, since);
    }

    /**
     * Get audit logs for a user.
     */
    @Transactional(readOnly = true)
    public Page<AuthenticationAuditLog> getUserAuditLogs(String username, Pageable pageable) {
        return auditLogRepository.findByUsernameOrderByEventDateDesc(username, pageable);
    }

    /**
     * Get audit logs by event type.
     */
    @Transactional(readOnly = true)
    public List<AuthenticationAuditLog> getAuditLogsByEventType(AuthenticationEventType eventType) {
        return auditLogRepository.findByEventTypeOrderByEventDateDesc(eventType);
    }

    /**
     * Get audit logs within date range.
     */
    @Transactional(readOnly = true)
    public List<AuthenticationAuditLog> getAuditLogsByDateRange(Instant startDate, Instant endDate) {
        return auditLogRepository.findByEventDateBetween(startDate, endDate);
    }

    /**
     * Cleanup old audit logs - runs daily at 2 AM.
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupOldAuditLogs() {
        LOG.debug("Starting cleanup of old audit logs");

        // Keep audit logs for 90 days
        Instant cutoffDate = Instant.now().minus(90, ChronoUnit.DAYS);
        auditLogRepository.deleteByEventDateBefore(cutoffDate);

        LOG.debug("Completed cleanup of old audit logs");
    }
}