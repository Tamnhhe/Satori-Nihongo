package com.satori.platform.validation;

import com.satori.platform.OnlineSatoriPlatformApp;
import com.satori.platform.domain.FileMetaData;
import com.satori.platform.domain.User;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.Lesson;
import com.satori.platform.domain.Course;
import com.satori.platform.service.FileManagementService;
import com.satori.platform.service.NotificationManagementService;
import com.satori.platform.service.SystemMonitoringService;
import com.satori.platform.service.ReportingService;
import com.satori.platform.service.StudentProgressAnalyticsService;
import com.satori.platform.service.ComprehensiveAnalyticsService;
import com.satori.platform.service.SystemConfigurationService;
import com.satori.platform.service.dto.FileMetadataDTO;
import com.satori.platform.service.dto.NotificationTemplateDTO;
import com.satori.platform.service.dto.SystemMonitoringDTO;
import com.satori.platform.service.dto.ReportConfigurationDTO;
import com.satori.platform.service.dto.StudentProgressDTO;
import com.satori.platform.service.dto.ComprehensiveAnalyticsDTO;
import com.satori.platform.service.dto.SystemConfigurationDTO;
import com.satori.platform.service.mapper.FileMetaDataMapper;
import com.satori.platform.repository.FileMetaDataRepository;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.repository.LessonRepository;
import com.satori.platform.repository.CourseRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.mock.web.MockMultipartFile;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.*;

/**
 * Comprehensive validation tests for System and Management Services.
 * 
 * Tests Requirements:
 * - 4.1: Service methods correctly process data and handle business logic
 * - 4.2: DTOs are correctly mapped from entities
 * - 4.5: Service validation passes confirming all business logic operates
 * correctly
 */
@SpringBootTest(classes = OnlineSatoriPlatformApp.class)
@ActiveProfiles("test")
@Transactional
public class SystemAndManagementServiceValidationTest {

    @Autowired
    private FileManagementService fileManagementService;

    @Autowired
    private NotificationManagementService notificationManagementService;

    @Autowired
    private SystemMonitoringService systemMonitoringService;

    @Autowired
    private ReportingService reportingService;

    @Autowired
    private StudentProgressAnalyticsService studentProgressAnalyticsService;

    @Autowired
    private ComprehensiveAnalyticsService comprehensiveAnalyticsService;

    @Autowired
    private SystemConfigurationService systemConfigurationService;

    @Autowired
    private FileMetaDataRepository fileMetaDataRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private FileMetaDataMapper fileMetaDataMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private FileMetaData testFileMetaData;
    private User testUser;
    private UserProfile testUserProfile;
    private Lesson testLesson;
    private Course testCourse;

    @BeforeEach
    void setUp() {
        // Create test user
        testUser = new User();
        testUser.setLogin("testuser");
        testUser.setEmail("test@example.com");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setPassword(passwordEncoder.encode("password"));
        testUser.setActivated(true);
        testUser.setLangKey("en");
        testUser.setCreatedBy("system");
        testUser.setCreatedDate(Instant.now());
        testUser = userRepository.save(testUser);

        // Create test user profile
        testUserProfile = new UserProfile();
        testUserProfile.setUser(testUser);
        testUserProfile.setPhoneNumber("1234567890");
        testUserProfile.setDateOfBirth(LocalDateTime.now().minusYears(25));
        testUserProfile.setGender("MALE");
        testUserProfile.setAddress("Test Address");
        testUserProfile.setCity("Test City");
        testUserProfile.setCountry("Test Country");
        testUserProfile.setOccupation("Student");
        testUserProfile = userProfileRepository.save(testUserProfile);

        // Create test course
        testCourse = new Course();
        testCourse.setTitle("Test Japanese Course");
        testCourse.setDescription("A comprehensive Japanese language course");
        testCourse.setLevel("BEGINNER");
        testCourse.setDuration(120);
        testCourse.setPrice(299.99);
        testCourse.setActive(true);
        testCourse.setCreatedDate(LocalDateTime.now());
        testCourse.setUpdatedDate(LocalDateTime.now());
        testCourse = courseRepository.save(testCourse);

        // Create test lesson
        testLesson = new Lesson();
        testLesson.setTitle("Introduction to Hiragana");
        testLesson.setContent("Learn the basics of Hiragana characters");
        testLesson.setCourse(testCourse);
        testLesson.setOrderIndex(1);
        testLesson.setDuration(30);
        testLesson.setActive(true);
        testLesson.setCreatedDate(LocalDateTime.now());
        testLesson.setUpdatedDate(LocalDateTime.now());
        testLesson = lessonRepository.save(testLesson);

        // Create test file metadata
        testFileMetaData = new FileMetaData();
        testFileMetaData.setFileName("test-document.pdf");
        testFileMetaData.setOriginalFileName("Test Document.pdf");
        testFileMetaData.setFileSize(1024L);
        testFileMetaData.setMimeType("application/pdf");
        testFileMetaData.setChecksum("abc123def456");
        testFileMetaData.setFolderPath("/lessons/documents");
        testFileMetaData.setUploadDate(LocalDateTime.now());
        testFileMetaData.setLesson(testLesson);
        testFileMetaData.setUserProfile(testUserProfile);
        testFileMetaData = fileMetaDataRepository.save(testFileMetaData);
    }

