package com.satori.platform.service;

import com.satori.platform.domain.FileMetaData;
import com.satori.platform.domain.Lesson;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.repository.FileMetaDataRepository;
import com.satori.platform.repository.LessonRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.security.FileSecurityService;
import com.satori.platform.service.dto.FileMetaDataDTO;
import com.satori.platform.service.exception.FileUploadException;
import com.satori.platform.service.exception.InsufficientPermissionException;
import com.satori.platform.service.mapper.FileMetaDataMapper;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
// Paths import removed; using Path.of instead
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

/**
 * Service for managing file operations including upload, download, and
 * deletion.
 */
@Service
@Transactional
public class FileManagementService {

    private static final Logger log = LoggerFactory.getLogger(FileManagementService.class);

    // Allowed file types
    private static final List<String> ALLOWED_FILE_TYPES = Arrays.asList(
        "pdf",
        "doc",
        "docx",
        "ppt",
        "pptx",
        "xls",
        "xlsx",
        "txt",
        "rtf",
        "jpg",
        "jpeg",
        "png",
        "gif",
        "mp4",
        "avi",
        "mov",
        "mp3",
        "wav",
        "zip",
        "rar"
    );

    // Maximum file size (50MB)
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024;

    private final FileMetaDataRepository fileMetaDataRepository;
    private final LessonRepository lessonRepository;
    private final UserProfileRepository userProfileRepository;
    private final FileMetaDataMapper fileMetaDataMapper;
    private final FileSecurityService fileSecurityService;

    @Value("${application.file-storage.path:uploads}")
    private String fileStoragePath;

    public FileManagementService(
        FileMetaDataRepository fileMetaDataRepository,
        LessonRepository lessonRepository,
        UserProfileRepository userProfileRepository,
        FileMetaDataMapper fileMetaDataMapper,
        FileSecurityService fileSecurityService
    ) {
        this.fileMetaDataRepository = fileMetaDataRepository;
        this.lessonRepository = lessonRepository;
        this.userProfileRepository = userProfileRepository;
        this.fileMetaDataMapper = fileMetaDataMapper;
        this.fileSecurityService = fileSecurityService;
    }

