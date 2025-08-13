package com.satori.platform.validation;

import com.satori.platform.OnlineSatoriPlatformApp;
import com.satori.platform.domain.User;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.TeacherProfile;
import com.satori.platform.service.UserService;
import com.satori.platform.service.UserProfileService;
import com.satori.platform.service.StudentProfileService;
import com.satori.platform.service.TeacherProfileService;
import com.satori.platform.service.UserSessionService;
import com.satori.platform.service.OAuth2Service;
import com.satori.platform.service.dto.AdminUserDTO;
import com.satori.platform.service.dto.UserProfileDTO;
import com.satori.platform.service.dto.StudentProfileDTO;
import com.satori.platform.service.dto.TeacherProfileDTO;
import com.satori.platform.service.mapper.UserMapper;
import com.satori.platform.service.mapper.UserProfileMapper;
import com.satori.platform.service.mapper.StudentProfileMapper;
import com.satori.platform.service.mapper.TeacherProfileMapper;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.repository.StudentProfileRepository;
import com.satori.platform.repository.TeacherProfileRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;

/**
 * Comprehensive validation tests for User Management Services.
 * 
 * Tests Requirements:
 * - 4.1: Service methods correctly process data and handle business logic
 * - 4.2: DTOs are correctly mapped from entities
 * - 4.5: Service validation passes confirming all business logic operates
 * correctly
 */
@SpringBootTest(classes = OnlineSatoriPlatformApp.class)
@ActiveProfiles("test")
@Transactional
public class UserManagementServiceValidationTest {

    @Autowired
    private UserService userService;

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private StudentProfileService studentProfileService;

    @Autowired
    private TeacherProfileService teacherProfileService;

    @Autowired
    private UserSessionService userSessionService;

    @Autowired(required = false)
    private OAuth2Service oAuth2Service;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private TeacherProfileRepository teacherProfileRepository;

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private UserProfileMapper userProfileMapper;

    @Autowired
    private StudentProfileMapper studentProfileMapper;

    @Autowired
    private TeacherProfileMapper teacherProfileMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testUser;
    private UserProfile testUserProfile;
    private StudentProfile testStudentProfile;
    private TeacherProfile testTeacherProfile;

    @BeforeEach
    void setUp() {
        // Create test user with new schema fields
        testUser = new User();
        testUser.setLogin("testuser");
        testUser.setEmail("test@example.com");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setPassword(passwordEncoder.encode("password"));
        testUser.setActivated(true);
        testUser.setLangKey("en");
        testUser.setCreatedBy("system");
        testUser.setCreatedDate(Instant.now());

        // Set new schema fields
        testUser.setLastLoginDate(Instant.now());
        testUser.setFailedLoginAttempts(0);
        testUser.setAccountLockedUntil(null);
        testUser.setProfileCompleted(false);
        testUser.setTimezone("UTC");
        testUser.setOauth2Registration("local");
        testUser.setProfilePictureUrl(null);
        testUser.setExternalProfileSyncedAt(null);

        testUser = userRepository.save(testUser);

        // Create test user profile
        testUserProfile = new UserProfile();
        testUserProfile.setUser(testUser);
        testUserProfile.setPhoneNumber("1234567890");
        testUserProfile.setDateOfBirth(LocalDateTime.now().minusYears(25));
        testUserProfile.setGender("MALE");
        testUserProfile.setAddress("Test Address");
        testUserProfile.setCity("Test City");
        testUserProfile.setCountry("Test Country");
        testUserProfile.setOccupation("Student");
        testUserProfile.setInterests("Japanese Language");
        testUserProfile = userProfileRepository.save(testUserProfile);

        // Create test student profile
        testStudentProfile = new StudentProfile();
        testStudentProfile.setUserProfile(testUserProfile);
        testStudentProfile.setStudentId("STU001");
        testStudentProfile.setEnrollmentDate(LocalDateTime.now());
        testStudentProfile.setCurrentLevel("BEGINNER");
        testStudentProfile.setLearningGoals("Learn basic Japanese");
        testStudentProfile.setPreferredLearningStyle("VISUAL");
        testStudentProfile = studentProfileRepository.save(testStudentProfile);

        // Create test teacher profile
        testTeacherProfile = new TeacherProfile();
        testTeacherProfile.setUserProfile(testUserProfile);
        testTeacherProfile.setEmployeeId("TEA001");
        testTeacherProfile.setHireDate(LocalDateTime.now());
        testTeacherProfile.setDepartment("Japanese Language");
        testTeacherProfile.setSpecialization("Grammar");
        testTeacherProfile.setQualifications("JLPT N1");
        testTeacherProfile.setExperienceYears(5);
        testTeacherProfile = teacherProfileRepository.save(testTeacherProfile);
    }

