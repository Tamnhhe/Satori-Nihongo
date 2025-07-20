package com.satori.platform.service.dto;

import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SocialAccountDTOTest {

    @Test
    void dtoEqualsVerifier() throws Exception {
        TestUtil.equalsVerifier(SocialAccountDTO.class);
        SocialAccountDTO socialAccountDTO1 = new SocialAccountDTO();
        socialAccountDTO1.setId(1L);
        SocialAccountDTO socialAccountDTO2 = new SocialAccountDTO();
        assertThat(socialAccountDTO1).isNotEqualTo(socialAccountDTO2);
        socialAccountDTO2.setId(socialAccountDTO1.getId());
        assertThat(socialAccountDTO1).isEqualTo(socialAccountDTO2);
        socialAccountDTO2.setId(2L);
        assertThat(socialAccountDTO1).isNotEqualTo(socialAccountDTO2);
        socialAccountDTO1.setId(null);
        assertThat(socialAccountDTO1).isNotEqualTo(socialAccountDTO2);
    }
}
