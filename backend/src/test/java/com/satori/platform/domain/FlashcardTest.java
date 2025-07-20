package com.satori.platform.domain;

import static com.satori.platform.domain.FlashcardTestSamples.*;
import static com.satori.platform.domain.LessonTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FlashcardTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Flashcard.class);
        Flashcard flashcard1 = getFlashcardSample1();
        Flashcard flashcard2 = new Flashcard();
        assertThat(flashcard1).isNotEqualTo(flashcard2);

        flashcard2.setId(flashcard1.getId());
        assertThat(flashcard1).isEqualTo(flashcard2);

        flashcard2 = getFlashcardSample2();
        assertThat(flashcard1).isNotEqualTo(flashcard2);
    }

    @Test
    void lessonTest() {
        Flashcard flashcard = getFlashcardRandomSampleGenerator();
        Lesson lessonBack = getLessonRandomSampleGenerator();

        flashcard.setLesson(lessonBack);
        assertThat(flashcard.getLesson()).isEqualTo(lessonBack);

        flashcard.lesson(null);
        assertThat(flashcard.getLesson()).isNull();
    }
}
