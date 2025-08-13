package com.satori.platform.repository;

import com.satori.platform.domain.Question;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Question entity.
 */
@SuppressWarnings("unused")
@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {

    // Find questions by content containing search term (case insensitive)
    org.springframework.data.domain.Page<Question> findByContentContainingIgnoreCase(String content,
            org.springframework.data.domain.Pageable pageable);

    // Find questions by type
    org.springframework.data.domain.Page<Question> findByType(String type,
            org.springframework.data.domain.Pageable pageable);

    // Find questions by content and type
    org.springframework.data.domain.Page<Question> findByContentContainingIgnoreCaseAndType(String content, String type,
            org.springframework.data.domain.Pageable pageable);
}
