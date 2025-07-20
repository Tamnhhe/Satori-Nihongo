package com.satori.platform.domain;

import static com.satori.platform.domain.CourseTestSamples.*;
import static com.satori.platform.domain.StudentProfileTestSamples.*;
import static com.satori.platform.domain.StudentQuizTestSamples.*;
import static com.satori.platform.domain.TeacherProfileTestSamples.*;
import static com.satori.platform.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class UserProfileTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(UserProfile.class);
        UserProfile userProfile1 = getUserProfileSample1();
        UserProfile userProfile2 = new UserProfile();
        assertThat(userProfile1).isNotEqualTo(userProfile2);

        userProfile2.setId(userProfile1.getId());
        assertThat(userProfile1).isEqualTo(userProfile2);

        userProfile2 = getUserProfileSample2();
        assertThat(userProfile1).isNotEqualTo(userProfile2);
    }

    @Test
    void teacherProfileTest() {
        UserProfile userProfile = getUserProfileRandomSampleGenerator();
        TeacherProfile teacherProfileBack = getTeacherProfileRandomSampleGenerator();

        userProfile.setTeacherProfile(teacherProfileBack);
        assertThat(userProfile.getTeacherProfile()).isEqualTo(teacherProfileBack);

        userProfile.teacherProfile(null);
        assertThat(userProfile.getTeacherProfile()).isNull();
    }

    @Test
    void studentProfileTest() {
        UserProfile userProfile = getUserProfileRandomSampleGenerator();
        StudentProfile studentProfileBack = getStudentProfileRandomSampleGenerator();

        userProfile.setStudentProfile(studentProfileBack);
        assertThat(userProfile.getStudentProfile()).isEqualTo(studentProfileBack);

        userProfile.studentProfile(null);
        assertThat(userProfile.getStudentProfile()).isNull();
    }

    @Test
    void createdCoursesTest() {
        UserProfile userProfile = getUserProfileRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        userProfile.addCreatedCourses(courseBack);
        assertThat(userProfile.getCreatedCourses()).containsOnly(courseBack);
        assertThat(courseBack.getTeacher()).isEqualTo(userProfile);

        userProfile.removeCreatedCourses(courseBack);
        assertThat(userProfile.getCreatedCourses()).doesNotContain(courseBack);
        assertThat(courseBack.getTeacher()).isNull();

        userProfile.createdCourses(new HashSet<>(Set.of(courseBack)));
        assertThat(userProfile.getCreatedCourses()).containsOnly(courseBack);
        assertThat(courseBack.getTeacher()).isEqualTo(userProfile);

        userProfile.setCreatedCourses(new HashSet<>());
        assertThat(userProfile.getCreatedCourses()).doesNotContain(courseBack);
        assertThat(courseBack.getTeacher()).isNull();
    }

    @Test
    void quizAttemptsTest() {
        UserProfile userProfile = getUserProfileRandomSampleGenerator();
        StudentQuiz studentQuizBack = getStudentQuizRandomSampleGenerator();

        userProfile.addQuizAttempts(studentQuizBack);
        assertThat(userProfile.getQuizAttempts()).containsOnly(studentQuizBack);
        assertThat(studentQuizBack.getStudent()).isEqualTo(userProfile);

        userProfile.removeQuizAttempts(studentQuizBack);
        assertThat(userProfile.getQuizAttempts()).doesNotContain(studentQuizBack);
        assertThat(studentQuizBack.getStudent()).isNull();

        userProfile.quizAttempts(new HashSet<>(Set.of(studentQuizBack)));
        assertThat(userProfile.getQuizAttempts()).containsOnly(studentQuizBack);
        assertThat(studentQuizBack.getStudent()).isEqualTo(userProfile);

        userProfile.setQuizAttempts(new HashSet<>());
        assertThat(userProfile.getQuizAttempts()).doesNotContain(studentQuizBack);
        assertThat(studentQuizBack.getStudent()).isNull();
    }
}
