package com.satori.platform.validation;

import com.satori.platform.domain.Authority;
import com.satori.platform.domain.User;
import com.satori.platform.security.AuthoritiesConstants;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

/**
 * Builder pattern implementation for creating test users.
 * Provides a fluent API for test user creation with sensible defaults.
 */
public class TestUserBuilder {

    private static final String DEFAULT_TEST_PASSWORD = "$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K";
    private static final String DEFAULT_LANG_KEY = "en";
    private static final String TEST_EMAIL_DOMAIN = "@test.com";

    private String login;
    private String password = DEFAULT_TEST_PASSWORD;
    private String firstName = "Test";
    private String lastName = "User";
    private String email;
    private boolean activated = true;
    private String langKey = DEFAULT_LANG_KEY;
    private Instant createdDate = Instant.now();
    private final Set<Authority> authorities = new HashSet<>();

    private TestUserBuilder(String login) {
        this.login = login;
        this.email = login + TEST_EMAIL_DOMAIN;
        // Default to USER authority
        addAuthority(AuthoritiesConstants.USER);
    }

    /**
     * Creates a new TestUserBuilder with the specified login
     */
    public static TestUserBuilder aUser(String login) {
        return new TestUserBuilder(login);
    }

    /**
     * Creates a new admin user builder
     */
    public static TestUserBuilder anAdminUser(String login) {
        return new TestUserBuilder(login)
                .withAuthority(AuthoritiesConstants.ADMIN)
                .withFirstName("Admin")
                .withLastName("User");
    }

    /**
     * Creates a new teacher user builder
     */
    public static TestUserBuilder aTeacherUser(String login) {
        return new TestUserBuilder(login)
                .withFirstName("Teacher")
                .withLastName("User");
    }

    /**
     * Creates a new student user builder
     */
    public static TestUserBuilder aStudentUser(String login) {
        return new TestUserBuilder(login)
                .withFirstName("Student")
                .withLastName("User");
    }

    public TestUserBuilder withPassword(String password) {
        this.password = password;
        return this;
    }

    public TestUserBuilder withFirstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public TestUserBuilder withLastName(String lastName) {
        this.lastName = lastName;
        return this;
    }

    public TestUserBuilder withEmail(String email) {
        this.email = email;
        return this;
    }

    public TestUserBuilder withActivated(boolean activated) {
        this.activated = activated;
        return this;
    }

    public TestUserBuilder withLangKey(String langKey) {
        this.langKey = langKey;
        return this;
    }

    public TestUserBuilder withCreatedDate(Instant createdDate) {
        this.createdDate = createdDate;
        return this;
    }

    public TestUserBuilder withAuthority(String authorityName) {
        addAuthority(authorityName);
        return this;
    }

    public TestUserBuilder withAuthorities(String... authorityNames) {
        for (String authorityName : authorityNames) {
            addAuthority(authorityName);
        }
        return this;
    }

    private void addAuthority(String authorityName) {
        Authority authority = new Authority();
        authority.setName(authorityName);
        this.authorities.add(authority);
    }

    /**
     * Builds the User instance with all configured properties
     */
    public User build() {
        User user = new User();
        user.setLogin(login);
        user.setPassword(password);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setActivated(activated);
        user.setLangKey(langKey);
        user.setCreatedDate(createdDate);
        user.setAuthorities(new HashSet<>(authorities));
        return user;
    }
}