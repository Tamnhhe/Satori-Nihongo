package com.satori.platform.repository;

import com.satori.platform.domain.Quiz;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Quiz entity.
 *
 * When extending this class, extend QuizRepositoryWithBagRelationships too.
 * For more information refer to
 * https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface QuizRepository extends QuizRepositoryWithBagRelationships, JpaRepository<Quiz, Long> {
    default Optional<Quiz> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<Quiz> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<Quiz> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    // Additional methods needed by services
    @Query("SELECT q FROM Quiz q JOIN q.courses c WHERE c.id = :courseId")
    List<Quiz> findByCourseId(@org.springframework.data.repository.query.Param("courseId") Long courseId);

    @Query("SELECT q FROM Quiz q JOIN q.lessons l WHERE l.id = :lessonId")
    List<Quiz> findByLessonId(@org.springframework.data.repository.query.Param("lessonId") Long lessonId);

    @Query("SELECT q FROM Quiz q WHERE q.isTemplate = true AND q.templateName LIKE %:name%")
    List<Quiz> findTemplatesByName(@org.springframework.data.repository.query.Param("name") String name);

    @Query("SELECT q FROM Quiz q WHERE q.isActive = false AND q.activationTime <= :now")
    List<Quiz> findQuizzesToActivate(@org.springframework.data.repository.query.Param("now") java.time.Instant now);

    @Query("SELECT q FROM Quiz q WHERE q.isActive = true AND q.deactivationTime <= :now")
    List<Quiz> findQuizzesToDeactivate(@org.springframework.data.repository.query.Param("now") java.time.Instant now);

    @Query("SELECT q FROM Quiz q JOIN q.courses c WHERE c.id = :courseId AND q.isActive = true")
    List<Quiz> findActiveByCourseId(@org.springframework.data.repository.query.Param("courseId") Long courseId);

    @Query("SELECT q FROM Quiz q JOIN q.lessons l WHERE l.id = :lessonId AND q.isActive = true")
    List<Quiz> findActiveByLessonId(@org.springframework.data.repository.query.Param("lessonId") Long lessonId);

    @Query("SELECT q FROM Quiz q WHERE q.isActive = true AND q.deactivationTime BETWEEN :startDate AND :endDate")
    List<Quiz> findActiveQuizzesWithDueDateBetween(
            @org.springframework.data.repository.query.Param("startDate") java.time.Instant startDate,
            @org.springframework.data.repository.query.Param("endDate") java.time.Instant endDate);

    @Query("SELECT DISTINCT q FROM Quiz q JOIN q.courses c WHERE c.teacher.id = :teacherId")
    Page<Quiz> findByTeacherId(@org.springframework.data.repository.query.Param("teacherId") Long teacherId,
            Pageable pageable);
}
