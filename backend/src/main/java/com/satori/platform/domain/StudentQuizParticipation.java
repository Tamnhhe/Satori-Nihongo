package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StudentQuizParticipation entity for tracking student participation in
 * quizzes.
 */
@Entity
@Table(name = "student_quiz_participation")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudentQuizParticipation implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "participation_date")
    private Instant participationDate;

    @Column(name = "completion_status")
    private String completionStatus;

    @Column(name = "score")
    private Double score;

    @Column(name = "time_spent_minutes")
    private Integer timeSpentMinutes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "quiz", "student", "responses" }, allowSetters = true)
    private StudentQuiz studentQuiz;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StudentQuizParticipation id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getParticipationDate() {
        return this.participationDate;
    }

    public StudentQuizParticipation participationDate(Instant participationDate) {
        this.setParticipationDate(participationDate);
        return this;
    }

    public void setParticipationDate(Instant participationDate) {
        this.participationDate = participationDate;
    }

    public String getCompletionStatus() {
        return this.completionStatus;
    }

    public StudentQuizParticipation completionStatus(String completionStatus) {
        this.setCompletionStatus(completionStatus);
        return this;
    }

    public void setCompletionStatus(String completionStatus) {
        this.completionStatus = completionStatus;
    }

    public Double getScore() {
        return this.score;
    }

    public StudentQuizParticipation score(Double score) {
        this.setScore(score);
        return this;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Integer getTimeSpentMinutes() {
        return this.timeSpentMinutes;
    }

    public StudentQuizParticipation timeSpentMinutes(Integer timeSpentMinutes) {
        this.setTimeSpentMinutes(timeSpentMinutes);
        return this;
    }

    public void setTimeSpentMinutes(Integer timeSpentMinutes) {
        this.timeSpentMinutes = timeSpentMinutes;
    }

    public StudentQuiz getStudentQuiz() {
        return this.studentQuiz;
    }

    public void setStudentQuiz(StudentQuiz studentQuiz) {
        this.studentQuiz = studentQuiz;
    }

    public StudentQuizParticipation studentQuiz(StudentQuiz studentQuiz) {
        this.setStudentQuiz(studentQuiz);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentQuizParticipation)) {
            return false;
        }
        return getId() != null && getId().equals(((StudentQuizParticipation) o).getId());
    }

    @Override
    public int hashCode() {
        // see
        // https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudentQuizParticipation{" +
                "id=" + getId() +
                ", participationDate='" + getParticipationDate() + "'" +
                ", completionStatus='" + getCompletionStatus() + "'" +
                ", score=" + getScore() +
                ", timeSpentMinutes=" + getTimeSpentMinutes() +
                "}";
    }
}