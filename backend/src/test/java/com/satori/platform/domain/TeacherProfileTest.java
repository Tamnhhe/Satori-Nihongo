package com.satori.platform.domain;

import static com.satori.platform.domain.TeacherProfileTestSamples.*;
import static com.satori.platform.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TeacherProfileTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(TeacherProfile.class);
        TeacherProfile teacherProfile1 = getTeacherProfileSample1();
        TeacherProfile teacherProfile2 = new TeacherProfile();
        assertThat(teacherProfile1).isNotEqualTo(teacherProfile2);

        teacherProfile2.setId(teacherProfile1.getId());
        assertThat(teacherProfile1).isEqualTo(teacherProfile2);

        teacherProfile2 = getTeacherProfileSample2();
        assertThat(teacherProfile1).isNotEqualTo(teacherProfile2);
    }

    @Test
    void userProfileTest() {
        TeacherProfile teacherProfile = getTeacherProfileRandomSampleGenerator();
        UserProfile userProfileBack = getUserProfileRandomSampleGenerator();

        teacherProfile.setUserProfile(userProfileBack);
        assertThat(teacherProfile.getUserProfile()).isEqualTo(userProfileBack);
        assertThat(userProfileBack.getTeacherProfile()).isEqualTo(teacherProfile);

        teacherProfile.userProfile(null);
        assertThat(teacherProfile.getUserProfile()).isNull();
        assertThat(userProfileBack.getTeacherProfile()).isNull();
    }
}
