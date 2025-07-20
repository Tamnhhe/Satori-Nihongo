package com.satori.platform.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class FlashcardTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Flashcard getFlashcardSample1() {
        return new Flashcard().id(1L).term("term1").imageUrl("imageUrl1").hint("hint1").position(1);
    }

    public static Flashcard getFlashcardSample2() {
        return new Flashcard().id(2L).term("term2").imageUrl("imageUrl2").hint("hint2").position(2);
    }

    public static Flashcard getFlashcardRandomSampleGenerator() {
        return new Flashcard()
            .id(longCount.incrementAndGet())
            .term(UUID.randomUUID().toString())
            .imageUrl(UUID.randomUUID().toString())
            .hint(UUID.randomUUID().toString())
            .position(intCount.incrementAndGet());
    }
}
