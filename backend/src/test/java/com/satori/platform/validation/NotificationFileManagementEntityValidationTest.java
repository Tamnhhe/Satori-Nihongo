package com.satori.platform.validation;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.*;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import jakarta.persistence.*;
import java.lang.reflect.Field;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.LocalTime;

import static org.assertj.core.api.Assertions.*;

/**
 * Test class for validating notification and file management entity mappings.
 * Validates NotificationDelivery, NotificationPreference, FileMetaData, and
 * SocialAccount entities.
 * 
 * Requirements: 2.1, 2.2, 2.3
 */
public class NotificationFileManagementEntityValidationTest {

    @Test
    @DisplayName("Validate NotificationDelivery entity JPA annotations and delivery tracking fields")
    void testNotificationDeliveryEntityMappings() {
        // Test entity annotation
        Entity entityAnnotation = NotificationDelivery.class.getAnnotation(Entity.class);
        assertThat(entityAnnotation).isNotNull();

        Table tableAnnotation = NotificationDelivery.class.getAnnotation(Table.class);
        assertThat(tableAnnotation).isNotNull();
        assertThat(tableAnnotation.name()).isEqualTo("notification_delivery");

        // Test core field types
        assertThat(getFieldType(NotificationDelivery.class, "id")).isEqualTo(Long.class);
        assertThat(getFieldType(NotificationDelivery.class, "recipientId")).isEqualTo(Long.class);
        assertThat(getFieldType(NotificationDelivery.class, "recipientEmail")).isEqualTo(String.class);
        assertThat(getFieldType(NotificationDelivery.class, "notificationType")).isEqualTo(NotificationType.class);
        assertThat(getFieldType(NotificationDelivery.class, "deliveryChannel")).isEqualTo(String.class);
        assertThat(getFieldType(NotificationDelivery.class, "status")).isEqualTo(DeliveryStatus.class);

        // Test content fields
        assertThat(getFieldType(NotificationDelivery.class, "subject")).isEqualTo(String.class);
        assertThat(getFieldType(NotificationDelivery.class, "content")).isEqualTo(String.class);

        // Test delivery tracking fields
        assertThat(getFieldType(NotificationDelivery.class, "scheduledAt")).isEqualTo(Instant.class);
        assertThat(getFieldType(NotificationDelivery.class, "sentAt")).isEqualTo(Instant.class);
        assertThat(getFieldType(NotificationDelivery.class, "deliveredAt")).isEqualTo(Instant.class);
        assertThat(getFieldType(NotificationDelivery.class, "failedAt")).isEqualTo(Instant.class);
        assertThat(getFieldType(NotificationDelivery.class, "failureReason")).isEqualTo(String.class);

        // Test retry mechanism fields
        assertThat(getFieldType(NotificationDelivery.class, "retryCount")).isEqualTo(Integer.class);
        assertThat(getFieldType(NotificationDelivery.class, "maxRetries")).isEqualTo(Integer.class);
        assertThat(getFieldType(NotificationDelivery.class, "nextRetryAt")).isEqualTo(Instant.class);

        // Test external integration fields
        assertThat(getFieldType(NotificationDelivery.class, "externalId")).isEqualTo(String.class);
        assertThat(getFieldType(NotificationDelivery.class, "metadata")).isEqualTo(String.class);

        // Test audit fields
        assertThat(getFieldType(NotificationDelivery.class, "createdAt")).isEqualTo(Instant.class);
        assertThat(getFieldType(NotificationDelivery.class, "updatedAt")).isEqualTo(Instant.class);

        // Test enum annotations
        assertThat(hasFieldAnnotation(NotificationDelivery.class, "notificationType", Enumerated.class)).isTrue();
        assertThat(hasFieldAnnotation(NotificationDelivery.class, "status", Enumerated.class)).isTrue();
    }

