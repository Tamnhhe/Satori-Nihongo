package com.satori.platform.service.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * DTO for comprehensive student analytics data.
 */
public class StudentAnalyticsDTO {

    private Long studentId;
    private String studentName;
    private LocalDateTime lastActivityDate;
    private Integer streakDays;
    private String performanceTrend;

    // Overall progress metrics
    private Double overallCompletionPercentage;
    private Integer totalCoursesEnrolled;
    private Integer coursesCompleted;
    private Integer totalStudyTimeMinutes;

    // Quiz performance metrics
    private Double averageQuizScore;
    private Integer totalQuizzesCompleted;
    private Integer totalQuizzesAvailable;
    private Double quizCompletionRate;

    // Flashcard performance metrics
    private Integer totalFlashcardsMastered;
    private Integer totalFlashcardsAvailable;
    private Double flashcardMasteryRate;
    private Double averageFlashcardAccuracy;

    // Course-specific performance
    private Map<String, CoursePerformanceDTO> coursePerformance;

    // Recent activity
    private List<QuizPerformanceDTO> recentQuizzes;
    private List<FlashcardPerformanceDTO> recentFlashcardSessions;

    // Improvement recommendations
    private List<String> improvementRecommendations;

    // Progress visualization data
    private List<ProgressDataPointDTO> progressHistory;

    // Constructors
    public StudentAnalyticsDTO() {
    }

    public StudentAnalyticsDTO(Long studentId, String studentName) {
        this.studentId = studentId;
        this.studentName = studentName;
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

    public LocalDateTime getLastActivityDate() {
        return lastActivityDate;
    }

    public void setLastActivityDate(LocalDateTime lastActivityDate) {
        this.lastActivityDate = lastActivityDate;
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

    public Double getOverallCompletionPercentage() {
        return overallCompletionPercentage;
    }

    public void setOverallCompletionPercentage(Double overallCompletionPercentage) {
        this.overallCompletionPercentage = overallCompletionPercentage;
    }

    public Integer getTotalCoursesEnrolled() {
        return totalCoursesEnrolled;
    }

    public void setTotalCoursesEnrolled(Integer totalCoursesEnrolled) {
        this.totalCoursesEnrolled = totalCoursesEnrolled;
    }

    public Integer getCoursesCompleted() {
        return coursesCompleted;
    }

    public void setCoursesCompleted(Integer coursesCompleted) {
        this.coursesCompleted = coursesCompleted;
    }

    public Integer getTotalStudyTimeMinutes() {
        return totalStudyTimeMinutes;
    }

    public void setTotalStudyTimeMinutes(Integer totalStudyTimeMinutes) {
        this.totalStudyTimeMinutes = totalStudyTimeMinutes;
    }

    public Double getAverageQuizScore() {
        return averageQuizScore;
    }

    public void setAverageQuizScore(Double averageQuizScore) {
        this.averageQuizScore = averageQuizScore;
    }

    public Integer getTotalQuizzesCompleted() {
        return totalQuizzesCompleted;
    }

    public void setTotalQuizzesCompleted(Integer totalQuizzesCompleted) {
        this.totalQuizzesCompleted = totalQuizzesCompleted;
    }

    public Integer getTotalQuizzesAvailable() {
        return totalQuizzesAvailable;
    }

    public void setTotalQuizzesAvailable(Integer totalQuizzesAvailable) {
        this.totalQuizzesAvailable = totalQuizzesAvailable;
    }

    public Double getQuizCompletionRate() {
        return quizCompletionRate;
    }

    public void setQuizCompletionRate(Double quizCompletionRate) {
        this.quizCompletionRate = quizCompletionRate;
    }

    public Integer getTotalFlashcardsMastered() {
        return totalFlashcardsMastered;
    }

    public void setTotalFlashcardsMastered(Integer totalFlashcardsMastered) {
        this.totalFlashcardsMastered = totalFlashcardsMastered;
    }

    public Integer getTotalFlashcardsAvailable() {
        return totalFlashcardsAvailable;
    }

    public void setTotalFlashcardsAvailable(Integer totalFlashcardsAvailable) {
        this.totalFlashcardsAvailable = totalFlashcardsAvailable;
    }

    public Double getFlashcardMasteryRate() {
        return flashcardMasteryRate;
    }

    public void setFlashcardMasteryRate(Double flashcardMasteryRate) {
        this.flashcardMasteryRate = flashcardMasteryRate;
    }

    public Double getAverageFlashcardAccuracy() {
        return averageFlashcardAccuracy;
    }

    public void setAverageFlashcardAccuracy(Double averageFlashcardAccuracy) {
        this.averageFlashcardAccuracy = averageFlashcardAccuracy;
    }

    public Map<String, CoursePerformanceDTO> getCoursePerformance() {
        return coursePerformance;
    }

    public void setCoursePerformance(Map<String, CoursePerformanceDTO> coursePerformance) {
        this.coursePerformance = coursePerformance;
    }

    public List<QuizPerformanceDTO> getRecentQuizzes() {
        return recentQuizzes;
    }

    public void setRecentQuizzes(List<QuizPerformanceDTO> recentQuizzes) {
        this.recentQuizzes = recentQuizzes;
    }

    public List<FlashcardPerformanceDTO> getRecentFlashcardSessions() {
        return recentFlashcardSessions;
    }

    public void setRecentFlashcardSessions(List<FlashcardPerformanceDTO> recentFlashcardSessions) {
        this.recentFlashcardSessions = recentFlashcardSessions;
    }

    public List<String> getImprovementRecommendations() {
        return improvementRecommendations;
    }

    public void setImprovementRecommendations(List<String> improvementRecommendations) {
        this.improvementRecommendations = improvementRecommendations;
    }

    public List<ProgressDataPointDTO> getProgressHistory() {
        return progressHistory;
    }

    public void setProgressHistory(List<ProgressDataPointDTO> progressHistory) {
        this.progressHistory = progressHistory;
    }

    @Override
    public String toString() {
        return "StudentAnalyticsDTO{" +
                "studentId=" + studentId +
                ", studentName='" + studentName + '\'' +
                ", overallCompletionPercentage=" + overallCompletionPercentage +
                ", averageQuizScore=" + averageQuizScore +
                ", streakDays=" + streakDays +
                ", performanceTrend='" + performanceTrend + '\'' +
                '}';
    }
}