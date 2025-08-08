package com.satori.platform.service.dto;

import java.util.Map;

/**
 * DTO for notification content across different channels
 */
public class NotificationContentDTO {

    private String locale = "en";

    // Email content
    private String emailSubject;
    private String emailContent;
    private boolean emailEnabled = true;

    // Push notification content
    private String pushTitle;
    private String pushMessage;
    private Map<String, String> pushData;
    private boolean pushEnabled = true;

    // In-app notification content
    private String inAppTitle;
    private String inAppMessage;
    private boolean inAppEnabled = true;

    // Constructors
    public NotificationContentDTO() {
    }

    public NotificationContentDTO(String emailSubject, String emailContent) {
        this.emailSubject = emailSubject;
        this.emailContent = emailContent;
    }

    // Getters and Setters
    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
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

    public Map<String, String> getPushData() {
        return pushData;
    }

    public void setPushData(Map<String, String> pushData) {
        this.pushData = pushData;
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

    // Fluent builder methods
    public NotificationContentDTO emailSubject(String emailSubject) {
        this.emailSubject = emailSubject;
        return this;
    }

    public NotificationContentDTO emailContent(String emailContent) {
        this.emailContent = emailContent;
        return this;
    }

    public NotificationContentDTO pushTitle(String pushTitle) {
        this.pushTitle = pushTitle;
        return this;
    }

    public NotificationContentDTO pushMessage(String pushMessage) {
        this.pushMessage = pushMessage;
        return this;
    }

    public NotificationContentDTO pushData(Map<String, String> pushData) {
        this.pushData = pushData;
        return this;
    }

    public NotificationContentDTO inAppTitle(String inAppTitle) {
        this.inAppTitle = inAppTitle;
        return this;
    }

    public NotificationContentDTO inAppMessage(String inAppMessage) {
        this.inAppMessage = inAppMessage;
        return this;
    }

    public NotificationContentDTO locale(String locale) {
        this.locale = locale;
        return this;
    }

    @Override
    public String toString() {
        return "NotificationContentDTO{" +
                "locale='" + locale + '\'' +
                ", emailSubject='" + emailSubject + '\'' +
                ", pushTitle='" + pushTitle + '\'' +
                ", inAppTitle='" + inAppTitle + '\'' +
                '}';
    }
}