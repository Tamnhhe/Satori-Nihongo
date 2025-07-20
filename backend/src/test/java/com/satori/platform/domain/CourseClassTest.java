package com.satori.platform.domain;

import static com.satori.platform.domain.CourseClassTestSamples.*;
import static com.satori.platform.domain.CourseTestSamples.*;
import static com.satori.platform.domain.StudentProfileTestSamples.*;
import static com.satori.platform.domain.TeacherProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class CourseClassTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(CourseClass.class);
        CourseClass courseClass1 = getCourseClassSample1();
        CourseClass courseClass2 = new CourseClass();
        assertThat(courseClass1).isNotEqualTo(courseClass2);

        courseClass2.setId(courseClass1.getId());
        assertThat(courseClass1).isEqualTo(courseClass2);

        courseClass2 = getCourseClassSample2();
        assertThat(courseClass1).isNotEqualTo(courseClass2);
    }

    @Test
    void courseTest() {
        CourseClass courseClass = getCourseClassRandomSampleGenerator();
        Course courseBack = getCourseRandomSampleGenerator();

        courseClass.setCourse(courseBack);
        assertThat(courseClass.getCourse()).isEqualTo(courseBack);

        courseClass.course(null);
        assertThat(courseClass.getCourse()).isNull();
    }

    @Test
    void teacherTest() {
        CourseClass courseClass = getCourseClassRandomSampleGenerator();
        TeacherProfile teacherProfileBack = getTeacherProfileRandomSampleGenerator();

        courseClass.setTeacher(teacherProfileBack);
        assertThat(courseClass.getTeacher()).isEqualTo(teacherProfileBack);

        courseClass.teacher(null);
        assertThat(courseClass.getTeacher()).isNull();
    }

    @Test
    void studentsTest() {
        CourseClass courseClass = getCourseClassRandomSampleGenerator();
        StudentProfile studentProfileBack = getStudentProfileRandomSampleGenerator();

        courseClass.addStudents(studentProfileBack);
        assertThat(courseClass.getStudents()).containsOnly(studentProfileBack);

        courseClass.removeStudents(studentProfileBack);
        assertThat(courseClass.getStudents()).doesNotContain(studentProfileBack);

        courseClass.students(new HashSet<>(Set.of(studentProfileBack)));
        assertThat(courseClass.getStudents()).containsOnly(studentProfileBack);

        courseClass.setStudents(new HashSet<>());
        assertThat(courseClass.getStudents()).doesNotContain(studentProfileBack);
    }
}
