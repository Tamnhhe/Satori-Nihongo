package com.satori.platform.security;

import com.satori.platform.service.exception.FileUploadException;
import org.apache.commons.io.FilenameUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service for file security validation and scanning.
 */
@Service
public class FileSecurityService {

    private static final Logger log = LoggerFactory.getLogger(FileSecurityService.class);

    // Allowed file extensions
    private static final List<String> ALLOWED_EXTENSIONS = Arrays.asList(
            "pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx",
            "jpg", "jpeg", "png", "gif", "bmp", "svg",
            "mp4", "avi", "mov", "wmv", "flv", "webm",
            "mp3", "wav", "ogg", "m4a",
            "txt", "rtf", "csv", "zip", "rar", "7z");

    // File type signatures (magic numbers)
    private static final Map<String, byte[]> FILE_SIGNATURES = new HashMap<>();

    static {
        FILE_SIGNATURES.put("pdf", new byte[] { 0x25, 0x50, 0x44, 0x46 }); // %PDF
        FILE_SIGNATURES.put("jpg", new byte[] { (byte) 0xFF, (byte) 0xD8, (byte) 0xFF });
        FILE_SIGNATURES.put("png", new byte[] { (byte) 0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A });
        FILE_SIGNATURES.put("gif", new byte[] { 0x47, 0x49, 0x46, 0x38 }); // GIF8
        FILE_SIGNATURES.put("zip", new byte[] { 0x50, 0x4B, 0x03, 0x04 }); // PK..
        FILE_SIGNATURES.put("docx", new byte[] { 0x50, 0x4B, 0x03, 0x04 }); // DOCX is ZIP-based
        FILE_SIGNATURES.put("xlsx", new byte[] { 0x50, 0x4B, 0x03, 0x04 }); // XLSX is ZIP-based
        FILE_SIGNATURES.put("pptx", new byte[] { 0x50, 0x4B, 0x03, 0x04 }); // PPTX is ZIP-based
    }

    // Dangerous file patterns
    private static final List<String> DANGEROUS_PATTERNS = Arrays.asList(
            "exe", "bat", "cmd", "com", "pif", "scr", "vbs", "js", "jar", "app", "deb", "pkg", "dmg",
            "php", "asp", "aspx", "jsp", "py", "rb", "pl", "sh", "ps1");

    // Maximum file sizes (in bytes)
    private static final long MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    private static final long MAX_DOCUMENT_SIZE = 50 * 1024 * 1024; // 50MB
    private static final long MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB
    private static final long MAX_AUDIO_SIZE = 100 * 1024 * 1024; // 100MB
    private static final long MAX_ARCHIVE_SIZE = 100 * 1024 * 1024; // 100MB

    private final InputSanitizer inputSanitizer;

    public FileSecurityService(InputSanitizer inputSanitizer) {
        this.inputSanitizer = inputSanitizer;
    }

