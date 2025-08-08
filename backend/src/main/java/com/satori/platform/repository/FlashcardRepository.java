package com.satori.platform.repository;

import com.satori.platform.domain.Flashcard;
import com.satori.platform.domain.Lesson;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA repository for the Flashcard entity.
 */
@SuppressWarnings("unused")
@Repository
public interface FlashcardRepository extends JpaRepository<Flashcard, Long> {
    /**
     * Find all flashcards for a lesson ordered by position
     */
    List<Flashcard> findByLessonOrderByPosition(Lesson lesson);
}
