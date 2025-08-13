package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Lesson.
 */
@Entity
@Table(name = "lesson")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Lesson implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "title", nullable = false)
    private String title;

    @Lob
    @Column(name = "content")
    private String content;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(name = "slide_url")
    private String slideUrl;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "duration")
    private Integer duration;

    @Column(name = "active")
    private Boolean active;

    @Column(name = "created_date")
    private Instant createdDate;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "lesson")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "lesson" }, allowSetters = true)
    private Set<Flashcard> flashcards = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "lessons", "schedules", "teacher", "quizzes" }, allowSetters = true)
    private Course course;

    @ManyToMany(fetch = FetchType.LAZY, mappedBy = "lessons")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "questions", "assignedTos", "courses", "lessons" }, allowSetters = true)
    private Set<Quiz> quizzes = new HashSet<>();

    @OneToMany(mappedBy = "lesson", fetch = FetchType.LAZY)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "lesson", "uploadedBy" }, allowSetters = true)
    private Set<FileMetaData> fileAttachments = new HashSet<>();

    @OneToMany(mappedBy = "lesson", fetch = FetchType.LAZY)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "student", "lesson" }, allowSetters = true)
    private Set<FlashcardSession> flashcardSessions = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Lesson id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return this.title;
    }

    public Lesson title(String title) {
        this.setTitle(title);
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return this.content;
    }

    public Lesson content(String content) {
        this.setContent(content);
        return this;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getVideoUrl() {
        return this.videoUrl;
    }

    public Lesson videoUrl(String videoUrl) {
        this.setVideoUrl(videoUrl);
        return this;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getSlideUrl() {
        return this.slideUrl;
    }

    public Lesson slideUrl(String slideUrl) {
        this.setSlideUrl(slideUrl);
        return this;
    }

    public void setSlideUrl(String slideUrl) {
        this.slideUrl = slideUrl;
    }

    public Integer getOrderIndex() {
        return this.orderIndex;
    }

    public Lesson orderIndex(Integer orderIndex) {
        this.setOrderIndex(orderIndex);
        return this;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }

    public Integer getDuration() {
        return this.duration;
    }

    public Lesson duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public Boolean getActive() {
        return this.active;
    }

    public Lesson active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Instant getCreatedDate() {
        return this.createdDate;
    }

    public Lesson createdDate(Instant createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
    }

    public Set<Flashcard> getFlashcards() {
        return this.flashcards;
    }

    public void setFlashcards(Set<Flashcard> flashcards) {
        if (this.flashcards != null) {
            this.flashcards.forEach(i -> i.setLesson(null));
        }
        if (flashcards != null) {
            flashcards.forEach(i -> i.setLesson(this));
        }
        this.flashcards = flashcards;
    }

    public Lesson flashcards(Set<Flashcard> flashcards) {
        this.setFlashcards(flashcards);
        return this;
    }

    public Lesson addFlashcards(Flashcard flashcard) {
        this.flashcards.add(flashcard);
        flashcard.setLesson(this);
        return this;
    }

    public Lesson removeFlashcards(Flashcard flashcard) {
        this.flashcards.remove(flashcard);
        flashcard.setLesson(null);
        return this;
    }

    public Course getCourse() {
        return this.course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Lesson course(Course course) {
        this.setCourse(course);
        return this;
    }

    public Set<Quiz> getQuizzes() {
        return this.quizzes;
    }

    public void setQuizzes(Set<Quiz> quizzes) {
        if (this.quizzes != null) {
            this.quizzes.forEach(i -> i.removeLesson(this));
        }
        if (quizzes != null) {
            quizzes.forEach(i -> i.addLesson(this));
        }
        this.quizzes = quizzes;
    }

    public Lesson quizzes(Set<Quiz> quizzes) {
        this.setQuizzes(quizzes);
        return this;
    }

    public Lesson addQuiz(Quiz quiz) {
        this.quizzes.add(quiz);
        quiz.getLessons().add(this);
        return this;
    }

    public Lesson removeQuiz(Quiz quiz) {
        this.quizzes.remove(quiz);
        quiz.getLessons().remove(this);
        return this;
    }

    public Set<FileMetaData> getFileAttachments() {
        return this.fileAttachments;
    }

    public void setFileAttachments(Set<FileMetaData> fileAttachments) {
        if (this.fileAttachments != null) {
            this.fileAttachments.forEach(i -> i.setLesson(null));
        }
        if (fileAttachments != null) {
            fileAttachments.forEach(i -> i.setLesson(this));
        }
        this.fileAttachments = fileAttachments;
    }

    public Lesson fileAttachments(Set<FileMetaData> fileAttachments) {
        this.setFileAttachments(fileAttachments);
        return this;
    }

    public Lesson addFileAttachment(FileMetaData fileMetaData) {
        this.fileAttachments.add(fileMetaData);
        fileMetaData.setLesson(this);
        return this;
    }

    public Lesson removeFileAttachment(FileMetaData fileMetaData) {
        this.fileAttachments.remove(fileMetaData);
        fileMetaData.setLesson(null);
        return this;
    }

    public Set<FlashcardSession> getFlashcardSessions() {
        return this.flashcardSessions;
    }

    public void setFlashcardSessions(Set<FlashcardSession> flashcardSessions) {
        if (this.flashcardSessions != null) {
            this.flashcardSessions.forEach(i -> i.setLesson(null));
        }
        if (flashcardSessions != null) {
            flashcardSessions.forEach(i -> i.setLesson(this));
        }
        this.flashcardSessions = flashcardSessions;
    }

    public Lesson flashcardSessions(Set<FlashcardSession> flashcardSessions) {
        this.setFlashcardSessions(flashcardSessions);
        return this;
    }

    public Lesson addFlashcardSession(FlashcardSession flashcardSession) {
        this.flashcardSessions.add(flashcardSession);
        flashcardSession.setLesson(this);
        return this;
    }

    public Lesson removeFlashcardSession(FlashcardSession flashcardSession) {
        this.flashcardSessions.remove(flashcardSession);
        flashcardSession.setLesson(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Lesson)) {
            return false;
        }
        return getId() != null && getId().equals(((Lesson) o).getId());
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
        return "Lesson{" +
                "id=" + getId() +
                ", title='" + getTitle() + "'" +
                ", content='" + getContent() + "'" +
                ", videoUrl='" + getVideoUrl() + "'" +
                ", slideUrl='" + getSlideUrl() + "'" +
                "}";
    }
}
