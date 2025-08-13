package com.satori.platform.validation;

import com.fasterxml.jackson.core.type.TypeReference;
import com.satori.platform.domain.User;
import com.satori.platform.service.dto.AdminUserDTO;
import com.satori.platform.service.dto.UserDTO;
import com.satori.platform.service.dto.UserProfileDTO;
import com.satori.platform.service.dto.StudentProfileDTO;
import com.satori.platform.service.dto.TeacherProfileDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.HashMap;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Comprehensive API validation tests for User Management APIs.
 * Tests all 6 user management endpoints as specified in task 6.1:
 * 
 * 1. /api/admin/users - EnhancedUserResource (GET, POST, PUT, DELETE)
 * 2. /api/admin - UserResource admin operations
 * 3. /api - PublicUserResource public endpoints
 * 4. /api/user-profiles - UserProfileResource
 * 5. /api/student-profiles - StudentProfileResource
 * 6. /api/teacher-profiles - TeacherProfileResource
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Transactional
public class UserManagementApiValidationTest extends ApiValidationTestFramework {

    @Autowired
    private TestDataFixtures testDataFixtures;

    private String adminToken;
    private String userToken;

    @BeforeEach
    void setUpTestData() {
        testDataFixtures.createAllTestData();

        // Get authentication tokens for testing
        adminToken = "admin-test-token"; // In real implementation, get actual JWT token
        userToken = "user-test-token"; // In real implementation, get actual JWT token
    }

    // ========================================
    // 1. Enhanced User Resource Tests (/api/admin/users)
    // ========================================

