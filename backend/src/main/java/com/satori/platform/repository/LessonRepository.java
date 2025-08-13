package com.satori.platform.repository;

import com.satori.platform.domain.Lesson;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
/**
 * Spring Data JPA repository for the Lesson entity.
 */
@SuppressWarnings("unused")
@Repository
public interface LessonRepository extends JpaRepository<Lesson, Long> {
    /**
     * Find lessons by course ID.
     */
    List<Lesson> findByCourseId(Long courseId);

    /**
     * Find lessons by course ID ordered by title.
     */
    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId ORDER BY l.title")
    List<Lesson> findByCourseIdOrderByTitle(@Param("courseId") Long courseId);

    /**
     * Find lessons with file attachments.
     */
    @Query("SELECT DISTINCT l FROM Lesson l LEFT JOIN FETCH l.fileAttachments WHERE l.course.id = :courseId")
    List<Lesson> findByCourseIdWithFileAttachments(@Param("courseId") Long courseId);

    /**
     * Count lessons in a course.
     */
    long countByCourseId(Long courseId);

    /**
     * Find lessons by title (case-insensitive).
     */
    @Query("SELECT l FROM Lesson l WHERE l.course.id = :courseId AND LOWER(l.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    List<Lesson> findByCourseIdAndTitleContainingIgnoreCase(@Param("courseId") Long courseId, @Param("title") String title);

    /**
     * Find lessons by multiple course IDs.
     */
    List<Lesson> findByCourseIdIn(List<Long> courseIds);
}
