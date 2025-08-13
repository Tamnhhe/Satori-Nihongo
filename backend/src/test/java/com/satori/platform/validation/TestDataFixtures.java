package com.satori.platform.validation;

import com.satori.platform.domain.*;
import com.satori.platform.repository.*;
import com.satori.platform.security.AuthoritiesConstants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import java.util.Map;
import java.util.HashMap;

/**
 * Test data fixtures for comprehensive API validation tests.
 * Provides centralized creation and management of test data.
 */
@Component
@Transactional
public class TestDataFixtures {

    private static final Logger log = LoggerFactory.getLogger(TestDataFixtures.class);

    // Constants for test data
    private static final String DEFAULT_TEST_PASSWORD = "$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K";
    private static final String DEFAULT_LANG_KEY = "en";
    private static final String TEST_EMAIL_DOMAIN = "@satori.com";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    // Cache for created test users to avoid duplicates
    private final Map<String, User> testUsers = new HashMap<>();

    /**
     * Creates all test data needed for comprehensive API validation
     */
    public void createAllTestData() {
        log.debug("Creating test data fixtures");
        createAuthorities();
        createTestUsers();
        log.debug("Test data fixtures created successfully");
    }

    /**
     * Creates authorities if they don't exist
     */
    public void createAuthorities() {
        createAuthorityIfNotExists(AuthoritiesConstants.ADMIN);
        createAuthorityIfNotExists(AuthoritiesConstants.USER);
    }

    /**
     * Creates test users with different roles
     */
    public void createTestUsers() {
        // Create users with different roles
        createTestUser("admin-test", "Admin", "User", AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER);
        createTestUser("teacher-test", "Teacher", "User", AuthoritiesConstants.USER);
        createTestUser("student-test", "Student", "User", AuthoritiesConstants.USER);
    }

    /**
     * Creates a single authority if it doesn't exist
     */
    private void createAuthorityIfNotExists(String authorityName) {
        if (authorityRepository.findById(authorityName).isEmpty()) {
            Authority authority = new Authority();
            authority.setName(authorityName);
            authorityRepository.save(authority);
            log.debug("Created authority: {}", authorityName);
        }
    }

    /**
     * Creates a test user with the specified role
     */
    private User createTestUser(String login, String firstName, String lastName, String... authorities) {
        // Check cache first
        if (testUsers.containsKey(login)) {
            return testUsers.get(login);
        }

        // Check if user already exists in database
        if (userRepository.findOneByLogin(login).isPresent()) {
            User existingUser = userRepository.findOneByLogin(login).get();
            testUsers.put(login, existingUser);
            return existingUser;
        }

        User user = buildTestUser(login, firstName, lastName, authorities);
        User savedUser = userRepository.save(user);
        testUsers.put(login, savedUser);

        log.debug("Created test user: {} with authorities: {}", login, authorities);
        return savedUser;
    }

    /**
     * Builds a test user with the specified properties
     */
    private User buildTestUser(String login, String firstName, String lastName, String... authorities) {
        User user = new User();
        user.setLogin(login);
        user.setPassword(DEFAULT_TEST_PASSWORD);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(login + TEST_EMAIL_DOMAIN);
        user.setActivated(true);
        user.setLangKey(DEFAULT_LANG_KEY);
        user.setCreatedDate(Instant.now());
        user.setAuthorities(buildAuthorities(authorities));
        return user;
    }

    /**
     * Builds authority set for a user
     */
    private Set<Authority> buildAuthorities(String... authorityNames) {
        Set<Authority> userAuthorities = new HashSet<>();
        for (String authorityName : authorityNames) {
            Authority auth = authorityRepository.findById(authorityName).orElse(null);
            if (auth != null) {
                userAuthorities.add(auth);
            }
        }
        return userAuthorities;
    }

    /**
     * Cleans up all test data
     */
    public void cleanupTestData() {
        try {
            testUsers.clear();
            userRepository.deleteAll();
            log.debug("Test data cleanup completed");
        } catch (Exception e) {
            log.error("Error during test data cleanup: {}", e.getMessage(), e);
        }
    }

    // Getters for test data - using cache for better performance
    public User getAdminUser() {
        return testUsers.get("admin-test");
    }

    public User getTeacherUser() {
        return testUsers.get("teacher-test");
    }

    public User getStudentUser() {
        return testUsers.get("student-test");
    }

    /**
     * Gets a test user by login, creating it if it doesn't exist
     */
    public User getTestUser(String login) {
        return testUsers.computeIfAbsent(login, this::findOrCreateUser);
    }

    /**
     * Finds an existing user or creates a default one
     */
    private User findOrCreateUser(String login) {
        return userRepository.findOneByLogin(login)
                .orElseGet(() -> createTestUser(login, "Test", "User", AuthoritiesConstants.USER));
    }
}