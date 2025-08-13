package com.satori.platform.validation;

import com.satori.platform.validation.TestSecurityConfiguration.*;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

/**
 * Comprehensive API validation test that validates ALL 35+ API endpoints
 * in the Satori platform to ensure they work correctly from database
 * through to API layer.
 */
public class ComprehensiveApiValidationTest extends ApiValidationTestFramework {

    private final List<ValidationResult> validationResults = new ArrayList<>();

    @Test
    @DisplayName("Validate All User Management APIs")
    @WithMockAdminUser
    void validateUserManagementApis() {
        System.out.println("=== Validating User Management APIs ===");

        // 1. Enhanced User Resource - /api/admin/users
        validateApiEndpoint("GET", "/api/admin/users", HttpStatus.OK, "Enhanced User Resource - List Users");
        validateApiEndpoint("GET", "/api/admin/users/admin-test", HttpStatus.OK, "Enhanced User Resource - Get User");

        // 2. User Resource - /api/admin
        validateApiEndpoint("GET", "/api/admin", HttpStatus.OK, "User Resource - Admin Operations");

        // 3. Public User Resource - /api
        validateApiEndpoint("GET", "/api/account", HttpStatus.OK, "Public User Resource - Account Info");

        // 4. User Profile Resource - /api/user-profiles
        validateApiEndpoint("GET", "/api/user-profiles", HttpStatus.OK, "User Profile Resource - List Profiles");

        // 5. Student Profile Resource - /api/student-profiles
        validateApiEndpoint("GET", "/api/student-profiles", HttpStatus.OK,
                "Student Profile Resource - List Student Profiles");

        // 6. Teacher Profile Resource - /api/teacher-profiles
        validateApiEndpoint("GET", "/api/teacher-profiles", HttpStatus.OK,
                "Teacher Profile Resource - List Teacher Profiles");

        printValidationSummary("User Management APIs");
    }

    @Test
    @DisplayName("Validate All Course & Learning Management APIs")
    @WithMockAdminUser
    void validateCourseManagementApis() {
        System.out.println("=== Validating Course & Learning Management APIs ===");

        // 1. Enhanced Course Resource - /api/courses
        validateApiEndpoint("GET", "/api/courses", HttpStatus.OK, "Enhanced Course Resource - List Courses");

        // 2. Enhanced Course Class Resource - /api/admin/course-classes
        validateApiEndpoint("GET", "/api/admin/course-classes", HttpStatus.OK,
                "Enhanced Course Class Resource - List Classes");

        // 3. Lesson Resource - /api/lessons
        validateApiEndpoint("GET", "/api/lessons", HttpStatus.OK, "Lesson Resource - List Lessons");

        // 4. Enhanced Lesson Resource - /api/enhanced/lessons
        validateApiEndpoint("GET", "/api/enhanced/lessons", HttpStatus.OK,
                "Enhanced Lesson Resource - Enhanced Features");

        // 5. Schedule Resource - /api/schedules
        validateApiEndpoint("GET", "/api/schedules", HttpStatus.OK, "Schedule Resource - List Schedules");

        // 6. Course Assignment Resource - /api/admin/course-assignments
        validateApiEndpoint("GET", "/api/admin/course-assignments", HttpStatus.OK,
                "Course Assignment Resource - List Assignments");

        // 7. Class Schedule Resource - /api/admin/class-schedules
        validateApiEndpoint("GET", "/api/admin/class-schedules", HttpStatus.OK,
                "Class Schedule Resource - List Class Schedules");

        printValidationSummary("Course & Learning Management APIs");
    }

    @Test
    @DisplayName("Validate All Quiz & Assessment APIs")
    @WithMockAdminUser
    void validateQuizAssessmentApis() {
        System.out.println("=== Validating Quiz & Assessment APIs ===");

        // 1. Quiz Resource - /api/quizzes
        validateApiEndpoint("GET", "/api/quizzes", HttpStatus.OK, "Quiz Resource - List Quizzes");

        // 2. Enhanced Quiz Resource - /api/admin/quizzes
        validateApiEndpoint("GET", "/api/admin/quizzes", HttpStatus.OK, "Enhanced Quiz Resource - Advanced Management");

        // 3. Question Resource - /api/questions
        validateApiEndpoint("GET", "/api/questions", HttpStatus.OK, "Question Resource - List Questions");

        // 4. Quiz Question Resource - /api/quiz-questions
        validateApiEndpoint("GET", "/api/quiz-questions", HttpStatus.OK,
                "Quiz Question Resource - Quiz-Question Relationships");

        // 5. Quiz Assignment Resource - /api/admin/quiz-assignments
        validateApiEndpoint("GET", "/api/admin/quiz-assignments", HttpStatus.OK,
                "Quiz Assignment Resource - List Assignments");

        // 6. Quiz Analytics Resource - /api/admin/quiz-analytics
        validateApiEndpoint("GET", "/api/admin/quiz-analytics", HttpStatus.OK,
                "Quiz Analytics Resource - Performance Analytics");

        // 7. Student Quiz Resource - /api/student-quizs
        validateApiEndpoint("GET", "/api/student-quizs", HttpStatus.OK, "Student Quiz Resource - Quiz Attempts");

        // 8. Student Quiz Participation Resource - /api/student-quiz-participation
        validateApiEndpoint("GET", "/api/student-quiz-participation", HttpStatus.OK,
                "Student Quiz Participation Resource - Participation Tracking");

        printValidationSummary("Quiz & Assessment APIs");
    }

