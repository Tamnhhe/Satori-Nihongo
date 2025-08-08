package com.satori.platform.security;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.Quiz;
import com.satori.platform.domain.User;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.QuizRepository;
import com.satori.platform.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;

/**
 * Service for security-related operations and access control.
 */
@Service
public class SecurityService {

    private final CourseRepository courseRepository;
    private final QuizRepository quizRepository;
    private final UserRepository userRepository;

    public SecurityService(CourseRepository courseRepository,
            QuizRepository quizRepository,
            UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.quizRepository = quizRepository;
        this.userRepository = userRepository;
    }

    /**
     * Checks if the current user can access a specific course.
     */
    public boolean canAccessCourse(Long courseId, Authentication authentication) {
        if (authentication == null || courseId == null) {
            return false;
        }

        // Admin can access all courses
        if (hasRole(authentication, AuthoritiesConstants.ADMIN)) {
            return true;
        }

        String username = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(username);

        if (user.isEmpty()) {
            return false;
        }

        Optional<Course> course = courseRepository.findById(courseId);
        if (course.isEmpty()) {
            return false;
        }

        // Teachers can access courses they teach
        if (hasRole(authentication, AuthoritiesConstants.TEACHER)) {
            // Check if user is assigned as teacher to this course
            // This would need to be implemented based on your course-teacher relationship
            return true; // Simplified for now
        }

        // Students can access courses they're enrolled in
        if (hasRole(authentication, AuthoritiesConstants.STUDENT)) {
            // Check if user is enrolled in this course
            // This would need to be implemented based on your enrollment relationship
            return true; // Simplified for now
        }

        return false;
    }

    /**
     * Checks if the current user can access a specific quiz.
     */
    public boolean canAccessQuiz(Long quizId, Authentication authentication) {
        if (authentication == null || quizId == null) {
            return false;
        }

        // Admin can access all quizzes
        if (hasRole(authentication, AuthoritiesConstants.ADMIN)) {
            return true;
        }

        Optional<Quiz> quiz = quizRepository.findById(quizId);
        if (quiz.isEmpty()) {
            return false;
        }

        // Check course access for the quiz's courses
        Set<Course> courses = quiz.get().getCourses();
        if (courses.isEmpty()) {
            return false;
        }
        // Check if user can access any of the courses this quiz belongs to
        return courses.stream().anyMatch(course -> canAccessCourse(course.getId(), authentication));
    }

    /**
     * Checks if the current user is the owner of a resource or an admin.
     */
    public boolean isOwnerOrAdmin(Long userId, Authentication authentication) {
        if (authentication == null || userId == null) {
            return false;
        }

        // Admin can access all resources
        if (hasRole(authentication, AuthoritiesConstants.ADMIN)) {
            return true;
        }

        String username = authentication.getName();
        Optional<User> user = userRepository.findOneByLogin(username);

        return user.isPresent() && user.get().getId().equals(userId);
    }

    /**
     * Checks if the authentication has a specific role.
     */
    private boolean hasRole(Authentication authentication, String role) {
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority(role));
    }

    /**
     * Checks if the authentication has a specific authority.
     */
    public boolean hasAuthority(Authentication authentication, String authority) {
        return authentication.getAuthorities().contains(new SimpleGrantedAuthority(authority));
    }

    /**
     * Gets the current user from authentication.
     */
    public Optional<User> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return Optional.empty();
        }

        String username = authentication.getName();
        return userRepository.findOneByLogin(username);
    }
}