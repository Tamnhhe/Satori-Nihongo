package com.satori.platform.repository;

import com.satori.platform.domain.CourseClass;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface CourseClassRepositoryWithBagRelationships {
    Optional<CourseClass> fetchBagRelationships(Optional<CourseClass> courseClass);

    List<CourseClass> fetchBagRelationships(List<CourseClass> courseClasses);

    Page<CourseClass> fetchBagRelationships(Page<CourseClass> courseClasses);
}
