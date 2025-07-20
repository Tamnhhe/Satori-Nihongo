package com.satori.platform.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class QuizQuestionDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(QuizQuestionDTO.class);
        QuizQuestionDTO quizQuestionDTO1 = new QuizQuestionDTO();
        quizQuestionDTO1.setId(1L);
        QuizQuestionDTO quizQuestionDTO2 = new QuizQuestionDTO();
        assertThat(quizQuestionDTO1).isNotEqualTo(quizQuestionDTO2);
        quizQuestionDTO2.setId(quizQuestionDTO1.getId());
        assertThat(quizQuestionDTO1).isEqualTo(quizQuestionDTO2);
        quizQuestionDTO2.setId(2L);
        assertThat(quizQuestionDTO1).isNotEqualTo(quizQuestionDTO2);
        quizQuestionDTO1.setId(null);
        assertThat(quizQuestionDTO1).isNotEqualTo(quizQuestionDTO2);
    }
}
