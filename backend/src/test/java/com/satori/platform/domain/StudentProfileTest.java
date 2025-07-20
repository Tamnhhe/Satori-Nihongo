package com.satori.platform.domain;

import static com.satori.platform.domain.CourseClassTestSamples.*;
import static com.satori.platform.domain.StudentProfileTestSamples.*;
import static com.satori.platform.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import java.util.HashSet;
import java.util.Set;
import org.junit.jupiter.api.Test;

class StudentProfileTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(StudentProfile.class);
        StudentProfile studentProfile1 = getStudentProfileSample1();
        StudentProfile studentProfile2 = new StudentProfile();
        assertThat(studentProfile1).isNotEqualTo(studentProfile2);

        studentProfile2.setId(studentProfile1.getId());
        assertThat(studentProfile1).isEqualTo(studentProfile2);

        studentProfile2 = getStudentProfileSample2();
        assertThat(studentProfile1).isNotEqualTo(studentProfile2);
    }

    @Test
    void userProfileTest() {
        StudentProfile studentProfile = getStudentProfileRandomSampleGenerator();
        UserProfile userProfileBack = getUserProfileRandomSampleGenerator();

        studentProfile.setUserProfile(userProfileBack);
        assertThat(studentProfile.getUserProfile()).isEqualTo(userProfileBack);
        assertThat(userProfileBack.getStudentProfile()).isEqualTo(studentProfile);

        studentProfile.userProfile(null);
        assertThat(studentProfile.getUserProfile()).isNull();
        assertThat(userProfileBack.getStudentProfile()).isNull();
    }

    @Test
    void classesTest() {
        StudentProfile studentProfile = getStudentProfileRandomSampleGenerator();
        CourseClass courseClassBack = getCourseClassRandomSampleGenerator();

        studentProfile.addClasses(courseClassBack);
        assertThat(studentProfile.getClasses()).containsOnly(courseClassBack);
        assertThat(courseClassBack.getStudents()).containsOnly(studentProfile);

        studentProfile.removeClasses(courseClassBack);
        assertThat(studentProfile.getClasses()).doesNotContain(courseClassBack);
        assertThat(courseClassBack.getStudents()).doesNotContain(studentProfile);

        studentProfile.classes(new HashSet<>(Set.of(courseClassBack)));
        assertThat(studentProfile.getClasses()).containsOnly(courseClassBack);
        assertThat(courseClassBack.getStudents()).containsOnly(studentProfile);

        studentProfile.setClasses(new HashSet<>());
        assertThat(studentProfile.getClasses()).doesNotContain(courseClassBack);
        assertThat(courseClassBack.getStudents()).doesNotContain(studentProfile);
    }
}
