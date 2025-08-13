package com.satori.platform.validation;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.*;
import com.satori.platform.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static org.assertj.core.api.Assertions.*;

/**
 * Improved validation tests for system and management repositories.
 * Refactored from the original SystemAndManagementRepositoryValidationTest
 * to address code smells and improve maintainability.
 * 
 * Requirements: 3.1, 3.2, 3.5
 */
@ApiValidationTestConfiguration
@Transactional
@DisplayName("System and Management Repository Validation Tests")
class ImprovedSystemAndManagementRepositoryValidationTest {

    @Autowired
    private FileMetaDataRepository fileMetaDataRepository;

    @Autowired
    private NotificationDeliveryRepository notificationDeliveryRepository;

    @Autowired
    private NotificationPreferenceRepository notificationPreferenceRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;

    @Autowired
    private GiftCodeRepository giftCodeRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    private RepositoryTestDataBuilder dataBuilder;
    private UserProfile testUserProfile;
    private Course testCourse;
    private Lesson testLesson;

    @BeforeEach
    void setUp() {
        dataBuilder = new RepositoryTestDataBuilder(userProfileRepository, courseRepository, lessonRepository);

        testUserProfile = dataBuilder.createTestUserProfile("testuser", "test@example.com");
        testCourse = dataBuilder.createTestCourse("TEST001", "Test Course", testUserProfile);
        testLesson = dataBuilder.createTestLesson("Test Lesson", testCourse);
    }

    @Nested
    @DisplayName("FileMetaData Repository Tests")
    class FileMetaDataRepositoryTests {

        @Test
        @DisplayName("Should perform basic CRUD operations correctly")
        void shouldPerformBasicCrudOperations() {
            // Given
            FileMetaData fileMetaData = dataBuilder.fileMetaData()
                    .withFileName("test-file.pdf")
                    .withOriginalName("Test File.pdf")
                    .withUploadedBy(testUserProfile)
                    .withLesson(testLesson)
                    .build();

            // When - Save
            FileMetaData savedFile = fileMetaDataRepository.save(fileMetaData);

            // Then
            assertThat(savedFile.getId()).isNotNull();
            assertThat(savedFile.getFileName()).isEqualTo("test-file.pdf");

            // When - Find
            Optional<FileMetaData> foundFile = fileMetaDataRepository.findById(savedFile.getId());

            // Then
            assertThat(foundFile)
                    .isPresent()
                    .get()
                    .extracting(FileMetaData::getOriginalName)
                    .isEqualTo("Test File.pdf");

            // When - Update
            savedFile.setDescription("Updated description");
            FileMetaData updatedFile = fileMetaDataRepository.save(savedFile);

            // Then
            assertThat(updatedFile.getDescription()).isEqualTo("Updated description");

            // When - Delete
            fileMetaDataRepository.delete(savedFile);
            Optional<FileMetaData> deletedFile = fileMetaDataRepository.findById(savedFile.getId());

            // Then
            assertThat(deletedFile).isEmpty();
        }

        @Test
        @DisplayName("Should execute custom queries correctly")
        void shouldExecuteCustomQueriesCorrectly() {
            // Given
            FileMetaData fileMetaData = createAndSaveTestFileMetaData();

            // When & Then - findByUploadedBy
            List<FileMetaData> filesByUser = fileMetaDataRepository.findByUploadedBy(testUserProfile.getId());
            assertThat(filesByUser)
                    .hasSize(1)
                    .first()
                    .extracting(FileMetaData::getFileName)
                    .isEqualTo("test-file.pdf");

            // When & Then - findByLessonId
            List<FileMetaData> filesByLesson = fileMetaDataRepository.findByLessonId(testLesson.getId());
            assertThat(filesByLesson)
                    .hasSize(1)
                    .first()
                    .extracting(FileMetaData::getOriginalName)
                    .isEqualTo("Test File.pdf");

            // When & Then - hasAccessToFile
            boolean hasAccess = fileMetaDataRepository.hasAccessToFile(fileMetaData.getId(), testUserProfile.getId());
            assertThat(hasAccess).isTrue();
        }

