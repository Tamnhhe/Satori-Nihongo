package com.satori.platform.service.dto;

import java.io.Serializable;
import java.util.Objects;

/**
 * DTO for OAuth2 authorization response.
 */
public class OAuth2AuthorizationResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private String authorizationUrl;
    private String state;
    private String provider;

    public OAuth2AuthorizationResponse() {
    }

    public OAuth2AuthorizationResponse(String authorizationUrl, String state, String provider) {
        this.authorizationUrl = authorizationUrl;
        this.state = state;
        this.provider = provider;
    }

    public String getAuthorizationUrl() {
        return authorizationUrl;
    }

    public void setAuthorizationUrl(String authorizationUrl) {
        this.authorizationUrl = authorizationUrl;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof OAuth2AuthorizationResponse))
            return false;
        OAuth2AuthorizationResponse that = (OAuth2AuthorizationResponse) o;
        return Objects.equals(authorizationUrl, that.authorizationUrl) &&
                Objects.equals(state, that.state) &&
                Objects.equals(provider, that.provider);
    }

    @Override
    public int hashCode() {
        return Objects.hash(authorizationUrl, state, provider);
    }

    @Override
    public String toString() {
        return "OAuth2AuthorizationResponse{" +
                "authorizationUrl='" + authorizationUrl + '\'' +
                ", state='" + state + '\'' +
                ", provider='" + provider + '\'' +
                '}';
    }
}