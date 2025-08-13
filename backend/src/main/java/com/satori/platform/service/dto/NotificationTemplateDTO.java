package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.NotificationType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.Instant;
import java.util.Map;

/**
 * DTO for notification template management
 */
public class NotificationTemplateDTO {

    private Long id;

    @NotNull
    @Size(max = 100)
    private String name;

    @NotNull
    private NotificationType type;

    @Size(max = 500)
    private String description;

    @NotNull
    @Size(max = 500)
    private String emailSubject;

    @NotNull
    private String emailContent;

    @Size(max = 200)
    private String pushTitle;

    @Size(max = 500)
    private String pushMessage;

    @Size(max = 200)
    private String inAppTitle;

    @Size(max = 500)
    private String inAppMessage;

    private Map<String, String> variables;

    private boolean isActive = true;

    private String locale = "en";

    private Instant createdAt;

    private Instant updatedAt;

    // Constructors
    public NotificationTemplateDTO() {
    }

    public NotificationTemplateDTO(String name, NotificationType type, String emailSubject, String emailContent) {
        this.name = name;
        this.type = type;
        this.emailSubject = emailSubject;
        this.emailContent = emailContent;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEmailSubject() {
        return emailSubject;
    }

    public void setEmailSubject(String emailSubject) {
        this.emailSubject = emailSubject;
    }

    public String getEmailContent() {
        return emailContent;
    }

    public void setEmailContent(String emailContent) {
        this.emailContent = emailContent;
    }

    public String getPushTitle() {
        return pushTitle;
    }

    public void setPushTitle(String pushTitle) {
        this.pushTitle = pushTitle;
    }

    public String getPushMessage() {
        return pushMessage;
    }

    public void setPushMessage(String pushMessage) {
        this.pushMessage = pushMessage;
    }

    public String getInAppTitle() {
        return inAppTitle;
    }

    public void setInAppTitle(String inAppTitle) {
        this.inAppTitle = inAppTitle;
    }

    public String getInAppMessage() {
        return inAppMessage;
    }

    public void setInAppMessage(String inAppMessage) {
        this.inAppMessage = inAppMessage;
    }

    public Map<String, String> getVariables() {
        return variables;
    }

    public void setVariables(Map<String, String> variables) {
        this.variables = variables;
    }

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
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

    @Override
    public String toString() {
        return "NotificationTemplateDTO{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", type=" + type +
                ", locale='" + locale + '\'' +
                ", isActive=" + isActive +
                '}';
    }
}