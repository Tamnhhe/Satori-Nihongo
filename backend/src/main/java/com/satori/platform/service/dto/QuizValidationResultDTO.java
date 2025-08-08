package com.satori.platform.service.dto;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * DTO for quiz validation results.
 */
public class QuizValidationResultDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Boolean isValid;

    private List<String> errors = new ArrayList<>();

    private List<String> warnings = new ArrayList<>();

    private Integer questionCount;

    private Boolean hasCorrectAnswers;

    public QuizValidationResultDTO() {
        this.isValid = true;
    }

    public Boolean getIsValid() {
        return isValid;
    }

    public void setIsValid(Boolean isValid) {
        this.isValid = isValid;
    }

    public List<String> getErrors() {
        return errors;
    }

    public void setErrors(List<String> errors) {
        this.errors = errors;
    }

    public void addError(String error) {
        this.errors.add(error);
        this.isValid = false;
    }

    public List<String> getWarnings() {
        return warnings;
    }

    public void setWarnings(List<String> warnings) {
        this.warnings = warnings;
    }

    public void addWarning(String warning) {
        this.warnings.add(warning);
    }

    public Integer getQuestionCount() {
        return questionCount;
    }

    public void setQuestionCount(Integer questionCount) {
        this.questionCount = questionCount;
    }

    public Boolean getHasCorrectAnswers() {
        return hasCorrectAnswers;
    }

    public void setHasCorrectAnswers(Boolean hasCorrectAnswers) {
        this.hasCorrectAnswers = hasCorrectAnswers;
    }

    @Override
    public String toString() {
        return "QuizValidationResultDTO{" +
                "isValid=" + isValid +
                ", errors=" + errors +
                ", warnings=" + warnings +
                ", questionCount=" + questionCount +
                ", hasCorrectAnswers=" + hasCorrectAnswers +
                '}';
    }
}