        @Test
        @DisplayName("Should handle search and filter queries")
        void shouldHandleSearchAndFilterQueries() {
            // Given
            createAndSaveTestFileMetaData();

            // When & Then - searchFiles
            List<FileMetaData> searchResults = fileMetaDataRepository.searchFiles(
                    "test", "/uploads/default", "application/pdf", testUserProfile.getId());

            assertThat(searchResults)
                    .hasSize(1)
                    .first()
                    .extracting(FileMetaData::getOriginalName)
                    .asString()
                    .contains("Test");

            // When & Then - file statistics
            long fileCount = fileMetaDataRepository.countByUploadedBy(testUserProfile.getId());
            assertThat(fileCount).isEqualTo(1);

            Long totalSize = fileMetaDataRepository.getTotalFileSizeByUser(testUserProfile.getId());
            assertThat(totalSize).isEqualTo(1024L);
        }

        @Test
        @DisplayName("Should handle modifying operations")
        void shouldHandleModifyingOperations() {
            // Given
            FileMetaData fileMetaData = createAndSaveTestFileMetaData();
            int initialDownloadCount = fileMetaData.getDownloadCount();

            // When
            fileMetaDataRepository.incrementDownloadCount(fileMetaData.getId());

            // Then
            Optional<FileMetaData> updatedFile = fileMetaDataRepository.findById(fileMetaData.getId());
            assertThat(updatedFile)
                    .isPresent()
                    .get()
                    .extracting(FileMetaData::getDownloadCount)
                    .isEqualTo(initialDownloadCount + 1);
        }

        private FileMetaData createAndSaveTestFileMetaData() {
            FileMetaData fileMetaData = dataBuilder.fileMetaData()
                    .withFileName("test-file.pdf")
                    .withOriginalName("Test File.pdf")
                    .withUploadedBy(testUserProfile)
                    .withLesson(testLesson)
                    .build();
            return fileMetaDataRepository.save(fileMetaData);
        }
    }

    @Nested
    @DisplayName("NotificationDelivery Repository Tests")
    class NotificationDeliveryRepositoryTests {

        @Test
        @DisplayName("Should perform basic CRUD operations correctly")
        void shouldPerformBasicCrudOperations() {
            // Given
            NotificationDelivery notification = dataBuilder.notificationDelivery()
                    .withRecipientId(testUserProfile.getId())
                    .withSubject("Test Notification")
                    .withContent("Test notification content")
                    .build();

            // When - Save
            NotificationDelivery savedNotification = notificationDeliveryRepository.save(notification);

            // Then
            assertThat(savedNotification.getId()).isNotNull();
            assertThat(savedNotification.getSubject()).isEqualTo("Test Notification");

            // When - Find
            Optional<NotificationDelivery> foundNotification = notificationDeliveryRepository
                    .findById(savedNotification.getId());

            // Then
            assertThat(foundNotification)
                    .isPresent()
                    .get()
                    .extracting(NotificationDelivery::getContent)
                    .isEqualTo("Test notification content");

            // When - Update
            savedNotification.setStatus(DeliveryStatus.DELIVERED);
            savedNotification.setDeliveredAt(Instant.now());
            NotificationDelivery updatedNotification = notificationDeliveryRepository.save(savedNotification);

            // Then
            assertThat(updatedNotification.getStatus()).isEqualTo(DeliveryStatus.DELIVERED);
            assertThat(updatedNotification.getDeliveredAt()).isNotNull();

            // When - Delete
            notificationDeliveryRepository.delete(savedNotification);
            Optional<NotificationDelivery> deletedNotification = notificationDeliveryRepository
                    .findById(savedNotification.getId());

            // Then
            assertThat(deletedNotification).isEmpty();
        }

