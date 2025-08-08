package com.satori.platform.repository;

import com.satori.platform.domain.StudentQuizResponse;
import java.util.List;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the StudentQuizResponse entity.
 */
@Repository
public interface StudentQuizResponseRepository extends JpaRepository<StudentQuizResponse, Long> {

    /**
     * Find all responses for a specific student quiz attempt
     */
    List<StudentQuizResponse> findByStudentQuizIdOrderByQuizQuestionPosition(Long studentQuizId);

    /**
     * Find response for a specific question in a student quiz attempt
     */
    @Query("SELECT sqr FROM StudentQuizResponse sqr WHERE sqr.studentQuiz.id = :studentQuizId AND sqr.quizQuestion.id = :quizQuestionId")
    StudentQuizResponse findByStudentQuizIdAndQuizQuestionId(@Param("studentQuizId") Long studentQuizId,
            @Param("quizQuestionId") Long quizQuestionId);

    /**
     * Count correct responses for a student quiz attempt
     */
    @Query("SELECT COUNT(sqr) FROM StudentQuizResponse sqr WHERE sqr.studentQuiz.id = :studentQuizId AND sqr.isCorrect = true")
    Long countCorrectResponsesByStudentQuizId(@Param("studentQuizId") Long studentQuizId);

    /**
     * Count total responses for a student quiz attempt
     */
    Long countByStudentQuizId(Long studentQuizId);

    /**
     * Delete all responses for a student quiz attempt
     */
    void deleteByStudentQuizId(Long studentQuizId);
}