package com.satori.platform.repository;

import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.StudentProgress;
import com.satori.platform.service.dto.CoursePerformanceDTO;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the StudentProgress entity.
 */
@Repository
public interface StudentProgressRepository extends JpaRepository<StudentProgress, Long> {

        /**
         * Find student progress by student ID and course ID.
         */
        Optional<StudentProgress> findByStudentIdAndCourseId(Long studentId, Long courseId);

        /**
         * Find all students enrolled in a course.
         */
        @Query("SELECT sp.student FROM StudentProgress sp WHERE sp.course.id = :courseId")
        List<StudentProfile> findStudentsByCourseId(@Param("courseId") Long courseId);

        /**
         * Find all progress records for a student.
         */
        List<StudentProgress> findByStudentId(Long studentId);

        /**
         * Find all progress records for a course.
         */
        List<StudentProgress> findByCourseId(Long courseId);

        /**
         * Delete all progress records for a course.
         */
        void deleteByCourseId(Long courseId);

        /**
         * Delete all progress records for a student.
         */
        void deleteByStudentId(Long studentId);

        /**
         * Check if student is enrolled in course.
         */
        boolean existsByStudentIdAndCourseId(Long studentId, Long courseId);

        /**
         * Find students with completion percentage above threshold.
         */
        @Query("SELECT sp FROM StudentProgress sp WHERE sp.course.id = :courseId AND sp.completionPercentage >= :threshold")
        List<StudentProgress> findByCourseIdAndCompletionPercentageGreaterThanEqual(
                        @Param("courseId") Long courseId,
                        @Param("threshold") Double threshold);

        /**
         * Get average completion percentage for a course.
         */
        @Query("SELECT AVG(sp.completionPercentage) FROM StudentProgress sp WHERE sp.course.id = :courseId")
        Double getAverageCompletionPercentageByCourseId(@Param("courseId") Long courseId);

        /**
         * Get overall completion percentage for a student across all courses.
         */
        @Query("SELECT AVG(sp.completionPercentage) FROM StudentProgress sp WHERE sp.student.id = :studentId")
        Double getOverallCompletionPercentageByStudentId(@Param("studentId") Long studentId);

        /**
         * Get total study time for a student across all courses.
         */
        @Query("SELECT COALESCE(SUM(sp.studyTimeMinutes), 0) FROM StudentProgress sp WHERE sp.student.id = :studentId")
        Integer getTotalStudyTimeByStudentId(@Param("studentId") Long studentId);

        /**
         * Get total flashcards mastered by student across all courses.
         */
        @Query("SELECT COALESCE(SUM(sp.flashcardsMastered), 0) FROM StudentProgress sp WHERE sp.student.id = :studentId")
        Integer getTotalFlashcardsMasteredByStudentId(@Param("studentId") Long studentId);

        /**
         * Get total flashcards available for student across all courses.
         */
        @Query("SELECT COALESCE(SUM(sp.totalFlashcards), 0) FROM StudentProgress sp WHERE sp.student.id = :studentId")
        Integer getTotalFlashcardsAvailableByStudentId(@Param("studentId") Long studentId);

        /**
         * Get total quizzes completed by student across all courses.
         */
        @Query("SELECT COALESCE(SUM(sp.quizzesCompleted), 0) FROM StudentProgress sp WHERE sp.student.id = :studentId")
        Integer getTotalQuizzesCompletedByStudentId(@Param("studentId") Long studentId);

        /**
         * Get total quizzes available for student across all courses.
         */
        @Query("SELECT COALESCE(SUM(sp.totalQuizzes), 0) FROM StudentProgress sp WHERE sp.student.id = :studentId")
        Integer getTotalQuizzesAvailableByStudentId(@Param("studentId") Long studentId);

        /**
         * Get average quiz score for student across all courses.
         */
        @Query("SELECT AVG(sp.averageQuizScore) FROM StudentProgress sp WHERE sp.student.id = :studentId AND sp.averageQuizScore IS NOT NULL")
        Double getAverageQuizScoreByStudentId(@Param("studentId") Long studentId);

        /**
         * Get student progress ordered by last activity date for trend analysis.
         */
        @Query("SELECT sp FROM StudentProgress sp WHERE sp.student.id = :studentId ORDER BY sp.lastActivityDate DESC")
        List<StudentProgress> findByStudentIdOrderByLastActivityDateDesc(@Param("studentId") Long studentId);

        /**
         * Get students with highest completion rates for comparison.
         */
        @Query("SELECT sp FROM StudentProgress sp WHERE sp.course.id = :courseId ORDER BY sp.completionPercentage DESC")
        List<StudentProgress> findTopPerformersByCourseId(@Param("courseId") Long courseId, Pageable pageable);

        /**
         * Get course completion count for student.
         */
        @Query("SELECT COUNT(sp) FROM StudentProgress sp WHERE sp.student.id = :studentId AND sp.completionPercentage >= 100.0")
        Long getCompletedCoursesCountByStudentId(@Param("studentId") Long studentId);

        /**
         * Get total enrolled courses count for student.
         */
        @Query("SELECT COUNT(sp) FROM StudentProgress sp WHERE sp.student.id = :studentId")
        Long getTotalEnrolledCoursesCountByStudentId(@Param("studentId") Long studentId);

        /**
         * Find progress records updated within date range for trend analysis.
         */
        @Query("SELECT sp FROM StudentProgress sp WHERE sp.student.id = :studentId AND sp.updatedDate BETWEEN :startDate AND :endDate ORDER BY sp.updatedDate ASC")
        List<StudentProgress> findProgressHistoryByStudentIdAndDateRange(
                        @Param("studentId") Long studentId,
                        @Param("startDate") LocalDateTime startDate,
                        @Param("endDate") LocalDateTime endDate);

        /**
         * Get performance metrics for course comparison.
         */
        @Query("SELECT new com.satori.platform.service.dto.CoursePerformanceDTO(" +
                        "sp.course.id, sp.course.title, sp.completionPercentage, sp.lessonsCompleted, " +
                        "sp.totalLessons, sp.quizzesCompleted, sp.totalQuizzes, sp.averageQuizScore, " +
                        "sp.flashcardsMastered, sp.totalFlashcards, sp.studyTimeMinutes, sp.lastActivityDate) " +
                        "FROM StudentProgress sp WHERE sp.student.id = :studentId")
        List<CoursePerformanceDTO> getCoursePerformanceByStudentId(@Param("studentId") Long studentId);
}