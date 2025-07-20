package com.satori.platform.service.dto;

import jakarta.persistence.Lob;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.satori.platform.domain.Flashcard} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FlashcardDTO implements Serializable {

    private Long id;

    @NotNull
    private String term;

    @Lob
    private String definition;

    private String imageUrl;

    private String hint;

    @NotNull
    private Integer position;

    private LessonDTO lesson;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getHint() {
        return hint;
    }

    public void setHint(String hint) {
        this.hint = hint;
    }

    public Integer getPosition() {
        return position;
    }

    public void setPosition(Integer position) {
        this.position = position;
    }

    public LessonDTO getLesson() {
        return lesson;
    }

    public void setLesson(LessonDTO lesson) {
        this.lesson = lesson;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FlashcardDTO)) {
            return false;
        }

        FlashcardDTO flashcardDTO = (FlashcardDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, flashcardDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FlashcardDTO{" +
            "id=" + getId() +
            ", term='" + getTerm() + "'" +
            ", definition='" + getDefinition() + "'" +
            ", imageUrl='" + getImageUrl() + "'" +
            ", hint='" + getHint() + "'" +
            ", position=" + getPosition() +
            ", lesson=" + getLesson() +
            "}";
    }
}
