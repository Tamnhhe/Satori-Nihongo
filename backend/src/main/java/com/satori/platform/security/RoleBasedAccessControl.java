package com.satori.platform.security;

import org.springframework.security.access.prepost.PreAuthorize;
import java.lang.annotation.*;

/**
 * Custom annotations for role-based access control.
 */
public class RoleBasedAccessControl {

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasRole('ADMIN')")
    public @interface AdminOnly {
    }

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public @interface TeacherOrAdmin {
    }

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('ADMIN')")
    public @interface AuthenticatedUser {
    }

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAuthority('MANAGE_COURSES') or hasRole('ADMIN')")
    public @interface CanManageCourses {
    }

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAuthority('MANAGE_QUIZZES') or hasRole('TEACHER') or hasRole('ADMIN')")
    public @interface CanManageQuizzes {
    }

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAuthority('MANAGE_NOTIFICATIONS') or hasRole('ADMIN')")
    public @interface CanManageNotifications {
    }

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAuthority('MANAGE_GIFT_CODES') or hasRole('TEACHER') or hasRole('ADMIN')")
    public @interface CanManageGiftCodes {
    }

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAuthority('MANAGE_FILES') or hasRole('TEACHER') or hasRole('ADMIN')")
    public @interface CanManageFiles {
    }

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAuthority('VIEW_ANALYTICS') or hasRole('TEACHER') or hasRole('ADMIN')")
    public @interface CanViewAnalytics {
    }

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("hasAuthority('GENERATE_AI_TESTS') or hasRole('TEACHER') or hasRole('ADMIN')")
    public @interface CanGenerateAITests {
    }

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("@securityService.canAccessCourse(#courseId, authentication)")
    public @interface CanAccessCourse {
    }

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("@securityService.canAccessQuiz(#quizId, authentication)")
    public @interface CanAccessQuiz {
    }

    @Target({ ElementType.METHOD, ElementType.TYPE })
    @Retention(RetentionPolicy.RUNTIME)
    @PreAuthorize("@securityService.isOwnerOrAdmin(#userId, authentication)")
    public @interface OwnerOrAdmin {
    }
}