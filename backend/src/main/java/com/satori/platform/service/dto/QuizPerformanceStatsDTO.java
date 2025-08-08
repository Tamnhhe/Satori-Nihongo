package com.satori.platform.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for quiz performance statistics.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class QuizPerformanceStatsDTO implements Serializable {

    private Long totalAttempts;
    private Double bestScore;
    private Double averageScore;
    private Double lastScore;
    private Integer averageTimeTakenSeconds;
    private Double improvementRate;
    private String performanceTrend;
    private String recommendation;

    public Long getTotalAttempts() {
        return totalAttempts;
    }

    public void setTotalAttempts(Long totalAttempts) {
        this.totalAttempts = totalAttempts;
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

    public Double getLastScore() {
        return lastScore;
    }

    public void setLastScore(Double lastScore) {
        this.lastScore = lastScore;
    }

    public Integer getAverageTimeTakenSeconds() {
        return averageTimeTakenSeconds;
    }

    public void setAverageTimeTakenSeconds(Integer averageTimeTakenSeconds) {
        this.averageTimeTakenSeconds = averageTimeTakenSeconds;
    }

    public Double getImprovementRate() {
        return improvementRate;
    }

    public void setImprovementRate(Double improvementRate) {
        this.improvementRate = improvementRate;
    }

    public String getPerformanceTrend() {
        return performanceTrend;
    }

    public void setPerformanceTrend(String performanceTrend) {
        this.performanceTrend = performanceTrend;
    }

    public String getRecommendation() {
        return recommendation;
    }

    public void setRecommendation(String recommendation) {
        this.recommendation = recommendation;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof QuizPerformanceStatsDTO)) {
            return false;
        }

        QuizPerformanceStatsDTO that = (QuizPerformanceStatsDTO) o;
        return Objects.equals(totalAttempts, that.totalAttempts) &&
                Objects.equals(bestScore, that.bestScore) &&
                Objects.equals(averageScore, that.averageScore);
    }

    @Override
    public int hashCode() {
        return Objects.hash(totalAttempts, bestScore, averageScore);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "QuizPerformanceStatsDTO{" +
                "totalAttempts=" + getTotalAttempts() +
                ", bestScore=" + getBestScore() +
                ", averageScore=" + getAverageScore() +
                ", lastScore=" + getLastScore() +
                ", averageTimeTakenSeconds=" + getAverageTimeTakenSeconds() +
                ", improvementRate=" + getImprovementRate() +
                ", performanceTrend='" + getPerformanceTrend() + "'" +
                ", recommendation='" + getRecommendation() + "'" +
                "}";
    }
}