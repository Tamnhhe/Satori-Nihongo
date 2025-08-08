package com.satori.platform.repository;

import com.satori.platform.domain.FlashcardSession;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.Lesson;
import com.satori.platform.domain.enumeration.DifficultyLevel;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the FlashcardSession entity.
 */
@Repository
public interface FlashcardSessionRepository extends JpaRepository<FlashcardSession, Long> {

        /**
         * Find all sessions for a specific student
         */
        List<FlashcardSession> findByStudentOrderBySessionDateDesc(StudentProfile student);

        /**
         * Find all sessions for a specific lesson and student
         */
        List<FlashcardSession> findByStudentAndLessonOrderBySessionDateDesc(StudentProfile student, Lesson lesson);

        /**
         * Find the most recent session for a student and lesson
         */
        Optional<FlashcardSession> findFirstByStudentAndLessonOrderBySessionDateDesc(StudentProfile student,
                        Lesson lesson);

        /**
         * Find sessions that need review (next review date has passed)
         */
        @Query("SELECT fs FROM FlashcardSession fs WHERE fs.student = :student AND fs.nextReviewDate <= :currentDate AND fs.completed = true ORDER BY fs.nextReviewDate ASC")
        List<FlashcardSession> findSessionsNeedingReview(@Param("student") StudentProfile student,
                        @Param("currentDate") LocalDateTime currentDate);

        /**
         * Find sessions by difficulty level for a student
         */
        List<FlashcardSession> findByStudentAndDifficultyLevelOrderBySessionDateDesc(StudentProfile student,
                        DifficultyLevel difficultyLevel);

        /**
         * Calculate average accuracy for a student across all sessions
         */
        @Query("SELECT AVG(fs.accuracyPercentage) FROM FlashcardSession fs WHERE fs.student = :student AND fs.completed = true")
        Optional<Double> findAverageAccuracyByStudent(@Param("student") StudentProfile student);

        /**
         * Calculate average accuracy for a student in a specific lesson
         */
        @Query("SELECT AVG(fs.accuracyPercentage) FROM FlashcardSession fs WHERE fs.student = :student AND fs.lesson = :lesson AND fs.completed = true")
        Optional<Double> findAverageAccuracyByStudentAndLesson(@Param("student") StudentProfile student,
                        @Param("lesson") Lesson lesson);

