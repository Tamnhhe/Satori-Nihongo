package com.satori.platform.service;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.NotificationType;
import com.satori.platform.repository.NotificationPreferenceRepository;
import com.satori.platform.service.dto.NotificationContentDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Set;

/**
 * Service for managing notifications across the platform.
 * Handles different notification types including schedule reminders, content
 * updates, and quiz notifications.
 */
@Service
@Transactional
public class NotificationService {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationService.class);

    private final MailService mailService;
    private final PushNotificationService pushNotificationService;
    private final NotificationPreferenceRepository notificationPreferenceRepository;
    private final NotificationTemplateService notificationTemplateService;
    private final NotificationDeliveryService notificationDeliveryService;
    private final LocalizationService localizationService;

    public NotificationService(
            MailService mailService,
            PushNotificationService pushNotificationService,
            NotificationPreferenceRepository notificationPreferenceRepository,
            NotificationTemplateService notificationTemplateService,
            NotificationDeliveryService notificationDeliveryService,
            LocalizationService localizationService) {
        this.mailService = mailService;
        this.pushNotificationService = pushNotificationService;
        this.notificationPreferenceRepository = notificationPreferenceRepository;
        this.notificationTemplateService = notificationTemplateService;
        this.notificationDeliveryService = notificationDeliveryService;
        this.localizationService = localizationService;
    }

    /**
     * Send schedule reminder notification to a user
     * Requirements: 1.1, 1.2
     */
    @Async
    public void sendScheduleReminder(UserProfile user, Schedule schedule) {
        LOG.debug("Sending schedule reminder to user: {} for schedule: {}", user.getUsername(), schedule.getId());

        if (!isNotificationEnabled(user, NotificationType.SCHEDULE_REMINDER)) {
            LOG.debug("Schedule reminder notifications disabled for user: {}", user.getUsername());
            return;
        }

        NotificationContentDTO content = notificationTemplateService.createScheduleReminderContent(user, schedule);
        sendNotification(user, content, NotificationType.SCHEDULE_REMINDER);
    }

    /**
     * Send content update notification to enrolled students
     * Requirements: 1.3, 3.1, 3.2, 3.3
     */
    @Async
    public void sendContentUpdateNotification(List<UserProfile> students, Lesson lesson) {
        LOG.debug("Sending content update notification for lesson: {} to {} students", lesson.getTitle(),
                students.size());

        for (UserProfile student : students) {
            if (isNotificationEnabled(student, NotificationType.CONTENT_UPDATE)) {
                NotificationContentDTO content = notificationTemplateService.createContentUpdateContent(student,
                        lesson);
                sendNotification(student, content, NotificationType.CONTENT_UPDATE);
            }
        }
    }

    /**
     * Send personalized learning schedule notification
     * Requirements: 2.1, 2.2, 2.3
     */
    @Async
    public void sendPersonalizedReminder(UserProfile student, NotificationType type, Object context) {
        LOG.debug("Sending personalized reminder of type: {} to student: {}", type, student.getUsername());

        if (!isNotificationEnabled(student, type)) {
            LOG.debug("Personalized notifications of type {} disabled for user: {}", type, student.getUsername());
            return;
        }

        // Check if notification should be sent based on user's preferred time
        if (!isWithinPreferredTime(student, type)) {
            LOG.debug("Current time is outside preferred notification time for user: {}", student.getUsername());
            return;
        }

        NotificationContentDTO content = notificationTemplateService.createPersonalizedContent(student, type, context);
        sendNotification(student, content, type);
    }

    /**
     * Send bulk notification to multiple recipients
     */
    @Async
    public void sendBulkNotification(List<UserProfile> recipients, NotificationContentDTO content,
            NotificationType type) {
        LOG.debug("Sending bulk notification of type: {} to {} recipients", type, recipients.size());

        // Filter enabled recipients
        List<UserProfile> enabledRecipients = recipients.stream()
                .filter(recipient -> isNotificationEnabled(recipient, type))
                .collect(java.util.stream.Collectors.toList());

        // Use bulk queueing for better performance
        if (content.isEmailEnabled()) {
            notificationDeliveryService.queueBulkNotifications(enabledRecipients, content, type, "EMAIL");
        }
        if (content.isPushEnabled()) {
            notificationDeliveryService.queueBulkNotifications(enabledRecipients, content, type, "PUSH");
        }
        if (content.isInAppEnabled()) {
            notificationDeliveryService.queueBulkNotifications(enabledRecipients, content, type, "IN_APP");
        }
    }

    /**
     * Schedule notification for future delivery with timezone support
     * Requirements: Timezone support for notification scheduling
     */
    @Async
    public void scheduleNotification(UserProfile user, NotificationContentDTO content, NotificationType type,
            java.time.Instant scheduledAt, String timezone) {
        LOG.debug("Scheduling {} notification for user: {} at {}", type, user.getUsername(), scheduledAt);

        if (!isNotificationEnabled(user, type)) {
            LOG.debug("Scheduled notifications of type {} disabled for user: {}", type, user.getUsername());
            return;
        }

        try {
            // Queue scheduled notifications for each enabled channel
            if (content.isEmailEnabled()) {
                notificationDeliveryService.queueNotification(user, content, type, "EMAIL", scheduledAt, timezone);
            }
            if (content.isPushEnabled()) {
                notificationDeliveryService.queueNotification(user, content, type, "PUSH", scheduledAt, timezone);
            }
            if (content.isInAppEnabled()) {
                notificationDeliveryService.queueNotification(user, content, type, "IN_APP", scheduledAt, timezone);
            }

            LOG.debug("Successfully scheduled {} notification for user: {}", type, user.getUsername());
        } catch (Exception e) {
            LOG.error("Failed to schedule {} notification for user: {}", type, user.getUsername(), e);
        }
    }

    /**
     * Send quiz reminder notification
     * Requirements: 2.2
     */
    @Async
    public void sendQuizReminder(UserProfile student, Quiz quiz, int hoursUntilDue) {
        LOG.debug("Sending quiz reminder to student: {} for quiz: {}, {} hours until due",
                student.getUsername(), quiz.getTitle(), hoursUntilDue);

        if (!isNotificationEnabled(student, NotificationType.QUIZ_REMINDER)) {
            return;
        }

        NotificationContentDTO content = notificationTemplateService.createQuizReminderContent(student, quiz,
                hoursUntilDue);
        sendNotification(student, content, NotificationType.QUIZ_REMINDER);
    }

    /**
     * Send course announcement notification
     */
    @Async
    public void sendCourseAnnouncement(List<UserProfile> enrolledStudents, Course course, String announcement) {
        LOG.debug("Sending course announcement for course: {} to {} students", course.getTitle(),
                enrolledStudents.size());

        for (UserProfile student : enrolledStudents) {
            if (isNotificationEnabled(student, NotificationType.COURSE_ANNOUNCEMENT)) {
                NotificationContentDTO content = notificationTemplateService.createCourseAnnouncementContent(student,
                        course, announcement);
                sendNotification(student, content, NotificationType.COURSE_ANNOUNCEMENT);
            }
        }
    }

    /**
     * Core method to send notification through appropriate channels using delivery
     * queue
     */
    private void sendNotification(UserProfile user, NotificationContentDTO content, NotificationType type) {
        try {
            // Queue email notification
            if (content.isEmailEnabled()) {
                notificationDeliveryService.queueNotification(user, content, type, "EMAIL");
            }

            // Queue push notification
            if (content.isPushEnabled()) {
                notificationDeliveryService.queueNotification(user, content, type, "PUSH");
            }

            // Queue in-app notification
            if (content.isInAppEnabled()) {
                notificationDeliveryService.queueNotification(user, content, type, "IN_APP");
            }

            LOG.debug("Successfully queued {} notification for user: {}", type, user.getUsername());
        } catch (Exception e) {
            LOG.error("Failed to queue {} notification for user: {}", type, user.getUsername(), e);
        }
    }

    /**
     * Check if notification type is enabled for user
     */
    private boolean isNotificationEnabled(UserProfile user, NotificationType type) {
        return notificationPreferenceRepository
                .findByUserProfileAndNotificationType(user, type)
                .map(NotificationPreference::getEnabled)
                .orElse(true); // Default to enabled if no preference set
    }

    /**
     * Check if current time is within user's preferred notification time
     */
    private boolean isWithinPreferredTime(UserProfile user, NotificationType type) {
        return notificationPreferenceRepository
                .findByUserProfileAndNotificationType(user, type)
                .map(pref -> {
                    if (pref.getPreferredTime() == null) {
                        return true; // No time restriction
                    }

                    ZoneId userZone = pref.getTimezone() != null ? ZoneId.of(pref.getTimezone())
                            : ZoneId.systemDefault();
                    LocalTime currentTime = ZonedDateTime.now(userZone).toLocalTime();
                    LocalTime preferredTime = pref.getPreferredTime();

                    // Allow notifications within 2 hours of preferred time
                    return Math.abs(currentTime.toSecondOfDay() - preferredTime.toSecondOfDay()) <= 7200;
                })
                .orElse(true); // Default to allow if no preference set
    }

    /**
     * Get notification preferences for a user
     */
    @Transactional(readOnly = true)
    public Set<NotificationPreference> getUserNotificationPreferences(UserProfile user) {
        return user.getNotificationPreferences();
    }

    /**
     * Update notification preference for a user
     */
    public NotificationPreference updateNotificationPreference(
            UserProfile user,
            NotificationType type,
            boolean enabled,
            LocalTime preferredTime,
            Integer advanceHours,
            String timezone) {
        NotificationPreference preference = notificationPreferenceRepository
                .findByUserProfileAndNotificationType(user, type)
                .orElse(new NotificationPreference()
                        .userProfile(user)
                        .notificationType(type));

        preference.setEnabled(enabled);
        preference.setPreferredTime(preferredTime);
        preference.setAdvanceHours(advanceHours);
        preference.setTimezone(timezone);

        return notificationPreferenceRepository.save(preference);
    }

    /**
     * Check if current time is culturally appropriate for notifications
     */
    private boolean isCulturallyAppropriateTime(UserProfile user, NotificationType type) {
        // Default to English locale for now - can be enhanced later with user locale
        // preference
        java.util.Locale locale = java.util.Locale.ENGLISH;

        ZoneId userZone = getUserTimezone(user);
        ZonedDateTime userTime = ZonedDateTime.now(userZone);

        return localizationService.isAppropriateNotificationTime(
                userTime.toLocalDateTime(),
                locale,
                userZone);
    }

    /**
     * Get culturally appropriate advance notice period
     */
    private int getCulturalAdvanceNotice(UserProfile user, NotificationType type) {
        // Default to English locale for now - can be enhanced later with user locale
        // preference
        java.util.Locale locale = java.util.Locale.ENGLISH;

        return localizationService.getAdvanceNoticeHours(locale, type.name().toLowerCase());
    }

    /**
     * Create culturally appropriate notification content
     */
    private NotificationContentDTO createCulturalNotificationContent(
            UserProfile user,
            String titleKey,
            String messageKey,
            Object[] args) {

        // Default to English locale for now - can be enhanced later with user locale
        // preference
        java.util.Locale locale = java.util.Locale.ENGLISH;

        // Get culturally appropriate greeting and closing
        String greeting = localizationService.getCulturalGreeting(locale, false);
        String closing = localizationService.getCulturalClosing(locale, false);

        // Localize the main content
        String title = localizationService.getMessage(titleKey, args, locale);
        String message = localizationService.getMessage(messageKey, args, locale);

        // Format with cultural elements - use fullName instead of firstName
        String fullMessage = String.format("%s %s!\n\n%s\n\n%s",
                greeting, user.getFullName(), message, closing);

        NotificationContentDTO content = new NotificationContentDTO();
        content.setEmailSubject(title);
        content.setEmailContent(fullMessage);
        content.setPushTitle(title);
        content.setPushMessage(message);
        content.setInAppTitle(title);
        content.setInAppMessage(message);
        content.setEmailEnabled(true);
        content.setPushEnabled(true);
        content.setInAppEnabled(true);

        return content;
    }

    /**
     * Get user's timezone with fallback
     */
    private ZoneId getUserTimezone(UserProfile user) {
        // Try to get timezone from notification preferences
        return notificationPreferenceRepository
                .findByUserProfile(user)
                .stream()
                .findFirst()
                .map(NotificationPreference::getTimezone)
                .filter(tz -> tz != null && !tz.isEmpty())
                .map(ZoneId::of)
                .orElse(ZoneId.systemDefault());
    }

    /**
     * Schedule notification with cultural timing considerations
     */
    public void scheduleNotificationWithCulturalTiming(
            UserProfile user,
            NotificationType type,
            String titleKey,
            String messageKey,
            Object[] args,
            ZonedDateTime scheduledTime) {

        // Check if the scheduled time is culturally appropriate
        // Default to English locale for now - can be enhanced later with user locale
        // preference
        java.util.Locale locale = java.util.Locale.ENGLISH;
        ZoneId userZone = getUserTimezone(user);

        ZonedDateTime adjustedTime = scheduledTime;

        // Adjust time if not culturally appropriate
        if (!localizationService.isAppropriateNotificationTime(
                scheduledTime.toLocalDateTime(), locale, userZone)) {

            LocalizationService.NotificationTiming timing = localizationService.getOptimalNotificationTiming(locale);

            // Move to next appropriate time slot
            adjustedTime = adjustedTime.withHour(timing.getStartHour()).withMinute(0);

            // If it's weekend and should avoid weekends, move to Monday
            if (timing.isAvoidWeekends() && adjustedTime.getDayOfWeek().getValue() >= 6) {
                adjustedTime = adjustedTime.plusDays(8 - adjustedTime.getDayOfWeek().getValue());
            }
        }

        // Create culturally appropriate content
        NotificationContentDTO content = createCulturalNotificationContent(
                user, titleKey, messageKey, args);

        // Schedule the notification
        notificationDeliveryService.queueNotification(
                user, content, type, "EMAIL", adjustedTime.toInstant(), userZone.getId());

        LOG.debug("Scheduled {} notification for user {} at culturally appropriate time: {}",
                type, user.getUsername(), adjustedTime);
    }

    /**
     * Send immediate notification with cultural content
     */
    public void sendCulturalNotification(
            UserProfile user,
            NotificationType type,
            String titleKey,
            String messageKey,
            Object... args) {

        // Check if current time is appropriate
        if (!isCulturallyAppropriateTime(user, type)) {
            // Schedule for later instead of sending immediately
            ZoneId userZone = getUserTimezone(user);
            ZonedDateTime nextAppropriateTime = getNextAppropriateTime(user);

            scheduleNotificationWithCulturalTiming(
                    user, type, titleKey, messageKey, args, nextAppropriateTime);
            return;
        }

        // Create and send culturally appropriate content
        NotificationContentDTO content = createCulturalNotificationContent(
                user, titleKey, messageKey, args);

        sendNotification(user, content, type);
    }

    /**
     * Get next culturally appropriate time for notifications
     */
    private ZonedDateTime getNextAppropriateTime(UserProfile user) {
        // Default to English locale for now - can be enhanced later with user locale
        // preference
        java.util.Locale locale = java.util.Locale.ENGLISH;
        ZoneId userZone = getUserTimezone(user);

        LocalizationService.NotificationTiming timing = localizationService.getOptimalNotificationTiming(locale);

        ZonedDateTime nextTime = ZonedDateTime.now(userZone);

        // If current time is before start hour, schedule for start hour today
        if (nextTime.getHour() < timing.getStartHour()) {
            nextTime = nextTime.withHour(timing.getStartHour()).withMinute(0);
        } else {
            // Otherwise, schedule for start hour tomorrow
            nextTime = nextTime.plusDays(1).withHour(timing.getStartHour()).withMinute(0);
        }

        // Handle weekend avoidance
        if (timing.isAvoidWeekends() && nextTime.getDayOfWeek().getValue() >= 6) {
            nextTime = nextTime.plusDays(8 - nextTime.getDayOfWeek().getValue());
        }

        return nextTime;
    }
}