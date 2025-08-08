package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.satori.platform.domain.enumeration.DifficultyLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FlashcardSession.
 */
@Entity
@Table(name = "flashcard_session")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FlashcardSession implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "session_date", nullable = false)
    private LocalDateTime sessionDate;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "cards_studied")
    private Integer cardsStudied;

    @Column(name = "correct_answers")
    private Integer correctAnswers;

    @Column(name = "incorrect_answers")
    private Integer incorrectAnswers;

    @Column(name = "accuracy_percentage")
    private Double accuracyPercentage;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level")
    private DifficultyLevel difficultyLevel;

    @Column(name = "next_review_date")
    private LocalDateTime nextReviewDate;

    @Column(name = "completed")
    private Boolean completed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "userProfile", "classes", "flashcardSessions", "studentProgress" }, allowSetters = true)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "flashcards", "course", "quizzes", "fileAttachments", "flashcardSessions" }, allowSetters = true)
    private Lesson lesson;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FlashcardSession id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getSessionDate() {
        return this.sessionDate;
    }

    public FlashcardSession sessionDate(LocalDateTime sessionDate) {
        this.setSessionDate(sessionDate);
        return this;
    }

    public void setSessionDate(LocalDateTime sessionDate) {
        this.sessionDate = sessionDate;
    }

    public Integer getDurationMinutes() {
        return this.durationMinutes;
    }

    public FlashcardSession durationMinutes(Integer durationMinutes) {
        this.setDurationMinutes(durationMinutes);
        return this;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Integer getCardsStudied() {
        return this.cardsStudied;
    }

    public FlashcardSession cardsStudied(Integer cardsStudied) {
        this.setCardsStudied(cardsStudied);
        return this;
    }

    public void setCardsStudied(Integer cardsStudied) {
        this.cardsStudied = cardsStudied;
    }

    public Integer getCorrectAnswers() {
        return this.correctAnswers;
    }

    public FlashcardSession correctAnswers(Integer correctAnswers) {
        this.setCorrectAnswers(correctAnswers);
        return this;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Integer getIncorrectAnswers() {
        return this.incorrectAnswers;
    }

    public FlashcardSession incorrectAnswers(Integer incorrectAnswers) {
        this.setIncorrectAnswers(incorrectAnswers);
        return this;
    }

    public void setIncorrectAnswers(Integer incorrectAnswers) {
        this.incorrectAnswers = incorrectAnswers;
    }

    public Double getAccuracyPercentage() {
        return this.accuracyPercentage;
    }

    public FlashcardSession accuracyPercentage(Double accuracyPercentage) {
        this.setAccuracyPercentage(accuracyPercentage);
        return this;
    }

    public void setAccuracyPercentage(Double accuracyPercentage) {
        this.accuracyPercentage = accuracyPercentage;
    }

    public DifficultyLevel getDifficultyLevel() {
        return this.difficultyLevel;
    }

    public FlashcardSession difficultyLevel(DifficultyLevel difficultyLevel) {
        this.setDifficultyLevel(difficultyLevel);
        return this;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public LocalDateTime getNextReviewDate() {
        return this.nextReviewDate;
    }

    public FlashcardSession nextReviewDate(LocalDateTime nextReviewDate) {
        this.setNextReviewDate(nextReviewDate);
        return this;
    }

    public void setNextReviewDate(LocalDateTime nextReviewDate) {
        this.nextReviewDate = nextReviewDate;
    }

    public Boolean getCompleted() {
        return this.completed;
    }

    public FlashcardSession completed(Boolean completed) {
        this.setCompleted(completed);
        return this;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public StudentProfile getStudent() {
        return this.student;
    }

    public void setStudent(StudentProfile studentProfile) {
        this.student = studentProfile;
    }

    public FlashcardSession student(StudentProfile studentProfile) {
        this.setStudent(studentProfile);
        return this;
    }

    public Lesson getLesson() {
        return this.lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public FlashcardSession lesson(Lesson lesson) {
        this.setLesson(lesson);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FlashcardSession)) {
            return false;
        }
        return getId() != null && getId().equals(((FlashcardSession) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FlashcardSession{" +
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
            "}";
    }
}