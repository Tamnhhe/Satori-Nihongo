package com.satori.platform.domain;

import static com.satori.platform.domain.QuizTestSamples.*;
import static com.satori.platform.domain.StudentQuizTestSamples.*;
import static com.satori.platform.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StudentQuizTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StudentQuiz.class);
        StudentQuiz studentQuiz1 = getStudentQuizSample1();
        StudentQuiz studentQuiz2 = new StudentQuiz();
        assertThat(studentQuiz1).isNotEqualTo(studentQuiz2);

        studentQuiz2.setId(studentQuiz1.getId());
        assertThat(studentQuiz1).isEqualTo(studentQuiz2);

        studentQuiz2 = getStudentQuizSample2();
        assertThat(studentQuiz1).isNotEqualTo(studentQuiz2);
    }

    @Test
    void quizTest() {
        StudentQuiz studentQuiz = getStudentQuizRandomSampleGenerator();
        Quiz quizBack = getQuizRandomSampleGenerator();

        studentQuiz.setQuiz(quizBack);
        assertThat(studentQuiz.getQuiz()).isEqualTo(quizBack);

        studentQuiz.quiz(null);
        assertThat(studentQuiz.getQuiz()).isNull();
    }

    @Test
    void studentTest() {
        StudentQuiz studentQuiz = getStudentQuizRandomSampleGenerator();
        UserProfile userProfileBack = getUserProfileRandomSampleGenerator();

        studentQuiz.setStudent(userProfileBack);
        assertThat(studentQuiz.getStudent()).isEqualTo(userProfileBack);

        studentQuiz.student(null);
        assertThat(studentQuiz.getStudent()).isNull();
    }
}
