package com.satori.platform.domain;

import static com.satori.platform.domain.CourseTestSamples.*;
import static com.satori.platform.domain.LessonTestSamples.*;
import static com.satori.platform.domain.QuizTestSamples.*;
import static com.satori.platform.domain.ScheduleTestSamples.*;
import static com.satori.platform.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CourseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Course.class);
        Course course1 = getCourseSample1();
        Course course2 = new Course();
        assertThat(course1).isNotEqualTo(course2);

        course2.setId(course1.getId());
        assertThat(course1).isEqualTo(course2);

        course2 = getCourseSample2();
        assertThat(course1).isNotEqualTo(course2);
    }

    @Test
    void lessonsTest() {
        Course course = getCourseRandomSampleGenerator();
        Lesson lessonBack = getLessonRandomSampleGenerator();

        course.addLessons(lessonBack);
        assertThat(course.getLessons()).containsOnly(lessonBack);
        assertThat(lessonBack.getCourse()).isEqualTo(course);

        course.removeLessons(lessonBack);
        assertThat(course.getLessons()).doesNotContain(lessonBack);
        assertThat(lessonBack.getCourse()).isNull();

        course.lessons(new HashSet<>(Set.of(lessonBack)));
        assertThat(course.getLessons()).containsOnly(lessonBack);
        assertThat(lessonBack.getCourse()).isEqualTo(course);

        course.setLessons(new HashSet<>());
        assertThat(course.getLessons()).doesNotContain(lessonBack);
        assertThat(lessonBack.getCourse()).isNull();
    }

    @Test
    void schedulesTest() {
        Course course = getCourseRandomSampleGenerator();
        Schedule scheduleBack = getScheduleRandomSampleGenerator();

        course.addSchedules(scheduleBack);
        assertThat(course.getSchedules()).containsOnly(scheduleBack);
        assertThat(scheduleBack.getCourse()).isEqualTo(course);

        course.removeSchedules(scheduleBack);
        assertThat(course.getSchedules()).doesNotContain(scheduleBack);
        assertThat(scheduleBack.getCourse()).isNull();

        course.schedules(new HashSet<>(Set.of(scheduleBack)));
        assertThat(course.getSchedules()).containsOnly(scheduleBack);
        assertThat(scheduleBack.getCourse()).isEqualTo(course);

        course.setSchedules(new HashSet<>());
        assertThat(course.getSchedules()).doesNotContain(scheduleBack);
        assertThat(scheduleBack.getCourse()).isNull();
    }

    @Test
    void teacherTest() {
        Course course = getCourseRandomSampleGenerator();
        UserProfile userProfileBack = getUserProfileRandomSampleGenerator();

        course.setTeacher(userProfileBack);
        assertThat(course.getTeacher()).isEqualTo(userProfileBack);

        course.teacher(null);
        assertThat(course.getTeacher()).isNull();
    }

    @Test
    void quizTest() {
        Course course = getCourseRandomSampleGenerator();
        Quiz quizBack = getQuizRandomSampleGenerator();

        course.addQuiz(quizBack);
        assertThat(course.getQuizzes()).containsOnly(quizBack);
        assertThat(quizBack.getCourses()).containsOnly(course);

        course.removeQuiz(quizBack);
        assertThat(course.getQuizzes()).doesNotContain(quizBack);
        assertThat(quizBack.getCourses()).doesNotContain(course);

        course.quizzes(new HashSet<>(Set.of(quizBack)));
        assertThat(course.getQuizzes()).containsOnly(quizBack);
        assertThat(quizBack.getCourses()).containsOnly(course);

        course.setQuizzes(new HashSet<>());
        assertThat(course.getQuizzes()).doesNotContain(quizBack);
        assertThat(quizBack.getCourses()).doesNotContain(course);
    }
}
