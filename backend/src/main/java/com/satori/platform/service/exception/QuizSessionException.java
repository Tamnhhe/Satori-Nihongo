package com.satori.platform.service.exception;

/**
 * Exception thrown when there are issues with quiz session management.
 */
public class QuizSessionException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public QuizSessionException() {
        super("Quiz session error");
    }

    public QuizSessionException(String message) {
        super(message);
    }

    public QuizSessionException(String message, Throwable cause) {
        super(message, cause);
    }
}