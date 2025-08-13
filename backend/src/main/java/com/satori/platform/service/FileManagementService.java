package com.satori.platform.service;

import com.satori.platform.domain.FileMetaData;
import com.satori.platform.domain.Lesson;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.repository.FileMetaDataRepository;
import com.satori.platform.repository.LessonRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.security.FileSecurityService;
import com.satori.platform.service.dto.FileMetaDataDTO;
import com.satori.platform.service.dto.FileUploadResponseDTO;
import com.satori.platform.service.dto.FolderStructureDTO;
import com.satori.platform.service.exception.FileUploadException;
import com.satori.platform.service.exception.InsufficientPermissionException;
import com.satori.platform.service.mapper.FileMetaDataMapper;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
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
            "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx",
            "txt", "rtf", "jpg", "jpeg", "png", "gif", "mp4",
            "avi", "mov", "mp3", "wav", "zip", "rar");

    // Maximum file size (50MB)
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024;

    private final FileMetaDataRepository fileMetaDataRepository;
    private final LessonRepository lessonRepository;
    private final UserProfileRepository userProfileRepository;
    private final FileMetaDataMapper fileMetaDataMapper;
    private final FileSecurityService fileSecurityService;
    private final MediaProcessingService mediaProcessingService;

    @Value("${application.file-storage.path:uploads}")
    private String fileStoragePath;

    public FileManagementService(
            FileMetaDataRepository fileMetaDataRepository,
            LessonRepository lessonRepository,
            UserProfileRepository userProfileRepository,
            FileMetaDataMapper fileMetaDataMapper,
            FileSecurityService fileSecurityService,
            MediaProcessingService mediaProcessingService) {
        this.fileMetaDataRepository = fileMetaDataRepository;
        this.lessonRepository = lessonRepository;
        this.userProfileRepository = userProfileRepository;
        this.fileMetaDataMapper = fileMetaDataMapper;
        this.fileSecurityService = fileSecurityService;
        this.mediaProcessingService = mediaProcessingService;
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
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));

        UserProfile uploader = userProfileRepository.findById(uploaderId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

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
            Path storageDir = Paths.get(fileStoragePath, "lessons", lessonId.toString());
            Files.createDirectories(storageDir);

            // Save file to disk
            Path filePath = storageDir.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Calculate checksum
            String checksum = calculateChecksum(file.getInputStream());

            // Check for duplicate files
            Optional<FileMetaData> existingFile = fileMetaDataRepository.findByChecksum(checksum);
            if (existingFile.isPresent() && existingFile.get().getLesson().getId().equals(lessonId)) {
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

        FileMetaData fileMetadata = fileMetaDataRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));

        // Check access permission
        if (!fileMetaDataRepository.hasAccessToFile(fileId, userId)) {
            throw new InsufficientPermissionException("User does not have permission to download this file");
        }

        try {
            Path filePath = Paths.get(fileMetadata.getFilePath());
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

        FileMetaData fileMetadata = fileMetaDataRepository.findById(fileId)
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

        FileMetaData fileMetadata = fileMetaDataRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));

        // Check if user has permission to delete (must be uploader or teacher of the
        // course)
        if (!hasDeletePermission(fileMetadata, userId)) {
            throw new InsufficientPermissionException("User does not have permission to delete this file");
        }

        try {
            // Delete file from disk
            Path filePath = Paths.get(fileMetadata.getFilePath());
            Files.deleteIfExists(filePath);

            // Delete metadata from database
            fileMetaDataRepository.delete(fileMetadata);

            log.debug("File deleted successfully");

        } catch (IOException e) {
            log.error("Error deleting file from disk", e);
            // Still delete from database even if disk deletion fails
            fileMetaDataRepository.delete(fileMetadata);
            throw new FileUploadException(
                    "File deleted from database but failed to delete from disk: " + e.getMessage());
        }
    }

    /**
     * Get files for a lesson with access control
     */
    @Transactional(readOnly = true)
    public List<FileMetaDataDTO> getLessonFiles(Long lessonId, Long userId) {
        log.debug("Getting files for lesson {} by user {}", lessonId, userId);

        List<FileMetaData> files = fileMetaDataRepository.findByLessonIdWithAccessControl(lessonId, userId);
        return files.stream()
                .map(this::convertToFileMetaDataDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Upload file with enhanced metadata and organization
     */
    public FileUploadResponseDTO uploadFileWithMetadata(MultipartFile file, String folder,
            String description, Boolean isPublic, Long userId) {
        log.debug("Uploading file {} to folder {} by user {}", file.getOriginalFilename(), folder, userId);

        try {
            // Validate file with enhanced security
            FileSecurityService.FileValidationResult validationResult = fileSecurityService.validateFile(file);
            if (!validationResult.isValid()) {
                return FileUploadResponseDTO.error("File validation failed: " + validationResult.getMessage());
            }

            UserProfile uploader = userProfileRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found"));

            // Generate secure unique filename
            String originalFilename = file.getOriginalFilename();
            String uniqueFilename = fileSecurityService.generateSecureFilename(originalFilename);
            String fileExtension = getFileExtension(originalFilename);

            // Create storage directory structure
            Path storageDir = Paths.get(fileStoragePath, "files", folder != null ? folder : "general");
            Files.createDirectories(storageDir);

            // Save file to disk
            Path filePath = storageDir.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Calculate checksum
            String checksum = calculateChecksum(file.getInputStream());

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
            fileMetadata.setUploadedBy(uploader);

            FileMetaData savedFile = fileMetaDataRepository.save(fileMetadata);

            String fileUrl = "/api/files/" + savedFile.getId() + "/download";

            log.debug("File uploaded successfully with ID: {}", savedFile.getId());
            return FileUploadResponseDTO.success(
                    savedFile.getId().toString(),
                    originalFilename,
                    fileUrl,
                    file.getSize(),
                    file.getContentType());

        } catch (IOException e) {
            log.error("Error uploading file", e);
            return FileUploadResponseDTO.error("Failed to upload file: " + e.getMessage());
        }
    }

    /**
     * Get folder structure with files
     */
    @Transactional(readOnly = true)
    public FolderStructureDTO getFolderStructure(String rootPath, Long userId) {
        log.debug("Getting folder structure for path {} by user {}", rootPath, userId);

        try {
            Path basePath = Paths.get(fileStoragePath, "files");
            Path targetPath = rootPath != null ? basePath.resolve(rootPath) : basePath;

            if (!Files.exists(targetPath)) {
                Files.createDirectories(targetPath);
            }

            return buildFolderStructure(targetPath, basePath, userId);

        } catch (IOException e) {
            log.error("Error getting folder structure", e);
            throw new FileUploadException("Failed to get folder structure: " + e.getMessage());
        }
    }

    /**
     * Search files by name and metadata
     */
    @Transactional(readOnly = true)
    public List<FileMetaDataDTO> searchFiles(String query, String folder, String mimeType, Long userId) {
        log.debug("Searching files with query {} in folder {} by user {}", query, folder, userId);

        List<FileMetaData> files = fileMetaDataRepository.searchFiles(query, folder, mimeType, userId);
        return files.stream()
                .map(this::convertToFileMetaDataDTO)
                .collect(java.util.stream.Collectors.toList());
    }

    /**
     * Update file metadata
     */
    public FileMetaDataDTO updateFileMetadata(String fileId, String description, String folder, Boolean isPublic,
            Long userId) {
        log.debug("Updating metadata for file {} by user {}", fileId, userId);

        FileMetaData fileMetadata = fileMetaDataRepository.findById(Long.parseLong(fileId))
                .orElseThrow(() -> new IllegalArgumentException("File not found"));

        // Check permission
        if (!hasUpdatePermission(fileMetadata, userId)) {
            throw new InsufficientPermissionException("User does not have permission to update this file");
        }

        // Update metadata
        // Note: In a real implementation, you'd need to add these fields to the
        // FileMetaData entity

        FileMetaData savedFile = fileMetaDataRepository.save(fileMetadata);
        return convertToFileMetaDataDTO(savedFile);
    }

    /**
     * Get file preview information
     */
    @Transactional(readOnly = true)
    public FileMetaDataDTO getFilePreview(String fileId, Long userId) {
        log.debug("Getting file preview for {} by user {}", fileId, userId);

        FileMetaData fileMetadata = fileMetaDataRepository.findById(Long.parseLong(fileId))
                .orElseThrow(() -> new IllegalArgumentException("File not found"));

        // Check access permission
        if (!fileMetaDataRepository.hasAccessToFile(Long.parseLong(fileId), userId)) {
            throw new InsufficientPermissionException("User does not have permission to preview this file");
        }

        return convertToFileMetaDataDTO(fileMetadata);
    }

    /**
     * Create folder
     */
    public void createFolder(String folderPath, Long userId) {
        log.debug("Creating folder {} by user {}", folderPath, userId);

        try {
            Path targetPath = Paths.get(fileStoragePath, "files", folderPath);
            Files.createDirectories(targetPath);

            log.debug("Folder created successfully: {}", folderPath);
        } catch (IOException e) {
            log.error("Error creating folder", e);
            throw new FileUploadException("Failed to create folder: " + e.getMessage());
        }
    }

    /**
     * Delete folder and its contents
     */
    public void deleteFolder(String folderPath, Long userId) {
        log.debug("Deleting folder {} by user {}", folderPath, userId);

        try {
            Path targetPath = Paths.get(fileStoragePath, "files", folderPath);

            if (Files.exists(targetPath)) {
                // Delete all files in database that belong to this folder
                List<FileMetaData> folderFiles = fileMetaDataRepository.findByFolderPath(folderPath);
                for (FileMetaData file : folderFiles) {
                    if (hasDeletePermission(file, userId)) {
                        fileMetaDataRepository.delete(file);
                    }
                }

                // Delete folder from filesystem
                Files.walk(targetPath)
                        .sorted(java.util.Comparator.reverseOrder())
                        .map(Path::toFile)
                        .forEach(java.io.File::delete);
            }

            log.debug("Folder deleted successfully: {}", folderPath);
        } catch (IOException e) {
            log.error("Error deleting folder", e);
            throw new FileUploadException("Failed to delete folder: " + e.getMessage());
        }
    }

    // Helper methods
    private FolderStructureDTO buildFolderStructure(Path currentPath, Path basePath, Long userId) throws IOException {
        String relativePath = basePath.relativize(currentPath).toString().replace("\\", "/");
        String folderName = currentPath.getFileName() != null ? currentPath.getFileName().toString() : "files";

        FolderStructureDTO folder = FolderStructureDTO.createFolder(folderName, relativePath);

        if (Files.exists(currentPath)) {
            Files.list(currentPath).forEach(path -> {
                try {
                    if (Files.isDirectory(path)) {
                        folder.addChild(buildFolderStructure(path, basePath, userId));
                    } else {
                        // Find file metadata in database
                        String fileName = path.getFileName().toString();
                        Optional<FileMetaData> fileMetadata = fileMetaDataRepository.findByFileName(fileName);

                        if (fileMetadata.isPresent()
                                && fileMetaDataRepository.hasAccessToFile(fileMetadata.get().getId(), userId)) {
                            FileMetaDataDTO metadata = convertToFileMetaDataDTO(fileMetadata.get());
                            folder.addChild(FolderStructureDTO.createFile(fileName, path.toString(), metadata));
                        }
                    }
                } catch (IOException e) {
                    log.warn("Error processing path: {}", path, e);
                }
            });
        }

        return folder;
    }

    private FileMetaDataDTO convertToFileMetaDataDTO(FileMetaData fileMetaData) {
        FileMetaDataDTO dto = new FileMetaDataDTO();
        dto.setId(fileMetaData.getId().toString());
        dto.setFileName(fileMetaData.getFileName());
        dto.setOriginalFileName(fileMetaData.getOriginalName());
        dto.setFilePath(fileMetaData.getFilePath());
        dto.setMimeType(fileMetaData.getMimeType());
        dto.setFileSize(fileMetaData.getFileSize());
        dto.setUploadedBy(fileMetaData.getUploadedBy().getFullName());
        dto.setUploadedDate(fileMetaData.getUploadDate().atZone(java.time.ZoneId.systemDefault()).toInstant());
        dto.setDownloadCount(0); // Default value, would need to be tracked separately
        return dto;
    }

    private boolean hasUpdatePermission(FileMetaData fileMetadata, Long userId) {
        // File uploader can update their own files
        if (fileMetadata.getUploadedBy().getId().equals(userId)) {
            return true;
        }

        // Admin users can update any file
        // This would need to be implemented based on your role system
        return false;
    }

    /**
     * Validate uploaded file
     */
    private void validateFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new FileUploadException("File is empty");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new FileUploadException(
                    "File size exceeds maximum allowed size of " + (MAX_FILE_SIZE / 1024 / 1024) + "MB");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            throw new FileUploadException("File name is required");
        }

        String fileExtension = getFileExtension(originalFilename);
        if (!ALLOWED_FILE_TYPES.contains(fileExtension.toLowerCase())) {
            throw new FileUploadException(
                    "File type not allowed. Allowed types: " + String.join(", ", ALLOWED_FILE_TYPES));
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
        if (lesson.getCourse().getTeacher() != null &&
                lesson.getCourse().getTeacher().getId().equals(user.getId())) {
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
        if (fileMetadata.getLesson().getCourse().getTeacher() != null &&
                fileMetadata.getLesson().getCourse().getTeacher().getId().equals(userId)) {
            return true;
        }

        // Admin users can delete any file (assuming admin role check)
        // This would need to be implemented based on your role system

        return false;
    }

    /**
     * Get thumbnail for a file
     */
    @Transactional(readOnly = true)
    public InputStream getFileThumbnail(Long fileId, Long userId) {
        log.debug("Getting thumbnail for file {} by user {}", fileId, userId);

        FileMetaData fileMetadata = fileMetaDataRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));

        // Check access permission
        if (!fileMetaDataRepository.hasAccessToFile(fileId, userId)) {
            throw new InsufficientPermissionException("User does not have permission to access this file");
        }

        try {
            // Look for thumbnail file
            String originalPath = fileMetadata.getFilePath();
            String thumbnailPath = originalPath.replace("." + getFileExtension(originalPath), "_thumb.png");

            Path thumbPath = Paths.get(thumbnailPath);
            if (Files.exists(thumbPath)) {
                return Files.newInputStream(thumbPath);
            }

            // If no thumbnail exists, return null (caller should handle this)
            return null;

        } catch (IOException e) {
            log.error("Error getting file thumbnail", e);
            throw new FileUploadException("Failed to get file thumbnail: " + e.getMessage());
        }
    }

    /**
     * Optimize existing image file
     */
    public ProcessingResult optimizeExistingImage(Long fileId, Long userId) {
        log.debug("Optimizing existing image file {} by user {}", fileId, userId);

        FileMetaData fileMetadata = fileMetaDataRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("File not found"));

        // Check permission
        if (!hasUpdatePermission(fileMetadata, userId)) {
            throw new InsufficientPermissionException("User does not have permission to optimize this file");
        }

        if (!isImageFile(fileMetadata.getMimeType())) {
            throw new IllegalArgumentException("File is not an image");
        }

        try {
            Path originalPath = Paths.get(fileMetadata.getFilePath());
            String optimizedPath = originalPath.toString().replace("." + fileMetadata.getFileType(),
                    "_optimized." + fileMetadata.getFileType());

            // Use MediaProcessingService to convert to web format
            MediaProcessingService.ProcessingResult result = mediaProcessingService.convertToWebFormat(
                    originalPath.toString(), optimizedPath);

            if (result.isSuccess()) {
                // Update file metadata
                fileMetadata.setFileSize(result.getFileSize());
                fileMetadata.setFilePath(result.getOriginalPath());
                fileMetaDataRepository.save(fileMetadata);

                log.debug("Image optimized successfully: {}", fileMetadata.getOriginalName());
                return ProcessingResult.success("Image optimized successfully");
            } else {
                return ProcessingResult.error(result.getMessage());
            }

        } catch (Exception e) {
            log.error("Error optimizing image", e);
            return ProcessingResult.error("Failed to optimize image: " + e.getMessage());
        }
    }

    // Helper methods for media processing
    private boolean isImageFile(String mimeType) {
        return mimeType != null && mimeType.startsWith("image/");
    }

    private boolean isVideoFile(String mimeType) {
        return mimeType != null && mimeType.startsWith("video/");
    }

    private boolean isAudioFile(String mimeType) {
        return mimeType != null && mimeType.startsWith("audio/");
    }

    // Processing result class
    public static class ProcessingResult {
        private final boolean success;
        private final String message;

        private ProcessingResult(boolean success, String message) {
            this.success = success;
            this.message = message;
        }

        public static ProcessingResult success(String message) {
            return new ProcessingResult(true, message);
        }

        public static ProcessingResult error(String message) {
            return new ProcessingResult(false, message);
        }

        public boolean isSuccess() { return success; }
        public String getMessage() { return message; }
    }
}