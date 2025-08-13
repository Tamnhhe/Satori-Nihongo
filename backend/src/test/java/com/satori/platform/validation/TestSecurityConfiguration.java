package com.satori.platform.validation;

import com.satori.platform.domain.Authority;
import com.satori.platform.domain.User;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.security.AuthoritiesConstants;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.test.context.support.WithSecurityContextFactory;
import org.springframework.security.test.context.support.WithSecurityContext;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Arrays;

/**
 * Test security configuration for API validation tests.
 * Provides authentication contexts for different user roles.
 */
@TestConfiguration
public class TestSecurityConfiguration {

    // Constants for test configuration
    private static final String DEFAULT_TEST_PASSWORD = "$2a$10$VEjxo0jq2YG9Rbk2HmX9S.k1uZBGYUHdUcid3g/vfiEl7lwWgOH/K";
    private static final String DEFAULT_LANG_KEY = "en";
    private static final String TEST_EMAIL_DOMAIN = "@test.com";

    @Autowired
    private UserRepository userRepository;

    /**
     * Custom annotation for testing with admin user
     */
    @Retention(RetentionPolicy.RUNTIME)
    @WithSecurityContext(factory = WithMockAdminUserSecurityContextFactory.class)
    public @interface WithMockAdminUser {
        String username() default "admin";

        String[] authorities() default { AuthoritiesConstants.ADMIN, AuthoritiesConstants.USER };
    }

    /**
     * Custom annotation for testing with teacher user
     */
    @Retention(RetentionPolicy.RUNTIME)
    @WithSecurityContext(factory = WithMockTeacherUserSecurityContextFactory.class)
    public @interface WithMockTeacherUser {
        String username() default "teacher";

        String[] authorities() default { AuthoritiesConstants.USER };
    }

    /**
     * Custom annotation for testing with student user
     */
    @Retention(RetentionPolicy.RUNTIME)
    @WithSecurityContext(factory = WithMockStudentUserSecurityContextFactory.class)
    public @interface WithMockStudentUser {
        String username() default "student";

        String[] authorities() default { AuthoritiesConstants.USER };
    }

    /**
     * Generic security context factory that can be reused for all user types
     */
    private static abstract class BaseSecurityContextFactory<T extends java.lang.annotation.Annotation>
            implements WithSecurityContextFactory<T> {
        protected abstract String getUsername(T annotation);

        protected abstract String[] getAuthorities(T annotation);

        @Override
        public SecurityContext createSecurityContext(T annotation) {
            return createSecurityContextForUser(getUsername(annotation), getAuthorities(annotation));
        }
    }

    /**
     * Security context factory for admin users
     */
    public static class WithMockAdminUserSecurityContextFactory
            extends BaseSecurityContextFactory<WithMockAdminUser> {
        @Override
        protected String getUsername(WithMockAdminUser annotation) {
            return annotation.username();
        }

        @Override
        protected String[] getAuthorities(WithMockAdminUser annotation) {
            return annotation.authorities();
        }
    }

    /**
     * Security context factory for teacher users
     */
    public static class WithMockTeacherUserSecurityContextFactory
            extends BaseSecurityContextFactory<WithMockTeacherUser> {
        @Override
        protected String getUsername(WithMockTeacherUser annotation) {
            return annotation.username();
        }

        @Override
        protected String[] getAuthorities(WithMockTeacherUser annotation) {
            return annotation.authorities();
        }
    }

    /**
     * Security context factory for student users
     */
    public static class WithMockStudentUserSecurityContextFactory
            extends BaseSecurityContextFactory<WithMockStudentUser> {
        @Override
        protected String getUsername(WithMockStudentUser annotation) {
            return annotation.username();
        }

        @Override
        protected String[] getAuthorities(WithMockStudentUser annotation) {
            return annotation.authorities();
        }
    }

    /**
     * Creates a security context with the specified username and authorities
     */
    private static SecurityContext createSecurityContextForUser(String username, String[] authorities) {
        SecurityContext context = SecurityContextHolder.createEmptyContext();

        Collection<GrantedAuthority> grantedAuthorities = Arrays.stream(authorities)
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toSet());

        UserDetails principal = org.springframework.security.core.userdetails.User.builder()
                .username(username)
                .password("password")
                .authorities(grantedAuthorities)
                .build();

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                principal,
                principal.getPassword(),
                principal.getAuthorities());

        context.setAuthentication(authentication);
        return context;
    }

    /**
     * Test user details service for validation tests
     */
    @Bean
    @Primary
    public UserDetailsService testUserDetailsService() {
        return new TestUserDetailsService();
    }

    private class TestUserDetailsService implements UserDetailsService {
        @Override
        public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
            User user = findOrCreateTestUser(username);
            return buildUserDetails(user);
        }

        private User findOrCreateTestUser(String username) {
            return userRepository.findOneByLogin(username)
                    .orElseGet(() -> createTestUser(username));
        }

        private UserDetails buildUserDetails(User user) {
            Set<GrantedAuthority> grantedAuthorities = user.getAuthorities().stream()
                    .map(Authority::getName)
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toSet());

            return new org.springframework.security.core.userdetails.User(
                    user.getLogin(),
                    user.getPassword(),
                    grantedAuthorities);
        }

        private User createTestUser(String username) {
            User user = buildBaseTestUser(username);
            user.setAuthorities(determineAuthoritiesForUser(username));
            return user;
        }

        private User buildBaseTestUser(String username) {
            User user = new User();
            user.setLogin(username);
            user.setPassword(DEFAULT_TEST_PASSWORD);
            user.setFirstName("Test");
            user.setLastName("User");
            user.setEmail(username + TEST_EMAIL_DOMAIN);
            user.setActivated(true);
            user.setLangKey(DEFAULT_LANG_KEY);
            return user;
        }

        private Set<Authority> determineAuthoritiesForUser(String username) {
            Set<Authority> authorities = new HashSet<>();

            // All users get USER authority
            Authority userAuthority = new Authority();
            userAuthority.setName(AuthoritiesConstants.USER);
            authorities.add(userAuthority);

            // Admin users get additional ADMIN authority
            if ("admin".equals(username)) {
                Authority adminAuthority = new Authority();
                adminAuthority.setName(AuthoritiesConstants.ADMIN);
                authorities.add(adminAuthority);
            }

            return authorities;
        }
    }
}