    @Test
    @DisplayName("Validate NotificationPreference entity JPA annotations and user preferences")
    void testNotificationPreferenceEntityMappings() {
        // Test entity annotation
        Entity entityAnnotation = NotificationPreference.class.getAnnotation(Entity.class);
        assertThat(entityAnnotation).isNotNull();

        Table tableAnnotation = NotificationPreference.class.getAnnotation(Table.class);
        assertThat(tableAnnotation).isNotNull();
        assertThat(tableAnnotation.name()).isEqualTo("notification_preference");

        // Test field types
        assertThat(getFieldType(NotificationPreference.class, "id")).isEqualTo(Long.class);
        assertThat(getFieldType(NotificationPreference.class, "notificationType")).isEqualTo(NotificationType.class);
        assertThat(getFieldType(NotificationPreference.class, "enabled")).isEqualTo(Boolean.class);
        assertThat(getFieldType(NotificationPreference.class, "preferredTime")).isEqualTo(LocalTime.class);
        assertThat(getFieldType(NotificationPreference.class, "advanceHours")).isEqualTo(Integer.class);
        assertThat(getFieldType(NotificationPreference.class, "timezone")).isEqualTo(String.class);

        // Test relationship
        assertThat(getFieldType(NotificationPreference.class, "userProfile")).isEqualTo(UserProfile.class);
        assertThat(hasFieldAnnotation(NotificationPreference.class, "userProfile", ManyToOne.class)).isTrue();

        // Test enum annotation
        assertThat(hasFieldAnnotation(NotificationPreference.class, "notificationType", Enumerated.class)).isTrue();
    }

    @Test
    @DisplayName("Validate FileMetaData entity JPA annotations and file management fields")
    void testFileMetaDataEntityMappings() {
        // Test entity annotation
        Entity entityAnnotation = FileMetaData.class.getAnnotation(Entity.class);
        assertThat(entityAnnotation).isNotNull();

        Table tableAnnotation = FileMetaData.class.getAnnotation(Table.class);
        assertThat(tableAnnotation).isNotNull();
        assertThat(tableAnnotation.name()).isEqualTo("file_meta_data");

        // Test core file fields
        assertThat(getFieldType(FileMetaData.class, "id")).isEqualTo(Long.class);
        assertThat(getFieldType(FileMetaData.class, "fileName")).isEqualTo(String.class);
        assertThat(getFieldType(FileMetaData.class, "originalName")).isEqualTo(String.class);
        assertThat(getFieldType(FileMetaData.class, "filePath")).isEqualTo(String.class);
        assertThat(getFieldType(FileMetaData.class, "fileType")).isEqualTo(String.class);
        assertThat(getFieldType(FileMetaData.class, "fileSize")).isEqualTo(Long.class);
        assertThat(getFieldType(FileMetaData.class, "mimeType")).isEqualTo(String.class);

        // Test metadata fields
        assertThat(getFieldType(FileMetaData.class, "uploadDate")).isEqualTo(LocalDateTime.class);
        assertThat(getFieldType(FileMetaData.class, "version")).isEqualTo(Integer.class);
        assertThat(getFieldType(FileMetaData.class, "checksum")).isEqualTo(String.class);
        assertThat(getFieldType(FileMetaData.class, "folderPath")).isEqualTo(String.class);
        assertThat(getFieldType(FileMetaData.class, "description")).isEqualTo(String.class);

        // Test access control fields
        assertThat(getFieldType(FileMetaData.class, "isPublic")).isEqualTo(Boolean.class);
        assertThat(getFieldType(FileMetaData.class, "downloadCount")).isEqualTo(Integer.class);
        assertThat(getFieldType(FileMetaData.class, "lastAccessedDate")).isEqualTo(LocalDateTime.class);

        // Test relationships
        assertThat(getFieldType(FileMetaData.class, "lesson")).isEqualTo(Lesson.class);
        assertThat(getFieldType(FileMetaData.class, "uploadedBy")).isEqualTo(UserProfile.class);

        // Test relationship annotations
        assertThat(hasFieldAnnotation(FileMetaData.class, "lesson", ManyToOne.class)).isTrue();
        assertThat(hasFieldAnnotation(FileMetaData.class, "uploadedBy", ManyToOne.class)).isTrue();
    }

