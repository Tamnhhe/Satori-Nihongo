package com.satori.platform.repository;

import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.enumeration.Role;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Spring Data JPA repository for the UserProfile entity.
 */
@SuppressWarnings("unused")
@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    /**
     * Find students enrolled in a specific course
     */
    @Query("SELECT DISTINCT up FROM UserProfile up " +
            "JOIN up.studentProfile sp " +
            "JOIN sp.classes cc " +
            "WHERE cc.course.id = :courseId AND up.role = :role")
    List<UserProfile> findStudentsByCourseId(@Param("courseId") Long courseId, @Param("role") Role role);

    /**
     * Find students enrolled in a specific course (default to STUDENT role)
     */
    default List<UserProfile> findStudentsByCourseId(Long courseId) {
        return findStudentsByCourseId(courseId, Role.HOC_VIEN);
    }

    /**
     * Find all active students
     */
    @Query("SELECT up FROM UserProfile up WHERE up.role = 'HOC_VIEN'")
    List<UserProfile> findAllActiveStudents();

    /**
     * Find users by role
     */
    List<UserProfile> findByRole(Role role);

    /**
     * Find user profile by username
     */
    Optional<UserProfile> findByUsername(String username);
}
