package com.satori.platform.service.mapper;

import static com.satori.platform.domain.FlashcardAsserts.*;
import static com.satori.platform.domain.FlashcardTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class FlashcardMapperTest {

    private FlashcardMapper flashcardMapper;

    @BeforeEach
    void setUp() {
        flashcardMapper = new FlashcardMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getFlashcardSample1();
        var actual = flashcardMapper.toEntity(flashcardMapper.toDto(expected));
        assertFlashcardAllPropertiesEquals(expected, actual);
    }
}
