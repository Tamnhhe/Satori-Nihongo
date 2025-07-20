package com.satori.platform.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class SocialAccountTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static SocialAccount getSocialAccountSample1() {
        return new SocialAccount().id(1L).providerUserId("providerUserId1").accessToken("accessToken1").refreshToken("refreshToken1");
    }

    public static SocialAccount getSocialAccountSample2() {
        return new SocialAccount().id(2L).providerUserId("providerUserId2").accessToken("accessToken2").refreshToken("refreshToken2");
    }

    public static SocialAccount getSocialAccountRandomSampleGenerator() {
        return new SocialAccount()
            .id(longCount.incrementAndGet())
            .providerUserId(UUID.randomUUID().toString())
            .accessToken(UUID.randomUUID().toString())
            .refreshToken(UUID.randomUUID().toString());
    }
}
