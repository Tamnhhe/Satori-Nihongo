package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDate;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A CourseAssignment entity for assigning courses to teachers or classes.
 */
@Entity
@Table(name = "course_assignment")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CourseAssignment implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "assignment_type")
    private String assignmentType;

    @Column(name = "assigned_date")
    private Instant assignedDate;

    @Column(name = "assignment_date")
    private LocalDate assignmentDate;

    @Column(name = "status")
    private String status;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "notes")
    private String notes;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "lessons", "schedules", "teacher", "quizzes" }, allowSetters = true)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    private TeacherProfile teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "course", "teacher", "students" }, allowSetters = true)
    private CourseClass courseClass;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public CourseAssignment id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAssignmentType() {
        return this.assignmentType;
    }

    public CourseAssignment assignmentType(String assignmentType) {
        this.setAssignmentType(assignmentType);
        return this;
    }

    public void setAssignmentType(String assignmentType) {
        this.assignmentType = assignmentType;
    }

    public Instant getAssignedDate() {
        return this.assignedDate;
    }

    public CourseAssignment assignedDate(Instant assignedDate) {
        this.setAssignedDate(assignedDate);
        return this;
    }

    public void setAssignedDate(Instant assignedDate) {
        this.assignedDate = assignedDate;
    }

    public LocalDate getAssignmentDate() {
        return this.assignmentDate;
    }

    public CourseAssignment assignmentDate(LocalDate assignmentDate) {
        this.setAssignmentDate(assignmentDate);
        return this;
    }

    public void setAssignmentDate(LocalDate assignmentDate) {
        this.assignmentDate = assignmentDate;
    }

    public String getStatus() {
        return this.status;
    }

    public CourseAssignment status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getActive() {
        return this.active;
    }

    public CourseAssignment active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public String getNotes() {
        return this.notes;
    }

    public CourseAssignment notes(String notes) {
        this.setNotes(notes);
        return this;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Course getCourse() {
        return this.course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public CourseAssignment course(Course course) {
        this.setCourse(course);
        return this;
    }

    public TeacherProfile getTeacher() {
        return this.teacher;
    }

    public void setTeacher(TeacherProfile teacher) {
        this.teacher = teacher;
    }

    public CourseAssignment teacher(TeacherProfile teacher) {
        this.setTeacher(teacher);
        return this;
    }

    public CourseClass getCourseClass() {
        return this.courseClass;
    }

    public void setCourseClass(CourseClass courseClass) {
        this.courseClass = courseClass;
    }

    public CourseAssignment courseClass(CourseClass courseClass) {
        this.setCourseClass(courseClass);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CourseAssignment)) {
            return false;
        }
        return getId() != null && getId().equals(((CourseAssignment) o).getId());
    }

    @Override
    public int hashCode() {
        // see
        // https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CourseAssignment{" +
                "id=" + getId() +
                ", assignmentType='" + getAssignmentType() + "'" +
                ", assignedDate='" + getAssignedDate() + "'" +
                ", assignmentDate='" + getAssignmentDate() + "'" +
                ", status='" + getStatus() + "'" +
                ", active='" + getActive() + "'" +
                ", notes='" + getNotes() + "'" +
                "}";
    }
}