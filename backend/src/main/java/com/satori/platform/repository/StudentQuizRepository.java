package com.satori.platform.repository;

import com.satori.platform.domain.StudentQuiz;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the StudentQuiz entity.
 */
@Repository
public interface StudentQuizRepository extends JpaRepository<StudentQuiz, Long> {
        /**
         * Find all quiz attempts by student
         */
        @Query("SELECT sq FROM StudentQuiz sq WHERE sq.student.id = :studentId ORDER BY sq.startTime DESC")
        Page<StudentQuiz> findByStudentIdOrderByStartTimeDesc(@Param("studentId") Long studentId, Pageable pageable);

        /**
         * Find all quiz attempts by student and quiz
         */
        @Query("SELECT sq FROM StudentQuiz sq WHERE sq.student.id = :studentId AND sq.quiz.id = :quizId ORDER BY sq.startTime DESC")
        List<StudentQuiz> findByStudentIdAndQuizIdOrderByStartTimeDesc(@Param("studentId") Long studentId,
                        @Param("quizId") Long quizId);

        /**
         * Find active (not completed) quiz attempt by student and quiz
         */
        @Query("SELECT sq FROM StudentQuiz sq WHERE sq.student.id = :studentId AND sq.quiz.id = :quizId AND sq.completed = false")
        Optional<StudentQuiz> findActiveAttemptByStudentAndQuiz(@Param("studentId") Long studentId,
                        @Param("quizId") Long quizId);

        /**
         * Find all incomplete quiz attempts that should be auto-submitted
         */
        @Query("SELECT sq FROM StudentQuiz sq JOIN sq.quiz q WHERE sq.completed = false AND sq.paused = false AND " +
                        "((q.timeLimitMinutes IS NOT NULL AND sq.startTime < :cutoffTime) OR " +
                        "(q.deactivationTime IS NOT NULL AND q.deactivationTime < :currentTime))")
        List<StudentQuiz> findAttemptsToAutoSubmit(@Param("cutoffTime") Instant cutoffTime,
                        @Param("currentTime") Instant currentTime);

        /**
         * Count completed attempts for a student and quiz
         */
        @Query("SELECT COUNT(sq) FROM StudentQuiz sq WHERE sq.student.id = :studentId AND sq.quiz.id = :quizId AND sq.completed = true")
        Long countCompletedAttemptsByStudentAndQuiz(@Param("studentId") Long studentId, @Param("quizId") Long quizId);

        /**
         * Find best score for a student and quiz
         */
        @Query("SELECT MAX(sq.score) FROM StudentQuiz sq WHERE sq.student.id = :studentId AND sq.quiz.id = :quizId AND sq.completed = true")
        Optional<Double> findBestScoreByStudentAndQuiz(@Param("studentId") Long studentId,
                        @Param("quizId") Long quizId);

        /**
         * Find average score for a student across all quizzes
         */
        @Query("SELECT AVG(sq.score) FROM StudentQuiz sq WHERE sq.student.id = :studentId AND sq.completed = true AND sq.score IS NOT NULL")
        Optional<Double> findAverageScoreByStudent(@Param("studentId") Long studentId);

        /**
         * Find recent quiz attempts by student (last 30 days)
         */
        @Query("SELECT sq FROM StudentQuiz sq WHERE sq.student.id = :studentId AND sq.startTime >= :since ORDER BY sq.startTime DESC")
        List<StudentQuiz> findRecentAttemptsByStudent(@Param("studentId") Long studentId,
                        @Param("since") Instant since);

        /**
         * Find recent quiz attempts by student with limit
         */
        @Query("SELECT sq FROM StudentQuiz sq WHERE sq.student.id = :studentId AND sq.completed = true ORDER BY sq.startTime DESC")
        List<StudentQuiz> findRecentByStudentId(@Param("studentId") Long studentId, Pageable pageable);

        default List<StudentQuiz> findRecentByStudentId(Long studentId, int limit) {
                return findRecentByStudentId(studentId, org.springframework.data.domain.PageRequest.of(0, limit));
        }

        /**
         * Find all quiz attempts by quiz ID
         */
        List<StudentQuiz> findByQuizId(Long quizId);

        /**
         * Find student quiz attempts by date range and optional filters
         */
        @Query("SELECT sq FROM StudentQuiz sq JOIN sq.quiz q JOIN q.courses c " +
                        "WHERE sq.startTime >= :startDate AND sq.startTime <= :endDate " +
                        "AND (:courseId IS NULL OR c.id = :courseId) " +
                        "AND (:studentId IS NULL OR sq.student.id = :studentId) " +
                        "ORDER BY sq.startTime DESC")
        List<StudentQuiz> findByDateRangeAndFilters(@Param("startDate") Instant startDate,
                        @Param("endDate") Instant endDate,
                        @Param("courseId") Long courseId,
                        @Param("studentId") Long studentId);

        /**
         * Find student quiz attempts by course ID
         */
        @Query("SELECT sq FROM StudentQuiz sq JOIN sq.quiz q JOIN q.courses c WHERE c.id = :courseId")
        List<StudentQuiz> findByCourseId(@Param("courseId") Long courseId);

        /**
         * Find student quiz attempts by course ID and completed between dates
         */
        @Query("SELECT sq FROM StudentQuiz sq JOIN sq.quiz q JOIN q.courses c WHERE c.id = :courseId AND sq.endTime BETWEEN :startDate AND :endDate")
        List<StudentQuiz> findByCourseIdAndCompletedAtBetween(@Param("courseId") String courseId,
                        @Param("startDate") Instant startDate, @Param("endDate") Instant endDate);
}
