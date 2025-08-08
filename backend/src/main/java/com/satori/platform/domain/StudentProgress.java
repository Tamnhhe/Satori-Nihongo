package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A StudentProgress.
 */
@Entity
@Table(name = "student_progress")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class StudentProgress implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "completion_percentage")
    private Double completionPercentage;

    @Column(name = "lessons_completed")
    private Integer lessonsCompleted;

    @Column(name = "total_lessons")
    private Integer totalLessons;

    @Column(name = "quizzes_completed")
    private Integer quizzesCompleted;

    @Column(name = "total_quizzes")
    private Integer totalQuizzes;

    @Column(name = "average_quiz_score")
    private Double averageQuizScore;

    @Column(name = "flashcards_mastered")
    private Integer flashcardsMastered;

    @Column(name = "total_flashcards")
    private Integer totalFlashcards;

    @Column(name = "study_time_minutes")
    private Integer studyTimeMinutes;

    @Column(name = "last_activity_date")
    private LocalDateTime lastActivityDate;

    @Column(name = "streak_days")
    private Integer streakDays;

    @Column(name = "performance_trend")
    private String performanceTrend;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "userProfile", "classes", "flashcardSessions", "studentProgress" }, allowSetters = true)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "lessons", "schedules", "teacher", "quizzes", "giftCodes", "studentProgress" }, allowSetters = true)
    private Course course;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public StudentProgress id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getCompletionPercentage() {
        return this.completionPercentage;
    }

    public StudentProgress completionPercentage(Double completionPercentage) {
        this.setCompletionPercentage(completionPercentage);
        return this;
    }

    public void setCompletionPercentage(Double completionPercentage) {
        this.completionPercentage = completionPercentage;
    }

    public Integer getLessonsCompleted() {
        return this.lessonsCompleted;
    }

    public StudentProgress lessonsCompleted(Integer lessonsCompleted) {
        this.setLessonsCompleted(lessonsCompleted);
        return this;
    }

    public void setLessonsCompleted(Integer lessonsCompleted) {
        this.lessonsCompleted = lessonsCompleted;
    }

    public Integer getTotalLessons() {
        return this.totalLessons;
    }

    public StudentProgress totalLessons(Integer totalLessons) {
        this.setTotalLessons(totalLessons);
        return this;
    }

    public void setTotalLessons(Integer totalLessons) {
        this.totalLessons = totalLessons;
    }

    public Integer getQuizzesCompleted() {
        return this.quizzesCompleted;
    }

    public StudentProgress quizzesCompleted(Integer quizzesCompleted) {
        this.setQuizzesCompleted(quizzesCompleted);
        return this;
    }

    public void setQuizzesCompleted(Integer quizzesCompleted) {
        this.quizzesCompleted = quizzesCompleted;
    }

    public Integer getTotalQuizzes() {
        return this.totalQuizzes;
    }

    public StudentProgress totalQuizzes(Integer totalQuizzes) {
        this.setTotalQuizzes(totalQuizzes);
        return this;
    }

    public void setTotalQuizzes(Integer totalQuizzes) {
        this.totalQuizzes = totalQuizzes;
    }

    public Double getAverageQuizScore() {
        return this.averageQuizScore;
    }

    public StudentProgress averageQuizScore(Double averageQuizScore) {
        this.setAverageQuizScore(averageQuizScore);
        return this;
    }

    public void setAverageQuizScore(Double averageQuizScore) {
        this.averageQuizScore = averageQuizScore;
    }

    public Integer getFlashcardsMastered() {
        return this.flashcardsMastered;
    }

    public StudentProgress flashcardsMastered(Integer flashcardsMastered) {
        this.setFlashcardsMastered(flashcardsMastered);
        return this;
    }

    public void setFlashcardsMastered(Integer flashcardsMastered) {
        this.flashcardsMastered = flashcardsMastered;
    }

    public Integer getTotalFlashcards() {
        return this.totalFlashcards;
    }

    public StudentProgress totalFlashcards(Integer totalFlashcards) {
        this.setTotalFlashcards(totalFlashcards);
        return this;
    }

    public void setTotalFlashcards(Integer totalFlashcards) {
        this.totalFlashcards = totalFlashcards;
    }

    public Integer getStudyTimeMinutes() {
        return this.studyTimeMinutes;
    }

    public StudentProgress studyTimeMinutes(Integer studyTimeMinutes) {
        this.setStudyTimeMinutes(studyTimeMinutes);
        return this;
    }

    public void setStudyTimeMinutes(Integer studyTimeMinutes) {
        this.studyTimeMinutes = studyTimeMinutes;
    }

    public LocalDateTime getLastActivityDate() {
        return this.lastActivityDate;
    }

    public StudentProgress lastActivityDate(LocalDateTime lastActivityDate) {
        this.setLastActivityDate(lastActivityDate);
        return this;
    }

    public void setLastActivityDate(LocalDateTime lastActivityDate) {
        this.lastActivityDate = lastActivityDate;
    }

    public Integer getStreakDays() {
        return this.streakDays;
    }

    public StudentProgress streakDays(Integer streakDays) {
        this.setStreakDays(streakDays);
        return this;
    }

    public void setStreakDays(Integer streakDays) {
        this.streakDays = streakDays;
    }

    public String getPerformanceTrend() {
        return this.performanceTrend;
    }

    public StudentProgress performanceTrend(String performanceTrend) {
        this.setPerformanceTrend(performanceTrend);
        return this;
    }

    public void setPerformanceTrend(String performanceTrend) {
        this.performanceTrend = performanceTrend;
    }

    public LocalDateTime getCreatedDate() {
        return this.createdDate;
    }

    public StudentProgress createdDate(LocalDateTime createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getUpdatedDate() {
        return this.updatedDate;
    }

    public StudentProgress updatedDate(LocalDateTime updatedDate) {
        this.setUpdatedDate(updatedDate);
        return this;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }

    public StudentProfile getStudent() {
        return this.student;
    }

    public void setStudent(StudentProfile studentProfile) {
        this.student = studentProfile;
    }

    public StudentProgress student(StudentProfile studentProfile) {
        this.setStudent(studentProfile);
        return this;
    }

    public Course getCourse() {
        return this.course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public StudentProgress course(Course course) {
        this.setCourse(course);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof StudentProgress)) {
            return false;
        }
        return getId() != null && getId().equals(((StudentProgress) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "StudentProgress{" +
            "id=" + getId() +
            ", completionPercentage=" + getCompletionPercentage() +
            ", lessonsCompleted=" + getLessonsCompleted() +
            ", totalLessons=" + getTotalLessons() +
            ", quizzesCompleted=" + getQuizzesCompleted() +
            ", totalQuizzes=" + getTotalQuizzes() +
            ", averageQuizScore=" + getAverageQuizScore() +
            ", flashcardsMastered=" + getFlashcardsMastered() +
            ", totalFlashcards=" + getTotalFlashcards() +
            ", studyTimeMinutes=" + getStudyTimeMinutes() +
            ", lastActivityDate='" + getLastActivityDate() + "'" +
            ", streakDays=" + getStreakDays() +
            ", performanceTrend='" + getPerformanceTrend() + "'" +
            ", createdDate='" + getCreatedDate() + "'" +
            ", updatedDate='" + getUpdatedDate() + "'" +
            "}";
    }
}