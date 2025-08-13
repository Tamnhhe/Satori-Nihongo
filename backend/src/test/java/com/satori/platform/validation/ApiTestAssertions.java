package com.satori.platform.validation;

import org.springframework.test.web.servlet.ResultActions;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Utility class for common API test assertions.
 * Provides reusable assertion methods to reduce duplication in tests.
 */
public class ApiTestAssertions {

    /**
     * Validates that a response contains all required course fields
     */
    public static ResultActions assertCourseFields(ResultActions resultActions, String jsonPath) throws Exception {
        return resultActions
                .andExpect(jsonPath(jsonPath + ".id").exists())
                .andExpect(jsonPath(jsonPath + ".title").exists())
                .andExpect(jsonPath(jsonPath + ".description").exists())
                .andExpect(jsonPath(jsonPath + ".level").exists())
                .andExpect(jsonPath(jsonPath + ".duration").exists())
                .andExpect(jsonPath(jsonPath + ".price").exists())
                .andExpect(jsonPath(jsonPath + ".isActive").exists());
    }

    /**
     * Validates that a response contains all required lesson fields
     */
    public static ResultActions assertLessonFields(ResultActions resultActions, String jsonPath) throws Exception {
        return resultActions
                .andExpect(jsonPath(jsonPath + ".id").exists())
                .andExpect(jsonPath(jsonPath + ".title").exists())
                .andExpect(jsonPath(jsonPath + ".content").exists())
                .andExpect(jsonPath(jsonPath + ".orderIndex").exists())
                .andExpect(jsonPath(jsonPath + ".duration").exists());
    }

    /**
     * Validates that a response contains all required course class fields
     */
    public static ResultActions assertCourseClassFields(ResultActions resultActions, String jsonPath) throws Exception {
        return resultActions
                .andExpect(jsonPath(jsonPath + ".id").exists())
                .andExpect(jsonPath(jsonPath + ".className").exists())
                .andExpect(jsonPath(jsonPath + ".maxStudents").exists())
                .andExpect(jsonPath(jsonPath + ".currentStudents").exists())
                .andExpect(jsonPath(jsonPath + ".startDate").exists())
                .andExpect(jsonPath(jsonPath + ".endDate").exists());
    }

    /**
     * Validates that a response contains all required schedule fields
     */
    public static ResultActions assertScheduleFields(ResultActions resultActions, String jsonPath) throws Exception {
        return resultActions
                .andExpect(jsonPath(jsonPath + ".id").exists())
                .andExpect(jsonPath(jsonPath + ".scheduledDate").exists())
                .andExpect(jsonPath(jsonPath + ".duration").exists())
                .andExpect(jsonPath(jsonPath + ".status").exists());
    }

    /**
     * Validates paginated response structure
     */
    public static ResultActions assertPaginatedResponse(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(jsonPath("$.content").isArray())
                .andExpect(jsonPath("$.totalElements").exists())
                .andExpect(jsonPath("$.totalPages").exists())
                .andExpect(jsonPath("$.size").exists())
                .andExpect(jsonPath("$.number").exists());
    }

    /**
     * Validates successful creation response (201 Created)
     */
    public static ResultActions assertCreatedResponse(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isCreated())
                .andExpect(content().contentType("application/json"));
    }

    /**
     * Validates successful response (200 OK)
     */
    public static ResultActions assertOkResponse(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isOk())
                .andExpect(content().contentType("application/json"));
    }

    /**
     * Validates not found response (404 Not Found)
     */
    public static ResultActions assertNotFoundResponse(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isNotFound());
    }

    /**
     * Validates no content response (204 No Content)
     */
    public static ResultActions assertNoContentResponse(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isNoContent());
    }

    /**
     * Validates bad request response (400 Bad Request)
     */
    public static ResultActions assertBadRequestResponse(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isBadRequest());
    }

    /**
     * Validates unauthorized response (401 Unauthorized)
     */
    public static ResultActions assertUnauthorizedResponse(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isUnauthorized());
    }

    /**
     * Validates forbidden response (403 Forbidden)
     */
    public static ResultActions assertForbiddenResponse(ResultActions resultActions) throws Exception {
        return resultActions
                .andExpect(status().isForbidden());
    }
}