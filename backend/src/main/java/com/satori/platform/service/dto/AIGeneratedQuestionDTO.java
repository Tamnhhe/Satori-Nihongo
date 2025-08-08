package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DifficultyLevel;

import java.io.Serializable;

/**
 * DTO for AI-generated questions.
 */
public class AIGeneratedQuestionDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String content;
    private String correctAnswer;
    private String type;
    private String explanation;
    private String hint;
    private String imageUrl;
    private DifficultyLevel difficultyLevel;
    private Double confidenceScore;
    
    public AIGeneratedQuestionDTO() {
        // Default constructor
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public DifficultyLevel getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Double getConfidenceScore() {
        return confidenceScore;
    }

    public void setConfidenceScore(Double confidenceScore) {
        this.confidenceScore = confidenceScore;
    }

    @Override
    public String toString() {
        return "AIGeneratedQuestionDTO{" +
                "id='" + id + '\'' +
                ", content='" + content + '\'' +
                ", correctAnswer='" + correctAnswer + '\'' +
                ", type='" + type + '\'' +
                ", explanation='" + explanation + '\'' +
                ", hint='" + hint + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", difficultyLevel=" + difficultyLevel +
                ", confidenceScore=" + confidenceScore +
                '}';
    }
}