package com.satori.platform.validation;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.*;
import org.springframework.test.context.junit.jupiter.SpringJUnitConfig;

import java.util.Map;

/**
 * Base class for comprehensive API validation tests.
 * Provides common functionality for testing all API endpoints in the Satori
 * platform.
 */
@ApiValidationTestConfiguration
@SpringJUnitConfig
public abstract class ApiValidationTestFramework {

    @LocalServerPort
    protected int port;

    @Autowired
    protected TestRestTemplate restTemplate;

    @Autowired
    protected ObjectMapper objectMapper;

    protected String baseUrl;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port;
    }

    @AfterEach
    void tearDown() {
        // Cleanup if needed
    }

    /**
     * Performs GET request to the specified endpoint
     */
    protected <T> ResponseEntity<T> performGet(String endpoint, Class<T> responseType) {
        return restTemplate.getForEntity(baseUrl + endpoint, responseType);
    }

    /**
     * Performs GET request with authentication headers
     */
    protected <T> ResponseEntity<T> performGetWithAuth(String endpoint, Class<T> responseType, String token) {
        HttpHeaders headers = createAuthHeaders(token);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        return restTemplate.exchange(baseUrl + endpoint, HttpMethod.GET, entity, responseType);
    }

    /**
     * Performs POST request with JSON body
     */
    protected <T> ResponseEntity<T> performPost(String endpoint, Object requestBody, Class<T> responseType) {
        HttpHeaders headers = createJsonHeaders();
        HttpEntity<Object> entity = new HttpEntity<>(requestBody, headers);
        return restTemplate.postForEntity(baseUrl + endpoint, entity, responseType);
    }

    /**
     * Performs POST request with authentication and JSON body
     */
    protected <T> ResponseEntity<T> performPostWithAuth(String endpoint, Object requestBody, Class<T> responseType,
            String token) {
        HttpHeaders headers = createJsonHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Object> entity = new HttpEntity<>(requestBody, headers);
        return restTemplate.postForEntity(baseUrl + endpoint, entity, responseType);
    }

    /**
     * Performs PUT request with JSON body
     */
    protected <T> ResponseEntity<T> performPut(String endpoint, Object requestBody, Class<T> responseType) {
        HttpHeaders headers = createJsonHeaders();
        HttpEntity<Object> entity = new HttpEntity<>(requestBody, headers);
        return restTemplate.exchange(baseUrl + endpoint, HttpMethod.PUT, entity, responseType);
    }

    /**
     * Performs PUT request with authentication and JSON body
     */
    protected <T> ResponseEntity<T> performPutWithAuth(String endpoint, Object requestBody, Class<T> responseType,
            String token) {
        HttpHeaders headers = createJsonHeaders();
        headers.setBearerAuth(token);
        HttpEntity<Object> entity = new HttpEntity<>(requestBody, headers);
        return restTemplate.exchange(baseUrl + endpoint, HttpMethod.PUT, entity, responseType);
    }

    /**
     * Performs DELETE request
     */
    protected ResponseEntity<Void> performDelete(String endpoint) {
        return restTemplate.exchange(baseUrl + endpoint, HttpMethod.DELETE, null, Void.class);
    }

    /**
     * Performs DELETE request with authentication
     */
    protected ResponseEntity<Void> performDeleteWithAuth(String endpoint, String token) {
        HttpHeaders headers = createAuthHeaders(token);
        HttpEntity<?> entity = new HttpEntity<>(headers);
        return restTemplate.exchange(baseUrl + endpoint, HttpMethod.DELETE, entity, Void.class);
    }

    /**
     * Creates HTTP headers with JSON content type
     */
    protected HttpHeaders createJsonHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
        return headers;
    }

    /**
     * Creates HTTP headers with authentication token
     */
    protected HttpHeaders createAuthHeaders(String token) {
        HttpHeaders headers = createJsonHeaders();
        headers.setBearerAuth(token);
        return headers;
    }

    /**
     * Validates that response has expected status code
     */
    protected void assertResponseStatus(ResponseEntity<?> response, HttpStatus expectedStatus) {
        if (response.getStatusCode() != expectedStatus) {
            throw new AssertionError(
                    String.format("Expected status %s but got %s. Response body: %s",
                            expectedStatus, response.getStatusCode(), response.getBody()));
        }
    }

    /**
     * Validates that response body is not null
     */
    protected void assertResponseBodyNotNull(ResponseEntity<?> response) {
        if (response.getBody() == null) {
            throw new AssertionError("Response body should not be null");
        }
    }

    /**
     * Validates that response contains expected content type
     */
    protected void assertContentType(ResponseEntity<?> response, MediaType expectedContentType) {
        MediaType actualContentType = response.getHeaders().getContentType();
        if (actualContentType == null || !actualContentType.isCompatibleWith(expectedContentType)) {
            throw new AssertionError(
                    String.format("Expected content type %s but got %s",
                            expectedContentType, actualContentType));
        }
    }

    /**
     * Measures response time for performance validation
     */
    protected long measureResponseTime(Runnable apiCall) {
        long startTime = System.currentTimeMillis();
        apiCall.run();
        return System.currentTimeMillis() - startTime;
    }

    /**
     * Validates that API response time is within acceptable limits
     */
    protected void assertResponseTimeWithinLimit(long responseTime, long maxTimeMs) {
        if (responseTime > maxTimeMs) {
            throw new AssertionError(
                    String.format("Response time %dms exceeds maximum allowed %dms",
                            responseTime, maxTimeMs));
        }
    }

    /**
     * Converts object to JSON string for logging/debugging
     */
    protected String toJson(Object object) {
        try {
            return objectMapper.writeValueAsString(object);
        } catch (Exception e) {
            return "Error converting to JSON: " + e.getMessage();
        }
    }

    /**
     * Logs API validation result
     */
    protected void logValidationResult(String endpoint, String method, HttpStatus status, long responseTime) {
        System.out.printf("API Validation: %s %s -> %s (%dms)%n",
                method, endpoint, status, responseTime);
    }

    /**
     * Creates a validation report entry
     */
    protected ValidationResult createValidationResult(String componentName, boolean success, String details) {
        ValidationResult result = new ValidationResult();
        result.setComponentName(componentName);
        result.setStatus(success ? ValidationStatus.PASSED : ValidationStatus.FAILED);
        result.setDetails(details);
        result.setTimestamp(java.time.LocalDateTime.now());
        return result;
    }

    /**
     * Validation result data structure
     */
    public static class ValidationResult {
        private String componentName;
        private ValidationStatus status;
        private String details;
        private java.time.LocalDateTime timestamp;

        // Getters and setters
        public String getComponentName() {
            return componentName;
        }

        public void setComponentName(String componentName) {
            this.componentName = componentName;
        }

        public ValidationStatus getStatus() {
            return status;
        }

        public void setStatus(ValidationStatus status) {
            this.status = status;
        }

        public String getDetails() {
            return details;
        }

        public void setDetails(String details) {
            this.details = details;
        }

        public java.time.LocalDateTime getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(java.time.LocalDateTime timestamp) {
            this.timestamp = timestamp;
        }
    }

    /**
     * Validation status enumeration
     */
    public enum ValidationStatus {
        PASSED, FAILED, SKIPPED
    }
}