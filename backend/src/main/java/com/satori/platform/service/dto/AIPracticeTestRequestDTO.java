package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DifficultyLevel;

import java.io.Serializable;

/**
 * DTO for AI practice test generation requests.
 */
public class AIPracticeTestRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long studentId;
    private Long courseId;
    private Long lessonId;
    private Integer questionCount;
    private DifficultyLevel difficultyLevel;
    private Boolean includeImages;
    private Boolean focusOnWeakAreas;

    public AIPracticeTestRequestDTO() {
        // Default constructor
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
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

    public Integer getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }

    public DifficultyLevel getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Boolean getIncludeImages() {
        return includeImages;
    }

    public void setIncludeImages(Boolean includeImages) {
        this.includeImages = includeImages;
    }

    public Boolean getFocusOnWeakAreas() {
        return focusOnWeakAreas;
    }

    public void setFocusOnWeakAreas(Boolean focusOnWeakAreas) {
        this.focusOnWeakAreas = focusOnWeakAreas;
    }

    @Override
    public String toString() {
        return "AIPracticeTestRequestDTO{" +
                "studentId=" + studentId +
                ", courseId=" + courseId +
                ", lessonId=" + lessonId +
                ", questionCount=" + questionCount +
                ", difficultyLevel=" + difficultyLevel +
                ", includeImages=" + includeImages +
                ", focusOnWeakAreas=" + focusOnWeakAreas +
                '}';
    }
}