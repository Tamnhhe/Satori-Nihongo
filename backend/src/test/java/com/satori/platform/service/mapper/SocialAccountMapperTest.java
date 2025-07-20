package com.satori.platform.service.mapper;

import static com.satori.platform.domain.SocialAccountAsserts.*;
import static com.satori.platform.domain.SocialAccountTestSamples.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class SocialAccountMapperTest {

    private SocialAccountMapper socialAccountMapper;

    @BeforeEach
    void setUp() {
        socialAccountMapper = new SocialAccountMapperImpl();
    }

    @Test
    void shouldConvertToDtoAndBack() {
        var expected = getSocialAccountSample1();
        var actual = socialAccountMapper.toEntity(socialAccountMapper.toDto(expected));
        assertSocialAccountAllPropertiesEquals(expected, actual);
    }
}
