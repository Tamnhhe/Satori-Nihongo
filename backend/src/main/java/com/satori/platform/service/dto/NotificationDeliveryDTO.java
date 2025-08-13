package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DeliveryStatus;
import com.satori.platform.domain.enumeration.NotificationType;

import java.time.Instant;
import java.util.Map;

/**
 * DTO for notification delivery tracking and status
 */
public class NotificationDeliveryDTO {

    private Long id;

    private Long recipientId;

    private String recipientEmail;

    private String recipientName;

    private NotificationType notificationType;

    private String deliveryChannel;

    private DeliveryStatus status;

    private String subject;

    private String content;

    private Instant scheduledAt;

    private Instant sentAt;

    private Instant deliveredAt;

    private Instant failedAt;

    private String failureReason;

    private Integer retryCount;

    private Integer maxRetries;

    private Instant nextRetryAt;

    private String externalId;

    private Map<String, Object> metadata;

    private Instant createdAt;

    private Instant updatedAt;

    // Constructors
    public NotificationDeliveryDTO() {
    }

    public NotificationDeliveryDTO(Long recipientId, String recipientEmail, NotificationType notificationType,
            String deliveryChannel, DeliveryStatus status) {
        this.recipientId = recipientId;
        this.recipientEmail = recipientEmail;
        this.notificationType = notificationType;
        this.deliveryChannel = deliveryChannel;
        this.status = status;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public String getDeliveryChannel() {
        return deliveryChannel;
    }

    public void setDeliveryChannel(String deliveryChannel) {
        this.deliveryChannel = deliveryChannel;
    }

    public DeliveryStatus getStatus() {
        return status;
    }

    public void setStatus(DeliveryStatus status) {
        this.status = status;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(Instant scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public Instant getSentAt() {
        return sentAt;
    }

    public void setSentAt(Instant sentAt) {
        this.sentAt = sentAt;
    }

    public Instant getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(Instant deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    public Instant getFailedAt() {
        return failedAt;
    }

    public void setFailedAt(Instant failedAt) {
        this.failedAt = failedAt;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public Integer getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
    }

    public Integer getMaxRetries() {
        return maxRetries;
    }

    public void setMaxRetries(Integer maxRetries) {
        this.maxRetries = maxRetries;
    }

    public Instant getNextRetryAt() {
        return nextRetryAt;
    }

    public void setNextRetryAt(Instant nextRetryAt) {
        this.nextRetryAt = nextRetryAt;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public Map<String, Object> getMetadata() {
        return metadata;
    }

    public void setMetadata(Map<String, Object> metadata) {
        this.metadata = metadata;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Helper methods
    public boolean canRetry() {
        return retryCount != null && maxRetries != null &&
                retryCount < maxRetries && status == DeliveryStatus.FAILED;
    }

    public boolean isDelivered() {
        return status == DeliveryStatus.DELIVERED || status == DeliveryStatus.SENT;
    }

    public boolean isFailed() {
        return status == DeliveryStatus.FAILED || status == DeliveryStatus.EXPIRED;
    }

    @Override
    public String toString() {
        return "NotificationDeliveryDTO{" +
                "id=" + id +
                ", recipientEmail='" + recipientEmail + '\'' +
                ", notificationType=" + notificationType +
                ", deliveryChannel='" + deliveryChannel + '\'' +
                ", status=" + status +
                ", retryCount=" + retryCount +
                '}';
    }
}