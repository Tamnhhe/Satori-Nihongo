package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DifficultyLevel;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for question quality assessment results.
 */
public class QuestionQualityAssessmentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String questionId;
    private Double qualityScore;
    private Boolean isAcceptable;
    private List<String> issues;
    private List<String> suggestions;
    private DifficultyLevel assessedDifficulty;

    public QuestionQualityAssessmentDTO() {
        // Default constructor
    }

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
    }

    public Double getQualityScore() {
        return qualityScore;
    }

    public void setQualityScore(Double qualityScore) {
        this.qualityScore = qualityScore;
    }

    public Boolean getIsAcceptable() {
        return isAcceptable;
    }

    public void setIsAcceptable(Boolean isAcceptable) {
        this.isAcceptable = isAcceptable;
    }

    public List<String> getIssues() {
        return issues;
    }

    public void setIssues(List<String> issues) {
        this.issues = issues;
    }

    public List<String> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<String> suggestions) {
        this.suggestions = suggestions;
    }

    public DifficultyLevel getAssessedDifficulty() {
        return assessedDifficulty;
    }

    public void setAssessedDifficulty(DifficultyLevel assessedDifficulty) {
        this.assessedDifficulty = assessedDifficulty;
    }

    @Override
    public String toString() {
        return "QuestionQualityAssessmentDTO{" +
                "questionId='" + questionId + '\'' +
                ", qualityScore=" + qualityScore +
                ", isAcceptable=" + isAcceptable +
                ", issues=" + issues +
                ", suggestions=" + suggestions +
                ", assessedDifficulty=" + assessedDifficulty +
                '}';
    }
}