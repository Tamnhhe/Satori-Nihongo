package com.satori.platform.domain;

import static com.satori.platform.domain.SocialAccountTestSamples.*;
import static com.satori.platform.domain.UserProfileTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import com.satori.platform.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class SocialAccountTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(SocialAccount.class);
        SocialAccount socialAccount1 = getSocialAccountSample1();
        SocialAccount socialAccount2 = new SocialAccount();
        assertThat(socialAccount1).isNotEqualTo(socialAccount2);

        socialAccount2.setId(socialAccount1.getId());
        assertThat(socialAccount1).isEqualTo(socialAccount2);

        socialAccount2 = getSocialAccountSample2();
        assertThat(socialAccount1).isNotEqualTo(socialAccount2);
    }

    @Test
    void userProfileTest() {
        SocialAccount socialAccount = getSocialAccountRandomSampleGenerator();
        UserProfile userProfileBack = getUserProfileRandomSampleGenerator();

        socialAccount.setUserProfile(userProfileBack);
        assertThat(socialAccount.getUserProfile()).isEqualTo(userProfileBack);

        socialAccount.userProfile(null);
        assertThat(socialAccount.getUserProfile()).isNull();
    }
}
