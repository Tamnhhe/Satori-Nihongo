package com.satori.platform.service;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.NotificationType;
import com.satori.platform.repository.ScheduleRepository;
import com.satori.platform.repository.QuizRepository;
import com.satori.platform.repository.UserProfileRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Service for scheduling and managing background notification jobs.
 * Handles automatic notification delivery based on schedules and events.
 */
@Service
@Transactional
public class NotificationSchedulingService {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationSchedulingService.class);

    private final NotificationService notificationService;
    private final ScheduleRepository scheduleRepository;
    private final QuizRepository quizRepository;
    private final UserProfileRepository userProfileRepository;

    public NotificationSchedulingService(
            NotificationService notificationService,
            ScheduleRepository scheduleRepository,
            QuizRepository quizRepository,
            UserProfileRepository userProfileRepository) {
        this.notificationService = notificationService;
        this.scheduleRepository = scheduleRepository;
        this.quizRepository = quizRepository;
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * Check for upcoming schedules and send reminders
     * Runs every 30 minutes
     * Requirements: 1.1, 1.2
     */
    @Scheduled(fixedRate = 1800000) // 30 minutes
    public void checkScheduleReminders() {
        LOG.debug("Checking for schedule reminders");

        Instant now = Instant.now();
        Instant next24Hours = now.plus(24, ChronoUnit.HOURS);
        Instant next1Hour = now.plus(1, ChronoUnit.HOURS);

        try {
            // Find schedules in the next 24 hours for teacher reminders
            List<Schedule> upcomingSchedules24h = scheduleRepository.findByDateBetween(now, next24Hours);

            for (Schedule schedule : upcomingSchedules24h) {
                // Send teacher reminder 24 hours before
                if (schedule.getCourse() != null && schedule.getCourse().getTeacher() != null) {
                    UserProfile teacherUser = schedule.getCourse().getTeacher();
                    notificationService.sendScheduleReminder(teacherUser, schedule);
                }
            }

            // Find schedules in the next 1 hour for urgent teacher reminders
            List<Schedule> upcomingSchedules1h = scheduleRepository.findByDateBetween(now, next1Hour);

            for (Schedule schedule : upcomingSchedules1h) {
                // Send urgent teacher reminder 1 hour before
                if (schedule.getCourse() != null && schedule.getCourse().getTeacher() != null) {
                    UserProfile teacherUser = schedule.getCourse().getTeacher();
                    notificationService.sendScheduleReminder(teacherUser, schedule);
                }
            }

            LOG.debug("Processed {} schedule reminders for 24h and {} for 1h",
                    upcomingSchedules24h.size(), upcomingSchedules1h.size());

        } catch (Exception e) {
            LOG.error("Error processing schedule reminders", e);
        }
    }

    /**
     * Check for student lesson reminders
     * Runs every 15 minutes
     * Requirements: 2.1
     */
    @Scheduled(fixedRate = 900000) // 15 minutes
    public void checkStudentLessonReminders() {
        LOG.debug("Checking for student lesson reminders");

        Instant now = Instant.now();
        Instant next2Hours = now.plus(2, ChronoUnit.HOURS);

        try {
            // Find schedules in the next 2 hours for student reminders
            List<Schedule> upcomingSchedules = scheduleRepository.findByDateBetween(now, next2Hours);

            for (Schedule schedule : upcomingSchedules) {
                // Get enrolled students for this schedule's course
                if (schedule.getCourse() != null) {
                    List<UserProfile> enrolledStudents = userProfileRepository
                            .findStudentsByCourseId(schedule.getCourse().getId());

                    for (UserProfile student : enrolledStudents) {
                        notificationService.sendPersonalizedReminder(
                                student,
                                NotificationType.SCHEDULE_REMINDER,
                                schedule);
                    }
                }
            }

            LOG.debug("Processed student lesson reminders for {} schedules", upcomingSchedules.size());

        } catch (Exception e) {
            LOG.error("Error processing student lesson reminders", e);
        }
    }

    /**
     * Check for quiz reminders
     * Runs every hour
     * Requirements: 2.2
     */
    @Scheduled(fixedRate = 3600000) // 1 hour
    public void checkQuizReminders() {
        LOG.debug("Checking for quiz reminders");

        Instant now = Instant.now();
        Instant next24Hours = now.plus(24, ChronoUnit.HOURS);

        try {
            // Find active quizzes with due dates in the next 24 hours
            List<Quiz> upcomingQuizzes = quizRepository.findActiveQuizzesWithDueDateBetween(now, next24Hours);

            for (Quiz quiz : upcomingQuizzes) {
                // Since Quiz doesn't have dueDate, we'll use a default reminder period
                int hoursUntilDue = 24; // Default 24 hours reminder

                // Get enrolled students for this quiz's courses
                for (Course course : quiz.getCourses()) {
                    List<UserProfile> enrolledStudents = userProfileRepository
                            .findStudentsByCourseId(course.getId());

                    for (UserProfile student : enrolledStudents) {
                        notificationService.sendQuizReminder(student, quiz, hoursUntilDue);
                    }
                }
            }

            LOG.debug("Processed quiz reminders for {} quizzes", upcomingQuizzes.size());

        } catch (Exception e) {
            LOG.error("Error processing quiz reminders", e);
        }
    }

    /**
     * Send personalized study reminders based on user preferences
     * Runs every 2 hours
     * Requirements: 2.3, 2.4
     */
    @Scheduled(fixedRate = 7200000) // 2 hours
    public void sendPersonalizedStudyReminders() {
        LOG.debug("Sending personalized study reminders");

        try {
            // Get all active students
            List<UserProfile> students = userProfileRepository.findAllActiveStudents();

            for (UserProfile student : students) {
                // Check if student has any pending lessons or assignments
                // This would be enhanced based on student progress tracking
                notificationService.sendPersonalizedReminder(
                        student,
                        NotificationType.SYSTEM_NOTIFICATION,
                        "study_reminder");
            }

            LOG.debug("Sent personalized study reminders to {} students", students.size());

        } catch (Exception e) {
            LOG.error("Error sending personalized study reminders", e);
        }
    }

    /**
     * Clean up old notifications and expired data
     * Runs daily at 2 AM
     */
    @Scheduled(cron = "0 0 2 * * ?")
    public void cleanupNotificationData() {
        LOG.debug("Cleaning up old notification data");

        try {
            // This would clean up old notification logs, expired tokens, etc.
            // Implementation depends on notification history storage

            LOG.debug("Completed notification data cleanup");

        } catch (Exception e) {
            LOG.error("Error during notification data cleanup", e);
        }
    }
}