package com.satori.platform.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import java.util.Objects;

/**
 * A DTO for quiz session management.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class QuizSessionDTO implements Serializable {

    private Long studentQuizId;
    private Long quizId;
    private String quizTitle;
    private Instant startTime;
    private Instant endTime;
    private Boolean completed;
    private Boolean paused;
    private Integer currentQuestionIndex;
    private Integer totalQuestions;
    private Integer timeLimitMinutes;
    private Integer remainingTimeSeconds;
    private Double score;
    private Integer correctAnswers;
    private List<QuizQuestionDTO> questions;
    private List<StudentQuizResponseDTO> responses;
    private Boolean canPause;
    private Boolean canResume;
    private Boolean autoSubmitted;

    public Long getStudentQuizId() {
        return studentQuizId;
    }

    public void setStudentQuizId(Long studentQuizId) {
        this.studentQuizId = studentQuizId;
    }

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
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

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public Boolean getPaused() {
        return paused;
    }

    public void setPaused(Boolean paused) {
        this.paused = paused;
    }

    public Integer getCurrentQuestionIndex() {
        return currentQuestionIndex;
    }

    public void setCurrentQuestionIndex(Integer currentQuestionIndex) {
        this.currentQuestionIndex = currentQuestionIndex;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Integer getRemainingTimeSeconds() {
        return remainingTimeSeconds;
    }

    public void setRemainingTimeSeconds(Integer remainingTimeSeconds) {
        this.remainingTimeSeconds = remainingTimeSeconds;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public List<QuizQuestionDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuizQuestionDTO> questions) {
        this.questions = questions;
    }

    public List<StudentQuizResponseDTO> getResponses() {
        return responses;
    }

    public void setResponses(List<StudentQuizResponseDTO> responses) {
        this.responses = responses;
    }

    public Boolean getCanPause() {
        return canPause;
    }

    public void setCanPause(Boolean canPause) {
        this.canPause = canPause;
    }

    public Boolean getCanResume() {
        return canResume;
    }

    public void setCanResume(Boolean canResume) {
        this.canResume = canResume;
    }

    public Boolean getAutoSubmitted() {
        return autoSubmitted;
    }

    public void setAutoSubmitted(Boolean autoSubmitted) {
        this.autoSubmitted = autoSubmitted;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof QuizSessionDTO)) {
            return false;
        }

        QuizSessionDTO quizSessionDTO = (QuizSessionDTO) o;
        if (this.studentQuizId == null) {
            return false;
        }
        return Objects.equals(this.studentQuizId, quizSessionDTO.studentQuizId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.studentQuizId);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "QuizSessionDTO{" +
                "studentQuizId=" + getStudentQuizId() +
                ", quizId=" + getQuizId() +
                ", quizTitle='" + getQuizTitle() + "'" +
                ", startTime='" + getStartTime() + "'" +
                ", endTime='" + getEndTime() + "'" +
                ", completed='" + getCompleted() + "'" +
                ", paused='" + getPaused() + "'" +
                ", currentQuestionIndex=" + getCurrentQuestionIndex() +
                ", totalQuestions=" + getTotalQuestions() +
                ", timeLimitMinutes=" + getTimeLimitMinutes() +
                ", remainingTimeSeconds=" + getRemainingTimeSeconds() +
                ", score=" + getScore() +
                ", correctAnswers=" + getCorrectAnswers() +
                ", canPause='" + getCanPause() + "'" +
                ", canResume='" + getCanResume() + "'" +
                ", autoSubmitted='" + getAutoSubmitted() + "'" +
                "}";
    }
}