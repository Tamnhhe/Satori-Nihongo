package com.satori.platform.web.rest;

import com.satori.platform.domain.enumeration.DeliveryStatus;
import com.satori.platform.service.NotificationAnalyticsService;
import com.satori.platform.service.NotificationDeliveryService;
import com.satori.platform.service.dto.NotificationAnalyticsDTO;
import com.satori.platform.service.dto.DeliveryStatsDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;

/**
 * REST controller for notification analytics and delivery monitoring.
 */
@RestController
@RequestMapping("/api/admin/notification-analytics")
@PreAuthorize("hasRole('ADMIN')")
public class NotificationAnalyticsResource {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationAnalyticsResource.class);

    private final NotificationAnalyticsService notificationAnalyticsService;
    private final NotificationDeliveryService notificationDeliveryService;

    public NotificationAnalyticsResource(
            NotificationAnalyticsService notificationAnalyticsService,
            NotificationDeliveryService notificationDeliveryService) {
        this.notificationAnalyticsService = notificationAnalyticsService;
        this.notificationDeliveryService = notificationDeliveryService;
    }

    @GetMapping("/analytics")
    public ResponseEntity<NotificationAnalyticsDTO> getNotificationAnalytics(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {

        LOG.debug("REST request to get notification analytics for period: {} to {}", startDate, endDate);

        if (endDate == null) {
            endDate = Instant.now();
        }
        if (startDate == null) {
            startDate = endDate.minus(30, ChronoUnit.DAYS);
        }

        NotificationAnalyticsDTO analytics = notificationAnalyticsService.getNotificationAnalytics(startDate, endDate);
        return ResponseEntity.ok(analytics);
    }

    @GetMapping("/delivery-rate")
    public ResponseEntity<Double> getDeliveryRate(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant endDate) {

        LOG.debug("REST request to get delivery rate for period: {} to {}", startDate, endDate);

        if (endDate == null) {
            endDate = Instant.now();
        }
        if (startDate == null) {
            startDate = endDate.minus(24, ChronoUnit.HOURS);
        }

        double deliveryRate = notificationAnalyticsService.getDeliveryRate(startDate, endDate);
        return ResponseEntity.ok(deliveryRate);
    }

    @GetMapping("/system-health")
    public ResponseEntity<Map<String, Object>> getSystemHealthMetrics() {
        LOG.debug("REST request to get notification system health metrics");

        Map<String, Object> healthMetrics = notificationAnalyticsService.getSystemHealthMetrics();
        return ResponseEntity.ok(healthMetrics);
    }
}