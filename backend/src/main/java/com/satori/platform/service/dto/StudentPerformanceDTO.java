package com.satori.platform.service.dto;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for student performance analytics in quiz analytics.
 */
public class StudentPerformanceDTO implements Serializable {

    private Long studentId;
    private String studentName;
    private String studentCode;
    private Double bestScore;
    private Double averageScore;
    private Integer totalAttempts;
    private Integer completedAttempts;
    private Instant lastAttempt;
    private Double improvementRate; // Percentage improvement from first to last attempt
    private String performanceLevel; // "Excellent", "Good", "Needs Improvement"

    // Constructors
    public StudentPerformanceDTO() {
    }

    public StudentPerformanceDTO(Long studentId, String studentName, String studentCode) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.studentCode = studentCode;
    }

    // Getters and Setters
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

    public String getStudentCode() {
        return studentCode;
    }

    public void setStudentCode(String studentCode) {
        this.studentCode = studentCode;
    }

    public Double getBestScore() {
        return bestScore;
    }

    public void setBestScore(Double bestScore) {
        this.bestScore = bestScore;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public Integer getTotalAttempts() {
        return totalAttempts;
    }

    public void setTotalAttempts(Integer totalAttempts) {
        this.totalAttempts = totalAttempts;
    }

    public Integer getCompletedAttempts() {
        return completedAttempts;
    }

    public void setCompletedAttempts(Integer completedAttempts) {
        this.completedAttempts = completedAttempts;
    }

    public Instant getLastAttempt() {
        return lastAttempt;
    }

    public void setLastAttempt(Instant lastAttempt) {
        this.lastAttempt = lastAttempt;
    }

    public Double getImprovementRate() {
        return improvementRate;
    }

    public void setImprovementRate(Double improvementRate) {
        this.improvementRate = improvementRate;
    }

    public String getPerformanceLevel() {
        return performanceLevel;
    }

    public void setPerformanceLevel(String performanceLevel) {
        this.performanceLevel = performanceLevel;
    }

    // Helper methods
    public String calculatePerformanceLevel() {
        if (averageScore == null) {
            return "Unknown";
        }
        if (averageScore >= 85) {
            return "Excellent";
        } else if (averageScore >= 70) {
            return "Good";
        } else if (averageScore >= 50) {
            return "Average";
        } else {
            return "Needs Improvement";
        }
    }

    public Double getCompletionPercentage() {
        if (totalAttempts == null || totalAttempts == 0) {
            return 0.0;
        }
        return (double) (completedAttempts != null ? completedAttempts : 0) / totalAttempts * 100;
    }

    @Override
    public String toString() {
        return "StudentPerformanceDTO{" +
                "studentId=" + studentId +
                ", studentName='" + studentName + '\'' +
                ", studentCode='" + studentCode + '\'' +
                ", bestScore=" + bestScore +
                ", averageScore=" + averageScore +
                ", totalAttempts=" + totalAttempts +
                ", performanceLevel='" + performanceLevel + '\'' +
                '}';
    }
}