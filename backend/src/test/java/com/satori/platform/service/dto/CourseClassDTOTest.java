package com.satori.platform.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class CourseClassDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(CourseClassDTO.class);
        CourseClassDTO courseClassDTO1 = new CourseClassDTO();
        courseClassDTO1.setId(1L);
        CourseClassDTO courseClassDTO2 = new CourseClassDTO();
        assertThat(courseClassDTO1).isNotEqualTo(courseClassDTO2);
        courseClassDTO2.setId(courseClassDTO1.getId());
        assertThat(courseClassDTO1).isEqualTo(courseClassDTO2);
        courseClassDTO2.setId(2L);
        assertThat(courseClassDTO1).isNotEqualTo(courseClassDTO2);
        courseClassDTO1.setId(null);
        assertThat(courseClassDTO1).isNotEqualTo(courseClassDTO2);
    }
}
