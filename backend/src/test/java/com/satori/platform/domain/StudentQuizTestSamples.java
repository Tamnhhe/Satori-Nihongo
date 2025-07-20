package com.satori.platform.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class StudentQuizTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static StudentQuiz getStudentQuizSample1() {
        return new StudentQuiz().id(1L);
    }

    public static StudentQuiz getStudentQuizSample2() {
        return new StudentQuiz().id(2L);
    }

    public static StudentQuiz getStudentQuizRandomSampleGenerator() {
        return new StudentQuiz().id(longCount.incrementAndGet());
    }
}
