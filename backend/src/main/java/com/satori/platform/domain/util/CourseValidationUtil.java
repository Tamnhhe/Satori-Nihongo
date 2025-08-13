package com.satori.platform.domain.util;

import com.satori.platform.domain.Course;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Utility class for Course validation logic.
 */
public final class CourseValidationUtil {

    private CourseValidationUtil() {
        // Utility class
    }

    /**
     * Validates a course and returns a list of validation errors.
     * 
     * @param course the course to validate
     * @return list of validation error messages
     */
    public static List<String> validateCourse(Course course) {
        List<String> errors = new ArrayList<>();

        if (course == null) {
            errors.add("Course cannot be null");
            return errors;
        }

        // Title validation
        if (course.getTitle() == null || course.getTitle().trim().isEmpty()) {
            errors.add("Course title is required");
        } else if (course.getTitle().length() > 255) {
            errors.add("Course title cannot exceed 255 characters");
        }

        // Course code validation
        if (course.getCourseCode() != null && course.getCourseCode().length() > 20) {
            errors.add("Course code cannot exceed 20 characters");
        }

        // Description validation
        if (course.getDescription() != null && course.getDescription().length() > 2000) {
            errors.add("Course description cannot exceed 2000 characters");
        }

        // Duration validation
        if (course.getDuration() != null && course.getDuration() <= 0) {
            errors.add("Course duration must be positive");
        }

        if (course.getEstimatedDuration() != null && course.getEstimatedDuration() <= 0) {
            errors.add("Estimated duration must be positive");
        }

        // Price validation
        if (course.getPrice() != null && course.getPrice().compareTo(BigDecimal.ZERO) < 0) {
            errors.add("Course price cannot be negative");
        }

        // Business logic validation
        if (course.getDuration() != null && course.getEstimatedDuration() != null) {
            if (course.getDuration() > course.getEstimatedDuration() * 3) {
                errors.add("Course duration seems too long compared to estimated duration");
            }
        }

        return errors;
    }

    /**
     * Checks if a course is valid for publication.
     * 
     * @param course the course to check
     * @return true if the course can be published
     */
    public static boolean isReadyForPublication(Course course) {
        if (course == null) {
            return false;
        }

        return course.getTitle() != null && !course.getTitle().trim().isEmpty() &&
                course.getDescription() != null && !course.getDescription().trim().isEmpty() &&
                course.getDifficultyLevel() != null &&
                course.getLanguage() != null &&
                course.getLessonCount() > 0;
    }

    /**
     * Generates a course code if not provided.
     * 
     * @param course the course
     * @return generated course code
     */
    public static String generateCourseCode(Course course) {
        if (course.getCourseCode() != null && !course.getCourseCode().trim().isEmpty()) {
            return course.getCourseCode();
        }

        StringBuilder code = new StringBuilder();

        // Add language prefix
        if (course.getLanguage() != null) {
            code.append(course.getLanguage().name().substring(0, 2));
        } else {
            code.append("GN"); // General
        }

        // Add difficulty level
        if (course.getDifficultyLevel() != null) {
            switch (course.getDifficultyLevel()) {
                case BEGINNER -> code.append("01");
                case ELEMENTARY -> code.append("02");
                case INTERMEDIATE -> code.append("03");
                case UPPER_INTERMEDIATE -> code.append("04");
                case ADVANCED -> code.append("05");
                case PROFICIENT -> code.append("06");
            }
        } else {
            code.append("00");
        }

        // Add timestamp suffix to ensure uniqueness
        code.append(System.currentTimeMillis() % 10000);

        return code.toString();
    }
}