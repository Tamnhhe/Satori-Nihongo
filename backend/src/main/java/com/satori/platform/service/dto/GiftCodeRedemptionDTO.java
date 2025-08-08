package com.satori.platform.service.dto;

import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * DTO for gift code redemption requests and responses.
 */
public class GiftCodeRedemptionDTO implements Serializable {

    @NotNull
    private String code;

    private Long studentId;

    private Long courseId;

    private String courseTitle;

    private LocalDateTime redemptionDate;

    private Boolean success;

    private String message;

    public GiftCodeRedemptionDTO() {
    }

    public GiftCodeRedemptionDTO(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public LocalDateTime getRedemptionDate() {
        return redemptionDate;
    }

    public void setRedemptionDate(LocalDateTime redemptionDate) {
        this.redemptionDate = redemptionDate;
    }

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    @Override
    public String toString() {
        return "GiftCodeRedemptionDTO{" +
                "code='" + code + '\'' +
                ", studentId=" + studentId +
                ", courseId=" + courseId +
                ", courseTitle='" + courseTitle + '\'' +
                ", redemptionDate=" + redemptionDate +
                ", success=" + success +
                ", message='" + message + '\'' +
                '}';
    }
}