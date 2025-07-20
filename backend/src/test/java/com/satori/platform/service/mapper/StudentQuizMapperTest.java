package com.satori.platform.service.mapper;

import static com.satori.platform.domain.StudentQuizAsserts.*;
import static com.satori.platform.domain.StudentQuizTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class StudentQuizMapperTest {

    private StudentQuizMapper studentQuizMapper;

    @BeforeEach
    void setUp() {
        studentQuizMapper = new StudentQuizMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getStudentQuizSample1();
        var actual = studentQuizMapper.toEntity(studentQuizMapper.toDto(expected));
        assertStudentQuizAllPropertiesEquals(expected, actual);
    }
}
