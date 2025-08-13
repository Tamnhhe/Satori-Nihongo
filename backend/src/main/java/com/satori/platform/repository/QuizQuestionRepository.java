package com.satori.platform.repository;

import com.satori.platform.domain.QuizQuestion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the QuizQuestion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {

    // Find questions by quiz ID ordered by position
    List<QuizQuestion> findByQuizIdOrderByPosition(Long quizId);

    // Count questions by quiz ID
    long countByQuizId(Long quizId);

    // Find maximum position for a quiz
    @Query("SELECT MAX(qq.position) FROM QuizQuestion qq WHERE qq.quiz.id = :quizId")
    Optional<Integer> findMaxPositionByQuizId(@org.springframework.data.repository.query.Param("quizId") Long quizId);

    // Find questions by quiz ID and position greater than or equal to specified
    // position
    List<QuizQuestion> findByQuizIdAndPositionGreaterThanEqual(Long quizId, Integer position);

    // Find specific quiz question by quiz ID and question ID
    Optional<QuizQuestion> findByQuizIdAndQuestionId(Long quizId, Long questionId);

    // Delete all questions for a quiz
    void deleteByQuizId(Long quizId);
}
