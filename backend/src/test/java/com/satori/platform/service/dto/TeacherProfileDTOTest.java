package com.satori.platform.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class TeacherProfileDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(TeacherProfileDTO.class);
        TeacherProfileDTO teacherProfileDTO1 = new TeacherProfileDTO();
        teacherProfileDTO1.setId(1L);
        TeacherProfileDTO teacherProfileDTO2 = new TeacherProfileDTO();
        assertThat(teacherProfileDTO1).isNotEqualTo(teacherProfileDTO2);
        teacherProfileDTO2.setId(teacherProfileDTO1.getId());
        assertThat(teacherProfileDTO1).isEqualTo(teacherProfileDTO2);
        teacherProfileDTO2.setId(2L);
        assertThat(teacherProfileDTO1).isNotEqualTo(teacherProfileDTO2);
        teacherProfileDTO1.setId(null);
        assertThat(teacherProfileDTO1).isNotEqualTo(teacherProfileDTO2);
    }
}
