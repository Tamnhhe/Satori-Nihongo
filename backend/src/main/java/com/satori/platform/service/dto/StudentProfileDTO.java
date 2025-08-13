package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.GradeLevel;
import com.satori.platform.domain.enumeration.StudentLevel;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.satori.platform.domain.StudentProfile} entity.
 */
public class StudentProfileDTO implements Serializable {

    private Long id;

    @NotNull
    @Size(min = 1, max = 50)
    private String studentId;

    @DecimalMin(value = "0.0")
    @DecimalMax(value = "4.0")
    private Double gpa;

    private StudentLevel level;

    private Instant enrollmentDate;

    private GradeLevel gradeLevel;

    @Size(max = 1000)
    private String learningGoals;

    private Long userProfileId;

    private String userProfileFullName;

    // Constructors
    public StudentProfileDTO() {
    }

    public StudentProfileDTO(Long id, String studentId, Double gpa, StudentLevel level,
            Instant enrollmentDate, GradeLevel gradeLevel, String learningGoals) {
        this.id = id;
        this.studentId = studentId;
        this.gpa = gpa;
        this.level = level;
        this.enrollmentDate = enrollmentDate;
        this.gradeLevel = gradeLevel;
        this.learningGoals = learningGoals;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Double getGpa() {
        return gpa;
    }

    public void setGpa(Double gpa) {
        this.gpa = gpa;
    }

    public StudentLevel getLevel() {
        return level;
    }

    public void setLevel(StudentLevel level) {
        this.level = level;
    }

    public Instant getEnrollmentDate() {
        return enrollmentDate;
    }

    public void setEnrollmentDate(Instant enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public GradeLevel getGradeLevel() {
        return gradeLevel;
    }

    public void setGradeLevel(GradeLevel gradeLevel) {
        this.gradeLevel = gradeLevel;
    }

    public String getLearningGoals() {
        return learningGoals;
    }

    public void setLearningGoals(String learningGoals) {
        this.learningGoals = learningGoals;
    }

    public Long getUserProfileId() {
        return userProfileId;
    }

    public void setUserProfileId(Long userProfileId) {
        this.userProfileId = userProfileId;
    }

    public String getUserProfileFullName() {
        return userProfileFullName;
    }

    public void setUserProfileFullName(String userProfileFullName) {
        this.userProfileFullName = userProfileFullName;
    }

    // Business logic methods
    public boolean isBeginner() {
        return this.level == StudentLevel.N5;
    }

    public boolean isAdvanced() {
        return this.level == StudentLevel.N1 || this.level == StudentLevel.NATIVE;
    }

    public long getDaysSinceEnrollment() {
        if (this.enrollmentDate == null) {
            return 0;
        }
        return java.time.Duration.between(this.enrollmentDate, Instant.now()).toDays();
    }

    public boolean hasGoodAcademicStanding() {
        return this.gpa != null && this.gpa >= 3.0;
    }

    public String getDisplayName() {
        if (this.userProfileFullName != null) {
            return this.userProfileFullName + " (" + this.studentId + ")";
        }
        return this.studentId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentProfileDTO)) {
            return false;
        }

        StudentProfileDTO studentProfileDTO = (StudentProfileDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, studentProfileDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    @Override
    public String toString() {
        return "StudentProfileDTO{" +
                "id=" + getId() +
                ", studentId='" + getStudentId() + "'" +
                ", gpa=" + getGpa() +
                ", level='" + getLevel() + "'" +
                ", enrollmentDate=" + getEnrollmentDate() +
                ", gradeLevel='" + getGradeLevel() + "'" +
                ", learningGoals='" + getLearningGoals() + "'" +
                ", userProfileId=" + getUserProfileId() +
                "}";
    }
}