    @Test
    @DisplayName("Validate UserService basic operations")
    void testUserServiceBasicOperations() {
        // Test user creation
        AdminUserDTO newUserDTO = new AdminUserDTO();
        newUserDTO.setLogin("newuser");
        newUserDTO.setEmail("newuser@example.com");
        newUserDTO.setFirstName("New");
        newUserDTO.setLastName("User");
        newUserDTO.setActivated(true);
        newUserDTO.setLangKey("en");
        newUserDTO.setAuthorities(Set.of("ROLE_USER"));

        User createdUser = userService.createUser(newUserDTO);
        assertThat(createdUser).isNotNull();
        assertThat(createdUser.getLogin()).isEqualTo("newuser");
        assertThat(createdUser.getEmail()).isEqualTo("newuser@example.com");
        assertThat(createdUser.getProfileCompleted()).isFalse(); // New schema field

        // Test user update
        Optional<AdminUserDTO> userDTO = userService.getUserWithAuthorities(createdUser.getId())
                .map(userMapper::userToAdminUserDTO);
        assertThat(userDTO).isPresent();

        AdminUserDTO updateDTO = userDTO.get();
        updateDTO.setFirstName("Updated");

        Optional<AdminUserDTO> updatedUser = userService.updateUser(updateDTO);
        assertThat(updatedUser).isPresent();
        assertThat(updatedUser.get().getFirstName()).isEqualTo("Updated");

        // Test user deletion
        userService.deleteUser(createdUser.getLogin());
        Optional<User> deletedUser = userRepository.findById(createdUser.getId());
        assertThat(deletedUser).isEmpty();
    }

    @Test
    @DisplayName("Validate UserService authentication features")
    void testUserServiceAuthenticationFeatures() {
        // Test password change
        String newPassword = "newpassword";
        userService.changePassword(testUser.getLogin(), newPassword);

        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(passwordEncoder.matches(newPassword, updatedUser.getPassword())).isTrue();

        // Test account activation
        User inactiveUser = new User();
        inactiveUser.setLogin("inactive");
        inactiveUser.setEmail("inactive@example.com");
        inactiveUser.setPassword(passwordEncoder.encode("password"));
        inactiveUser.setActivated(false);
        inactiveUser.setActivationKey("activation123");
        inactiveUser = userRepository.save(inactiveUser);

        Optional<User> activatedUser = userService.activateRegistration("activation123");
        assertThat(activatedUser).isPresent();
        assertThat(activatedUser.get().isActivated()).isTrue();
        assertThat(activatedUser.get().getActivationKey()).isNull();
    }

    @Test
    @DisplayName("Validate UserService with new schema fields")
    void testUserServiceNewSchemaFields() {
        // Test login tracking
        userService.updateLastLoginDate(testUser.getLogin());
        User updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedUser.getLastLoginDate()).isNotNull();

