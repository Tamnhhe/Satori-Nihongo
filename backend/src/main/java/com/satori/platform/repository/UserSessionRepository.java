package com.satori.platform.repository;

import com.satori.platform.domain.User;
import com.satori.platform.domain.UserSession;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the UserSession entity.
 */
@Repository
public interface UserSessionRepository extends JpaRepository<UserSession, Long> {

    Optional<UserSession> findBySessionIdAndActiveTrue(String sessionId);

    List<UserSession> findByUserAndActiveTrue(User user);

    List<UserSession> findByUserIdAndActiveTrue(Long userId);

    @Query("SELECT us FROM UserSession us WHERE us.user = :user AND us.active = true ORDER BY us.lastAccessedDate DESC")
    List<UserSession> findActiveSessionsByUser(@Param("user") User user);

    @Query("SELECT COUNT(us) FROM UserSession us WHERE us.user = :user AND us.active = true")
    long countActiveSessionsByUser(@Param("user") User user);

    @Modifying
    @Query("UPDATE UserSession us SET us.active = false WHERE us.user = :user AND us.sessionId != :currentSessionId")
    void deactivateOtherUserSessions(@Param("user") User user, @Param("currentSessionId") String currentSessionId);

    @Modifying
    @Query("UPDATE UserSession us SET us.active = false WHERE us.user = :user")
    void deactivateAllUserSessions(@Param("user") User user);

    @Modifying
    @Query("UPDATE UserSession us SET us.active = false WHERE us.expiresAt < :now OR us.lastAccessedDate < :cutoffTime")
    void deactivateExpiredSessions(@Param("now") Instant now, @Param("cutoffTime") Instant cutoffTime);

    @Query("SELECT us FROM UserSession us WHERE us.expiresAt < :now OR us.lastAccessedDate < :cutoffTime")
    List<UserSession> findExpiredSessions(@Param("now") Instant now, @Param("cutoffTime") Instant cutoffTime);

    void deleteByActiveFalseAndLastAccessedDateBefore(Instant cutoffDate);
}