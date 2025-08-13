package com.satori.platform.validation;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.*;
import com.satori.platform.repository.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

/**
 * Builder pattern for creating test data entities for repository tests.
 * Provides a fluent API for test data creation with sensible defaults.
 * Separated from the DTO-focused TestDataBuilder to avoid confusion.
 */
public class RepositoryTestDataBuilder {

    private final UserProfileRepository userProfileRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;

    public RepositoryTestDataBuilder(UserProfileRepository userProfileRepository,
            CourseRepository courseRepository,
            LessonRepository lessonRepository) {
        this.userProfileRepository = userProfileRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
    }

    // Entity creation methods with sensible defaults
    public UserProfile createTestUserProfile(String username, String email) {
        UserProfile userProfile = new UserProfile();
        userProfile.setUsername(username);
        userProfile.setPasswordHash("hashedpassword");
        userProfile.setEmail(email);
        userProfile.setFullName("Test User");
        userProfile.setRole(Role.HOC_VIEN);
        return userProfileRepository.save(userProfile);
    }

    public Course createTestCourse(String courseCode, String title, UserProfile teacher) {
        Course course = new Course();
        course.setCourseCode(courseCode);
        course.setTitle(title);
        course.setDescription("Test Course Description");
        course.setTeacher(teacher);
        course.setCreatedDate(Instant.now());
        course.setLastModifiedDate(Instant.now());
        return courseRepository.save(course);
    }

    public Lesson createTestLesson(String title, Course course) {
        Lesson lesson = new Lesson();
        lesson.setTitle(title);
        lesson.setContent("Test Lesson Content");
        lesson.setCourse(course);
        return lessonRepository.save(lesson);
    }

    // Builder pattern for FileMetaData
    public FileMetaDataBuilder fileMetaData() {
        return new FileMetaDataBuilder();
    }

    public static class FileMetaDataBuilder {
        private final FileMetaData fileMetaData = new FileMetaData();

        public FileMetaDataBuilder() {
            // Set sensible defaults
            fileMetaData.setFileName("default-file.pdf");
            fileMetaData.setOriginalName("Default File.pdf");
            fileMetaData.setMimeType("application/pdf");
            fileMetaData.setFileSize(1024L);
            fileMetaData.setChecksum("default-checksum");
            fileMetaData.setFolderPath("/uploads/default");
            fileMetaData.setDescription("Default test file");
            fileMetaData.setIsPublic(true);
            fileMetaData.setUploadDate(Instant.now());
            fileMetaData.setLastAccessedDate(Instant.now());
            fileMetaData.setDownloadCount(0);
        }

        public FileMetaDataBuilder withFileName(String fileName) {
            fileMetaData.setFileName(fileName);
            return this;
        }

        public FileMetaDataBuilder withOriginalName(String originalName) {
            fileMetaData.setOriginalName(originalName);
            return this;
        }

        public FileMetaDataBuilder withMimeType(String mimeType) {
            fileMetaData.setMimeType(mimeType);
            return this;
        }

        public FileMetaDataBuilder withFileSize(Long fileSize) {
            fileMetaData.setFileSize(fileSize);
            return this;
        }

        public FileMetaDataBuilder withUploadedBy(UserProfile uploadedBy) {
            fileMetaData.setUploadedBy(uploadedBy);
            return this;
        }

        public FileMetaDataBuilder withLesson(Lesson lesson) {
            fileMetaData.setLesson(lesson);
            return this;
        }

        public FileMetaDataBuilder withChecksum(String checksum) {
            fileMetaData.setChecksum(checksum);
            return this;
        }

        public FileMetaDataBuilder withFolderPath(String folderPath) {
            fileMetaData.setFolderPath(folderPath);
            return this;
        }

        public FileMetaDataBuilder withPublic(boolean isPublic) {
            fileMetaData.setIsPublic(isPublic);
            return this;
        }

        public FileMetaData build() {
            return fileMetaData;
        }
    }

