package com.satori.platform.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Arrays;
import java.util.List;

/**
 * Service for media processing including image optimization, video thumbnail
 * generation,
 * and file format conversion.
 */
@Service
public class MediaProcessingService {

    private static final Logger log = LoggerFactory.getLogger(MediaProcessingService.class);

    @Value("${application.file-storage.path:uploads}")
    private String fileStoragePath;

    // Supported image formats for processing
    private static final List<String> SUPPORTED_IMAGE_FORMATS = Arrays.asList(
            "jpg", "jpeg", "png", "gif", "bmp", "webp");

    // Supported video formats for thumbnail generation
    private static final List<String> SUPPORTED_VIDEO_FORMATS = Arrays.asList(
            "mp4", "avi", "mov", "wmv", "flv", "mkv");

    // Image optimization settings
    private static final int MAX_IMAGE_WIDTH = 1920;
    private static final int MAX_IMAGE_HEIGHT = 1080;
    private static final int THUMBNAIL_SIZE = 300;
    private static final float JPEG_QUALITY = 0.85f;

    /**
     * Process and optimize an image file
     */
    public ProcessingResult processImage(MultipartFile file, String outputPath) {
        log.debug("Processing image: {}", file.getOriginalFilename());

        try {
            String fileExtension = getFileExtension(file.getOriginalFilename()).toLowerCase();

            if (!SUPPORTED_IMAGE_FORMATS.contains(fileExtension)) {
                return ProcessingResult.error("Unsupported image format: " + fileExtension);
            }

            BufferedImage originalImage = ImageIO.read(file.getInputStream());
            if (originalImage == null) {
                return ProcessingResult.error("Unable to read image file");
            }

            // Create optimized version
            BufferedImage optimizedImage = optimizeImage(originalImage);

            // Create thumbnail
            BufferedImage thumbnail = createThumbnail(originalImage, THUMBNAIL_SIZE);

            // Save optimized image
            Path optimizedPath = Paths.get(outputPath);
            Files.createDirectories(optimizedPath.getParent());

            String outputFormat = fileExtension.equals("jpg") || fileExtension.equals("jpeg") ? "jpg" : "png";
            ImageIO.write(optimizedImage, outputFormat, optimizedPath.toFile());

            // Save thumbnail
            Path thumbnailPath = Paths.get(outputPath.replace("." + fileExtension, "_thumb." + outputFormat));
            ImageIO.write(thumbnail, outputFormat, thumbnailPath.toFile());

            return ProcessingResult.success(
                    optimizedPath.toString(),
                    thumbnailPath.toString(),
                    Files.size(optimizedPath));

        } catch (IOException e) {
            log.error("Error processing image", e);
            return ProcessingResult.error("Error processing image: " + e.getMessage());
        }
    }

    /**
     * Generate thumbnail for video file
     */
    public ProcessingResult generateVideoThumbnail(String videoPath, String thumbnailPath) {
        log.debug("Generating video thumbnail for: {}", videoPath);

        try {
            String fileExtension = getFileExtension(videoPath).toLowerCase();

            if (!SUPPORTED_VIDEO_FORMATS.contains(fileExtension)) {
                return ProcessingResult.error("Unsupported video format: " + fileExtension);
            }

            // For this implementation, we'll create a placeholder thumbnail
            // In a production environment, you would use FFmpeg or similar tool
            BufferedImage placeholder = createVideoPlaceholder();

            Path thumbPath = Paths.get(thumbnailPath);
            Files.createDirectories(thumbPath.getParent());

            ImageIO.write(placeholder, "png", thumbPath.toFile());

            return ProcessingResult.success(
                    videoPath,
                    thumbnailPath,
                    Files.size(thumbPath));

        } catch (IOException e) {
            log.error("Error generating video thumbnail", e);
            return ProcessingResult.error("Error generating video thumbnail: " + e.getMessage());
        }
    }

