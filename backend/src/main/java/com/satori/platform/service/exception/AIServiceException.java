package com.satori.platform.service.exception;

/**
 * Exception thrown when AI service operations fail.
 */
public class AIServiceException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public AIServiceException(String message) {
        super(message);
    }

    public AIServiceException(String message, Throwable cause) {
        super(message, cause);
    }
}