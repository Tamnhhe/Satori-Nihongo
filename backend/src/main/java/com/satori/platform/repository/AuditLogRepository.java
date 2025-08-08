package com.satori.platform.repository;

import com.satori.platform.domain.AuditLog;
import com.satori.platform.domain.enumeration.AuditAction;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

/**
 * Repository for AuditLog entity.
 */
@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findByUsernameOrderByTimestampDesc(String username, Pageable pageable);

    Page<AuditLog> findByActionOrderByTimestampDesc(AuditAction action, Pageable pageable);

    Page<AuditLog> findByResourceTypeOrderByTimestampDesc(String resourceType, Pageable pageable);

    Page<AuditLog> findByResourceTypeAndResourceIdOrderByTimestampDesc(String resourceType, Long resourceId,
            Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.timestamp BETWEEN :startDate AND :endDate ORDER BY a.timestamp DESC")
    Page<AuditLog> findByTimestampBetween(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate,
            Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.username = :username AND a.timestamp BETWEEN :startDate AND :endDate ORDER BY a.timestamp DESC")
    Page<AuditLog> findByUsernameAndTimestampBetween(@Param("username") String username,
            @Param("startDate") Instant startDate, @Param("endDate") Instant endDate, Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.success = false ORDER BY a.timestamp DESC")
    Page<AuditLog> findFailedOperations(Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE a.ipAddress = :ipAddress ORDER BY a.timestamp DESC")
    Page<AuditLog> findByIpAddress(@Param("ipAddress") String ipAddress, Pageable pageable);

    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.username = :username AND a.action = :action AND a.timestamp > :since")
    long countByUsernameAndActionAndTimestampAfter(@Param("username") String username,
            @Param("action") AuditAction action, @Param("since") Instant since);

    @Query("SELECT COUNT(a) FROM AuditLog a WHERE a.ipAddress = :ipAddress AND a.success = false AND a.timestamp > :since")
    long countFailedAttemptsByIpSince(@Param("ipAddress") String ipAddress, @Param("since") Instant since);

    List<AuditLog> findTop10ByUsernameOrderByTimestampDesc(String username);
}