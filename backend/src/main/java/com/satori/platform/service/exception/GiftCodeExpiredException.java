package com.satori.platform.service.exception;

/**
 * Exception thrown when attempting to use an expired gift code.
 */
public class GiftCodeExpiredException extends GiftCodeException {

    private static final long serialVersionUID = 1L;

    public GiftCodeExpiredException(String code) {
        super("Gift code '" + code + "' has expired");
    }
}