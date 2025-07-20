package com.satori.platform.service.mapper;

import static com.satori.platform.domain.CourseClassAsserts.*;
import static com.satori.platform.domain.CourseClassTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class CourseClassMapperTest {

    private CourseClassMapper courseClassMapper;

    @BeforeEach
    void setUp() {
        courseClassMapper = new CourseClassMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getCourseClassSample1();
        var actual = courseClassMapper.toEntity(courseClassMapper.toDto(expected));
        assertCourseClassAllPropertiesEquals(expected, actual);
    }
}
