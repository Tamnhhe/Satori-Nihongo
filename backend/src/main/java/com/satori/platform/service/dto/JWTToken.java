package com.satori.platform.service.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.Objects;

/**
 * DTO for JWT token response.
 */
public class JWTToken implements Serializable {

    private static final long serialVersionUID = 1L;

    @JsonProperty("id_token")
    private String idToken;

    @JsonProperty("token_type")
    private String tokenType = "Bearer";

    @JsonProperty("expires_in")
    private Long expiresIn;

    private boolean isNewUser;
    private String provider;

    public JWTToken() {
    }

    public JWTToken(String idToken) {
        this.idToken = idToken;
    }

    public JWTToken(String idToken, Long expiresIn) {
        this.idToken = idToken;
        this.expiresIn = expiresIn;
    }

    public String getIdToken() {
        return idToken;
    }

    public void setIdToken(String idToken) {
        this.idToken = idToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }

    public Long getExpiresIn() {
        return expiresIn;
    }

    public void setExpiresIn(Long expiresIn) {
        this.expiresIn = expiresIn;
    }

    public boolean isNewUser() {
        return isNewUser;
    }

    public void setNewUser(boolean newUser) {
        isNewUser = newUser;
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
        if (!(o instanceof JWTToken))
            return false;
        JWTToken jwtToken = (JWTToken) o;
        return Objects.equals(idToken, jwtToken.idToken);
    }

    @Override
    public int hashCode() {
        return Objects.hash(idToken);
    }

    @Override
    public String toString() {
        return "JWTToken{" +
                "tokenType='" + tokenType + '\'' +
                ", expiresIn=" + expiresIn +
                ", isNewUser=" + isNewUser +
                ", provider='" + provider + '\'' +
                '}';
    }
}