package com.satori.platform.domain;

import static com.satori.platform.domain.CourseTestSamples.*;
import static com.satori.platform.domain.FlashcardTestSamples.*;
import static com.satori.platform.domain.LessonTestSamples.*;
import static com.satori.platform.domain.QuizTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class LessonTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Lesson.class);
        Lesson lesson1 = getLessonSample1();
        Lesson lesson2 = new Lesson();
        assertThat(lesson1).isNotEqualTo(lesson2);

        lesson2.setId(lesson1.getId());
        assertThat(lesson1).isEqualTo(lesson2);

        lesson2 = getLessonSample2();
        assertThat(lesson1).isNotEqualTo(lesson2);
    }

    @Test
    void flashcardsTest() {
        Lesson lesson = getLessonRandomSampleGenerator();
        Flashcard flashcardBack = getFlashcardRandomSampleGenerator();

        lesson.addFlashcards(flashcardBack);
        assertThat(lesson.getFlashcards()).containsOnly(flashcardBack);
        assertThat(flashcardBack.getLesson()).isEqualTo(lesson);

        lesson.removeFlashcards(flashcardBack);
        assertThat(lesson.getFlashcards()).doesNotContain(flashcardBack);
        assertThat(flashcardBack.getLesson()).isNull();

        lesson.flashcards(new HashSet<>(Set.of(flashcardBack)));
        assertThat(lesson.getFlashcards()).containsOnly(flashcardBack);
        assertThat(flashcardBack.getLesson()).isEqualTo(lesson);

        lesson.setFlashcards(new HashSet<>());
        assertThat(lesson.getFlashcards()).doesNotContain(flashcardBack);
        assertThat(flashcardBack.getLesson()).isNull();
    }

    @Test
    void courseTest() {
        Lesson lesson = getLessonRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        lesson.setCourse(courseBack);
        assertThat(lesson.getCourse()).isEqualTo(courseBack);

        lesson.course(null);
        assertThat(lesson.getCourse()).isNull();
    }

    @Test
    void quizTest() {
        Lesson lesson = getLessonRandomSampleGenerator();
        Quiz quizBack = getQuizRandomSampleGenerator();

        lesson.addQuiz(quizBack);
        assertThat(lesson.getQuizzes()).containsOnly(quizBack);
        assertThat(quizBack.getLessons()).containsOnly(lesson);

        lesson.removeQuiz(quizBack);
        assertThat(lesson.getQuizzes()).doesNotContain(quizBack);
        assertThat(quizBack.getLessons()).doesNotContain(lesson);

        lesson.quizzes(new HashSet<>(Set.of(quizBack)));
        assertThat(lesson.getQuizzes()).containsOnly(quizBack);
        assertThat(quizBack.getLessons()).containsOnly(lesson);

        lesson.setQuizzes(new HashSet<>());
        assertThat(lesson.getQuizzes()).doesNotContain(quizBack);
        assertThat(quizBack.getLessons()).doesNotContain(lesson);
    }
}