    /**
     * Validates a file upload for security compliance.
     */
    public FileValidationResult validateFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return new FileValidationResult(false, "File is empty or null");
        }

        try {
            // Validate filename
            String originalFilename = file.getOriginalFilename();
            if (!isValidFilename(originalFilename)) {
                return new FileValidationResult(false, "Invalid filename");
            }

            // Validate file extension
            String extension = FilenameUtils.getExtension(originalFilename).toLowerCase();
            if (!isAllowedExtension(extension)) {
                return new FileValidationResult(false, "File type not allowed: " + extension);
            }

            // Validate file size
            if (!isValidFileSize(file.getSize(), extension)) {
                return new FileValidationResult(false, "File size exceeds limit for type: " + extension);
            }

            // Validate file content (magic number check)
            if (!isValidFileContent(file, extension)) {
                return new FileValidationResult(false, "File content does not match extension");
            }

            // Scan for malicious content
            if (containsMaliciousContent(file)) {
                return new FileValidationResult(false, "File contains potentially malicious content");
            }

            return new FileValidationResult(true, "File validation passed");

        } catch (Exception e) {
            log.error("Error validating file: {}", file.getOriginalFilename(), e);
            return new FileValidationResult(false, "File validation failed: " + e.getMessage());
        }
    }

    /**
     * Validates filename for security issues.
     */
    private boolean isValidFilename(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            return false;
        }

        // Check for path traversal attempts
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            return false;
        }

        // Check for dangerous extensions in filename
        String lowerFilename = filename.toLowerCase();
        for (String dangerous : DANGEROUS_PATTERNS) {
            if (lowerFilename.endsWith("." + dangerous)) {
                return false;
            }
        }

        // Check for null bytes and control characters
        for (char c : filename.toCharArray()) {
            if (c < 32 || c == 127) {
                return false;
            }
        }

        return filename.length() <= 255; // Filesystem limit
    }

    /**
     * Checks if file extension is allowed.
     */
    private boolean isAllowedExtension(String extension) {
        return ALLOWED_EXTENSIONS.contains(extension.toLowerCase());
    }

    /**
     * Validates file size based on type.
     */
    private boolean isValidFileSize(long size, String extension) {
        String ext = extension.toLowerCase();

        if (Arrays.asList("jpg", "jpeg", "png", "gif", "bmp", "svg").contains(ext)) {
            return size <= MAX_IMAGE_SIZE;
        }

        if (Arrays.asList("pdf", "doc", "docx", "ppt", "pptx", "xls", "xlsx", "txt", "rtf", "csv").contains(ext)) {
            return size <= MAX_DOCUMENT_SIZE;
        }

        if (Arrays.asList("mp4", "avi", "mov", "wmv", "flv", "webm").contains(ext)) {
            return size <= MAX_VIDEO_SIZE;
        }

        if (Arrays.asList("mp3", "wav", "ogg", "m4a").contains(ext)) {
            return size <= MAX_AUDIO_SIZE;
        }

        if (Arrays.asList("zip", "rar", "7z").contains(ext)) {
            return size <= MAX_ARCHIVE_SIZE;
        }

        return size <= MAX_DOCUMENT_SIZE; // Default limit
    }

    /**
     * Validates file content using magic numbers.
     */
    private boolean isValidFileContent(MultipartFile file, String extension) {
        try (InputStream inputStream = file.getInputStream()) {
            byte[] signature = FILE_SIGNATURES.get(extension.toLowerCase());
            if (signature == null) {
                return true; // No signature check available, assume valid
            }

            byte[] fileHeader = new byte[signature.length];
            int bytesRead = inputStream.read(fileHeader);

            if (bytesRead < signature.length) {
                return false;
            }

            return Arrays.equals(signature, fileHeader);

        } catch (IOException e) {
            log.error("Error reading file content for validation", e);
            return false;
        }
    }

    /**
     * Scans file for malicious content patterns.
     */
    private boolean containsMaliciousContent(MultipartFile file) {
        try (InputStream inputStream = file.getInputStream()) {
            // Read first 8KB for content analysis
            byte[] buffer = new byte[8192];
            int bytesRead = inputStream.read(buffer);

            if (bytesRead > 0) {
                String content = new String(buffer, 0, bytesRead).toLowerCase();

                // Check for script injection patterns
                String[] maliciousPatterns = {
                        "<script", "javascript:", "vbscript:", "onload=", "onerror=", "onclick=",
                        "eval(", "document.cookie", "window.location", "document.write",
                        "<?php", "<%", "#!/bin/", "powershell", "cmd.exe"
                };

                for (String pattern : maliciousPatterns) {
                    if (content.contains(pattern)) {
                        log.warn("Malicious pattern detected in file: {}", pattern);
                        return true;
                    }
                }
            }

            return false;

        } catch (IOException e) {
            log.error("Error scanning file for malicious content", e);
            return true; // Err on the side of caution
        }
    }

    /**
     * Sanitizes filename for safe storage.
     */
    public String sanitizeFilename(String filename) {
        return inputSanitizer.sanitizeFilename(filename);
    }

    /**
     * Generates a secure filename with timestamp.
     */
    public String generateSecureFilename(String originalFilename) {
        String sanitized = sanitizeFilename(originalFilename);
        String extension = FilenameUtils.getExtension(sanitized);
        String baseName = FilenameUtils.getBaseName(sanitized);

        // Limit base name length
        if (baseName.length() > 50) {
            baseName = baseName.substring(0, 50);
        }

        long timestamp = System.currentTimeMillis();
        return baseName + "_" + timestamp + "." + extension;
    }

    /**
     * Result of file validation.
     */
    public static class FileValidationResult {
        private final boolean valid;
        private final String message;

        public FileValidationResult(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }
    }
}