    /**
     * Validate file content and scan for potential security issues
     */
    public ValidationResult validateAndScanFile(MultipartFile file) {
        log.debug("Validating and scanning file: {}", file.getOriginalFilename());

        try {
            // Basic file header validation
            byte[] header = new byte[Math.min(1024, (int) file.getSize())];
            try (InputStream is = file.getInputStream()) {
                int bytesRead = is.read(header);

                // Check for executable signatures
                if (containsExecutableSignature(header, bytesRead)) {
                    return ValidationResult.invalid("File contains executable code");
                }

                // Check for script content
                if (containsScriptContent(header, bytesRead)) {
                    return ValidationResult.invalid("File contains script content");
                }

                // Validate image files
                String fileExtension = getFileExtension(file.getOriginalFilename()).toLowerCase();
                if (SUPPORTED_IMAGE_FORMATS.contains(fileExtension)) {
                    if (!isValidImageFile(file)) {
                        return ValidationResult.invalid("Invalid or corrupted image file");
                    }
                }
            }

            // Check file size consistency
            if (file.getSize() <= 0) {
                return ValidationResult.invalid("File is empty");
            }

            // Additional security checks
            if (containsSuspiciousContent(file)) {
                return ValidationResult.invalid("File contains suspicious content");
            }

            return ValidationResult.valid();

        } catch (IOException e) {
            log.error("Error validating file", e);
            return ValidationResult.invalid("Error validating file: " + e.getMessage());
        }
    }

    /**
     * Convert image to web-optimized format
     */
    public ProcessingResult convertToWebFormat(String inputPath, String outputPath) {
        log.debug("Converting image to web format: {}", inputPath);

        try {
            BufferedImage image = ImageIO.read(new File(inputPath));
            if (image == null) {
                return ProcessingResult.error("Unable to read image file");
            }

            // Convert to RGB if necessary (removes alpha channel for JPEG)
            BufferedImage rgbImage = new BufferedImage(
                    image.getWidth(), image.getHeight(), BufferedImage.TYPE_INT_RGB);
            Graphics2D g = rgbImage.createGraphics();
            g.setColor(Color.WHITE);
            g.fillRect(0, 0, image.getWidth(), image.getHeight());
            g.drawImage(image, 0, 0, null);
            g.dispose();

            // Save as JPEG with optimization
            Path output = Paths.get(outputPath);
            Files.createDirectories(output.getParent());
            ImageIO.write(rgbImage, "jpg", output.toFile());

            return ProcessingResult.success(
                    inputPath,
                    outputPath,
                    Files.size(output));

        } catch (IOException e) {
            log.error("Error converting image to web format", e);
            return ProcessingResult.error("Error converting image: " + e.getMessage());
        }
    }

    // Helper methods

    private BufferedImage optimizeImage(BufferedImage original) {
        int width = original.getWidth();
        int height = original.getHeight();

        // Calculate new dimensions if image is too large
        if (width > MAX_IMAGE_WIDTH || height > MAX_IMAGE_HEIGHT) {
            double widthRatio = (double) MAX_IMAGE_WIDTH / width;
            double heightRatio = (double) MAX_IMAGE_HEIGHT / height;
            double ratio = Math.min(widthRatio, heightRatio);

            width = (int) (width * ratio);
            height = (int) (height * ratio);
        }

        // Create optimized image
        BufferedImage optimized = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = optimized.createGraphics();

        // Enable high-quality rendering
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        g.drawImage(original, 0, 0, width, height, null);
        g.dispose();

        return optimized;
    }