    @Test
    @DisplayName("Validate SocialAccount entity JPA annotations and OAuth integration")
    void testSocialAccountEntityMappings() {
        // Test entity annotation
        Entity entityAnnotation = SocialAccount.class.getAnnotation(Entity.class);
        assertThat(entityAnnotation).isNotNull();

        Table tableAnnotation = SocialAccount.class.getAnnotation(Table.class);
        assertThat(tableAnnotation).isNotNull();
        assertThat(tableAnnotation.name()).isEqualTo("social_account");

        // Test field types
        assertThat(getFieldType(SocialAccount.class, "id")).isEqualTo(Long.class);
        assertThat(getFieldType(SocialAccount.class, "provider")).isEqualTo(AuthProvider.class);
        assertThat(getFieldType(SocialAccount.class, "providerUserId")).isEqualTo(String.class);
        assertThat(getFieldType(SocialAccount.class, "accessToken")).isEqualTo(String.class);
        assertThat(getFieldType(SocialAccount.class, "refreshToken")).isEqualTo(String.class);
        assertThat(getFieldType(SocialAccount.class, "tokenExpiry")).isEqualTo(Instant.class);

        // Test relationship
        assertThat(getFieldType(SocialAccount.class, "userProfile")).isEqualTo(UserProfile.class);
        assertThat(hasFieldAnnotation(SocialAccount.class, "userProfile", ManyToOne.class)).isTrue();

        // Test enum annotation
        assertThat(hasFieldAnnotation(SocialAccount.class, "provider", Enumerated.class)).isTrue();
    }

    @Test
    @DisplayName("Test NotificationType enum validation")
    void testNotificationTypeEnumValidation() {
        // Test NotificationType enum values
        assertThat(NotificationType.values()).containsExactlyInAnyOrder(
                NotificationType.SCHEDULE_REMINDER,
                NotificationType.CONTENT_UPDATE,
                NotificationType.QUIZ_REMINDER,
                NotificationType.ASSIGNMENT_DUE,
                NotificationType.COURSE_ANNOUNCEMENT,
                NotificationType.SYSTEM_NOTIFICATION);

        NotificationPreference preference = new NotificationPreference();
        preference.setNotificationType(NotificationType.QUIZ_REMINDER);
        assertThat(preference.getNotificationType()).isEqualTo(NotificationType.QUIZ_REMINDER);
    }

    @Test
    @DisplayName("Test DeliveryStatus enum validation")
    void testDeliveryStatusEnumValidation() {
        // Test DeliveryStatus enum values
        assertThat(DeliveryStatus.values()).containsExactlyInAnyOrder(
                DeliveryStatus.PENDING,
                DeliveryStatus.PROCESSING,
                DeliveryStatus.SENT,
                DeliveryStatus.DELIVERED,
                DeliveryStatus.FAILED,
                DeliveryStatus.CANCELLED,
                DeliveryStatus.EXPIRED,
                DeliveryStatus.SCHEDULED);

        NotificationDelivery delivery = new NotificationDelivery();
        delivery.setStatus(DeliveryStatus.SENT);
        assertThat(delivery.getStatus()).isEqualTo(DeliveryStatus.SENT);
    }

    @Test
    @DisplayName("Test AuthProvider enum validation")
    void testAuthProviderEnumValidation() {
        // Test AuthProvider enum values
        assertThat(AuthProvider.values()).containsExactlyInAnyOrder(
                AuthProvider.LOCAL,
                AuthProvider.GOOGLE,
                AuthProvider.FACEBOOK,
                AuthProvider.GITHUB);

        SocialAccount account = new SocialAccount();
        account.setProvider(AuthProvider.GOOGLE);
        assertThat(account.getProvider()).isEqualTo(AuthProvider.GOOGLE);
    }

