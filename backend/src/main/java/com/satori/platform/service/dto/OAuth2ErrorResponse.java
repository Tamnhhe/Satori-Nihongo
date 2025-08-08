package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.OAuth2Provider;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * DTO for OAuth2 error response.
 */
public class OAuth2ErrorResponse implements Serializable {

    private static final long serialVersionUID = 1L;

    private String error;
    private String errorDescription;
    private OAuth2Provider provider;
    private String errorCode;
    private Instant timestamp;
    private String path;

    public OAuth2ErrorResponse() {
        this.timestamp = Instant.now();
    }

    public OAuth2ErrorResponse(String error, String errorDescription, OAuth2Provider provider, String errorCode) {
        this();
        this.error = error;
        this.errorDescription = errorDescription;
        this.provider = provider;
        this.errorCode = errorCode;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getErrorDescription() {
        return errorDescription;
    }

    public void setErrorDescription(String errorDescription) {
        this.errorDescription = errorDescription;
    }

    public OAuth2Provider getProvider() {
        return provider;
    }

    public void setProvider(OAuth2Provider provider) {
        this.provider = provider;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getProviderDisplayName() {
        return provider != null ? provider.getDisplayName() : null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof OAuth2ErrorResponse))
            return false;
        OAuth2ErrorResponse that = (OAuth2ErrorResponse) o;
        return Objects.equals(error, that.error) &&
                Objects.equals(errorCode, that.errorCode) &&
                provider == that.provider &&
                Objects.equals(timestamp, that.timestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(error, errorCode, provider, timestamp);
    }

    @Override
    public String toString() {
        return "OAuth2ErrorResponse{" +
                "error='" + error + '\'' +
                ", errorDescription='" + errorDescription + '\'' +
                ", provider=" + provider +
                ", errorCode='" + errorCode + '\'' +
                ", timestamp=" + timestamp +
                ", path='" + path + '\'' +
                '}';
    }
}