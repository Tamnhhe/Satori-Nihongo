package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DifficultyLevel;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.satori.platform.domain.FlashcardSession} entity.
 */
public class FlashcardSessionDTO implements Serializable {

    private Long id;

    @NotNull
    private LocalDateTime sessionDate;

    private Integer durationMinutes;

    private Integer cardsStudied;

    private Integer correctAnswers;

    private Integer incorrectAnswers;

    private Double accuracyPercentage;

    private DifficultyLevel difficultyLevel;

    private LocalDateTime nextReviewDate;

    private Boolean completed;

    private StudentProfileDTO student;

    private LessonDTO lesson;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getSessionDate() {
        return sessionDate;
    }

    public void setSessionDate(LocalDateTime sessionDate) {
        this.sessionDate = sessionDate;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getCardsStudied() {
        return cardsStudied;
    }

    public void setCardsStudied(Integer cardsStudied) {
        this.cardsStudied = cardsStudied;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getIncorrectAnswers() {
        return incorrectAnswers;
    }

    public void setIncorrectAnswers(Integer incorrectAnswers) {
        this.incorrectAnswers = incorrectAnswers;
    }

    public Double getAccuracyPercentage() {
        return accuracyPercentage;
    }

    public void setAccuracyPercentage(Double accuracyPercentage) {
        this.accuracyPercentage = accuracyPercentage;
    }

    public DifficultyLevel getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public LocalDateTime getNextReviewDate() {
        return nextReviewDate;
    }

    public void setNextReviewDate(LocalDateTime nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public StudentProfileDTO getStudent() {
        return student;
    }

    public void setStudent(StudentProfileDTO student) {
        this.student = student;
    }

    public LessonDTO getLesson() {
        return lesson;
    }

    public void setLesson(LessonDTO lesson) {
        this.lesson = lesson;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FlashcardSessionDTO)) {
            return false;
        }

        FlashcardSessionDTO flashcardSessionDTO = (FlashcardSessionDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, flashcardSessionDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    @Override
    public String toString() {
        return "FlashcardSessionDTO{" +
                "id=" + getId() +
                ", sessionDate='" + getSessionDate() + "'" +
                ", durationMinutes=" + getDurationMinutes() +
                ", cardsStudied=" + getCardsStudied() +
                ", correctAnswers=" + getCorrectAnswers() +
                ", incorrectAnswers=" + getIncorrectAnswers() +
                ", accuracyPercentage=" + getAccuracyPercentage() +
                ", difficultyLevel='" + getDifficultyLevel() + "'" +
                ", nextReviewDate='" + getNextReviewDate() + "'" +
                ", completed='" + getCompleted() + "'" +
                ", student=" + getStudent() +
                ", lesson=" + getLesson() +
                "}";
    }
}