        @Test
        @DisplayName("Should execute custom queries correctly")
        void shouldExecuteCustomQueriesCorrectly() {
            // Given
            NotificationDelivery notification = createAndSaveTestNotification();

            // When & Then - findByRecipientId
            List<NotificationDelivery> notificationsByRecipient = notificationDeliveryRepository
                    .findByRecipientId(testUserProfile.getId());

            assertThat(notificationsByRecipient)
                    .hasSize(1)
                    .first()
                    .extracting(NotificationDelivery::getSubject)
                    .isEqualTo("Test Notification");

            // When & Then - findByDeliveryStatus
            List<NotificationDelivery> pendingNotifications = notificationDeliveryRepository
                    .findByDeliveryStatus("PENDING");

            assertThat(pendingNotifications)
                    .hasSize(1)
                    .first()
                    .extracting(NotificationDelivery::getStatus)
                    .isEqualTo(DeliveryStatus.PENDING);

            // When & Then - countByStatus
            long pendingCount = notificationDeliveryRepository.countByStatus(DeliveryStatus.PENDING);
            assertThat(pendingCount).isEqualTo(1);
        }

        @Test
        @DisplayName("Should handle analytics queries")
        void shouldHandleAnalyticsQueries() {
            // Given
            dataBuilder.createNotificationAnalyticsScenario(testUserProfile);

            // When & Then - getDeliveryStatistics
            Instant startDate = Instant.now().minus(2, ChronoUnit.HOURS);
            Instant endDate = Instant.now().plus(1, ChronoUnit.HOURS);

            List<Object[]> deliveryStats = notificationDeliveryRepository.getDeliveryStatistics(startDate, endDate);
            assertThat(deliveryStats).isNotEmpty();

            Double deliveryRate = notificationDeliveryRepository.getDeliveryRate(startDate, endDate);
            assertThat(deliveryRate).isNotNull().isGreaterThan(0.0);
        }

        private NotificationDelivery createAndSaveTestNotification() {
            NotificationDelivery notification = dataBuilder.notificationDelivery()
                    .withRecipientId(testUserProfile.getId())
                    .withSubject("Test Notification")
                    .withContent("Test notification content")
                    .build();
            return notificationDeliveryRepository.save(notification);
        }
    }

    @Nested
    @DisplayName("NotificationPreference Repository Tests")
    class NotificationPreferenceRepositoryTests {

        @Test
        @DisplayName("Should perform basic CRUD operations correctly")
        void shouldPerformBasicCrudOperations() {
            // Given
            NotificationPreference preference = dataBuilder.notificationPreference()
                    .withUserProfile(testUserProfile)
                    .withNotificationType(NotificationType.QUIZ_REMINDER)
                    .withEnabled(true)
                    .build();

            // When - Save
            NotificationPreference savedPreference = notificationPreferenceRepository.save(preference);

            // Then
            assertThat(savedPreference.getId()).isNotNull();
            assertThat(savedPreference.getEnabled()).isTrue();

            // When - Find
            Optional<NotificationPreference> foundPreference = notificationPreferenceRepository
                    .findById(savedPreference.getId());

            // Then
            assertThat(foundPreference)
                    .isPresent()
                    .get()
                    .extracting(NotificationPreference::getNotificationType)
                    .isEqualTo(NotificationType.QUIZ_REMINDER);

            // When - Update
            savedPreference.setEnabled(false);
            NotificationPreference updatedPreference = notificationPreferenceRepository.save(savedPreference);

            // Then
            assertThat(updatedPreference.getEnabled()).isFalse();

            // When - Delete
            notificationPreferenceRepository.delete(savedPreference);
            Optional<NotificationPreference> deletedPreference = notificationPreferenceRepository
                    .findById(savedPreference.getId());

            // Then
            assertThat(deletedPreference).isEmpty();
        }

