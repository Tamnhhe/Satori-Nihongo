package com.satori.platform.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    // Platform-specific roles
    public static final String TEACHER = "ROLE_TEACHER";
    public static final String STUDENT = "ROLE_STUDENT";

    // Feature-specific permissions
    public static final String MANAGE_COURSES = "MANAGE_COURSES";
    public static final String MANAGE_QUIZZES = "MANAGE_QUIZZES";
    public static final String MANAGE_NOTIFICATIONS = "MANAGE_NOTIFICATIONS";
    public static final String MANAGE_GIFT_CODES = "MANAGE_GIFT_CODES";
    public static final String MANAGE_FILES = "MANAGE_FILES";
    public static final String VIEW_ANALYTICS = "VIEW_ANALYTICS";
    public static final String GENERATE_AI_TESTS = "GENERATE_AI_TESTS";

    private AuthoritiesConstants() {}
}
