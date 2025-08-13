package com.satori.platform.repository;

import com.satori.platform.domain.Course;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

/**
 * Spring Data JPA repository for the Course entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    /**
     * Find courses by teacher ID.
     */
    Page<Course> findByTeacherId(Long teacherId, Pageable pageable);

    /**
     * Check if course code exists for a different course.
     */
    boolean existsByCourseCodeAndIdNot(String courseCode, Long id);

    /**
     * Find courses by course code.
     */
    @Query("SELECT c FROM Course c WHERE c.courseCode = :courseCode")
    Course findByCourseCode(@Param("courseCode") String courseCode);

    /**
     * Find courses by title containing text (case insensitive).
     */
    @Query("SELECT c FROM Course c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :title, '%'))")
    Page<Course> findByTitleContainingIgnoreCase(@Param("title") String title, Pageable pageable);

    /**
     * Find courses with lessons count.
     */
    @Query("SELECT c, COUNT(l) as lessonCount FROM Course c LEFT JOIN c.lessons l GROUP BY c")
    Page<Object[]> findCoursesWithLessonCount(Pageable pageable);

    /**
     * Count classes by course ID.
     */
    @Query("SELECT COUNT(cc) FROM CourseClass cc WHERE cc.course.id = :courseId")
    int countClassesByCourseId(@Param("courseId") Long courseId);

    /**
     * Find courses by teacher profile user ID.
     */
    @Query("SELECT c FROM Course c WHERE c.teacher.username = :teacherId")
    List<Course> findByTeacherProfileUserId(@Param("teacherId") String teacherId);
}
