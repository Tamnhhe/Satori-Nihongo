package com.satori.platform.service.exception;

/**
 * Base exception for gift code related operations.
 */
public class GiftCodeException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public GiftCodeException(String message) {
        super(message);
    }

    public GiftCodeException(String message, Throwable cause) {
        super(message, cause);
    }
}