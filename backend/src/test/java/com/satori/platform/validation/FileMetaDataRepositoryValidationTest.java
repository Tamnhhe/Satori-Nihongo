package com.satori.platform.validation;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.Role;
import com.satori.platform.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * Focused validation tests for FileMetaDataRepository.
 * Extracted from SystemAndManagementRepositoryValidationTest for better
 * maintainability.
 * 
 * Requirements: 3.1, 3.2
 */
@ApiValidationTestConfiguration
class FileMetaDataRepositoryValidationTest {

        @Autowired
        private FileMetaDataRepository fileMetaDataRepository;

        @Autowired
        private UserProfileRepository userProfileRepository;

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private LessonRepository lessonRepository;

        private DomainTestDataBuilder testDataBuilder;
        private UserProfile testUserProfile;
        private Course testCourse;
        private Lesson testLesson;
        private FileMetaData testFileMetaData;

        @BeforeEach
        void setUp() {
                testDataBuilder = new DomainTestDataBuilder();
                setupTestData();
        }

        private void setupTestData() {
                testUserProfile = testDataBuilder.createUserProfile("testuser", "test@example.com", Role.HOC_VIEN);
                testUserProfile = userProfileRepository.save(testUserProfile);

                testCourse = testDataBuilder.createCourse("TEST001", "Test Course", testUserProfile);
                testCourse = courseRepository.save(testCourse);

                testLesson = testDataBuilder.createLesson("Test Lesson", "Test Content", testCourse);
                testLesson = lessonRepository.save(testLesson);

                testFileMetaData = testDataBuilder.createFileMetaData(
                                "test-file.pdf", "Test File.pdf", "application/pdf", 1024L, testLesson,
                                testUserProfile);
                testFileMetaData = fileMetaDataRepository.save(testFileMetaData);
        }

        @Test
        void testBasicCrudOperations() {
                // Test save
                FileMetaData newFile = testDataBuilder.createFileMetaData(
                                "new-file.jpg", "New Image.jpg", "image/jpeg", 2048L, testLesson, testUserProfile);

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
        void testCustomQueries() {
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
                boolean hasAccess = fileMetaDataRepository.hasAccessToFile(testFileMetaData.getId(),
                                testUserProfile.getId());
                assertThat(hasAccess).isTrue();

                // Test findByChecksum
                Optional<FileMetaData> fileByChecksum = fileMetaDataRepository
                                .findByChecksum(testFileMetaData.getChecksum());
                assertThat(fileByChecksum).isPresent();
                assertThat(fileByChecksum.get().getFileName()).isEqualTo("test-file.pdf");
        }

        @Test
        void testSearchAndFilterQueries() {
                // Test searchFiles
                List<FileMetaData> searchResults = fileMetaDataRepository.searchFiles(
                                "test", testFileMetaData.getFolderPath(), "application/pdf", testUserProfile.getId());
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
                List<FileMetaData> recentFiles = fileMetaDataRepository.findRecentFilesByUser(testUserProfile.getId(),
                                pageable);
                assertThat(recentFiles).hasSize(1);
                assertThat(recentFiles.get(0).getFileName()).isEqualTo("test-file.pdf");
        }

        @Test
        void testModifyingOperations() {
                // Test incrementDownloadCount
                int initialDownloadCount = testFileMetaData.getDownloadCount();
                fileMetaDataRepository.incrementDownloadCount(testFileMetaData.getId());

                // Refresh entity to get updated values
                Optional<FileMetaData> updatedFile = fileMetaDataRepository.findById(testFileMetaData.getId());
                assertThat(updatedFile).isPresent();
                assertThat(updatedFile.get().getDownloadCount()).isEqualTo(initialDownloadCount + 1);
        }

        @Test
        void testPerformanceWithMultipleFiles() {
                // Create multiple files for performance testing
                List<FileMetaData> files = testDataBuilder.createMultipleFileMetaData(10, testLesson, testUserProfile);

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
        }
}