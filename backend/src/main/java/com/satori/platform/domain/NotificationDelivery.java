package com.satori.platform.domain;

import com.satori.platform.domain.enumeration.NotificationType;
import com.satori.platform.domain.enumeration.DeliveryStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import java.io.Serializable;
import java.time.Instant;

/**
 * Entity for tracking notification delivery status and history.
 * Provides audit trail and retry mechanism for notification delivery.
 */
@Entity
@Table(name = "notification_delivery")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class NotificationDelivery implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "recipient_id", nullable = false)
    private Long recipientId;

    @NotNull
    @Size(max = 255)
    @Column(name = "recipient_email", length = 255, nullable = false)
    private String recipientEmail;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false)
    private NotificationType notificationType;

    @NotNull
    @Size(max = 100)
    @Column(name = "delivery_channel", length = 100, nullable = false)
    private String deliveryChannel; // EMAIL, PUSH, IN_APP

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private DeliveryStatus status;

    @Size(max = 500)
    @Column(name = "subject", length = 500)
    private String subject;

    @Lob
    @Column(name = "content")
    private String content;

    @Column(name = "scheduled_at")
    private Instant scheduledAt;

    @Column(name = "sent_at")
    private Instant sentAt;

    @Column(name = "delivered_at")
    private Instant deliveredAt;

    @Column(name = "failed_at")
    private Instant failedAt;

    @Size(max = 1000)
    @Column(name = "failure_reason", length = 1000)
    private String failureReason;

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "max_retries")
    private Integer maxRetries = 3;

    @Column(name = "next_retry_at")
    private Instant nextRetryAt;

    @Size(max = 50)
    @Column(name = "external_id", length = 50)
    private String externalId; // FCM message ID, email provider ID, etc.

    @Lob
    @Column(name = "metadata")
    private String metadata; // JSON metadata for additional context

    @Column(name = "created_at")
    private Instant createdAt;

    @Column(name = "updated_at")
    private Instant updatedAt;

    @Size(max = 1000)
    @Column(name = "error_message", length = 1000)
    private String errorMessage;

    // Constructors
    public NotificationDelivery() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        this.status = DeliveryStatus.PENDING;
    }

    public NotificationDelivery(Long recipientId, String recipientEmail, NotificationType notificationType,
            String deliveryChannel, String subject, String content) {
        this();
        this.recipientId = recipientId;
        this.recipientEmail = recipientEmail;
        this.notificationType = notificationType;
        this.deliveryChannel = deliveryChannel;
        this.subject = subject;
        this.content = content;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public NotificationDelivery id(Long id) {
        this.setId(id);
        return this;
    }

    public Long getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(Long recipientId) {
        this.recipientId = recipientId;
    }

    public NotificationDelivery recipientId(Long recipientId) {
        this.setRecipientId(recipientId);
        return this;
    }

    public String getRecipientEmail() {
        return recipientEmail;
    }

    public void setRecipientEmail(String recipientEmail) {
        this.recipientEmail = recipientEmail;
    }

    public NotificationDelivery recipientEmail(String recipientEmail) {
        this.setRecipientEmail(recipientEmail);
        return this;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public NotificationDelivery notificationType(NotificationType notificationType) {
        this.setNotificationType(notificationType);
        return this;
    }

    public String getDeliveryChannel() {
        return deliveryChannel;
    }

    public void setDeliveryChannel(String deliveryChannel) {
        this.deliveryChannel = deliveryChannel;
    }

    public NotificationDelivery deliveryChannel(String deliveryChannel) {
        this.setDeliveryChannel(deliveryChannel);
        return this;
    }

    public DeliveryStatus getStatus() {
        return status;
    }

    public void setStatus(DeliveryStatus status) {
        this.status = status;
        this.updatedAt = Instant.now();
    }

    public NotificationDelivery status(DeliveryStatus status) {
        this.setStatus(status);
        return this;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public NotificationDelivery subject(String subject) {
        this.setSubject(subject);
        return this;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public NotificationDelivery content(String content) {
        this.setContent(content);
        return this;
    }

    public Instant getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(Instant scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public NotificationDelivery scheduledAt(Instant scheduledAt) {
        this.setScheduledAt(scheduledAt);
        return this;
    }

    public Instant getSentAt() {
        return sentAt;
    }

    public void setSentAt(Instant sentAt) {
        this.sentAt = sentAt;
    }

    public NotificationDelivery sentAt(Instant sentAt) {
        this.setSentAt(sentAt);
        return this;
    }

    public Instant getDeliveredAt() {
        return deliveredAt;
    }

    public void setDeliveredAt(Instant deliveredAt) {
        this.deliveredAt = deliveredAt;
    }

    public NotificationDelivery deliveredAt(Instant deliveredAt) {
        this.setDeliveredAt(deliveredAt);
        return this;
    }

    public Instant getFailedAt() {
        return failedAt;
    }

    public void setFailedAt(Instant failedAt) {
        this.failedAt = failedAt;
    }

    public NotificationDelivery failedAt(Instant failedAt) {
        this.setFailedAt(failedAt);
        return this;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }

    public NotificationDelivery failureReason(String failureReason) {
        this.setFailureReason(failureReason);
        return this;
    }

    public Integer getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
    }

    public NotificationDelivery retryCount(Integer retryCount) {
        this.setRetryCount(retryCount);
        return this;
    }

    public Integer getMaxRetries() {
        return maxRetries;
    }

    public void setMaxRetries(Integer maxRetries) {
        this.maxRetries = maxRetries;
    }

    public NotificationDelivery maxRetries(Integer maxRetries) {
        this.setMaxRetries(maxRetries);
        return this;
    }

    public Instant getNextRetryAt() {
        return nextRetryAt;
    }

    public void setNextRetryAt(Instant nextRetryAt) {
        this.nextRetryAt = nextRetryAt;
    }

    public NotificationDelivery nextRetryAt(Instant nextRetryAt) {
        this.setNextRetryAt(nextRetryAt);
        return this;
    }

    public String getExternalId() {
        return externalId;
    }

    public void setExternalId(String externalId) {
        this.externalId = externalId;
    }

    public NotificationDelivery externalId(String externalId) {
        this.setExternalId(externalId);
        return this;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public NotificationDelivery metadata(String metadata) {
        this.setMetadata(metadata);
        return this;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public NotificationDelivery createdAt(Instant createdAt) {
        this.setCreatedAt(createdAt);
        return this;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public NotificationDelivery updatedAt(Instant updatedAt) {
        this.setUpdatedAt(updatedAt);
        return this;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }

    public NotificationDelivery errorMessage(String errorMessage) {
        this.setErrorMessage(errorMessage);
        return this;
    }

    // Helper methods
    public boolean canRetry() {
        return retryCount < maxRetries && status == DeliveryStatus.FAILED;
    }

    public void incrementRetryCount() {
        this.retryCount++;
        this.updatedAt = Instant.now();
    }

    public boolean isExpired() {
        if (scheduledAt == null)
            return false;
        // Consider notification expired if scheduled more than 24 hours ago and still
        // pending
        return status == DeliveryStatus.PENDING &&
                scheduledAt.isBefore(Instant.now().minusSeconds(24 * 60 * 60));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof NotificationDelivery))
            return false;
        return id != null && id.equals(((NotificationDelivery) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "NotificationDelivery{" +
                "id=" + getId() +
                ", recipientId=" + getRecipientId() +
                ", recipientEmail='" + getRecipientEmail() + "'" +
                ", notificationType='" + getNotificationType() + "'" +
                ", deliveryChannel='" + getDeliveryChannel() + "'" +
                ", status='" + getStatus() + "'" +
                ", subject='" + getSubject() + "'" +
                ", scheduledAt='" + getScheduledAt() + "'" +
                ", sentAt='" + getSentAt() + "'" +
                ", retryCount=" + getRetryCount() +
                "}";
    }
}