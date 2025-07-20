package com.satori.platform.repository;

import com.satori.platform.domain.Quiz;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;
import java.util.stream.IntStream;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;

/**
 * Utility repository to load bag relationships based on https://vladmihalcea.com/hibernate-multiplebagfetchexception/
 */
public class QuizRepositoryWithBagRelationshipsImpl implements QuizRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String QUIZZES_PARAMETER = "quizzes";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<Quiz> fetchBagRelationships(Optional<Quiz> quiz) {
        return quiz.map(this::fetchCourses).map(this::fetchLessons);
    }

    @Override
    public Page<Quiz> fetchBagRelationships(Page<Quiz> quizzes) {
        return new PageImpl<>(fetchBagRelationships(quizzes.getContent()), quizzes.getPageable(), quizzes.getTotalElements());
    }

    @Override
    public List<Quiz> fetchBagRelationships(List<Quiz> quizzes) {
        return Optional.of(quizzes).map(this::fetchCourses).map(this::fetchLessons).orElse(Collections.emptyList());
    }

    Quiz fetchCourses(Quiz result) {
        return entityManager
            .createQuery("select quiz from Quiz quiz left join fetch quiz.courses where quiz.id = :id", Quiz.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Quiz> fetchCourses(List<Quiz> quizzes) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, quizzes.size()).forEach(index -> order.put(quizzes.get(index).getId(), index));
        List<Quiz> result = entityManager
            .createQuery("select quiz from Quiz quiz left join fetch quiz.courses where quiz in :quizzes", Quiz.class)
            .setParameter(QUIZZES_PARAMETER, quizzes)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }

    Quiz fetchLessons(Quiz result) {
        return entityManager
            .createQuery("select quiz from Quiz quiz left join fetch quiz.lessons where quiz.id = :id", Quiz.class)
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<Quiz> fetchLessons(List<Quiz> quizzes) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, quizzes.size()).forEach(index -> order.put(quizzes.get(index).getId(), index));
        List<Quiz> result = entityManager
            .createQuery("select quiz from Quiz quiz left join fetch quiz.lessons where quiz in :quizzes", Quiz.class)
            .setParameter(QUIZZES_PARAMETER, quizzes)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