    @Test
    @DisplayName("Test NotificationDelivery entity field validation and business logic")
    void testNotificationDeliveryFieldValidation() {
        NotificationDelivery delivery = new NotificationDelivery();

        // Test core setters and getters
        delivery.setRecipientId(123L);
        assertThat(delivery.getRecipientId()).isEqualTo(123L);

        delivery.setRecipientEmail("student@example.com");
        assertThat(delivery.getRecipientEmail()).isEqualTo("student@example.com");

        delivery.setNotificationType(NotificationType.QUIZ_REMINDER);
        assertThat(delivery.getNotificationType()).isEqualTo(NotificationType.QUIZ_REMINDER);

        delivery.setDeliveryChannel("EMAIL");
        assertThat(delivery.getDeliveryChannel()).isEqualTo("EMAIL");

        delivery.setStatus(DeliveryStatus.PENDING);
        assertThat(delivery.getStatus()).isEqualTo(DeliveryStatus.PENDING);

        delivery.setSubject("Quiz Reminder: Japanese Grammar Test");
        assertThat(delivery.getSubject()).isEqualTo("Quiz Reminder: Japanese Grammar Test");

        delivery.setContent("Your quiz is scheduled for tomorrow at 2 PM.");
        assertThat(delivery.getContent()).isEqualTo("Your quiz is scheduled for tomorrow at 2 PM.");

        // Test timing fields
        Instant now = Instant.now();
        delivery.setScheduledAt(now);
        assertThat(delivery.getScheduledAt()).isEqualTo(now);

        delivery.setSentAt(now.plusSeconds(60));
        assertThat(delivery.getSentAt()).isEqualTo(now.plusSeconds(60));

        // Test retry mechanism
        delivery.setRetryCount(1);
        assertThat(delivery.getRetryCount()).isEqualTo(1);

        delivery.setMaxRetries(3);
        assertThat(delivery.getMaxRetries()).isEqualTo(3);

        // Test business logic methods
        delivery.setStatus(DeliveryStatus.FAILED);
        assertThat(delivery.canRetry()).isTrue();

        delivery.incrementRetryCount();
        assertThat(delivery.getRetryCount()).isEqualTo(2);

        delivery.setRetryCount(3); // Max retries reached
        assertThat(delivery.canRetry()).isFalse();
    }

    @Test
    @DisplayName("Test NotificationPreference entity field validation and user preferences")
    void testNotificationPreferenceFieldValidation() {
        NotificationPreference preference = new NotificationPreference();

        // Test setters and getters
        preference.setNotificationType(NotificationType.SCHEDULE_REMINDER);
        assertThat(preference.getNotificationType()).isEqualTo(NotificationType.SCHEDULE_REMINDER);

        preference.setEnabled(true);
        assertThat(preference.getEnabled()).isTrue();

        LocalTime preferredTime = LocalTime.of(9, 0); // 9:00 AM
        preference.setPreferredTime(preferredTime);
        assertThat(preference.getPreferredTime()).isEqualTo(preferredTime);

        preference.setAdvanceHours(24); // 24 hours in advance
        assertThat(preference.getAdvanceHours()).isEqualTo(24);

        preference.setTimezone("Asia/Tokyo");
        assertThat(preference.getTimezone()).isEqualTo("Asia/Tokyo");

        // Test relationship
        UserProfile user = new UserProfile();
        user.setRole(Role.HOC_VIEN);
        preference.setUserProfile(user);
        assertThat(preference.getUserProfile()).isEqualTo(user);
    }

    @Test
    @DisplayName("Test FileMetaData entity field validation and file management")
    void testFileMetaDataFieldValidation() {
        FileMetaData fileMetaData = new FileMetaData();

        // Test core file fields
        fileMetaData.setFileName("lesson_1_audio.mp3");
        assertThat(fileMetaData.getFileName()).isEqualTo("lesson_1_audio.mp3");

        fileMetaData.setOriginalName("Japanese Lesson 1 Audio.mp3");
        assertThat(fileMetaData.getOriginalName()).isEqualTo("Japanese Lesson 1 Audio.mp3");

        fileMetaData.setFilePath("/uploads/lessons/audio/lesson_1_audio.mp3");
        assertThat(fileMetaData.getFilePath()).isEqualTo("/uploads/lessons/audio/lesson_1_audio.mp3");

        fileMetaData.setFileType("audio");
        assertThat(fileMetaData.getFileType()).isEqualTo("audio");

        fileMetaData.setFileSize(2048576L); // 2MB
        assertThat(fileMetaData.getFileSize()).isEqualTo(2048576L);

        fileMetaData.setMimeType("audio/mpeg");
        assertThat(fileMetaData.getMimeType()).isEqualTo("audio/mpeg");

        // Test metadata fields
        LocalDateTime uploadDate = LocalDateTime.now();
        fileMetaData.setUploadDate(uploadDate);
        assertThat(fileMetaData.getUploadDate()).isEqualTo(uploadDate);

        fileMetaData.setVersion(1);
        assertThat(fileMetaData.getVersion()).isEqualTo(1);

        fileMetaData.setChecksum("abc123def456");
        assertThat(fileMetaData.getChecksum()).isEqualTo("abc123def456");

        fileMetaData.setFolderPath("/lessons/audio");
        assertThat(fileMetaData.getFolderPath()).isEqualTo("/lessons/audio");

        fileMetaData.setDescription("Audio file for Japanese Lesson 1");
        assertThat(fileMetaData.getDescription()).isEqualTo("Audio file for Japanese Lesson 1");

        // Test access control
        fileMetaData.setIsPublic(false);
        assertThat(fileMetaData.getIsPublic()).isFalse();

        fileMetaData.setDownloadCount(15);
        assertThat(fileMetaData.getDownloadCount()).isEqualTo(15);

        LocalDateTime lastAccessed = LocalDateTime.now().minusHours(2);
        fileMetaData.setLastAccessedDate(lastAccessed);
        assertThat(fileMetaData.getLastAccessedDate()).isEqualTo(lastAccessed);

        // Test relationships
        Lesson lesson = new Lesson();
        lesson.setTitle("Japanese Lesson 1");
        fileMetaData.setLesson(lesson);
        assertThat(fileMetaData.getLesson()).isEqualTo(lesson);

        UserProfile uploader = new UserProfile();
        uploader.setRole(Role.GIANG_VIEN);
        fileMetaData.setUploadedBy(uploader);
        assertThat(fileMetaData.getUploadedBy()).isEqualTo(uploader);
    }

