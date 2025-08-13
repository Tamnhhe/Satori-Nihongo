package com.satori.platform.repository;

import com.satori.platform.domain.StudentQuizParticipation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the StudentQuizParticipation entity.
 */
@Repository
public interface StudentQuizParticipationRepository extends JpaRepository<StudentQuizParticipation, Long> {

    /**
     * Find all participations for a specific student quiz
     */
    List<StudentQuizParticipation> findByStudentQuizId(Long studentQuizId);

    /**
     * Find all participations for a specific student quiz with pagination
     */
    Page<StudentQuizParticipation> findByStudentQuizId(Long studentQuizId, Pageable pageable);

    /**
     * Find participations by completion status
     */
    List<StudentQuizParticipation> findByCompletionStatus(String completionStatus);

    /**
     * Find participations within a date range
     */
    @Query("SELECT sqp FROM StudentQuizParticipation sqp WHERE sqp.participationDate BETWEEN :startDate AND :endDate")
    List<StudentQuizParticipation> findByParticipationDateBetween(
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate);

    /**
     * Find participations by student ID through StudentQuiz relationship
     */
    @Query("SELECT sqp FROM StudentQuizParticipation sqp JOIN sqp.studentQuiz sq WHERE sq.student.id = :studentId")
    List<StudentQuizParticipation> findByStudentId(@Param("studentId") Long studentId);

    /**
     * Find participations by student ID with pagination
     */
    @Query("SELECT sqp FROM StudentQuizParticipation sqp JOIN sqp.studentQuiz sq WHERE sq.student.id = :studentId")
    Page<StudentQuizParticipation> findByStudentId(@Param("studentId") Long studentId, Pageable pageable);

    /**
     * Find participations by quiz ID through StudentQuiz relationship
     */
    @Query("SELECT sqp FROM StudentQuizParticipation sqp JOIN sqp.studentQuiz sq WHERE sq.quiz.id = :quizId")
    List<StudentQuizParticipation> findByQuizId(@Param("quizId") Long quizId);

    /**
     * Find participations by quiz ID with pagination
     */
    @Query("SELECT sqp FROM StudentQuizParticipation sqp JOIN sqp.studentQuiz sq WHERE sq.quiz.id = :quizId")
    Page<StudentQuizParticipation> findByQuizId(@Param("quizId") Long quizId, Pageable pageable);

    /**
     * Find the latest participation for a specific student quiz
     */
    @Query("SELECT sqp FROM StudentQuizParticipation sqp WHERE sqp.studentQuiz.id = :studentQuizId ORDER BY sqp.participationDate DESC")
    Optional<StudentQuizParticipation> findLatestByStudentQuizId(@Param("studentQuizId") Long studentQuizId);

    /**
     * Find participations with score above threshold
     */
    @Query("SELECT sqp FROM StudentQuizParticipation sqp WHERE sqp.score >= :minScore")
    List<StudentQuizParticipation> findByScoreGreaterThanEqual(@Param("minScore") Double minScore);

    /**
     * Find participations with score within range
     */
    @Query("SELECT sqp FROM StudentQuizParticipation sqp WHERE sqp.score BETWEEN :minScore AND :maxScore")
    List<StudentQuizParticipation> findByScoreBetween(@Param("minScore") Double minScore,
            @Param("maxScore") Double maxScore);

    /**
     * Get average score for a specific quiz
     */
    @Query("SELECT AVG(sqp.score) FROM StudentQuizParticipation sqp JOIN sqp.studentQuiz sq WHERE sq.quiz.id = :quizId AND sqp.completionStatus = 'COMPLETED'")
    Double getAverageScoreByQuizId(@Param("quizId") Long quizId);

    /**
     * Get average score for a specific student
     */
    @Query("SELECT AVG(sqp.score) FROM StudentQuizParticipation sqp JOIN sqp.studentQuiz sq WHERE sq.student.id = :studentId AND sqp.completionStatus = 'COMPLETED'")
    Double getAverageScoreByStudentId(@Param("studentId") Long studentId);

    /**
     * Count participations by completion status for a specific quiz
     */
    @Query("SELECT COUNT(sqp) FROM StudentQuizParticipation sqp JOIN sqp.studentQuiz sq WHERE sq.quiz.id = :quizId AND sqp.completionStatus = :status")
    Long countByQuizIdAndCompletionStatus(@Param("quizId") Long quizId, @Param("status") String status);

    /**
     * Find participations that took longer than specified time
     */
    @Query("SELECT sqp FROM StudentQuizParticipation sqp WHERE sqp.timeSpentMinutes > :maxTime")
    List<StudentQuizParticipation> findByTimeSpentMinutesGreaterThan(@Param("maxTime") Integer maxTime);

    /**
     * Get participation statistics for a quiz
     */
    @Query("SELECT sqp.completionStatus, COUNT(sqp), AVG(sqp.score), AVG(sqp.timeSpentMinutes) " +
            "FROM StudentQuizParticipation sqp JOIN sqp.studentQuiz sq " +
            "WHERE sq.quiz.id = :quizId " +
            "GROUP BY sqp.completionStatus")
    List<Object[]> getParticipationStatisticsByQuizId(@Param("quizId") Long quizId);

    /**
     * Find recent participations for a student
     */
    @Query("SELECT sqp FROM StudentQuizParticipation sqp JOIN sqp.studentQuiz sq " +
            "WHERE sq.student.id = :studentId " +
            "ORDER BY sqp.participationDate DESC")
    List<StudentQuizParticipation> findRecentByStudentId(@Param("studentId") Long studentId, Pageable pageable);

    /**
     * Check if student has already participated in a specific quiz
     */
    @Query("SELECT CASE WHEN COUNT(sqp) > 0 THEN true ELSE false END " +
            "FROM StudentQuizParticipation sqp JOIN sqp.studentQuiz sq " +
            "WHERE sq.student.id = :studentId AND sq.quiz.id = :quizId")
    boolean hasStudentParticipatedInQuiz(@Param("studentId") Long studentId, @Param("quizId") Long quizId);

    /**
     * Find incomplete participations older than specified date
     */
    @Query("SELECT sqp FROM StudentQuizParticipation sqp " +
            "WHERE sqp.completionStatus != 'COMPLETED' AND sqp.participationDate < :cutoffDate")
    List<StudentQuizParticipation> findIncompleteParticipationsOlderThan(@Param("cutoffDate") Instant cutoffDate);

    /**
     * Delete old completed participations for cleanup
     */
    @Modifying
    @Query("DELETE FROM StudentQuizParticipation sqp " +
            "WHERE sqp.completionStatus = 'COMPLETED' AND sqp.participationDate < :cutoffDate")
    int deleteOldCompletedParticipations(@Param("cutoffDate") Instant cutoffDate);
}