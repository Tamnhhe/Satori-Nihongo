package com.satori.platform.service.dto;

import java.time.LocalDateTime;

/**
 * DTO for course-specific performance metrics.
 */
public class CoursePerformanceDTO {

    private Long courseId;
    private String courseName;
    private Double completionPercentage;
    private Integer lessonsCompleted;
    private Integer totalLessons;
    private Integer quizzesCompleted;
    private Integer totalQuizzes;
    private Double averageQuizScore;
    private Integer flashcardsMastered;
    private Integer totalFlashcards;
    private Integer studyTimeMinutes;
    private LocalDateTime lastActivityDate;
    private String performanceGrade; // A, B, C, D, F
    private Boolean isCompleted;

    // Constructors
    public CoursePerformanceDTO() {
    }

    public CoursePerformanceDTO(Long courseId, String courseName) {
        this.courseId = courseId;
        this.courseName = courseName;
    }

    public CoursePerformanceDTO(Long courseId, String courseName, Double completionPercentage,
            Integer lessonsCompleted, Integer totalLessons, Integer quizzesCompleted,
            Integer totalQuizzes, Double averageQuizScore, Integer flashcardsMastered,
            Integer totalFlashcards, Integer studyTimeMinutes, LocalDateTime lastActivityDate) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.completionPercentage = completionPercentage;
        this.lessonsCompleted = lessonsCompleted;
        this.totalLessons = totalLessons;
        this.quizzesCompleted = quizzesCompleted;
        this.totalQuizzes = totalQuizzes;
        this.averageQuizScore = averageQuizScore;
        this.flashcardsMastered = flashcardsMastered;
        this.totalFlashcards = totalFlashcards;
        this.studyTimeMinutes = studyTimeMinutes;
        this.lastActivityDate = lastActivityDate;
    }

    // Getters and setters
    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public Integer getLessonsCompleted() {
        return lessonsCompleted;
    }

    public void setLessonsCompleted(Integer lessonsCompleted) {
        this.lessonsCompleted = lessonsCompleted;
    }

    public Integer getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(Integer totalLessons) {
        this.totalLessons = totalLessons;
    }

    public Integer getQuizzesCompleted() {
        return quizzesCompleted;
    }

    public void setQuizzesCompleted(Integer quizzesCompleted) {
        this.quizzesCompleted = quizzesCompleted;
    }

    public Integer getTotalQuizzes() {
        return totalQuizzes;
    }

    public void setTotalQuizzes(Integer totalQuizzes) {
        this.totalQuizzes = totalQuizzes;
    }

    public Double getAverageQuizScore() {
        return averageQuizScore;
    }

    public void setAverageQuizScore(Double averageQuizScore) {
        this.averageQuizScore = averageQuizScore;
    }

    public Integer getFlashcardsMastered() {
        return flashcardsMastered;
    }

    public void setFlashcardsMastered(Integer flashcardsMastered) {
        this.flashcardsMastered = flashcardsMastered;
    }

    public Integer getTotalFlashcards() {
        return totalFlashcards;
    }

    public void setTotalFlashcards(Integer totalFlashcards) {
        this.totalFlashcards = totalFlashcards;
    }

    public Integer getStudyTimeMinutes() {
        return studyTimeMinutes;
    }

    public void setStudyTimeMinutes(Integer studyTimeMinutes) {
        this.studyTimeMinutes = studyTimeMinutes;
    }

    public LocalDateTime getLastActivityDate() {
        return lastActivityDate;
    }

    public void setLastActivityDate(LocalDateTime lastActivityDate) {
        this.lastActivityDate = lastActivityDate;
    }

    public String getPerformanceGrade() {
        return performanceGrade;
    }

    public void setPerformanceGrade(String performanceGrade) {
        this.performanceGrade = performanceGrade;
    }

    public Boolean getIsCompleted() {
        return isCompleted;
    }

    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }

    @Override
    public String toString() {
        return "CoursePerformanceDTO{" +
                "courseId=" + courseId +
                ", courseName='" + courseName + '\'' +
                ", completionPercentage=" + completionPercentage +
                ", averageQuizScore=" + averageQuizScore +
                ", performanceGrade='" + performanceGrade + '\'' +
                ", isCompleted=" + isCompleted +
                '}';
    }
}