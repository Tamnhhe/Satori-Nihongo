package com.satori.platform.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.satori.platform.domain.Lesson} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class LessonDTO implements Serializable {

    private Long id;

    @NotNull
    private String title;

    @Lob
    private String content;

    private String videoUrl;

    private String slideUrl;

    private CourseDTO course;

    private Set<QuizDTO> quizzes = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }

    public String getSlideUrl() {
        return slideUrl;
    }

    public void setSlideUrl(String slideUrl) {
        this.slideUrl = slideUrl;
    }

    public CourseDTO getCourse() {
        return course;
    }

    public void setCourse(CourseDTO course) {
        this.course = course;
    }

    public Set<QuizDTO> getQuizzes() {
        return quizzes;
    }

    public void setQuizzes(Set<QuizDTO> quizzes) {
        this.quizzes = quizzes;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof LessonDTO)) {
            return false;
        }

        LessonDTO lessonDTO = (LessonDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, lessonDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "LessonDTO{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", content='" + getContent() + "'" +
            ", videoUrl='" + getVideoUrl() + "'" +
            ", slideUrl='" + getSlideUrl() + "'" +
            ", course=" + getCourse() +
            ", quizzes=" + getQuizzes() +
            "}";
    }
}
