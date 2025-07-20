package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.AuthProvider;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for the {@link com.satori.platform.domain.SocialAccount} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class SocialAccountDTO implements Serializable {

    private Long id;

    @NotNull
    private AuthProvider provider;

    @NotNull
    @Size(max = 100)
    private String providerUserId;

    @Size(max = 500)
    private String accessToken;

    @Size(max = 500)
    private String refreshToken;

    private Instant tokenExpiry;

    private UserProfileDTO userProfile;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AuthProvider getProvider() {
        return provider;
    }

    public void setProvider(AuthProvider provider) {
        this.provider = provider;
    }

    public String getProviderUserId() {
        return providerUserId;
    }

    public void setProviderUserId(String providerUserId) {
        this.providerUserId = providerUserId;
    }

    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public Instant getTokenExpiry() {
        return tokenExpiry;
    }

    public void setTokenExpiry(Instant tokenExpiry) {
        this.tokenExpiry = tokenExpiry;
    }

    public UserProfileDTO getUserProfile() {
        return userProfile;
    }

    public void setUserProfile(UserProfileDTO userProfile) {
        this.userProfile = userProfile;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof SocialAccountDTO)) {
            return false;
        }

        SocialAccountDTO socialAccountDTO = (SocialAccountDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, socialAccountDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "SocialAccountDTO{" +
            "id=" + getId() +
            ", provider='" + getProvider() + "'" +
            ", providerUserId='" + getProviderUserId() + "'" +
            ", accessToken='" + getAccessToken() + "'" +
            ", refreshToken='" + getRefreshToken() + "'" +
            ", tokenExpiry='" + getTokenExpiry() + "'" +
            ", userProfile=" + getUserProfile() +
            "}";
    }
}