    @Test
    @DisplayName("Validate FileManagementService operations")
    void testFileManagementServiceOperations() {
        // Test file upload
        MockMultipartFile mockFile = new MockMultipartFile(
                "file",
                "test-upload.pdf",
                "application/pdf",
                "Test file content".getBytes());

        FileMetadataDTO uploadedFile = fileManagementService.uploadFile(
                mockFile,
                "/lessons/uploads",
                testUserProfile.getId(),
                testLesson.getId());

        assertThat(uploadedFile).isNotNull();
        assertThat(uploadedFile.getFileName()).isEqualTo("test-upload.pdf");
        assertThat(uploadedFile.getMimeType()).isEqualTo("application/pdf");
        assertThat(uploadedFile.getFolderPath()).isEqualTo("/lessons/uploads");

        // Test file metadata retrieval
        Optional<FileMetadataDTO> retrievedFile = fileManagementService.getFileMetadata(uploadedFile.getId());
        assertThat(retrievedFile).isPresent();
        assertThat(retrievedFile.get().getFileName()).isEqualTo("test-upload.pdf");

        // Test file listing by folder
        List<FileMetadataDTO> folderFiles = fileManagementService.getFilesByFolder("/lessons/uploads");
        assertThat(folderFiles).isNotEmpty();
        assertThat(folderFiles).anyMatch(file -> file.getFileName().equals("test-upload.pdf"));

        // Test file listing by lesson
        List<FileMetadataDTO> lessonFiles = fileManagementService.getFilesByLesson(testLesson.getId());
        assertThat(lessonFiles).isNotEmpty();
        assertThat(lessonFiles.size()).isGreaterThanOrEqualTo(2); // Original + uploaded file

        // Test file deletion
        fileManagementService.deleteFile(uploadedFile.getId());
        Optional<FileMetadataDTO> deletedFile = fileManagementService.getFileMetadata(uploadedFile.getId());
        assertThat(deletedFile).isEmpty();

        // Test folder structure creation
        fileManagementService.createFolder("/lessons/new-folder", testUserProfile.getId());
        List<String> folders = fileManagementService.getFolderStructure("/lessons");
        assertThat(folders).contains("/lessons/new-folder");

        // Test file search
        List<FileMetadataDTO> searchResults = fileManagementService.searchFiles("test", testUserProfile.getId());
        assertThat(searchResults).isNotEmpty();
    }

    @Test
    @DisplayName("Validate NotificationManagementService operations")
    void testNotificationManagementServiceOperations() {
        // Test notification template creation
        NotificationTemplateDTO templateDTO = new NotificationTemplateDTO();
        templateDTO.setName("Welcome Template");
        templateDTO.setSubject("Welcome to Satori Platform");
        templateDTO.setContent("Welcome {{userName}} to our Japanese learning platform!");
        templateDTO.setType("EMAIL");
        templateDTO.setLanguage("en");
        templateDTO.setActive(true);

        NotificationTemplateDTO createdTemplate = notificationManagementService.createTemplate(templateDTO);
        assertThat(createdTemplate).isNotNull();
        assertThat(createdTemplate.getName()).isEqualTo("Welcome Template");
        assertThat(createdTemplate.getContent()).contains("{{userName}}");

        // Test template update
        createdTemplate.setContent("Updated welcome message for {{userName}}!");
        NotificationTemplateDTO updatedTemplate = notificationManagementService.updateTemplate(createdTemplate);
        assertThat(updatedTemplate.getContent()).contains("Updated welcome message");

        // Test template retrieval
        Optional<NotificationTemplateDTO> retrievedTemplate = notificationManagementService
                .getTemplate(createdTemplate.getId());
        assertThat(retrievedTemplate).isPresent();
        assertThat(retrievedTemplate.get().getName()).isEqualTo("Welcome Template");

        // Test notification sending
        Map<String, Object> variables = Map.of("userName", testUser.getFirstName());
        notificationManagementService.sendNotification(
                testUser.getId(),
                createdTemplate.getId(),
                variables);

        // Test notification history
        List<NotificationTemplateDTO> userNotifications = notificationManagementService
                .getUserNotificationHistory(testUser.getId());
        assertThat(userNotifications).isNotEmpty();

        // Test bulk notification sending
        List<Long> userIds = List.of(testUser.getId());
        notificationManagementService.sendBulkNotification(userIds, createdTemplate.getId(), variables);

        // Test notification analytics
        Map<String, Object> analytics = notificationManagementService.getNotificationAnalytics(createdTemplate.getId());
        assertThat(analytics).isNotEmpty();
        assertThat(analytics).containsKey("totalSent");
    }

