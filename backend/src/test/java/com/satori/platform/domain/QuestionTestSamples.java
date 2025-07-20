package com.satori.platform.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class QuestionTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Question getQuestionSample1() {
        return new Question()
            .id(1L)
            .content("content1")
            .imageUrl("imageUrl1")
            .suggestion("suggestion1")
            .answerExplanation("answerExplanation1")
            .correctAnswer("correctAnswer1")
            .type("type1");
    }

    public static Question getQuestionSample2() {
        return new Question()
            .id(2L)
            .content("content2")
            .imageUrl("imageUrl2")
            .suggestion("suggestion2")
            .answerExplanation("answerExplanation2")
            .correctAnswer("correctAnswer2")
            .type("type2");
    }

    public static Question getQuestionRandomSampleGenerator() {
        return new Question()
            .id(longCount.incrementAndGet())
            .content(UUID.randomUUID().toString())
            .imageUrl(UUID.randomUUID().toString())
            .suggestion(UUID.randomUUID().toString())
            .answerExplanation(UUID.randomUUID().toString())
            .correctAnswer(UUID.randomUUID().toString())
            .type(UUID.randomUUID().toString());
    }
}
