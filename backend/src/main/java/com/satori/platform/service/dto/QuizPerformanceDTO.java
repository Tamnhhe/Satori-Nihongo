package com.satori.platform.service.dto;

import java.time.LocalDateTime;

/**
 * DTO for quiz performance analytics.
 */
public class QuizPerformanceDTO {

    private Long quizId;
    private String quizTitle;
    private Double score;
    private LocalDateTime completionDate;
    private Integer timeTakenMinutes;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private String courseName;
    private String lessonName;
    private String performanceGrade;
    private Boolean isPassed;

    // Constructors
    public QuizPerformanceDTO() {
    }

    public QuizPerformanceDTO(Long quizId, String quizTitle, Double score) {
        this.quizId = quizId;
        this.quizTitle = quizTitle;
        this.score = score;
    }

    // Getters and setters
    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public LocalDateTime getCompletionDate() {
        return completionDate;
    }

    public void setCompletionDate(LocalDateTime completionDate) {
        this.completionDate = completionDate;
    }

    public Integer getTimeTakenMinutes() {
        return timeTakenMinutes;
    }

    public void setTimeTakenMinutes(Integer timeTakenMinutes) {
        this.timeTakenMinutes = timeTakenMinutes;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
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

    public String getPerformanceGrade() {
        return performanceGrade;
    }

    public void setPerformanceGrade(String performanceGrade) {
        this.performanceGrade = performanceGrade;
    }

    public Boolean getIsPassed() {
        return isPassed;
    }

    public void setIsPassed(Boolean isPassed) {
        this.isPassed = isPassed;
    }

    @Override
    public String toString() {
        return "QuizPerformanceDTO{" +
                "quizId=" + quizId +
                ", quizTitle='" + quizTitle + '\'' +
                ", score=" + score +
                ", completionDate=" + completionDate +
                ", timeTakenMinutes=" + timeTakenMinutes +
                ", correctAnswers=" + correctAnswers +
                ", totalQuestions=" + totalQuestions +
                ", performanceGrade='" + performanceGrade + '\'' +
                ", isPassed=" + isPassed +
                '}';
    }
}