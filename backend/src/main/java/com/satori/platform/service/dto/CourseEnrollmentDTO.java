package com.satori.platform.service.dto;

import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for course enrollment operations.
 */
public class CourseEnrollmentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    private Long studentId;

    private Long courseId;

    @NotNull
    private String giftCode;

    private Instant enrollmentDate;

    private String status;

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

    public String getGiftCode() {
        return giftCode;
    }

    public void setGiftCode(String giftCode) {
        this.giftCode = giftCode;
    }

    public Instant getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(Instant enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CourseEnrollmentDTO)) {
            return false;
        }

        CourseEnrollmentDTO that = (CourseEnrollmentDTO) o;
        return Objects.equals(studentId, that.studentId) &&
                Objects.equals(courseId, that.courseId) &&
                Objects.equals(giftCode, that.giftCode);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId, courseId, giftCode);
    }

    @Override
    public String toString() {
        return "CourseEnrollmentDTO{" +
                "studentId=" + studentId +
                ", courseId=" + courseId +
                ", giftCode='" + giftCode + '\'' +
                ", enrollmentDate=" + enrollmentDate +
                ", status='" + status + '\'' +
                '}';
    }
}