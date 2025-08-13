package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.satori.platform.domain.enumeration.GradeLevel;
import com.satori.platform.domain.enumeration.StudentLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
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
    @DecimalMin(value = "0.0", message = "GPA must be at least 0.0")
    @DecimalMax(value = "4.0", message = "GPA must not exceed 4.0")
    private Double gpa;

    @Enumerated(EnumType.STRING)
    @Column(name = "level")
    private StudentLevel level;

    @Column(name = "enrollment_date")
    private Instant enrollmentDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "grade_level")
    private GradeLevel gradeLevel;

    @Column(name = "learning_goals", length = 1000)
    @Size(max = 1000)
    private String learningGoals;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private User user;

    @JsonIgnoreProperties(value = { "teacherProfile", "studentProfile", "createdCourses",
            "quizAttempts" }, allowSetters = true)
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

    public StudentLevel getLevel() {
        return this.level;
    }

    public StudentProfile level(StudentLevel level) {
        this.setLevel(level);
        return this;
    }

    public void setLevel(StudentLevel level) {
        this.level = level;
    }

    public Instant getEnrollmentDate() {
        return this.enrollmentDate;
    }

    public StudentProfile enrollmentDate(Instant enrollmentDate) {
        this.setEnrollmentDate(enrollmentDate);
        return this;
    }

    public void setEnrollmentDate(Instant enrollmentDate) {
        this.enrollmentDate = enrollmentDate;
    }

    public GradeLevel getGradeLevel() {
        return this.gradeLevel;
    }

    public StudentProfile gradeLevel(GradeLevel gradeLevel) {
        this.setGradeLevel(gradeLevel);
        return this;
    }

    public void setGradeLevel(GradeLevel gradeLevel) {
        this.gradeLevel = gradeLevel;
    }

    public String getLearningGoals() {
        return this.learningGoals;
    }

    public StudentProfile learningGoals(String learningGoals) {
        this.setLearningGoals(learningGoals);
        return this;
    }

    public void setLearningGoals(String learningGoals) {
        if (learningGoals != null && learningGoals.trim().isEmpty()) {
            this.learningGoals = null;
        } else {
            this.learningGoals = learningGoals;
        }
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public StudentProfile user(User user) {
        this.setUser(user);
        return this;
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

    // Business logic methods

    /**
     * Check if the student is a beginner level
     */
    public boolean isBeginner() {
        return this.level == StudentLevel.N5;
    }

    /**
     * Check if the student is advanced level
     */
    public boolean isAdvanced() {
        return this.level == StudentLevel.N1 || this.level == StudentLevel.NATIVE;
    }

    /**
     * Get the number of days since enrollment
     */
    public long getDaysSinceEnrollment() {
        if (this.enrollmentDate == null) {
            return 0;
        }
        return java.time.Duration.between(this.enrollmentDate, Instant.now()).toDays();
    }

    /**
     * Check if the student has good academic standing (GPA >= 3.0)
     */
    public boolean hasGoodAcademicStanding() {
        return this.gpa != null && this.gpa >= 3.0;
    }

    /**
     * Get a formatted display name for the student
     */
    public String getDisplayName() {
        if (this.userProfile != null && this.userProfile.getFullName() != null) {
            return this.userProfile.getFullName() + " (" + this.studentId + ")";
        }
        return this.studentId;
    }

    /**
     * Builder pattern for creating StudentProfile instances
     */
    public static class Builder {
        private final StudentProfile studentProfile;

        public Builder(String studentId) {
            this.studentProfile = new StudentProfile();
            this.studentProfile.setStudentId(studentId);
        }

        public Builder gpa(Double gpa) {
            this.studentProfile.setGpa(gpa);
            return this;
        }

        public Builder level(StudentLevel level) {
            this.studentProfile.setLevel(level);
            return this;
        }

        public Builder enrollmentDate(Instant enrollmentDate) {
            this.studentProfile.setEnrollmentDate(enrollmentDate);
            return this;
        }

        public Builder gradeLevel(GradeLevel gradeLevel) {
            this.studentProfile.setGradeLevel(gradeLevel);
            return this;
        }

        public Builder learningGoals(String learningGoals) {
            this.studentProfile.setLearningGoals(learningGoals);
            return this;
        }

        public Builder userProfile(UserProfile userProfile) {
            this.studentProfile.setUserProfile(userProfile);
            return this;
        }

        public StudentProfile build() {
            return this.studentProfile;
        }
    }

    /**
     * Create a new Builder instance
     */
    public static Builder builder(String studentId) {
        return new Builder(studentId);
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

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
        // see
        // https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudentProfile{" +
                "id=" + getId() +
                ", studentId='" + getStudentId() + "'" +
                ", gpa=" + getGpa() +
                ", level='" + getLevel() + "'" +
                ", enrollmentDate=" + getEnrollmentDate() +
                ", gradeLevel='" + getGradeLevel() + "'" +
                ", learningGoals='" + getLearningGoals() + "'" +
                "}";
    }
}
