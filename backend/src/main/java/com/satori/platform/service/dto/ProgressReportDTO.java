package com.satori.platform.service.dto;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for progress report export functionality.
 */
public class ProgressReportDTO {

    private Long studentId;
    private String studentName;
    private String studentEmail;
    private LocalDateTime reportGeneratedDate;
    private LocalDateTime reportPeriodStart;
    private LocalDateTime reportPeriodEnd;

    // Summary metrics
    private Double overallCompletionPercentage;
    private Double averageQuizScore;
    private Integer totalStudyTimeMinutes;
    private Integer streakDays;
    private String performanceTrend;

    // Course-specific data
    private List<CoursePerformanceDTO> coursePerformances;

    // Recent activities
    private List<QuizPerformanceDTO> quizHistory;
    private List<FlashcardPerformanceDTO> flashcardSessions;

    // Progress over time
    private List<ProgressDataPointDTO> progressHistory;

    // Recommendations
    private List<String> improvementRecommendations;
    private List<String> strengthAreas;
    private List<String> improvementAreas;

    // Constructors
    public ProgressReportDTO() {
    }

    public ProgressReportDTO(Long studentId, String studentName, String studentEmail) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentEmail = studentEmail;
        this.reportGeneratedDate = LocalDateTime.now();
    }

    // Getters and setters
    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public String getStudentEmail() {
        return studentEmail;
    }

    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }

    public LocalDateTime getReportGeneratedDate() {
        return reportGeneratedDate;
    }

    public void setReportGeneratedDate(LocalDateTime reportGeneratedDate) {
        this.reportGeneratedDate = reportGeneratedDate;
    }

    public LocalDateTime getReportPeriodStart() {
        return reportPeriodStart;
    }

    public void setReportPeriodStart(LocalDateTime reportPeriodStart) {
        this.reportPeriodStart = reportPeriodStart;
    }

    public LocalDateTime getReportPeriodEnd() {
        return reportPeriodEnd;
    }

    public void setReportPeriodEnd(LocalDateTime reportPeriodEnd) {
        this.reportPeriodEnd = reportPeriodEnd;
    }

    public Double getOverallCompletionPercentage() {
        return overallCompletionPercentage;
    }

    public void setOverallCompletionPercentage(Double overallCompletionPercentage) {
        this.overallCompletionPercentage = overallCompletionPercentage;
    }

    public Double getAverageQuizScore() {
        return averageQuizScore;
    }

    public void setAverageQuizScore(Double averageQuizScore) {
        this.averageQuizScore = averageQuizScore;
    }

    public Integer getTotalStudyTimeMinutes() {
        return totalStudyTimeMinutes;
    }

    public void setTotalStudyTimeMinutes(Integer totalStudyTimeMinutes) {
        this.totalStudyTimeMinutes = totalStudyTimeMinutes;
    }

    public Integer getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(Integer streakDays) {
        this.streakDays = streakDays;
    }

    public String getPerformanceTrend() {
        return performanceTrend;
    }

    public void setPerformanceTrend(String performanceTrend) {
        this.performanceTrend = performanceTrend;
    }

    public List<CoursePerformanceDTO> getCoursePerformances() {
        return coursePerformances;
    }

    public void setCoursePerformances(List<CoursePerformanceDTO> coursePerformances) {
        this.coursePerformances = coursePerformances;
    }

    public List<QuizPerformanceDTO> getQuizHistory() {
        return quizHistory;
    }

    public void setQuizHistory(List<QuizPerformanceDTO> quizHistory) {
        this.quizHistory = quizHistory;
    }

    public List<FlashcardPerformanceDTO> getFlashcardSessions() {
        return flashcardSessions;
    }

    public void setFlashcardSessions(List<FlashcardPerformanceDTO> flashcardSessions) {
        this.flashcardSessions = flashcardSessions;
    }

    public List<ProgressDataPointDTO> getProgressHistory() {
        return progressHistory;
    }

    public void setProgressHistory(List<ProgressDataPointDTO> progressHistory) {
        this.progressHistory = progressHistory;
    }

    public List<String> getImprovementRecommendations() {
        return improvementRecommendations;
    }

    public void setImprovementRecommendations(List<String> improvementRecommendations) {
        this.improvementRecommendations = improvementRecommendations;
    }

    public List<String> getStrengthAreas() {
        return strengthAreas;
    }

    public void setStrengthAreas(List<String> strengthAreas) {
        this.strengthAreas = strengthAreas;
    }

    public List<String> getImprovementAreas() {
        return improvementAreas;
    }

    public void setImprovementAreas(List<String> improvementAreas) {
        this.improvementAreas = improvementAreas;
    }

    @Override
    public String toString() {
        return "ProgressReportDTO{" +
                "studentId=" + studentId +
                ", studentName='" + studentName + '\'' +
                ", reportGeneratedDate=" + reportGeneratedDate +
                ", overallCompletionPercentage=" + overallCompletionPercentage +
                ", averageQuizScore=" + averageQuizScore +
                ", performanceTrend='" + performanceTrend + '\'' +
                '}';
    }
}