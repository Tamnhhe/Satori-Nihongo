package com.satori.platform.validation;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.*;
import com.satori.platform.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
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
 * Comprehensive validation tests for system and management repositories.
 * Tests FileMetaDataRepository, NotificationDeliveryRepository,
 * NotificationPreferenceRepository,
 * AuditLogRepository, and other system management repositories.
 * 
 * Requirements: 3.1, 3.2, 3.5
 */
@ApiValidationTestConfiguration
class SystemAndManagementRepositoryValidationTest {

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
    private FlashcardRepository flashcardRepository;

    @Autowired
    private SocialAccountRepository socialAccountRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    private FileMetaData testFileMetaData;
    private NotificationDelivery testNotificationDelivery;
    private NotificationPreference testNotificationPreference;
    private AuditLog testAuditLog;
    private GiftCode testGiftCode;
    private Flashcard testFlashcard;
    private SocialAccount testSocialAccount;
    private UserProfile testUserProfile;
    private Course testCourse;
    private Lesson testLesson;

    @BeforeEach
    void setUp() {
        // Create test user profile
        testUserProfile = new UserProfile();
        testUserProfile.setUsername("testuser");
        testUserProfile.setPasswordHash("hashedpassword");
        testUserProfile.setEmail("test@example.com");
        testUserProfile.setFullName("Test User");
        testUserProfile.setRole(Role.HOC_VIEN);
        testUserProfile = userProfileRepository.save(testUserProfile);

        // Create test course
        testCourse = new Course();
        testCourse.setCourseCode("TEST001");
        testCourse.setTitle("Test Course");
        testCourse.setDescription("Test Course Description");
        testCourse.setTeacher(testUserProfile);
        testCourse.setCreatedDate(Instant.now());
        testCourse.setLastModifiedDate(Instant.now());
        testCourse = courseRepository.save(testCourse);

        // Create test lesson
        testLesson = new Lesson();
        testLesson.setTitle("Test Lesson");
        testLesson.setContent("Test Lesson Content");
        testLesson.setCourse(testCourse);
        testLesson = lessonRepository.save(testLesson);

        setupTestEntities();
    }

    private void setupTestEntities() {
        // Create test file metadata
        testFileMetaData = new FileMetaData();
        testFileMetaData.setFileName("test-file.pdf");
        testFileMetaData.setOriginalName("Test File.pdf");
        testFileMetaData.setMimeType("application/pdf");
        testFileMetaData.setFileSize(1024L);
        testFileMetaData.setChecksum("abc123def456");
        testFileMetaData.setFolderPath("/uploads/lessons");
        testFileMetaData.setDescription("Test file description");
        testFileMetaData.setIsPublic(true);
        testFileMetaData.setUploadDate(Instant.now());
        testFileMetaData.setLastAccessedDate(Instant.now());
        testFileMetaData.setDownloadCount(0);
        testFileMetaData.setLesson(testLesson);
        testFileMetaData.setUploadedBy(testUserProfile);
        testFileMetaData = fileMetaDataRepository.save(testFileMetaData);

        // Create test notification delivery
        testNotificationDelivery = new NotificationDelivery();
        testNotificationDelivery.setRecipientId(testUserProfile.getId());
        testNotificationDelivery.setNotificationType(NotificationType.QUIZ_REMINDER);
        testNotificationDelivery.setDeliveryChannel("EMAIL");
        testNotificationDelivery.setSubject("Test Notification");
        testNotificationDelivery.setContent("Test notification content");
        testNotificationDelivery.setStatus(DeliveryStatus.PENDING);
        testNotificationDelivery.setCreatedAt(Instant.now());
        testNotificationDelivery.setScheduledAt(Instant.now().plus(1, ChronoUnit.HOURS));
        testNotificationDelivery.setRetryCount(0);
        testNotificationDelivery.setMaxRetries(3);
        testNotificationDelivery = notificationDeliveryRepository.save(testNotificationDelivery);

        // Create test notification preference
        testNotificationPreference = new NotificationPreference();
        testNotificationPreference.setUserProfile(testUserProfile);
        testNotificationPreference.setNotificationType(NotificationType.QUIZ_REMINDER);
        testNotificationPreference.setEnabled(true);
        testNotificationPreference = notificationPreferenceRepository.save(testNotificationPreference);

        // Create test audit log
        testAuditLog = new AuditLog();
        testAuditLog.setUsername("testuser");
        testAuditLog.setAction(AuditAction.CREATE);
        testAuditLog.setResourceType("Course");
        testAuditLog.setResourceId(testCourse.getId());
        testAuditLog.setTimestamp(Instant.now());
        testAuditLog.setIpAddress("192.168.1.1");
        testAuditLog.setUserAgent("Test User Agent");
        testAuditLog.setSuccess(true);
        testAuditLog.setDetails("Created test course");
        testAuditLog = auditLogRepository.save(testAuditLog);
    }

    // Create test gift code
    testGiftCode=new GiftCode();testGiftCode.setCode("TESTCODE123");testGiftCode.setCourse(testCourse);testGiftCode.setCreatedBy(testUserProfile);testGiftCode.setCreatedDate(LocalDateTime.now());testGiftCode.setExpiryDate(LocalDateTime.now().plusDays(30));testGiftCode.setActive(true);testGiftCode.setMaxUses(10);testGiftCode.setCurrentUses(0);testGiftCode.setDescription("Test gift code");testGiftCode=giftCodeRepository.save(testGiftCode);

