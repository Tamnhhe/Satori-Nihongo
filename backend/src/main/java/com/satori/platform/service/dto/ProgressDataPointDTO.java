package com.satori.platform.service.dto;

import java.time.LocalDateTime;

/**
 * DTO for progress visualization data points.
 */
public class ProgressDataPointDTO {

    private LocalDateTime date;
    private Double completionPercentage;
    private Double quizScore;
    private Double flashcardAccuracy;
    private Integer studyTimeMinutes;
    private String activityType; // QUIZ, FLASHCARD, LESSON, etc.
    private String courseName;
    private String lessonName;

    // Constructors
    public ProgressDataPointDTO() {
    }

    public ProgressDataPointDTO(LocalDateTime date, Double completionPercentage, String activityType) {
        this.date = date;
        this.completionPercentage = completionPercentage;
        this.activityType = activityType;
    }

    // Getters and setters
    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Double getCompletionPercentage() {
        return completionPercentage;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public Double getQuizScore() {
        return quizScore;
    }

    public void setQuizScore(Double quizScore) {
        this.quizScore = quizScore;
    }

    public Double getFlashcardAccuracy() {
        return flashcardAccuracy;
    }

    public void setFlashcardAccuracy(Double flashcardAccuracy) {
        this.flashcardAccuracy = flashcardAccuracy;
    }

    public Integer getStudyTimeMinutes() {
        return studyTimeMinutes;
    }

    public void setStudyTimeMinutes(Integer studyTimeMinutes) {
        this.studyTimeMinutes = studyTimeMinutes;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public String getLessonName() {
        return lessonName;
    }

    public void setLessonName(String lessonName) {
        this.lessonName = lessonName;
    }

    @Override
    public String toString() {
        return "ProgressDataPointDTO{" +
                "date=" + date +
                ", completionPercentage=" + completionPercentage +
                ", quizScore=" + quizScore +
                ", flashcardAccuracy=" + flashcardAccuracy +
                ", activityType='" + activityType + '\'' +
                ", courseName='" + courseName + '\'' +
                '}';
    }
}