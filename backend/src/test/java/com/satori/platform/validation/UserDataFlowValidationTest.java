package com.satori.platform.validation;

import com.satori.platform.OnlineSatoriPlatformApp;
import com.satori.platform.domain.User;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.TeacherProfile;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.repository.StudentProfileRepository;
import com.satori.platform.repository.TeacherProfileRepository;
import com.satori.platform.service.UserService;
import com.satori.platform.service.EnhancedUserService;
import com.satori.platform.service.dto.AdminUserDTO;
import com.satori.platform.service.dto.UserProfileDTO;
import com.satori.platform.service.dto.StudentProfileDTO;
import com.satori.platform.service.dto.TeacherProfileDTO;
import com.satori.platform.web.rest.EnhancedUserResource;
import com.satori.platform.web.rest.UserResource;
import com.satori.platform.web.rest.PublicUserResource;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.ZoneId;
import java.util.Optional;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Comprehensive data flow validation test for user management system.
 * Tests complete data flow from database through all layers to API endpoints.
 * 
 * Requirements: 6.1, 6.2, 6.5
 */
@SpringBootTest(classes = OnlineSatoriPlatformApp.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Transactional
public class UserDataFlowValidationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private TeacherProfileRepository teacherProfileRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EnhancedUserService enhancedUserService;

    private String baseUrl;
    private HttpHeaders headers;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api";
        headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
    }

    @Test
    @DisplayName("Test complete user data flow with authentication fields")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testCompleteUserDataFlowWithAuthenticationFields() {
        // Step 1: Create user at database layer with authentication fields
        User user = createTestUserWithAuthFields();
        User savedUser = userRepository.save(user);

        // Verify database persistence with new authentication fields
        Optional<User> dbUser = userRepository.findById(savedUser.getId());
        assertThat(dbUser).isPresent();
        assertThat(dbUser.get().getLastLoginDate()).isEqualTo(user.getLastLoginDate());
        assertThat(dbUser.get().getFailedLoginAttempts()).isEqualTo(user.getFailedLoginAttempts());
        assertThat(dbUser.get().getAccountLockedUntil()).isEqualTo(user.getAccountLockedUntil());
        assertThat(dbUser.get().getProfileCompleted()).isEqualTo(user.getProfileCompleted());
        assertThat(dbUser.get().getTimezone()).isEqualTo(user.getTimezone());
        assertThat(dbUser.get().getOauth2Registration()).isEqualTo(user.getOauth2Registration());
        assertThat(dbUser.get().getProfilePictureUrl()).isEqualTo(user.getProfilePictureUrl());
        assertThat(dbUser.get().getExternalProfileSyncedAt()).isEqualTo(user.getExternalProfileSyncedAt());

        // Step 2: Test service layer data transformation
        AdminUserDTO userDTO = userService.getUserWithAuthorities(savedUser.getId())
                .map(AdminUserDTO::new)
                .orElse(null);

        assertThat(userDTO).isNotNull();
        assertThat(userDTO.getLogin()).isEqualTo(savedUser.getLogin());
        assertThat(userDTO.getEmail()).isEqualTo(savedUser.getEmail());

        // Step 3: Test enhanced service layer with new fields
        Optional<User> enhancedUser = enhancedUserService.findUserWithAuthenticationDetails(savedUser.getId());
        assertThat(enhancedUser).isPresent();
        assertThat(enhancedUser.get().getLastLoginDate()).isEqualTo(savedUser.getLastLoginDate());
        assertThat(enhancedUser.get().getFailedLoginAttempts()).isEqualTo(savedUser.getFailedLoginAttempts());

        // Step 4: Test API layer data consistency
        ResponseEntity<AdminUserDTO> apiResponse = restTemplate.exchange(
                baseUrl + "/admin/users/" + savedUser.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                AdminUserDTO.class);

        assertThat(apiResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        AdminUserDTO apiUser = apiResponse.getBody();
        assertThat(apiUser).isNotNull();
        assertThat(apiUser.getId()).isEqualTo(savedUser.getId());
        assertThat(apiUser.getLogin()).isEqualTo(savedUser.getLogin());
        assertThat(apiUser.getEmail()).isEqualTo(savedUser.getEmail());
    }

    @Test
    @DisplayName("Test profile completion and OAuth2 data consistency")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testProfileCompletionAndOAuth2DataConsistency() {
        // Step 1: Create user with OAuth2 data
        User user = createTestUserWithOAuth2Data();
        User savedUser = userRepository.save(user);

        // Step 2: Create user profile
        UserProfile userProfile = createTestUserProfile(savedUser);
        UserProfile savedProfile = userProfileRepository.save(userProfile);

        // Step 3: Verify OAuth2 data consistency across layers
        Optional<User> dbUser = userRepository.findById(savedUser.getId());
        assertThat(dbUser).isPresent();
        assertThat(dbUser.get().getOauth2Registration()).isEqualTo("google");
        assertThat(dbUser.get().getProfilePictureUrl()).contains("googleusercontent.com");
        assertThat(dbUser.get().getExternalProfileSyncedAt()).isNotNull();

        // Step 4: Test service layer OAuth2 handling
        Optional<User> serviceUser = enhancedUserService.findUserWithOAuth2Details(savedUser.getId());
        assertThat(serviceUser).isPresent();
        assertThat(serviceUser.get().getOauth2Registration()).isEqualTo(savedUser.getOauth2Registration());

        // Step 5: Test profile completion status
        boolean isProfileComplete = enhancedUserService.isProfileComplete(savedUser.getId());
        assertThat(isProfileComplete).isEqualTo(savedUser.getProfileCompleted());

        // Step 6: Test API consistency
        ResponseEntity<UserProfileDTO> profileResponse = restTemplate.exchange(
                baseUrl + "/user-profiles/" + savedProfile.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                UserProfileDTO.class);

        assertThat(profileResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        UserProfileDTO apiProfile = profileResponse.getBody();
        assertThat(apiProfile).isNotNull();
        assertThat(apiProfile.getUserId()).isEqualTo(savedUser.getId());
    }

    @Test
    @DisplayName("Test user session tracking and audit logging")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testUserSessionTrackingAndAuditLogging() {
        // Step 1: Create user with session tracking data
        User user = createTestUserWithSessionData();
        User savedUser = userRepository.save(user);

        // Step 2: Simulate login attempt and track session
        Instant loginTime = Instant.now();
        enhancedUserService.recordLoginAttempt(savedUser.getId(), true, loginTime);

        // Step 3: Verify session data persistence
        Optional<User> updatedUser = userRepository.findById(savedUser.getId());
        assertThat(updatedUser).isPresent();
        assertThat(updatedUser.get().getLastLoginDate()).isAfter(savedUser.getLastLoginDate());
        assertThat(updatedUser.get().getFailedLoginAttempts()).isEqualTo(0); // Reset on successful login

        // Step 4: Test failed login tracking
        enhancedUserService.recordLoginAttempt(savedUser.getId(), false, Instant.now());

        Optional<User> failedLoginUser = userRepository.findById(savedUser.getId());
        assertThat(failedLoginUser).isPresent();
        assertThat(failedLoginUser.get().getFailedLoginAttempts()).isEqualTo(1);

        // Step 5: Test account locking mechanism
        for (int i = 0; i < 4; i++) {
            enhancedUserService.recordLoginAttempt(savedUser.getId(), false, Instant.now());
        }

        Optional<User> lockedUser = userRepository.findById(savedUser.getId());
        assertThat(lockedUser).isPresent();
        assertThat(lockedUser.get().getFailedLoginAttempts()).isEqualTo(5);
        assertThat(lockedUser.get().getAccountLockedUntil()).isNotNull();

        // Step 6: Test API audit logging
        ResponseEntity<String> auditResponse = restTemplate.exchange(
                baseUrl + "/admin/audit-logs?userId=" + savedUser.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                String.class);

        assertThat(auditResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

    @Test
    @DisplayName("Test student profile data flow consistency")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testStudentProfileDataFlowConsistency() {
        // Step 1: Create complete student profile chain
        User user = createTestUserWithAuthFields();
        User savedUser = userRepository.save(user);

        UserProfile userProfile = createTestUserProfile(savedUser);
        UserProfile savedProfile = userProfileRepository.save(userProfile);

        StudentProfile studentProfile = createTestStudentProfile(savedProfile);
        StudentProfile savedStudent = studentProfileRepository.save(studentProfile);

        // Step 2: Verify data consistency across all layers
        Optional<StudentProfile> dbStudent = studentProfileRepository.findById(savedStudent.getId());
        assertThat(dbStudent).isPresent();
        assertThat(dbStudent.get().getUserProfile().getUser().getId()).isEqualTo(savedUser.getId());

        // Step 3: Test service layer data flow
        Optional<StudentProfileDTO> serviceStudent = enhancedUserService.getStudentProfile(savedStudent.getId());
        assertThat(serviceStudent).isPresent();
        assertThat(serviceStudent.get().getUserProfileId()).isEqualTo(savedProfile.getId());

        // Step 4: Test API data consistency
        ResponseEntity<StudentProfileDTO> apiResponse = restTemplate.exchange(
                baseUrl + "/student-profiles/" + savedStudent.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                StudentProfileDTO.class);

        assertThat(apiResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        StudentProfileDTO apiStudent = apiResponse.getBody();
        assertThat(apiStudent).isNotNull();
        assertThat(apiStudent.getId()).isEqualTo(savedStudent.getId());
        assertThat(apiStudent.getUserProfileId()).isEqualTo(savedProfile.getId());
    }

    @Test
    @DisplayName("Test teacher profile data flow consistency")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testTeacherProfileDataFlowConsistency() {
        // Step 1: Create complete teacher profile chain
        User user = createTestUserWithAuthFields();
        user.setAuthorities(Set.of()); // Will be set by service
        User savedUser = userRepository.save(user);

        UserProfile userProfile = createTestUserProfile(savedUser);
        UserProfile savedProfile = userProfileRepository.save(userProfile);

        TeacherProfile teacherProfile = createTestTeacherProfile(savedProfile);
        TeacherProfile savedTeacher = teacherProfileRepository.save(teacherProfile);

        // Step 2: Verify data consistency across all layers
        Optional<TeacherProfile> dbTeacher = teacherProfileRepository.findById(savedTeacher.getId());
        assertThat(dbTeacher).isPresent();
        assertThat(dbTeacher.get().getUserProfile().getUser().getId()).isEqualTo(savedUser.getId());

        // Step 3: Test service layer data flow
        Optional<TeacherProfileDTO> serviceTeacher = enhancedUserService.getTeacherProfile(savedTeacher.getId());
        assertThat(serviceTeacher).isPresent();
        assertThat(serviceTeacher.get().getUserProfileId()).isEqualTo(savedProfile.getId());

        // Step 4: Test API data consistency
        ResponseEntity<TeacherProfileDTO> apiResponse = restTemplate.exchange(
                baseUrl + "/teacher-profiles/" + savedTeacher.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                TeacherProfileDTO.class);

        assertThat(apiResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        TeacherProfileDTO apiTeacher = apiResponse.getBody();
        assertThat(apiTeacher).isNotNull();
        assertThat(apiTeacher.getId()).isEqualTo(savedTeacher.getId());
        assertThat(apiTeacher.getUserProfileId()).isEqualTo(savedProfile.getId());
    }

    // Helper methods for creating test data
    private User createTestUserWithAuthFields() {
        User user = new User();
        user.setLogin("testuser" + System.currentTimeMillis());
        user.setEmail("test" + System.currentTimeMillis() + "@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setActivated(true);
        user.setLangKey("en");
        user.setLastLoginDate(Instant.now().minusSeconds(3600));
        user.setFailedLoginAttempts(0);
        user.setAccountLockedUntil(null);
        user.setProfileCompleted(true);
        user.setTimezone("UTC");
        user.setOauth2Registration(null);
        user.setProfilePictureUrl(null);
        user.setExternalProfileSyncedAt(null);
        return user;
    }

    private User createTestUserWithOAuth2Data() {
        User user = createTestUserWithAuthFields();
        user.setOauth2Registration("google");
        user.setProfilePictureUrl("https://lh3.googleusercontent.com/test-image");
        user.setExternalProfileSyncedAt(Instant.now());
        return user;
    }

    private User createTestUserWithSessionData() {
        User user = createTestUserWithAuthFields();
        user.setLastLoginDate(Instant.now().minusSeconds(7200));
        user.setFailedLoginAttempts(2);
        return user;
    }

    private UserProfile createTestUserProfile(User user) {
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setPhoneNumber("123-456-7890");
        profile.setDateOfBirth(Instant.now().minusSeconds(86400 * 365 * 25)); // 25 years ago
        profile.setAddress("123 Test Street");
        profile.setCity("Test City");
        profile.setCountry("Test Country");
        profile.setBio("Test bio");
        return profile;
    }

    private StudentProfile createTestStudentProfile(UserProfile userProfile) {
        StudentProfile student = new StudentProfile();
        student.setUserProfile(userProfile);
        student.setStudentId("STU" + System.currentTimeMillis());
        student.setEnrollmentDate(Instant.now());
        student.setGradeLevel("Beginner");
        student.setLearningGoals("Learn Japanese");
        return student;
    }

    private TeacherProfile createTestTeacherProfile(UserProfile userProfile) {
        TeacherProfile teacher = new TeacherProfile();
        teacher.setUserProfile(userProfile);
        teacher.setEmployeeId("EMP" + System.currentTimeMillis());
        teacher.setHireDate(Instant.now().minusSeconds(86400 * 30)); // 30 days ago
        teacher.setDepartment("Japanese Language");
        teacher.setSpecialization("Grammar and Conversation");
        teacher.setQualifications("JLPT N1, Teaching Certificate");
        return teacher;
    }
}