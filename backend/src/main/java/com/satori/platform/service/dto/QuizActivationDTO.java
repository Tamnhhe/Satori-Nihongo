package com.satori.platform.service.dto;

import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;

/**
 * DTO for quiz activation/deactivation operations.
 */
public class QuizActivationDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    private Long quizId;

    @NotNull
    private Boolean activate;

    private Instant activationTime;

    private Instant deactivationTime;

    private Boolean notifyStudents = true;

    public Long getQuizId() {
        return quizId;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public Boolean getActivate() {
        return activate;
    }

    public void setActivate(Boolean activate) {
        this.activate = activate;
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

    public Boolean getNotifyStudents() {
        return notifyStudents;
    }

    public void setNotifyStudents(Boolean notifyStudents) {
        this.notifyStudents = notifyStudents;
    }

    @Override
    public String toString() {
        return "QuizActivationDTO{" +
                "quizId=" + quizId +
                ", activate=" + activate +
                ", activationTime=" + activationTime +
                ", deactivationTime=" + deactivationTime +
                ", notifyStudents=" + notifyStudents +
                '}';
    }
}