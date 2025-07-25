package com.satori.platform.repository;

import com.satori.platform.domain.Quiz;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface QuizRepositoryWithBagRelationships {
    Optional<Quiz> fetchBagRelationships(Optional<Quiz> quiz);

    List<Quiz> fetchBagRelationships(List<Quiz> quizzes);

    Page<Quiz> fetchBagRelationships(Page<Quiz> quizzes);
}
