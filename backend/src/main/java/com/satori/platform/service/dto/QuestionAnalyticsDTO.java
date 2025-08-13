package com.satori.platform.service.dto;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

/**
 * DTO for question-level analytics in quiz analytics.
 */
public class QuestionAnalyticsDTO implements Serializable {

    private Long questionId;
    private String questionContent;
    private String questionType;
    private Integer totalAnswers;
    private Integer correctAnswers;
    private Double correctPercentage;
    private Map<String, Integer> answerDistribution;
    private List<String> commonWrongAnswers;
    private Double averageTimeSpent; // in seconds

    // Constructors
    public QuestionAnalyticsDTO() {
    }

    public QuestionAnalyticsDTO(Long questionId, String questionContent, String questionType) {
        this.questionId = questionId;
        this.questionContent = questionContent;
        this.questionType = questionType;
    }

    // Getters and Setters
    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getQuestionContent() {
        return questionContent;
    }

    public void setQuestionContent(String questionContent) {
        this.questionContent = questionContent;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }

    public Integer getTotalAnswers() {
        return totalAnswers;
    }

    public void setTotalAnswers(Integer totalAnswers) {
        this.totalAnswers = totalAnswers;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Double getCorrectPercentage() {
        return correctPercentage;
    }

    public void setCorrectPercentage(Double correctPercentage) {
        this.correctPercentage = correctPercentage;
    }

    public Map<String, Integer> getAnswerDistribution() {
        return answerDistribution;
    }

    public void setAnswerDistribution(Map<String, Integer> answerDistribution) {
        this.answerDistribution = answerDistribution;
    }

    public List<String> getCommonWrongAnswers() {
        return commonWrongAnswers;
    }

    public void setCommonWrongAnswers(List<String> commonWrongAnswers) {
        this.commonWrongAnswers = commonWrongAnswers;
    }

    public Double getAverageTimeSpent() {
        return averageTimeSpent;
    }

    public void setAverageTimeSpent(Double averageTimeSpent) {
        this.averageTimeSpent = averageTimeSpent;
    }

    // Helper methods
    public String getDifficultyLevel() {
        if (correctPercentage == null) {
            return "Unknown";
        }
        if (correctPercentage > 80) {
            return "Easy";
        } else if (correctPercentage > 50) {
            return "Medium";
        } else {
            return "Hard";
        }
    }

    @Override
    public String toString() {
        return "QuestionAnalyticsDTO{" +
                "questionId=" + questionId +
                ", questionContent='" + questionContent + '\'' +
                ", questionType='" + questionType + '\'' +
                ", totalAnswers=" + totalAnswers +
                ", correctAnswers=" + correctAnswers +
                ", correctPercentage=" + correctPercentage +
                '}';
    }
}