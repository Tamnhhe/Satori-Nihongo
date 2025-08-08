package com.satori.platform.service.exception;

/**
 * Exception thrown when a user doesn't have sufficient permissions for an
 * operation.
 */
public class InsufficientPermissionException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public InsufficientPermissionException(String message) {
        super(message);
    }

    public InsufficientPermissionException(String message, Throwable cause) {
        super(message, cause);
    }
}