package com.satori.platform.service.dto;

import java.io.Serializable;
import java.time.LocalDate;

/**
 * DTO for time-based analytics in quiz analytics.
 */
public class TimeBasedAnalyticsDTO implements Serializable {

    private String period; // Date in ISO format (YYYY-MM-DD)
    private LocalDate date;
    private Integer attempts;
    private Double averageScore;
    private Integer uniqueStudents;
    private Integer completedAttempts;
    private Double completionRate;

    // Constructors
    public TimeBasedAnalyticsDTO() {
    }

    public TimeBasedAnalyticsDTO(String period, Integer attempts, Double averageScore, Integer uniqueStudents) {
        this.period = period;
        this.attempts = attempts;
        this.averageScore = averageScore;
        this.uniqueStudents = uniqueStudents;
    }

    // Getters and Setters
    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Integer getAttempts() {
        return attempts;
    }

    public void setAttempts(Integer attempts) {
        this.attempts = attempts;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public Integer getUniqueStudents() {
        return uniqueStudents;
    }

    public void setUniqueStudents(Integer uniqueStudents) {
        this.uniqueStudents = uniqueStudents;
    }

    public Integer getCompletedAttempts() {
        return completedAttempts;
    }

    public void setCompletedAttempts(Integer completedAttempts) {
        this.completedAttempts = completedAttempts;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    @Override
    public String toString() {
        return "TimeBasedAnalyticsDTO{" +
                "period='" + period + '\'' +
                ", attempts=" + attempts +
                ", averageScore=" + averageScore +
                ", uniqueStudents=" + uniqueStudents +
                ", completionRate=" + completionRate +
                '}';
    }
}