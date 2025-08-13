package com.satori.platform.service.exception;

/**
 * Exception thrown when operations with Astra DB fail.
 */
public class AstraDbException extends RuntimeException {

    public AstraDbException(String message) {
        super(message);
    }

    public AstraDbException(String message, Throwable cause) {
        super(message, cause);
    }
}
