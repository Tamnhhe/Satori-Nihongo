package com.satori.platform.repository;

import com.satori.platform.domain.CourseClass;
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
public class CourseClassRepositoryWithBagRelationshipsImpl implements CourseClassRepositoryWithBagRelationships {

    private static final String ID_PARAMETER = "id";
    private static final String COURSECLASSES_PARAMETER = "courseClasses";

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Optional<CourseClass> fetchBagRelationships(Optional<CourseClass> courseClass) {
        return courseClass.map(this::fetchStudents);
    }

    @Override
    public Page<CourseClass> fetchBagRelationships(Page<CourseClass> courseClasses) {
        return new PageImpl<>(
            fetchBagRelationships(courseClasses.getContent()),
            courseClasses.getPageable(),
            courseClasses.getTotalElements()
        );
    }

    @Override
    public List<CourseClass> fetchBagRelationships(List<CourseClass> courseClasses) {
        return Optional.of(courseClasses).map(this::fetchStudents).orElse(Collections.emptyList());
    }

    CourseClass fetchStudents(CourseClass result) {
        return entityManager
            .createQuery(
                "select courseClass from CourseClass courseClass left join fetch courseClass.students where courseClass.id = :id",
                CourseClass.class
            )
            .setParameter(ID_PARAMETER, result.getId())
            .getSingleResult();
    }

    List<CourseClass> fetchStudents(List<CourseClass> courseClasses) {
        HashMap<Object, Integer> order = new HashMap<>();
        IntStream.range(0, courseClasses.size()).forEach(index -> order.put(courseClasses.get(index).getId(), index));
        List<CourseClass> result = entityManager
            .createQuery(
                "select courseClass from CourseClass courseClass left join fetch courseClass.students where courseClass in :courseClasses",
                CourseClass.class
            )
            .setParameter(COURSECLASSES_PARAMETER, courseClasses)
            .getResultList();
        Collections.sort(result, (o1, o2) -> Integer.compare(order.get(o1.getId()), order.get(o2.getId())));
        return result;
    }
}
