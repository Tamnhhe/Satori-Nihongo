package com.satori.platform.domain;

import com.satori.platform.domain.enumeration.CourseLanguage;
import com.satori.platform.domain.enumeration.DifficultyLevel;
import java.math.BigDecimal;

/**
 * Builder pattern for Course entity creation.
 * Provides a fluent API for creating Course instances with validation.
 */
public class CourseBuilder {

    private final Course course;

    private CourseBuilder() {
        this.course = new Course();
    }

    public static CourseBuilder builder() {
        return new CourseBuilder();
    }

    public CourseBuilder title(String title) {
        if (title == null || title.trim().isEmpty()) {
            throw new IllegalArgumentException("Course title cannot be null or empty");
        }
        this.course.setTitle(title.trim());
        return this;
    }

    public CourseBuilder description(String description) {
        this.course.setDescription(description != null ? description.trim() : null);
        return this;
    }

    public CourseBuilder courseCode(String courseCode) {
        if (courseCode != null && !courseCode.trim().isEmpty()) {
            this.course.setCourseCode(courseCode.trim().toUpperCase());
        }
        return this;
    }

    public CourseBuilder level(String level) {
        this.course.setLevel(level);
        return this;
    }

    public CourseBuilder duration(Integer duration) {
        if (duration != null && duration <= 0) {
            throw new IllegalArgumentException("Course duration must be positive");
        }
        this.course.setDuration(duration);
        return this;
    }

    public CourseBuilder estimatedDuration(Integer estimatedDuration) {
        if (estimatedDuration != null && estimatedDuration <= 0) {
            throw new IllegalArgumentException("Estimated duration must be positive");
        }
        this.course.setEstimatedDuration(estimatedDuration);
        return this;
    }

    public CourseBuilder price(BigDecimal price) {
        if (price != null && price.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Course price cannot be negative");
        }
        this.course.setPrice(price);
        return this;
    }

    public CourseBuilder price(double price) {
        return price(BigDecimal.valueOf(price));
    }

    public CourseBuilder difficultyLevel(DifficultyLevel difficultyLevel) {
        this.course.setDifficultyLevel(difficultyLevel);
        return this;
    }

    public CourseBuilder language(CourseLanguage language) {
        this.course.setLanguage(language);
        return this;
    }

    public CourseBuilder teacher(UserProfile teacher) {
        this.course.setTeacher(teacher);
        return this;
    }

    public CourseBuilder active(boolean active) {
        this.course.setIsActive(active);
        return this;
    }

    public Course build() {
        validateCourse();
        return this.course;
    }

    private void validateCourse() {
        if (course.getTitle() == null || course.getTitle().trim().isEmpty()) {
            throw new IllegalStateException("Course title is required");
        }

        if (course.getDuration() != null && course.getEstimatedDuration() != null) {
            if (course.getDuration() > course.getEstimatedDuration() * 2) {
                throw new IllegalStateException("Course duration seems inconsistent with estimated duration");
            }
        }
    }
}