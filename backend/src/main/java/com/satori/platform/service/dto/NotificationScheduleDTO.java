package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.NotificationType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * DTO for notification scheduling and targeting
 */
public class NotificationScheduleDTO {

    private Long id;

    @NotNull
    private Long templateId;

    @NotNull
    @Size(max = 200)
    private String title;

    @Size(max = 1000)
    private String description;

    @NotNull
    private NotificationType type;

    private Instant scheduledAt;

    private String timezone;

    private boolean isRecurring = false;

    private String recurringPattern; // DAILY, WEEKLY, MONTHLY

    private Instant recurringEndDate;

    // Targeting criteria
    private List<String> targetRoles; // ADMIN, GIANG_VIEN, HOC_VIEN

    private List<Long> targetUserIds;

    private List<Long> targetCourseIds;

    private List<Long> targetClassIds;

    private Map<String, Object> targetCriteria; // Additional targeting criteria

    // Delivery channels
    private boolean emailEnabled = true;

    private boolean pushEnabled = true;

    private boolean inAppEnabled = true;

    // Status and tracking
    private String status = "DRAFT"; // DRAFT, SCHEDULED, SENT, CANCELLED

    private Instant createdAt;

    private Instant updatedAt;

    private String createdBy;

    // Statistics
    private Long totalRecipients;

    private Long sentCount;

    private Long deliveredCount;

    private Long failedCount;

    // Constructors
    public NotificationScheduleDTO() {
    }

    public NotificationScheduleDTO(Long templateId, String title, NotificationType type) {
        this.templateId = templateId;
        this.title = title;
        this.type = type;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTemplateId() {
        return templateId;
    }

    public void setTemplateId(Long templateId) {
        this.templateId = templateId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public Instant getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(Instant scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public boolean isRecurring() {
        return isRecurring;
    }

    public void setRecurring(boolean recurring) {
        isRecurring = recurring;
    }

    public String getRecurringPattern() {
        return recurringPattern;
    }

    public void setRecurringPattern(String recurringPattern) {
        this.recurringPattern = recurringPattern;
    }

    public Instant getRecurringEndDate() {
        return recurringEndDate;
    }

    public void setRecurringEndDate(Instant recurringEndDate) {
        this.recurringEndDate = recurringEndDate;
    }

    public List<String> getTargetRoles() {
        return targetRoles;
    }

    public void setTargetRoles(List<String> targetRoles) {
        this.targetRoles = targetRoles;
    }

    public List<Long> getTargetUserIds() {
        return targetUserIds;
    }

    public void setTargetUserIds(List<Long> targetUserIds) {
        this.targetUserIds = targetUserIds;
    }

    public List<Long> getTargetCourseIds() {
        return targetCourseIds;
    }

    public void setTargetCourseIds(List<Long> targetCourseIds) {
        this.targetCourseIds = targetCourseIds;
    }

    public List<Long> getTargetClassIds() {
        return targetClassIds;
    }

    public void setTargetClassIds(List<Long> targetClassIds) {
        this.targetClassIds = targetClassIds;
    }

    public Map<String, Object> getTargetCriteria() {
        return targetCriteria;
    }

    public void setTargetCriteria(Map<String, Object> targetCriteria) {
        this.targetCriteria = targetCriteria;
    }

    public boolean isEmailEnabled() {
        return emailEnabled;
    }

    public void setEmailEnabled(boolean emailEnabled) {
        this.emailEnabled = emailEnabled;
    }

    public boolean isPushEnabled() {
        return pushEnabled;
    }

    public void setPushEnabled(boolean pushEnabled) {
        this.pushEnabled = pushEnabled;
    }

    public boolean isInAppEnabled() {
        return inAppEnabled;
    }

    public void setInAppEnabled(boolean inAppEnabled) {
        this.inAppEnabled = inAppEnabled;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public Long getTotalRecipients() {
        return totalRecipients;
    }

    public void setTotalRecipients(Long totalRecipients) {
        this.totalRecipients = totalRecipients;
    }

    public Long getSentCount() {
        return sentCount;
    }

    public void setSentCount(Long sentCount) {
        this.sentCount = sentCount;
    }

    public Long getDeliveredCount() {
        return deliveredCount;
    }

    public void setDeliveredCount(Long deliveredCount) {
        this.deliveredCount = deliveredCount;
    }

    public Long getFailedCount() {
        return failedCount;
    }

    public void setFailedCount(Long failedCount) {
        this.failedCount = failedCount;
    }

    @Override
    public String toString() {
        return "NotificationScheduleDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", type=" + type +
                ", status='" + status + '\'' +
                ", scheduledAt=" + scheduledAt +
                ", totalRecipients=" + totalRecipients +
                '}';
    }
}