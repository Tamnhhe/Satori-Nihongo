package com.satori.platform.domain;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserSession entity for tracking user login sessions.
 */
@Entity
@Table(name = "user_session")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class UserSession implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(max = 255)
    @Column(name = "session_id", length = 255, nullable = false, unique = true)
    private String sessionId;

    @NotNull
    @ManyToOne(optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @NotNull
    @Column(name = "created_date", nullable = false)
    private Instant createdDate;

    @Column(name = "last_accessed_date")
    private Instant lastAccessedDate;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Size(max = 45)
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Size(max = 500)
    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @NotNull
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    // Constructors
    public UserSession() {
    }

    public UserSession(String sessionId, User user, String ipAddress, String userAgent) {
        this.sessionId = sessionId;
        this.user = user;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.createdDate = Instant.now();
        this.lastAccessedDate = Instant.now();
        this.active = true;
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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserSession)) {
            return false;
        }
        return id != null && id.equals(((UserSession) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "UserSession{" +
                "id=" + id +
                ", sessionId='" + sessionId + '\'' +
                ", user=" + (user != null ? user.getLogin() : null) +
                ", createdDate=" + createdDate +
                ", lastAccessedDate=" + lastAccessedDate +
                ", active=" + active +
                '}';
    }
}