    // Create test flashcard
    testFlashcard=new Flashcard();testFlashcard.setFront("What is the capital of Japan?");testFlashcard.setBack("Tokyo");testFlashcard.setLesson(testLesson);testFlashcard.setPosition(1);testFlashcard=flashcardRepository.save(testFlashcard);

    // Create test social account
    testSocialAccount=new SocialAccount();testSocialAccount.setProvider("google");testSocialAccount.setProviderId("google123");testSocialAccount.setDisplayName("Test User");testSocialAccount.setProfileUrl("https://example.com/profile");testSocialAccount.setImageUrl("https://example.com/avatar.jpg");testSocialAccount=socialAccountRepository.save(testSocialAccount);

    }

    // FileMetaDataRepository Tests

    @Test
    void testFileMetaDataRepository_BasicCrudOperations() {
        // Test save
        FileMetaData newFile = new FileMetaData();
        newFile.setFileName("new-file.jpg");
        newFile.setOriginalName("New Image.jpg");
        newFile.setMimeType("image/jpeg");
        newFile.setFileSize(2048L);
        newFile.setChecksum("xyz789abc123");
        newFile.setFolderPath("/uploads/images");
        newFile.setDescription("New image file");
        newFile.setIsPublic(false);
        newFile.setUploadDate(Instant.now());
        newFile.setLastAccessedDate(Instant.now());
        newFile.setDownloadCount(0);
        newFile.setUploadedBy(testUserProfile);

        FileMetaData savedFile = fileMetaDataRepository.save(newFile);
        assertThat(savedFile.getId()).isNotNull();
        assertThat(savedFile.getFileName()).isEqualTo("new-file.jpg");

        // Test findById
        Optional<FileMetaData> foundFile = fileMetaDataRepository.findById(savedFile.getId());
        assertThat(foundFile).isPresent();
        assertThat(foundFile.get().getMimeType()).isEqualTo("image/jpeg");

        // Test update
        savedFile.setDescription("Updated description");
        FileMetaData updatedFile = fileMetaDataRepository.save(savedFile);
        assertThat(updatedFile.getDescription()).isEqualTo("Updated description");

        // Test delete
        fileMetaDataRepository.delete(savedFile);
        Optional<FileMetaData> deletedFile = fileMetaDataRepository.findById(savedFile.getId());
        assertThat(deletedFile).isEmpty();
    }

    @Test

    void testFileMetaDataRepository_CustomQueries() {
        // Test findByUploadedBy
        List<FileMetaData> filesByUser = fileMetaDataRepository.findByUploadedBy(testUserProfile.getId());
        assertThat(filesByUser).hasSize(1);
        assertThat(filesByUser.get(0).getFileName()).isEqualTo("test-file.pdf");

        // Test findByLessonId
        List<FileMetaData> filesByLesson = fileMetaDataRepository.findByLessonId(testLesson.getId());
        assertThat(filesByLesson).hasSize(1);
        assertThat(filesByLesson.get(0).getOriginalName()).isEqualTo("Test File.pdf");

        // Test findByLessonIdWithAccessControl
        List<FileMetaData> filesWithAccess = fileMetaDataRepository.findByLessonIdWithAccessControl(
            testLesson.getId(), testUserProfile.getId());
        assertThat(filesWithAccess).hasSize(1);

        // Test hasAccessToFile
        boolean hasAccess = fileMetaDataRepository.hasAccessToFile(testFileMetaData.getId(), testUserProfile.getId());
        assertThat(hasAccess).isTrue();

        // Test findByChecksum
        Optional<FileMetaData> fileByChecksum = fileMetaDataRepository.findByChecksum("abc123def456");
        assertThat(fileByChecksum).isPresent();
        assertThat(fileByChecksum.get().getFileName()).isEqualTo("test-file.pdf");

        // Test findByFileName
        Optional<FileMetaData> fileByName = fileMetaDataRepository.findByFileName("test-file.pdf");
        assertThat(fileByName).isPresent();
        assertThat(fileByName.get().getChecksum()).isEqualTo("abc123def456");

        // Test findByFolderPath
        List<FileMetaData> filesByFolder = fileMetaDataRepository.findByFolderPath("/uploads/lessons");
        assertThat(filesByFolder).hasSize(1);
        assertThat(filesByFolder.get(0).getFolderPath()).isEqualTo("/uploads/lessons");
    }

    @Test
    void testFileMetaDataRepository_SearchAndFilterQueries() {
        // Test searchFiles
        List<FileMetaData> searchResults = fileMetaDataRepository.searchFiles(
            "test", "/uploads/lessons", "application/pdf", testUserProfile.getId());
        assertThat(searchResults).hasSize(1);
        assertThat(searchResults.get(0).getOriginalName()).contains("Test");

        // Test findAllPdfs
        List<FileMetaData> pdfFiles = fileMetaDataRepository.findAllPdfs();
        assertThat(pdfFiles).hasSize(1);
        assertThat(pdfFiles.get(0).getMimeType()).isEqualTo("application/pdf");

        // Test countByUploadedBy
        long fileCount = fileMetaDataRepository.countByUploadedBy(testUserProfile.getId());
        assertThat(fileCount).isEqualTo(1);

        // Test getTotalFileSizeByUser
        Long totalSize = fileMetaDataRepository.getTotalFileSizeByUser(testUserProfile.getId());
        assertThat(totalSize).isEqualTo(1024L);

        // Test findRecentFilesByUser
        Pageable pageable = PageRequest.of(0, 10);
        List<FileMetaData> recentFiles = fileMetaDataRepository.findRecentFilesByUser(testUserProfile.getId(), pageable);
        assertThat(recentFiles).hasSize(1);
        assertThat(recentFiles.get(0).getFileName()).isEqualTo("test-file.pdf");
    }

  @Test
    void testFileMetaDataRepository_ModifyingOperations() {
        // Test incrementDownloadCount
        int initialDownloadCount = testFileMetaData.getDownloadCount();
        fileMetaDataRepository.incrementDownloadCount(testFileMetaData.getId());
        
        // Refresh entity to get updated values
        Optional<FileMetaData> updatedFile = fileMetaDataRepository.findById(testFileMetaData.getId());
        assertThat(updatedFile).isPresent();
        assertThat(updatedFile.get().getDownloadCount()).isEqualTo(initialDownloadCount + 1);
    }

    // NotificationDeliveryRepository Tests

    @Test
    void testNotificationDeliveryRepository_BasicCrudOperations() {
        // Test save
        NotificationDelivery newNotification = new NotificationDelivery();
        newNotification.setRecipientId(testUserProfile.getId());
        newNotification.setNotificationType(NotificationType.COURSE_ENROLLMENT);
        newNotification.setDeliveryChannel("SMS");
        newNotification.setSubject("Course Enrollment");
        newNotification.setContent("You have been enrolled in a course");
        newNotification.setStatus(DeliveryStatus.SENT);
        newNotification.setCreatedAt(Instant.now());
        newNotification.setSentAt(Instant.now());
        newNotification.setRetryCount(0);
        newNotification.setMaxRetries(3);

        NotificationDelivery savedNotification = notificationDeliveryRepository.save(newNotification);
        assertThat(savedNotification.getId()).isNotNull();
        assertThat(savedNotification.getSubject()).isEqualTo("Course Enrollment");

        // Test findById
        Optional<NotificationDelivery> foundNotification = notificationDeliveryRepository.findById(savedNotification.getId());
        assertThat(foundNotification).isPresent();
        assertThat(foundNotification.get().getDeliveryChannel()).isEqualTo("SMS");

        // Test update
        savedNotification.setStatus(DeliveryStatus.DELIVERED);
        savedNotification.setDeliveredAt(Instant.now());
        NotificationDelivery updatedNotification = notificationDeliveryRepository.save(savedNotification);
        assertThat(updatedNotification.getStatus()).isEqualTo(DeliveryStatus.DELIVERED);

        // Test delete
        notificationDeliveryRepository.delete(savedNotification);
        Optional<NotificationDelivery> deletedNotification = notificationDeliveryRepository.findById(savedNotification.getId());
        assertThat(deletedNotification).isEmpty();
    }

    @Test
    void testNotificationDeliveryRepository_CustomQueries() {
        // Test findByRecipientId
        List<NotificationDelivery> notificationsByRecipient = notificationDeliveryRepository
                .findByRecipientId(testUserProfile.getId());
        assertThat(notificationsByRecipient).hasSize(1);
        assertThat(notificationsByRecipient.get(0).getSubject()).isEqualTo("Test Notification");

        // Test findByDeliveryStatus
        List<NotificationDelivery> pendingNotifications = notificationDeliveryRepository
                .findByDeliveryStatus("PENDING");
        assertThat(pendingNotifications).hasSize(1);
        assertThat(pendingNotifications.get(0).getStatus()).isEqualTo(DeliveryStatus.PENDING);

        // Test findPendingNotifications
        List<NotificationDelivery> pendingForProcessing = notificationDeliveryRepository.findPendingNotifications(
                DeliveryStatus.PENDING, Instant.now().plus(2, ChronoUnit.HOURS));
        assertThat(pendingForProcessing).hasSize(1);

        // Test countByStatus
        long pendingCount = notificationDeliveryRepository.countByStatus(DeliveryStatus.PENDING);
        assertThat(pendingCount).isEqualTo(1);

        // Test findByRecipientIdOrderByCreatedAtDesc with pagination
        Pageable pageable = PageRequest.of(0, 10);
        Page<NotificationDelivery> notificationsPage = notificationDeliveryRepository
                .findByRecipientIdOrderByCreatedAtDesc(
                        testUserProfile.getId(), pageable);
        assertThat(notificationsPage.getContent()).hasSize(1);
        assertThat(notificationsPage.getContent().get(0).getRecipientId()).isEqualTo(testUserProfile.getId());
    }

    @Test
    void testNotificationDeliveryRepository_AnalyticsQueries() {
        // Create additional notifications for analytics testing
        NotificationDelivery sentNotification = new NotificationDelivery();
        sentNotification.setRecipientId(testUserProfile.getId());
        sentNotification.setNotificationType(NotificationType.LESSON_REMINDER);
        sentNotification.setDeliveryChannel("EMAIL");
        sentNotification.setSubject("Lesson Reminder");
        sentNotification.setContent("Don't forget your lesson");
        sentNotification.setStatus(DeliveryStatus.SENT);
        sentNotification.setCreatedAt(Instant.now().minus(1, ChronoUnit.HOURS));
        sentNotification.setSentAt(Instant.now().minus(30, ChronoUnit.MINUTES));
        sentNotification.setRetryCount(0);
        sentNotification.setMaxRetries(3);
        notificationDeliveryRepository.save(sentNotification);

        // Test getDeliveryStatistics
        Instant startDate = Instant.now().minus(2, ChronoUnit.HOURS);
        Instant endDate = Instant.now().plus(1, ChronoUnit.HOURS);
        List<Object[]> deliveryStats = notificationDeliveryRepository.getDeliveryStatistics(startDate, endDate);
        assertThat(deliveryStats).isNotEmpty();

        // Test getDeliveryRate
        Double deliveryRate = notificationDeliveryRepository.getDeliveryRate(startDate, endDate);
        assertThat(deliveryRate).isNotNull();
        assertThat(deliveryRate).isGreaterThan(0.0);
    }
    // NotificationPreferenceRepository Tests

    @Test
    void testNotificationPreferenceRepository_BasicCrudOperations() {
        // Test save
        NotificationPreference newPreference = new NotificationPreference();
        newPreference.setUserProfile(testUserProfile);
        newPreference.setNotificationType(NotificationType.COURSE_ENROLLMENT);
        newPreference.setEnabled(false);

        NotificationPreference savedPreference = notificationPreferenceRepository.save(newPreference);
        assertThat(savedPreference.getId()).isNotNull();
        assertThat(savedPreference.getEnabled()).isFalse();

        // Test findById
        Optional<NotificationPreference> foundPreference = notificationPreferenceRepository
                .findById(savedPreference.getId());
        assertThat(foundPreference).isPresent();
        assertThat(foundPreference.get().getNotificationType()).isEqualTo(NotificationType.COURSE_ENROLLMENT);

        // Test update
        savedPreference.setEnabled(true);
        NotificationPreference updatedPreference = notificationPreferenceRepository.save(savedPreference);
        assertThat(updatedPreference.getEnabled()).isTrue();

        // Test delete
        notificationPreferenceRepository.delete(savedPreference);
        Optional<NotificationPreference> deletedPreference = notificationPreferenceRepository
                .findById(savedPreference.getId());
        assertThat(deletedPreference).isEmpty();
    }

    @Test
    void testNotificationPreferenceRepository_CustomQueries() {
        // Test findByUserProfile
        List<NotificationPreference> preferencesByUser = notificationPreferenceRepository
                .findByUserProfile(testUserProfile);
        assertThat(preferencesByUser).hasSize(1);
        assertThat(preferencesByUser.get(0).getNotificationType()).isEqualTo(NotificationType.QUIZ_REMINDER);

        // Test findByUserProfileAndNotificationType
        Optional<NotificationPreference> specificPreference = notificationPreferenceRepository
                .findByUserProfileAndNotificationType(
                        testUserProfile, NotificationType.QUIZ_REMINDER);
        assertThat(specificPreference).isPresent();
        assertThat(specificPreference.get().getEnabled()).isTrue();

        // Test findAllEnabled
        List<NotificationPreference> enabledPreferences = notificationPreferenceRepository.findAllEnabled();
        assertThat(enabledPreferences).hasSize(1);
        assertThat(enabledPreferences.get(0).getEnabled()).isTrue();

        // Test findByUserProfileId
        List<NotificationPreference> preferencesByUserId = notificationPreferenceRepository
                .findByUserProfileId(testUserProfile.getId());
        assertThat(preferencesByUserId).hasSize(1);

        // Test findEnabledByUserProfile
        List<NotificationPreference> enabledByUser = notificationPreferenceRepository
                .findEnabledByUserProfile(testUserProfile);
        assertThat(enabledByUser).hasSize(1);
        assertThat(enabledByUser.get(0).getEnabled()).isTrue();

        // Test isNotificationEnabled
        boolean isEnabled = notificationPreferenceRepository.isNotificationEnabled(
                testUserProfile.getId(), NotificationType.QUIZ_REMINDER);
        assertThat(isEnabled).isTrue();

        boolean isDisabled = notificationPreferenceRepository.isNotificationEnabled(
                testUserProfile.getId(), NotificationType.COURSE_ENROLLMENT);
        assertThat(isDisabled).isFalse();
    } //
    AuditLogRepository Tests

    @Test
    void testAuditLogRepository_BasicCrudOperations() {
        // Test save
        AuditLog newAuditLog = new AuditLog();
        newAuditLog.setUsername("testuser2");
        newAuditLog.setAction(AuditAction.UPDATE);
        newAuditLog.setResourceType("Lesson");
        newAuditLog.setResourceId(testLesson.getId());
        newAuditLog.setTimestamp(Instant.now());
        newAuditLog.setIpAddress("192.168.1.2");
        newAuditLog.setUserAgent("Test User Agent 2");
        newAuditLog.setSuccess(true);
        newAuditLog.setDetails("Updated test lesson");

        AuditLog savedAuditLog = auditLogRepository.save(newAuditLog);
        assertThat(savedAuditLog.getId()).isNotNull();
        assertThat(savedAuditLog.getUsername()).isEqualTo("testuser2");

        // Test findById
        Optional<AuditLog> foundAuditLog = auditLogRepository.findById(savedAuditLog.getId());
        assertThat(foundAuditLog).isPresent();
        assertThat(foundAuditLog.get().getAction()).isEqualTo(AuditAction.UPDATE);

        // Test update
        savedAuditLog.setDetails("Updated lesson details");
        AuditLog updatedAuditLog = auditLogRepository.save(savedAuditLog);
        assertThat(updatedAuditLog.getDetails()).isEqualTo("Updated lesson details");

        // Test delete
        auditLogRepository.delete(savedAuditLog);
        Optional<AuditLog> deletedAuditLog = auditLogRepository.findById(savedAuditLog.getId());
        assertThat(deletedAuditLog).isEmpty();
    }

    @Test
    void testAuditLogRepository_CustomQueries() {
        Pageable pageable = PageRequest.of(0, 10);

        // Test findByUsernameOrderByTimestampDesc
        Page<AuditLog> logsByUsername = auditLogRepository.findByUsernameOrderByTimestampDesc("testuser", pageable);
        assertThat(logsByUsername.getContent()).hasSize(1);
        assertThat(logsByUsername.getContent().get(0).getUsername()).isEqualTo("testuser");

        // Test findByActionOrderByTimestampDesc
        Page<AuditLog> logsByAction = auditLogRepository.findByActionOrderByTimestampDesc(AuditAction.CREATE, pageable);
        assertThat(logsByAction.getContent()).hasSize(1);
        assertThat(logsByAction.getContent().get(0).getAction()).isEqualTo(AuditAction.CREATE);

        // Test findByResourceTypeOrderByTimestampDesc
        Page<AuditLog> logsByResourceType = auditLogRepository.findByResourceTypeOrderByTimestampDesc("Course",
                pageable);
        assertThat(logsByResourceType.getContent()).hasSize(1);
        assertThat(logsByResourceType.getContent().get(0).getResourceType()).isEqualTo("Course");

        // Test findByResourceTypeAndResourceIdOrderByTimestampDesc
        Page<AuditLog> logsByResourceTypeAndId = auditLogRepository.findByResourceTypeAndResourceIdOrderByTimestampDesc(
                "Course", testCourse.getId(), pageable);
        assertThat(logsByResourceTypeAndId.getContent()).hasSize(1);
        assertThat(logsByResourceTypeAndId.getContent().get(0).getResourceId()).isEqualTo(testCourse.getId());

        // Test findByIpAddress
        Page<AuditLog> logsByIp = auditLogRepository.findByIpAddress("192.168.1.1", pageable);
        assertThat(logsByIp.getContent()).hasSize(1);
        assertThat(logsByIp.getContent().get(0).getIpAddress()).isEqualTo("192.168.1.1");

        // Test findTop10ByUsernameOrderByTimestampDesc
        List<AuditLog> recentLogs = auditLogRepository.findTop10ByUsernameOrderByTimestampDesc("testuser");
        assertThat(recentLogs).hasSize(1);
        assertThat(recentLogs.get(0).getUsername()).isEqualTo("testuser");
    }

    @Test
    void testAuditLogRepository_DateRangeAndAnalyticsQueries() {
        Pageable pageable = PageRequest.of(0, 10);
        Instant startDate = Instant.now().minus(1, ChronoUnit.HOURS);
        Instant endDate = Instant.now().plus(1, ChronoUnit.HOURS);

        // Test findByTimestampBetween
        Page<AuditLog> logsByDateRange = auditLogRepository.findByTimestampBetween(startDate, endDate, pageable);
        assertThat(logsByDateRange.getContent()).hasSize(1);

        // Test findByUsernameAndTimestampBetween
        Page<AuditLog> logsByUserAndDate = auditLogRepository.findByUsernameAndTimestampBetween(
                "testuser", startDate, endDate, pageable);
        assertThat(logsByUserAndDate.getContent()).hasSize(1);

        // Test countByUsernameAndActionAndTimestampAfter
        long actionCount = auditLogRepository.countByUsernameAndActionAndTimestampAfter(
                "testuser", AuditAction.CREATE, startDate);
        assertThat(actionCount).isEqualTo(1);

        // Test countFailedAttemptsByIpSince
        long failedAttempts = auditLogRepository.countFailedAttemptsByIpSince("192.168.1.1", startDate);
        assertThat(failedAttempts).isEqualTo(0); // Our test log is successful
    }

    // GiftCodeRepository Tests

    @Test
    void testGiftCodeRepository_BasicCrudOperations() {
        // Test save
        GiftCode newGiftCode = new GiftCode();
        newGiftCode.setCode("NEWCODE456");
        newGiftCode.setCourse(testCourse);
        newGiftCode.setCreatedBy(testUserProfile);
        newGiftCode.setCreatedDate(LocalDateTime.now());
        newGiftCode.setExpiryDate(LocalDateTime.now().plusDays(15));
        newGiftCode.setActive(true);
        newGiftCode.setMaxUses(5);
        newGiftCode.setCurrentUses(0);
        newGiftCode.setDescription("New test gift code");

        GiftCode savedGiftCode = giftCodeRepository.save(newGiftCode);
        assertThat(savedGiftCode.getId()).isNotNull();
        assertThat(savedGiftCode.getCode()).isEqualTo("NEWCODE456");

        // Test findById
        Optional<GiftCode> foundGiftCode = giftCodeRepository.findById(savedGiftCode.getId());
        assertThat(foundGiftCode).isPresent();
        assertThat(foundGiftCode.get().getMaxUses()).isEqualTo(5);

        // Test update
        savedGiftCode.setDescription("Updated gift code description");
        GiftCode updatedGiftCode = giftCodeRepository.save(savedGiftCode);
        assertThat(updatedGiftCode.getDescription()).isEqualTo("Updated gift code description");

        // Test delete
        giftCodeRepository.delete(savedGiftCode);
        Optional<GiftCode> deletedGiftCode = giftCodeRepository.findById(savedGiftCode.getId());
        assertThat(deletedGiftCode).isEmpty();
    }

    @Test
    void testGiftCodeRepository_CustomQueries() {
        // Test findByCode
        Optional<GiftCode> giftCodeByCode = giftCodeRepository.findByCode("TESTCODE123");
        assertThat(giftCodeByCode).isPresent();
        assertThat(giftCodeByCode.get().getDescription()).isEqualTo("Test gift code");

        // Test findActiveByCourseId
        List<GiftCode> activeGiftCodes = giftCodeRepository.findActiveByCourseId(testCourse.getId());
        assertThat(activeGiftCodes).hasSize(1);
        assertThat(activeGiftCodes.get(0).getActive()).isTrue();

        // Test findByCreatedByUserId
        List<GiftCode> giftCodesByUser = giftCodeRepository.findByCreatedByUserId(testUserProfile.getId());
        assertThat(giftCodesByUser).hasSize(1);
        assertThat(giftCodesByUser.get(0).getCreatedBy().getId()).isEqualTo(testUserProfile.getId());

        // Test isCodeValidForRedemption
        boolean isValid = giftCodeRepository.isCodeValidForRedemption("TESTCODE123", LocalDateTime.now());
        assertThat(isValid).isTrue();

        boolean isInvalid = giftCodeRepository.isCodeValidForRedemption("NONEXISTENT", LocalDateTime.now());
        assertThat(isInvalid).isFalse();
    }

    @Test
    void testGiftCodeRepository_ModifyingOperations() {
        // Test incrementUsageCount
        int initialUses = testGiftCode.getCurrentUses();
        giftCodeRepository.incrementUsageCount(testGiftCode.getId());

        // Refresh entity to get updated values
        Optional<GiftCode> updatedGiftCode = giftCodeRepository.findById(testGiftCode.getId());
        assertThat(updatedGiftCode).isPresent();
        assertThat(updatedGiftCode.get().getCurrentUses()).isEqualTo(initialUses + 1);

        // Test deactivateExpiredCodes
        GiftCode expiredCode = new GiftCode();
        expiredCode.setCode("EXPIRED123");
        expiredCode.setCourse(testCourse);
        expiredCode.setCreatedBy(testUserProfile);
        expiredCode.setCreatedDate(LocalDateTime.now().minusDays(10));
        expiredCode.setExpiryDate(LocalDateTime.now().minusDays(1));
        expiredCode.setActive(true);
        expiredCode.setMaxUses(10);
        expiredCode.setCurrentUses(0);
        expiredCode.setDescription("Expired gift code");
        giftCodeRepository.save(expiredCode);

        int deactivatedCount = giftCodeRepository.deactivateExpiredCodes(LocalDateTime.now());
        assertThat(deactivatedCount).isEqualTo(1);
    }

    // FlashcardRepository Tests

    @Test
    void testFlashcardRepository_BasicCrudOperations() {
        // Test save
        Flashcard newFlashcard = new Flashcard();
        newFlashcard.setFront("What is the currency of Japan?");
        newFlashcard.setBack("Yen");
        newFlashcard.setLesson(testLesson);
        newFlashcard.setPosition(2);

        Flashcard savedFlashcard = flashcardRepository.save(newFlashcard);
        assertThat(savedFlashcard.getId()).isNotNull();
        assertThat(savedFlashcard.getFront()).isEqualTo("What is the currency of Japan?");

        // Test findById
        Optional<Flashcard> foundFlashcard = flashcardRepository.findById(savedFlashcard.getId());
        assertThat(foundFlashcard).isPresent();
        assertThat(foundFlashcard.get().getBack()).isEqualTo("Yen");

        // Test update
        savedFlashcard.setBack("Japanese Yen");
        Flashcard updatedFlashcard = flashcardRepository.save(savedFlashcard);
        assertThat(updatedFlashcard.getBack()).isEqualTo("Japanese Yen");

        // Test delete
        flashcardRepository.delete(savedFlashcard);
        Optional<Flashcard> deletedFlashcard = flashcardRepository.findById(savedFlashcard.getId());
        assertThat(deletedFlashcard).isEmpty();
    }

    @Test
    void testFlashcardRepository_CustomQueries() {
        // Test findByLessonOrderByPosition
        List<Flashcard> flashcardsByLesson = flashcardRepository.findByLessonOrderByPosition(testLesson);
        assertThat(flashcardsByLesson).hasSize(1);
        assertThat(flashcardsByLesson.get(0).getPosition()).isEqualTo(1);
        assertThat(flashcardsByLesson.get(0).getFront()).isEqualTo("What is the capital of Japan?");
    }

    // SocialAccountRepository Tests

    @Test
    void testSocialAccountRepository_BasicCrudOperations() {
        // Test save
        SocialAccount newSocialAccount = new SocialAccount();
        newSocialAccount.setProvider("facebook");
        newSocialAccount.setProviderId("facebook456");
        newSocialAccount.setDisplayName("Test User Facebook");
        newSocialAccount.setProfileUrl("https://facebook.com/testuser");
        newSocialAccount.setImageUrl("https://facebook.com/avatar.jpg");

        SocialAccount savedSocialAccount = socialAccountRepository.save(newSocialAccount);
        assertThat(savedSocialAccount.getId()).isNotNull();
        assertThat(savedSocialAccount.getProvider()).isEqualTo("facebook");

        // Test findById
        Optional<SocialAccount> foundSocialAccount = socialAccountRepository.findById(savedSocialAccount.getId());
        assertThat(foundSocialAccount).isPresent();
        assertThat(foundSocialAccount.get().getProviderId()).isEqualTo("facebook456");

        // Test update
        savedSocialAccount.setDisplayName("Updated Facebook User");
        SocialAccount updatedSocialAccount = socialAccountRepository.save(savedSocialAccount);
        assertThat(updatedSocialAccount.getDisplayName()).isEqualTo("Updated Facebook User");

        // Test delete
        socialAccountRepository.delete(savedSocialAccount);
        Optional<SocialAccount> deletedSocialAccount = socialAccountRepository.findById(savedSocialAccount.getId());
        assertThat(deletedSocialAccount).isEmpty();
    }

    // Integration Tests

    @Test
    void testSystemAndManagementRepositories_Integration() {
        // Test complete file management workflow
        FileMetaData integrationFile = new FileMetaData();
        integrationFile.setFileName("integration-test.mp4");
        integrationFile.setOriginalName("Integration Test Video.mp4");
        integrationFile.setMimeType("video/mp4");
        integrationFile.setFileSize(5120L);
        integrationFile.setChecksum("integration123");
        integrationFile.setFolderPath("/uploads/videos");
        integrationFile.setDescription("Integration test video");
        integrationFile.setIsPublic(false);
        integrationFile.setUploadDate(Instant.now());
        integrationFile.setLastAccessedDate(Instant.now());
        integrationFile.setDownloadCount(0);
        integrationFile.setLesson(testLesson);
        integrationFile.setUploadedBy(testUserProfile);
        FileMetaData savedFile = fileMetaDataRepository.save(integrationFile);

        // Create audit log for file upload
        AuditLog fileUploadLog = new AuditLog();
        fileUploadLog.setUsername(testUserProfile.getUsername());
        fileUploadLog.setAction(AuditAction.CREATE);
        fileUploadLog.setResourceType("FileMetaData");
        fileUploadLog.setResourceId(savedFile.getId());
        fileUploadLog.setTimestamp(Instant.now());
        fileUploadLog.setIpAddress("192.168.1.100");
        fileUploadLog.setUserAgent("Integration Test Agent");
        fileUploadLog.setSuccess(true);
        fileUploadLog.setDetails("Uploaded integration test video");
        AuditLog savedAuditLog = auditLogRepository.save(fileUploadLog);

        // Create notification for file upload
        NotificationDelivery fileNotification = new NotificationDelivery();
        fileNotification.setRecipientId(testUserProfile.getId());
        fileNotification.setNotificationType(NotificationType.SYSTEM_NOTIFICATION);
        fileNotification.setDeliveryChannel("EMAIL");
        fileNotification.setSubject("File Upload Successful");
        fileNotification.setContent("Your file " + savedFile.getOriginalName() + " has been uploaded successfully");
        fileNotification.setStatus(DeliveryStatus.SENT);
        fileNotification.setCreatedAt(Instant.now());
        fileNotification.setSentAt(Instant.now());
        fileNotification.setRetryCount(0);
        fileNotification.setMaxRetries(3);
        NotificationDelivery savedNotification = notificationDeliveryRepository.save(fileNotification);

        // Verify all entities are properly linked and functional
        assertThat(savedFile.getId()).isNotNull();
        assertThat(savedAuditLog.getId()).isNotNull();
        assertThat(savedNotification.getId()).isNotNull();

        // Test cross-repository queries
        List<FileMetaData> userFiles = fileMetaDataRepository.findByUploadedBy(testUserProfile.getId());
        assertThat(userFiles).hasSize(2); // Original test file + integration file

        List<AuditLog> userAuditLogs = auditLogRepository
                .findTop10ByUsernameOrderByTimestampDesc(testUserProfile.getUsername());
        assertThat(userAuditLogs).hasSize(2); // Original audit log + file upload log

        List<NotificationDelivery> userNotifications = notificationDeliveryRepository
                .findByRecipientId(testUserProfile.getId());
        assertThat(userNotifications).hasSize(2); // Original notification + file notification

        // Test file access control
        boolean hasAccess = fileMetaDataRepository.hasAccessToFile(savedFile.getId(), testUserProfile.getId());
        assertThat(hasAccess).isTrue();

        // Test notification preferences
        boolean notificationEnabled = notificationPreferenceRepository.isNotificationEnabled(
                testUserProfile.getId(), NotificationType.SYSTEM_NOTIFICATION);
        assertThat(notificationEnabled).isFalse(); // Not explicitly enabled
    }

    @Test
    void testRepositoryPerformance() {
        // Create multiple entities for performance testing
        List<FileMetaData> files = new ArrayList<>();
        for (int i = 0; i < 10; i++) {
            FileMetaData file = new FileMetaData();
            file.setFileName("perf-file-" + i + ".txt");
            file.setOriginalName("Performance File " + i + ".txt");
            file.setMimeType("text/plain");
            file.setFileSize(512L);
            file.setChecksum("perf" + i);
            file.setFolderPath("/uploads/performance");
            file.setDescription("Performance test file " + i);
            file.setIsPublic(true);
            file.setUploadDate(Instant.now());
            file.setLastAccessedDate(Instant.now());
            file.setDownloadCount(0);
            file.setUploadedBy(testUserProfile);
            files.add(file);
        }

        long startTime = System.currentTimeMillis();
        fileMetaDataRepository.saveAll(files);
        long saveTime = System.currentTimeMillis() - startTime;

        startTime = System.currentTimeMillis();
        List<FileMetaData> allFiles = fileMetaDataRepository.findAll();
        long findTime = System.currentTimeMillis() - startTime;

        // Performance assertions (should complete within reasonable time)
        assertThat(saveTime).isLessThan(2000); // 2 seconds
        assertThat(findTime).isLessThan(1000); // 1 second
        assertThat(allFiles.size()).isGreaterThanOrEqualTo(10);

        // Test complex query performance
        startTime = System.currentTimeMillis();
        List<FileMetaData> searchResults = fileMetaDataRepository.searchFiles(
                "performance", "/uploads/performance", "text/plain", testUserProfile.getId());
        long searchTime = System.currentTimeMillis() - startTime;

        assertThat(searchTime).isLessThan(1000); // 1 second
        assertThat(searchResults).hasSize(10);
    }

    @Test
    void testNotificationAnalyticsScenarios() {
        // Create various notification scenarios for analytics testing
        Instant baseTime = Instant.now().minus(1, ChronoUnit.DAYS);

        // Create successful notifications
        for (int i = 0; i < 5; i++) {
            NotificationDelivery notification = new NotificationDelivery();
            notification.setRecipientId(testUserProfile.getId());
            notification.setNotificationType(NotificationType.QUIZ_REMINDER);
            notification.setDeliveryChannel("EMAIL");
            notification.setSubject("Quiz Reminder " + i);
            notification.setContent("Don't forget your quiz");
            notification.setStatus(DeliveryStatus.DELIVERED);
            notification.setCreatedAt(baseTime.plus(i, ChronoUnit.HOURS));
            notification.setSentAt(baseTime.plus(i, ChronoUnit.HOURS).plus(1, ChronoUnit.MINUTES));
            notification.setDeliveredAt(baseTime.plus(i, ChronoUnit.HOURS).plus(2, ChronoUnit.MINUTES));
            notification.setRetryCount(0);
            notification.setMaxRetries(3);
            notificationDeliveryRepository.save(notification);
        }

        // Create failed notifications
        for (int i = 0; i < 2; i++) {
            NotificationDelivery notification = new NotificationDelivery();
            notification.setRecipientId(testUserProfile.getId());
            notification.setNotificationType(NotificationType.LESSON_REMINDER);
            notification.setDeliveryChannel("SMS");
            notification.setSubject("Lesson Reminder " + i);
            notification.setContent("Your lesson is starting soon");
            notification.setStatus(DeliveryStatus.FAILED);
            notification.setCreatedAt(baseTime.plus(i + 6, ChronoUnit.HOURS));
            notification.setRetryCount(3);
            notification.setMaxRetries(3);
            notification.setErrorMessage("SMS delivery failed");
            notificationDeliveryRepository.save(notification);
        }

        // Test analytics queries
        Instant startDate = baseTime.minus(1, ChronoUnit.HOURS);
        Instant endDate = Instant.now().plus(1, ChronoUnit.HOURS);

        List<Object[]> deliveryStats = notificationDeliveryRepository.getDeliveryStatistics(startDate, endDate);
        assertThat(deliveryStats).isNotEmpty();

        List<Object[]> deliveryStatsByType = notificationDeliveryRepository.getDeliveryStatisticsByType(startDate,
                endDate);
        assertThat(deliveryStatsByType).isNotEmpty();

        List<Object[]> deliveryStatsByChannel = notificationDeliveryRepository.getDeliveryStatisticsByChannel(startDate,
                endDate);
        assertThat(deliveryStatsByChannel).isNotEmpty();

        Double deliveryRate = notificationDeliveryRepository.getDeliveryRate(startDate, endDate);
        assertThat(deliveryRate).isNotNull();
        assertThat(deliveryRate).isGreaterThan(0.0);

        List<Object[]> deliveryRateByType = notificationDeliveryRepository.getDeliveryRateByType(startDate, endDate);
        assertThat(deliveryRateByType).isNotEmpty();
    }
}