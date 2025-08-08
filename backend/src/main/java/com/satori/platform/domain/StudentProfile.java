package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StudentProfile.
 */
@Entity
@Table(name = "student_profile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudentProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "student_id", nullable = false)
    private String studentId;

    @Column(name = "gpa")
    private Double gpa;

    @JsonIgnoreProperties(value = { "teacherProfile", "studentProfile", "createdCourses", "quizAttempts" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "studentProfile")
    private UserProfile userProfile;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "students")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "course", "teacher", "students" }, allowSetters = true)
    private Set<CourseClass> classes = new HashSet<>();

    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "student", "lesson" }, allowSetters = true)
    private Set<FlashcardSession> flashcardSessions = new HashSet<>();

    @OneToMany(mappedBy = "student", fetch = FetchType.LAZY)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "student", "course" }, allowSetters = true)
    private Set<StudentProgress> studentProgress = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StudentProfile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStudentId() {
        return this.studentId;
    }

    public StudentProfile studentId(String studentId) {
        this.setStudentId(studentId);
        return this;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public Double getGpa() {
        return this.gpa;
    }

    public StudentProfile gpa(Double gpa) {
        this.setGpa(gpa);
        return this;
    }

    public void setGpa(Double gpa) {
        this.gpa = gpa;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        if (this.userProfile != null) {
            this.userProfile.setStudentProfile(null);
        }
        if (userProfile != null) {
            userProfile.setStudentProfile(this);
        }
        this.userProfile = userProfile;
    }

    public StudentProfile userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    public Set<CourseClass> getClasses() {
        return this.classes;
    }

    public void setClasses(Set<CourseClass> courseClasses) {
        if (this.classes != null) {
            this.classes.forEach(i -> i.removeStudents(this));
        }
        if (courseClasses != null) {
            courseClasses.forEach(i -> i.addStudents(this));
        }
        this.classes = courseClasses;
    }

    public StudentProfile classes(Set<CourseClass> courseClasses) {
        this.setClasses(courseClasses);
        return this;
    }

    public StudentProfile addClasses(CourseClass courseClass) {
        this.classes.add(courseClass);
        courseClass.getStudents().add(this);
        return this;
    }

    public StudentProfile removeClasses(CourseClass courseClass) {
        this.classes.remove(courseClass);
        courseClass.getStudents().remove(this);
        return this;
    }
    
    public Set<FlashcardSession> getFlashcardSessions() {
        return this.flashcardSessions;
    }

    public void setFlashcardSessions(Set<FlashcardSession> flashcardSessions) {
        if (this.flashcardSessions != null) {
            this.flashcardSessions.forEach(i -> i.setStudent(null));
        }
        if (flashcardSessions != null) {
            flashcardSessions.forEach(i -> i.setStudent(this));
        }
        this.flashcardSessions = flashcardSessions;
    }

    public StudentProfile flashcardSessions(Set<FlashcardSession> flashcardSessions) {
        this.setFlashcardSessions(flashcardSessions);
        return this;
    }

    public StudentProfile addFlashcardSessions(FlashcardSession flashcardSession) {
        this.flashcardSessions.add(flashcardSession);
        flashcardSession.setStudent(this);
        return this;
    }

    public StudentProfile removeFlashcardSessions(FlashcardSession flashcardSession) {
        this.flashcardSessions.remove(flashcardSession);
        flashcardSession.setStudent(null);
        return this;
    }

    public Set<StudentProgress> getStudentProgress() {
        return this.studentProgress;
    }

    public void setStudentProgress(Set<StudentProgress> studentProgresses) {
        if (this.studentProgress != null) {
            this.studentProgress.forEach(i -> i.setStudent(null));
        }
        if (studentProgresses != null) {
            studentProgresses.forEach(i -> i.setStudent(this));
        }
        this.studentProgress = studentProgresses;
    }

    public StudentProfile studentProgress(Set<StudentProgress> studentProgresses) {
        this.setStudentProgress(studentProgresses);
        return this;
    }

    public StudentProfile addStudentProgress(StudentProgress studentProgress) {
        this.studentProgress.add(studentProgress);
        studentProgress.setStudent(this);
        return this;
    }

    public StudentProfile removeStudentProgress(StudentProgress studentProgress) {
        this.studentProgress.remove(studentProgress);
        studentProgress.setStudent(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentProfile)) {
            return false;
        }
        return getId() != null && getId().equals(((StudentProfile) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudentProfile{" +
            "id=" + getId() +
            ", studentId='" + getStudentId() + "'" +
            ", gpa=" + getGpa() +
            "}";
    }
}
