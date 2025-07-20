package com.satori.platform.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class QuizQuestionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static QuizQuestion getQuizQuestionSample1() {
        return new QuizQuestion().id(1L).position(1);
    }

    public static QuizQuestion getQuizQuestionSample2() {
        return new QuizQuestion().id(2L).position(2);
    }

    public static QuizQuestion getQuizQuestionRandomSampleGenerator() {
        return new QuizQuestion().id(longCount.incrementAndGet()).position(intCount.incrementAndGet());
    }
}