    // Builder for NotificationDelivery
    public NotificationDeliveryBuilder notificationDelivery() {
        return new NotificationDeliveryBuilder();
    }

    public static class NotificationDeliveryBuilder {
        private final NotificationDelivery notification = new NotificationDelivery();

        public NotificationDeliveryBuilder() {
            // Set sensible defaults
            notification.setNotificationType(NotificationType.SYSTEM_NOTIFICATION);
            notification.setDeliveryChannel("EMAIL");
            notification.setSubject("Default Test Notification");
            notification.setContent("Default test notification content");
            notification.setStatus(DeliveryStatus.PENDING);
            notification.setCreatedAt(Instant.now());
            notification.setRetryCount(0);
            notification.setMaxRetries(3);
        }

        public NotificationDeliveryBuilder withRecipientId(Long recipientId) {
            notification.setRecipientId(recipientId);
            return this;
        }

        public NotificationDeliveryBuilder withNotificationType(NotificationType type) {
            notification.setNotificationType(type);
            return this;
        }

        public NotificationDeliveryBuilder withDeliveryChannel(String channel) {
            notification.setDeliveryChannel(channel);
            return this;
        }

        public NotificationDeliveryBuilder withSubject(String subject) {
            notification.setSubject(subject);
            return this;
        }

        public NotificationDeliveryBuilder withContent(String content) {
            notification.setContent(content);
            return this;
        }

        public NotificationDeliveryBuilder withStatus(DeliveryStatus status) {
            notification.setStatus(status);
            return this;
        }

        public NotificationDeliveryBuilder withScheduledAt(Instant scheduledAt) {
            notification.setScheduledAt(scheduledAt);
            return this;
        }

        public NotificationDeliveryBuilder withSentAt(Instant sentAt) {
            notification.setSentAt(sentAt);
            return this;
        }

        public NotificationDeliveryBuilder withDeliveredAt(Instant deliveredAt) {
            notification.setDeliveredAt(deliveredAt);
            return this;
        }

        public NotificationDelivery build() {
            return notification;
        }
    }

    // Builder for NotificationPreference
    public NotificationPreferenceBuilder notificationPreference() {
        return new NotificationPreferenceBuilder();
    }

    public static class NotificationPreferenceBuilder {
        private final NotificationPreference preference = new NotificationPreference();

        public NotificationPreferenceBuilder() {
            // Set sensible defaults
            preference.setNotificationType(NotificationType.SYSTEM_NOTIFICATION);
            preference.setEnabled(true);
        }

        public NotificationPreferenceBuilder withUserProfile(UserProfile userProfile) {
            preference.setUserProfile(userProfile);
            return this;
        }

        public NotificationPreferenceBuilder withNotificationType(NotificationType type) {
            preference.setNotificationType(type);
            return this;
        }

        public NotificationPreferenceBuilder withEnabled(boolean enabled) {
            preference.setEnabled(enabled);
            return this;
        }

        public NotificationPreference build() {
            return preference;
        }
    }

    // Builder for AuditLog
    public AuditLogBuilder auditLog() {
        return new AuditLogBuilder();
    }

    public static class AuditLogBuilder {
        private final AuditLog auditLog = new AuditLog();

        public AuditLogBuilder() {
            // Set sensible defaults
            auditLog.setUsername("testuser");
            auditLog.setAction(AuditAction.CREATE);
            auditLog.setResourceType("TestResource");
            auditLog.setResourceId(1L);
            auditLog.setTimestamp(Instant.now());
            auditLog.setIpAddress("192.168.1.1");
            auditLog.setUserAgent("Test User Agent");
            auditLog.setSuccess(true);
            auditLog.setDetails("Test audit log entry");
        }

        public AuditLogBuilder withUsername(String username) {
            auditLog.setUsername(username);
            return this;
        }

        public AuditLogBuilder withAction(AuditAction action) {
            auditLog.setAction(action);
            return this;
        }

        public AuditLogBuilder withResourceType(String resourceType) {
            auditLog.setResourceType(resourceType);
            return this;
        }

