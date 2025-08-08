package com.satori.platform.domain.enumeration;

/**
 * The OAuth2Provider enumeration.
 */
public enum OAuth2Provider {
    GOOGLE("google", "Google"),
    FACEBOOK("facebook", "Facebook"),
    GITHUB("github", "GitHub");

    private final String providerId;
    private final String displayName;

    OAuth2Provider(String providerId, String displayName) {
        this.providerId = providerId;
        this.displayName = displayName;
    }

    public String getProviderId() {
        return providerId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public static OAuth2Provider fromProviderId(String providerId) {
        for (OAuth2Provider provider : values()) {
            if (provider.getProviderId().equals(providerId)) {
                return provider;
            }
        }
        throw new IllegalArgumentException("Unknown OAuth2 provider: " + providerId);
    }
}