package com.satori.platform.service;

import com.satori.platform.domain.User;
import com.satori.platform.domain.UserSession;
import com.satori.platform.repository.UserSessionRepository;
import com.satori.platform.service.dto.UserSessionDTO;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service class for managing user sessions.
 */
@Service
@Transactional
public class UserSessionService {

    private static final Logger LOG = LoggerFactory.getLogger(UserSessionService.class);
    private static final int MAX_CONCURRENT_SESSIONS = 3;
    private static final int SESSION_TIMEOUT_HOURS = 24;

    private final UserSessionRepository userSessionRepository;

    public UserSessionService(UserSessionRepository userSessionRepository) {
        this.userSessionRepository = userSessionRepository;
    }

    /**
     * Create a new user session.
     */
    public UserSession createSession(User user, String ipAddress, String userAgent) {
        LOG.debug("Creating new session for user: {}", user.getLogin());

        // Check for concurrent sessions limit
        long activeSessionCount = userSessionRepository.countActiveSessionsByUser(user);
        if (activeSessionCount >= MAX_CONCURRENT_SESSIONS) {
            // Deactivate oldest sessions to make room
            List<UserSession> activeSessions = userSessionRepository.findActiveSessionsByUser(user);
            if (activeSessions.size() >= MAX_CONCURRENT_SESSIONS) {
                UserSession oldestSession = activeSessions.get(activeSessions.size() - 1);
                oldestSession.setActive(false);
                userSessionRepository.save(oldestSession);
                LOG.debug("Deactivated oldest session for user: {}", user.getLogin());
            }
        }

        String sessionId = UUID.randomUUID().toString();
        UserSession session = new UserSession(sessionId, user, ipAddress, userAgent);
        session.setExpiresAt(Instant.now().plus(SESSION_TIMEOUT_HOURS, ChronoUnit.HOURS));

        return userSessionRepository.save(session);
    }

    /**
     * Update session last accessed time.
     */
    public void updateSessionAccess(String sessionId) {
        userSessionRepository
            .findBySessionIdAndActiveTrue(sessionId)
            .ifPresent(session -> {
                session.setLastAccessedDate(Instant.now());
                userSessionRepository.save(session);
            });
    }

    /**
     * Invalidate a specific session.
     */
    public void invalidateSession(String sessionId) {
        LOG.debug("Invalidating session: {}", sessionId);
        userSessionRepository
            .findBySessionIdAndActiveTrue(sessionId)
            .ifPresent(session -> {
                session.setActive(false);
                userSessionRepository.save(session);
            });
    }

    /**
     * Invalidate all sessions for a user except the current one.
     */
    public void invalidateOtherUserSessions(User user, String currentSessionId) {
        LOG.debug("Invalidating other sessions for user: {}", user.getLogin());
        userSessionRepository.deactivateOtherUserSessions(user, currentSessionId);
    }

    /**
     * Invalidate all sessions for a user.
     */
    public void invalidateAllUserSessions(User user) {
        LOG.debug("Invalidating all sessions for user: {}", user.getLogin());
        userSessionRepository.deactivateAllUserSessions(user);
    }

    /**
     * Get active sessions for a user.
     */
    @Transactional(readOnly = true)
    public List<UserSessionDTO> getActiveUserSessions(User user) {
        return userSessionRepository.findActiveSessionsByUser(user).stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    /**
     * Check if a session is valid.
     */
    @Transactional(readOnly = true)
    public boolean isSessionValid(String sessionId) {
        Optional<UserSession> session = userSessionRepository.findBySessionIdAndActiveTrue(sessionId);
        if (session.isEmpty()) {
            return false;
        }

        UserSession userSession = session.orElseThrow();
        Instant now = Instant.now();

        // Check if session has expired
        if (userSession.getExpiresAt() != null && userSession.getExpiresAt().isBefore(now)) {
            userSession.setActive(false);
            userSessionRepository.save(userSession);
            return false;
        }

        // Check if session has been inactive too long
        Instant cutoffTime = now.minus(SESSION_TIMEOUT_HOURS, ChronoUnit.HOURS);
        if (userSession.getLastAccessedDate().isBefore(cutoffTime)) {
            userSession.setActive(false);
            userSessionRepository.save(userSession);
            return false;
        }

        return true;
    }

    /**
     * Cleanup expired sessions - runs every hour.
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void cleanupExpiredSessions() {
        LOG.debug("Starting cleanup of expired sessions");
        Instant now = Instant.now();
        Instant cutoffTime = now.minus(SESSION_TIMEOUT_HOURS, ChronoUnit.HOURS);

        userSessionRepository.deactivateExpiredSessions(now, cutoffTime);

        // Delete old inactive sessions (older than 7 days)
        Instant deleteCutoff = now.minus(7, ChronoUnit.DAYS);
        userSessionRepository.deleteByActiveFalseAndLastAccessedDateBefore(deleteCutoff);

        LOG.debug("Completed cleanup of expired sessions");
    }

    private UserSessionDTO convertToDTO(UserSession session) {
        return new UserSessionDTO(
            session.getId(),
            session.getSessionId(),
            session.getUser().getLogin(),
            session.getCreatedDate(),
            session.getLastAccessedDate(),
            session.getIpAddress(),
            session.getActive()
        );
    }
}
