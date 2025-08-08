package com.satori.platform.domain;

import com.satori.platform.domain.enumeration.AuthenticationEventType;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * Entity for tracking authentication events
 */
@Entity
@Table(name = "authentication_audit_log")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AuthenticationAuditLog implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(max = 50)
    @Column(name = "username", length = 50)
    private String username;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "event_type", nullable = false)
    private AuthenticationEventType eventType;

    @NotNull
    @Column(name = "event_date", nullable = false)
    private Instant eventDate;

    @Size(max = 45)
    @Column(name = "ip_address", length = 45)
    private String ipAddress;

    @Size(max = 500)
    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Size(max = 1000)
    @Column(name = "details", length = 1000)
    private String details;

    @Column(name= "success")
    private Boolean success;

   /**
    * Constructor 
    */
    public AuthenticationAuditLog() {
    }

    public AuthenticationAuditLog(String username, AuthenticationEventType eventType, Boolean success, String ipAddress, String userAgent) {
        this.username = username;
        this.eventType = eventType;
        this.success = success;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.eventDate = Instant.now();
    }

    /**
     * Getters and Setters
     */
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public AuthenticationEventType getEventType() {
        return eventType;
    }
    public void setEventType(AuthenticationEventType eventType) {
        this.eventType = eventType;
    }
    public Instant getEventDate() {
        return eventDate;
    }
    public void setEventDate(Instant eventDate) {
        this.eventDate = eventDate;
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
    public String getDetails() {
        return details;
    }
    public void setDetails(String details) {
        this.details = details;
    }
    public Boolean getSuccess() {
        return success;
    }
    public void setSuccess(Boolean success) {
        this.success = success;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof AuthenticationAuditLog)) {
            return false;
        }
        return id != null && id.equals(((AuthenticationAuditLog) o).id);
    }
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
    @Override
    public String toString() {
        return "AuthenticationAuditLog{" +
            "id=" + id +
            ", username='" + username + '\'' +
            ", eventType=" + eventType +
            ", eventDate=" + eventDate +
            ", success=" + success +
            '}';
    }

}