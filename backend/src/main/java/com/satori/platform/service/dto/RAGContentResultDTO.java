package com.satori.platform.service.dto;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for RAG content retrieval results.
 */
public class RAGContentResultDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String contentId;
    private String title;
    private String content;
    private String contentType; // "lesson", "example", "explanation", "definition"
    private String source; // course/lesson reference
    private Double relevanceScore;
    private List<String> topics;
    private String difficultyLevel;

    public RAGContentResultDTO() {
        // Default constructor
    }

    // Getters and setters
    public String getContentId() {
        return contentId;
    }

    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getContentType() {
        return contentType;
    }

    public void setContentType(String contentType) {
        this.contentType = contentType;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public Double getRelevanceScore() {
        return relevanceScore;
    }

    public void setRelevanceScore(Double relevanceScore) {
        this.relevanceScore = relevanceScore;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    @Override
    public String toString() {
        return "RAGContentResultDTO{" +
                "contentId='" + contentId + '\'' +
                ", title='" + title + '\'' +
                ", contentType='" + contentType + '\'' +
                ", source='" + source + '\'' +
                ", relevanceScore=" + relevanceScore +
                ", difficultyLevel='" + difficultyLevel + '\'' +
                '}';
    }
}