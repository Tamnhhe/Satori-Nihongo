package com.satori.platform.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/**
 * Service for file security operations including validation and secure filename
 * generation.
 */
@Service
public class FileSecurityService {

    private static final Logger log = LoggerFactory.getLogger(FileSecurityService.class);

    // Allowed file types
    private static final List<String> ALLOWED_FILE_TYPES = Arrays.asList(
            "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx",
            "txt", "rtf", "jpg", "jpeg", "png", "gif", "mp4",
            "avi", "mov", "mp3", "wav", "zip", "rar");

    // Maximum file size (50MB)
    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024;

    // Dangerous file extensions that should never be allowed
    private static final List<String> DANGEROUS_EXTENSIONS = Arrays.asList(
            "exe", "bat", "cmd", "com", "pif", "scr", "vbs", "js", "jar", "sh");

    // MIME types that are considered safe
    private static final List<String> SAFE_MIME_TYPES = Arrays.asList(
            "image/jpeg", "image/png", "image/gif", "image/bmp", "image/webp",
            "video/mp4", "video/avi", "video/mov", "video/wmv", "video/flv",
            "audio/mp3", "audio/wav", "audio/ogg", "audio/m4a",
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/plain", "text/csv",
            "application/zip", "application/x-rar-compressed");

    /**
     * Validate uploaded file for security and compliance
     */
    public FileValidationResult validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return FileValidationResult.invalid("File is empty or null");
        }

        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            return FileValidationResult.invalid(
                    "File size exceeds maximum allowed size of " + (MAX_FILE_SIZE / 1024 / 1024) + "MB");
        }

        String originalFilename = file.getOriginalFilename();
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            return FileValidationResult.invalid("File name is required");
        }

        // Check for dangerous file extensions
        String fileExtension = getFileExtension(originalFilename).toLowerCase();
        if (DANGEROUS_EXTENSIONS.contains(fileExtension)) {
            return FileValidationResult.invalid("File type is not allowed for security reasons");
        }

        // Check allowed file types
        if (!ALLOWED_FILE_TYPES.contains(fileExtension)) {
            return FileValidationResult.invalid(
                    "File type not allowed. Allowed types: " + String.join(", ", ALLOWED_FILE_TYPES));
        }

        // Check MIME type
        String mimeType = file.getContentType();
        if (mimeType != null && !SAFE_MIME_TYPES.contains(mimeType)) {
            log.warn("Potentially unsafe MIME type detected: {} for file: {}", mimeType, originalFilename);
            // Don't reject, but log for monitoring
        }

        // Check for null bytes in filename (potential security issue)
        if (originalFilename.contains("\0")) {
            return FileValidationResult.invalid("Invalid characters in filename");
        }

        // Check filename length
        if (originalFilename.length() > 255) {
            return FileValidationResult.invalid("Filename is too long (max 255 characters)");
        }

        // Basic content validation
        try {
            if (!isValidFileContent(file)) {
                return FileValidationResult.invalid("File content validation failed");
            }
        } catch (IOException e) {
            log.error("Error validating file content", e);
            return FileValidationResult.invalid("Error validating file content");
        }

        return FileValidationResult.valid();
    }

    /**
     * Generate a secure filename to prevent path traversal and other attacks
     */
    public String generateSecureFilename(String originalFilename) {
        if (originalFilename == null || originalFilename.trim().isEmpty()) {
            return UUID.randomUUID().toString();
        }

        // Remove path separators and other dangerous characters
        String sanitized = originalFilename.replaceAll("[^a-zA-Z0-9._-]", "_");

        // Ensure filename doesn't start with a dot (hidden files)
        if (sanitized.startsWith(".")) {
            sanitized = "file_" + sanitized;
        }

        // Add UUID prefix to ensure uniqueness and prevent conflicts
        String fileExtension = getFileExtension(originalFilename);
        String baseName = sanitized.substring(0,
                sanitized.lastIndexOf('.') >= 0 ? sanitized.lastIndexOf('.') : sanitized.length());

        return UUID.randomUUID().toString() + "_" + baseName +
                (fileExtension.isEmpty() ? "" : "." + fileExtension);
    }

    /**
     * Calculate SHA-256 hash of file content
     */
    public String calculateFileHash(InputStream inputStream) {
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
            log.error("Error calculating file hash", e);
            return null;
        }
    }

    /**
     * Basic content validation to detect potentially malicious files
     */
    private boolean isValidFileContent(MultipartFile file) throws IOException {
        // Check for executable signatures in the first few bytes
        byte[] header = new byte[Math.min(1024, (int) file.getSize())];
        try (InputStream is = file.getInputStream()) {
            int bytesRead = is.read(header);

            // Check for common executable signatures
            if (bytesRead >= 2) {
                // DOS/Windows executable (MZ header)
                if (header[0] == 0x4D && header[1] == 0x5A) {
                    return false;
                }

                // ELF executable
                if (header[0] == 0x7F && header[1] == 0x45 &&
                        header[2] == 0x4C && header[3] == 0x46) {
                    return false;
                }
            }

            // Check for script signatures
            String headerString = new String(header, 0, Math.min(100, bytesRead));
            if (headerString.startsWith("#!/") ||
                    headerString.contains("<?php") ||
                    headerString.contains("<script")) {
                return false;
            }
        }

        return true;
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
     * Result class for file validation
     */
    public static class FileValidationResult {
        private final boolean valid;
        private final String message;

        private FileValidationResult(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public static FileValidationResult valid() {
            return new FileValidationResult(true, "File is valid");
        }

        public static FileValidationResult invalid(String message) {
            return new FileValidationResult(false, message);
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }
    }
}