    private BufferedImage createThumbnail(BufferedImage original, int size) {
        int width = original.getWidth();
        int height = original.getHeight();

        // Calculate thumbnail dimensions (square crop from center)
        int cropSize = Math.min(width, height);
        int x = (width - cropSize) / 2;
        int y = (height - cropSize) / 2;

        // Crop to square
        BufferedImage cropped = original.getSubimage(x, y, cropSize, cropSize);

        // Resize to thumbnail size
        BufferedImage thumbnail = new BufferedImage(size, size, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = thumbnail.createGraphics();
        g.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g.drawImage(cropped, 0, 0, size, size, null);
        g.dispose();

        return thumbnail;
    }

    private BufferedImage createVideoPlaceholder() {
        BufferedImage placeholder = new BufferedImage(THUMBNAIL_SIZE, THUMBNAIL_SIZE, BufferedImage.TYPE_INT_RGB);
        Graphics2D g = placeholder.createGraphics();

        // Create gradient background
        GradientPaint gradient = new GradientPaint(
                0, 0, new Color(64, 64, 64),
                THUMBNAIL_SIZE, THUMBNAIL_SIZE, new Color(32, 32, 32));
        g.setPaint(gradient);
        g.fillRect(0, 0, THUMBNAIL_SIZE, THUMBNAIL_SIZE);

        // Draw play button
        g.setColor(Color.WHITE);
        int[] xPoints = { THUMBNAIL_SIZE / 3, THUMBNAIL_SIZE * 2 / 3, THUMBNAIL_SIZE / 3 };
        int[] yPoints = { THUMBNAIL_SIZE / 4, THUMBNAIL_SIZE / 2, THUMBNAIL_SIZE * 3 / 4 };
        g.fillPolygon(xPoints, yPoints, 3);

        g.dispose();
        return placeholder;
    }

    private boolean containsExecutableSignature(byte[] header, int bytesRead) {
        if (bytesRead < 4)
            return false;

        // DOS/Windows executable (MZ header)
        if (header[0] == 0x4D && header[1] == 0x5A)
            return true;

        // ELF executable
        if (header[0] == 0x7F && header[1] == 0x45 &&
                header[2] == 0x4C && header[3] == 0x46)
            return true;

        // Mach-O executable (macOS)
        if ((header[0] == (byte) 0xFE && header[1] == (byte) 0xED &&
                header[2] == (byte) 0xFA && header[3] == (byte) 0xCE) ||
                (header[0] == (byte) 0xCE && header[1] == (byte) 0xFA &&
                        header[2] == (byte) 0xED && header[3] == (byte) 0xFE))
            return true;

        return false;
    }

    private boolean containsScriptContent(byte[] header, int bytesRead) {
        String headerString = new String(header, 0, Math.min(200, bytesRead));
        String lowerHeader = headerString.toLowerCase();

        return lowerHeader.contains("#!/") ||
                lowerHeader.contains("<?php") ||
                lowerHeader.contains("<script") ||
                lowerHeader.contains("javascript:") ||
                lowerHeader.contains("vbscript:");
    }

    private boolean isValidImageFile(MultipartFile file) {
        try {
            BufferedImage image = ImageIO.read(file.getInputStream());
            return image != null && image.getWidth() > 0 && image.getHeight() > 0;
        } catch (IOException e) {
            return false;
        }
    }

    private boolean containsSuspiciousContent(MultipartFile file) {
        // Additional security checks can be implemented here
        // For example, checking for embedded executables in images, etc.
        return false;
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf(".") + 1);
    }

    // Result classes

    public static class ProcessingResult {
        private final boolean success;
        private final String message;
        private final String originalPath;
        private final String thumbnailPath;
        private final long fileSize;

        private ProcessingResult(boolean success, String message, String originalPath,
                String thumbnailPath, long fileSize) {
            this.success = success;
            this.message = message;
            this.originalPath = originalPath;
            this.thumbnailPath = thumbnailPath;
            this.fileSize = fileSize;
        }

        public static ProcessingResult success(String originalPath, String thumbnailPath, long fileSize) {
            return new ProcessingResult(true, "Processing completed successfully",
                    originalPath, thumbnailPath, fileSize);
        }

        public static ProcessingResult error(String message) {
            return new ProcessingResult(false, message, null, null, 0);
        }

        // Getters
        public boolean isSuccess() {
            return success;
        }

        public String getMessage() {
            return message;
        }

        public String getOriginalPath() {
            return originalPath;
        }

        public String getThumbnailPath() {
            return thumbnailPath;
        }

        public long getFileSize() {
            return fileSize;
        }
    }

    public static class ValidationResult {
        private final boolean valid;
        private final String message;

        private ValidationResult(boolean valid, String message) {
            this.valid = valid;
            this.message = message;
        }

        public static ValidationResult valid() {
            return new ValidationResult(true, "File is valid");
        }

        public static ValidationResult invalid(String message) {
            return new ValidationResult(false, message);
        }

        public boolean isValid() {
            return valid;
        }

        public String getMessage() {
            return message;
        }
    }
}