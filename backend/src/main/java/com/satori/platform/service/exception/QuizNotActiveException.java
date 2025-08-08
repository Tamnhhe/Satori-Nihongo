package com.satori.platform.service.exception;

/**
 * Exception thrown when attempting to access a quiz that is not currently
 * active.
 */
public class QuizNotActiveException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public QuizNotActiveException() {
        super("Quiz is not currently active");
    }

    public QuizNotActiveException(String message) {
        super(message);
    }

    public QuizNotActiveException(String message, Throwable cause) {
        super(message, cause);
    }

    public QuizNotActiveException(Long quizId) {
        super("Quiz with id " + quizId + " is not currently active");
    }
}