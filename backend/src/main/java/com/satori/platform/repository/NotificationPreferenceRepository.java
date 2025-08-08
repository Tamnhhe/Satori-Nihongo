package com.satori.platform.repository;

import com.satori.platform.domain.NotificationPreference;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.enumeration.NotificationType;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the NotificationPreference entity.
 */
@SuppressWarnings("unused")
@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, Long> {

    /**
     * Find notification preferences by user profile
     */
    List<NotificationPreference> findByUserProfile(UserProfile userProfile);

    /**
     * Find notification preference by user profile and notification type
     */
    @Query("SELECT np FROM NotificationPreference np WHERE np.userProfile = :userProfile AND np.notificationType = :notificationType")
    Optional<NotificationPreference> findByUserProfileAndNotificationType(
            @Param("userProfile") UserProfile userProfile,
            @Param("notificationType") NotificationType notificationType);

    /**
     * Find all enabled notification preferences
     */
    @Query("SELECT np FROM NotificationPreference np WHERE np.enabled = true")
    List<NotificationPreference> findAllEnabled();

    /**
     * Find notification preferences by user profile ID
     */
    @Query("SELECT np FROM NotificationPreference np WHERE np.userProfile.id = :userProfileId")
    List<NotificationPreference> findByUserProfileId(@Param("userProfileId") Long userProfileId);

    /**
     * Find enabled notification preferences by user profile
     */
    @Query("SELECT np FROM NotificationPreference np WHERE np.userProfile = :userProfile AND np.enabled = true")
    List<NotificationPreference> findEnabledByUserProfile(@Param("userProfile") UserProfile userProfile);

    /**
     * Check if notification is enabled for user
     */
    @Query("SELECT CASE WHEN COUNT(np) > 0 THEN true ELSE false END FROM NotificationPreference np " +
            "WHERE np.userProfile.id = :userProfileId AND np.notificationType = :notificationType AND np.enabled = true")
    boolean isNotificationEnabled(@Param("userProfileId") Long userProfileId,
            @Param("notificationType") NotificationType notificationType);
}