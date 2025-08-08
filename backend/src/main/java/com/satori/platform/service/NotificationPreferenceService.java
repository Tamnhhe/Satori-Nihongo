package com.satori.platform.service;

import com.satori.platform.domain.NotificationPreference;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.enumeration.NotificationType;
import com.satori.platform.repository.NotificationPreferenceRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.service.dto.NotificationPreferenceDTO;
import com.satori.platform.service.mapper.NotificationPreferenceMapper;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing
 * {@link com.satori.platform.domain.NotificationPreference}.
 */
@Service
@Transactional
public class NotificationPreferenceService {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationPreferenceService.class);

    private final NotificationPreferenceRepository notificationPreferenceRepository;
    private final NotificationPreferenceMapper notificationPreferenceMapper;
    private final UserProfileRepository userProfileRepository;

    public NotificationPreferenceService(
            NotificationPreferenceRepository notificationPreferenceRepository,
            NotificationPreferenceMapper notificationPreferenceMapper,
            UserProfileRepository userProfileRepository) {
        this.notificationPreferenceRepository = notificationPreferenceRepository;
        this.notificationPreferenceMapper = notificationPreferenceMapper;
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * Save a notification preference.
     *
     * @param notificationPreferenceDTO the entity to save.
     * @return the persisted entity.
     */
    public NotificationPreferenceDTO save(NotificationPreferenceDTO notificationPreferenceDTO) {
        LOG.debug("Request to save NotificationPreference : {}", notificationPreferenceDTO);
        NotificationPreference notificationPreference = notificationPreferenceMapper
                .toEntity(notificationPreferenceDTO);
        notificationPreference = notificationPreferenceRepository.save(notificationPreference);
        return notificationPreferenceMapper.toDto(notificationPreference);
    }

    /**
     * Update a notification preference.
     *
     * @param notificationPreferenceDTO the entity to save.
     * @return the persisted entity.
     */
    public NotificationPreferenceDTO update(NotificationPreferenceDTO notificationPreferenceDTO) {
        LOG.debug("Request to update NotificationPreference : {}", notificationPreferenceDTO);
        NotificationPreference notificationPreference = notificationPreferenceMapper
                .toEntity(notificationPreferenceDTO);
        notificationPreference = notificationPreferenceRepository.save(notificationPreference);
        return notificationPreferenceMapper.toDto(notificationPreference);
    }

    /**
     * Partially update a notification preference.
     *
     * @param notificationPreferenceDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<NotificationPreferenceDTO> partialUpdate(NotificationPreferenceDTO notificationPreferenceDTO) {
        LOG.debug("Request to partially update NotificationPreference : {}", notificationPreferenceDTO);

        return notificationPreferenceRepository
                .findById(notificationPreferenceDTO.getId())
                .map(existingNotificationPreference -> {
                    notificationPreferenceMapper.partialUpdate(existingNotificationPreference,
                            notificationPreferenceDTO);
                    return existingNotificationPreference;
                })
                .map(notificationPreferenceRepository::save)
                .map(notificationPreferenceMapper::toDto);
    }

    /**
     * Get all the notification preferences.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<NotificationPreferenceDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all NotificationPreferences");
        return notificationPreferenceRepository.findAll(pageable).map(notificationPreferenceMapper::toDto);
    }

    /**
     * Get one notification preference by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<NotificationPreferenceDTO> findOne(Long id) {
        LOG.debug("Request to get NotificationPreference : {}", id);
        return notificationPreferenceRepository.findById(id).map(notificationPreferenceMapper::toDto);
    }

    /**
     * Delete the notification preference by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete NotificationPreference : {}", id);
        notificationPreferenceRepository.deleteById(id);
    }

    /**
     * Get all notification preferences for a specific user.
     *
     * @param userProfileId the user profile ID.
     * @return the list of notification preferences.
     */
    @Transactional(readOnly = true)
    public List<NotificationPreferenceDTO> findByUserProfileId(Long userProfileId) {
        LOG.debug("Request to get NotificationPreferences for user : {}", userProfileId);
        return notificationPreferenceRepository
                .findByUserProfileId(userProfileId)
                .stream()
                .map(notificationPreferenceMapper::toDto)
                .toList();
    }

    /**
     * Get a specific notification preference by user and notification type.
     *
     * @param userProfileId    the user profile ID.
     * @param notificationType the notification type.
     * @return the notification preference.
     */
    @Transactional(readOnly = true)
    public Optional<NotificationPreferenceDTO> findByUserProfileIdAndNotificationType(Long userProfileId,
            NotificationType notificationType) {
        LOG.debug("Request to get NotificationPreference for user {} and type {}", userProfileId, notificationType);
        return userProfileRepository
                .findById(userProfileId)
                .flatMap(userProfile -> notificationPreferenceRepository
                        .findByUserProfileAndNotificationType(userProfile, notificationType))
                .map(notificationPreferenceMapper::toDto);
    }

    /**
     * Get all enabled notification preferences for a specific user.
     *
     * @param userProfileId the user profile ID.
     * @return the list of enabled notification preferences.
     */
    @Transactional(readOnly = true)
    public List<NotificationPreferenceDTO> findEnabledByUserProfileId(Long userProfileId) {
        LOG.debug("Request to get enabled NotificationPreferences for user : {}", userProfileId);
        return userProfileRepository
                .findById(userProfileId)
                .map(userProfile -> notificationPreferenceRepository.findEnabledByUserProfile(userProfile)
                        .stream()
                        .map(notificationPreferenceMapper::toDto)
                        .toList())
                .orElse(List.of());
    }

    /**
     * Check if a user has a specific notification type enabled.
     *
     * @param userProfileId    the user profile ID.
     * @param notificationType the notification type.
     * @return true if enabled, false otherwise.
     */
    @Transactional(readOnly = true)
    public boolean isNotificationEnabled(Long userProfileId, NotificationType notificationType) {
        LOG.debug("Request to check if notification {} is enabled for user {}", notificationType, userProfileId);
        return notificationPreferenceRepository.isNotificationEnabled(userProfileId, notificationType);
    }

    /**
     * Create or update a notification preference for a user.
     *
     * @param userProfileId             the user profile ID.
     * @param notificationType          the notification type.
     * @param notificationPreferenceDTO the notification preference data.
     * @return the saved notification preference.
     */
    public NotificationPreferenceDTO createOrUpdatePreference(Long userProfileId, NotificationType notificationType,
            NotificationPreferenceDTO notificationPreferenceDTO) {
        LOG.debug("Request to create or update NotificationPreference for user {} and type {}", userProfileId,
                notificationType);

        Optional<UserProfile> userProfile = userProfileRepository.findById(userProfileId);
        if (userProfile.isEmpty()) {
            throw new IllegalArgumentException("User profile not found with id: " + userProfileId);
        }

        Optional<NotificationPreference> existingPreference = notificationPreferenceRepository
                .findByUserProfileAndNotificationType(userProfile.get(), notificationType);

        NotificationPreference notificationPreference;
        if (existingPreference.isPresent()) {
            // Update existing preference
            notificationPreference = existingPreference.get();
            notificationPreferenceMapper.partialUpdate(notificationPreference, notificationPreferenceDTO);
        } else {
            // Create new preference
            notificationPreference = notificationPreferenceMapper.toEntity(notificationPreferenceDTO);
            notificationPreference.setUserProfile(userProfile.get());
            notificationPreference.setNotificationType(notificationType);
        }

        notificationPreference = notificationPreferenceRepository.save(notificationPreference);
        return notificationPreferenceMapper.toDto(notificationPreference);
    }

    /**
     * Initialize default notification preferences for a new user.
     *
     * @param userProfileId the user profile ID.
     * @return the list of created default preferences.
     */
    public List<NotificationPreferenceDTO> initializeDefaultPreferences(Long userProfileId) {
        LOG.debug("Request to initialize default NotificationPreferences for user : {}", userProfileId);

        Optional<UserProfile> userProfile = userProfileRepository.findById(userProfileId);
        if (userProfile.isEmpty()) {
            throw new IllegalArgumentException("User profile not found with id: " + userProfileId);
        }

        // Create default preferences for all notification types
        List<NotificationPreference> defaultPreferences = List.of(
                createDefaultPreference(userProfile.get(), NotificationType.SCHEDULE_REMINDER, true, 24),
                createDefaultPreference(userProfile.get(), NotificationType.CONTENT_UPDATE, true, 0),
                createDefaultPreference(userProfile.get(), NotificationType.QUIZ_REMINDER, true, 24),
                createDefaultPreference(userProfile.get(), NotificationType.ASSIGNMENT_DUE, true, 48),
                createDefaultPreference(userProfile.get(), NotificationType.COURSE_ANNOUNCEMENT, true, 0),
                createDefaultPreference(userProfile.get(), NotificationType.SYSTEM_NOTIFICATION, true, 0));

        List<NotificationPreference> savedPreferences = notificationPreferenceRepository.saveAll(defaultPreferences);
        return savedPreferences.stream()
                .map(notificationPreferenceMapper::toDto)
                .toList();
    }

    private NotificationPreference createDefaultPreference(UserProfile userProfile, NotificationType type,
            boolean enabled, int advanceHours) {
        NotificationPreference preference = new NotificationPreference();
        preference.setUserProfile(userProfile);
        preference.setNotificationType(type);
        preference.setEnabled(enabled);
        preference.setAdvanceHours(advanceHours);
        preference.setTimezone("UTC");
        return preference;
    }
}