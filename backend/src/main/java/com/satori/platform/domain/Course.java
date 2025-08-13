package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.satori.platform.domain.enumeration.CourseLanguage;
import com.satori.platform.domain.enumeration.DifficultyLevel;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * A Course.
 */
@Entity
@Table(name = "course")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Course implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Size(min = 1, max = 255)
    @Column(name = "title", nullable = false, length = 255)
    private String title;

    @Size(max = 2000)
    @Column(name = "description", length = 2000)
    private String description;

    @Size(max = 20)
    @Column(name = "course_code", unique = true, length = 20)
    private String courseCode;

    @Size(max = 50)
    @Column(name = "level", length = 50)
    private String level;

    @Min(value = 1)
    @Max(value = 10000)
    @Column(name = "duration")
    private Integer duration;

    @DecimalMin(value = "0.0")
    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "is_active")
    private Boolean isActive = Boolean.TRUE;

    @Enumerated(EnumType.STRING)
    @Column(name = "difficulty_level", length = 30)
    private DifficultyLevel difficultyLevel;

    @Min(value = 1)
    @Max(value = 10000)
    @Column(name = "estimated_duration")
    private Integer estimatedDuration;

    @Enumerated(EnumType.STRING)
    @Column(name = "language", length = 20)
    private CourseLanguage language;

    @CreationTimestamp
    @Column(name = "created_date", nullable = false, updatable = false)
    private Instant createdDate;

    @UpdateTimestamp
    @Column(name = "last_modified_date")
    private Instant lastModifiedDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "course")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "flashcards", "course", "quizzes" }, allowSetters = true)
    private Set<Lesson> lessons = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "course")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "course" }, allowSetters = true)
    private Set<Schedule> schedules = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "teacherProfile", "studentProfile", "createdCourses",
            "quizAttempts" }, allowSetters = true)
    private UserProfile teacher;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "courses")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "questions", "assignedTos", "courses", "lessons" }, allowSetters = true)
    private Set<Quiz> quizzes = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "course")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "course", "createdBy" }, allowSetters = true)
    private Set<GiftCode> giftCodes = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "course")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "student", "course" }, allowSetters = true)
    private Set<StudentProgress> studentProgress = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Course id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Course title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Course description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCourseCode() {
        return this.courseCode;
    }

    public Course courseCode(String courseCode) {
        this.setCourseCode(courseCode);
        return this;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public String getLevel() {
        return this.level;
    }

    public Course level(String level) {
        this.setLevel(level);
        return this;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public Course duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public BigDecimal getPrice() {
        return this.price;
    }

    public Course price(BigDecimal price) {
        this.setPrice(price);
        return this;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Boolean getIsActive() {
        return this.isActive;
    }

    public Course isActive(Boolean isActive) {
        this.setIsActive(isActive);
        return this;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public DifficultyLevel getDifficultyLevel() {
        return this.difficultyLevel;
    }

    public Course difficultyLevel(DifficultyLevel difficultyLevel) {
        this.setDifficultyLevel(difficultyLevel);
        return this;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public Integer getEstimatedDuration() {
        return this.estimatedDuration;
    }

    public Course estimatedDuration(Integer estimatedDuration) {
        this.setEstimatedDuration(estimatedDuration);
        return this;
    }

    public void setEstimatedDuration(Integer estimatedDuration) {
        this.estimatedDuration = estimatedDuration;
    }

    public CourseLanguage getLanguage() {
        return this.language;
    }

    public Course language(CourseLanguage language) {
        this.setLanguage(language);
        return this;
    }

    public void setLanguage(CourseLanguage language) {
        this.language = language;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public Course createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Instant getLastModifiedDate() {
        return this.lastModifiedDate;
    }

    public Course lastModifiedDate(Instant lastModifiedDate) {
        this.setLastModifiedDate(lastModifiedDate);
        return this;
    }

    public void setLastModifiedDate(Instant lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    public Set<Lesson> getLessons() {
        return this.lessons;
    }

    public void setLessons(Set<Lesson> lessons) {
        if (this.lessons != null) {
            this.lessons.forEach(i -> i.setCourse(null));
        }
        if (lessons != null) {
            lessons.forEach(i -> i.setCourse(this));
        }
        this.lessons = lessons;
    }

    public Course lessons(Set<Lesson> lessons) {
        this.setLessons(lessons);
        return this;
    }

    public Course addLessons(Lesson lesson) {
        this.lessons.add(lesson);
        lesson.setCourse(this);
        return this;
    }

    public Course removeLessons(Lesson lesson) {
        this.lessons.remove(lesson);
        lesson.setCourse(null);
        return this;
    }

    public Set<Schedule> getSchedules() {
        return this.schedules;
    }

    public void setSchedules(Set<Schedule> schedules) {
        if (this.schedules != null) {
            this.schedules.forEach(i -> i.setCourse(null));
        }
        if (schedules != null) {
            schedules.forEach(i -> i.setCourse(this));
        }
        this.schedules = schedules;
    }

    public Course schedules(Set<Schedule> schedules) {
        this.setSchedules(schedules);
        return this;
    }

    public Course addSchedules(Schedule schedule) {
        this.schedules.add(schedule);
        schedule.setCourse(this);
        return this;
    }

    public Course removeSchedules(Schedule schedule) {
        this.schedules.remove(schedule);
        schedule.setCourse(null);
        return this;
    }

    public UserProfile getTeacher() {
        return this.teacher;
    }

    public void setTeacher(UserProfile userProfile) {
        this.teacher = userProfile;
    }

    public Course teacher(UserProfile userProfile) {
        this.setTeacher(userProfile);
        return this;
    }

    public Set<Quiz> getQuizzes() {
        return this.quizzes;
    }

    public void setQuizzes(Set<Quiz> quizzes) {
        if (this.quizzes != null) {
            this.quizzes.forEach(i -> i.removeCourse(this));
        }
        if (quizzes != null) {
            quizzes.forEach(i -> i.addCourse(this));
        }
        this.quizzes = quizzes;
    }

    public Course quizzes(Set<Quiz> quizzes) {
        this.setQuizzes(quizzes);
        return this;
    }

    public Course addQuiz(Quiz quiz) {
        this.quizzes.add(quiz);
        quiz.getCourses().add(this);
        return this;
    }

    public Course removeQuiz(Quiz quiz) {
        this.quizzes.remove(quiz);
        quiz.getCourses().remove(this);
        return this;
    }

    public Set<GiftCode> getGiftCodes() {
        return this.giftCodes;
    }

    public void setGiftCodes(Set<GiftCode> giftCodes) {
        if (this.giftCodes != null) {
            this.giftCodes.forEach(i -> i.setCourse(null));
        }
        if (giftCodes != null) {
            giftCodes.forEach(i -> i.setCourse(this));
        }
        this.giftCodes = giftCodes;
    }

    public Course giftCodes(Set<GiftCode> giftCodes) {
        this.setGiftCodes(giftCodes);
        return this;
    }

    public Course addGiftCode(GiftCode giftCode) {
        this.giftCodes.add(giftCode);
        giftCode.setCourse(this);
        return this;
    }

    public Course removeGiftCode(GiftCode giftCode) {
        this.giftCodes.remove(giftCode);
        giftCode.setCourse(null);
        return this;
    }

    public Set<StudentProgress> getStudentProgress() {
        return this.studentProgress;
    }

    public void setStudentProgress(Set<StudentProgress> studentProgress) {
        if (this.studentProgress != null) {
            this.studentProgress.forEach(i -> i.setCourse(null));
        }
        if (studentProgress != null) {
            studentProgress.forEach(i -> i.setCourse(this));
        }
        this.studentProgress = studentProgress;
    }

    public Course studentProgress(Set<StudentProgress> studentProgress) {
        this.setStudentProgress(studentProgress);
        return this;
    }

    public Course addStudentProgress(StudentProgress studentProgress) {
        this.studentProgress.add(studentProgress);
        studentProgress.setCourse(this);
        return this;
    }

    public Course removeStudentProgress(StudentProgress studentProgress) {
        this.studentProgress.remove(studentProgress);
        studentProgress.setCourse(null);
        return this;
    }

    // Business logic methods

    /**
     * Check if the course is currently active
     */
    public boolean isCurrentlyActive() {
        return Boolean.TRUE.equals(this.isActive);
    }

    /**
     * Get the total number of lessons in this course
     */
    public int getLessonCount() {
        return this.lessons != null ? this.lessons.size() : 0;
    }

    /**
     * Get the total number of quizzes in this course
     */
    public int getQuizCount() {
        return this.quizzes != null ? this.quizzes.size() : 0;
    }

    /**
     * Get the total number of enrolled students
     */
    public int getEnrolledStudentCount() {
        return this.studentProgress != null ? this.studentProgress.size() : 0;
    }

    /**
     * Check if the course has a price (is paid)
     */
    public boolean isPaidCourse() {
        return this.price != null && this.price.compareTo(BigDecimal.ZERO) > 0;
    }

    /**
     * Get formatted price string
     */
    public String getFormattedPrice() {
        if (this.price == null || this.price.compareTo(BigDecimal.ZERO) == 0) {
            return "Free";
        }
        return "$" + this.price.toString();
    }

    /**
     * Activate the course
     */
    public void activate() {
        this.isActive = Boolean.TRUE;
    }

    /**
     * Deactivate the course
     */
    public void deactivate() {
        this.isActive = Boolean.FALSE;
    }

    // JPA Lifecycle callbacks

    @PrePersist
    protected void onCreate() {
        if (this.isActive == null) {
            this.isActive = Boolean.TRUE;
        }
        if (this.createdDate == null) {
            this.createdDate = Instant.now();
        }
        this.lastModifiedDate = Instant.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.lastModifiedDate = Instant.now();
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Course course)) {
            return false;
        }
        return getId() != null && Objects.equals(getId(), course.getId());
    }

    @Override
    public int hashCode() {
        // see
        // https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "Course{" +
                "id=" + getId() +
                ", title='" + getTitle() + "'" +
                ", courseCode='" + getCourseCode() + "'" +
                ", difficultyLevel=" + getDifficultyLevel() +
                ", language=" + getLanguage() +
                ", isActive=" + getIsActive() +
                ", price=" + getPrice() +
                ", lessonCount=" + getLessonCount() +
                "}";
    }
}
