package com.satori.platform.repository;

import com.satori.platform.domain.StudentQuiz;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the StudentQuiz entity.
 */
@SuppressWarnings("unused")
@Repository
public interface StudentQuizRepository extends JpaRepository<StudentQuiz, Long> {}
