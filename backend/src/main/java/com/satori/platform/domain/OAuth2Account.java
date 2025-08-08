package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.satori.platform.domain.enumeration.OAuth2Provider;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A OAuth2Account.
 */
@Entity
@Table(name = "oauth2_account")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class OAuth2Account extends AbstractAuditingEntity<Long> implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "provider", nullable = false)
    private OAuth2Provider provider;

    @NotNull
    @Size(max = 255)
    @Column(name = "provider_user_id", length = 255, nullable = false)
    private String providerUserId;

    @Size(max = 255)
    @Column(name = "provider_username", length = 255)
    private String providerUsername;

    @JsonIgnore
    @Column(name = "access_token", length = 1000)
    private String accessToken;

    @JsonIgnore
    @Column(name = "refresh_token", length = 1000)
    private String refreshToken;

    @Column(name = "token_expires_at")
    private Instant tokenExpiresAt;

    @Column(name = "profile_data", columnDefinition = "TEXT")
    private String profileData;

    @NotNull
    @Column(name = "linked_at", nullable = false)
    private Instant linkedAt;

    @Column(name = "last_used_at")
    private Instant lastUsedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public OAuth2Account id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public OAuth2Provider getProvider() {
        return this.provider;
    }

    public OAuth2Account provider(OAuth2Provider provider) {
        this.setProvider(provider);
        return this;
    }

    public void setProvider(OAuth2Provider provider) {
        this.provider = provider;
    }

    public String getProviderUserId() {
        return this.providerUserId;
    }

    public OAuth2Account providerUserId(String providerUserId) {
        this.setProviderUserId(providerUserId);
        return this;
    }

    public void setProviderUserId(String providerUserId) {
        this.providerUserId = providerUserId;
    }

    public String getProviderUsername() {
        return this.providerUsername;
    }

    public OAuth2Account providerUsername(String providerUsername) {
        this.setProviderUsername(providerUsername);
        return this;
    }

    public void setProviderUsername(String providerUsername) {
        this.providerUsername = providerUsername;
    }

    public String getAccessToken() {
        return this.accessToken;
    }

    public OAuth2Account accessToken(String accessToken) {
        this.setAccessToken(accessToken);
        return this;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getRefreshToken() {
        return this.refreshToken;
    }

    public OAuth2Account refreshToken(String refreshToken) {
        this.setRefreshToken(refreshToken);
        return this;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public Instant getTokenExpiresAt() {
        return this.tokenExpiresAt;
    }

    public OAuth2Account tokenExpiresAt(Instant tokenExpiresAt) {
        this.setTokenExpiresAt(tokenExpiresAt);
        return this;
    }

    public void setTokenExpiresAt(Instant tokenExpiresAt) {
        this.tokenExpiresAt = tokenExpiresAt;
    }

    public String getProfileData() {
        return this.profileData;
    }

    public OAuth2Account profileData(String profileData) {
        this.setProfileData(profileData);
        return this;
    }

    public void setProfileData(String profileData) {
        this.profileData = profileData;
    }

    public Instant getLinkedAt() {
        return this.linkedAt;
    }

    public OAuth2Account linkedAt(Instant linkedAt) {
        this.setLinkedAt(linkedAt);
        return this;
    }

    public void setLinkedAt(Instant linkedAt) {
        this.linkedAt = linkedAt;
    }

    public Instant getLastUsedAt() {
        return this.lastUsedAt;
    }

    public OAuth2Account lastUsedAt(Instant lastUsedAt) {
        this.setLastUsedAt(lastUsedAt);
        return this;
    }

    public void setLastUsedAt(Instant lastUsedAt) {
        this.lastUsedAt = lastUsedAt;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public OAuth2Account user(User user) {
        this.setUser(user);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof OAuth2Account)) {
            return false;
        }
        return getId() != null && getId().equals(((OAuth2Account) o).getId());
    }

    @Override
    public int hashCode() {
        // see
        // https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "OAuth2Account{" +
                "id=" + getId() +
                ", provider='" + getProvider() + "'" +
                ", providerUserId='" + getProviderUserId() + "'" +
                ", providerUsername='" + getProviderUsername() + "'" +
                ", tokenExpiresAt='" + getTokenExpiresAt() + "'" +
                ", profileData='" + getProfileData() + "'" +
                ", linkedAt='" + getLinkedAt() + "'" +
                ", lastUsedAt='" + getLastUsedAt() + "'" +
                "}";
    }
}