package com.satori.platform.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class StudentQuizDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(StudentQuizDTO.class);
        StudentQuizDTO studentQuizDTO1 = new StudentQuizDTO();
        studentQuizDTO1.setId(1L);
        StudentQuizDTO studentQuizDTO2 = new StudentQuizDTO();
        assertThat(studentQuizDTO1).isNotEqualTo(studentQuizDTO2);
        studentQuizDTO2.setId(studentQuizDTO1.getId());
        assertThat(studentQuizDTO1).isEqualTo(studentQuizDTO2);
        studentQuizDTO2.setId(2L);
        assertThat(studentQuizDTO1).isNotEqualTo(studentQuizDTO2);
        studentQuizDTO1.setId(null);
        assertThat(studentQuizDTO1).isNotEqualTo(studentQuizDTO2);
    }
}