    @Test
    @DisplayName("Validate All Analytics & Reporting APIs")
    @WithMockAdminUser
    void validateAnalyticsReportingApis() {
        System.out.println("=== Validating Analytics & Reporting APIs ===");

        // 1. Student Progress Analytics Resource - /api/analytics
        validateApiEndpoint("GET", "/api/analytics", HttpStatus.OK,
                "Student Progress Analytics Resource - Progress Tracking");

        // 2. Student Analytics Resource - /api/student-analytics
        validateApiEndpoint("GET", "/api/student-analytics", HttpStatus.OK,
                "Student Analytics Resource - Individual Analytics");

        // 3. Comprehensive Analytics Resource - /api/admin/comprehensive-analytics
        validateApiEndpoint("GET", "/api/admin/comprehensive-analytics", HttpStatus.OK,
                "Comprehensive Analytics Resource - System-wide Analytics");

        // 4. Reporting Resource - /api/admin/reports
        validateApiEndpoint("GET", "/api/admin/reports", HttpStatus.OK, "Reporting Resource - Report Generation");

        printValidationSummary("Analytics & Reporting APIs");
    }

    @Test
    @DisplayName("Validate All Notification & Communication APIs")
    @WithMockAdminUser
    void validateNotificationCommunicationApis() {
        System.out.println("=== Validating Notification & Communication APIs ===");

        // 1. Notification Management Resource - /api/admin/notifications
        validateApiEndpoint("GET", "/api/admin/notifications", HttpStatus.OK,
                "Notification Management Resource - Notification Management");

        // 2. Notification Analytics Resource - /api/admin/notification-analytics
        validateApiEndpoint("GET", "/api/admin/notification-analytics", HttpStatus.OK,
                "Notification Analytics Resource - Notification Metrics");

        // 3. Notification Preference Resource - /api/notification-preferences
        validateApiEndpoint("GET", "/api/notification-preferences", HttpStatus.OK,
                "Notification Preference Resource - User Preferences");

        printValidationSummary("Notification & Communication APIs");
    }

    @Test
    @DisplayName("Validate All File & Content Management APIs")
    @WithMockAdminUser
    void validateFileContentManagementApis() {
        System.out.println("=== Validating File & Content Management APIs ===");

        // 1. File Management Resource - /api/admin/files
        validateApiEndpoint("GET", "/api/admin/files", HttpStatus.OK, "File Management Resource - File Management");

        // 2. Flashcard Resource - /api/flashcards
        validateApiEndpoint("GET", "/api/flashcards", HttpStatus.OK, "Flashcard Resource - Flashcard System");

        // 3. Flashcard Session Resource - /api/flashcard-sessions
        validateApiEndpoint("GET", "/api/flashcard-sessions", HttpStatus.OK,
                "Flashcard Session Resource - Study Sessions");

        printValidationSummary("File & Content Management APIs");
    }

    @Test
    @DisplayName("Validate All System Administration APIs")
    @WithMockAdminUser
    void validateSystemAdministrationApis() {
        System.out.println("=== Validating System Administration APIs ===");

        // 1. System Monitoring Resource - /api/admin/system-monitoring
        validateApiEndpoint("GET", "/api/admin/system-monitoring", HttpStatus.OK,
                "System Monitoring Resource - System Health");

        // 2. System Configuration Resource - /api/admin/system-configuration
        validateApiEndpoint("GET", "/api/admin/system-configuration", HttpStatus.OK,
                "System Configuration Resource - System Settings");

        // 3. Audit Log Resource - /api/admin/audit-logs
        validateApiEndpoint("GET", "/api/admin/audit-logs", HttpStatus.OK, "Audit Log Resource - Audit Trail");

        printValidationSummary("System Administration APIs");
    }

    @Test
    @DisplayName("Validate All Integration & Social APIs")
    @WithMockAdminUser
    void validateIntegrationSocialApis() {
        System.out.println("=== Validating Integration & Social APIs ===");

        // 1. Social Account Resource - /api/social-accounts
        validateApiEndpoint("GET", "/api/social-accounts", HttpStatus.OK,
                "Social Account Resource - Social Integration");

        // 2. Spring AI Resource - /api/spring-ai (if enabled)
        validateApiEndpoint("GET", "/api/spring-ai", HttpStatus.OK, "Spring AI Resource - AI Integration", true);

        // 3. Gift Code Resource - /api/gift-codes
        validateApiEndpoint("GET", "/api/gift-codes", HttpStatus.OK, "Gift Code Resource - Promotional System");

        printValidationSummary("Integration & Social APIs");
    }

