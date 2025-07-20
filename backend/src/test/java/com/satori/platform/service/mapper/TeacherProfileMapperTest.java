package com.satori.platform.service.mapper;

import static com.satori.platform.domain.TeacherProfileAsserts.*;
import static com.satori.platform.domain.TeacherProfileTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class TeacherProfileMapperTest {

    private TeacherProfileMapper teacherProfileMapper;

    @BeforeEach
    void setUp() {
        teacherProfileMapper = new TeacherProfileMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getTeacherProfileSample1();
        var actual = teacherProfileMapper.toEntity(teacherProfileMapper.toDto(expected));
        assertTeacherProfileAllPropertiesEquals(expected, actual);
    }
}