        public AuditLogBuilder withResourceId(Long resourceId) {
            auditLog.setResourceId(resourceId);
            return this;
        }

        public AuditLogBuilder withTimestamp(Instant timestamp) {
            auditLog.setTimestamp(timestamp);
            return this;
        }

        public AuditLogBuilder withSuccess(boolean success) {
            auditLog.setSuccess(success);
            return this;
        }

        public AuditLogBuilder withDetails(String details) {
            auditLog.setDetails(details);
            return this;
        }

        public AuditLog build() {
            return auditLog;
        }
    }

    // Builder for GiftCode
    public GiftCodeBuilder giftCode() {
        return new GiftCodeBuilder();
    }

    public static class GiftCodeBuilder {
        private final GiftCode giftCode = new GiftCode();

        public GiftCodeBuilder() {
            // Set sensible defaults
            giftCode.setCode("DEFAULT123");
            giftCode.setCreatedDate(LocalDateTime.now());
            giftCode.setExpiryDate(LocalDateTime.now().plusDays(30));
            giftCode.setActive(true);
            giftCode.setMaxUses(10);
            giftCode.setCurrentUses(0);
            giftCode.setDescription("Default test gift code");
        }

        public GiftCodeBuilder withCode(String code) {
            giftCode.setCode(code);
            return this;
        }

        public GiftCodeBuilder withCourse(Course course) {
            giftCode.setCourse(course);
            return this;
        }

        public GiftCodeBuilder withCreatedBy(UserProfile createdBy) {
            giftCode.setCreatedBy(createdBy);
            return this;
        }

        public GiftCodeBuilder withExpiryDate(LocalDateTime expiryDate) {
            giftCode.setExpiryDate(expiryDate);
            return this;
        }

        public GiftCodeBuilder withActive(boolean active) {
            giftCode.setActive(active);
            return this;
        }

        public GiftCodeBuilder withMaxUses(int maxUses) {
            giftCode.setMaxUses(maxUses);
            return this;
        }

        public GiftCode build() {
            return giftCode;
        }
    }

    // Convenience methods for creating multiple entities for performance testing
    public void createMultipleFileMetaData(int count, UserProfile uploadedBy, Lesson lesson) {
        for (int i = 0; i < count; i++) {
            fileMetaData()
                    .withFileName("perf-file-" + i + ".txt")
                    .withOriginalName("Performance File " + i + ".txt")
                    .withMimeType("text/plain")
                    .withFileSize(512L)
                    .withChecksum("perf" + i)
                    .withFolderPath("/uploads/performance")
                    .withUploadedBy(uploadedBy)
                    .withLesson(lesson)
                    .build();
        }
    }

    public void createNotificationAnalyticsScenario(UserProfile recipient) {
        Instant baseTime = Instant.now().minus(1, ChronoUnit.DAYS);

        // Create successful notifications
        for (int i = 0; i < 5; i++) {
            notificationDelivery()
                    .withRecipientId(recipient.getId())
                    .withNotificationType(NotificationType.QUIZ_REMINDER)
                    .withSubject("Quiz Reminder " + i)
                    .withStatus(DeliveryStatus.DELIVERED)
                    .withScheduledAt(baseTime.plus(i, ChronoUnit.HOURS))
                    .withSentAt(baseTime.plus(i, ChronoUnit.HOURS).plus(1, ChronoUnit.MINUTES))
                    .withDeliveredAt(baseTime.plus(i, ChronoUnit.HOURS).plus(2, ChronoUnit.MINUTES))
                    .build();
        }

        // Create failed notifications
        for (int i = 0; i < 2; i++) {
            notificationDelivery()
                    .withRecipientId(recipient.getId())
                    .withNotificationType(NotificationType.LESSON_REMINDER)
                    .withDeliveryChannel("SMS")
                    .withSubject("Lesson Reminder " + i)
                    .withStatus(DeliveryStatus.FAILED)
                    .withScheduledAt(baseTime.plus(i + 6, ChronoUnit.HOURS))
                    .build();
        }
    }
}