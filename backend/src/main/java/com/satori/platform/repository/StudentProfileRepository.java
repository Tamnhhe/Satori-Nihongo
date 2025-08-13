package com.satori.platform.repository;

import com.satori.platform.domain.StudentProfile;
import java.util.List;
import java.util.Set;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the StudentProfile entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {

    /**
     * Find students not in the given set of IDs.
     */
    Page<StudentProfile> findByIdNotIn(Set<Long> ids, Pageable pageable);

    /**
     * Search students by student ID or full name, excluding given IDs.
     */
    @Query("SELECT sp FROM StudentProfile sp WHERE " +
            "(LOWER(sp.studentId) LIKE LOWER(CONCAT('%', :studentIdTerm, '%')) OR " +
            "LOWER(sp.userProfile.fullName) LIKE LOWER(CONCAT('%', :fullNameTerm, '%'))) AND " +
            "sp.id NOT IN :excludeIds")
    Page<StudentProfile> findByStudentIdContainingIgnoreCaseOrUserProfile_FullNameContainingIgnoreCaseAndIdNotIn(
            @Param("studentIdTerm") String studentIdTerm,
            @Param("fullNameTerm") String fullNameTerm,
            @Param("excludeIds") Set<Long> excludeIds,
            Pageable pageable);

    /**
     * Find students by enrolled class IDs.
     */
    List<StudentProfile> findByClassesIdIn(List<Long> classIds);

    /**
     * Find students by a specific enrolled class ID.
     */
    List<StudentProfile> findByClassesId(Long classId);
}