    @Test
    @DisplayName("Validate SystemMonitoringService operations")
    void testSystemMonitoringServiceOperations() {
        // Test system health check
        SystemMonitoringDTO healthStatus = systemMonitoringService.getSystemHealth();
        assertThat(healthStatus).isNotNull();
        assertThat(healthStatus.getStatus()).isIn("UP", "DOWN", "DEGRADED");

        // Test database connectivity
        boolean dbConnected = systemMonitoringService.checkDatabaseConnection();
        assertThat(dbConnected).isTrue();

        // Test memory usage
        Map<String, Object> memoryStats = systemMonitoringService.getMemoryUsage();
        assertThat(memoryStats).isNotEmpty();
        assertThat(memoryStats).containsKey("used");
        assertThat(memoryStats).containsKey("max");

        // Test application metrics
        Map<String, Object> appMetrics = systemMonitoringService.getApplicationMetrics();
        assertThat(appMetrics).isNotEmpty();
        assertThat(appMetrics).containsKey("uptime");

        // Test performance metrics
        Map<String, Object> performanceMetrics = systemMonitoringService.getPerformanceMetrics();
        assertThat(performanceMetrics).isNotEmpty();

        // Test system configuration validation
        boolean configValid = systemMonitoringService.validateSystemConfiguration();
        assertThat(configValid).isTrue();

        // Test disk space monitoring
        Map<String, Object> diskStats = systemMonitoringService.getDiskUsage();
        assertThat(diskStats).isNotEmpty();
        assertThat(diskStats).containsKey("available");

        // Test active sessions monitoring
        long activeSessions = systemMonitoringService.getActiveSessionCount();
        assertThat(activeSessions).isGreaterThanOrEqualTo(0);
    }

    @Test
    @DisplayName("Validate ReportingService operations")
    void testReportingServiceOperations() {
        // Test report configuration creation
        ReportConfigurationDTO reportConfig = new ReportConfigurationDTO();
        reportConfig.setName("Student Progress Report");
        reportConfig.setDescription("Weekly student progress summary");
        reportConfig.setType("STUDENT_PROGRESS");
        reportConfig.setFormat("PDF");
        reportConfig.setSchedule("WEEKLY");
        reportConfig.setActive(true);

        ReportConfigurationDTO createdConfig = reportingService.createReportConfiguration(reportConfig);
        assertThat(createdConfig).isNotNull();
        assertThat(createdConfig.getName()).isEqualTo("Student Progress Report");
        assertThat(createdConfig.getType()).isEqualTo("STUDENT_PROGRESS");

        // Test report generation
        byte[] reportData = reportingService.generateReport(createdConfig.getId());
        assertThat(reportData).isNotNull();
        assertThat(reportData.length).isGreaterThan(0);

        // Test scheduled report management
        reportingService.scheduleReport(createdConfig.getId(), "0 0 9 * * MON"); // Every Monday at 9 AM

        List<ReportConfigurationDTO> scheduledReports = reportingService.getScheduledReports();
        assertThat(scheduledReports).isNotEmpty();
        assertThat(scheduledReports).anyMatch(report -> report.getId().equals(createdConfig.getId()));

        // Test report history
        List<Map<String, Object>> reportHistory = reportingService.getReportHistory(createdConfig.getId());
        assertThat(reportHistory).isNotEmpty();

        // Test report export formats
        byte[] csvReport = reportingService.exportReport(createdConfig.getId(), "CSV");
        assertThat(csvReport).isNotNull();

        byte[] excelReport = reportingService.exportReport(createdConfig.getId(), "EXCEL");
        assertThat(excelReport).isNotNull();

        // Test report delivery
        reportingService.deliverReport(createdConfig.getId(), List.of(testUser.getEmail()));
    }