        @Test
        @DisplayName("Should execute custom queries correctly")
        void shouldExecuteCustomQueriesCorrectly() {
            // Given
            NotificationPreference preference = createAndSaveTestPreference();

            // When & Then - findByUserProfile
            List<NotificationPreference> preferencesByUser = notificationPreferenceRepository
                    .findByUserProfile(testUserProfile);

            assertThat(preferencesByUser)
                    .hasSize(1)
                    .first()
                    .extracting(NotificationPreference::getNotificationType)
                    .isEqualTo(NotificationType.QUIZ_REMINDER);

            // When & Then - isNotificationEnabled
            boolean isEnabled = notificationPreferenceRepository.isNotificationEnabled(
                    testUserProfile.getId(), NotificationType.QUIZ_REMINDER);
            assertThat(isEnabled).isTrue();

            boolean isDisabled = notificationPreferenceRepository.isNotificationEnabled(
                    testUserProfile.getId(), NotificationType.COURSE_ENROLLMENT);
            assertThat(isDisabled).isFalse();
        }

        private NotificationPreference createAndSaveTestPreference() {
            NotificationPreference preference = dataBuilder.notificationPreference()
                    .withUserProfile(testUserProfile)
                    .withNotificationType(NotificationType.QUIZ_REMINDER)
                    .withEnabled(true)
                    .build();
            return notificationPreferenceRepository.save(preference);
        }
    }

    @Nested
    @DisplayName("AuditLog Repository Tests")
    class AuditLogRepositoryTests {

        @Test
        @DisplayName("Should perform basic CRUD operations correctly")
        void shouldPerformBasicCrudOperations() {
            // Given
            AuditLog auditLog = dataBuilder.auditLog()
                    .withUsername(testUserProfile.getUsername())
                    .withAction(AuditAction.CREATE)
                    .withResourceType("Course")
                    .withResourceId(testCourse.getId())
                    .withDetails("Created test course")
                    .build();

            // When - Save
            AuditLog savedAuditLog = auditLogRepository.save(auditLog);

            // Then
            assertThat(savedAuditLog.getId()).isNotNull();
            assertThat(savedAuditLog.getUsername()).isEqualTo(testUserProfile.getUsername());

            // When - Find
            Optional<AuditLog> foundAuditLog = auditLogRepository.findById(savedAuditLog.getId());

            // Then
            assertThat(foundAuditLog)
                    .isPresent()
                    .get()
                    .extracting(AuditLog::getAction)
                    .isEqualTo(AuditAction.CREATE);

            // When - Update
            savedAuditLog.setDetails("Updated course details");
            AuditLog updatedAuditLog = auditLogRepository.save(savedAuditLog);

            // Then
            assertThat(updatedAuditLog.getDetails()).isEqualTo("Updated course details");

            // When - Delete
            auditLogRepository.delete(savedAuditLog);
            Optional<AuditLog> deletedAuditLog = auditLogRepository.findById(savedAuditLog.getId());

            // Then
            assertThat(deletedAuditLog).isEmpty();
        }

        @Test
        @DisplayName("Should execute custom queries correctly")
        void shouldExecuteCustomQueriesCorrectly() {
            // Given
            AuditLog auditLog = createAndSaveTestAuditLog();
            Pageable pageable = PageRequest.of(0, 10);

            // When & Then - findByUsernameOrderByTimestampDesc
            Page<AuditLog> logsByUsername = auditLogRepository
                    .findByUsernameOrderByTimestampDesc(testUserProfile.getUsername(), pageable);

            assertThat(logsByUsername.getContent())
                    .hasSize(1)
                    .first()
                    .extracting(AuditLog::getUsername)
                    .isEqualTo(testUserProfile.getUsername());

            // When & Then - findByActionOrderByTimestampDesc
            Page<AuditLog> logsByAction = auditLogRepository
                    .findByActionOrderByTimestampDesc(AuditAction.CREATE, pageable);

            assertThat(logsByAction.getContent())
                    .hasSize(1)
                    .first()
                    .extracting(AuditLog::getAction)
                    .isEqualTo(AuditAction.CREATE);
        }

