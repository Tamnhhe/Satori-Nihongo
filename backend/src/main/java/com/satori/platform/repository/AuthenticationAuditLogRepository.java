package com.satori.platform.repository;

import com.satori.platform.domain.AuthenticationAuditLog;
import com.satori.platform.domain.enumeration.AuthenticationEventType;
import java.time.Instant;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AuthenticationAuditLog entity.
 */
@Repository
public interface AuthenticationAuditLogRepository extends JpaRepository<AuthenticationAuditLog, Long> {

    List<AuthenticationAuditLog> findByUsernameOrderByEventDateDesc(String username);

    Page<AuthenticationAuditLog> findByUsernameOrderByEventDateDesc(String username, Pageable pageable);

    List<AuthenticationAuditLog> findByEventTypeOrderByEventDateDesc(AuthenticationEventType eventType);

    @Query("SELECT aal FROM AuthenticationAuditLog aal WHERE aal.username = :username AND aal.eventType = :eventType AND aal.eventDate >= :since ORDER BY aal.eventDate DESC")
    List<AuthenticationAuditLog> findByUsernameAndEventTypeAndEventDateAfter(
            @Param("username") String username,
            @Param("eventType") AuthenticationEventType eventType,
            @Param("since") Instant since);

    @Query("SELECT COUNT(aal) FROM AuthenticationAuditLog aal WHERE aal.username = :username AND aal.eventType = :eventType AND aal.success = false AND aal.eventDate >= :since")
    long countFailedAttemptsSince(
            @Param("username") String username,
            @Param("eventType") AuthenticationEventType eventType,
            @Param("since") Instant since);

    @Query("SELECT aal FROM AuthenticationAuditLog aal WHERE aal.eventDate >= :startDate AND aal.eventDate <= :endDate ORDER BY aal.eventDate DESC")
    List<AuthenticationAuditLog> findByEventDateBetween(@Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate);

    void deleteByEventDateBefore(Instant cutoffDate);
}