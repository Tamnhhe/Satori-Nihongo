package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DifficultyLevel;

import java.io.Serializable;

/**
 * DTO for practice test topics.
 */
public class PracticeTestTopicDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private String title;
    private String description;
    private String type; // "course" or "lesson"
    private Long courseId;
    private Long lessonId;
    private Integer availableQuestions;
    private DifficultyLevel recommendedDifficulty;
    private Boolean hasWeakAreas;

    public PracticeTestTopicDTO() {
        // Default constructor
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public Integer getAvailableQuestions() {
        return availableQuestions;
    }

    public void setAvailableQuestions(Integer availableQuestions) {
        this.availableQuestions = availableQuestions;
    }

    public DifficultyLevel getRecommendedDifficulty() {
        return recommendedDifficulty;
    }

    public void setRecommendedDifficulty(DifficultyLevel recommendedDifficulty) {
        this.recommendedDifficulty = recommendedDifficulty;
    }

    public Boolean getHasWeakAreas() {
        return hasWeakAreas;
    }

    public void setHasWeakAreas(Boolean hasWeakAreas) {
        this.hasWeakAreas = hasWeakAreas;
    }

    @Override
    public String toString() {
        return "PracticeTestTopicDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", type='" + type + '\'' +
                ", courseId=" + courseId +
                ", lessonId=" + lessonId +
                ", availableQuestions=" + availableQuestions +
                ", recommendedDifficulty=" + recommendedDifficulty +
                ", hasWeakAreas=" + hasWeakAreas +
                '}';
    }
}