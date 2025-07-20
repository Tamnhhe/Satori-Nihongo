package com.satori.platform.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.satori.platform.domain.StudentQuiz} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudentQuizDTO implements Serializable {

    private Long id;

    private Instant startTime;

    private Instant endTime;

    private Double score;

    private Boolean completed;

    private QuizDTO quiz;

    private UserProfileDTO student;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public QuizDTO getQuiz() {
        return quiz;
    }

    public void setQuiz(QuizDTO quiz) {
        this.quiz = quiz;
    }

    public UserProfileDTO getStudent() {
        return student;
    }

    public void setStudent(UserProfileDTO student) {
        this.student = student;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentQuizDTO)) {
            return false;
        }

        StudentQuizDTO studentQuizDTO = (StudentQuizDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, studentQuizDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudentQuizDTO{" +
            "id=" + getId() +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            ", score=" + getScore() +
            ", completed='" + getCompleted() + "'" +
            ", quiz=" + getQuiz() +
            ", student=" + getStudent() +
            "}";
    }
}
