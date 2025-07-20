package com.satori.platform.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.satori.platform.domain.QuizQuestion} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class QuizQuestionDTO implements Serializable {

    private Long id;

    @NotNull
    private Integer position;

    private QuizDTO quiz;

    private QuestionDTO question;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public QuizDTO getQuiz() {
        return quiz;
    }

    public void setQuiz(QuizDTO quiz) {
        this.quiz = quiz;
    }

    public QuestionDTO getQuestion() {
        return question;
    }

    public void setQuestion(QuestionDTO question) {
        this.question = question;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof QuizQuestionDTO)) {
            return false;
        }

        QuizQuestionDTO quizQuestionDTO = (QuizQuestionDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, quizQuestionDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "QuizQuestionDTO{" +
            "id=" + getId() +
            ", position=" + getPosition() +
            ", quiz=" + getQuiz() +
            ", question=" + getQuestion() +
            "}";
    }
}
