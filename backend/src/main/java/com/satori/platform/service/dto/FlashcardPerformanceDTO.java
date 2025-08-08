package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DifficultyLevel;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for flashcard performance analytics
 */
public class FlashcardPerformanceDTO implements Serializable {

    private Long studentId;
    private Long lessonId;
    private String lessonTitle;
    private Double overallAccuracy;
    private Integer totalSessions;
    private Integer totalCardsStudied;
    private Long totalStudyTimeMinutes;
    private DifficultyLevel currentDifficultyLevel;
    private LocalDateTime lastStudyDate;
    private LocalDateTime nextReviewDate;
    private List<FlashcardSessionDTO> recentSessions;
    private Double improvementTrend; // Positive for improvement, negative for decline
    private Integer streakDays;
    private Boolean needsReview;

    // Additional fields for analytics compatibility
    private Integer sessionId;
    private LocalDateTime sessionDate;
    private Integer cardsStudied;
    private Integer correctAnswers;
    private Integer incorrectAnswers;
    private Double accuracyPercentage;
    private Integer durationMinutes;

    public FlashcardPerformanceDTO() {
    }

    public FlashcardPerformanceDTO(Long studentId, Long lessonId, String lessonTitle) {
        this.studentId = studentId;
        this.lessonId = lessonId;
        this.lessonTitle = lessonTitle;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public String getLessonTitle() {
        return lessonTitle;
    }

    public void setLessonTitle(String lessonTitle) {
        this.lessonTitle = lessonTitle;
    }

    public Double getOverallAccuracy() {
        return overallAccuracy;
    }

    public void setOverallAccuracy(Double overallAccuracy) {
        this.overallAccuracy = overallAccuracy;
    }

    public Integer getTotalSessions() {
        return totalSessions;
    }

    public void setTotalSessions(Integer totalSessions) {
        this.totalSessions = totalSessions;
    }

    public Integer getTotalCardsStudied() {
        return totalCardsStudied;
    }

    public void setTotalCardsStudied(Integer totalCardsStudied) {
        this.totalCardsStudied = totalCardsStudied;
    }

    public Long getTotalStudyTimeMinutes() {
        return totalStudyTimeMinutes;
    }

    public void setTotalStudyTimeMinutes(Long totalStudyTimeMinutes) {
        this.totalStudyTimeMinutes = totalStudyTimeMinutes;
    }

    public DifficultyLevel getCurrentDifficultyLevel() {
        return currentDifficultyLevel;
    }

    public void setCurrentDifficultyLevel(DifficultyLevel currentDifficultyLevel) {
        this.currentDifficultyLevel = currentDifficultyLevel;
    }

    public LocalDateTime getLastStudyDate() {
        return lastStudyDate;
    }

    public void setLastStudyDate(LocalDateTime lastStudyDate) {
        this.lastStudyDate = lastStudyDate;
    }

    public LocalDateTime getNextReviewDate() {
        return nextReviewDate;
    }

    public void setNextReviewDate(LocalDateTime nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }

    public List<FlashcardSessionDTO> getRecentSessions() {
        return recentSessions;
    }

    public void setRecentSessions(List<FlashcardSessionDTO> recentSessions) {
        this.recentSessions = recentSessions;
    }

    public Double getImprovementTrend() {
        return improvementTrend;
    }

    public void setImprovementTrend(Double improvementTrend) {
        this.improvementTrend = improvementTrend;
    }

    public Integer getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(Integer streakDays) {
        this.streakDays = streakDays;
    }

    public Boolean getNeedsReview() {
        return needsReview;
    }

    public void setNeedsReview(Boolean needsReview) {
        this.needsReview = needsReview;
    }

    // Additional getters and setters for analytics compatibility
    public Integer getSessionId() {
        return sessionId;
    }

    public void setSessionId(Integer sessionId) {
        this.sessionId = sessionId;
    }

    public LocalDateTime getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(LocalDateTime sessionDate) {
        this.sessionDate = sessionDate;
    }

    public Integer getCardsStudied() {
        return cardsStudied;
    }

    public void setCardsStudied(Integer cardsStudied) {
        this.cardsStudied = cardsStudied;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getIncorrectAnswers() {
        return incorrectAnswers;
    }

    public void setIncorrectAnswers(Integer incorrectAnswers) {
        this.incorrectAnswers = incorrectAnswers;
    }

    public Double getAccuracyPercentage() {
        return accuracyPercentage;
    }

    public void setAccuracyPercentage(Double accuracyPercentage) {
        this.accuracyPercentage = accuracyPercentage;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    @Override
    public String toString() {
        return "FlashcardPerformanceDTO{" +
                "studentId=" + studentId +
                ", lessonId=" + lessonId +
                ", lessonTitle='" + lessonTitle + '\'' +
                ", overallAccuracy=" + overallAccuracy +
                ", totalSessions=" + totalSessions +
                ", totalCardsStudied=" + totalCardsStudied +
                ", totalStudyTimeMinutes=" + totalStudyTimeMinutes +
                ", currentDifficultyLevel=" + currentDifficultyLevel +
                ", lastStudyDate=" + lastStudyDate +
                ", nextReviewDate=" + nextReviewDate +
                ", improvementTrend=" + improvementTrend +
                ", streakDays=" + streakDays +
                ", needsReview=" + needsReview +
                '}';
    }
}