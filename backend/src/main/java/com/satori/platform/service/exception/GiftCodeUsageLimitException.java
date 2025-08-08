package com.satori.platform.service.exception;

/**
 * Exception thrown when attempting to use a gift code that has reached its
 * usage limit.
 */
public class GiftCodeUsageLimitException extends GiftCodeException {

    private static final long serialVersionUID = 1L;

    public GiftCodeUsageLimitException(String code) {
        super("Gift code '" + code + "' has reached its usage limit");
    }
}