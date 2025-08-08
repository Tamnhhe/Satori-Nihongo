package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StudentQuiz.
 */
@Entity
@Table(name = "student_quiz")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudentQuiz implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Column(name = "score")
    private Double score;

    @Column(name = "completed")
    private Boolean completed;

    @Column(name = "paused")
    private Boolean paused = false;

    @Column(name = "pause_time")
    private Instant pauseTime;

    @Column(name = "resume_time")
    private Instant resumeTime;

    @Column(name = "total_pause_duration_seconds")
    private Integer totalPauseDurationSeconds = 0;

    @Column(name = "submitted_automatically")
    private Boolean submittedAutomatically = false;

    @Column(name = "current_question_index")
    private Integer currentQuestionIndex = 0;

    @Column(name = "total_questions")
    private Integer totalQuestions;

    @Column(name = "correct_answers")
    private Integer correctAnswers = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "questions", "assignedTos", "courses", "lessons" }, allowSetters = true)
    private Quiz quiz;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "teacherProfile", "studentProfile", "createdCourses", "quizAttempts" }, allowSetters = true)
    private UserProfile student;

     @OneToMany(fetch = FetchType.LAZY, mappedBy = "studentQuiz")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "studentQuiz", "quizQuestion" }, allowSetters = true)
    private Set<StudentQuizResponse> responses = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StudentQuiz id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getStartTime() {
        return this.startTime;
    }

    public StudentQuiz startTime(Instant startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return this.endTime;
    }

    public StudentQuiz endTime(Instant endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public Double getScore() {
        return this.score;
    }

    public StudentQuiz score(Double score) {
        this.setScore(score);
        return this;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Boolean getCompleted() {
        return this.completed;
    }

    public StudentQuiz completed(Boolean completed) {
        this.setCompleted(completed);
        return this;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Quiz getQuiz() {
        return this.quiz;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }

    public StudentQuiz quiz(Quiz quiz) {
        this.setQuiz(quiz);
        return this;
    }

    public UserProfile getStudent() {
        return this.student;
    }

    public void setStudent(UserProfile userProfile) {
        this.student = userProfile;
    }

    public StudentQuiz student(UserProfile userProfile) {
        this.setStudent(userProfile);
        return this;
    }

    public Boolean getPaused() {
        return this.paused;
    }

    public StudentQuiz paused(Boolean paused) {
        this.setPaused(paused);
        return this;
    }

    public void setPaused(Boolean paused) {
        this.paused = paused;
    }

    public Instant getPauseTime() {
        return this.pauseTime;
    }

    public StudentQuiz pauseTime(Instant pauseTime) {
        this.setPauseTime(pauseTime);
        return this;
    }

    public void setPauseTime(Instant pauseTime) {
        this.pauseTime = pauseTime;
    }

    public Instant getResumeTime() {
        return this.resumeTime;
    }

    public StudentQuiz resumeTime(Instant resumeTime) {
        this.setResumeTime(resumeTime);
        return this;
    }

    public void setResumeTime(Instant resumeTime) {
        this.resumeTime = resumeTime;
    }

    public Integer getTotalPauseDurationSeconds() {
        return this.totalPauseDurationSeconds;
    }

    public StudentQuiz totalPauseDurationSeconds(Integer totalPauseDurationSeconds) {
        this.setTotalPauseDurationSeconds(totalPauseDurationSeconds);
        return this;
    }

    public void setTotalPauseDurationSeconds(Integer totalPauseDurationSeconds) {
        this.totalPauseDurationSeconds = totalPauseDurationSeconds;
    }

    public Boolean getSubmittedAutomatically() {
        return this.submittedAutomatically;
    }

    public StudentQuiz submittedAutomatically(Boolean submittedAutomatically) {
        this.setSubmittedAutomatically(submittedAutomatically);
        return this;
    }

    public void setSubmittedAutomatically(Boolean submittedAutomatically) {
        this.submittedAutomatically = submittedAutomatically;
    }

    public Integer getCurrentQuestionIndex() {
        return this.currentQuestionIndex;
    }

    public StudentQuiz currentQuestionIndex(Integer currentQuestionIndex) {
        this.setCurrentQuestionIndex(currentQuestionIndex);
        return this;
    }

    public void setCurrentQuestionIndex(Integer currentQuestionIndex) {
        this.currentQuestionIndex = currentQuestionIndex;
    }

    public Integer getTotalQuestions() {
        return this.totalQuestions;
    }

    public StudentQuiz totalQuestions(Integer totalQuestions) {
        this.setTotalQuestions(totalQuestions);
        return this;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return this.correctAnswers;
    }

    public StudentQuiz correctAnswers(Integer correctAnswers) {
        this.setCorrectAnswers(correctAnswers);
        return this;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Set<StudentQuizResponse> getResponses() {
        return this.responses;
    }

    public void setResponses(Set<StudentQuizResponse> studentQuizResponses) {
        if (this.responses != null) {
            this.responses.forEach(i -> i.setStudentQuiz(null));
        }
        if (studentQuizResponses != null) {
            studentQuizResponses.forEach(i -> i.setStudentQuiz(this));
        }
        this.responses = studentQuizResponses;
    }

    public StudentQuiz responses(Set<StudentQuizResponse> studentQuizResponses) {
        this.setResponses(studentQuizResponses);
        return this;
    }

    public StudentQuiz addResponses(StudentQuizResponse studentQuizResponse) {
        this.responses.add(studentQuizResponse);
        studentQuizResponse.setStudentQuiz(this);
        return this;
    }

    public StudentQuiz removeResponses(StudentQuizResponse studentQuizResponse) {
        this.responses.remove(studentQuizResponse);
        studentQuizResponse.setStudentQuiz(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentQuiz)) {
            return false;
        }
        return getId() != null && getId().equals(((StudentQuiz) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudentQuiz{" +
            "id=" + getId() +
            ", startTime='" + getStartTime() + "'" +
            ", endTime='" + getEndTime() + "'" +
            ", score=" + getScore() +
            ", completed='" + getCompleted() + "'" +
            ", paused='" + getPaused() + "'" +
            ", pauseTime='" + getPauseTime() + "'" +
            ", resumeTime='" + getResumeTime() + "'" +
            ", totalPauseDurationSeconds=" + getTotalPauseDurationSeconds() +
            ", submittedAutomatically='" + getSubmittedAutomatically() + "'" +
            ", currentQuestionIndex=" + getCurrentQuestionIndex() +
            ", totalQuestions=" + getTotalQuestions() +
            ", correctAnswers=" + getCorrectAnswers() +
            "}";
    }
}
