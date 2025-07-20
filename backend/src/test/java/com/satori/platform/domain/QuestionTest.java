package com.satori.platform.domain;

import static com.satori.platform.domain.QuestionTestSamples.*;
import static com.satori.platform.domain.QuizQuestionTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class QuestionTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Question.class);
        Question question1 = getQuestionSample1();
        Question question2 = new Question();
        assertThat(question1).isNotEqualTo(question2);

        question2.setId(question1.getId());
        assertThat(question1).isEqualTo(question2);

        question2 = getQuestionSample2();
        assertThat(question1).isNotEqualTo(question2);
    }

    @Test
    void quizQuestionsTest() {
        Question question = getQuestionRandomSampleGenerator();
        QuizQuestion quizQuestionBack = getQuizQuestionRandomSampleGenerator();

        question.addQuizQuestions(quizQuestionBack);
        assertThat(question.getQuizQuestions()).containsOnly(quizQuestionBack);
        assertThat(quizQuestionBack.getQuestion()).isEqualTo(question);

        question.removeQuizQuestions(quizQuestionBack);
        assertThat(question.getQuizQuestions()).doesNotContain(quizQuestionBack);
        assertThat(quizQuestionBack.getQuestion()).isNull();

        question.quizQuestions(new HashSet<>(Set.of(quizQuestionBack)));
        assertThat(question.getQuizQuestions()).containsOnly(quizQuestionBack);
        assertThat(quizQuestionBack.getQuestion()).isEqualTo(question);

        question.setQuizQuestions(new HashSet<>());
        assertThat(question.getQuizQuestions()).doesNotContain(quizQuestionBack);
        assertThat(quizQuestionBack.getQuestion()).isNull();
    }
}
