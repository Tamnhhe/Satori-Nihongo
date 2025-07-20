package com.satori.platform.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class CourseClassTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static CourseClass getCourseClassSample1() {
        return new CourseClass().id(1L).code("code1").name("name1").description("description1").capacity(1);
    }

    public static CourseClass getCourseClassSample2() {
        return new CourseClass().id(2L).code("code2").name("name2").description("description2").capacity(2);
    }

    public static CourseClass getCourseClassRandomSampleGenerator() {
        return new CourseClass()
            .id(longCount.incrementAndGet())
            .code(UUID.randomUUID().toString())
            .name(UUID.randomUUID().toString())
            .description(UUID.randomUUID().toString())
            .capacity(intCount.incrementAndGet());
    }
}
