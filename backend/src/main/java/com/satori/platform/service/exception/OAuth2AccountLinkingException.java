package com.satori.platform.service.exception;

import com.satori.platform.domain.enumeration.OAuth2Provider;

/**
 * Exception thrown when OAuth2 account linking fails.
 */
public class OAuth2AccountLinkingException extends OAuth2AuthenticationException {

    private static final long serialVersionUID = 1L;

    public OAuth2AccountLinkingException(String message, OAuth2Provider provider) {
        super(message, provider, "OAUTH2_ACCOUNT_LINKING_FAILED");
    }

    public OAuth2AccountLinkingException(String message, OAuth2Provider provider, Throwable cause) {
        super(message, provider, "OAUTH2_ACCOUNT_LINKING_FAILED", cause);
    }

    public static OAuth2AccountLinkingException accountAlreadyLinked(OAuth2Provider provider) {
        return new OAuth2AccountLinkingException(
                "OAuth2 account is already linked to another user",
                provider);
    }

    public static OAuth2AccountLinkingException accountAlreadyLinkedToCurrentUser(OAuth2Provider provider) {
        return new OAuth2AccountLinkingException(
                "OAuth2 account is already linked to the current user",
                provider);
    }

    public static OAuth2AccountLinkingException invalidAuthorizationCode(OAuth2Provider provider) {
        return new OAuth2AccountLinkingException(
                "Invalid authorization code for account linking",
                provider);
    }
}