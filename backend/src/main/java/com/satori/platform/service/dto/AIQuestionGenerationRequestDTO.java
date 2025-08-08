package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DifficultyLevel;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for AI question generation requests.
 */
public class AIQuestionGenerationRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String content;
    private Integer questionCount;
    private DifficultyLevel difficultyLevel;
    private Boolean includeImages;
    private List<String> weakAreas;
    private Boolean focusOnWeakAreas;
    private List<String> preferredQuestionTypes;

    public AIQuestionGenerationRequestDTO() {
        // Default constructor
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Integer getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }

    public DifficultyLevel getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Boolean getIncludeImages() {
        return includeImages;
    }

    public void setIncludeImages(Boolean includeImages) {
        this.includeImages = includeImages;
    }

    public List<String> getWeakAreas() {
        return weakAreas;
    }

    public void setWeakAreas(List<String> weakAreas) {
        this.weakAreas = weakAreas;
    }

    public Boolean getFocusOnWeakAreas() {
        return focusOnWeakAreas;
    }

    public void setFocusOnWeakAreas(Boolean focusOnWeakAreas) {
        this.focusOnWeakAreas = focusOnWeakAreas;
    }

    public List<String> getPreferredQuestionTypes() {
        return preferredQuestionTypes;
    }

    public void setPreferredQuestionTypes(List<String> preferredQuestionTypes) {
        this.preferredQuestionTypes = preferredQuestionTypes;
    }

    @Override
    public String toString() {
        return "AIQuestionGenerationRequestDTO{" +
                "content='" + content + '\'' +
                ", questionCount=" + questionCount +
                ", difficultyLevel=" + difficultyLevel +
                ", includeImages=" + includeImages +
                ", weakAreas=" + weakAreas +
                ", focusOnWeakAreas=" + focusOnWeakAreas +
                ", preferredQuestionTypes=" + preferredQuestionTypes +
                '}';
    }
}