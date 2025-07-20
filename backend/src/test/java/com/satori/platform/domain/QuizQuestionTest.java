package com.satori.platform.domain;

import static com.satori.platform.domain.QuestionTestSamples.*;
import static com.satori.platform.domain.QuizQuestionTestSamples.*;
import static com.satori.platform.domain.QuizTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class QuizQuestionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuizQuestion.class);
        QuizQuestion quizQuestion1 = getQuizQuestionSample1();
        QuizQuestion quizQuestion2 = new QuizQuestion();
        assertThat(quizQuestion1).isNotEqualTo(quizQuestion2);

        quizQuestion2.setId(quizQuestion1.getId());
        assertThat(quizQuestion1).isEqualTo(quizQuestion2);

        quizQuestion2 = getQuizQuestionSample2();
        assertThat(quizQuestion1).isNotEqualTo(quizQuestion2);
    }

    @Test
    void quizTest() {
        QuizQuestion quizQuestion = getQuizQuestionRandomSampleGenerator();
        Quiz quizBack = getQuizRandomSampleGenerator();

        quizQuestion.setQuiz(quizBack);
        assertThat(quizQuestion.getQuiz()).isEqualTo(quizBack);

        quizQuestion.quiz(null);
        assertThat(quizQuestion.getQuiz()).isNull();
    }

    @Test
    void questionTest() {
        QuizQuestion quizQuestion = getQuizQuestionRandomSampleGenerator();
        Question questionBack = getQuestionRandomSampleGenerator();

        quizQuestion.setQuestion(questionBack);
        assertThat(quizQuestion.getQuestion()).isEqualTo(questionBack);

        quizQuestion.question(null);
        assertThat(quizQuestion.getQuestion()).isNull();
    }
}