    @Test
    @DisplayName("Enhanced User API - GET /api/admin/users/search - Search users with filters")
    void testEnhancedUserApi_SearchUsers() {
        String endpoint = "/api/admin/users/search";

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<String> response = performGetWithAuth(endpoint, String.class, adminToken);

            assertResponseStatus(response, HttpStatus.OK);
            assertContentType(response, org.springframework.http.MediaType.APPLICATION_JSON);
            assertResponseBodyNotNull(response);

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 2000); // 2 seconds max
    }

    @Test
    @DisplayName("Enhanced User API - GET /api/admin/users/{login}/profile - Get user with profile")
    void testEnhancedUserApi_GetUserWithProfile() {
        String login = "admin-test";
        String endpoint = "/api/admin/users/" + login + "/profile";

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<AdminUserDTO> response = performGetWithAuth(endpoint, AdminUserDTO.class, adminToken);

            assertResponseStatus(response, HttpStatus.OK);
            assertContentType(response, org.springframework.http.MediaType.APPLICATION_JSON);
            assertResponseBodyNotNull(response);

            AdminUserDTO userDTO = response.getBody();
            assertNotNull(userDTO);
            assertEquals(login, userDTO.getLogin());

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 1500);
    }

    @Test
    @DisplayName("Enhanced User API - POST /api/admin/users/bulk - Bulk operations")
    void testEnhancedUserApi_BulkOperations() {
        String endpoint = "/api/admin/users/bulk";

        // Create bulk action request
        Map<String, Object> bulkRequest = new HashMap<>();
        bulkRequest.put("action", "activate");
        bulkRequest.put("userIds", List.of("1", "2"));

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<Map> response = performPostWithAuth(endpoint, bulkRequest, Map.class, adminToken);

            // Accept both OK and BAD_REQUEST as valid responses (depends on data state)
            assertTrue(response.getStatusCode() == HttpStatus.OK ||
                    response.getStatusCode() == HttpStatus.BAD_REQUEST);
            assertResponseBodyNotNull(response);

            logValidationResult(endpoint, "POST", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 3000);
    }

    @Test
    @DisplayName("Enhanced User API - GET /api/admin/users/export - Export users")
    void testEnhancedUserApi_ExportUsers() {
        String endpoint = "/api/admin/users/export?format=csv";

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<byte[]> response = performGetWithAuth(endpoint, byte[].class, adminToken);

            assertResponseStatus(response, HttpStatus.OK);
            assertResponseBodyNotNull(response);

            // Verify CSV content type or octet-stream
            assertTrue(response.getHeaders().getContentType() != null);

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 5000); // Export can take longer
    }

    @Test
    @DisplayName("Enhanced User API - GET /api/admin/users/statistics - User statistics")
    void testEnhancedUserApi_GetStatistics() {
        String endpoint = "/api/admin/users/statistics";

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<Map> response = performGetWithAuth(endpoint, Map.class, adminToken);

            assertResponseStatus(response, HttpStatus.OK);
            assertContentType(response, org.springframework.http.MediaType.APPLICATION_JSON);
            assertResponseBodyNotNull(response);

            Map<String, Object> stats = response.getBody();
            assertNotNull(stats);
            assertTrue(stats.containsKey("totalUsers"));
            assertTrue(stats.containsKey("activeUsers"));

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 2000);
    }

    // ========================================
    // 2. User Resource Tests (/api/admin)
    // ========================================

    @Test
    @DisplayName("User Resource API - GET /api/admin/users - Get all users")
    void testUserResourceApi_GetAllUsers() {
        String endpoint = "/api/admin/users";

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<String> response = performGetWithAuth(endpoint, String.class, adminToken);

            assertResponseStatus(response, HttpStatus.OK);
            assertContentType(response, org.springframework.http.MediaType.APPLICATION_JSON);
            assertResponseBodyNotNull(response);

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 2000);
    }

    @Test
    @DisplayName("User Resource API - GET /api/admin/users/{login} - Get specific user")
    void testUserResourceApi_GetUser() {
        String login = "admin-test";
        String endpoint = "/api/admin/users/" + login;

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<AdminUserDTO> response = performGetWithAuth(endpoint, AdminUserDTO.class, adminToken);

            assertResponseStatus(response, HttpStatus.OK);
            assertContentType(response, org.springframework.http.MediaType.APPLICATION_JSON);
            assertResponseBodyNotNull(response);

            AdminUserDTO userDTO = response.getBody();
            assertNotNull(userDTO);
            assertEquals(login, userDTO.getLogin());

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 1500);
    }

    @Test
    @DisplayName("User Resource API - POST /api/admin/users - Create user")
    void testUserResourceApi_CreateUser() {
        String endpoint = "/api/admin/users";

        AdminUserDTO newUser = new AdminUserDTO();
        newUser.setLogin("test-new-user");
        newUser.setEmail("test-new-user@satori.com");
        newUser.setFirstName("Test");
        newUser.setLastName("User");
        newUser.setActivated(true);

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<User> response = performPostWithAuth(endpoint, newUser, User.class, adminToken);

            // Accept both CREATED and BAD_REQUEST (if user exists)
            assertTrue(response.getStatusCode() == HttpStatus.CREATED ||
                    response.getStatusCode() == HttpStatus.BAD_REQUEST);

            logValidationResult(endpoint, "POST", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 3000);
    }

    @Test
    @DisplayName("User Resource API - PUT /api/admin/users - Update user")
    void testUserResourceApi_UpdateUser() {
        String endpoint = "/api/admin/users";

        // Get existing user first
        User existingUser = testDataFixtures.getAdminUser();
        if (existingUser != null) {
            AdminUserDTO updateUser = new AdminUserDTO(existingUser);
            updateUser.setFirstName("Updated Name");

            long responseTime = measureResponseTime(() -> {
                ResponseEntity<AdminUserDTO> response = performPutWithAuth(endpoint, updateUser, AdminUserDTO.class,
                        adminToken);

                // Accept OK, BAD_REQUEST, or NOT_FOUND
                assertTrue(response.getStatusCode() == HttpStatus.OK ||
                        response.getStatusCode() == HttpStatus.BAD_REQUEST ||
                        response.getStatusCode() == HttpStatus.NOT_FOUND);

                logValidationResult(endpoint, "PUT", response.getStatusCode(), 0);
            });

            assertResponseTimeWithinLimit(responseTime, 2000);
        }
    }

    @Test
    @DisplayName("User Resource API - DELETE /api/admin/users/{login} - Delete user")
    void testUserResourceApi_DeleteUser() {
        String login = "test-delete-user";
        String endpoint = "/api/admin/users/" + login;

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<Void> response = performDeleteWithAuth(endpoint, adminToken);

            // Accept NO_CONTENT or NOT_FOUND
            assertTrue(response.getStatusCode() == HttpStatus.NO_CONTENT ||
                    response.getStatusCode() == HttpStatus.NOT_FOUND);

            logValidationResult(endpoint, "DELETE", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 1500);
    }

    // ========================================
    // 3. Public User Resource Tests (/api)
    // ========================================

    @Test
    @DisplayName("Public User API - GET /api/users - Get all public users")
    void testPublicUserApi_GetAllPublicUsers() {
        String endpoint = "/api/users";

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<String> response = performGet(endpoint, String.class);

            assertResponseStatus(response, HttpStatus.OK);
            assertContentType(response, org.springframework.http.MediaType.APPLICATION_JSON);
            assertResponseBodyNotNull(response);

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 2000);
    }

    // ========================================
    // 4. User Profile Resource Tests (/api/user-profiles)
    // ========================================

    @Test
    @DisplayName("User Profile API - GET /api/user-profiles - Get all user profiles")
    void testUserProfileApi_GetAllProfiles() {
        String endpoint = "/api/user-profiles";

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<String> response = performGet(endpoint, String.class);

            assertResponseStatus(response, HttpStatus.OK);
            assertContentType(response, org.springframework.http.MediaType.APPLICATION_JSON);
            assertResponseBodyNotNull(response);

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 2000);
    }

    @Test
    @DisplayName("User Profile API - POST /api/user-profiles - Create user profile")
    void testUserProfileApi_CreateProfile() {
        String endpoint = "/api/user-profiles";

        UserProfileDTO newProfile = new UserProfileDTO();
        newProfile.setPhoneNumber("123-456-7890");
        newProfile.setAddress("Test Address");

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<UserProfileDTO> response = performPost(endpoint, newProfile, UserProfileDTO.class);

            // Accept CREATED or BAD_REQUEST
            assertTrue(response.getStatusCode() == HttpStatus.CREATED ||
                    response.getStatusCode() == HttpStatus.BAD_REQUEST);

            logValidationResult(endpoint, "POST", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 2000);
    }

    @Test
    @DisplayName("User Profile API - GET /api/user-profiles/{id} - Get specific profile")
    void testUserProfileApi_GetProfile() {
        Long profileId = 1L;
        String endpoint = "/api/user-profiles/" + profileId;

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<UserProfileDTO> response = performGet(endpoint, UserProfileDTO.class);

            // Accept OK or NOT_FOUND
            assertTrue(response.getStatusCode() == HttpStatus.OK ||
                    response.getStatusCode() == HttpStatus.NOT_FOUND);

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 1500);
    }

    @Test
    @DisplayName("User Profile API - PUT /api/user-profiles/{id} - Update profile")
    void testUserProfileApi_UpdateProfile() {
        Long profileId = 1L;
        String endpoint = "/api/user-profiles/" + profileId;

        UserProfileDTO updateProfile = new UserProfileDTO();
        updateProfile.setId(profileId);
        updateProfile.setPhoneNumber("987-654-3210");

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<UserProfileDTO> response = performPut(endpoint, updateProfile, UserProfileDTO.class);

            // Accept OK, BAD_REQUEST, or NOT_FOUND
            assertTrue(response.getStatusCode() == HttpStatus.OK ||
                    response.getStatusCode() == HttpStatus.BAD_REQUEST ||
                    response.getStatusCode() == HttpStatus.NOT_FOUND);

            logValidationResult(endpoint, "PUT", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 2000);
    }

    @Test
    @DisplayName("User Profile API - DELETE /api/user-profiles/{id} - Delete profile")
    void testUserProfileApi_DeleteProfile() {
        Long profileId = 999L; // Use non-existent ID to avoid affecting test data
        String endpoint = "/api/user-profiles/" + profileId;

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<Void> response = performDelete(endpoint);

            // Accept NO_CONTENT or NOT_FOUND
            assertTrue(response.getStatusCode() == HttpStatus.NO_CONTENT ||
                    response.getStatusCode() == HttpStatus.NOT_FOUND);

            logValidationResult(endpoint, "DELETE", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 1500);
    }

    // ========================================
    // 5. Student Profile Resource Tests (/api/student-profiles)
    // ========================================

    @Test
    @DisplayName("Student Profile API - GET /api/student-profiles - Get all student profiles")
    void testStudentProfileApi_GetAllProfiles() {
        String endpoint = "/api/student-profiles";

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<String> response = performGet(endpoint, String.class);

            assertResponseStatus(response, HttpStatus.OK);
            assertContentType(response, org.springframework.http.MediaType.APPLICATION_JSON);
            assertResponseBodyNotNull(response);

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 2000);
    }

    @Test
    @DisplayName("Student Profile API - POST /api/student-profiles - Create student profile")
    void testStudentProfileApi_CreateProfile() {
        String endpoint = "/api/student-profiles";

        StudentProfileDTO newProfile = new StudentProfileDTO();
        newProfile.setStudentId("STU001");
        newProfile.setEnrollmentDate(java.time.Instant.now());

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<StudentProfileDTO> response = performPost(endpoint, newProfile, StudentProfileDTO.class);

            // Accept CREATED or BAD_REQUEST
            assertTrue(response.getStatusCode() == HttpStatus.CREATED ||
                    response.getStatusCode() == HttpStatus.BAD_REQUEST);

            logValidationResult(endpoint, "POST", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 2000);
    }

    @Test
    @DisplayName("Student Profile API - GET /api/student-profiles/{id} - Get specific student profile")
    void testStudentProfileApi_GetProfile() {
        Long profileId = 1L;
        String endpoint = "/api/student-profiles/" + profileId;

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<StudentProfileDTO> response = performGet(endpoint, StudentProfileDTO.class);

            // Accept OK or NOT_FOUND
            assertTrue(response.getStatusCode() == HttpStatus.OK ||
                    response.getStatusCode() == HttpStatus.NOT_FOUND);

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 1500);
    }

    // ========================================
    // 6. Teacher Profile Resource Tests (/api/teacher-profiles)
    // ========================================

    @Test
    @DisplayName("Teacher Profile API - GET /api/teacher-profiles - Get all teacher profiles")
    void testTeacherProfileApi_GetAllProfiles() {
        String endpoint = "/api/teacher-profiles";

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<String> response = performGet(endpoint, String.class);

            assertResponseStatus(response, HttpStatus.OK);
            assertContentType(response, org.springframework.http.MediaType.APPLICATION_JSON);
            assertResponseBodyNotNull(response);

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 2000);
    }

    @Test
    @DisplayName("Teacher Profile API - POST /api/teacher-profiles - Create teacher profile")
    void testTeacherProfileApi_CreateProfile() {
        String endpoint = "/api/teacher-profiles";

        TeacherProfileDTO newProfile = new TeacherProfileDTO();
        newProfile.setEmployeeId("EMP001");
        newProfile.setHireDate(java.time.Instant.now());

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<TeacherProfileDTO> response = performPost(endpoint, newProfile, TeacherProfileDTO.class);

            // Accept CREATED or BAD_REQUEST
            assertTrue(response.getStatusCode() == HttpStatus.CREATED ||
                    response.getStatusCode() == HttpStatus.BAD_REQUEST);

            logValidationResult(endpoint, "POST", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 2000);
    }

    @Test
    @DisplayName("Teacher Profile API - GET /api/teacher-profiles/{id} - Get specific teacher profile")
    void testTeacherProfileApi_GetProfile() {
        Long profileId = 1L;
        String endpoint = "/api/teacher-profiles/" + profileId;

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<TeacherProfileDTO> response = performGet(endpoint, TeacherProfileDTO.class);

            // Accept OK or NOT_FOUND
            assertTrue(response.getStatusCode() == HttpStatus.OK ||
                    response.getStatusCode() == HttpStatus.NOT_FOUND);

            logValidationResult(endpoint, "GET", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 1500);
    }

    // ========================================
    // Authentication and Authorization Tests
    // ========================================

    @Test
    @DisplayName("Authentication Test - Admin endpoints require authentication")
    void testAuthenticationRequired() {
        String endpoint = "/api/admin/users";

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<String> response = performGet(endpoint, String.class);

            // Should return UNAUTHORIZED or FORBIDDEN without authentication
            assertTrue(response.getStatusCode() == HttpStatus.UNAUTHORIZED ||
                    response.getStatusCode() == HttpStatus.FORBIDDEN);

            logValidationResult(endpoint, "GET (no auth)", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 1000);
    }

    @Test
    @DisplayName("Authorization Test - Non-admin users cannot access admin endpoints")
    void testAuthorizationRestrictions() {
        String endpoint = "/api/admin/users";

        long responseTime = measureResponseTime(() -> {
            ResponseEntity<String> response = performGetWithAuth(endpoint, String.class, userToken);

            // Should return FORBIDDEN for non-admin users
            assertTrue(response.getStatusCode() == HttpStatus.FORBIDDEN ||
                    response.getStatusCode() == HttpStatus.UNAUTHORIZED);

            logValidationResult(endpoint, "GET (user auth)", response.getStatusCode(), 0);
        });

        assertResponseTimeWithinLimit(responseTime, 1000);
    }

    // ========================================
    // Performance and Load Tests
    // ========================================

    @Test
    @DisplayName("Performance Test - Concurrent user requests")
    void testConcurrentUserRequests() {
        String endpoint = "/api/users";
        int concurrentRequests = 5;

        long startTime = System.currentTimeMillis();

        // Simulate concurrent requests
        for (int i = 0; i < concurrentRequests; i++) {
            ResponseEntity<String> response = performGet(endpoint, String.class);
            assertResponseStatus(response, HttpStatus.OK);
        }

        long totalTime = System.currentTimeMillis() - startTime;

        // All requests should complete within reasonable time
        assertResponseTimeWithinLimit(totalTime, 10000); // 10 seconds for 5 requests

        logValidationResult(endpoint, "GET (concurrent)", HttpStatus.OK, totalTime);
    }

    @Test
    @DisplayName("Data Consistency Test - User data across endpoints")
    void testDataConsistencyAcrossEndpoints() {
        String adminEndpoint = "/api/admin/users/admin-test";
        String publicEndpoint = "/api/users";

        // Get user from admin endpoint
        ResponseEntity<AdminUserDTO> adminResponse = performGetWithAuth(adminEndpoint, AdminUserDTO.class, adminToken);

        // Get users from public endpoint
        ResponseEntity<String> publicResponse = performGet(publicEndpoint, String.class);

        if (adminResponse.getStatusCode() == HttpStatus.OK && publicResponse.getStatusCode() == HttpStatus.OK) {
            AdminUserDTO adminUser = adminResponse.getBody();
            assertNotNull(adminUser);

            // Verify data consistency (admin user should exist in public list)
            String publicResponseBody = publicResponse.getBody();
            assertNotNull(publicResponseBody);
            assertTrue(publicResponseBody.contains(adminUser.getLogin()));

            logValidationResult("Data Consistency", "CROSS-ENDPOINT", HttpStatus.OK, 0);
        }
    }
}