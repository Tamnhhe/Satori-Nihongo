package com.satori.platform.repository;

import com.satori.platform.domain.NotificationDelivery;
import com.satori.platform.domain.enumeration.DeliveryStatus;
import com.satori.platform.domain.enumeration.NotificationType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the NotificationDelivery entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NotificationDeliveryRepository extends JpaRepository<NotificationDelivery, Long> {

        /**
         * Find notification deliveries by recipient ID
         */
        List<NotificationDelivery> findByRecipientId(Long recipientId);

        /**
         * Find notification deliveries by delivery status
         */
        @Query("SELECT nd FROM NotificationDelivery nd WHERE nd.status = :status")
        List<NotificationDelivery> findByDeliveryStatus(@Param("status") String status);

        /**
         * Find notification deliveries within date range
         */
        @Query("SELECT nd FROM NotificationDelivery nd WHERE nd.scheduledAt BETWEEN :startDate AND :endDate")
        List<NotificationDelivery> findByScheduledAtBetween(
                        @Param("startDate") Instant startDate,
                        @Param("endDate") Instant endDate);

        /**
         * Find failed notification deliveries
         */
        @Query("SELECT nd FROM NotificationDelivery nd WHERE nd.status = 'FAILED'")
        List<NotificationDelivery> findFailedDeliveries();

        // Additional methods required by the services

        /**
         * Find pending notifications ready for processing
         */
        @Query("SELECT nd FROM NotificationDelivery nd WHERE nd.status = :status AND (nd.scheduledAt IS NULL OR nd.scheduledAt <= :now) ORDER BY nd.createdAt ASC")
        List<NotificationDelivery> findPendingNotifications(@Param("status") DeliveryStatus status,
                        @Param("now") Instant now);

        /**
         * Find scheduled notifications ready for delivery
         */
        @Query("SELECT nd FROM NotificationDelivery nd WHERE nd.status = :status AND nd.scheduledAt BETWEEN :startTime AND :endTime")
        List<NotificationDelivery> findScheduledNotifications(@Param("status") DeliveryStatus status,
                        @Param("startTime") Instant startTime, @Param("endTime") Instant endTime);

        /**
         * Find notifications ready for retry
         */
        @Query("SELECT nd FROM NotificationDelivery nd WHERE nd.status = :status AND nd.retryCount < nd.maxRetries AND (nd.nextRetryAt IS NULL OR nd.nextRetryAt <= :now)")
        List<NotificationDelivery> findRetryableNotifications(@Param("status") DeliveryStatus status,
                        @Param("now") Instant now);

        /**
         * Find expired notifications
         */
        @Query("SELECT nd FROM NotificationDelivery nd WHERE nd.status = :status AND nd.createdAt < :expiredBefore")
        List<NotificationDelivery> findExpiredNotifications(@Param("status") DeliveryStatus status,
                        @Param("expiredBefore") Instant expiredBefore);

        /**
         * Delete old notifications
         */
        @Modifying
        @Query("DELETE FROM NotificationDelivery nd WHERE nd.createdAt < :cutoffDate AND nd.status IN :finalStatuses")
        int deleteOldNotifications(@Param("cutoffDate") Instant cutoffDate,
                        @Param("finalStatuses") List<DeliveryStatus> finalStatuses);

        /**
         * Find by recipient ID with pagination
         */
        Page<NotificationDelivery> findByRecipientIdOrderByCreatedAtDesc(Long recipientId, Pageable pageable);

        /**
         * Find by external ID
         */
        Optional<NotificationDelivery> findByExternalId(String externalId);

        /**
         * Count by status
         */
        long countByStatus(DeliveryStatus status);

        /**
         * Get delivery statistics for date range
         */
        @Query("SELECT nd.status, COUNT(nd) FROM NotificationDelivery nd WHERE nd.createdAt BETWEEN :startDate AND :endDate GROUP BY nd.status")
        List<Object[]> getDeliveryStatistics(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

        /**
         * Get delivery statistics by type
         */
        @Query("SELECT nd.notificationType, nd.status, COUNT(nd) FROM NotificationDelivery nd WHERE nd.createdAt BETWEEN :startDate AND :endDate GROUP BY nd.notificationType, nd.status")
        List<Object[]> getDeliveryStatisticsByType(@Param("startDate") Instant startDate,
                        @Param("endDate") Instant endDate);

        /**
         * Get delivery statistics by channel
         */
        @Query("SELECT nd.deliveryChannel, nd.status, COUNT(nd) FROM NotificationDelivery nd WHERE nd.createdAt BETWEEN :startDate AND :endDate GROUP BY nd.deliveryChannel, nd.status")
        List<Object[]> getDeliveryStatisticsByChannel(@Param("startDate") Instant startDate,
                        @Param("endDate") Instant endDate);

        /**
         * Get average delivery time
         */
        @Query("SELECT AVG(TIMESTAMPDIFF(SECOND, nd.sentAt, nd.deliveredAt)) FROM NotificationDelivery nd WHERE nd.status = :status AND nd.createdAt BETWEEN :startDate AND :endDate AND nd.sentAt IS NOT NULL AND nd.deliveredAt IS NOT NULL")
        Double getAverageDeliveryTime(@Param("status") DeliveryStatus status, @Param("startDate") Instant startDate,
                        @Param("endDate") Instant endDate);

        /**
         * Get delivery rate
         */
        @Query("SELECT (COUNT(CASE WHEN nd.status IN ('SENT', 'DELIVERED') THEN 1 END) * 100.0 / COUNT(*)) FROM NotificationDelivery nd WHERE nd.createdAt BETWEEN :startDate AND :endDate")
        Double getDeliveryRate(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);

        /**
         * Get delivery rate by type
         */
        @Query("SELECT nd.notificationType, (COUNT(CASE WHEN nd.status IN ('SENT', 'DELIVERED') THEN 1 END) * 100.0 / COUNT(*)) FROM NotificationDelivery nd WHERE nd.createdAt BETWEEN :startDate AND :endDate GROUP BY nd.notificationType")
        List<Object[]> getDeliveryRateByType(@Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
}