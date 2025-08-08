package com.satori.platform.service.exception;

/**
 * Exception thrown when attempting to use an invalid gift code.
 */
public class GiftCodeInvalidException extends GiftCodeException {

    private static final long serialVersionUID = 1L;

    public GiftCodeInvalidException(String code) {
        super("Gift code '" + code + "' is invalid or not found");
    }
}