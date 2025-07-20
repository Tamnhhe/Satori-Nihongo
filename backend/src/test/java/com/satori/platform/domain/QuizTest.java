package com.satori.platform.domain;

import static com.satori.platform.domain.CourseTestSamples.*;
import static com.satori.platform.domain.LessonTestSamples.*;
import static com.satori.platform.domain.QuizQuestionTestSamples.*;
import static com.satori.platform.domain.QuizTestSamples.*;
import static com.satori.platform.domain.StudentQuizTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class QuizTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Quiz.class);
        Quiz quiz1 = getQuizSample1();
        Quiz quiz2 = new Quiz();
        assertThat(quiz1).isNotEqualTo(quiz2);

        quiz2.setId(quiz1.getId());
        assertThat(quiz1).isEqualTo(quiz2);

        quiz2 = getQuizSample2();
        assertThat(quiz1).isNotEqualTo(quiz2);
    }

    @Test
    void questionsTest() {
        Quiz quiz = getQuizRandomSampleGenerator();
        QuizQuestion quizQuestionBack = getQuizQuestionRandomSampleGenerator();

        quiz.addQuestions(quizQuestionBack);
        assertThat(quiz.getQuestions()).containsOnly(quizQuestionBack);
        assertThat(quizQuestionBack.getQuiz()).isEqualTo(quiz);

        quiz.removeQuestions(quizQuestionBack);
        assertThat(quiz.getQuestions()).doesNotContain(quizQuestionBack);
        assertThat(quizQuestionBack.getQuiz()).isNull();

        quiz.questions(new HashSet<>(Set.of(quizQuestionBack)));
        assertThat(quiz.getQuestions()).containsOnly(quizQuestionBack);
        assertThat(quizQuestionBack.getQuiz()).isEqualTo(quiz);

        quiz.setQuestions(new HashSet<>());
        assertThat(quiz.getQuestions()).doesNotContain(quizQuestionBack);
        assertThat(quizQuestionBack.getQuiz()).isNull();
    }

    @Test
    void assignedToTest() {
        Quiz quiz = getQuizRandomSampleGenerator();
        StudentQuiz studentQuizBack = getStudentQuizRandomSampleGenerator();

        quiz.addAssignedTo(studentQuizBack);
        assertThat(quiz.getAssignedTos()).containsOnly(studentQuizBack);
        assertThat(studentQuizBack.getQuiz()).isEqualTo(quiz);

        quiz.removeAssignedTo(studentQuizBack);
        assertThat(quiz.getAssignedTos()).doesNotContain(studentQuizBack);
        assertThat(studentQuizBack.getQuiz()).isNull();

        quiz.assignedTos(new HashSet<>(Set.of(studentQuizBack)));
        assertThat(quiz.getAssignedTos()).containsOnly(studentQuizBack);
        assertThat(studentQuizBack.getQuiz()).isEqualTo(quiz);

        quiz.setAssignedTos(new HashSet<>());
        assertThat(quiz.getAssignedTos()).doesNotContain(studentQuizBack);
        assertThat(studentQuizBack.getQuiz()).isNull();
    }

    @Test
    void courseTest() {
        Quiz quiz = getQuizRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        quiz.addCourse(courseBack);
        assertThat(quiz.getCourses()).containsOnly(courseBack);

        quiz.removeCourse(courseBack);
        assertThat(quiz.getCourses()).doesNotContain(courseBack);

        quiz.courses(new HashSet<>(Set.of(courseBack)));
        assertThat(quiz.getCourses()).containsOnly(courseBack);

        quiz.setCourses(new HashSet<>());
        assertThat(quiz.getCourses()).doesNotContain(courseBack);
    }

    @Test
    void lessonTest() {
        Quiz quiz = getQuizRandomSampleGenerator();
        Lesson lessonBack = getLessonRandomSampleGenerator();

        quiz.addLesson(lessonBack);
        assertThat(quiz.getLessons()).containsOnly(lessonBack);

        quiz.removeLesson(lessonBack);
        assertThat(quiz.getLessons()).doesNotContain(lessonBack);

        quiz.lessons(new HashSet<>(Set.of(lessonBack)));
        assertThat(quiz.getLessons()).containsOnly(lessonBack);

        quiz.setLessons(new HashSet<>());
        assertThat(quiz.getLessons()).doesNotContain(lessonBack);
    }
}