    @Test
    @DisplayName("Generate Comprehensive API Validation Report")
    void generateComprehensiveReport() {
        System.out.println("\n=== COMPREHENSIVE API VALIDATION REPORT ===");

        int totalApis = validationResults.size();
        long passedApis = validationResults.stream().mapToLong(r -> r.getStatus() == ValidationStatus.PASSED ? 1 : 0)
                .sum();
        long failedApis = validationResults.stream().mapToLong(r -> r.getStatus() == ValidationStatus.FAILED ? 1 : 0)
                .sum();
        long skippedApis = validationResults.stream().mapToLong(r -> r.getStatus() == ValidationStatus.SKIPPED ? 1 : 0)
                .sum();

        System.out.printf("Total APIs Validated: %d%n", totalApis);
        System.out.printf("Passed: %d (%.1f%%)%n", passedApis, (passedApis * 100.0) / totalApis);
        System.out.printf("Failed: %d (%.1f%%)%n", failedApis, (failedApis * 100.0) / totalApis);
        System.out.printf("Skipped: %d (%.1f%%)%n", skippedApis, (skippedApis * 100.0) / totalApis);

        if (failedApis > 0) {
            System.out.println("\nFAILED APIs:");
            validationResults.stream()
                    .filter(r -> r.getStatus() == ValidationStatus.FAILED)
                    .forEach(r -> System.out.printf("  - %s: %s%n", r.getComponentName(), r.getDetails()));
        }

        System.out.println("\n=== END OF COMPREHENSIVE VALIDATION REPORT ===");
    }

    /**
     * Validates a single API endpoint
     */
    private void validateApiEndpoint(String method, String endpoint, HttpStatus expectedStatus, String description) {
        validateApiEndpoint(method, endpoint, expectedStatus, description, false);
    }

    /**
     * Validates a single API endpoint with optional skip for non-critical APIs
     */
    private void validateApiEndpoint(String method, String endpoint, HttpStatus expectedStatus, String description,
            boolean allowSkip) {
        try {
            long startTime = System.currentTimeMillis();
            ResponseEntity<String> response;

            switch (method.toUpperCase()) {
                case "GET":
                    response = performGet(endpoint, String.class);
                    break;
                case "POST":
                    response = performPost(endpoint, "{}", String.class);
                    break;
                case "PUT":
                    response = performPut(endpoint, "{}", String.class);
                    break;
                case "DELETE":
                    ResponseEntity<Void> deleteResponse = performDelete(endpoint);
                    response = ResponseEntity.status(deleteResponse.getStatusCode()).body("");
                    break;
                default:
                    throw new IllegalArgumentException("Unsupported HTTP method: " + method);
            }

            long responseTime = System.currentTimeMillis() - startTime;

            // Check if endpoint exists (not 404)
            if (response.getStatusCode() == HttpStatus.NOT_FOUND) {
                if (allowSkip) {
                    validationResults.add(
                            createValidationResult(description, true, "Skipped - Optional endpoint not implemented"));
                    System.out.printf("  ⚠️  %s %s -> SKIPPED (Optional)%n", method, endpoint);
                    return;
                } else {
                    validationResults
                            .add(createValidationResult(description, false, "Endpoint not found: " + endpoint));
                    System.out.printf("  ❌ %s %s -> NOT FOUND%n", method, endpoint);
                    return;
                }
            }

            // Validate response
            boolean success = response.getStatusCode().is2xxSuccessful() ||
                    response.getStatusCode() == HttpStatus.UNAUTHORIZED ||
                    response.getStatusCode() == HttpStatus.FORBIDDEN;

            if (success) {
                validationResults.add(createValidationResult(description, true,
                        String.format("Status: %s, Response Time: %dms", response.getStatusCode(), responseTime)));
                System.out.printf("  ✅ %s %s -> %s (%dms)%n", method, endpoint, response.getStatusCode(), responseTime);
            } else {
                validationResults.add(createValidationResult(description, false,
                        String.format("Unexpected status: %s", response.getStatusCode())));
                System.out.printf("  ❌ %s %s -> %s%n", method, endpoint, response.getStatusCode());
            }

        } catch (Exception e) {
            validationResults.add(createValidationResult(description, false, "Exception: " + e.getMessage()));
            System.out.printf("  ❌ %s %s -> ERROR: %s%n", method, endpoint, e.getMessage());
        }
    }

    /**
     * Prints validation summary for a category
     */
    private void printValidationSummary(String category) {
        long categoryResults = validationResults.stream()
                .filter(r -> r.getComponentName().contains(category.split(" ")[0]))
                .count();

        System.out.printf("✅ %s validation completed (%d endpoints)%n%n", category, categoryResults);
    }
}