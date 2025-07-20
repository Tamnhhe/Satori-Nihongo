package com.satori.platform.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class FlashcardDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(FlashcardDTO.class);
        FlashcardDTO flashcardDTO1 = new FlashcardDTO();
        flashcardDTO1.setId(1L);
        FlashcardDTO flashcardDTO2 = new FlashcardDTO();
        assertThat(flashcardDTO1).isNotEqualTo(flashcardDTO2);
        flashcardDTO2.setId(flashcardDTO1.getId());
        assertThat(flashcardDTO1).isEqualTo(flashcardDTO2);
        flashcardDTO2.setId(2L);
        assertThat(flashcardDTO1).isNotEqualTo(flashcardDTO2);
        flashcardDTO1.setId(null);
        assertThat(flashcardDTO1).isNotEqualTo(flashcardDTO2);
    }
}
