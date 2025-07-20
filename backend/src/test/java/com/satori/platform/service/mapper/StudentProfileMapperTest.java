package com.satori.platform.service.mapper;

import static com.satori.platform.domain.StudentProfileAsserts.*;
import static com.satori.platform.domain.StudentProfileTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class StudentProfileMapperTest {

    private StudentProfileMapper studentProfileMapper;

    @BeforeEach
    void setUp() {
        studentProfileMapper = new StudentProfileMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getStudentProfileSample1();
        var actual = studentProfileMapper.toEntity(studentProfileMapper.toDto(expected));
        assertStudentProfileAllPropertiesEquals(expected, actual);
    }
}
