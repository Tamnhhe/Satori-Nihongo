package com.satori.platform.service.dto;

import java.time.Instant;

/**
 * A DTO for the UserSession entity.
 */
public class UserSessionDTO {

    private Long id;
    private String sessionId;
    private String userLogin;
    private Instant createdDate;
    private Instant lastAccessedDate;
    private Instant expiresAt;
    private String ipAddress;
    private String userAgent;
    private Boolean active;

    // Constructors
    public UserSessionDTO() {
    }

    public UserSessionDTO(Long id, String sessionId, String userLogin, Instant createdDate,
            Instant lastAccessedDate, String ipAddress, Boolean active) {
        this.id = id;
        this.sessionId = sessionId;
        this.userLogin = userLogin;
        this.createdDate = createdDate;
        this.lastAccessedDate = lastAccessedDate;
        this.ipAddress = ipAddress;
        this.active = active;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getUserLogin() {
        return userLogin;
    }

    public void setUserLogin(String userLogin) {
        this.userLogin = userLogin;
    }

    public Instant getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Instant getLastAccessedDate() {
        return lastAccessedDate;
    }

    public void setLastAccessedDate(Instant lastAccessedDate) {
        this.lastAccessedDate = lastAccessedDate;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "UserSessionDTO{" +
                "id=" + id +
                ", sessionId='" + sessionId + '\'' +
                ", userLogin='" + userLogin + '\'' +
                ", createdDate=" + createdDate +
                ", lastAccessedDate=" + lastAccessedDate +
                ", active=" + active +
                '}';
    }
}