        private AuditLog createAndSaveTestAuditLog() {
            AuditLog auditLog = dataBuilder.auditLog()
                    .withUsername(testUserProfile.getUsername())
                    .withAction(AuditAction.CREATE)
                    .withResourceType("Course")
                    .withResourceId(testCourse.getId())
                    .withDetails("Created test course")
                    .build();
            return auditLogRepository.save(auditLog);
        }
    }

    @Nested
    @DisplayName("GiftCode Repository Tests")
    class GiftCodeRepositoryTests {

        @Test
        @DisplayName("Should perform basic CRUD operations correctly")
        void shouldPerformBasicCrudOperations() {
            // Given
            GiftCode giftCode = dataBuilder.giftCode()
                    .withCode("TESTCODE123")
                    .withCourse(testCourse)
                    .withCreatedBy(testUserProfile)
                    .build();

            // When - Save
            GiftCode savedGiftCode = giftCodeRepository.save(giftCode);

            // Then
            assertThat(savedGiftCode.getId()).isNotNull();
            assertThat(savedGiftCode.getCode()).isEqualTo("TESTCODE123");

            // When - Find
            Optional<GiftCode> foundGiftCode = giftCodeRepository.findById(savedGiftCode.getId());

            // Then
            assertThat(foundGiftCode)
                    .isPresent()
                    .get()
                    .extracting(GiftCode::getCode)
                    .isEqualTo("TESTCODE123");

            // When - Update
            savedGiftCode.setDescription("Updated gift code description");
            GiftCode updatedGiftCode = giftCodeRepository.save(savedGiftCode);

            // Then
            assertThat(updatedGiftCode.getDescription()).isEqualTo("Updated gift code description");

            // When - Delete
            giftCodeRepository.delete(savedGiftCode);
            Optional<GiftCode> deletedGiftCode = giftCodeRepository.findById(savedGiftCode.getId());

            // Then
            assertThat(deletedGiftCode).isEmpty();
        }

        @Test
        @DisplayName("Should execute custom queries correctly")
        void shouldExecuteCustomQueriesCorrectly() {
            // Given
            GiftCode giftCode = createAndSaveTestGiftCode();

            // When & Then - findByCode
            Optional<GiftCode> giftCodeByCode = giftCodeRepository.findByCode("TESTCODE123");
            assertThat(giftCodeByCode)
                    .isPresent()
                    .get()
                    .extracting(GiftCode::getDescription)
                    .isEqualTo("Default test gift code");

            // When & Then - findActiveByCourseId
            List<GiftCode> activeGiftCodes = giftCodeRepository.findActiveByCourseId(testCourse.getId());
            assertThat(activeGiftCodes)
                    .hasSize(1)
                    .first()
                    .extracting(GiftCode::getActive)
                    .isEqualTo(true);

            // When & Then - isCodeValidForRedemption
            boolean isValid = giftCodeRepository.isCodeValidForRedemption("TESTCODE123", LocalDateTime.now());
            assertThat(isValid).isTrue();
        }

        private GiftCode createAndSaveTestGiftCode() {
            GiftCode giftCode = dataBuilder.giftCode()
                    .withCode("TESTCODE123")
                    .withCourse(testCourse)
                    .withCreatedBy(testUserProfile)
                    .build();
            return giftCodeRepository.save(giftCode);
        }
    }

    @Nested
    @DisplayName("Integration Tests")
    class IntegrationTests {