    /**
     * Upload a file for a lesson
     */
    public FileMetaDataDTO uploadLessonFile(MultipartFile file, Long lessonId, Long uploaderId) {
        log.debug("Uploading file {} for lesson {} by user {}", file.getOriginalFilename(), lessonId, uploaderId);

        // Validate file with enhanced security
        FileSecurityService.FileValidationResult validationResult = fileSecurityService.validateFile(file);
        if (!validationResult.isValid()) {
            throw new FileUploadException("File validation failed: " + validationResult.getMessage());
        }

        // Check if lesson exists and user has permission
        Lesson lesson = lessonRepository.findById(lessonId).orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        UserProfile uploader = userProfileRepository.findById(uploaderId).orElseThrow(() -> new IllegalArgumentException("User not found"));

        // Check if user has permission to upload to this lesson
        if (!hasUploadPermission(lesson, uploader)) {
            throw new InsufficientPermissionException("User does not have permission to upload files to this lesson");
        }

        try {
            // Generate secure unique filename
            String originalFilename = file.getOriginalFilename();
            String uniqueFilename = fileSecurityService.generateSecureFilename(originalFilename);
            String fileExtension = getFileExtension(originalFilename);

            // Create storage directory if it doesn't exist
            Path storageDir = Path.of(fileStoragePath, "lessons", lessonId.toString());
            Files.createDirectories(storageDir);

            // Save file to disk
            Path filePath = storageDir.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Calculate checksum
            String checksum = calculateChecksum(file.getInputStream());

            // Check for duplicate files
            Optional<FileMetaData> existingFile = fileMetaDataRepository.findByChecksum(checksum);
            if (existingFile.map(f -> f.getLesson().getId().equals(lessonId)).orElse(false)) {
                // Delete the newly uploaded file since it's a duplicate
                Files.deleteIfExists(filePath);
                throw new FileUploadException("File already exists in this lesson");
            }

            // Create FileMetaData entity
            FileMetaData fileMetadata = new FileMetaData();
            fileMetadata.setFileName(uniqueFilename);
            fileMetadata.setOriginalName(originalFilename);
            fileMetadata.setFilePath(filePath.toString());
            fileMetadata.setFileType(fileExtension.toLowerCase());
            fileMetadata.setFileSize(file.getSize());
            fileMetadata.setMimeType(file.getContentType());
            fileMetadata.setUploadDate(LocalDateTime.now());
            fileMetadata.setVersion(1);
            fileMetadata.setChecksum(checksum);
            fileMetadata.setLesson(lesson);
            fileMetadata.setUploadedBy(uploader);

            FileMetaData savedFile = fileMetaDataRepository.save(fileMetadata);

            log.debug("File uploaded successfully with ID: {}", savedFile.getId());
            return fileMetaDataMapper.toDto(savedFile);
        } catch (IOException e) {
            log.error("Error uploading file", e);
            throw new FileUploadException("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Download a file
     */
    @Transactional(readOnly = true)
    public InputStream downloadFile(Long fileId, Long userId) {
        log.debug("Downloading file {} by user {}", fileId, userId);

        FileMetaData fileMetadata = fileMetaDataRepository
            .findById(fileId)
            .orElseThrow(() -> new IllegalArgumentException("File not found"));

        // Check access permission
        if (!fileMetaDataRepository.hasAccessToFile(fileId, userId)) {
            throw new InsufficientPermissionException("User does not have permission to download this file");
        }

        try {
            Path filePath = Path.of(fileMetadata.getFilePath());
            if (!Files.exists(filePath)) {
                throw new FileUploadException("File not found on disk");
            }

            return Files.newInputStream(filePath);
        } catch (IOException e) {
            log.error("Error downloading file", e);
            throw new FileUploadException("Failed to download file: " + e.getMessage());
        }
    }

    /**
     * Get file metadata
     */
    @Transactional(readOnly = true)
    public FileMetaDataDTO getFileMetadata(Long fileId, Long userId) {
        log.debug("Getting file metadata {} for user {}", fileId, userId);

        FileMetaData fileMetadata = fileMetaDataRepository
            .findById(fileId)
            .orElseThrow(() -> new IllegalArgumentException("File not found"));

        // Check access permission
        if (!fileMetaDataRepository.hasAccessToFile(fileId, userId)) {
            throw new InsufficientPermissionException("User does not have permission to access this file");
        }

        return fileMetaDataMapper.toDto(fileMetadata);
    }

    /**
     * Delete a file
     */
    public void deleteFile(Long fileId, Long userId) {
        log.debug("Deleting file {} by user {}", fileId, userId);

        FileMetaData fileMetadata = fileMetaDataRepository
            .findById(fileId)
            .orElseThrow(() -> new IllegalArgumentException("File not found"));

        // Check if user has permission to delete (must be uploader or teacher of the
        // course)
        if (!hasDeletePermission(fileMetadata, userId)) {
            throw new InsufficientPermissionException("User does not have permission to delete this file");
        }

        try {
            // Delete file from disk
            Path filePath = Path.of(fileMetadata.getFilePath());
            Files.deleteIfExists(filePath);

            // Delete metadata from database
            fileMetaDataRepository.delete(fileMetadata);

            log.debug("File deleted successfully");
        } catch (IOException e) {
            log.error("Error deleting file from disk", e);
            // Still delete from database even if disk deletion fails
            fileMetaDataRepository.delete(fileMetadata);
            throw new FileUploadException("File deleted from database but failed to delete from disk: " + e.getMessage());
        }
    }

    /**
     * Get files for a lesson with access control
     */
    @Transactional(readOnly = true)
    public List<FileMetaDataDTO> getLessonFiles(Long lessonId, Long userId) {
        log.debug("Getting files for lesson {} by user {}", lessonId, userId);

        List<FileMetaData> files = fileMetaDataRepository.findByLessonIdWithAccessControl(lessonId, userId);
        return fileMetaDataMapper.toDto(files);
    }

    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileUploadException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileUploadException("File size exceeds maximum allowed size of " + (MAX_FILE_SIZE / 1024 / 1024) + "MB");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new FileUploadException("File name is required");
        }

        String fileExtension = getFileExtension(originalFilename);
        if (!ALLOWED_FILE_TYPES.contains(fileExtension.toLowerCase())) {
            throw new FileUploadException("File type not allowed. Allowed types: " + String.join(", ", ALLOWED_FILE_TYPES));
        }
    }

    /**
     * Get file extension from filename
     */
    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    /**
     * Calculate file checksum
     */
    private String calculateChecksum(InputStream inputStream) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] buffer = new byte[8192];
            int bytesRead;

            while ((bytesRead = inputStream.read(buffer)) != -1) {
                digest.update(buffer, 0, bytesRead);
            }

            byte[] hashBytes = digest.digest();
            StringBuilder hexString = new StringBuilder();

            for (byte b : hashBytes) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }

            return hexString.toString();
        } catch (NoSuchAlgorithmException | IOException e) {
            log.error("Error calculating checksum", e);
            return null;
        }
    }

    /**
     * Check if user has permission to upload files to a lesson
     */
    private boolean hasUploadPermission(Lesson lesson, UserProfile user) {
        // Teachers can upload to their own courses
        if (lesson.getCourse().getTeacher() != null && lesson.getCourse().getTeacher().getId().equals(user.getId())) {
            return true;
        }

        // Admin users can upload to any lesson (assuming admin role check)
        // This would need to be implemented based on your role system

        return false;
    }

    /**
     * Check if user has permission to delete a file
     */
    private boolean hasDeletePermission(FileMetaData fileMetadata, Long userId) {
        // File uploader can delete their own files
        if (fileMetadata.getUploadedBy().getId().equals(userId)) {
            return true;
        }

        // Teacher of the course can delete any file in their lessons
        if (
            fileMetadata.getLesson().getCourse().getTeacher() != null &&
            fileMetadata.getLesson().getCourse().getTeacher().getId().equals(userId)
        ) {
            return true;
        }

        // Admin users can delete any file (assuming admin role check)
        // This would need to be implemented based on your role system

        return false;
    }
}
