package com.satori.platform.service.dto;

import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.List;

/**
 * DTO for quiz template operations.
 */
public class QuizTemplateDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    private String templateName;

    @NotNull
    private String title;

    private String description;

    @NotNull
    private Boolean isTest;

    @NotNull
    private Boolean isPractice;

    private Integer timeLimitMinutes;

    private List<Long> questionIds;

    public String getTemplateName() {
        return templateName;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
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

    public Integer getTimeLimitMinutes() {
        return timeLimitMinutes;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public List<Long> getQuestionIds() {
        return questionIds;
    }

    public void setQuestionIds(List<Long> questionIds) {
        this.questionIds = questionIds;
    }

    @Override
    public String toString() {
        return "QuizTemplateDTO{" +
                "templateName='" + templateName + '\'' +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", isTest=" + isTest +
                ", isPractice=" + isPractice +
                ", timeLimitMinutes=" + timeLimitMinutes +
                ", questionIds=" + questionIds +
                '}';
    }
}