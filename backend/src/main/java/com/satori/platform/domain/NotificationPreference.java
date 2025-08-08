package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.satori.platform.domain.enumeration.NotificationType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalTime;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A NotificationPreference.
 */
@Entity
@Table(name = "notification_preference")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class NotificationPreference implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type", nullable = false)
    private NotificationType notificationType;

    @NotNull
    @Column(name = "enabled", nullable = false)
    private Boolean enabled;

    @Column(name = "preferred_time")
    private LocalTime preferredTime;

    @Column(name = "advance_hours")
    private Integer advanceHours;

    @Column(name = "timezone")
    private String timezone;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "teacherProfile", "studentProfile", "createdCourses", "quizAttempts", "notificationPreferences" }, allowSetters = true)
    private UserProfile userProfile;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public NotificationPreference id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public NotificationType getNotificationType() {
        return this.notificationType;
    }

    public NotificationPreference notificationType(NotificationType notificationType) {
        this.setNotificationType(notificationType);
        return this;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public Boolean getEnabled() {
        return this.enabled;
    }

    public NotificationPreference enabled(Boolean enabled) {
        this.setEnabled(enabled);
        return this;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public LocalTime getPreferredTime() {
        return this.preferredTime;
    }

    public NotificationPreference preferredTime(LocalTime preferredTime) {
        this.setPreferredTime(preferredTime);
        return this;
    }

    public void setPreferredTime(LocalTime preferredTime) {
        this.preferredTime = preferredTime;
    }

    public Integer getAdvanceHours() {
        return this.advanceHours;
    }

    public NotificationPreference advanceHours(Integer advanceHours) {
        this.setAdvanceHours(advanceHours);
        return this;
    }

    public void setAdvanceHours(Integer advanceHours) {
        this.advanceHours = advanceHours;
    }

    public String getTimezone() {
        return this.timezone;
    }

    public NotificationPreference timezone(String timezone) {
        this.setTimezone(timezone);
        return this;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public NotificationPreference userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NotificationPreference)) {
            return false;
        }
        return getId() != null && getId().equals(((NotificationPreference) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NotificationPreference{" +
            "id=" + getId() +
            ", notificationType='" + getNotificationType() + "'" +
            ", enabled='" + getEnabled() + "'" +
            ", preferredTime='" + getPreferredTime() + "'" +
            ", advanceHours=" + getAdvanceHours() +
            ", timezone='" + getTimezone() + "'" +
            "}";
    }
}