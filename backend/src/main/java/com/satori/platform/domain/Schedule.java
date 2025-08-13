package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Schedule.
 */
@Entity
@Table(name = "schedule")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Schedule implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "date", nullable = false)
    private Instant date;

    @NotNull
    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @NotNull
    @Column(name = "end_time", nullable = false)
    private Instant endTime;

    @Column(name = "location")
    private String location;

    @Column(name = "course_class_id")
    private Long courseClassId;

    @Column(name = "lesson_id")
    private Long lessonId;

    @Column(name = "scheduled_date")
    private LocalDateTime scheduledDate;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "status")
    private String status;

    @Column(name = "day_of_week")
    private String dayOfWeek;

    @Column(name = "recurring")
    private Boolean recurring;

    @Column(name = "active")
    private Boolean active;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "course", "teacher", "students" }, allowSetters = true)
    private CourseClass courseClass;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "course", "flashcards", "quizzes" }, allowSetters = true)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "lessons", "schedules", "teacher", "quizzes" }, allowSetters = true)
    private Course course;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Schedule id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instant getDate() {
        return this.date;
    }

    public Schedule date(Instant date) {
        this.setDate(date);
        return this;
    }

    public void setDate(Instant date) {
        this.date = date;
    }

    public Instant getStartTime() {
        return this.startTime;
    }

    public Schedule startTime(Instant startTime) {
        this.setStartTime(startTime);
        return this;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return this.endTime;
    }

    public Schedule endTime(Instant endTime) {
        this.setEndTime(endTime);
        return this;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return this.location;
    }

    public Schedule location(String location) {
        this.setLocation(location);
        return this;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Course getCourse() {
        return this.course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Schedule course(Course course) {
        this.setCourse(course);
        return this;
    }

    public Long getCourseClassId() {
        return this.courseClassId;
    }

    public Schedule courseClassId(Long courseClassId) {
        this.setCourseClassId(courseClassId);
        return this;
    }

    public void setCourseClassId(Long courseClassId) {
        this.courseClassId = courseClassId;
    }

    public Long getLessonId() {
        return this.lessonId;
    }

    public Schedule lessonId(Long lessonId) {
        this.setLessonId(lessonId);
        return this;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public LocalDateTime getScheduledDate() {
        return this.scheduledDate;
    }

    public Schedule scheduledDate(LocalDateTime scheduledDate) {
        this.setScheduledDate(scheduledDate);
        return this;
    }

    public void setScheduledDate(LocalDateTime scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public Schedule duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getStatus() {
        return this.status;
    }

    public Schedule status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDayOfWeek() {
        return this.dayOfWeek;
    }

    public Schedule dayOfWeek(String dayOfWeek) {
        this.setDayOfWeek(dayOfWeek);
        return this;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public Boolean getRecurring() {
        return this.recurring;
    }

    public Schedule recurring(Boolean recurring) {
        this.setRecurring(recurring);
        return this;
    }

    public void setRecurring(Boolean recurring) {
        this.recurring = recurring;
    }

    public Boolean getActive() {
        return this.active;
    }

    public Schedule active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public CourseClass getCourseClass() {
        return this.courseClass;
    }

    public void setCourseClass(CourseClass courseClass) {
        this.courseClass = courseClass;
    }

    public Schedule courseClass(CourseClass courseClass) {
        this.setCourseClass(courseClass);
        return this;
    }

    public Lesson getLesson() {
        return this.lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public Schedule lesson(Lesson lesson) {
        this.setLesson(lesson);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Schedule)) {
            return false;
        }
        return getId() != null && getId().equals(((Schedule) o).getId());
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
        return "Schedule{" +
                "id=" + getId() +
                ", date='" + getDate() + "'" +
                ", startTime='" + getStartTime() + "'" +
                ", endTime='" + getEndTime() + "'" +
                ", location='" + getLocation() + "'" +
                "}";
    }
}
