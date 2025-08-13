package com.satori.platform.repository;

import com.satori.platform.domain.TeacherProfile;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the TeacherProfile entity.
 */
@SuppressWarnings("unused")
@Repository
public interface TeacherProfileRepository extends JpaRepository<TeacherProfile, Long> {}
