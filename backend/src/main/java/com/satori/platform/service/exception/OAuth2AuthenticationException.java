package com.satori.platform.service.exception;

import com.satori.platform.domain.enumeration.OAuth2Provider;

/**
 * Exception thrown when OAuth2 authentication fails.
 */
public class OAuth2AuthenticationException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    private final OAuth2Provider provider;
    private final String errorCode;

    public OAuth2AuthenticationException(String message, OAuth2Provider provider) {
        super(message);
        this.provider = provider;
        this.errorCode = "OAUTH2_AUTH_FAILED";
    }

    public OAuth2AuthenticationException(String message, OAuth2Provider provider, String errorCode) {
        super(message);
        this.provider = provider;
        this.errorCode = errorCode;
    }

    public OAuth2AuthenticationException(String message, OAuth2Provider provider, String errorCode, Throwable cause) {
        super(message, cause);
        this.provider = provider;
        this.errorCode = errorCode;
    }

    public OAuth2Provider getProvider() {
        return provider;
    }

    public String getErrorCode() {
        return errorCode;
    }

    @Override
    public String toString() {
        return "OAuth2AuthenticationException{" +
                "provider=" + provider +
                ", errorCode='" + errorCode + '\'' +
                ", message='" + getMessage() + '\'' +
                '}';
    }
}