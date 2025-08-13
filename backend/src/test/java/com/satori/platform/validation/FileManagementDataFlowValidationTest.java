package com.satori.platform.validation;

import com.satori.platform.OnlineSatoriPlatformApp;
import com.satori.platform.domain.FileMetaData;
import com.satori.platform.domain.Lesson;
import com.satori.platform.domain.Course;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.User;
import com.satori.platform.repository.FileMetaDataRepository;
import com.satori.platform.repository.LessonRepository;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.service.FileManagementService;
import com.satori.platform.service.MediaProcessingService;
import com.satori.platform.security.FileSecurityService;
import com.satori.platform.service.dto.FileMetadataDTO;
import com.satori.platform.service.dto.FileUploadResponseDTO;
import com.satori.platform.service.dto.FolderStructureDTO;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.mock.web.MockMultipartFile;

import java.time.Instant;
import java.util.Optional;
import java.util.List;
import java.nio.charset.StandardCharsets;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Comprehensive data flow validation test for file management system.
 * Tests complete data flow from database through all layers to API endpoints.
 * 
 * Requirements: 6.1, 6.2, 6.5
 */
@SpringBootTest(classes = OnlineSatoriPlatformApp.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Transactional
public class FileManagementDataFlowValidationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private FileMetaDataRepository fileMetaDataRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private FileManagementService fileManagementService;

    @Autowired
    private MediaProcessingService mediaProcessingService;

    @Autowired
    private FileSecurityService fileSecurityService;

    private String baseUrl;
    private HttpHeaders headers;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api";
        headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
    }

    @Test
    @DisplayName("Test file operations from upload to retrieval")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testFileOperationsFromUploadToRetrieval() {
        // Step 1: Create supporting entities
        User user = createTestUser();
        User savedUser = userRepository.save(user);

        UserProfile userProfile = createTestUserProfile(savedUser);
        UserProfile savedProfile = userProfileRepository.save(userProfile);

        Course course = createTestCourse();
        Course savedCourse = courseRepository.save(course);

        Lesson lesson = createTestLesson(savedCourse);
        Lesson savedLesson = lessonRepository.save(lesson);

        // Step 2: Create file metadata at database layer
        FileMetaData fileMetaData = createTestFileMetaData(savedLesson, savedProfile);
        FileMetaData savedFile = fileMetaDataRepository.save(fileMetaData);

        // Verify database persistence with all new fields
        Optional<FileMetaData> dbFile = fileMetaDataRepository.findById(savedFile.getId());
        assertThat(dbFile).isPresent();
        assertThat(dbFile.get().getFileName()).isEqualTo(fileMetaData.getFileName());
        assertThat(dbFile.get().getOriginalFileName()).isEqualTo(fileMetaData.getOriginalFileName());
        assertThat(dbFile.get().getFilePath()).isEqualTo(fileMetaData.getFilePath());
        assertThat(dbFile.get().getFolderPath()).isEqualTo(fileMetaData.getFolderPath());
        assertThat(dbFile.get().getMimeType()).isEqualTo(fileMetaData.getMimeType());
        assertThat(dbFile.get().getFileSize()).isEqualTo(fileMetaData.getFileSize());
        assertThat(dbFile.get().getChecksum()).isEqualTo(fileMetaData.getChecksum());
        assertThat(dbFile.get().getUploadDate()).isEqualTo(fileMetaData.getUploadDate());
        assertThat(dbFile.get().getLesson().getId()).isEqualTo(savedLesson.getId());
        assertThat(dbFile.get().getUserProfile().getId()).isEqualTo(savedProfile.getId());

        // Step 3: Test service layer file operations
        Optional<FileMetadataDTO> serviceResponse = fileManagementService.getFileMetadata(savedFile.getId());
        assertThat(serviceResponse).isPresent();
        FileMetadataDTO fileDTO = serviceResponse.get();
        assertThat(fileDTO.getId()).isEqualTo(savedFile.getId());
        assertThat(fileDTO.getFileName()).isEqualTo(savedFile.getFileName());
        assertThat(fileDTO.getOriginalFileName()).isEqualTo(savedFile.getOriginalFileName());
        assertThat(fileDTO.getMimeType()).isEqualTo(savedFile.getMimeType());
        assertThat(fileDTO.getFileSize()).isEqualTo(savedFile.getFileSize());
        assertThat(fileDTO.getLessonId()).isEqualTo(savedLesson.getId());
        assertThat(fileDTO.getUserProfileId()).isEqualTo(savedProfile.getId());

        // Step 4: Test file upload service
        MockMultipartFile testFile = new MockMultipartFile(
                "file",
                "test-document.pdf",
                "application/pdf",
                "Test file content".getBytes(StandardCharsets.UTF_8));

        FileUploadResponseDTO uploadResponse = fileManagementService.uploadFile(
                testFile,
                savedLesson.getId(),
                savedProfile.getId(),
                "/lessons/documents");

        assertThat(uploadResponse).isNotNull();
        assertThat(uploadResponse.getFileName()).isEqualTo("test-document.pdf");
        assertThat(uploadResponse.getMimeType()).isEqualTo("application/pdf");
        assertThat(uploadResponse.getFileSize()).isEqualTo(testFile.getSize());
        assertThat(uploadResponse.getSuccess()).isTrue();

        // Step 5: Test API layer file metadata consistency
        ResponseEntity<FileMetadataDTO> apiResponse = restTemplate.exchange(
                baseUrl + "/admin/files/" + savedFile.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                FileMetadataDTO.class);

        assertThat(apiResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        FileMetadataDTO apiFile = apiResponse.getBody();
        assertThat(apiFile).isNotNull();
        assertThat(apiFile.getId()).isEqualTo(savedFile.getId());
        assertThat(apiFile.getFileName()).isEqualTo(savedFile.getFileName());
        assertThat(apiFile.getMimeType()).isEqualTo(savedFile.getMimeType());
        assertThat(apiFile.getLessonId()).isEqualTo(savedLesson.getId());
    }

    @Test
    @DisplayName("Test metadata consistency and relationships")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testMetadataConsistencyAndRelationships() {
        // Step 1: Create complete entity chain
        User user = createTestUser();
        User savedUser = userRepository.save(user);

        UserProfile userProfile = createTestUserProfile(savedUser);
        UserProfile savedProfile = userProfileRepository.save(userProfile);

        Course course = createTestCourse();
        Course savedCourse = courseRepository.save(course);

        Lesson lesson = createTestLesson(savedCourse);
        Lesson savedLesson = lessonRepository.save(lesson);

        // Step 2: Create multiple files with different metadata
        FileMetaData imageFile = createTestFileMetaData(savedLesson, savedProfile);
        imageFile.setFileName("lesson-image.jpg");
        imageFile.setOriginalFileName("original-image.jpg");
        imageFile.setMimeType("image/jpeg");
        imageFile.setFolderPath("/lessons/images");
        FileMetaData savedImageFile = fileMetaDataRepository.save(imageFile);

        FileMetaData videoFile = createTestFileMetaData(savedLesson, savedProfile);
        videoFile.setFileName("lesson-video.mp4");
        videoFile.setOriginalFileName("original-video.mp4");
        videoFile.setMimeType("video/mp4");
        videoFile.setFolderPath("/lessons/videos");
        FileMetaData savedVideoFile = fileMetaDataRepository.save(videoFile);

        FileMetaData documentFile = createTestFileMetaData(savedLesson, savedProfile);
        documentFile.setFileName("lesson-document.pdf");
        documentFile.setOriginalFileName("original-document.pdf");
        documentFile.setMimeType("application/pdf");
        documentFile.setFolderPath("/lessons/documents");
        FileMetaData savedDocumentFile = fileMetaDataRepository.save(documentFile);

        // Step 3: Test relationship consistency
        List<FileMetaData> lessonFiles = fileMetaDataRepository.findByLessonId(savedLesson.getId());
        assertThat(lessonFiles).hasSize(3);
        assertThat(lessonFiles).extracting(FileMetaData::getId)
                .containsExactlyInAnyOrder(savedImageFile.getId(), savedVideoFile.getId(), savedDocumentFile.getId());

        List<FileMetaData> userFiles = fileMetaDataRepository.findByUserProfileId(savedProfile.getId());
        assertThat(userFiles).hasSize(3);
        assertThat(userFiles).extracting(FileMetaData::getId)
                .containsExactlyInAnyOrder(savedImageFile.getId(), savedVideoFile.getId(), savedDocumentFile.getId());

        // Step 4: Test service layer metadata operations
        List<FileMetadataDTO> serviceLessonFiles = fileManagementService.getFilesByLesson(savedLesson.getId());
        assertThat(serviceLessonFiles).hasSize(3);

        List<FileMetadataDTO> serviceUserFiles = fileManagementService.getFilesByUser(savedProfile.getId());
        assertThat(serviceUserFiles).hasSize(3);

        // Test folder structure
        FolderStructureDTO folderStructure = fileManagementService.getFolderStructure("/lessons");
        assertThat(folderStructure).isNotNull();
        assertThat(folderStructure.getSubfolders()).hasSize(3); // images, videos, documents
        assertThat(folderStructure.getSubfolders()).extracting(FolderStructureDTO::getName)
                .containsExactlyInAnyOrder("images", "videos", "documents");

        // Step 5: Test API metadata consistency
        ResponseEntity<FileMetadataDTO[]> lessonFilesResponse = restTemplate.exchange(
                baseUrl + "/admin/files/lesson/" + savedLesson.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                FileMetadataDTO[].class);

        assertThat(lessonFilesResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        FileMetadataDTO[] apiLessonFiles = lessonFilesResponse.getBody();
        assertThat(apiLessonFiles).isNotNull();
        assertThat(apiLessonFiles).hasSize(3);

        ResponseEntity<FolderStructureDTO> folderResponse = restTemplate.exchange(
                baseUrl + "/admin/files/folder-structure?path=/lessons",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                FolderStructureDTO.class);

        assertThat(folderResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        FolderStructureDTO apiFolderStructure = folderResponse.getBody();
        assertThat(apiFolderStructure).isNotNull();
        assertThat(apiFolderStructure.getSubfolders()).hasSize(3);
    }

    @Test
    @DisplayName("Test file security and access control")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testFileSecurityAndAccessControl() {
        // Step 1: Create user and file structure
        User user = createTestUser();
        User savedUser = userRepository.save(user);

        UserProfile userProfile = createTestUserProfile(savedUser);
        UserProfile savedProfile = userProfileRepository.save(userProfile);

        Course course = createTestCourse();
        Course savedCourse = courseRepository.save(course);

        Lesson lesson = createTestLesson(savedCourse);
        Lesson savedLesson = lessonRepository.save(lesson);

        FileMetaData secureFile = createTestFileMetaData(savedLesson, savedProfile);
        secureFile.setFileName("secure-document.pdf");
        secureFile.setMimeType("application/pdf");
        FileMetaData savedSecureFile = fileMetaDataRepository.save(secureFile);

        // Step 2: Test file security service
        boolean hasReadAccess = fileSecurityService.hasReadAccess(savedSecureFile.getId(), savedUser.getId());
        assertThat(hasReadAccess).isTrue(); // User should have access to their own files

        boolean hasWriteAccess = fileSecurityService.hasWriteAccess(savedSecureFile.getId(), savedUser.getId());
        assertThat(hasWriteAccess).isTrue(); // User should have write access to their own files

        boolean hasDeleteAccess = fileSecurityService.hasDeleteAccess(savedSecureFile.getId(), savedUser.getId());
        assertThat(hasDeleteAccess).isTrue(); // User should have delete access to their own files

        // Step 3: Test access control with different user
        User otherUser = createTestUser();
        otherUser.setLogin("otheruser" + System.currentTimeMillis());
        otherUser.setEmail("other" + System.currentTimeMillis() + "@example.com");
        User savedOtherUser = userRepository.save(otherUser);

        boolean otherUserReadAccess = fileSecurityService.hasReadAccess(savedSecureFile.getId(),
                savedOtherUser.getId());
        assertThat(otherUserReadAccess).isFalse(); // Other user should not have access

        boolean otherUserWriteAccess = fileSecurityService.hasWriteAccess(savedSecureFile.getId(),
                savedOtherUser.getId());
        assertThat(otherUserWriteAccess).isFalse(); // Other user should not have write access

        // Step 4: Test file checksum validation
        String originalChecksum = savedSecureFile.getChecksum();
        boolean isChecksumValid = fileManagementService.validateFileChecksum(savedSecureFile.getId());
        assertThat(isChecksumValid).isTrue();

        // Step 5: Test file virus scanning (if enabled)
        boolean isFileSafe = fileSecurityService.scanFileForViruses(savedSecureFile.getId());
        assertThat(isFileSafe).isTrue(); // Test file should be safe

        // Step 6: Test API security consistency
        ResponseEntity<FileMetadataDTO> secureResponse = restTemplate.exchange(
                baseUrl + "/admin/files/" + savedSecureFile.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                FileMetadataDTO.class);

        assertThat(secureResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        FileMetadataDTO apiSecureFile = secureResponse.getBody();
        assertThat(apiSecureFile).isNotNull();
        assertThat(apiSecureFile.getId()).isEqualTo(savedSecureFile.getId());

        // Test file download security
        ResponseEntity<ByteArrayResource> downloadResponse = restTemplate.exchange(
                baseUrl + "/admin/files/" + savedSecureFile.getId() + "/download",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                ByteArrayResource.class);

        assertThat(downloadResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(downloadResponse.getBody()).isNotNull();
    }

    @Test
    @DisplayName("Test media processing and file transformations")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testMediaProcessingAndFileTransformations() {
        // Step 1: Create media files for processing
        User user = createTestUser();
        User savedUser = userRepository.save(user);

        UserProfile userProfile = createTestUserProfile(savedUser);
        UserProfile savedProfile = userProfileRepository.save(userProfile);

        Course course = createTestCourse();
        Course savedCourse = courseRepository.save(course);

        Lesson lesson = createTestLesson(savedCourse);
        Lesson savedLesson = lessonRepository.save(lesson);

        // Step 2: Create image file for processing
        FileMetaData imageFile = createTestFileMetaData(savedLesson, savedProfile);
        imageFile.setFileName("lesson-image.jpg");
        imageFile.setMimeType("image/jpeg");
        imageFile.setFileSize(1024000L); // 1MB
        FileMetaData savedImageFile = fileMetaDataRepository.save(imageFile);

        // Step 3: Test image processing
        boolean isImageProcessed = mediaProcessingService.processImage(savedImageFile.getId());
        assertThat(isImageProcessed).isTrue();

        // Verify thumbnail generation
        Optional<FileMetaData> thumbnailFile = fileMetaDataRepository
                .findThumbnailByOriginalFileId(savedImageFile.getId());
        assertThat(thumbnailFile).isPresent();
        assertThat(thumbnailFile.get().getFileName()).contains("thumbnail");
        assertThat(thumbnailFile.get().getMimeType()).isEqualTo("image/jpeg");

        // Step 4: Create video file for processing
        FileMetaData videoFile = createTestFileMetaData(savedLesson, savedProfile);
        videoFile.setFileName("lesson-video.mp4");
        videoFile.setMimeType("video/mp4");
        videoFile.setFileSize(10240000L); // 10MB
        FileMetaData savedVideoFile = fileMetaDataRepository.save(videoFile);

        // Step 5: Test video processing
        boolean isVideoProcessed = mediaProcessingService.processVideo(savedVideoFile.getId());
        assertThat(isVideoProcessed).isTrue();

        // Verify video metadata extraction
        Optional<FileMetaData> processedVideo = fileMetaDataRepository.findById(savedVideoFile.getId());
        assertThat(processedVideo).isPresent();
        assertThat(processedVideo.get().getMetadata()).isNotNull();
        assertThat(processedVideo.get().getMetadata()).contains("duration");

        // Step 6: Test document processing
        FileMetaData documentFile = createTestFileMetaData(savedLesson, savedProfile);
        documentFile.setFileName("lesson-document.pdf");
        documentFile.setMimeType("application/pdf");
        documentFile.setFileSize(512000L); // 512KB
        FileMetaData savedDocumentFile = fileMetaDataRepository.save(documentFile);

        boolean isDocumentProcessed = mediaProcessingService.processDocument(savedDocumentFile.getId());
        assertThat(isDocumentProcessed).isTrue();

        // Step 7: Test API media processing consistency
        ResponseEntity<FileMetadataDTO> processedImageResponse = restTemplate.exchange(
                baseUrl + "/admin/files/" + savedImageFile.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                FileMetadataDTO.class);

        assertThat(processedImageResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        FileMetadataDTO apiProcessedImage = processedImageResponse.getBody();
        assertThat(apiProcessedImage).isNotNull();
        assertThat(apiProcessedImage.getProcessed()).isTrue();

        ResponseEntity<FileMetadataDTO> processedVideoResponse = restTemplate.exchange(
                baseUrl + "/admin/files/" + savedVideoFile.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                FileMetadataDTO.class);

        assertThat(processedVideoResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        FileMetadataDTO apiProcessedVideo = processedVideoResponse.getBody();
        assertThat(apiProcessedVideo).isNotNull();
        assertThat(apiProcessedVideo.getProcessed()).isTrue();
    }

    @Test
    @DisplayName("Test file deletion and cleanup data flow")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testFileDeletionAndCleanupDataFlow() {
        // Step 1: Create file for deletion testing
        User user = createTestUser();
        User savedUser = userRepository.save(user);

        UserProfile userProfile = createTestUserProfile(savedUser);
        UserProfile savedProfile = userProfileRepository.save(userProfile);

        Course course = createTestCourse();
        Course savedCourse = courseRepository.save(course);

        Lesson lesson = createTestLesson(savedCourse);
        Lesson savedLesson = lessonRepository.save(lesson);

        FileMetaData fileToDelete = createTestFileMetaData(savedLesson, savedProfile);
        FileMetaData savedFileToDelete = fileMetaDataRepository.save(fileToDelete);

        // Step 2: Verify file exists
        Optional<FileMetaData> existingFile = fileMetaDataRepository.findById(savedFileToDelete.getId());
        assertThat(existingFile).isPresent();

        // Step 3: Test service layer deletion
        boolean isDeleted = fileManagementService.deleteFile(savedFileToDelete.getId());
        assertThat(isDeleted).isTrue();

        // Step 4: Verify file is marked as deleted (soft delete)
        Optional<FileMetaData> deletedFile = fileMetaDataRepository.findById(savedFileToDelete.getId());
        assertThat(deletedFile).isPresent();
        assertThat(deletedFile.get().getDeleted()).isTrue();
        assertThat(deletedFile.get().getDeletedDate()).isNotNull();

        // Step 5: Test cleanup service
        fileManagementService.cleanupDeletedFiles(Instant.now().minusSeconds(3600)); // Clean files deleted more than 1
                                                                                     // hour ago

        // Step 6: Test API deletion consistency
        ResponseEntity<String> deleteResponse = restTemplate.exchange(
                baseUrl + "/admin/files/" + savedFileToDelete.getId(),
                HttpMethod.DELETE,
                new HttpEntity<>(headers),
                String.class);

        assertThat(deleteResponse.getStatusCode()).isEqualTo(HttpStatus.OK);

        // Verify file is not accessible via API after deletion
        ResponseEntity<FileMetadataDTO> getDeletedResponse = restTemplate.exchange(
                baseUrl + "/admin/files/" + savedFileToDelete.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                FileMetadataDTO.class);

        assertThat(getDeletedResponse.getStatusCode()).isEqualTo(HttpStatus.NOT_FOUND);
    }

    // Helper methods for creating test data
    private FileMetaData createTestFileMetaData(Lesson lesson, UserProfile userProfile) {
        FileMetaData fileMetaData = new FileMetaData();
        fileMetaData.setFileName("test-file-" + System.currentTimeMillis() + ".txt");
        fileMetaData.setOriginalFileName("original-test-file.txt");
        fileMetaData.setFilePath("/uploads/test-file-" + System.currentTimeMillis() + ".txt");
        fileMetaData.setFolderPath("/uploads");
        fileMetaData.setMimeType("text/plain");
        fileMetaData.setFileSize(1024L);
        fileMetaData.setChecksum("abc123def456");
        fileMetaData.setUploadDate(Instant.now());
        fileMetaData.setLesson(lesson);
        fileMetaData.setUserProfile(userProfile);
        fileMetaData.setDeleted(false);
        fileMetaData.setProcessed(false);
        return fileMetaData;
    }

    private User createTestUser() {
        User user = new User();
        user.setLogin("testuser" + System.currentTimeMillis());
        user.setEmail("test" + System.currentTimeMillis() + "@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setActivated(true);
        user.setLangKey("en");
        return user;
    }

    private UserProfile createTestUserProfile(User user) {
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setPhoneNumber("123-456-7890");
        profile.setDateOfBirth(Instant.now().minusSeconds(86400 * 365 * 25)); // 25 years ago
        profile.setAddress("123 Test Street");
        profile.setCity("Test City");
        profile.setCountry("Test Country");
        return profile;
    }

    private Course createTestCourse() {
        Course course = new Course();
        course.setTitle("Test Course " + System.currentTimeMillis());
        course.setDescription("Test course description");
        course.setDifficultyLevel("Beginner");
        course.setEstimatedDuration(40);
        course.setLanguage("Japanese");
        course.setActive(true);
        course.setCreatedDate(Instant.now());
        return course;
    }

    private Lesson createTestLesson(Course course) {
        Lesson lesson = new Lesson();
        lesson.setCourse(course);
        lesson.setTitle("Test Lesson " + System.currentTimeMillis());
        lesson.setContent("Test lesson content");
        lesson.setOrderIndex(1);
        lesson.setDuration(60);
        lesson.setActive(true);
        lesson.setCreatedDate(Instant.now());
        return lesson;
    }
}