        /**
         * Find sessions within a date range for performance tracking
         */
        @Query("SELECT fs FROM FlashcardSession fs WHERE fs.student = :student AND fs.sessionDate BETWEEN :startDate AND :endDate ORDER BY fs.sessionDate DESC")
        List<FlashcardSession> findSessionsInDateRange(@Param("student") StudentProfile student,
                        @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

        /**
         * Count total completed sessions for a student
         */
        @Query("SELECT COUNT(fs) FROM FlashcardSession fs WHERE fs.student = :student AND fs.completed = true")
        Long countCompletedSessionsByStudent(@Param("student") StudentProfile student);

        /**
         * Count total completed sessions for a student in a specific lesson
         */
        @Query("SELECT COUNT(fs) FROM FlashcardSession fs WHERE fs.student = :student AND fs.lesson = :lesson AND fs.completed = true")
        Long countCompletedSessionsByStudentAndLesson(@Param("student") StudentProfile student,
                        @Param("lesson") Lesson lesson);

        /**
         * Find sessions with accuracy below threshold for remedial work
         */
        @Query("SELECT fs FROM FlashcardSession fs WHERE fs.student = :student AND fs.accuracyPercentage < :threshold AND fs.completed = true ORDER BY fs.sessionDate DESC")
        List<FlashcardSession> findSessionsBelowAccuracyThreshold(@Param("student") StudentProfile student,
                        @Param("threshold") Double threshold);

        /**
         * Find the latest session for each lesson for a student
         */
        @Query("SELECT fs FROM FlashcardSession fs WHERE fs.student = :student AND fs.sessionDate = (SELECT MAX(fs2.sessionDate) FROM FlashcardSession fs2 WHERE fs2.student = :student AND fs2.lesson = fs.lesson)")
        List<FlashcardSession> findLatestSessionPerLesson(@Param("student") StudentProfile student);

        /**
         * Find incomplete sessions for a student
         */
        List<FlashcardSession> findByStudentAndCompletedFalseOrderBySessionDateDesc(StudentProfile student);

        /**
         * Calculate total study time for a student
         */
        @Query("SELECT SUM(fs.durationMinutes) FROM FlashcardSession fs WHERE fs.student = :student AND fs.completed = true")
        Optional<Long> findTotalStudyTimeByStudent(@Param("student") StudentProfile student);

        /**
         * Find sessions for performance trend analysis
         */
        @Query("SELECT fs FROM FlashcardSession fs WHERE fs.student = :student AND fs.completed = true ORDER BY fs.sessionDate ASC")
        List<FlashcardSession> findSessionsForTrendAnalysis(@Param("student") StudentProfile student);

        /**
         * Find recent flashcard sessions for analytics (last 30 days)
         */
        @Query("SELECT fs FROM FlashcardSession fs WHERE fs.student.id = :studentId AND fs.sessionDate >= :since AND fs.completed = true ORDER BY fs.sessionDate DESC")
        List<FlashcardSession> findRecentSessionsByStudentId(@Param("studentId") Long studentId,
                        @Param("since") LocalDateTime since);

        /**
         * Get total cards studied by student across all sessions
         */
        @Query("SELECT COALESCE(SUM(fs.cardsStudied), 0) FROM FlashcardSession fs WHERE fs.student.id = :studentId AND fs.completed = true")
        Integer getTotalCardsStudiedByStudentId(@Param("studentId") Long studentId);

        /**
         * Get total correct answers by student across all sessions
         */
        @Query("SELECT COALESCE(SUM(fs.correctAnswers), 0) FROM FlashcardSession fs WHERE fs.student.id = :studentId AND fs.completed = true")
        Integer getTotalCorrectAnswersByStudentId(@Param("studentId") Long studentId);

        /**
         * Get total incorrect answers by student across all sessions
         */
        @Query("SELECT COALESCE(SUM(fs.incorrectAnswers), 0) FROM FlashcardSession fs WHERE fs.student.id = :studentId AND fs.completed = true")
        Integer getTotalIncorrectAnswersByStudentId(@Param("studentId") Long studentId);

        /**
         * Get average accuracy percentage by student
         */
        @Query("SELECT AVG(fs.accuracyPercentage) FROM FlashcardSession fs WHERE fs.student.id = :studentId AND fs.completed = true AND fs.accuracyPercentage IS NOT NULL")
        Double getAverageAccuracyByStudentId(@Param("studentId") Long studentId);

        /**
         * Get total study time in minutes by student
         */
        @Query("SELECT COALESCE(SUM(fs.durationMinutes), 0) FROM FlashcardSession fs WHERE fs.student.id = :studentId AND fs.completed = true")
        Integer getTotalStudyTimeMinutesByStudentId(@Param("studentId") Long studentId);

        /**
         * Get flashcard performance by course for a student
         */
        @Query("SELECT fs FROM FlashcardSession fs JOIN fs.lesson l JOIN l.course c WHERE fs.student.id = :studentId AND c.id = :courseId AND fs.completed = true ORDER BY fs.sessionDate DESC")
        List<FlashcardSession> findSessionsByStudentIdAndCourseId(@Param("studentId") Long studentId,
                        @Param("courseId") Long courseId);

        /**
         * Get performance trend data for charts
         */
        @Query("SELECT fs FROM FlashcardSession fs WHERE fs.student.id = :studentId AND fs.sessionDate BETWEEN :startDate AND :endDate AND fs.completed = true ORDER BY fs.sessionDate ASC")
        List<FlashcardSession> findPerformanceTrendData(@Param("studentId") Long studentId,
                        @Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

        /**
         * Count mastered flashcards (sessions with accuracy >= 80%)
         */
        @Query("SELECT COUNT(DISTINCT fs.lesson.id) FROM FlashcardSession fs WHERE fs.student.id = :studentId AND fs.accuracyPercentage >= 80.0 AND fs.completed = true")
        Long countMasteredLessonsByStudentId(@Param("studentId") Long studentId);
}