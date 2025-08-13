package com.satori.platform.service.dto;

import jakarta.validation.constraints.NotNull;

import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for Quiz Settings configuration.
 */
public class QuizSettingsDTO implements Serializable {

    @NotNull
    private Long quizId;

    private Integer timeLimitMinutes;

    private Boolean isActive;

    private Instant activationTime;

    private Instant deactivationTime;

    private Integer maxAttempts;

    private Boolean showResultsImmediately;

    private Boolean randomizeQuestions;

    private Boolean randomizeAnswers;

    // Constructors
    public QuizSettingsDTO() {
    }

    // Getters and Setters
    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Instant getActivationTime() {
        return activationTime;
    }

    public void setActivationTime(Instant activationTime) {
        this.activationTime = activationTime;
    }

    public Instant getDeactivationTime() {
        return deactivationTime;
    }

    public void setDeactivationTime(Instant deactivationTime) {
        this.deactivationTime = deactivationTime;
    }

    public Integer getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(Integer maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public Boolean getShowResultsImmediately() {
        return showResultsImmediately;
    }

    public void setShowResultsImmediately(Boolean showResultsImmediately) {
        this.showResultsImmediately = showResultsImmediately;
    }

    public Boolean getRandomizeQuestions() {
        return randomizeQuestions;
    }

    public void setRandomizeQuestions(Boolean randomizeQuestions) {
        this.randomizeQuestions = randomizeQuestions;
    }

    public Boolean getRandomizeAnswers() {
        return randomizeAnswers;
    }

    public void setRandomizeAnswers(Boolean randomizeAnswers) {
        this.randomizeAnswers = randomizeAnswers;
    }

    @Override
    public String toString() {
        return "QuizSettingsDTO{" +
                "quizId=" + quizId +
                ", timeLimitMinutes=" + timeLimitMinutes +
                ", isActive=" + isActive +
                ", maxAttempts=" + maxAttempts +
                '}';
    }
}