package com.satori.platform.service.exception;

import com.satori.platform.domain.enumeration.OAuth2Provider;

/**
 * Exception thrown when OAuth2 token has expired and refresh fails.
 */
public class OAuth2TokenExpiredException extends OAuth2AuthenticationException {

    private static final long serialVersionUID = 1L;

    public OAuth2TokenExpiredException(String message, OAuth2Provider provider) {
        super(message, provider, "OAUTH2_TOKEN_EXPIRED");
    }

    public OAuth2TokenExpiredException(String message, OAuth2Provider provider, Throwable cause) {
        super(message, provider, "OAUTH2_TOKEN_EXPIRED", cause);
    }

    public static OAuth2TokenExpiredException tokenRefreshFailed(OAuth2Provider provider) {
        return new OAuth2TokenExpiredException(
                "Failed to refresh expired OAuth2 token",
                provider);
    }

    public static OAuth2TokenExpiredException noRefreshToken(OAuth2Provider provider) {
        return new OAuth2TokenExpiredException(
                "No refresh token available for expired OAuth2 token",
                provider);
    }
}