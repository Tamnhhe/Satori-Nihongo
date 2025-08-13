package com.satori.platform.service.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;

/**
 * DTO for Quiz Question in Builder context.
 */
public class QuizQuestionBuilderDTO implements Serializable {

    private Long questionId; // null for new questions, set for existing questions

    @NotNull
    private Integer position;

    @NotNull
    @Size(min = 1, max = 2000)
    private String content;

    @NotNull
    @Size(min = 1, max = 50)
    private String type;

    @NotNull
    @Size(min = 1, max = 500)
    private String correctAnswer;

    private String imageUrl;

    private String suggestion;

    private String answerExplanation;

    // Constructors
    public QuizQuestionBuilderDTO() {
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getSuggestion() {
        return suggestion;
    }

    public void setSuggestion(String suggestion) {
        this.suggestion = suggestion;
    }

    public String getAnswerExplanation() {
        return answerExplanation;
    }

    public void setAnswerExplanation(String answerExplanation) {
        this.answerExplanation = answerExplanation;
    }

    @Override
    public String toString() {
        return "QuizQuestionBuilderDTO{" +
                "questionId=" + questionId +
                ", position=" + position +
                ", content='" + content + '\'' +
                ", type='" + type + '\'' +
                ", correctAnswer='" + correctAnswer + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                ", suggestion='" + suggestion + '\'' +
                ", answerExplanation='" + answerExplanation + '\'' +
                '}';
    }
}