package com.satori.platform.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class UserProfileTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static UserProfile getUserProfileSample1() {
        return new UserProfile().id(1L).username("username1").passwordHash("passwordHash1").email("email1").fullName("fullName1");
    }

    public static UserProfile getUserProfileSample2() {
        return new UserProfile().id(2L).username("username2").passwordHash("passwordHash2").email("email2").fullName("fullName2");
    }

    public static UserProfile getUserProfileRandomSampleGenerator() {
        return new UserProfile()
            .id(longCount.incrementAndGet())
            .username(UUID.randomUUID().toString())
            .passwordHash(UUID.randomUUID().toString())
            .email(UUID.randomUUID().toString())
            .fullName(UUID.randomUUID().toString());
    }
}
