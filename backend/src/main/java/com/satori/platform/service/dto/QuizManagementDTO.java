package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.QuizType;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

/**
 * DTO for Quiz Management listing.
 */
public class QuizManagementDTO implements Serializable {

    private Long id;
    private String title;
    private String description;
    private QuizType quizType;
    private Boolean isTest;
    private Boolean isPractice;
    private Boolean isActive;
    private Integer timeLimitMinutes;
    private Instant activationTime;
    private Instant deactivationTime;
    private Integer questionCount;
    private List<String> courseNames;
    private List<String> lessonNames;

    // Constructors
    public QuizManagementDTO() {
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public QuizType getQuizType() {
        return quizType;
    }

    public void setQuizType(QuizType quizType) {
        this.quizType = quizType;
    }

    public Boolean getIsTest() {
        return isTest;
    }

    public void setIsTest(Boolean isTest) {
        this.isTest = isTest;
    }

    public Boolean getIsPractice() {
        return isPractice;
    }

    public void setIsPractice(Boolean isPractice) {
        this.isPractice = isPractice;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Instant getActivationTime() {
        return activationTime;
    }

    public void setActivationTime(Instant activationTime) {
        this.activationTime = activationTime;
    }

    public Instant getDeactivationTime() {
        return deactivationTime;
    }

    public void setDeactivationTime(Instant deactivationTime) {
        this.deactivationTime = deactivationTime;
    }

    public Integer getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }

    public List<String> getCourseNames() {
        return courseNames;
    }

    public void setCourseNames(List<String> courseNames) {
        this.courseNames = courseNames;
    }

    public List<String> getLessonNames() {
        return lessonNames;
    }

    public void setLessonNames(List<String> lessonNames) {
        this.lessonNames = lessonNames;
    }

    @Override
    public String toString() {
        return "QuizManagementDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", quizType=" + quizType +
                ", isActive=" + isActive +
                ", questionCount=" + questionCount +
                '}';
    }
}