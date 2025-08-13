package com.satori.platform.service.dto;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.junit.jupiter.api.Assertions.*;
import java.util.*;

/**
 * Unit tests for QuizAnalyticsDTO.
 * Tests the builder pattern, calculated fields, and edge cases.
 */
@DisplayName("QuizAnalyticsDTO Tests")
class QuizAnalyticsDTOTest {

    // Test constants for better maintainability
    private static final Long SAMPLE_QUIZ_ID = 1L;
    private static final String SAMPLE_QUIZ_TITLE = "Test Quiz";
    private static final Integer TOTAL_ATTEMPTS = 100;
    private static final Integer COMPLETED_ATTEMPTS = 80;
    private static final Integer UNIQUE_STUDENTS = 50;
    private static final Double AVERAGE_SCORE = 75.5;
    private static final Double COMPLETION_RATE = 80.0;
    private static final Double AVERAGE_TIME_SPENT = 15.5;

    private QuizAnalyticsDTO quizAnalytics;

    @BeforeEach
    void setUp() {
        quizAnalytics = new QuizAnalyticsDTO();
    }

    @Nested
    @DisplayName("Builder Pattern Tests")
    class BuilderPatternTests {

        @Test
        @DisplayName("Should build QuizAnalyticsDTO with all basic properties")
        void shouldBuildWithBasicProperties() {
            // When
            QuizAnalyticsDTO result = QuizAnalyticsDTO.builder()
                    .quizId(SAMPLE_QUIZ_ID)
                    .quizTitle(SAMPLE_QUIZ_TITLE)
                    .totalAttempts(TOTAL_ATTEMPTS)
                    .completedAttempts(COMPLETED_ATTEMPTS)
                    .uniqueStudents(UNIQUE_STUDENTS)
                    .averageScore(AVERAGE_SCORE)
                    .completionRate(COMPLETION_RATE)
                    .build();

            // Then
            assertAll("Builder should set all properties correctly",
                    () -> assertEquals(SAMPLE_QUIZ_ID, result.getQuizId()),
                    () -> assertEquals(SAMPLE_QUIZ_TITLE, result.getQuizTitle()),
                    () -> assertEquals(TOTAL_ATTEMPTS, result.getTotalAttempts()),
                    () -> assertEquals(COMPLETED_ATTEMPTS, result.getCompletedAttempts()),
                    () -> assertEquals(UNIQUE_STUDENTS, result.getUniqueStudents()),
                    () -> assertEquals(AVERAGE_SCORE, result.getAverageScore()),
                    () -> assertEquals(COMPLETION_RATE, result.getCompletionRate()));
        }

        @Test
        @DisplayName("Should build QuizAnalyticsDTO with complex data structures")
        void shouldBuildWithComplexData() {
            // Given
            Map<String, Integer> scoreDistribution = createSampleScoreDistribution();
            List<QuestionAnalyticsDTO> questionAnalytics = createSampleQuestionAnalytics();
            List<TimeBasedAnalyticsDTO> timeBasedAnalytics = createSampleTimeBasedAnalytics();
            List<StudentPerformanceDTO> topPerformers = createSampleTopPerformers();

            // When
            QuizAnalyticsDTO result = QuizAnalyticsDTO.builder()
                    .quizId(SAMPLE_QUIZ_ID)
                    .quizTitle("Comprehensive Quiz")
                    .totalAttempts(TOTAL_ATTEMPTS)
                    .completedAttempts(85)
                    .uniqueStudents(60)
                    .averageScore(78.5)
                    .completionRate(85.0)
                    .scoreDistribution(scoreDistribution)
                    .questionAnalytics(questionAnalytics)
                    .timeBasedAnalytics(timeBasedAnalytics)
                    .topPerformers(topPerformers)
                    .build();

            // Then
            assertAll("Complex builder should set all properties correctly",
                    () -> assertNotNull(result),
                    () -> assertEquals(SAMPLE_QUIZ_ID, result.getQuizId()),
                    () -> assertEquals("Comprehensive Quiz", result.getQuizTitle()),
                    () -> assertEquals(scoreDistribution, result.getScoreDistribution()),
                    () -> assertEquals(questionAnalytics, result.getQuestionAnalytics()),
                    () -> assertEquals(timeBasedAnalytics, result.getTimeBasedAnalytics()),
                    () -> assertEquals(topPerformers, result.getTopPerformers()),
                    () -> assertEquals("Good", result.getPerformanceLevel()),
                    () -> assertEquals(85.0, result.getSuccessRate()));
        }
    }

    @Nested
    @DisplayName("Success Rate Calculation Tests")
    class SuccessRateTests {

        @ParameterizedTest
        @CsvSource({
                "100, 80, 80.0",
                "50, 25, 50.0",
                "200, 150, 75.0",
                "1, 1, 100.0",
                "10, 0, 0.0"
        })
        @DisplayName("Should calculate success rate correctly for valid data")
        void shouldCalculateSuccessRateCorrectly(Integer totalAttempts, Integer completedAttempts,
                Double expectedRate) {
            // Given
            quizAnalytics.setTotalAttempts(totalAttempts);
            quizAnalytics.setCompletedAttempts(completedAttempts);

            // When
            Double successRate = quizAnalytics.getSuccessRate();

            // Then
            assertEquals(expectedRate, successRate, 0.01,
                    String.format("Success rate should be %.2f for %d completed out of %d total attempts",
                            expectedRate, completedAttempts, totalAttempts));
        }

