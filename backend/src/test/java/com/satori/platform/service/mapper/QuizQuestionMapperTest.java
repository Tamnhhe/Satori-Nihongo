package com.satori.platform.service.mapper;

import static com.satori.platform.domain.QuizQuestionAsserts.*;
import static com.satori.platform.domain.QuizQuestionTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class QuizQuestionMapperTest {

    private QuizQuestionMapper quizQuestionMapper;

    @BeforeEach
    void setUp() {
        quizQuestionMapper = new QuizQuestionMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getQuizQuestionSample1();
        var actual = quizQuestionMapper.toEntity(quizQuestionMapper.toDto(expected));
        assertQuizQuestionAllPropertiesEquals(expected, actual);
    }
}
