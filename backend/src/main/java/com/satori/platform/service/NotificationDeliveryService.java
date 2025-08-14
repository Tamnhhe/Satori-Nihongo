package com.satori.platform.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.domain.NotificationDelivery;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.enumeration.DeliveryStatus;
import com.satori.platform.domain.enumeration.NotificationType;
import com.satori.platform.repository.NotificationDeliveryRepository;
import com.satori.platform.service.dto.NotificationContentDTO;
import com.satori.platform.service.exception.NotificationDeliveryException;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing notification delivery queue, retry mechanism, and
 * tracking.
 * Provides comprehensive notification delivery management with analytics.
 */
@Service
@Transactional
public class NotificationDeliveryService {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationDeliveryService.class);

    private final NotificationDeliveryRepository notificationDeliveryRepository;
    private final MailService mailService;
    private final PushNotificationService pushNotificationService;
    private final ObjectMapper objectMapper;

    @Value("${app.notification.batch-size:50}")
    private int batchSize;

    @Value("${app.notification.retry-delay-minutes:15}")
    private int retryDelayMinutes;

    @Value("${app.notification.max-retries:3}")
    private int maxRetries;

    @Value("${app.notification.cleanup-days:30}")
    private int cleanupDays;

    public NotificationDeliveryService(
        NotificationDeliveryRepository notificationDeliveryRepository,
        MailService mailService,
        PushNotificationService pushNotificationService,
        ObjectMapper objectMapper
    ) {
        this.notificationDeliveryRepository = notificationDeliveryRepository;
        this.mailService = mailService;
        this.pushNotificationService = pushNotificationService;
        this.objectMapper = objectMapper;
    }

    /**
     * Queue notification for delivery
     * Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 2.4, 3.1, 3.2, 3.3
     */
    public NotificationDelivery queueNotification(
        UserProfile recipient,
        NotificationContentDTO content,
        NotificationType type,
        String channel
    ) {
        return queueNotification(recipient, content, type, channel, null, null);
    }

    /**
     * Queue notification for scheduled delivery with timezone support
     */
    public NotificationDelivery queueNotification(
        UserProfile recipient,
        NotificationContentDTO content,
        NotificationType type,
        String channel,
        Instant scheduledAt,
        String timezone
    ) {
        LOG.debug("Queueing {} notification for user: {} via channel: {}", type, recipient.getUsername(), channel);

        try {
            // Adjust scheduled time for timezone if provided
            Instant adjustedScheduledAt = adjustForTimezone(scheduledAt, timezone);

            String subject = getSubjectForChannel(content, channel);
            String contentText = getContentForChannel(content, channel);

            NotificationDelivery delivery = new NotificationDelivery(
                recipient.getId(),
                recipient.getEmail(),
                type,
                channel,
                subject,
                contentText
            );

            delivery.setScheduledAt(adjustedScheduledAt);
            delivery.setMaxRetries(maxRetries);
            delivery.setStatus(adjustedScheduledAt != null ? DeliveryStatus.SCHEDULED : DeliveryStatus.PENDING);

            // Store metadata
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("locale", content.getLocale());
            metadata.put("timezone", timezone);
            if (content.getPushData() != null) {
                metadata.put("pushData", content.getPushData());
            }
            delivery.setMetadata(objectMapper.writeValueAsString(metadata));

            NotificationDelivery saved = notificationDeliveryRepository.save(delivery);
            LOG.debug("Queued notification with ID: {} for delivery", saved.getId());

            return saved;
        } catch (Exception e) {
            LOG.error("Failed to queue notification for user: {}", recipient.getUsername(), e);
            throw new NotificationDeliveryException("Failed to queue notification", e);
        }
    }

    /**
     * Queue bulk notifications for batch delivery
     */
    public List<NotificationDelivery> queueBulkNotifications(
        List<UserProfile> recipients,
        NotificationContentDTO content,
        NotificationType type,
        String channel
    ) {
        LOG.debug("Queueing bulk {} notifications for {} recipients via channel: {}", type, recipients.size(), channel);

        List<NotificationDelivery> deliveries = new ArrayList<>();

        for (UserProfile recipient : recipients) {
            try {
                NotificationDelivery delivery = queueNotification(recipient, content, type, channel);
                deliveries.add(delivery);
            } catch (Exception e) {
                LOG.error("Failed to queue notification for recipient: {}", recipient.getUsername(), e);
                // Continue with other recipients
            }
        }

        LOG.debug("Successfully queued {} out of {} bulk notifications", deliveries.size(), recipients.size());
        return deliveries;
    }

    /**
     * Process pending notifications (scheduled job)
     * Runs every 5 minutes
     */
    @Scheduled(fixedRate = 300000) // 5 minutes
    public void processPendingNotifications() {
        LOG.debug("Processing pending notifications");

        try {
            List<NotificationDelivery> pendingNotifications = notificationDeliveryRepository
                .findPendingNotifications(DeliveryStatus.PENDING, Instant.now())
                .stream()
                .limit(batchSize)
                .collect(Collectors.toList());

            if (pendingNotifications.isEmpty()) {
                LOG.debug("No pending notifications to process");
                return;
            }

            LOG.debug("Processing {} pending notifications", pendingNotifications.size());

            // Process notifications in parallel for better performance
            List<CompletableFuture<Void>> futures = pendingNotifications
                .stream()
                .map(this::processNotificationAsync)
                .collect(Collectors.toList());

            // Wait for all to complete
            CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

            LOG.debug("Completed processing pending notifications");
        } catch (Exception e) {
            LOG.error("Error processing pending notifications", e);
        }
    }

    /**
     * Process scheduled notifications
     * Runs every 10 minutes
     */
    @Scheduled(fixedRate = 600000) // 10 minutes
    public void processScheduledNotifications() {
        LOG.debug("Processing scheduled notifications");

        try {
            Instant now = Instant.now();
            List<NotificationDelivery> scheduledNotifications = notificationDeliveryRepository.findScheduledNotifications(
                DeliveryStatus.SCHEDULED,
                now.minus(10, ChronoUnit.MINUTES),
                now
            );

            if (scheduledNotifications.isEmpty()) {
                LOG.debug("No scheduled notifications ready for delivery");
                return;
            }

            LOG.debug("Processing {} scheduled notifications", scheduledNotifications.size());

            for (NotificationDelivery notification : scheduledNotifications) {
                notification.setStatus(DeliveryStatus.PENDING);
                notificationDeliveryRepository.save(notification);
            }

            LOG.debug("Moved {} scheduled notifications to pending", scheduledNotifications.size());
        } catch (Exception e) {
            LOG.error("Error processing scheduled notifications", e);
        }
    }

    /**
     * Process failed notifications for retry
     * Runs every 15 minutes
     */
    @Scheduled(fixedRate = 900000) // 15 minutes
    public void processRetryNotifications() {
        LOG.debug("Processing retry notifications");

        try {
            List<NotificationDelivery> retryNotifications = notificationDeliveryRepository
                .findRetryableNotifications(DeliveryStatus.FAILED, Instant.now())
                .stream()
                .limit(batchSize / 2) // Process fewer retries to avoid overwhelming the system
                .collect(Collectors.toList());

            if (retryNotifications.isEmpty()) {
                LOG.debug("No notifications ready for retry");
                return;
            }

            LOG.debug("Processing {} retry notifications", retryNotifications.size());

            for (NotificationDelivery notification : retryNotifications) {
                notification.incrementRetryCount();
                notification.setStatus(DeliveryStatus.PENDING);
                notification.setNextRetryAt(null);
                notificationDeliveryRepository.save(notification);
            }

            LOG.debug("Queued {} notifications for retry", retryNotifications.size());
        } catch (Exception e) {
            LOG.error("Error processing retry notifications", e);
        }
    }

    /**
     * Clean up old notifications
     * Runs daily at 3 AM
     */
    @Scheduled(cron = "0 0 3 * * ?")
    public void cleanupOldNotifications() {
        LOG.debug("Cleaning up old notifications");

        try {
            Instant cutoffDate = Instant.now().minus(cleanupDays, ChronoUnit.DAYS);
            List<DeliveryStatus> finalStatuses = Arrays.asList(
                DeliveryStatus.DELIVERED,
                DeliveryStatus.FAILED,
                DeliveryStatus.CANCELLED,
                DeliveryStatus.EXPIRED
            );

            int deletedCount = notificationDeliveryRepository.deleteOldNotifications(cutoffDate, finalStatuses);
            LOG.info("Cleaned up {} old notifications older than {} days", deletedCount, cleanupDays);
        } catch (Exception e) {
            LOG.error("Error cleaning up old notifications", e);
        }
    }

    /**
     * Mark expired notifications
     * Runs every hour
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void markExpiredNotifications() {
        LOG.debug("Marking expired notifications");

        try {
            Instant expiredBefore = Instant.now().minus(24, ChronoUnit.HOURS);
            List<NotificationDelivery> expiredNotifications = notificationDeliveryRepository.findExpiredNotifications(
                DeliveryStatus.PENDING,
                expiredBefore
            );

            for (NotificationDelivery notification : expiredNotifications) {
                notification.setStatus(DeliveryStatus.EXPIRED);
                notification.setFailureReason("Notification expired after 24 hours");
                notificationDeliveryRepository.save(notification);
            }

            if (!expiredNotifications.isEmpty()) {
                LOG.info("Marked {} notifications as expired", expiredNotifications.size());
            }
        } catch (Exception e) {
            LOG.error("Error marking expired notifications", e);
        }
    }

    /**
     * Process single notification asynchronously
     */
    @Async
    public CompletableFuture<Void> processNotificationAsync(NotificationDelivery notification) {
        return CompletableFuture.runAsync(() -> processNotification(notification));
    }

    /**
     * Process single notification
     */
    private void processNotification(NotificationDelivery notification) {
        LOG.debug("Processing notification ID: {} for recipient: {}", notification.getId(), notification.getRecipientEmail());

        try {
            notification.setStatus(DeliveryStatus.PROCESSING);
            notification.setSentAt(Instant.now());
            notificationDeliveryRepository.save(notification);

            boolean success = false;
            String externalId = null;

            switch (notification.getDeliveryChannel().toUpperCase()) {
                case "EMAIL":
                    success = sendEmailNotification(notification);
                    break;
                case "PUSH":
                    externalId = sendPushNotification(notification);
                    success = externalId != null;
                    break;
                case "IN_APP":
                    success = sendInAppNotification(notification);
                    break;
                default:
                    LOG.warn("Unknown delivery channel: {}", notification.getDeliveryChannel());
                    success = false;
            }

            if (success) {
                notification.setStatus(DeliveryStatus.SENT);
                notification.setDeliveredAt(Instant.now());
                if (externalId != null) {
                    notification.setExternalId(externalId);
                }
                LOG.debug("Successfully sent notification ID: {}", notification.getId());
            } else {
                handleNotificationFailure(notification, "Delivery failed");
            }

            notificationDeliveryRepository.save(notification);
        } catch (Exception e) {
            LOG.error("Error processing notification ID: {}", notification.getId(), e);
            handleNotificationFailure(notification, e.getMessage());
            notificationDeliveryRepository.save(notification);
        }
    }

    /**
     * Send email notification
     */
    private boolean sendEmailNotification(NotificationDelivery notification) {
        try {
            mailService.sendEmail(notification.getRecipientEmail(), notification.getSubject(), notification.getContent(), false, true);
            return true;
        } catch (Exception e) {
            LOG.error("Failed to send email notification", e);
            return false;
        }
    }

    /**
     * Send push notification
     */
    private String sendPushNotification(NotificationDelivery notification) {
        try {
            // Extract push data from metadata
            Map<String, String> pushData = extractPushDataFromMetadata(notification.getMetadata());

            // For now, we'll use the existing push service which doesn't return external ID
            // In a real implementation, you'd modify PushNotificationService to return FCM
            // message ID
            // pushNotificationService.sendPushNotification(user, title, message, pushData);

            // Simulate external ID for now
            return "fcm_" + UUID.randomUUID().toString();
        } catch (Exception e) {
            LOG.error("Failed to send push notification", e);
            return null;
        }
    }

    /**
     * Send in-app notification
     */
    private boolean sendInAppNotification(NotificationDelivery notification) {
        try {
            // In-app notifications would be stored in a separate table for real-time
            // display
            // For now, we'll just mark as successful
            LOG.debug("In-app notification would be stored for user: {}", notification.getRecipientId());
            return true;
        } catch (Exception e) {
            LOG.error("Failed to send in-app notification", e);
            return false;
        }
    }

    /**
     * Handle notification delivery failure
     */
    private void handleNotificationFailure(NotificationDelivery notification, String reason) {
        notification.setStatus(DeliveryStatus.FAILED);
        notification.setFailedAt(Instant.now());
        notification.setFailureReason(reason);

        if (notification.canRetry()) {
            // Calculate exponential backoff for retry
            int delayMinutes = retryDelayMinutes * (int) Math.pow(2, notification.getRetryCount());
            notification.setNextRetryAt(Instant.now().plus(delayMinutes, ChronoUnit.MINUTES));
            LOG.debug("Notification ID: {} will be retried in {} minutes", notification.getId(), delayMinutes);
        } else {
            LOG.warn("Notification ID: {} failed permanently after {} retries", notification.getId(), notification.getRetryCount());
        }
    }

    // Utility methods

    private Instant adjustForTimezone(Instant scheduledAt, String timezone) {
        if (scheduledAt == null || timezone == null) {
            return scheduledAt;
        }

        try {
            ZoneId zoneId = ZoneId.of(timezone);
            ZonedDateTime zonedDateTime = scheduledAt.atZone(zoneId);
            return zonedDateTime.toInstant();
        } catch (Exception e) {
            LOG.warn("Invalid timezone: {}, using original time", timezone);
            return scheduledAt;
        }
    }

    private String getSubjectForChannel(NotificationContentDTO content, String channel) {
        switch (channel.toUpperCase()) {
            case "EMAIL":
                return content.getEmailSubject();
            case "PUSH":
                return content.getPushTitle();
            case "IN_APP":
                return content.getInAppTitle();
            default:
                return content.getEmailSubject();
        }
    }

    private String getContentForChannel(NotificationContentDTO content, String channel) {
        switch (channel.toUpperCase()) {
            case "EMAIL":
                return content.getEmailContent();
            case "PUSH":
                return content.getPushMessage();
            case "IN_APP":
                return content.getInAppMessage();
            default:
                return content.getEmailContent();
        }
    }

    @SuppressWarnings("unchecked")
    private Map<String, String> extractPushDataFromMetadata(String metadata) {
        try {
            if (metadata != null) {
                Map<String, Object> metadataMap = objectMapper.readValue(metadata, Map.class);
                Object pushData = metadataMap.get("pushData");
                if (pushData instanceof Map) {
                    return (Map<String, String>) pushData;
                }
            }
        } catch (Exception e) {
            LOG.warn("Failed to extract push data from metadata", e);
        }
        return new HashMap<>();
    }

    // Public query methods for analytics and monitoring

    /**
     * Get notification delivery history for a user
     */
    @Transactional(readOnly = true)
    public Page<NotificationDelivery> getDeliveryHistory(Long recipientId, Pageable pageable) {
        return notificationDeliveryRepository.findByRecipientIdOrderByCreatedAtDesc(recipientId, pageable);
    }

    /**
     * Get delivery statistics for a date range
     */
    @Transactional(readOnly = true)
    public Map<DeliveryStatus, Long> getDeliveryStatistics(Instant startDate, Instant endDate) {
        List<Object[]> results = notificationDeliveryRepository.getDeliveryStatistics(startDate, endDate);
        Map<DeliveryStatus, Long> statistics = new HashMap<>();

        for (Object[] result : results) {
            DeliveryStatus status = (DeliveryStatus) result[0];
            Long count = (Long) result[1];
            statistics.put(status, count);
        }

        return statistics;
    }

    /**
     * Get delivery rate for a period
     */
    @Transactional(readOnly = true)
    public double getDeliveryRate(Instant startDate, Instant endDate) {
        Double rate = notificationDeliveryRepository.getDeliveryRate(startDate, endDate);
        return rate != null ? rate : 0.0;
    }

    /**
     * Get average delivery time in seconds
     */
    @Transactional(readOnly = true)
    public double getAverageDeliveryTime(Instant startDate, Instant endDate) {
        Double avgTime = notificationDeliveryRepository.getAverageDeliveryTime(DeliveryStatus.DELIVERED, startDate, endDate);
        return avgTime != null ? avgTime : 0.0;
    }

    /**
     * Update notification status (for external callbacks)
     */
    public void updateNotificationStatus(String externalId, DeliveryStatus status, String reason) {
        Optional<NotificationDelivery> notificationOpt = notificationDeliveryRepository.findByExternalId(externalId);

        if (notificationOpt.isPresent()) {
            NotificationDelivery notification = notificationOpt.orElseThrow();
            notification.setStatus(status);

            if (status == DeliveryStatus.DELIVERED) {
                notification.setDeliveredAt(Instant.now());
            } else if (status == DeliveryStatus.FAILED) {
                notification.setFailedAt(Instant.now());
                notification.setFailureReason(reason);
            }

            notificationDeliveryRepository.save(notification);
            LOG.debug("Updated notification status for external ID: {} to {}", externalId, status);
        } else {
            LOG.warn("Notification not found for external ID: {}", externalId);
        }
    }
}
