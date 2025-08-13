package com.satori.platform.repository;

import com.satori.platform.domain.CourseClass;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the CourseClass entity.
 *
 * When extending this class, extend CourseClassRepositoryWithBagRelationships
 * too.
 * For more information refer to
 * https://github.com/jhipster/generator-jhipster/issues/17990.
 */
@Repository
public interface CourseClassRepository
        extends CourseClassRepositoryWithBagRelationships, JpaRepository<CourseClass, Long> {
    default Optional<CourseClass> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default List<CourseClass> findAllWithEagerRelationships() {
        return this.fetchBagRelationships(this.findAll());
    }

    default Page<CourseClass> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    /**
     * Find course classes by teacher ID.
     */
    @Query("SELECT cc FROM CourseClass cc WHERE cc.teacher.id = :teacherId")
    Page<CourseClass> findByTeacherId(@Param("teacherId") Long teacherId, Pageable pageable);

    /**
     * Find course classes by course ID.
     */
    @Query("SELECT cc FROM CourseClass cc WHERE cc.course.id = :courseId")
    Page<CourseClass> findByCourseId(@Param("courseId") Long courseId, Pageable pageable);

    /**
     * Find course classes by status (based on dates).
     */
    @Query("SELECT cc FROM CourseClass cc WHERE " +
            "(:status = 'UPCOMING' AND cc.startDate > CURRENT_TIMESTAMP) OR " +
            "(:status = 'ACTIVE' AND cc.startDate <= CURRENT_TIMESTAMP AND cc.endDate >= CURRENT_TIMESTAMP) OR " +
            "(:status = 'COMPLETED' AND cc.endDate < CURRENT_TIMESTAMP)")
    Page<CourseClass> findByStatus(@Param("status") String status, Pageable pageable);

    /**
     * Find course classes with available spots.
     */
    @Query("SELECT cc FROM CourseClass cc WHERE cc.capacity IS NULL OR SIZE(cc.students) < cc.capacity")
    Page<CourseClass> findWithAvailableSpots(Pageable pageable);

    /**
     * Find course classes that are fully enrolled.
     */
    @Query("SELECT cc FROM CourseClass cc WHERE cc.capacity IS NOT NULL AND SIZE(cc.students) >= cc.capacity")
    Page<CourseClass> findFullyEnrolled(Pageable pageable);

    /**
     * Count students by course ID.
     */
    @Query("SELECT COUNT(s) FROM CourseClass cc JOIN cc.students s WHERE cc.course.id = :courseId")
    int countStudentsByCourseId(@Param("courseId") String courseId);

    /**
     * Find course classes by multiple course IDs.
     */
    List<CourseClass> findByCourseIdIn(List<Long> courseIds);
}
