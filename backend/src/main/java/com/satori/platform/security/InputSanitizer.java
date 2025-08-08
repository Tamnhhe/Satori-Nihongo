package com.satori.platform.security;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

/**
 * Utility class for input sanitization to prevent XSS and injection attacks.
 */
@Component
public class InputSanitizer {

    private static final Pattern HTML_PATTERN = Pattern.compile("<[^>]+>");
    private static final Pattern SCRIPT_PATTERN = Pattern.compile("(?i)<script[^>]*>.*?</script>");
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile(
            "(?i)(union|select|insert|update|delete|drop|create|alter|exec|execute|script|javascript|vbscript|onload|onerror|onclick)");

    /**
     * Sanitizes input string by removing potentially dangerous content.
     *
     * @param input the input string to sanitize
     * @return sanitized string
     */
    public String sanitizeInput(String input) {
        if (StringUtils.isBlank(input)) {
            return input;
        }

        String sanitized = input;

        // Remove script tags
        sanitized = SCRIPT_PATTERN.matcher(sanitized).replaceAll("");

        // Remove HTML tags (basic protection)
        sanitized = HTML_PATTERN.matcher(sanitized).replaceAll("");

        // Escape special characters
        sanitized = sanitized
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#x27;")
                .replace("/", "&#x2F;");

        return sanitized.trim();
    }

    /**
     * Validates input for potential SQL injection patterns.
     *
     * @param input the input to validate
     * @return true if input appears safe, false otherwise
     */
    public boolean isSafeFromSqlInjection(String input) {
        if (StringUtils.isBlank(input)) {
            return true;
        }
        return !SQL_INJECTION_PATTERN.matcher(input).find();
    }

    /**
     * Sanitizes filename to prevent directory traversal attacks.
     *
     * @param filename the filename to sanitize
     * @return sanitized filename
     */
    public String sanitizeFilename(String filename) {
        if (StringUtils.isBlank(filename)) {
            return filename;
        }

        // Remove path traversal attempts
        String sanitized = filename.replaceAll("\\.\\./", "")
                .replaceAll("\\.\\.\\\\", "")
                .replaceAll("/", "_")
                .replaceAll("\\\\", "_");

        // Remove potentially dangerous characters
        sanitized = sanitized.replaceAll("[^a-zA-Z0-9._-]", "_");

        return sanitized;
    }

    /**
     * Validates email format with additional security checks.
     *
     * @param email the email to validate
     * @return true if email is valid and safe
     */
    public boolean isValidEmail(String email) {
        if (StringUtils.isBlank(email)) {
            return false;
        }

        // Basic email pattern
        Pattern emailPattern = Pattern.compile("^[A-Za-z0-9+_.-]+@([A-Za-z0-9.-]+\\.[A-Za-z]{2,})$");

        return emailPattern.matcher(email).matches() &&
                email.length() <= 254 && // RFC 5321 limit
                isSafeFromSqlInjection(email);
    }
}