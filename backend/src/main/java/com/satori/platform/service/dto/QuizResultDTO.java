package com.satori.platform.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import java.util.Objects;

/**
 * A DTO for quiz results and performance tracking.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class QuizResultDTO implements Serializable {

    private Long studentQuizId;
    private Long quizId;
    private String quizTitle;
    private Instant startTime;
    private Instant endTime;
    private Double score;
    private Integer correctAnswers;
    private Integer totalQuestions;
    private Double percentage;
    private Integer timeTakenSeconds;
    private Boolean passed;
    private String grade;
    private Boolean autoSubmitted;
    private List<StudentQuizResponseDTO> responses;
    private QuizPerformanceStatsDTO performanceStats;

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

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Double getPercentage() {
        return percentage;
    }

    public void setPercentage(Double percentage) {
        this.percentage = percentage;
    }

    public Integer getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(Integer timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }

    public Boolean getPassed() {
        return passed;
    }

    public void setPassed(Boolean passed) {
        this.passed = passed;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public Boolean getAutoSubmitted() {
        return autoSubmitted;
    }

    public void setAutoSubmitted(Boolean autoSubmitted) {
        this.autoSubmitted = autoSubmitted;
    }

    public List<StudentQuizResponseDTO> getResponses() {
        return responses;
    }

    public void setResponses(List<StudentQuizResponseDTO> responses) {
        this.responses = responses;
    }

    public QuizPerformanceStatsDTO getPerformanceStats() {
        return performanceStats;
    }

    public void setPerformanceStats(QuizPerformanceStatsDTO performanceStats) {
        this.performanceStats = performanceStats;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof QuizResultDTO)) {
            return false;
        }

        QuizResultDTO quizResultDTO = (QuizResultDTO) o;
        if (this.studentQuizId == null) {
            return false;
        }
        return Objects.equals(this.studentQuizId, quizResultDTO.studentQuizId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.studentQuizId);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "QuizResultDTO{" +
                "studentQuizId=" + getStudentQuizId() +
                ", quizId=" + getQuizId() +
                ", quizTitle='" + getQuizTitle() + "'" +
                ", startTime='" + getStartTime() + "'" +
                ", endTime='" + getEndTime() + "'" +
                ", score=" + getScore() +
                ", correctAnswers=" + getCorrectAnswers() +
                ", totalQuestions=" + getTotalQuestions() +
                ", percentage=" + getPercentage() +
                ", timeTakenSeconds=" + getTimeTakenSeconds() +
                ", passed='" + getPassed() + "'" +
                ", grade='" + getGrade() + "'" +
                ", autoSubmitted='" + getAutoSubmitted() + "'" +
                "}";
    }
}