    @Test
    @DisplayName("Validate StudentProgressAnalyticsService operations")
    void testStudentProgressAnalyticsServiceOperations() {
        // Test student progress calculation
        StudentProgressDTO progress = studentProgressAnalyticsService.calculateStudentProgress(testUserProfile.getId());
        assertThat(progress).isNotNull();
        assertThat(progress.getStudentId()).isEqualTo(testUserProfile.getId());

        // Test course progress tracking
        StudentProgressDTO courseProgress = studentProgressAnalyticsService.getCourseProgress(
                testUserProfile.getId(), testCourse.getId());
        assertThat(courseProgress).isNotNull();
        assertThat(courseProgress.getCourseId()).isEqualTo(testCourse.getId());

        // Test learning analytics
        Map<String, Object> learningAnalytics = studentProgressAnalyticsService
                .getLearningAnalytics(testUserProfile.getId());
        assertThat(learningAnalytics).isNotEmpty();
        assertThat(learningAnalytics).containsKey("totalStudyTime");

        // Test performance trends
        List<Map<String, Object>> performanceTrends = studentProgressAnalyticsService.getPerformanceTrends(
                testUserProfile.getId(), 30); // Last 30 days
        assertThat(performanceTrends).isNotNull();

        // Test comparative analytics
        Map<String, Object> comparativeAnalytics = studentProgressAnalyticsService.getComparativeAnalytics(
                testUserProfile.getId(), testCourse.getId());
        assertThat(comparativeAnalytics).isNotEmpty();

        // Test learning path recommendations
        List<String> recommendations = studentProgressAnalyticsService
                .getLearningPathRecommendations(testUserProfile.getId());
        assertThat(recommendations).isNotNull();

        // Test achievement tracking
        List<Map<String, Object>> achievements = studentProgressAnalyticsService
                .getStudentAchievements(testUserProfile.getId());
        assertThat(achievements).isNotNull();
    }

    @Test
    @DisplayName("Validate ComprehensiveAnalyticsService operations")
    void testComprehensiveAnalyticsServiceOperations() {
        // Test platform-wide analytics
        ComprehensiveAnalyticsDTO platformAnalytics = comprehensiveAnalyticsService.getPlatformAnalytics();
        assertThat(platformAnalytics).isNotNull();
        assertThat(platformAnalytics.getTotalUsers()).isGreaterThanOrEqualTo(1);

        // Test course analytics
        ComprehensiveAnalyticsDTO courseAnalytics = comprehensiveAnalyticsService
                .getCourseAnalytics(testCourse.getId());
        assertThat(courseAnalytics).isNotNull();
        assertThat(courseAnalytics.getCourseId()).isEqualTo(testCourse.getId());

        // Test engagement metrics
        Map<String, Object> engagementMetrics = comprehensiveAnalyticsService.getEngagementMetrics();
        assertThat(engagementMetrics).isNotEmpty();
        assertThat(engagementMetrics).containsKey("dailyActiveUsers");

        // Test revenue analytics
        Map<String, Object> revenueAnalytics = comprehensiveAnalyticsService.getRevenueAnalytics();
        assertThat(revenueAnalytics).isNotEmpty();
        assertThat(revenueAnalytics).containsKey("totalRevenue");

        // Test user behavior analytics
        Map<String, Object> behaviorAnalytics = comprehensiveAnalyticsService.getUserBehaviorAnalytics();
        assertThat(behaviorAnalytics).isNotEmpty();

        // Test content performance analytics
        Map<String, Object> contentAnalytics = comprehensiveAnalyticsService.getContentPerformanceAnalytics();
        assertThat(contentAnalytics).isNotEmpty();

        // Test predictive analytics
        Map<String, Object> predictiveAnalytics = comprehensiveAnalyticsService.getPredictiveAnalytics();
        assertThat(predictiveAnalytics).isNotNull();

        // Test custom analytics queries
        Map<String, Object> customQuery = Map.of(
                "metric", "user_engagement",
                "timeframe", "last_30_days",
                "groupBy", "course");
        Map<String, Object> customResults = comprehensiveAnalyticsService.executeCustomAnalytics(customQuery);
        assertThat(customResults).isNotNull();
    }

