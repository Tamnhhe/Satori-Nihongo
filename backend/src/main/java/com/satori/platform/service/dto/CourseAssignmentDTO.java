package com.satori.platform.service.dto;

import jakarta.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;

/**
 * DTO for course assignment operations
 */
public class CourseAssignmentDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    @NotNull
    private Long courseId;

    private Long teacherId;

    private List<Long> classIds;

    private String assignmentType; // "TEACHER" or "CLASS"

    private Instant assignedDate;

    private String notes;

    private LocalDate assignmentDate;

    private String status;

    private Boolean active;

    public CourseAssignmentDTO() {
    }

    public CourseAssignmentDTO(Long courseId, Long teacherId, List<Long> classIds, String assignmentType) {
        this.courseId = courseId;
        this.teacherId = teacherId;
        this.classIds = classIds;
        this.assignmentType = assignmentType;
        this.assignedDate = Instant.now();
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public List<Long> getClassIds() {
        return classIds;
    }

    public void setClassIds(List<Long> classIds) {
        this.classIds = classIds;
    }

    public String getAssignmentType() {
        return assignmentType;
    }

    public void setAssignmentType(String assignmentType) {
        this.assignmentType = assignmentType;
    }

    public Instant getAssignedDate() {
        return assignedDate;
    }

    public void setAssignedDate(Instant assignedDate) {
        this.assignedDate = assignedDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDate getAssignmentDate() {
        return assignmentDate;
    }

    public void setAssignmentDate(LocalDate assignmentDate) {
        this.assignmentDate = assignmentDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    @Override
    public String toString() {
        return "CourseAssignmentDTO{" +
                "courseId=" + courseId +
                ", teacherId=" + teacherId +
                ", classIds=" + classIds +
                ", assignmentType='" + assignmentType + '\'' +
                ", assignedDate=" + assignedDate +
                ", notes='" + notes + '\'' +
                '}';
    }
}