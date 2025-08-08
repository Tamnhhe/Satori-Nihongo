package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.OAuth2Provider;
import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * DTO for linked OAuth2 account information.
 */
public class LinkedAccountDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long id;
    private OAuth2Provider provider;
    private String providerUserId;
    private String providerUsername;
    private Instant linkedAt;
    private Instant lastUsedAt;
    private boolean tokenExpired;

    public LinkedAccountDTO() {
    }

    public LinkedAccountDTO(Long id, OAuth2Provider provider, String providerUserId, String providerUsername,
            Instant linkedAt, Instant lastUsedAt, boolean tokenExpired) {
        this.id = id;
        this.provider = provider;
        this.providerUserId = providerUserId;
        this.providerUsername = providerUsername;
        this.linkedAt = linkedAt;
        this.lastUsedAt = lastUsedAt;
        this.tokenExpired = tokenExpired;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OAuth2Provider getProvider() {
        return provider;
    }

    public void setProvider(OAuth2Provider provider) {
        this.provider = provider;
    }

    public String getProviderUserId() {
        return providerUserId;
    }

    public void setProviderUserId(String providerUserId) {
        this.providerUserId = providerUserId;
    }

    public String getProviderUsername() {
        return providerUsername;
    }

    public void setProviderUsername(String providerUsername) {
        this.providerUsername = providerUsername;
    }

    public Instant getLinkedAt() {
        return linkedAt;
    }

    public void setLinkedAt(Instant linkedAt) {
        this.linkedAt = linkedAt;
    }

    public Instant getLastUsedAt() {
        return lastUsedAt;
    }

    public void setLastUsedAt(Instant lastUsedAt) {
        this.lastUsedAt = lastUsedAt;
    }

    public boolean isTokenExpired() {
        return tokenExpired;
    }

    public void setTokenExpired(boolean tokenExpired) {
        this.tokenExpired = tokenExpired;
    }

    public String getProviderDisplayName() {
        return provider != null ? provider.getDisplayName() : null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof LinkedAccountDTO))
            return false;
        LinkedAccountDTO that = (LinkedAccountDTO) o;
        return Objects.equals(id, that.id) &&
                provider == that.provider &&
                Objects.equals(providerUserId, that.providerUserId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, provider, providerUserId);
    }

    @Override
    public String toString() {
        return "LinkedAccountDTO{" +
                "id=" + id +
                ", provider=" + provider +
                ", providerUserId='" + providerUserId + '\'' +
                ", providerUsername='" + providerUsername + '\'' +
                ", linkedAt=" + linkedAt +
                ", lastUsedAt=" + lastUsedAt +
                ", tokenExpired=" + tokenExpired +
                '}';
    }
}