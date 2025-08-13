package com.satori.platform.service.dto;

import jakarta.validation.constraints.NotNull;

import java.io.Serializable;

/**
 * DTO for reordering questions in a quiz.
 */
public class QuestionOrderDTO implements Serializable {

    @NotNull
    private Long questionId;

    @NotNull
    private Integer position;

    // Constructors
    public QuestionOrderDTO() {
    }

    public QuestionOrderDTO(Long questionId, Integer position) {
        this.questionId = questionId;
        this.position = position;
    }

    // Getters and Setters
    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    @Override
    public String toString() {
        return "QuestionOrderDTO{" +
                "questionId=" + questionId +
                ", position=" + position +
                '}';
    }
}