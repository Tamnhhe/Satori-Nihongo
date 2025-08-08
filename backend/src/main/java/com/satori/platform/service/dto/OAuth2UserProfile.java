package com.satori.platform.service.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.io.Serializable;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;

/**
 * DTO for standardized OAuth2 user profile data.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class OAuth2UserProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private String displayName;
    private String profilePictureUrl;
    private String locale;
    private Map<String, Object> additionalAttributes = new HashMap<>();

    public OAuth2UserProfile() {
    }

    public OAuth2UserProfile(String id, String email, String firstName, String lastName, String displayName) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.displayName = displayName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getProfilePictureUrl() {
        return profilePictureUrl;
    }

    public void setProfilePictureUrl(String profilePictureUrl) {
        this.profilePictureUrl = profilePictureUrl;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }

    public Map<String, Object> getAdditionalAttributes() {
        return additionalAttributes;
    }

    public void setAdditionalAttributes(Map<String, Object> additionalAttributes) {
        this.additionalAttributes = additionalAttributes;
    }

    public void addAttribute(String key, Object value) {
        this.additionalAttributes.put(key, value);
    }

    public Object getAttribute(String key) {
        return this.additionalAttributes.get(key);
    }

    /**
     * Get full name by combining first and last name.
     */
    public String getFullName() {
        if (firstName != null && lastName != null) {
            return firstName + " " + lastName;
        } else if (displayName != null) {
            return displayName;
        } else if (firstName != null) {
            return firstName;
        } else if (lastName != null) {
            return lastName;
        }
        return null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof OAuth2UserProfile))
            return false;
        OAuth2UserProfile that = (OAuth2UserProfile) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(email, that.email);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, email);
    }

    @Override
    public String toString() {
        return "OAuth2UserProfile{" +
                "id='" + id + '\'' +
                ", email='" + email + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", displayName='" + displayName + '\'' +
                ", profilePictureUrl='" + profilePictureUrl + '\'' +
                ", locale='" + locale + '\'' +
                '}';
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private OAuth2UserProfile profile = new OAuth2UserProfile();

        public Builder id(String id) {
            profile.setId(id);
            return this;
        }

        public Builder email(String email) {
            profile.setEmail(email);
            return this;
        }

        public Builder firstName(String firstName) {
            profile.setFirstName(firstName);
            return this;
        }

        public Builder lastName(String lastName) {
            profile.setLastName(lastName);
            return this;
        }

        public Builder displayName(String displayName) {
            profile.setDisplayName(displayName);
            return this;
        }

        public Builder profilePictureUrl(String profilePictureUrl) {
            profile.setProfilePictureUrl(profilePictureUrl);
            return this;
        }

        public Builder locale(String locale) {
            profile.setLocale(locale);
            return this;
        }

        public Builder additionalAttributes(Map<String, Object> additionalAttributes) {
            profile.setAdditionalAttributes(additionalAttributes);
            return this;
        }

        public Builder addAttribute(String key, Object value) {
            profile.addAttribute(key, value);
            return this;
        }

        public OAuth2UserProfile build() {
            return profile;
        }
    }
}