        @Test
        @DisplayName("Should return 0.0 when total attempts is zero")
        void shouldReturnZeroForZeroAttempts() {
            // Given
            quizAnalytics.setTotalAttempts(0);
            quizAnalytics.setCompletedAttempts(0);

            // When
            Double successRate = quizAnalytics.getSuccessRate();

            // Then
            assertEquals(0.0, successRate);
        }

        @Test
        @DisplayName("Should return 0.0 when total attempts is null")
        void shouldReturnZeroForNullTotalAttempts() {
            // Given
            quizAnalytics.setTotalAttempts(null);
            quizAnalytics.setCompletedAttempts(50);

            // When
            Double successRate = quizAnalytics.getSuccessRate();

            // Then
            assertEquals(0.0, successRate);
        }

        @Test
        @DisplayName("Should handle null completed attempts as zero")
        void shouldHandleNullCompletedAttempts() {
            // Given
            quizAnalytics.setTotalAttempts(100);
            quizAnalytics.setCompletedAttempts(null);

            // When
            Double successRate = quizAnalytics.getSuccessRate();

            // Then
            assertEquals(0.0, successRate);
        }
    }

    @Nested
    @DisplayName("Performance Level Tests")
    class PerformanceLevelTests {

        @ParameterizedTest
        @CsvSource({
                "90.0, Excellent",
                "85.0, Excellent",
                "75.0, Good",
                "70.0, Good",
                "60.0, Average",
                "50.0, Average",
                "40.0, Needs Improvement",
                "0.0, Needs Improvement"
        })
        @DisplayName("Should return correct performance level for given scores")
        void shouldReturnCorrectPerformanceLevel(Double averageScore, String expectedLevel) {
            // Given
            quizAnalytics.setAverageScore(averageScore);

            // When
            String performanceLevel = quizAnalytics.getPerformanceLevel();

            // Then
            assertEquals(expectedLevel, performanceLevel);
        }

        @Test
        @DisplayName("Should return 'No Data' when average score is null")
        void shouldReturnNoDataForNullScore() {
            // Given
            quizAnalytics.setAverageScore(null);

            // When
            String performanceLevel = quizAnalytics.getPerformanceLevel();

            // Then
            assertEquals("No Data", performanceLevel);
        }
    }

    @Nested
    @DisplayName("ToString Tests")
    class ToStringTests {

        @Test
        @DisplayName("Should include all key properties in toString output")
        void shouldIncludeAllPropertiesInToString() {
            // Given
            quizAnalytics.setQuizId(SAMPLE_QUIZ_ID);
            quizAnalytics.setQuizTitle(SAMPLE_QUIZ_TITLE);
            quizAnalytics.setTotalAttempts(TOTAL_ATTEMPTS);
            quizAnalytics.setCompletedAttempts(COMPLETED_ATTEMPTS);
            quizAnalytics.setUniqueStudents(UNIQUE_STUDENTS);
            quizAnalytics.setAverageScore(75.0);
            quizAnalytics.setCompletionRate(COMPLETION_RATE);
            quizAnalytics.setAverageTimeSpent(AVERAGE_TIME_SPENT);

            // When
            String result = quizAnalytics.toString();

            // Then
            assertAll("ToString should contain all key properties",
                    () -> assertTrue(result.contains("quizId=1")),
                    () -> assertTrue(result.contains("quizTitle='Test Quiz'")),
                    () -> assertTrue(result.contains("totalAttempts=100")),
                    () -> assertTrue(result.contains("completedAttempts=80")),
                    () -> assertTrue(result.contains("uniqueStudents=50")),
                    () -> assertTrue(result.contains("averageScore=75.0")),
                    () -> assertTrue(result.contains("completionRate=80.0")),
                    () -> assertTrue(result.contains("averageTimeSpent=15.5")),
                    () -> assertTrue(result.contains("performanceLevel='Good'")));
        }
    }

    // Helper methods for creating test data
    private Map<String, Integer> createSampleScoreDistribution() {
        Map<String, Integer> scoreDistribution = new HashMap<>();
        scoreDistribution.put("0-20", 5);
        scoreDistribution.put("21-40", 10);
        scoreDistribution.put("41-60", 15);
        scoreDistribution.put("61-80", 25);
        scoreDistribution.put("81-100", 45);
        return scoreDistribution;
    }

    private List<QuestionAnalyticsDTO> createSampleQuestionAnalytics() {
        return Arrays.asList(
                new QuestionAnalyticsDTO(1L, "Question 1", "MULTIPLE_CHOICE"),
                new QuestionAnalyticsDTO(2L, "Question 2", "TRUE_FALSE"));
    }

    private List<TimeBasedAnalyticsDTO> createSampleTimeBasedAnalytics() {
        return Arrays.asList(
                new TimeBasedAnalyticsDTO("2024-01-01", 10, 75.0, 8),
                new TimeBasedAnalyticsDTO("2024-01-02", 15, 80.0, 12));
    }

    private List<StudentPerformanceDTO> createSampleTopPerformers() {
        return Arrays.asList(
                new StudentPerformanceDTO(1L, "John Doe", "STU001"),
                new StudentPerformanceDTO(2L, "Jane Smith", "STU002"));
    }
}