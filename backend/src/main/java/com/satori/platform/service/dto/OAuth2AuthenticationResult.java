package com.satori.platform.service.dto;

import com.satori.platform.domain.OAuth2Account;
import com.satori.platform.domain.User;

import java.io.Serializable;
import java.util.Objects;

/**
 * DTO for OAuth2 authentication result.
 */
public class OAuth2AuthenticationResult implements Serializable {

    private static final long serialVersionUID = 1L;

    private User user;
    private boolean isNewUser;
    private OAuth2Account oauth2Account;
    private String jwtToken;
    private OAuth2UserProfile userProfile;
    private boolean accountLinked;

    public OAuth2AuthenticationResult() {
    }

    public OAuth2AuthenticationResult(User user, boolean isNewUser, OAuth2Account oauth2Account,
            OAuth2UserProfile userProfile) {
        this.user = user;
        this.isNewUser = isNewUser;
        this.oauth2Account = oauth2Account;
        this.userProfile = userProfile;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isNewUser() {
        return isNewUser;
    }

    public void setNewUser(boolean newUser) {
        isNewUser = newUser;
    }

    public OAuth2Account getOauth2Account() {
        return oauth2Account;
    }

    public void setOauth2Account(OAuth2Account oauth2Account) {
        this.oauth2Account = oauth2Account;
    }

    public String getJwtToken() {
        return jwtToken;
    }

    public void setJwtToken(String jwtToken) {
        this.jwtToken = jwtToken;
    }

    public OAuth2UserProfile getUserProfile() {
        return userProfile;
    }

    public void setUserProfile(OAuth2UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public boolean isAccountLinked() {
        return accountLinked;
    }

    public void setAccountLinked(boolean accountLinked) {
        this.accountLinked = accountLinked;
    }

    /**
     * Check if authentication was successful.
     */
    public boolean isSuccessful() {
        return user != null && oauth2Account != null;
    }

    /**
     * Get user ID for convenience.
     */
    public Long getUserId() {
        return user != null ? user.getId() : null;
    }

    /**
     * Get provider for convenience.
     */
    public String getProvider() {
        return oauth2Account != null ? oauth2Account.getProvider().name() : null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof OAuth2AuthenticationResult))
            return false;
        OAuth2AuthenticationResult that = (OAuth2AuthenticationResult) o;
        return isNewUser == that.isNewUser &&
                accountLinked == that.accountLinked &&
                Objects.equals(user, that.user) &&
                Objects.equals(oauth2Account, that.oauth2Account);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user, isNewUser, oauth2Account, accountLinked);
    }

    @Override
    public String toString() {
        return "OAuth2AuthenticationResult{" +
                "userId=" + (user != null ? user.getId() : null) +
                ", isNewUser=" + isNewUser +
                ", provider=" + getProvider() +
                ", accountLinked=" + accountLinked +
                ", hasJwtToken=" + (jwtToken != null) +
                '}';
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private OAuth2AuthenticationResult result = new OAuth2AuthenticationResult();

        public Builder user(User user) {
            result.setUser(user);
            return this;
        }

        public Builder isNewUser(boolean isNewUser) {
            result.setNewUser(isNewUser);
            return this;
        }

        public Builder oauth2Account(OAuth2Account oauth2Account) {
            result.setOauth2Account(oauth2Account);
            return this;
        }

        public Builder jwtToken(String jwtToken) {
            result.setJwtToken(jwtToken);
            return this;
        }

        public Builder userProfile(OAuth2UserProfile userProfile) {
            result.setUserProfile(userProfile);
            return this;
        }

        public Builder accountLinked(boolean accountLinked) {
            result.setAccountLinked(accountLinked);
            return this;
        }

        public OAuth2AuthenticationResult build() {
            return result;
        }
    }
}