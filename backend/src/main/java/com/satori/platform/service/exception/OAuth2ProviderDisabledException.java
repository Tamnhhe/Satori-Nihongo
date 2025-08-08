package com.satori.platform.service.exception;

import com.satori.platform.domain.enumeration.OAuth2Provider;

/**
 * Exception thrown when OAuth2 provider is disabled in configuration.
 */
public class OAuth2ProviderDisabledException extends OAuth2AuthenticationException {

    private static final long serialVersionUID = 1L;

    public OAuth2ProviderDisabledException(OAuth2Provider provider) {
        super("OAuth2 provider is disabled: " + provider.getDisplayName(), provider, "OAUTH2_PROVIDER_DISABLED");
    }

    public OAuth2ProviderDisabledException(String message, OAuth2Provider provider) {
        super(message, provider, "OAUTH2_PROVIDER_DISABLED");
    }
}