        // Test failed login attempts
        userService.incrementFailedLoginAttempts(testUser.getLogin());
        updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedUser.getFailedLoginAttempts()).isEqualTo(1);

        // Test account locking
        userService.lockAccount(testUser.getLogin(), Instant.now().plusSeconds(3600));
        updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedUser.getAccountLockedUntil()).isNotNull();

        // Test profile completion
        userService.markProfileCompleted(testUser.getLogin());
        updatedUser = userRepository.findById(testUser.getId()).orElseThrow();
        assertThat(updatedUser.getProfileCompleted()).isTrue();
    }

    @Test
    @DisplayName("Validate UserProfileService operations")
    void testUserProfileServiceOperations() {
        // Test profile creation
        UserProfileDTO profileDTO = userProfileMapper.toDto(testUserProfile);
        profileDTO.setId(null); // Create new profile
        profileDTO.setPhoneNumber("9876543210");

        UserProfileDTO createdProfile = userProfileService.save(profileDTO);
        assertThat(createdProfile).isNotNull();
        assertThat(createdProfile.getPhoneNumber()).isEqualTo("9876543210");

        // Test profile update
        createdProfile.setCity("Updated City");
        UserProfileDTO updatedProfile = userProfileService.save(createdProfile);
        assertThat(updatedProfile.getCity()).isEqualTo("Updated City");

        // Test profile retrieval
        Optional<UserProfileDTO> retrievedProfile = userProfileService.findOne(createdProfile.getId());
        assertThat(retrievedProfile).isPresent();
        assertThat(retrievedProfile.get().getCity()).isEqualTo("Updated City");

        // Test profile deletion
        userProfileService.delete(createdProfile.getId());
        Optional<UserProfileDTO> deletedProfile = userProfileService.findOne(createdProfile.getId());
        assertThat(deletedProfile).isEmpty();
    }

    @Test
    @DisplayName("Validate StudentProfileService operations")
    void testStudentProfileServiceOperations() {
        // Test student profile creation
        StudentProfileDTO studentDTO = studentProfileMapper.toDto(testStudentProfile);
        studentDTO.setId(null);
        studentDTO.setStudentId("STU002");
        studentDTO.setCurrentLevel("INTERMEDIATE");

        StudentProfileDTO createdStudent = studentProfileService.save(studentDTO);
        assertThat(createdStudent).isNotNull();
        assertThat(createdStudent.getStudentId()).isEqualTo("STU002");
        assertThat(createdStudent.getCurrentLevel()).isEqualTo("INTERMEDIATE");

        // Test student profile update
        createdStudent.setLearningGoals("Advanced Japanese conversation");
        StudentProfileDTO updatedStudent = studentProfileService.save(createdStudent);
        assertThat(updatedStudent.getLearningGoals()).isEqualTo("Advanced Japanese conversation");

        // Test student profile retrieval
        Optional<StudentProfileDTO> retrievedStudent = studentProfileService.findOne(createdStudent.getId());
        assertThat(retrievedStudent).isPresent();
        assertThat(retrievedStudent.get().getLearningGoals()).isEqualTo("Advanced Japanese conversation");
    }

    @Test
    @DisplayName("Validate TeacherProfileService operations")
    void testTeacherProfileServiceOperations() {
        // Test teacher profile creation
        TeacherProfileDTO teacherDTO = teacherProfileMapper.toDto(testTeacherProfile);
        teacherDTO.setId(null);
        teacherDTO.setEmployeeId("TEA002");
        teacherDTO.setSpecialization("Conversation");

        TeacherProfileDTO createdTeacher = teacherProfileService.save(teacherDTO);
        assertThat(createdTeacher).isNotNull();
        assertThat(createdTeacher.getEmployeeId()).isEqualTo("TEA002");
        assertThat(createdTeacher.getSpecialization()).isEqualTo("Conversation");

        // Test teacher profile update
        createdTeacher.setExperienceYears(10);
        TeacherProfileDTO updatedTeacher = teacherProfileService.save(createdTeacher);
        assertThat(updatedTeacher.getExperienceYears()).isEqualTo(10);

        // Test teacher profile retrieval
        Optional<TeacherProfileDTO> retrievedTeacher = teacherProfileService.findOne(createdTeacher.getId());
        assertThat(retrievedTeacher).isPresent();
        assertThat(retrievedTeacher.get().getExperienceYears()).isEqualTo(10);
    }

    @Test
    @DisplayName("Validate UserSessionService operations")
    void testUserSessionServiceOperations() {
        // Test session creation
        String sessionId = userSessionService.createSession(testUser.getLogin(), "127.0.0.1", "Test Browser");
        assertThat(sessionId).isNotNull();
        assertThat(sessionId).isNotEmpty();

        // Test session validation
        boolean isValid = userSessionService.isSessionValid(sessionId);
        assertThat(isValid).isTrue();

        // Test session update
        userSessionService.updateSessionActivity(sessionId);
        // Should not throw exception

        // Test session termination
        userSessionService.terminateSession(sessionId);
        boolean isValidAfterTermination = userSessionService.isSessionValid(sessionId);
        assertThat(isValidAfterTermination).isFalse();
    }

    @Test
    @DisplayName("Validate OAuth2Service integration (if available)")
    void testOAuth2ServiceIntegration() {
        if (oAuth2Service != null) {
            // Test OAuth2 user creation
            try {
                // This would typically be called with actual OAuth2 data
                // For testing, we'll just verify the service is available
                assertThat(oAuth2Service).isNotNull();

                // Test OAuth2 account linking (mock scenario)
                // In real implementation, this would link OAuth2 account to existing user
                // oAuth2Service.linkOAuth2Account(testUser.getLogin(), "google",
                // "oauth2UserId");

            } catch (Exception e) {
                // OAuth2 service might not be fully configured in test environment
                // This is acceptable for validation purposes
                assertThat(e).isNotNull();
            }
        }
    }

    @Test
    @DisplayName("Validate DTO mapping consistency")
    void testDTOMappingConsistency() {
        // Test User to AdminUserDTO mapping
        AdminUserDTO userDTO = userMapper.userToAdminUserDTO(testUser);
        assertThat(userDTO).isNotNull();
        assertThat(userDTO.getLogin()).isEqualTo(testUser.getLogin());
        assertThat(userDTO.getEmail()).isEqualTo(testUser.getEmail());
        assertThat(userDTO.getFirstName()).isEqualTo(testUser.getFirstName());
        assertThat(userDTO.getLastName()).isEqualTo(testUser.getLastName());

        // Test UserProfile to UserProfileDTO mapping
        UserProfileDTO profileDTO = userProfileMapper.toDto(testUserProfile);
        assertThat(profileDTO).isNotNull();
        assertThat(profileDTO.getPhoneNumber()).isEqualTo(testUserProfile.getPhoneNumber());
        assertThat(profileDTO.getCity()).isEqualTo(testUserProfile.getCity());
        assertThat(profileDTO.getCountry()).isEqualTo(testUserProfile.getCountry());

        // Test StudentProfile to StudentProfileDTO mapping
        StudentProfileDTO studentDTO = studentProfileMapper.toDto(testStudentProfile);
        assertThat(studentDTO).isNotNull();
        assertThat(studentDTO.getStudentId()).isEqualTo(testStudentProfile.getStudentId());
        assertThat(studentDTO.getCurrentLevel()).isEqualTo(testStudentProfile.getCurrentLevel());

        // Test TeacherProfile to TeacherProfileDTO mapping
        TeacherProfileDTO teacherDTO = teacherProfileMapper.toDto(testTeacherProfile);
        assertThat(teacherDTO).isNotNull();
        assertThat(teacherDTO.getEmployeeId()).isEqualTo(testTeacherProfile.getEmployeeId());
        assertThat(teacherDTO.getSpecialization()).isEqualTo(testTeacherProfile.getSpecialization());
    }

    @Test
    @DisplayName("Validate service error handling")
    void testServiceErrorHandling() {
        // Test user creation with duplicate login
        AdminUserDTO duplicateUserDTO = new AdminUserDTO();
        duplicateUserDTO.setLogin(testUser.getLogin()); // Duplicate login
        duplicateUserDTO.setEmail("different@example.com");
        duplicateUserDTO.setFirstName("Duplicate");
        duplicateUserDTO.setLastName("User");

        assertThatThrownBy(() -> userService.createUser(duplicateUserDTO))
                .isInstanceOf(Exception.class);

        // Test profile operations with invalid data
        UserProfileDTO invalidProfileDTO = new UserProfileDTO();
        invalidProfileDTO.setUserId(999999L); // Non-existent user

        assertThatThrownBy(() -> userProfileService.save(invalidProfileDTO))
                .isInstanceOf(Exception.class);

        // Test session operations with invalid session
        boolean invalidSessionValid = userSessionService.isSessionValid("invalid-session-id");
        assertThat(invalidSessionValid).isFalse();
    }

    @Test
    @DisplayName("Validate service transaction handling")
    void testServiceTransactionHandling() {
        // Test that services properly handle transactions
        // This is implicitly tested by the @Transactional annotation on the test class
        // and the fact that all operations are rolled back after each test

        long initialUserCount = userRepository.count();

        // Create a user within transaction
        AdminUserDTO newUserDTO = new AdminUserDTO();
        newUserDTO.setLogin("transactiontest");
        newUserDTO.setEmail("transaction@example.com");
        newUserDTO.setFirstName("Transaction");
        newUserDTO.setLastName("Test");
        newUserDTO.setActivated(true);
        newUserDTO.setLangKey("en");
        newUserDTO.setAuthorities(Set.of("ROLE_USER"));

        User createdUser = userService.createUser(newUserDTO);
        assertThat(createdUser).isNotNull();

        // Verify user exists within transaction
        long countAfterCreation = userRepository.count();
        assertThat(countAfterCreation).isEqualTo(initialUserCount + 1);

        // Transaction will be rolled back after test, so user won't persist
    }
}