    @Test
    @DisplayName("Validate SystemConfigurationService operations")
    void testSystemConfigurationServiceOperations() {
        // Test configuration setting
        SystemConfigurationDTO config = new SystemConfigurationDTO();
        config.setKey("max_file_upload_size");
        config.setValue("10MB");
        config.setDescription("Maximum file upload size");
        config.setCategory("FILE_MANAGEMENT");
        config.setActive(true);

        SystemConfigurationDTO savedConfig = systemConfigurationService.setConfiguration(config);
        assertThat(savedConfig).isNotNull();
        assertThat(savedConfig.getKey()).isEqualTo("max_file_upload_size");
        assertThat(savedConfig.getValue()).isEqualTo("10MB");

        // Test configuration retrieval
        Optional<SystemConfigurationDTO> retrievedConfig = systemConfigurationService
                .getConfiguration("max_file_upload_size");
        assertThat(retrievedConfig).isPresent();
        assertThat(retrievedConfig.get().getValue()).isEqualTo("10MB");

        // Test configuration update
        savedConfig.setValue("20MB");
        SystemConfigurationDTO updatedConfig = systemConfigurationService.updateConfiguration(savedConfig);
        assertThat(updatedConfig.getValue()).isEqualTo("20MB");

        // Test configuration by category
        List<SystemConfigurationDTO> fileConfigs = systemConfigurationService
                .getConfigurationsByCategory("FILE_MANAGEMENT");
        assertThat(fileConfigs).isNotEmpty();
        assertThat(fileConfigs).anyMatch(cfg -> cfg.getKey().equals("max_file_upload_size"));

        // Test all configurations
        List<SystemConfigurationDTO> allConfigs = systemConfigurationService.getAllConfigurations();
        assertThat(allConfigs).isNotEmpty();

        // Test configuration validation
        boolean isValid = systemConfigurationService.validateConfiguration("max_file_upload_size", "50MB");
        assertThat(isValid).isTrue();

        // Test configuration reset
        systemConfigurationService.resetConfiguration("max_file_upload_size");
        Optional<SystemConfigurationDTO> resetConfig = systemConfigurationService
                .getConfiguration("max_file_upload_size");
        assertThat(resetConfig).isPresent();

        // Test bulk configuration update
        Map<String, String> bulkConfigs = Map.of(
                "session_timeout", "30",
                "max_concurrent_users", "1000");
        systemConfigurationService.updateConfigurations(bulkConfigs);

        Optional<SystemConfigurationDTO> sessionConfig = systemConfigurationService.getConfiguration("session_timeout");
        assertThat(sessionConfig).isPresent();
        assertThat(sessionConfig.get().getValue()).isEqualTo("30");
    }

    @Test
    @DisplayName("Validate DTO mapping consistency")
    void testDTOMappingConsistency() {
        // Test FileMetaData to FileMetadataDTO mapping
        FileMetadataDTO fileDTO = fileMetaDataMapper.toDto(testFileMetaData);
        assertThat(fileDTO).isNotNull();
        assertThat(fileDTO.getFileName()).isEqualTo(testFileMetaData.getFileName());
        assertThat(fileDTO.getOriginalFileName()).isEqualTo(testFileMetaData.getOriginalFileName());
        assertThat(fileDTO.getFileSize()).isEqualTo(testFileMetaData.getFileSize());
        assertThat(fileDTO.getMimeType()).isEqualTo(testFileMetaData.getMimeType());
        assertThat(fileDTO.getChecksum()).isEqualTo(testFileMetaData.getChecksum());
        assertThat(fileDTO.getFolderPath()).isEqualTo(testFileMetaData.getFolderPath());

        // Test reverse mapping
        FileMetaData mappedEntity = fileMetaDataMapper.toEntity(fileDTO);
        assertThat(mappedEntity).isNotNull();
        assertThat(mappedEntity.getFileName()).isEqualTo(fileDTO.getFileName());
        assertThat(mappedEntity.getFileSize()).isEqualTo(fileDTO.getFileSize());
        assertThat(mappedEntity.getMimeType()).isEqualTo(fileDTO.getMimeType());
    }

