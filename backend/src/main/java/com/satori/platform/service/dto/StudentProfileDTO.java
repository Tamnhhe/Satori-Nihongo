package com.satori.platform.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.satori.platform.domain.StudentProfile} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudentProfileDTO implements Serializable {

    private Long id;

    @NotNull
    private String studentId;

    private Double gpa;

    private Set<CourseClassDTO> classes = new HashSet<>();

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

    public Set<CourseClassDTO> getClasses() {
        return classes;
    }

    public void setClasses(Set<CourseClassDTO> classes) {
        this.classes = classes;
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

    // prettier-ignore
    @Override
    public String toString() {
        return "StudentProfileDTO{" +
            "id=" + getId() +
            ", studentId='" + getStudentId() + "'" +
            ", gpa=" + getGpa() +
            ", classes=" + getClasses() +
            "}";
    }
}
