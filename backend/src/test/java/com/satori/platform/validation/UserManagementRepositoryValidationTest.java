package com.satori.platform.validation;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.Role;
import com.satori.platform.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static org.assertj.core.api.Assertions.*;

/**
 * Comprehensive validation tests for user management repositories.
 * Tests UserRepository, UserProfileRepository, StudentProfileRepository, and
 * TeacherProfileRepository
 * with new schema changes and authentication-related operations.
 * 
 * Requirements: 3.1, 3.2, 3.5
 */
@ApiValidationTestConfiguration
class UserManagementRepositoryValidationTest {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private TeacherProfileRepository teacherProfileRepository;

    @Autowired
    private AuthorityRepository authorityRepository;

    private User testUser;
    private UserProfile testUserProfile;
    private StudentProfile testStudentProfile;
    private TeacherProfile testTeacherProfile;
    private Authority studentAuthority;
    private Authority teacherAuthority;

    @BeforeEach
    void setUp() {
        // Create authorities if they don't exist
        studentAuthority = authorityRepository.findById("ROLE_STUDENT")
                .orElseGet(() -> {
                    Authority auth = new Authority();
                    auth.setName("ROLE_STUDENT");
                    return authorityRepository.save(auth);
                });

        teacherAuthority = authorityRepository.findById("ROLE_TEACHER")
                .orElseGet(() -> {
                    Authority auth = new Authority();
                    auth.setName("ROLE_TEACHER");
                    return authorityRepository.save(auth);
                });

        // Create test user with new schema fields
        testUser = new User();
        testUser.setLogin("testuser");
        testUser.setPassword("hashedpassword");
        testUser.setEmail("test@example.com");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setActivated(true);
        testUser.setLangKey("en");
        testUser.setCreatedBy("system");
        testUser.setCreatedDate(Instant.now());
        testUser.setLastModifiedBy("system");
        testUser.setLastModifiedDate(Instant.now());

        // Set new schema fields
        testUser.setLastLoginDate(Instant.now().minus(1, ChronoUnit.DAYS));
        testUser.setFailedLoginAttempts(0);
        testUser.setAccountLockedUntil(null);
        testUser.setProfileCompleted(true);
        testUser.setTimezone("UTC");
        testUser.setOauth2Registration(false);
        testUser.setProfilePictureUrl("https://example.com/avatar.jpg");
        testUser.setExternalProfileSyncedAt(Instant.now());

        Set<Authority> authorities = new HashSet<>();
        authorities.add(studentAuthority);
        testUser.setAuthorities(authorities);

        testUser = userRepository.save(testUser);

        // Create test user profile
        testUserProfile = new UserProfile();
        testUserProfile.setUsername("testuser");
        testUserProfile.setPasswordHash("hashedpassword");
        testUserProfile.setEmail("test@example.com");
        testUserProfile.setFullName("Test User");
        testUserProfile.setRole(Role.HOC_VIEN);
        testUserProfile = userProfileRepository.save(testUserProfile);

        // Create test student profile
        testStudentProfile = new StudentProfile();
        testStudentProfile.setStudentId("STU001");
        testStudentProfile.setUserProfile(testUserProfile);
        testStudentProfile = studentProfileRepository.save(testStudentProfile);

        // Create test teacher user and profile
        User teacherUser = new User();
        teacherUser.setLogin("teacher");
        teacherUser.setPassword("hashedpassword");
        teacherUser.setEmail("teacher@example.com");
        teacherUser.setFirstName("Teacher");
        teacherUser.setLastName("User");
        teacherUser.setActivated(true);
        teacherUser.setLangKey("en");
        teacherUser.setCreatedBy("system");
        teacherUser.setCreatedDate(Instant.now());
        teacherUser.setLastModifiedBy("system");
        teacherUser.setLastModifiedDate(Instant.now());
        teacherUser.setProfileCompleted(true);

        Set<Authority> teacherAuthorities = new HashSet<>();
        teacherAuthorities.add(teacherAuthority);
        teacherUser.setAuthorities(teacherAuthorities);

        teacherUser = userRepository.save(teacherUser);

        UserProfile teacherUserProfile = new UserProfile();
        teacherUserProfile.setUsername("teacher");
        teacherUserProfile.setPasswordHash("hashedpassword");
        teacherUserProfile.setEmail("teacher@example.com");
        teacherUserProfile.setFullName("Teacher User");
        teacherUserProfile.setRole(Role.GIANG_VIEN);
        teacherUserProfile = userProfileRepository.save(teacherUserProfile);

        testTeacherProfile = new TeacherProfile();
        testTeacherProfile.setUserProfile(teacherUserProfile);
        testTeacherProfile = teacherProfileRepository.save(testTeacherProfile);
    }

