package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StudentQuizResponse - stores individual question responses for a student
 * quiz attempt.
 */
@Entity
@Table(name = "student_quiz_response")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudentQuizResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "student_answer", nullable = false)
    private String studentAnswer;

    @Column(name = "selected_answer")
    private String selectedAnswer;

    @Column(name = "is_correct")
    private Boolean isCorrect;

    @Column(name = "response_time")
    private Instant responseTime;

    @Column(name = "time_spent_seconds")
    private Integer timeSpentSeconds;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    @JsonIgnoreProperties(value = { "quiz", "student", "responses" }, allowSetters = true)
    private StudentQuiz studentQuiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @NotNull
    @JsonIgnoreProperties(value = { "quiz", "question" }, allowSetters = true)
    private QuizQuestion quizQuestion;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StudentQuizResponse id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentAnswer() {
        return this.studentAnswer;
    }

    public StudentQuizResponse studentAnswer(String studentAnswer) {
        this.setStudentAnswer(studentAnswer);
        return this;
    }

    public void setStudentAnswer(String studentAnswer) {
        this.studentAnswer = studentAnswer;
    }

    public String getSelectedAnswer() {
        return this.selectedAnswer;
    }

    public StudentQuizResponse selectedAnswer(String selectedAnswer) {
        this.setSelectedAnswer(selectedAnswer);
        return this;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }

    public Boolean getIsCorrect() {
        return this.isCorrect;
    }

    public StudentQuizResponse isCorrect(Boolean isCorrect) {
        this.setIsCorrect(isCorrect);
        return this;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public Instant getResponseTime() {
        return this.responseTime;
    }

    public StudentQuizResponse responseTime(Instant responseTime) {
        this.setResponseTime(responseTime);
        return this;
    }

    public void setResponseTime(Instant responseTime) {
        this.responseTime = responseTime;
    }

    public Integer getTimeSpentSeconds() {
        return this.timeSpentSeconds;
    }

    public StudentQuizResponse timeSpentSeconds(Integer timeSpentSeconds) {
        this.setTimeSpentSeconds(timeSpentSeconds);
        return this;
    }

    public void setTimeSpentSeconds(Integer timeSpentSeconds) {
        this.timeSpentSeconds = timeSpentSeconds;
    }

    public StudentQuiz getStudentQuiz() {
        return this.studentQuiz;
    }

    public void setStudentQuiz(StudentQuiz studentQuiz) {
        this.studentQuiz = studentQuiz;
    }

    public StudentQuizResponse studentQuiz(StudentQuiz studentQuiz) {
        this.setStudentQuiz(studentQuiz);
        return this;
    }

    public QuizQuestion getQuizQuestion() {
        return this.quizQuestion;
    }

    public void setQuizQuestion(QuizQuestion quizQuestion) {
        this.quizQuestion = quizQuestion;
    }

    public StudentQuizResponse quizQuestion(QuizQuestion quizQuestion) {
        this.setQuizQuestion(quizQuestion);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentQuizResponse)) {
            return false;
        }
        return getId() != null && getId().equals(((StudentQuizResponse) o).getId());
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
        return "StudentQuizResponse{" +
                "id=" + getId() +
                ", studentAnswer='" + getStudentAnswer() + "'" +
                ", isCorrect='" + getIsCorrect() + "'" +
                ", responseTime='" + getResponseTime() + "'" +
                ", timeSpentSeconds=" + getTimeSpentSeconds() +
                "}";
    }
}