package com.satori.platform.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.satori.platform.domain.CourseClass} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CourseClassDTO implements Serializable {

    private Long id;

    @NotNull
    private String code;

    @NotNull
    private String name;

    private String description;

    @NotNull
    private Instant startDate;

    @NotNull
    private Instant endDate;

    private Integer capacity;

    private CourseDTO course;

    private TeacherProfileDTO teacher;

    private Set<StudentProfileDTO> students = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public CourseDTO getCourse() {
        return course;
    }

    public void setCourse(CourseDTO course) {
        this.course = course;
    }

    public TeacherProfileDTO getTeacher() {
        return teacher;
    }

    public void setTeacher(TeacherProfileDTO teacher) {
        this.teacher = teacher;
    }

    public Set<StudentProfileDTO> getStudents() {
        return students;
    }

    public void setStudents(Set<StudentProfileDTO> students) {
        this.students = students;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CourseClassDTO)) {
            return false;
        }

        CourseClassDTO courseClassDTO = (CourseClassDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, courseClassDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CourseClassDTO{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            ", startDate='" + getStartDate() + "'" +
            ", endDate='" + getEndDate() + "'" +
            ", capacity=" + getCapacity() +
            ", course=" + getCourse() +
            ", teacher=" + getTeacher() +
            ", students=" + getStudents() +
            "}";
    }
}
