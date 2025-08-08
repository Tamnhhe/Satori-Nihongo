package com.satori.platform.service.exception;

/**
 * Exception thrown when quiz validation fails.
 */
public class QuizValidationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public QuizValidationException() {
        super("Quiz validation failed");
    }

    public QuizValidationException(String message) {
        super(message);
    }

    public QuizValidationException(String message, Throwable cause) {
        super(message, cause);
    }
}