        @Test
        @DisplayName("Should handle complete workflow integration")
        void shouldHandleCompleteWorkflowIntegration() {
            // Given - Create file metadata
            FileMetaData fileMetaData = dataBuilder.fileMetaData()
                    .withFileName("integration-test.mp4")
                    .withOriginalName("Integration Test Video.mp4")
                    .withMimeType("video/mp4")
                    .withFileSize(5120L)
                    .withChecksum("integration123")
                    .withFolderPath("/uploads/videos")
                    .withUploadedBy(testUserProfile)
                    .withLesson(testLesson)
                    .build();
            FileMetaData savedFile = fileMetaDataRepository.save(fileMetaData);

            // When - Create audit log for file upload
            AuditLog auditLog = dataBuilder.auditLog()
                    .withUsername(testUserProfile.getUsername())
                    .withAction(AuditAction.CREATE)
                    .withResourceType("FileMetaData")
                    .withResourceId(savedFile.getId())
                    .withDetails("Uploaded integration test video")
                    .build();
            AuditLog savedAuditLog = auditLogRepository.save(auditLog);

            // And - Create notification for file upload
            NotificationDelivery notification = dataBuilder.notificationDelivery()
                    .withRecipientId(testUserProfile.getId())
                    .withNotificationType(NotificationType.SYSTEM_NOTIFICATION)
                    .withSubject("File Upload Successful")
                    .withContent("Your file " + savedFile.getOriginalName() + " has been uploaded successfully")
                    .withStatus(DeliveryStatus.SENT)
                    .withSentAt(Instant.now())
                    .build();
            NotificationDelivery savedNotification = notificationDeliveryRepository.save(notification);

            // Then - Verify all entities are properly linked and functional
            assertThat(savedFile.getId()).isNotNull();
            assertThat(savedAuditLog.getId()).isNotNull();
            assertThat(savedNotification.getId()).isNotNull();

            // And - Test cross-repository queries
            List<FileMetaData> userFiles = fileMetaDataRepository.findByUploadedBy(testUserProfile.getId());
            assertThat(userFiles).hasSize(1);

            List<AuditLog> userAuditLogs = auditLogRepository
                    .findTop10ByUsernameOrderByTimestampDesc(testUserProfile.getUsername());
            assertThat(userAuditLogs).hasSize(1);

            List<NotificationDelivery> userNotifications = notificationDeliveryRepository
                    .findByRecipientId(testUserProfile.getId());
            assertThat(userNotifications).hasSize(1);

            // And - Test file access control
            boolean hasAccess = fileMetaDataRepository.hasAccessToFile(savedFile.getId(), testUserProfile.getId());
            assertThat(hasAccess).isTrue();
        }

        @Test
        @DisplayName("Should handle performance requirements")
        void shouldHandlePerformanceRequirements() {
            // Given - Create multiple entities for performance testing
            int entityCount = 10;
            List<FileMetaData> files = new ArrayList<>();

            for (int i = 0; i < entityCount; i++) {
                FileMetaData file = dataBuilder.fileMetaData()
                        .withFileName("perf-file-" + i + ".txt")
                        .withOriginalName("Performance File " + i + ".txt")
                        .withMimeType("text/plain")
                        .withFileSize(512L)
                        .withChecksum("perf" + i)
                        .withFolderPath("/uploads/performance")
                        .withUploadedBy(testUserProfile)
                        .build();
                files.add(file);
            }

            // When - Measure save performance
            long startTime = System.currentTimeMillis();
            fileMetaDataRepository.saveAll(files);
            long saveTime = System.currentTimeMillis() - startTime;

            // And - Measure find performance
            startTime = System.currentTimeMillis();
            List<FileMetaData> allFiles = fileMetaDataRepository.findAll();
            long findTime = System.currentTimeMillis() - startTime;

            // And - Measure complex query performance
            startTime = System.currentTimeMillis();
            List<FileMetaData> searchResults = fileMetaDataRepository.searchFiles(
                    "performance", "/uploads/performance", "text/plain", testUserProfile.getId());
            long searchTime = System.currentTimeMillis() - startTime;

            // Then - Performance assertions (should complete within reasonable time)
            assertThat(saveTime).isLessThan(2000); // 2 seconds
            assertThat(findTime).isLessThan(1000); // 1 second
            assertThat(searchTime).isLessThan(1000); // 1 second
            assertThat(allFiles.size()).isGreaterThanOrEqualTo(entityCount);
            assertThat(searchResults).hasSize(entityCount);
        }
    }
}