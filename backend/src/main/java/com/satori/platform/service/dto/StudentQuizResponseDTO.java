package com.satori.platform.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;
import jakarta.validation.constraints.*;

/**
 * A DTO for the {@link com.satori.platform.domain.StudentQuizResponse} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudentQuizResponseDTO implements Serializable {

    private Long id;

    @NotNull
    private String studentAnswer;

    private Boolean isCorrect;

    private Instant responseTime;

    private Integer timeSpentSeconds;

    private Long studentQuizId;

    private Long quizQuestionId;

    private QuizQuestionDTO quizQuestion;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentAnswer() {
        return studentAnswer;
    }

    public void setStudentAnswer(String studentAnswer) {
        this.studentAnswer = studentAnswer;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Instant getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(Instant responseTime) {
        this.responseTime = responseTime;
    }

    public Integer getTimeSpentSeconds() {
        return timeSpentSeconds;
    }

    public void setTimeSpentSeconds(Integer timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
    }

    public Long getStudentQuizId() {
        return studentQuizId;
    }

    public void setStudentQuizId(Long studentQuizId) {
        this.studentQuizId = studentQuizId;
    }

    public Long getQuizQuestionId() {
        return quizQuestionId;
    }

    public void setQuizQuestionId(Long quizQuestionId) {
        this.quizQuestionId = quizQuestionId;
    }

    public QuizQuestionDTO getQuizQuestion() {
        return quizQuestion;
    }

    public void setQuizQuestion(QuizQuestionDTO quizQuestion) {
        this.quizQuestion = quizQuestion;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentQuizResponseDTO)) {
            return false;
        }

        StudentQuizResponseDTO studentQuizResponseDTO = (StudentQuizResponseDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, studentQuizResponseDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudentQuizResponseDTO{" +
                "id=" + getId() +
                ", studentAnswer='" + getStudentAnswer() + "'" +
                ", isCorrect='" + getIsCorrect() + "'" +
                ", responseTime='" + getResponseTime() + "'" +
                ", timeSpentSeconds=" + getTimeSpentSeconds() +
                ", studentQuizId=" + getStudentQuizId() +
                ", quizQuestionId=" + getQuizQuestionId() +
                "}";
    }
}