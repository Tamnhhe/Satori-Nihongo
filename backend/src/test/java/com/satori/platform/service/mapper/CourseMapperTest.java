package com.satori.platform.service.mapper;

import static com.satori.platform.domain.CourseAsserts.*;
import static com.satori.platform.domain.CourseTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CourseMapperTest {

    private CourseMapper courseMapper;

    @BeforeEach
    void setUp() {
        courseMapper = new CourseMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getCourseSample1();
        var actual = courseMapper.toEntity(courseMapper.toDto(expected));
        assertCourseAllPropertiesEquals(expected, actual);
    }
}
