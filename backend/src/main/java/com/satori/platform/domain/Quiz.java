package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.satori.platform.domain.enumeration.QuizType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Quiz.
 */
@Entity
@Table(name = "quiz")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Quiz implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description")
    private String description;

    @NotNull
    @Column(name = "is_test", nullable = false)
    private Boolean isTest;

    @NotNull
    @Column(name = "is_practice", nullable = false)
    private Boolean isPractice;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "quiz_type", nullable = false)
    private QuizType quizType;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "activation_time")
    private Instant activationTime;

    @Column(name = "deactivation_time")
    private Instant deactivationTime;

    @Column(name = "time_limit_minutes")
    private Integer timeLimitMinutes;

    @Column(name = "is_template")
    private Boolean isTemplate = false;

    @Column(name = "template_name")
    private String templateName;

    @Column(name = "created_date")
    private Instant createdDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "quiz")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "quiz", "question" }, allowSetters = true)
    private Set<QuizQuestion> questions = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "quiz")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "quiz", "student" }, allowSetters = true)
    private Set<StudentQuiz> assignedTos = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "rel_quiz__course", joinColumns = @JoinColumn(name = "quiz_id"), inverseJoinColumns = @JoinColumn(name = "course_id"))
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "lessons", "schedules", "teacher", "quizzes" }, allowSetters = true)
    private Set<Course> courses = new HashSet<>();

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "rel_quiz__lesson", joinColumns = @JoinColumn(name = "quiz_id"), inverseJoinColumns = @JoinColumn(name = "lesson_id"))
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "flashcards", "course", "quizzes" }, allowSetters = true)
    private Set<Lesson> lessons = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Quiz id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Quiz title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return this.description;
    }

    public Quiz description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsTest() {
        return this.isTest;
    }

    public Quiz isTest(Boolean isTest) {
        this.setIsTest(isTest);
        return this;
    }

    public void setIsTest(Boolean isTest) {
        this.isTest = isTest;
    }

    public Boolean getIsPractice() {
        return this.isPractice;
    }

    public Quiz isPractice(Boolean isPractice) {
        this.setIsPractice(isPractice);
        return this;
    }

    public void setIsPractice(Boolean isPractice) {
        this.isPractice = isPractice;
    }

    public QuizType getQuizType() {
        return this.quizType;
    }

    public Quiz quizType(QuizType quizType) {
        this.setQuizType(quizType);
        return this;
    }

    public void setQuizType(QuizType quizType) {
        this.quizType = quizType;
    }

    public Boolean getIsActive() {
        return this.isActive;
    }

    public Quiz isActive(Boolean isActive) {
        this.setIsActive(isActive);
        return this;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }

    public Instant getActivationTime() {
        return this.activationTime;
    }

    public Quiz activationTime(Instant activationTime) {
        this.setActivationTime(activationTime);
        return this;
    }

    public void setActivationTime(Instant activationTime) {
        this.activationTime = activationTime;
    }

    public Instant getDeactivationTime() {
        return this.deactivationTime;
    }

    public Quiz deactivationTime(Instant deactivationTime) {
        this.setDeactivationTime(deactivationTime);
        return this;
    }

    public void setDeactivationTime(Instant deactivationTime) {
        this.deactivationTime = deactivationTime;
    }

    public Integer getTimeLimitMinutes() {
        return this.timeLimitMinutes;
    }

    public Quiz timeLimitMinutes(Integer timeLimitMinutes) {
        this.setTimeLimitMinutes(timeLimitMinutes);
        return this;
    }

    public void setTimeLimitMinutes(Integer timeLimitMinutes) {
        this.timeLimitMinutes = timeLimitMinutes;
    }

    public Boolean getIsTemplate() {
        return this.isTemplate;
    }

    public Quiz isTemplate(Boolean isTemplate) {
        this.setIsTemplate(isTemplate);
        return this;
    }

    public void setIsTemplate(Boolean isTemplate) {
        this.isTemplate = isTemplate;
    }

    public String getTemplateName() {
        return this.templateName;
    }

    public Quiz templateName(String templateName) {
        this.setTemplateName(templateName);
        return this;
    }

    public void setTemplateName(String templateName) {
        this.templateName = templateName;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public Quiz createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Set<QuizQuestion> getQuestions() {
        return this.questions;
    }

    public void setQuestions(Set<QuizQuestion> quizQuestions) {
        if (this.questions != null) {
            this.questions.forEach(i -> i.setQuiz(null));
        }
        if (quizQuestions != null) {
            quizQuestions.forEach(i -> i.setQuiz(this));
        }
        this.questions = quizQuestions;
    }

    public Quiz questions(Set<QuizQuestion> quizQuestions) {
        this.setQuestions(quizQuestions);
        return this;
    }

    public Quiz addQuestions(QuizQuestion quizQuestion) {
        this.questions.add(quizQuestion);
        quizQuestion.setQuiz(this);
        return this;
    }

    public Quiz removeQuestions(QuizQuestion quizQuestion) {
        this.questions.remove(quizQuestion);
        quizQuestion.setQuiz(null);
        return this;
    }

    public Set<StudentQuiz> getAssignedTos() {
        return this.assignedTos;
    }

    public void setAssignedTos(Set<StudentQuiz> studentQuizs) {
        if (this.assignedTos != null) {
            this.assignedTos.forEach(i -> i.setQuiz(null));
        }
        if (studentQuizs != null) {
            studentQuizs.forEach(i -> i.setQuiz(this));
        }
        this.assignedTos = studentQuizs;
    }

    public Quiz assignedTos(Set<StudentQuiz> studentQuizs) {
        this.setAssignedTos(studentQuizs);
        return this;
    }

    public Quiz addAssignedTo(StudentQuiz studentQuiz) {
        this.assignedTos.add(studentQuiz);
        studentQuiz.setQuiz(this);
        return this;
    }

    public Quiz removeAssignedTo(StudentQuiz studentQuiz) {
        this.assignedTos.remove(studentQuiz);
        studentQuiz.setQuiz(null);
        return this;
    }

    public Set<Course> getCourses() {
        return this.courses;
    }

    public void setCourses(Set<Course> courses) {
        this.courses = courses;
    }

    public Quiz courses(Set<Course> courses) {
        this.setCourses(courses);
        return this;
    }

    public Quiz addCourse(Course course) {
        this.courses.add(course);
        return this;
    }

    public Quiz removeCourse(Course course) {
        this.courses.remove(course);
        return this;
    }

    public Set<Lesson> getLessons() {
        return this.lessons;
    }

    public void setLessons(Set<Lesson> lessons) {
        this.lessons = lessons;
    }

    public Quiz lessons(Set<Lesson> lessons) {
        this.setLessons(lessons);
        return this;
    }

    public Quiz addLesson(Lesson lesson) {
        this.lessons.add(lesson);
        return this;
    }

    public Quiz removeLesson(Lesson lesson) {
        this.lessons.remove(lesson);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Quiz)) {
            return false;
        }
        return getId() != null && getId().equals(((Quiz) o).getId());
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
        return "Quiz{" +
                "id=" + getId() +
                ", title='" + getTitle() + "'" +
                ", description='" + getDescription() + "'" +
                ", isTest='" + getIsTest() + "'" +
                ", isPractice='" + getIsPractice() + "'" +
                ", quizType='" + getQuizType() + "'" +
                ", isActive='" + getIsActive() + "'" +
                ", activationTime='" + getActivationTime() + "'" +
                ", deactivationTime='" + getDeactivationTime() + "'" +
                ", timeLimitMinutes=" + getTimeLimitMinutes() +
                ", isTemplate='" + getIsTemplate() + "'" +
                ", templateName='" + getTemplateName() + "'" +
                "}";
    }
}
