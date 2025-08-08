package com.satori.platform.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

/**
 * Configuration properties for rate limiting settings.
 */
@Configuration
@ConfigurationProperties(prefix = "app.rate-limiting")
public class RateLimitingConfiguration {

    private int defaultRequestsPerMinute=60; // Default rate limit of 60 requests per minute
    private int authRequestsPerMinute=5; // Authenticated users can make 30 requests per minute
    private int fileUploadRequestsPerMinute=10; // File upload requests limited to 10 per minute
    private int apiRequestsPerMinute=100; // API requests limited to 100 per minute
    private int quizSubmissionRequestsPerMinute=2; // Quiz submissions limited to 2 per minute
    private int notificationRequestsPerMinute=20; // Notification requests limited to 20 per minute
    private long banDurationMinutes=15; // Ban duration of 15 minutes (in minutes)
    private int maxFailedAttempts=5;
    
    // Getters and Setters
    public int getDefaultRequestsPerMinute() {
        return defaultRequestsPerMinute;
    }
    public void setDefaultRequestsPerMinute(int defaultRequestsPerMinute) {
        this.defaultRequestsPerMinute = defaultRequestsPerMinute;
    }
    public int getAuthRequestsPerMinute() {
        return authRequestsPerMinute;
    }
    public void setAuthRequestsPerMinute(int authRequestsPerMinute) {
        this.authRequestsPerMinute = authRequestsPerMinute;
    }
    public int getFileUploadRequestsPerMinute() {
        return fileUploadRequestsPerMinute;
    }
    public void setFileUploadRequestsPerMinute(int fileUploadRequestsPerMinute) {
        this.fileUploadRequestsPerMinute = fileUploadRequestsPerMinute;
    }
    public int getApiRequestsPerMinute() {
        return apiRequestsPerMinute;
    }
    public void setApiRequestsPerMinute(int apiRequestsPerMinute) {
        this.apiRequestsPerMinute = apiRequestsPerMinute;
    }
    public int getQuizSubmissionRequestsPerMinute() {
        return quizSubmissionRequestsPerMinute;
    }
    public void setQuizSubmissionRequestsPerMinute(int quizSubmissionRequestsPerMinute) {
        this.quizSubmissionRequestsPerMinute = quizSubmissionRequestsPerMinute;
    }
    public int getNotificationRequestsPerMinute() {
        return notificationRequestsPerMinute;
    }
    public void setNotificationRequestsPerMinute(int notificationRequestsPerMinute) {
        this.notificationRequestsPerMinute = notificationRequestsPerMinute;
    }
    public long getBanDurationMinutes() {
        return banDurationMinutes;
    }
    public void setBanDurationMinutes(long banDurationMinutes) {
        this.banDurationMinutes = banDurationMinutes;
    }
    public int getMaxFailedAttempts() {
        return maxFailedAttempts;
    }
    public void setMaxFailedAttempts(int maxFailedAttempts) {
        this.maxFailedAttempts = maxFailedAttempts;
    }
}