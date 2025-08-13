package com.satori.platform.service.dto;

import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import java.util.List;

/**
 * DTO for Quiz Assignment functionality.
 */
public class QuizAssignmentDTO implements Serializable {

    private Long id;

    @NotNull
    private Long quizId;

    private String quizTitle;

    private String assignmentType; // COURSE, LESSON, STUDENT_GROUP, INDIVIDUAL

    private List<Long> courseIds;

    private List<Long> lessonIds;

    private List<Long> studentIds;

    private List<Long> classIds;

    private Instant startDate;

    private Instant endDate;

    private Integer timeLimitMinutes;

    private Integer maxAttempts;

    private Boolean isActive;

    private Boolean showResultsImmediately;

    private Boolean randomizeQuestions;

    private Boolean randomizeAnswers;

    private String instructions;

    private Double passingScore;

    private Boolean isGraded;

    private Integer weight; // For weighted grading

    private Long courseClassId;

    private Instant assignedDate;

    private Instant dueDate;

    private Boolean active;

    // Constructors
    public QuizAssignmentDTO() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public String getAssignmentType() {
        return assignmentType;
    }

    public void setAssignmentType(String assignmentType) {
        this.assignmentType = assignmentType;
    }

    public List<Long> getCourseIds() {
        return courseIds;
    }

    public void setCourseIds(List<Long> courseIds) {
        this.courseIds = courseIds;
    }

    public List<Long> getLessonIds() {
        return lessonIds;
    }

    public void setLessonIds(List<Long> lessonIds) {
        this.lessonIds = lessonIds;
    }

    public List<Long> getStudentIds() {
        return studentIds;
    }

    public void setStudentIds(List<Long> studentIds) {
        this.studentIds = studentIds;
    }

    public List<Long> getClassIds() {
        return classIds;
    }

    public void setClassIds(List<Long> classIds) {
        this.classIds = classIds;
    }

    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Integer getMaxAttempts() {
        return maxAttempts;
    }

    public void setMaxAttempts(Integer maxAttempts) {
        this.maxAttempts = maxAttempts;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Boolean getShowResultsImmediately() {
        return showResultsImmediately;
    }

    public void setShowResultsImmediately(Boolean showResultsImmediately) {
        this.showResultsImmediately = showResultsImmediately;
    }

    public Boolean getRandomizeQuestions() {
        return randomizeQuestions;
    }

    public void setRandomizeQuestions(Boolean randomizeQuestions) {
        this.randomizeQuestions = randomizeQuestions;
    }

    public Boolean getRandomizeAnswers() {
        return randomizeAnswers;
    }

    public void setRandomizeAnswers(Boolean randomizeAnswers) {
        this.randomizeAnswers = randomizeAnswers;
    }

    public String getInstructions() {
        return instructions;
    }

    public void setInstructions(String instructions) {
        this.instructions = instructions;
    }

    public Double getPassingScore() {
        return passingScore;
    }

    public void setPassingScore(Double passingScore) {
        this.passingScore = passingScore;
    }

    public Boolean getIsGraded() {
        return isGraded;
    }

    public void setIsGraded(Boolean isGraded) {
        this.isGraded = isGraded;
    }

    public Integer getWeight() {
        return weight;
    }

    public void setWeight(Integer weight) {
        this.weight = weight;
    }

    public Long getCourseClassId() {
        return courseClassId;
    }

    public void setCourseClassId(Long courseClassId) {
        this.courseClassId = courseClassId;
    }

    public Instant getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(Instant assignedDate) {
        this.assignedDate = assignedDate;
    }

    public Instant getDueDate() {
        return dueDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "QuizAssignmentDTO{" +
                "id=" + id +
                ", quizId=" + quizId +
                ", quizTitle='" + quizTitle + '\'' +
                ", assignmentType='" + assignmentType + '\'' +
                ", startDate=" + startDate +
                ", endDate=" + endDate +
                ", timeLimitMinutes=" + timeLimitMinutes +
                ", maxAttempts=" + maxAttempts +
                ", isActive=" + isActive +
                ", isGraded=" + isGraded +
                ", weight=" + weight +
                '}';
    }
}