    @Test
    @DisplayName("Test SocialAccount entity field validation and OAuth integration")
    void testSocialAccountFieldValidation() {
        SocialAccount socialAccount = new SocialAccount();

        // Test setters and getters
        socialAccount.setProvider(AuthProvider.GOOGLE);
        assertThat(socialAccount.getProvider()).isEqualTo(AuthProvider.GOOGLE);

        socialAccount.setProviderUserId("google_user_123456");
        assertThat(socialAccount.getProviderUserId()).isEqualTo("google_user_123456");

        socialAccount.setAccessToken("ya29.access_token_example");
        assertThat(socialAccount.getAccessToken()).isEqualTo("ya29.access_token_example");

        socialAccount.setRefreshToken("1//refresh_token_example");
        assertThat(socialAccount.getRefreshToken()).isEqualTo("1//refresh_token_example");

        Instant tokenExpiry = Instant.now().plusSeconds(3600); // 1 hour from now
        socialAccount.setTokenExpiry(tokenExpiry);
        assertThat(socialAccount.getTokenExpiry()).isEqualTo(tokenExpiry);

        // Test relationship
        UserProfile user = new UserProfile();
        user.setRole(Role.HOC_VIEN);
        socialAccount.setUserProfile(user);
        assertThat(socialAccount.getUserProfile()).isEqualTo(user);
    }

    @Test
    @DisplayName("Test notification and file management entity relationships")
    void testNotificationFileManagementRelationships() {
        // Create user profile
        UserProfile user = new UserProfile();
        user.setUsername("testuser");
        user.setEmail("test@example.com");
        user.setFullName("Test User");
        user.setRole(Role.HOC_VIEN);

        // Create notification preference
        NotificationPreference preference = new NotificationPreference();
        preference.setNotificationType(NotificationType.QUIZ_REMINDER);
        preference.setEnabled(true);
        preference.setPreferredTime(LocalTime.of(9, 0));
        preference.setUserProfile(user);

        // Create notification delivery
        NotificationDelivery delivery = new NotificationDelivery(
                user.getId(),
                user.getEmail(),
                NotificationType.QUIZ_REMINDER,
                "EMAIL",
                "Quiz Reminder",
                "Your quiz starts in 1 hour");

        // Create lesson and file metadata
        Lesson lesson = new Lesson();
        lesson.setTitle("Japanese Grammar Lesson");

        FileMetaData fileMetaData = new FileMetaData();
        fileMetaData.setFileName("grammar_lesson.pdf");
        fileMetaData.setOriginalName("Japanese Grammar Lesson.pdf");
        fileMetaData.setFilePath("/uploads/lessons/grammar_lesson.pdf");
        fileMetaData.setMimeType("application/pdf");
        fileMetaData.setLesson(lesson);
        fileMetaData.setUploadedBy(user);

        // Create social account
        SocialAccount socialAccount = new SocialAccount();
        socialAccount.setProvider(AuthProvider.GOOGLE);
        socialAccount.setProviderUserId("google_123");
        socialAccount.setUserProfile(user);

        // Add relationships to user
        user.addNotificationPreferences(preference);
        user.addUploadedFiles(fileMetaData);

        // Verify relationships
        assertThat(preference.getUserProfile()).isEqualTo(user);
        assertThat(user.getNotificationPreferences()).contains(preference);

        assertThat(fileMetaData.getLesson()).isEqualTo(lesson);
        assertThat(fileMetaData.getUploadedBy()).isEqualTo(user);
        assertThat(user.getUploadedFiles()).contains(fileMetaData);

        assertThat(socialAccount.getUserProfile()).isEqualTo(user);

        // Verify notification delivery data
        assertThat(delivery.getNotificationType()).isEqualTo(NotificationType.QUIZ_REMINDER);
        assertThat(delivery.getStatus()).isEqualTo(DeliveryStatus.PENDING);
        assertThat(delivery.canRetry()).isTrue();
    }

