package com.satori.platform.service;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.Lesson;
import com.satori.platform.domain.Quiz;
import com.satori.platform.domain.Schedule;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.enumeration.NotificationType;
import com.satori.platform.service.dto.NotificationContentDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.MessageSource;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

/**
 * Service for creating notification content templates with localization
 * support.
 * Handles content generation for different notification types and languages.
 */
@Service
public class NotificationTemplateService {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationTemplateService.class);

    private final MessageSource messageSource;
    private final SpringTemplateEngine templateEngine;

    public NotificationTemplateService(MessageSource messageSource, SpringTemplateEngine templateEngine) {
        this.messageSource = messageSource;
        this.templateEngine = templateEngine;
    }

    /**
     * Create schedule reminder notification content
     * Requirements: 1.1, 1.2
     */
    public NotificationContentDTO createScheduleReminderContent(UserProfile user, Schedule schedule) {
        LOG.debug("Creating schedule reminder content for user: {} and schedule: {}", user.getUsername(),
                schedule.getId());

        Locale locale = getUserLocale(user);
        Context context = createBaseContext(user, locale);
        context.setVariable("schedule", schedule);
        context.setVariable("course", schedule.getCourse());
        context.setVariable("startTime", schedule.getStartTime().atZone(java.time.ZoneId.systemDefault())
                .format(DateTimeFormatter.ofPattern("HH:mm")));
        context.setVariable("date", schedule.getDate().atZone(java.time.ZoneId.systemDefault())
                .format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));

        String emailSubject = messageSource.getMessage("notification.schedule.reminder.email.subject",
                new Object[] { schedule.getCourse().getTitle() }, locale);
        String emailContent = templateEngine.process("notification/scheduleReminderEmail", context);

        String pushTitle = messageSource.getMessage("notification.schedule.reminder.push.title", null, locale);
        String pushMessage = messageSource.getMessage("notification.schedule.reminder.push.message",
                new Object[] { schedule.getCourse().getTitle(), context.getVariable("startTime") }, locale);

        Map<String, String> pushData = new HashMap<>();
        pushData.put("type", "schedule_reminder");
        pushData.put("scheduleId", schedule.getId().toString());
        pushData.put("courseId", schedule.getCourse().getId().toString());

        return new NotificationContentDTO()
                .emailSubject(emailSubject)
                .emailContent(emailContent)
                .pushTitle(pushTitle)
                .pushMessage(pushMessage)
                .pushData(pushData)
                .locale(locale.getLanguage());
    }

    /**
     * Create content update notification content
     * Requirements: 1.3, 3.1, 3.2, 3.3
     */
    public NotificationContentDTO createContentUpdateContent(UserProfile user, Lesson lesson) {
        LOG.debug("Creating content update notification for user: {} and lesson: {}", user.getUsername(),
                lesson.getTitle());

        Locale locale = getUserLocale(user);
        Context context = createBaseContext(user, locale);
        context.setVariable("lesson", lesson);
        context.setVariable("course", lesson.getCourse());

        String emailSubject = messageSource.getMessage("notification.content.update.email.subject",
                new Object[] { lesson.getTitle() }, locale);
        String emailContent = templateEngine.process("notification/contentUpdateEmail", context);

        String pushTitle = messageSource.getMessage("notification.content.update.push.title", null, locale);
        String pushMessage = messageSource.getMessage("notification.content.update.push.message",
                new Object[] { lesson.getTitle() }, locale);

        Map<String, String> pushData = new HashMap<>();
        pushData.put("type", "content_update");
        pushData.put("lessonId", lesson.getId().toString());
        pushData.put("courseId", lesson.getCourse().getId().toString());

        return new NotificationContentDTO()
                .emailSubject(emailSubject)
                .emailContent(emailContent)
                .pushTitle(pushTitle)
                .pushMessage(pushMessage)
                .pushData(pushData)
                .locale(locale.getLanguage());
    }

    /**
     * Create personalized notification content
     * Requirements: 2.1, 2.2, 2.3
     */
    public NotificationContentDTO createPersonalizedContent(UserProfile user, NotificationType type, Object context) {
        LOG.debug("Creating personalized notification content for user: {} and type: {}", user.getUsername(), type);

        Locale locale = getUserLocale(user);
        Context templateContext = createBaseContext(user, locale);
        templateContext.setVariable("context", context);

        String templateName = getTemplateNameForType(type);
        String messageKeyPrefix = getMessageKeyPrefix(type);

        String emailSubject = messageSource.getMessage(messageKeyPrefix + ".email.subject", null, locale);
        String emailContent = templateEngine.process(templateName, templateContext);

        String pushTitle = messageSource.getMessage(messageKeyPrefix + ".push.title", null, locale);
        String pushMessage = messageSource.getMessage(messageKeyPrefix + ".push.message", null, locale);

        Map<String, String> pushData = new HashMap<>();
        pushData.put("type", type.name().toLowerCase());

        return new NotificationContentDTO()
                .emailSubject(emailSubject)
                .emailContent(emailContent)
                .pushTitle(pushTitle)
                .pushMessage(pushMessage)
                .pushData(pushData)
                .locale(locale.getLanguage());
    }

    /**
     * Create quiz reminder notification content
     * Requirements: 2.2
     */
    public NotificationContentDTO createQuizReminderContent(UserProfile user, Quiz quiz, int hoursUntilDue) {
        LOG.debug("Creating quiz reminder content for user: {} and quiz: {}", user.getUsername(), quiz.getTitle());

        Locale locale = getUserLocale(user);
        Context context = createBaseContext(user, locale);
        context.setVariable("quiz", quiz);
        context.setVariable("hoursUntilDue", hoursUntilDue);

        String emailSubject = messageSource.getMessage("notification.quiz.reminder.email.subject",
                new Object[] { quiz.getTitle() }, locale);
        String emailContent = templateEngine.process("notification/quizReminderEmail", context);

        String pushTitle = messageSource.getMessage("notification.quiz.reminder.push.title", null, locale);
        String pushMessage = messageSource.getMessage("notification.quiz.reminder.push.message",
                new Object[] { quiz.getTitle(), hoursUntilDue }, locale);

        Map<String, String> pushData = new HashMap<>();
        pushData.put("type", "quiz_reminder");
        pushData.put("quizId", quiz.getId().toString());
        pushData.put("hoursUntilDue", String.valueOf(hoursUntilDue));

        return new NotificationContentDTO()
                .emailSubject(emailSubject)
                .emailContent(emailContent)
                .pushTitle(pushTitle)
                .pushMessage(pushMessage)
                .pushData(pushData)
                .locale(locale.getLanguage());
    }

    /**
     * Create course announcement notification content
     */
    public NotificationContentDTO createCourseAnnouncementContent(UserProfile user, Course course,
            String announcement) {
        LOG.debug("Creating course announcement content for user: {} and course: {}", user.getUsername(),
                course.getTitle());

        Locale locale = getUserLocale(user);
        Context context = createBaseContext(user, locale);
        context.setVariable("course", course);
        context.setVariable("announcement", announcement);

        String emailSubject = messageSource.getMessage("notification.course.announcement.email.subject",
                new Object[] { course.getTitle() }, locale);
        String emailContent = templateEngine.process("notification/courseAnnouncementEmail", context);

        String pushTitle = messageSource.getMessage("notification.course.announcement.push.title", null, locale);
        String pushMessage = messageSource.getMessage("notification.course.announcement.push.message",
                new Object[] { course.getTitle() }, locale);

        Map<String, String> pushData = new HashMap<>();
        pushData.put("type", "course_announcement");
        pushData.put("courseId", course.getId().toString());

        return new NotificationContentDTO()
                .emailSubject(emailSubject)
                .emailContent(emailContent)
                .pushTitle(pushTitle)
                .pushMessage(pushMessage)
                .pushData(pushData)
                .locale(locale.getLanguage());
    }

    /**
     * Create base template context with common variables
     */
    private Context createBaseContext(UserProfile user, Locale locale) {
        Context context = new Context(locale);
        context.setVariable("user", user);
        context.setVariable("fullName", user.getFullName());
        context.setVariable("username", user.getUsername());
        return context;
    }

    /**
     * Get user locale from preferences or default to English
     */
    private Locale getUserLocale(UserProfile user) {
        // For now, default to English. In the future, this could be retrieved from user
        // preferences
        // or determined from the user's profile settings
        return Locale.ENGLISH;
    }

    /**
     * Get template name for notification type
     */
    private String getTemplateNameForType(NotificationType type) {
        switch (type) {
            case SCHEDULE_REMINDER:
                return "notification/scheduleReminderEmail";
            case CONTENT_UPDATE:
                return "notification/contentUpdateEmail";
            case QUIZ_REMINDER:
                return "notification/quizReminderEmail";
            case ASSIGNMENT_DUE:
                return "notification/assignmentDueEmail";
            case COURSE_ANNOUNCEMENT:
                return "notification/courseAnnouncementEmail";
            case SYSTEM_NOTIFICATION:
                return "notification/systemNotificationEmail";
            default:
                return "notification/genericEmail";
        }
    }

    /**
     * Get message key prefix for notification type
     */
    private String getMessageKeyPrefix(NotificationType type) {
        switch (type) {
            case SCHEDULE_REMINDER:
                return "notification.schedule.reminder";
            case CONTENT_UPDATE:
                return "notification.content.update";
            case QUIZ_REMINDER:
                return "notification.quiz.reminder";
            case ASSIGNMENT_DUE:
                return "notification.assignment.due";
            case COURSE_ANNOUNCEMENT:
                return "notification.course.announcement";
            case SYSTEM_NOTIFICATION:
                return "notification.system";
            default:
                return "notification.generic";
        }
    }
}