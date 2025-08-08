package com.satori.platform.service.dto;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for RAG content retrieval requests.
 */
public class RAGContentRequestDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private String query;
    private Long courseId;
    private Long lessonId;
    private List<String> topics;
    private List<String> weakAreas;
    private String difficultyLevel;
    private Integer maxResults;
    private Double similarityThreshold;

    public RAGContentRequestDTO() {
        this.maxResults = 10;
        this.similarityThreshold = 0.7;
    }

    // Getters and setters
    public String getQuery() {
        return query;
    }

    public void setQuery(String query) {
        this.query = query;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public List<String> getTopics() {
        return topics;
    }

    public void setTopics(List<String> topics) {
        this.topics = topics;
    }

    public List<String> getWeakAreas() {
        return weakAreas;
    }

    public void setWeakAreas(List<String> weakAreas) {
        this.weakAreas = weakAreas;
    }

    public String getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(String difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Integer getMaxResults() {
        return maxResults;
    }

    public void setMaxResults(Integer maxResults) {
        this.maxResults = maxResults;
    }

    public Double getSimilarityThreshold() {
        return similarityThreshold;
    }

    public void setSimilarityThreshold(Double similarityThreshold) {
        this.similarityThreshold = similarityThreshold;
    }
}