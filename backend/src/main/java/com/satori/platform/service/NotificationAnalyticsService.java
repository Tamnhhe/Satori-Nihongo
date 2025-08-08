package com.satori.platform.service;

import com.satori.platform.domain.enumeration.DeliveryStatus;
import com.satori.platform.domain.enumeration.NotificationType;
import com.satori.platform.repository.NotificationDeliveryRepository;
import com.satori.platform.service.dto.NotificationAnalyticsDTO;
import com.satori.platform.service.dto.DeliveryStatsDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for notification analytics and delivery rate monitoring.
 * Provides comprehensive analytics for notification system performance.
 */
@Service
@Transactional(readOnly = true)
public class NotificationAnalyticsService {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationAnalyticsService.class);

    private final NotificationDeliveryRepository notificationDeliveryRepository;

    public NotificationAnalyticsService(NotificationDeliveryRepository notificationDeliveryRepository) {
        this.notificationDeliveryRepository = notificationDeliveryRepository;
    }

    /**
     * Get comprehensive notification analytics for a date range
     * Requirements: Analytics and delivery rate monitoring
     */
    public NotificationAnalyticsDTO getNotificationAnalytics(Instant startDate, Instant endDate) {
        LOG.debug("Generating notification analytics for period: {} to {}", startDate, endDate);

        NotificationAnalyticsDTO analytics = new NotificationAnalyticsDTO();
        analytics.setStartDate(startDate);
        analytics.setEndDate(endDate);

        // Overall delivery statistics
        Map<DeliveryStatus, Long> overallStats = getDeliveryStatistics(startDate, endDate);
        analytics.setOverallStats(overallStats);

        // Calculate delivery rate
        long totalNotifications = overallStats.values().stream().mapToLong(Long::longValue).sum();
        long successfulDeliveries = overallStats.getOrDefault(DeliveryStatus.SENT, 0L) +
                overallStats.getOrDefault(DeliveryStatus.DELIVERED, 0L);

        double deliveryRate = totalNotifications > 0 ? (double) successfulDeliveries / totalNotifications * 100 : 0.0;
        analytics.setOverallDeliveryRate(deliveryRate);

        // Statistics by notification type
        Map<NotificationType, DeliveryStatsDTO> statsByType = getDeliveryStatisticsByType(startDate, endDate);
        analytics.setStatsByType(statsByType);

        // Statistics by delivery channel
        Map<String, DeliveryStatsDTO> statsByChannel = getDeliveryStatisticsByChannel(startDate, endDate);
        analytics.setStatsByChannel(statsByChannel);

        // Average delivery time
        double avgDeliveryTime = getAverageDeliveryTime(startDate, endDate);
        analytics.setAverageDeliveryTimeSeconds(avgDeliveryTime);

        // Failure analysis
        Map<String, Long> failureReasons = getFailureReasons(startDate, endDate);
        analytics.setFailureReasons(failureReasons);

        // Daily trends
        List<DeliveryStatsDTO> dailyTrends = getDailyDeliveryTrends(startDate, endDate);
        analytics.setDailyTrends(dailyTrends);

        LOG.debug("Generated analytics with {} total notifications and {:.2f}% delivery rate",
                totalNotifications, deliveryRate);

        return analytics;
    }

    /**
     * Get delivery statistics summary
     */
    public Map<DeliveryStatus, Long> getDeliveryStatistics(Instant startDate, Instant endDate) {
        List<Object[]> results = notificationDeliveryRepository.getDeliveryStatistics(startDate, endDate);
        Map<DeliveryStatus, Long> statistics = new HashMap<>();

        // Initialize all statuses with 0
        for (DeliveryStatus status : DeliveryStatus.values()) {
            statistics.put(status, 0L);
        }

        // Fill in actual values
        for (Object[] result : results) {
            DeliveryStatus status = (DeliveryStatus) result[0];
            Long count = (Long) result[1];
            statistics.put(status, count);
        }

        return statistics;
    }

    /**
     * Get delivery statistics by notification type
     */
    public Map<NotificationType, DeliveryStatsDTO> getDeliveryStatisticsByType(Instant startDate, Instant endDate) {
        List<Object[]> results = notificationDeliveryRepository.getDeliveryStatisticsByType(startDate, endDate);
        Map<NotificationType, Map<DeliveryStatus, Long>> rawStats = new HashMap<>();

        // Group results by type and status
        for (Object[] result : results) {
            NotificationType type = (NotificationType) result[0];
            DeliveryStatus status = (DeliveryStatus) result[1];
            Long count = (Long) result[2];

            rawStats.computeIfAbsent(type, k -> new HashMap<>()).put(status, count);
        }

        // Convert to DeliveryStatsDTO
        Map<NotificationType, DeliveryStatsDTO> statsByType = new HashMap<>();
        for (Map.Entry<NotificationType, Map<DeliveryStatus, Long>> entry : rawStats.entrySet()) {
            DeliveryStatsDTO stats = createDeliveryStatsDTO(entry.getValue());
            statsByType.put(entry.getKey(), stats);
        }

        return statsByType;
    }

    /**
     * Get delivery statistics by channel
     */
    public Map<String, DeliveryStatsDTO> getDeliveryStatisticsByChannel(Instant startDate, Instant endDate) {
        List<Object[]> results = notificationDeliveryRepository.getDeliveryStatisticsByChannel(startDate, endDate);
        Map<String, Map<DeliveryStatus, Long>> rawStats = new HashMap<>();

        // Group results by channel and status
        for (Object[] result : results) {
            String channel = (String) result[0];
            DeliveryStatus status = (DeliveryStatus) result[1];
            Long count = (Long) result[2];

            rawStats.computeIfAbsent(channel, k -> new HashMap<>()).put(status, count);
        }

        // Convert to DeliveryStatsDTO
        Map<String, DeliveryStatsDTO> statsByChannel = new HashMap<>();
        for (Map.Entry<String, Map<DeliveryStatus, Long>> entry : rawStats.entrySet()) {
            DeliveryStatsDTO stats = createDeliveryStatsDTO(entry.getValue());
            statsByChannel.put(entry.getKey(), stats);
        }

        return statsByChannel;
    }

    /**
     * Get average delivery time in seconds
     */
    public double getAverageDeliveryTime(Instant startDate, Instant endDate) {
        Double avgTime = notificationDeliveryRepository.getAverageDeliveryTime(
                DeliveryStatus.DELIVERED, startDate, endDate);
        return avgTime != null ? avgTime : 0.0;
    }

    /**
     * Get delivery rate for a specific period
     */
    public double getDeliveryRate(Instant startDate, Instant endDate) {
        Double rate = notificationDeliveryRepository.getDeliveryRate(startDate, endDate);
        return rate != null ? rate : 0.0;
    }

    /**
     * Get delivery rates by notification type
     */
    public Map<NotificationType, Double> getDeliveryRatesByType(Instant startDate, Instant endDate) {
        List<Object[]> results = notificationDeliveryRepository.getDeliveryRateByType(startDate, endDate);
        Map<NotificationType, Double> rates = new HashMap<>();

        for (Object[] result : results) {
            NotificationType type = (NotificationType) result[0];
            Double rate = (Double) result[1];
            rates.put(type, rate != null ? rate : 0.0);
        }

        return rates;
    }

    /**
     * Get failure reasons analysis
     */
    public Map<String, Long> getFailureReasons(Instant startDate, Instant endDate) {
        // This would require a custom query to group by failure reasons
        // For now, return a placeholder implementation
        Map<String, Long> failureReasons = new HashMap<>();
        failureReasons.put("Network timeout", 5L);
        failureReasons.put("Invalid email address", 3L);
        failureReasons.put("Service unavailable", 2L);
        return failureReasons;
    }

    /**
     * Get daily delivery trends
     */
    public List<DeliveryStatsDTO> getDailyDeliveryTrends(Instant startDate, Instant endDate) {
        List<DeliveryStatsDTO> trends = new ArrayList<>();

        // Generate daily stats for the date range
        Instant currentDate = startDate.truncatedTo(ChronoUnit.DAYS);
        while (currentDate.isBefore(endDate)) {
            Instant nextDate = currentDate.plus(1, ChronoUnit.DAYS);

            Map<DeliveryStatus, Long> dailyStats = getDeliveryStatistics(currentDate, nextDate);
            DeliveryStatsDTO dayStats = createDeliveryStatsDTO(dailyStats);
            dayStats.setDate(currentDate);

            trends.add(dayStats);
            currentDate = nextDate;
        }

        return trends;
    }

    /**
     * Get notification volume trends
     */
    public Map<String, Long> getNotificationVolumeTrends(Instant startDate, Instant endDate, String groupBy) {
        Map<String, Long> trends = new HashMap<>();

        switch (groupBy.toLowerCase()) {
            case "hour":
                trends = getHourlyVolumeTrends(startDate, endDate);
                break;
            case "day":
                trends = getDailyVolumeTrends(startDate, endDate);
                break;
            case "week":
                trends = getWeeklyVolumeTrends(startDate, endDate);
                break;
            default:
                trends = getDailyVolumeTrends(startDate, endDate);
        }

        return trends;
    }

    /**
     * Get top recipients by notification count
     */
    public List<Map<String, Object>> getTopRecipients(Instant startDate, Instant endDate, int limit) {
        // This would require a custom query to group by recipient
        // For now, return a placeholder implementation
        List<Map<String, Object>> topRecipients = new ArrayList<>();

        Map<String, Object> recipient1 = new HashMap<>();
        recipient1.put("recipientId", 1L);
        recipient1.put("recipientEmail", "student1@example.com");
        recipient1.put("notificationCount", 25L);
        topRecipients.add(recipient1);

        Map<String, Object> recipient2 = new HashMap<>();
        recipient2.put("recipientId", 2L);
        recipient2.put("recipientEmail", "student2@example.com");
        recipient2.put("notificationCount", 20L);
        topRecipients.add(recipient2);

        return topRecipients.stream().limit(limit).collect(Collectors.toList());
    }

    /**
     * Get system health metrics
     */
    public Map<String, Object> getSystemHealthMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        Instant now = Instant.now();
        Instant last24Hours = now.minus(24, ChronoUnit.HOURS);

        // Current queue size
        long pendingCount = notificationDeliveryRepository.countByStatus(DeliveryStatus.PENDING);
        long processingCount = notificationDeliveryRepository.countByStatus(DeliveryStatus.PROCESSING);
        long failedCount = notificationDeliveryRepository.countByStatus(DeliveryStatus.FAILED);

        metrics.put("pendingNotifications", pendingCount);
        metrics.put("processingNotifications", processingCount);
        metrics.put("failedNotifications", failedCount);

        // 24-hour metrics
        double deliveryRate24h = getDeliveryRate(last24Hours, now);
        double avgDeliveryTime24h = getAverageDeliveryTime(last24Hours, now);

        metrics.put("deliveryRate24h", deliveryRate24h);
        metrics.put("averageDeliveryTime24h", avgDeliveryTime24h);

        // System status
        String systemStatus = "HEALTHY";
        if (pendingCount > 1000 || failedCount > 100 || deliveryRate24h < 90.0) {
            systemStatus = "WARNING";
        }
        if (pendingCount > 5000 || failedCount > 500 || deliveryRate24h < 70.0) {
            systemStatus = "CRITICAL";
        }

        metrics.put("systemStatus", systemStatus);
        metrics.put("lastUpdated", now);

        return metrics;
    }

    // Helper methods

    private DeliveryStatsDTO createDeliveryStatsDTO(Map<DeliveryStatus, Long> statusCounts) {
        DeliveryStatsDTO stats = new DeliveryStatsDTO();

        long total = statusCounts.values().stream().mapToLong(Long::longValue).sum();
        long successful = statusCounts.getOrDefault(DeliveryStatus.SENT, 0L) +
                statusCounts.getOrDefault(DeliveryStatus.DELIVERED, 0L);
        long failed = statusCounts.getOrDefault(DeliveryStatus.FAILED, 0L);
        long pending = statusCounts.getOrDefault(DeliveryStatus.PENDING, 0L);

        stats.setTotal(total);
        stats.setSuccessful(successful);
        stats.setFailed(failed);
        stats.setPending(pending);
        stats.setDeliveryRate(total > 0 ? (double) successful / total * 100 : 0.0);

        return stats;
    }

    private Map<String, Long> getHourlyVolumeTrends(Instant startDate, Instant endDate) {
        // Placeholder implementation - would need custom query
        Map<String, Long> trends = new HashMap<>();
        for (int hour = 0; hour < 24; hour++) {
            trends.put(String.format("%02d:00", hour), (long) (Math.random() * 100));
        }
        return trends;
    }

    private Map<String, Long> getDailyVolumeTrends(Instant startDate, Instant endDate) {
        // Placeholder implementation - would need custom query
        Map<String, Long> trends = new HashMap<>();
        Instant current = startDate.truncatedTo(ChronoUnit.DAYS);
        while (current.isBefore(endDate)) {
            trends.put(current.toString().substring(0, 10), (long) (Math.random() * 500));
            current = current.plus(1, ChronoUnit.DAYS);
        }
        return trends;
    }

    private Map<String, Long> getWeeklyVolumeTrends(Instant startDate, Instant endDate) {
        // Placeholder implementation - would need custom query
        Map<String, Long> trends = new HashMap<>();
        Instant current = startDate.truncatedTo(ChronoUnit.DAYS);
        int week = 1;
        while (current.isBefore(endDate)) {
            trends.put("Week " + week, (long) (Math.random() * 2000));
            current = current.plus(7, ChronoUnit.DAYS);
            week++;
        }
        return trends;
    }
}