    // UserRepository Tests

    @Test
    void testUserRepository_BasicCrudOperations() {
        // Test save
        User newUser = new User();
        newUser.setLogin("newuser");
        newUser.setPassword("hashedpassword");
        newUser.setEmail("new@example.com");
        newUser.setFirstName("New");
        newUser.setLastName("User");
        newUser.setActivated(true);
        newUser.setLangKey("en");
        newUser.setCreatedBy("system");
        newUser.setCreatedDate(Instant.now());
        newUser.setLastModifiedBy("system");
        newUser.setLastModifiedDate(Instant.now());
        newUser.setProfileCompleted(false);

        User savedUser = userRepository.save(newUser);
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getLogin()).isEqualTo("newuser");

        // Test findById
        Optional<User> foundUser = userRepository.findById(savedUser.getId());
        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getLogin()).isEqualTo("newuser");

        // Test update
        savedUser.setFirstName("Updated");
        User updatedUser = userRepository.save(savedUser);
        assertThat(updatedUser.getFirstName()).isEqualTo("Updated");

        // Test delete
        userRepository.delete(savedUser);
        Optional<User> deletedUser = userRepository.findById(savedUser.getId());
        assertThat(deletedUser).isEmpty();
    }

    @Test
    void testUserRepository_NewSchemaFields() {
        // Test new schema fields are properly persisted and retrieved
        Optional<User> foundUser = userRepository.findById(testUser.getId());
        assertThat(foundUser).isPresent();

        User user = foundUser.get();
        assertThat(user.getLastLoginDate()).isNotNull();
        assertThat(user.getFailedLoginAttempts()).isEqualTo(0);
        assertThat(user.getAccountLockedUntil()).isNull();
        assertThat(user.getProfileCompleted()).isTrue();
        assertThat(user.getTimezone()).isEqualTo("UTC");
        assertThat(user.getOauth2Registration()).isEqualTo(false);
        assertThat(user.getProfilePictureUrl()).isEqualTo("https://example.com/avatar.jpg");
        assertThat(user.getExternalProfileSyncedAt()).isNotNull();
    }

    @Test
    void testUserRepository_AuthenticationRelatedQueries() {
        // Test findOneByLogin
        Optional<User> userByLogin = userRepository.findOneByLogin("testuser");
        assertThat(userByLogin).isPresent();
        assertThat(userByLogin.get().getEmail()).isEqualTo("test@example.com");

        // Test findOneByEmailIgnoreCase
        Optional<User> userByEmail = userRepository.findOneByEmailIgnoreCase("TEST@EXAMPLE.COM");
        assertThat(userByEmail).isPresent();
        assertThat(userByEmail.get().getLogin()).isEqualTo("testuser");

        // Test findOneWithAuthoritiesByLogin
        Optional<User> userWithAuthorities = userRepository.findOneWithAuthoritiesByLogin("testuser");
        assertThat(userWithAuthorities).isPresent();
        assertThat(userWithAuthorities.get().getAuthorities()).hasSize(1);
        assertThat(userWithAuthorities.get().getAuthorities().iterator().next().getName()).isEqualTo("ROLE_STUDENT");

        // Test findOneWithAuthoritiesByEmailIgnoreCase
        Optional<User> userWithAuthoritiesByEmail = userRepository
                .findOneWithAuthoritiesByEmailIgnoreCase("test@example.com");
        assertThat(userWithAuthoritiesByEmail).isPresent();
        assertThat(userWithAuthoritiesByEmail.get().getAuthorities()).hasSize(1);
    }

    @Test
    void testUserRepository_CustomQueries() {
        // Test findUsersWithExpiredLocks
        User lockedUser = new User();
        lockedUser.setLogin("locked");
        lockedUser.setPassword("hashedpassword");
        lockedUser.setEmail("locked@example.com");
        lockedUser.setFirstName("Locked");
        lockedUser.setLastName("User");
        lockedUser.setActivated(true);
        lockedUser.setLangKey("en");
        lockedUser.setCreatedBy("system");
        lockedUser.setCreatedDate(Instant.now());
        lockedUser.setLastModifiedBy("system");
        lockedUser.setLastModifiedDate(Instant.now());
        lockedUser.setAccountLockedUntil(Instant.now().minus(1, ChronoUnit.HOURS)); // Expired lock
        lockedUser.setProfileCompleted(true);

        userRepository.save(lockedUser);

        List<User> expiredLockUsers = userRepository.findUsersWithExpiredLocks(Instant.now());
        assertThat(expiredLockUsers).hasSize(1);
        assertThat(expiredLockUsers.get(0).getLogin()).isEqualTo("locked");

        // Test findUsersWithIncompleteProfiles
        User incompleteUser = new User();
        incompleteUser.setLogin("incomplete");
        incompleteUser.setPassword("hashedpassword");
        incompleteUser.setEmail("incomplete@example.com");
        incompleteUser.setFirstName("Incomplete");
        incompleteUser.setLastName("User");
        incompleteUser.setActivated(true);
        incompleteUser.setLangKey("en");
        incompleteUser.setCreatedBy("system");
        incompleteUser.setCreatedDate(Instant.now());
        incompleteUser.setLastModifiedBy("system");
        incompleteUser.setLastModifiedDate(Instant.now());
        incompleteUser.setProfileCompleted(false);

        userRepository.save(incompleteUser);

        List<User> incompleteUsers = userRepository.findUsersWithIncompleteProfiles();
        assertThat(incompleteUsers).hasSize(1);
        assertThat(incompleteUsers.get(0).getLogin()).isEqualTo("incomplete");

        // Test findByAuthority
        List<User> studentUsers = userRepository.findByAuthorityWithoutPageable("ROLE_STUDENT");
        assertThat(studentUsers).hasSize(1);
        assertThat(studentUsers.get(0).getLogin()).isEqualTo("testuser");

        // Test countByAuthoritiesName
        long studentCount = userRepository.countByAuthoritiesName("ROLE_STUDENT");
        assertThat(studentCount).isEqualTo(1);
    }

    @Test
    void testUserRepository_PaginationQueries() {
        Pageable pageable = PageRequest.of(0, 10);

        // Test findAllByIdNotNullAndActivatedIsTrue
        Page<User> activatedUsers = userRepository.findAllByIdNotNullAndActivatedIsTrue(pageable);
        assertThat(activatedUsers.getContent()).isNotEmpty();
        assertThat(activatedUsers.getContent().get(0).isActivated()).isTrue();

        // Test findAllWithAuthorities
        Page<User> usersWithAuthorities = userRepository.findAllWithAuthorities(pageable);
        assertThat(usersWithAuthorities.getContent()).isNotEmpty();
    }

    // UserProfileRepository Tests

    @Test
    void testUserProfileRepository_BasicCrudOperations() {
        // Test save
        UserProfile newProfile = new UserProfile();
        newProfile.setUsername("newprofile");
        newProfile.setPasswordHash("hashedpassword");
        newProfile.setEmail("newprofile@example.com");
        newProfile.setFullName("New Profile");
        newProfile.setRole(Role.HOC_VIEN);

        UserProfile savedProfile = userProfileRepository.save(newProfile);
        assertThat(savedProfile.getId()).isNotNull();
        assertThat(savedProfile.getUsername()).isEqualTo("newprofile");

        // Test findById
        Optional<UserProfile> foundProfile = userProfileRepository.findById(savedProfile.getId());
        assertThat(foundProfile).isPresent();
        assertThat(foundProfile.get().getFullName()).isEqualTo("New Profile");

        // Test update
        savedProfile.setFullName("Updated Profile");
        UserProfile updatedProfile = userProfileRepository.save(savedProfile);
        assertThat(updatedProfile.getFullName()).isEqualTo("Updated Profile");

        // Test delete
        userProfileRepository.delete(savedProfile);
        Optional<UserProfile> deletedProfile = userProfileRepository.findById(savedProfile.getId());
        assertThat(deletedProfile).isEmpty();
    }

    @Test
    void testUserProfileRepository_CustomQueries() {
        // Test findByRole
        List<UserProfile> students = userProfileRepository.findByRole(Role.HOC_VIEN);
        assertThat(students).hasSize(1);
        assertThat(students.get(0).getUsername()).isEqualTo("testuser");

        List<UserProfile> teachers = userProfileRepository.findByRole(Role.GIANG_VIEN);
        assertThat(teachers).hasSize(1);
        assertThat(teachers.get(0).getUsername()).isEqualTo("teacher");

        // Test findByUsername
        Optional<UserProfile> profileByUsername = userProfileRepository.findByUsername("testuser");
        assertThat(profileByUsername).isPresent();
        assertThat(profileByUsername.get().getFullName()).isEqualTo("Test User");

        // Test findAllActiveStudents
        List<UserProfile> activeStudents = userProfileRepository.findAllActiveStudents();
        assertThat(activeStudents).hasSize(1);
        assertThat(activeStudents.get(0).getRole()).isEqualTo(Role.HOC_VIEN);
    }

    // StudentProfileRepository Tests

    @Test
    void testStudentProfileRepository_BasicCrudOperations() {
        // Test save
        UserProfile newUserProfile = new UserProfile();
        newUserProfile.setUsername("newstudent");
        newUserProfile.setPasswordHash("hashedpassword");
        newUserProfile.setEmail("newstudent@example.com");
        newUserProfile.setFullName("New Student");
        newUserProfile.setRole(Role.HOC_VIEN);
        userProfileRepository.save(newUserProfile);

        StudentProfile newStudent = new StudentProfile();
        newStudent.setStudentId("STU002");
        newStudent.setUserProfile(newUserProfile);

        StudentProfile savedStudent = studentProfileRepository.save(newStudent);
        assertThat(savedStudent.getId()).isNotNull();
        assertThat(savedStudent.getStudentId()).isEqualTo("STU002");

        // Test findById
        Optional<StudentProfile> foundStudent = studentProfileRepository.findById(savedStudent.getId());
        assertThat(foundStudent).isPresent();
        assertThat(foundStudent.get().getStudentId()).isEqualTo("STU002");

        // Test update
        savedStudent.setStudentId("STU002_UPDATED");
        StudentProfile updatedStudent = studentProfileRepository.save(savedStudent);
        assertThat(updatedStudent.getStudentId()).isEqualTo("STU002_UPDATED");

        // Test delete
        studentProfileRepository.delete(savedStudent);
        Optional<StudentProfile> deletedStudent = studentProfileRepository.findById(savedStudent.getId());
        assertThat(deletedStudent).isEmpty();
    }

    @Test
    void testStudentProfileRepository_CustomQueries() {
        // Test findByIdNotIn
        Set<Long> excludeIds = Set.of(999L, 998L); // Non-existent IDs
        Pageable pageable = PageRequest.of(0, 10);

        Page<StudentProfile> studentsNotInSet = studentProfileRepository.findByIdNotIn(excludeIds, pageable);
        assertThat(studentsNotInSet.getContent()).hasSize(1);
        assertThat(studentsNotInSet.getContent().get(0).getStudentId()).isEqualTo("STU001");

        // Test search by student ID and full name
        Set<Long> emptyExcludeIds = new HashSet<>();
        Page<StudentProfile> searchResults = studentProfileRepository
                .findByStudentIdContainingIgnoreCaseOrUserProfile_FullNameContainingIgnoreCaseAndIdNotIn(
                        "STU", "Test", emptyExcludeIds, pageable);

        assertThat(searchResults.getContent()).hasSize(1);
        assertThat(searchResults.getContent().get(0).getStudentId()).isEqualTo("STU001");
    }

    // TeacherProfileRepository Tests

    @Test
    void testTeacherProfileRepository_BasicCrudOperations() {
        // Test save
        UserProfile newUserProfile = new UserProfile();
        newUserProfile.setUsername("newteacher");
        newUserProfile.setPasswordHash("hashedpassword");
        newUserProfile.setEmail("newteacher@example.com");
        newUserProfile.setFullName("New Teacher");
        newUserProfile.setRole(Role.GIANG_VIEN);
        userProfileRepository.save(newUserProfile);

        TeacherProfile newTeacher = new TeacherProfile();
        newTeacher.setUserProfile(newUserProfile);

        TeacherProfile savedTeacher = teacherProfileRepository.save(newTeacher);
        assertThat(savedTeacher.getId()).isNotNull();

        // Test findById
        Optional<TeacherProfile> foundTeacher = teacherProfileRepository.findById(savedTeacher.getId());
        assertThat(foundTeacher).isPresent();
        assertThat(foundTeacher.get().getUserProfile().getUsername()).isEqualTo("newteacher");

        // Test delete
        teacherProfileRepository.delete(savedTeacher);
        Optional<TeacherProfile> deletedTeacher = teacherProfileRepository.findById(savedTeacher.getId());
        assertThat(deletedTeacher).isEmpty();
    }

    @Test
    void testTeacherProfileRepository_CustomQueries() {
        // Test findByUserProfile
        Optional<TeacherProfile> teacherByProfile = teacherProfileRepository
                .findByUserProfile(testTeacherProfile.getUserProfile());
        assertThat(teacherByProfile).isPresent();
        assertThat(teacherByProfile.get().getUserProfile().getUsername()).isEqualTo("teacher");
    }

    // Integration Tests

    @Test
    void testUserManagementRepositories_Integration() {
        // Test complete user creation flow
        User newUser = new User();
        newUser.setLogin("integration");
        newUser.setPassword("hashedpassword");
        newUser.setEmail("integration@example.com");
        newUser.setFirstName("Integration");
        newUser.setLastName("Test");
        newUser.setActivated(true);
        newUser.setLangKey("en");
        newUser.setCreatedBy("system");
        newUser.setCreatedDate(Instant.now());
        newUser.setLastModifiedBy("system");
        newUser.setLastModifiedDate(Instant.now());
        newUser.setProfileCompleted(true);

        Set<Authority> authorities = new HashSet<>();
        authorities.add(studentAuthority);
        newUser.setAuthorities(authorities);

        User savedUser = userRepository.save(newUser);

        UserProfile userProfile = new UserProfile();
        userProfile.setUsername("integration");
        userProfile.setPasswordHash("hashedpassword");
        userProfile.setEmail("integration@example.com");
        userProfile.setFullName("Integration Test");
        userProfile.setRole(Role.HOC_VIEN);

        UserProfile savedProfile = userProfileRepository.save(userProfile);

        StudentProfile studentProfile = new StudentProfile();
        studentProfile.setStudentId("INT001");
        studentProfile.setUserProfile(savedProfile);

        StudentProfile savedStudent = studentProfileRepository.save(studentProfile);

        // Verify all entities are properly linked
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedProfile.getId()).isNotNull();
        assertThat(savedStudent.getId()).isNotNull();
        // UserProfile doesn't have direct User relationship - verify by username
        // instead
        assertThat(savedProfile.getUsername()).isEqualTo("integration");
        assertThat(savedStudent.getUserProfile().getId()).isEqualTo(savedProfile.getId());

        // Test queries work across relationships
        Optional<User> foundUser = userRepository.findOneByLogin("integration");
        assertThat(foundUser).isPresent();

        Optional<UserProfile> foundProfile = userProfileRepository.findByUsername("integration");
        assertThat(foundProfile).isPresent();

        List<UserProfile> students = userProfileRepository.findByRole(Role.HOC_VIEN);
        assertThat(students).hasSize(2); // Original test student + new integration student
    }

    @Test
    void testRepositoryPerformance() {
        // Create multiple users for performance testing
        List<User> users = new ArrayList<>();
        for (int i = 0; i < 50; i++) { // Reduced from 100 to 50 for faster test execution
            User user = new User();
            user.setLogin("perf" + i);
            user.setPassword("hashedpassword");
            user.setEmail("perf" + i + "@example.com");
            user.setFirstName("Perf");
            user.setLastName("User" + i);
            user.setActivated(true);
            user.setLangKey("en");
            user.setCreatedBy("system");
            user.setCreatedDate(Instant.now());
            user.setLastModifiedBy("system");
            user.setLastModifiedDate(Instant.now());
            user.setProfileCompleted(true);
            users.add(user);
        }

        long startTime = System.currentTimeMillis();
        userRepository.saveAll(users);
        long saveTime = System.currentTimeMillis() - startTime;

        startTime = System.currentTimeMillis();
        List<User> allUsers = userRepository.findAll();
        long findTime = System.currentTimeMillis() - startTime;

        // Performance assertions (should complete within reasonable time)
        assertThat(saveTime).isLessThan(5000); // 5 seconds
        assertThat(findTime).isLessThan(1000); // 1 second
        assertThat(allUsers.size()).isGreaterThanOrEqualTo(50);
    }
}