package com.satori.platform.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class TeacherProfileTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static TeacherProfile getTeacherProfileSample1() {
        return new TeacherProfile().id(1L).teacherCode("teacherCode1");
    }

    public static TeacherProfile getTeacherProfileSample2() {
        return new TeacherProfile().id(2L).teacherCode("teacherCode2");
    }

    public static TeacherProfile getTeacherProfileRandomSampleGenerator() {
        return new TeacherProfile().id(longCount.incrementAndGet()).teacherCode(UUID.randomUUID().toString());
    }
}