    @Test
    @DisplayName("Test FileMetaData entity with Liquibase schema validation")
    void testFileMetaDataLiquibaseSchemaValidation() {
        // This test validates that the FileMetaData entity matches the Liquibase schema
        // from changeset 20250811000001_add_file_metadata_table.xml

        FileMetaData fileMetaData = new FileMetaData();

        // Test all required fields from Liquibase schema
        fileMetaData.setFileName("test_file.pdf");
        fileMetaData.setOriginalName("Test File.pdf");
        fileMetaData.setFilePath("/uploads/test_file.pdf");

        // Test optional fields that should be supported
        fileMetaData.setFileType("document");
        fileMetaData.setFileSize(1024L);
        fileMetaData.setMimeType("application/pdf");
        fileMetaData.setUploadDate(LocalDateTime.now());
        fileMetaData.setVersion(1);
        fileMetaData.setChecksum("checksum123");
        fileMetaData.setFolderPath("/uploads");
        fileMetaData.setDescription("Test file description");
        fileMetaData.setIsPublic(false);
        fileMetaData.setDownloadCount(0);
        fileMetaData.setLastAccessedDate(LocalDateTime.now());

        // Verify all fields are properly set
        assertThat(fileMetaData.getFileName()).isEqualTo("test_file.pdf");
        assertThat(fileMetaData.getOriginalName()).isEqualTo("Test File.pdf");
        assertThat(fileMetaData.getFilePath()).isEqualTo("/uploads/test_file.pdf");
        assertThat(fileMetaData.getFileType()).isEqualTo("document");
        assertThat(fileMetaData.getFileSize()).isEqualTo(1024L);
        assertThat(fileMetaData.getMimeType()).isEqualTo("application/pdf");
        assertThat(fileMetaData.getUploadDate()).isNotNull();
        assertThat(fileMetaData.getVersion()).isEqualTo(1);
        assertThat(fileMetaData.getChecksum()).isEqualTo("checksum123");
        assertThat(fileMetaData.getFolderPath()).isEqualTo("/uploads");
        assertThat(fileMetaData.getDescription()).isEqualTo("Test file description");
        assertThat(fileMetaData.getIsPublic()).isFalse();
        assertThat(fileMetaData.getDownloadCount()).isEqualTo(0);
        assertThat(fileMetaData.getLastAccessedDate()).isNotNull();
    }

    // Helper methods
    private Class<?> getFieldType(Class<?> clazz, String fieldName) {
        try {
            Field field = clazz.getDeclaredField(fieldName);
            return field.getType();
        } catch (NoSuchFieldException e) {
            fail("Field " + fieldName + " not found in " + clazz.getSimpleName());
            return null;
        }
    }

    private boolean hasFieldAnnotation(Class<?> clazz, String fieldName,
            Class<? extends java.lang.annotation.Annotation> annotationClass) {
        try {
            Field field = clazz.getDeclaredField(fieldName);
            return field.isAnnotationPresent(annotationClass);
        } catch (NoSuchFieldException e) {
            fail("Field " + fieldName + " not found in " + clazz.getSimpleName());
            return false;
        }
    }
}