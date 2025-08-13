package com.satori.platform.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import java.util.Map;

/**
 * DTO for Quiz Analytics.
 */
public class QuizAnalyticsDTO implements Serializable {

    private Long quizId;
    private String quizTitle;
    private Integer totalAttempts;
    private Integer completedAttempts;
    private Integer uniqueStudents;
    private Double averageScore;
    private Double highestScore;
    private Double lowestScore;
    private Double completionRate;
    private Double averageTimeSpent; // in minutes
    private Instant lastAttempt;

    // Score distribution
    private Map<String, Integer> scoreDistribution; // e.g., "0-20": 5, "21-40": 10, etc.

    // Question-level analytics
    private List<QuestionAnalyticsDTO> questionAnalytics;

    // Time-based analytics
    private List<TimeBasedAnalyticsDTO> timeBasedAnalytics;

    // Student performance
    private List<StudentPerformanceDTO> topPerformers;
    private List<StudentPerformanceDTO> strugglingStudents;

    // Constructors
    public QuizAnalyticsDTO() {
    }

    // Getters and Setters
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

    public Integer getUniqueStudents() {
        return uniqueStudents;
    }

    public void setUniqueStudents(Integer uniqueStudents) {
        this.uniqueStudents = uniqueStudents;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public Double getHighestScore() {
        return highestScore;
    }

    public void setHighestScore(Double highestScore) {
        this.highestScore = highestScore;
    }

    public Double getLowestScore() {
        return lowestScore;
    }

    public void setLowestScore(Double lowestScore) {
        this.lowestScore = lowestScore;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public Double getAverageTimeSpent() {
        return averageTimeSpent;
    }

    public void setAverageTimeSpent(Double averageTimeSpent) {
        this.averageTimeSpent = averageTimeSpent;
    }

    public Instant getLastAttempt() {
        return lastAttempt;
    }

    public void setLastAttempt(Instant lastAttempt) {
        this.lastAttempt = lastAttempt;
    }

    public Map<String, Integer> getScoreDistribution() {
        return scoreDistribution;
    }

    public void setScoreDistribution(Map<String, Integer> scoreDistribution) {
        this.scoreDistribution = scoreDistribution;
    }

    public List<QuestionAnalyticsDTO> getQuestionAnalytics() {
        return questionAnalytics;
    }

    public void setQuestionAnalytics(List<QuestionAnalyticsDTO> questionAnalytics) {
        this.questionAnalytics = questionAnalytics;
    }

    public List<TimeBasedAnalyticsDTO> getTimeBasedAnalytics() {
        return timeBasedAnalytics;
    }

    public void setTimeBasedAnalytics(List<TimeBasedAnalyticsDTO> timeBasedAnalytics) {
        this.timeBasedAnalytics = timeBasedAnalytics;
    }

    public List<StudentPerformanceDTO> getTopPerformers() {
        return topPerformers;
    }

    public void setTopPerformers(List<StudentPerformanceDTO> topPerformers) {
        this.topPerformers = topPerformers;
    }

    public List<StudentPerformanceDTO> getStrugglingStudents() {
        return strugglingStudents;
    }

    public void setStrugglingStudents(List<StudentPerformanceDTO> strugglingStudents) {
        this.strugglingStudents = strugglingStudents;
    }

    // Builder pattern for better readability
    public static class Builder {
        private final QuizAnalyticsDTO dto = new QuizAnalyticsDTO();

        public Builder quizId(Long quizId) {
            dto.setQuizId(quizId);
            return this;
        }

        public Builder quizTitle(String quizTitle) {
            dto.setQuizTitle(quizTitle);
            return this;
        }

        public Builder totalAttempts(Integer totalAttempts) {
            dto.setTotalAttempts(totalAttempts);
            return this;
        }

        public Builder completedAttempts(Integer completedAttempts) {
            dto.setCompletedAttempts(completedAttempts);
            return this;
        }

        public Builder uniqueStudents(Integer uniqueStudents) {
            dto.setUniqueStudents(uniqueStudents);
            return this;
        }

        public Builder averageScore(Double averageScore) {
            dto.setAverageScore(averageScore);
            return this;
        }

        public Builder completionRate(Double completionRate) {
            dto.setCompletionRate(completionRate);
            return this;
        }

        public Builder scoreDistribution(Map<String, Integer> scoreDistribution) {
            dto.setScoreDistribution(scoreDistribution);
            return this;
        }

        public Builder questionAnalytics(List<QuestionAnalyticsDTO> questionAnalytics) {
            dto.setQuestionAnalytics(questionAnalytics);
            return this;
        }

        public Builder timeBasedAnalytics(List<TimeBasedAnalyticsDTO> timeBasedAnalytics) {
            dto.setTimeBasedAnalytics(timeBasedAnalytics);
            return this;
        }

        public Builder topPerformers(List<StudentPerformanceDTO> topPerformers) {
            dto.setTopPerformers(topPerformers);
            return this;
        }

        public Builder strugglingStudents(List<StudentPerformanceDTO> strugglingStudents) {
            dto.setStrugglingStudents(strugglingStudents);
            return this;
        }

        public QuizAnalyticsDTO build() {
            return dto;
        }
    }

    public static Builder builder() {
        return new Builder();
    }

    // Helper methods for common calculations
    public Double getSuccessRate() {
        if (totalAttempts == null || totalAttempts == 0) {
            return 0.0;
        }
        return (double) (completedAttempts != null ? completedAttempts : 0) / totalAttempts * 100;
    }

    public String getPerformanceLevel() {
        if (averageScore == null) {
            return "No Data";
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

    @Override
    public String toString() {
        return "QuizAnalyticsDTO{" +
                "quizId=" + quizId +
                ", quizTitle='" + quizTitle + '\'' +
                ", totalAttempts=" + totalAttempts +
                ", completedAttempts=" + completedAttempts +
                ", uniqueStudents=" + uniqueStudents +
                ", averageScore=" + averageScore +
                ", completionRate=" + completionRate +
                ", averageTimeSpent=" + averageTimeSpent +
                ", performanceLevel='" + getPerformanceLevel() + '\'' +
                '}';
    }
}