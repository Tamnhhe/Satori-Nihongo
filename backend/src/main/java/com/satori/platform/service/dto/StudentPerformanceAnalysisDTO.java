package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DifficultyLevel;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for student performance analysis results.
 */
public class StudentPerformanceAnalysisDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long studentId;
    private List<String> weakAreas;
    private List<String> strongAreas;
    private DifficultyLevel recommendedDifficulty;
    private Double recentPerformanceTrend;
    private Double overallPerformanceScore;
    private Integer totalQuizzesTaken;
    private Double averageScore;

    public StudentPerformanceAnalysisDTO() {
        // Default constructor
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public List<String> getWeakAreas() {
        return weakAreas;
    }

    public void setWeakAreas(List<String> weakAreas) {
        this.weakAreas = weakAreas;
    }

    public List<String> getStrongAreas() {
        return strongAreas;
    }

    public void setStrongAreas(List<String> strongAreas) {
        this.strongAreas = strongAreas;
    }

    public DifficultyLevel getRecommendedDifficulty() {
        return recommendedDifficulty;
    }

    public void setRecommendedDifficulty(DifficultyLevel recommendedDifficulty) {
        this.recommendedDifficulty = recommendedDifficulty;
    }

    public Double getRecentPerformanceTrend() {
        return recentPerformanceTrend;
    }

    public void setRecentPerformanceTrend(Double recentPerformanceTrend) {
        this.recentPerformanceTrend = recentPerformanceTrend;
    }

    public Double getOverallPerformanceScore() {
        return overallPerformanceScore;
    }

    public void setOverallPerformanceScore(Double overallPerformanceScore) {
        this.overallPerformanceScore = overallPerformanceScore;
    }

    public Integer getTotalQuizzesTaken() {
        return totalQuizzesTaken;
    }

    public void setTotalQuizzesTaken(Integer totalQuizzesTaken) {
        this.totalQuizzesTaken = totalQuizzesTaken;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    @Override
    public String toString() {
        return "StudentPerformanceAnalysisDTO{" +
                "studentId=" + studentId +
                ", weakAreas=" + weakAreas +
                ", strongAreas=" + strongAreas +
                ", recommendedDifficulty=" + recommendedDifficulty +
                ", recentPerformanceTrend=" + recentPerformanceTrend +
                ", overallPerformanceScore=" + overallPerformanceScore +
                ", totalQuizzesTaken=" + totalQuizzesTaken +
                ", averageScore=" + averageScore +
                '}';
    }
}