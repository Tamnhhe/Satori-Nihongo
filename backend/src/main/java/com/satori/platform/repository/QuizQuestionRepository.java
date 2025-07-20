package com.satori.platform.repository;

import com.satori.platform.domain.QuizQuestion;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the QuizQuestion entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, Long> {}
