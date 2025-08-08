package com.satori.platform.service.exception;

/**
 * Exception thrown when attempting to access a quiz that has expired.
 */
public class QuizTimeExpiredException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public QuizTimeExpiredException() {
        super("Quiz time has expired");
    }

    public QuizTimeExpiredException(String message) {
        super(message);
    }

    public QuizTimeExpiredException(String message, Throwable cause) {
        super(message, cause);
    }

    public QuizTimeExpiredException(Long quizId) {
        super("Quiz with id " + quizId + " time has expired");
    }
}