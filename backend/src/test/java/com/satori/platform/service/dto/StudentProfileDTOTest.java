package com.satori.platform.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StudentProfileDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(StudentProfileDTO.class);
        StudentProfileDTO studentProfileDTO1 = new StudentProfileDTO();
        studentProfileDTO1.setId(1L);
        StudentProfileDTO studentProfileDTO2 = new StudentProfileDTO();
        assertThat(studentProfileDTO1).isNotEqualTo(studentProfileDTO2);
        studentProfileDTO2.setId(studentProfileDTO1.getId());
        assertThat(studentProfileDTO1).isEqualTo(studentProfileDTO2);
        studentProfileDTO2.setId(2L);
        assertThat(studentProfileDTO1).isNotEqualTo(studentProfileDTO2);
        studentProfileDTO1.setId(null);
        assertThat(studentProfileDTO1).isNotEqualTo(studentProfileDTO2);
    }
}
