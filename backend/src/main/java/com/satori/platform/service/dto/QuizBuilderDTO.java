package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.QuizType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.io.Serializable;
import java.util.List;

/**
 * DTO for Quiz Builder functionality.
 */
public class QuizBuilderDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(min = 1, max = 255)
    private String title;

    private String description;

    @NotNull
    private Boolean isTest;

    @NotNull
    private Boolean isPractice;

    @NotNull
    private QuizType quizType;

    private Integer timeLimitMinutes;

    private List<QuizQuestionBuilderDTO> questions;

    private List<Long> courseIds;

    private List<Long> lessonIds;

    // Constructors
    public QuizBuilderDTO() {
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

    public QuizType getQuizType() {
        return quizType;
    }

    public void setQuizType(QuizType quizType) {
        this.quizType = quizType;
    }

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public List<QuizQuestionBuilderDTO> getQuestions() {
        return questions;
    }

    public void setQuestions(List<QuizQuestionBuilderDTO> questions) {
        this.questions = questions;
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

    @Override
    public String toString() {
        return "QuizBuilderDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", isTest=" + isTest +
                ", isPractice=" + isPractice +
                ", quizType=" + quizType +
                ", timeLimitMinutes=" + timeLimitMinutes +
                ", questions=" + (questions != null ? questions.size() : 0) +
                ", courseIds=" + (courseIds != null ? courseIds.size() : 0) +
                ", lessonIds=" + (lessonIds != null ? lessonIds.size() : 0) +
                '}';
    }
}