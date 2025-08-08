package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DifficultyLevel;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for content analysis results.
 */
public class ContentAnalysisResultDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private DifficultyLevel difficultyLevel;
    private List<String> keyTopics;
    private List<String> suggestedQuestionTypes;
    private Integer estimatedReadingTime;
    private Double complexityScore;

    public ContentAnalysisResultDTO() {
        // Default constructor
    }

    public DifficultyLevel getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public List<String> getKeyTopics() {
        return keyTopics;
    }

    public void setKeyTopics(List<String> keyTopics) {
        this.keyTopics = keyTopics;
    }

    public List<String> getSuggestedQuestionTypes() {
        return suggestedQuestionTypes;
    }

    public void setSuggestedQuestionTypes(List<String> suggestedQuestionTypes) {
        this.suggestedQuestionTypes = suggestedQuestionTypes;
    }

    public Integer getEstimatedReadingTime() {
        return estimatedReadingTime;
    }

    public void setEstimatedReadingTime(Integer estimatedReadingTime) {
        this.estimatedReadingTime = estimatedReadingTime;
    }

    public Double getComplexityScore() {
        return complexityScore;
    }

    public void setComplexityScore(Double complexityScore) {
        this.complexityScore = complexityScore;
    }

    @Override
    public String toString() {
        return "ContentAnalysisResultDTO{" +
                "difficultyLevel=" + difficultyLevel +
                ", keyTopics=" + keyTopics +
                ", suggestedQuestionTypes=" + suggestedQuestionTypes +
                ", estimatedReadingTime=" + estimatedReadingTime +
                ", complexityScore=" + complexityScore +
                '}';
    }
}