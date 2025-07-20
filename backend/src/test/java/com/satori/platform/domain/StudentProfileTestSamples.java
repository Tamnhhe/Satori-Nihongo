package com.satori.platform.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class StudentProfileTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static StudentProfile getStudentProfileSample1() {
        return new StudentProfile().id(1L).studentId("studentId1");
    }

    public static StudentProfile getStudentProfileSample2() {
        return new StudentProfile().id(2L).studentId("studentId2");
    }

    public static StudentProfile getStudentProfileRandomSampleGenerator() {
        return new StudentProfile().id(longCount.incrementAndGet()).studentId(UUID.randomUUID().toString());
    }
}