    @Test
    @DisplayName("Validate service error handling")
    void testServiceErrorHandling() {
        // Test file upload with invalid data
        MockMultipartFile invalidFile = new MockMultipartFile(
                "file",
                "", // Empty filename
                "application/pdf",
                new byte[0] // Empty content
        );

        assertThatThrownBy(() -> fileManagementService.uploadFile(
                invalidFile, "/invalid", testUserProfile.getId(), testLesson.getId()))
                .isInstanceOf(Exception.class);

        // Test notification with invalid template
        assertThatThrownBy(() -> notificationManagementService.sendNotification(
                testUser.getId(), 999999L, Map.of()))
                .isInstanceOf(Exception.class);

        // Test report generation with invalid configuration
        assertThatThrownBy(() -> reportingService.generateReport(999999L))
                .isInstanceOf(Exception.class);

        // Test analytics with invalid user
        assertThatThrownBy(() -> studentProgressAnalyticsService.calculateStudentProgress(999999L))
                .isInstanceOf(Exception.class);
    }

    @Test
    @DisplayName("Validate service business logic")
    void testServiceBusinessLogic() {
        // Test file size validation
        MockMultipartFile largeFile = new MockMultipartFile(
                "file",
                "large-file.pdf",
                "application/pdf",
                new byte[1024 * 1024] // 1MB file
        );

        FileMetadataDTO uploadedLargeFile = fileManagementService.uploadFile(
                largeFile, "/lessons/large", testUserProfile.getId(), testLesson.getId());
        assertThat(uploadedLargeFile.getFileSize()).isEqualTo(1024 * 1024);

        // Test duplicate file handling
        MockMultipartFile duplicateFile = new MockMultipartFile(
                "file",
                "large-file.pdf", // Same name
                "application/pdf",
                new byte[1024 * 1024]);

        // Should handle duplicate names appropriately
        FileMetadataDTO uploadedDuplicate = fileManagementService.uploadFile(
                duplicateFile, "/lessons/large", testUserProfile.getId(), testLesson.getId());
        assertThat(uploadedDuplicate).isNotNull();
        // File name might be modified to avoid conflicts

        // Test system monitoring thresholds
        SystemMonitoringDTO healthStatus = systemMonitoringService.getSystemHealth();
        if ("DEGRADED".equals(healthStatus.getStatus())) {
            // System should provide details about degradation
            assertThat(healthStatus.getDetails()).isNotEmpty();
        }

        // Test report scheduling validation
        ReportConfigurationDTO invalidSchedule = new ReportConfigurationDTO();
        invalidSchedule.setName("Invalid Schedule Report");
        invalidSchedule.setSchedule("INVALID_SCHEDULE");

        assertThatThrownBy(() -> reportingService.createReportConfiguration(invalidSchedule))
                .isInstanceOf(Exception.class);

        // Test analytics data consistency
        ComprehensiveAnalyticsDTO analytics = comprehensiveAnalyticsService.getPlatformAnalytics();
        assertThat(analytics.getTotalUsers()).isGreaterThanOrEqualTo(1); // At least our test user
        assertThat(analytics.getTotalCourses()).isGreaterThanOrEqualTo(1); // At least our test course
    }

    @Test
    @DisplayName("Validate service transaction handling")
    void testServiceTransactionHandling() {
        // Test that services properly handle transactions
        long initialFileCount = fileMetaDataRepository.count();

        // Upload multiple files in a transaction-like operation
        MockMultipartFile file1 = new MockMultipartFile(
                "file1", "transaction-test-1.pdf", "application/pdf", "Content 1".getBytes());
        MockMultipartFile file2 = new MockMultipartFile(
                "file2", "transaction-test-2.pdf", "application/pdf", "Content 2".getBytes());

        FileMetadataDTO uploadedFile1 = fileManagementService.uploadFile(
                file1, "/lessons/transaction", testUserProfile.getId(), testLesson.getId());
        FileMetadataDTO uploadedFile2 = fileManagementService.uploadFile(
                file2, "/lessons/transaction", testUserProfile.getId(), testLesson.getId());

        assertThat(uploadedFile1).isNotNull();
        assertThat(uploadedFile2).isNotNull();

        // Verify files were uploaded
        long finalFileCount = fileMetaDataRepository.count();
        assertThat(finalFileCount).isEqualTo(initialFileCount + 2);

        // Test batch operations
        List<Long> fileIds = List.of(uploadedFile1.getId(), uploadedFile2.getId());
        fileManagementService.deleteFiles(fileIds);

        // Verify files were deleted
        long afterDeleteCount = fileMetaDataRepository.count();
        assertThat(afterDeleteCount).isEqualTo(initialFileCount);

        // Transaction will be rolled back after test, so changes won't persist
    }
}