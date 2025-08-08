package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.NotificationType;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.satori.platform.domain.NotificationPreference}
 * entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class NotificationPreferenceDTO implements Serializable {

    private Long id;

    @NotNull
    private NotificationType notificationType;

    @NotNull
    private Boolean enabled;

    private LocalTime preferredTime;

    private Integer advanceHours;

    private String timezone;

    private UserProfileDTO userProfile;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public NotificationType getNotificationType() {
        return notificationType;
    }

    public void setNotificationType(NotificationType notificationType) {
        this.notificationType = notificationType;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public LocalTime getPreferredTime() {
        return preferredTime;
    }

    public void setPreferredTime(LocalTime preferredTime) {
        this.preferredTime = preferredTime;
    }

    public Integer getAdvanceHours() {
        return advanceHours;
    }

    public void setAdvanceHours(Integer advanceHours) {
        this.advanceHours = advanceHours;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public UserProfileDTO getUserProfile() {
        return userProfile;
    }

    public void setUserProfile(UserProfileDTO userProfile) {
        this.userProfile = userProfile;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof NotificationPreferenceDTO)) {
            return false;
        }

        NotificationPreferenceDTO notificationPreferenceDTO = (NotificationPreferenceDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, notificationPreferenceDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "NotificationPreferenceDTO{" +
                "id=" + getId() +
                ", notificationType='" + getNotificationType() + "'" +
                ", enabled='" + getEnabled() + "'" +
                ", preferredTime='" + getPreferredTime() + "'" +
                ", advanceHours=" + getAdvanceHours() +
                ", timezone='" + getTimezone() + "'" +
                ", userProfile=" + getUserProfile() +
                "}";
    }
}