package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DifficultyLevel;
import com.satori.platform.domain.enumeration.StudentLevel;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Unit tests for CourseWithStatsDTO improvements.
 */
class CourseWithStatsDTOTest {

    @Test
    void testBuilderPattern() {
        CourseWithStatsDTO dto = CourseWithStatsDTO.builder()
                .title("Japanese N5 Course")
                .courseCode("JP-N5-001")
                .level(StudentLevel.N5)
                .difficultyLevel(DifficultyLevel.BEGINNER)
                .price(99.99)
                .active(true)
                .enrollmentCount(25)
                .lessonsCount(12)
                .build();

        assertThat(dto.getTitle()).isEqualTo("Japanese N5 Course");
        assertThat(dto.getCourseCode()).isEqualTo("JP-N5-001");
        assertThat(dto.getLevel()).isEqualTo(StudentLevel.N5);
        assertThat(dto.getDifficultyLevel()).isEqualTo(DifficultyLevel.BEGINNER);
        assertThat(dto.getPrice()).isEqualTo(99.99);
        assertThat(dto.getActive()).isTrue();
        assertThat(dto.getEnrollmentCount()).isEqualTo(25);
        assertThat(dto.getLessonsCount()).isEqualTo(12);
    }

    @Test
    void testFluentMethods() {
        CourseWithStatsDTO dto = new CourseWithStatsDTO()
                .enrollmentCount(30)
                .lessonsCount(15)
                .level(StudentLevel.N4)
                .price(149.99)
                .active(true);

        assertThat(dto.getEnrollmentCount()).isEqualTo(30);
        assertThat(dto.getLessonsCount()).isEqualTo(15);
        assertThat(dto.getLevel()).isEqualTo(StudentLevel.N4);
        assertThat(dto.getPrice()).isEqualTo(149.99);
        assertThat(dto.getActive()).isTrue();
    }

    @Test
    void testValidationInSetters() {
        CourseWithStatsDTO dto = new CourseWithStatsDTO();

        // Test negative values are converted to 0
        dto.setEnrollmentCount(-5);
        dto.setLessonsCount(-10);
        dto.setPrice(-50.0);

        assertThat(dto.getEnrollmentCount()).isEqualTo(0);
        assertThat(dto.getLessonsCount()).isEqualTo(0);
        assertThat(dto.getPrice()).isEqualTo(0.0);

        // Test completion rate bounds
        dto.setCompletionRate(150.0); // Over 100%
        assertThat(dto.getCompletionRate()).isEqualTo(0.0);

        dto.setCompletionRate(75.5); // Valid value
        assertThat(dto.getCompletionRate()).isEqualTo(75.5);
    }

    @Test
    void testUtilityMethods() {
        CourseWithStatsDTO dto = new CourseWithStatsDTO()
                .enrollmentCount(20)
                .totalEnrollments(100)
                .price(99.99);

        // Test enrollment rate calculation
        assertThat(dto.getEnrollmentRate()).isEqualTo(20.0);

        // Test formatted price
        assertThat(dto.getFormattedPrice()).isEqualTo("$99.99");

        // Test free course
        dto.setPrice(0.0);
        assertThat(dto.getFormattedPrice()).isEqualTo("Free");

        // Test has statistics
        assertThat(dto.hasStatistics()).isTrue();
    }

    @Test
    void testFromCourseDTOFactory() {
        CourseDTO baseDto = new CourseDTO();
        baseDto.setId(1L);
        baseDto.setTitle("Test Course");
        baseDto.setCourseCode("TEST-001");

        CourseWithStatsDTO statsDto = CourseWithStatsDTO.fromCourseDTO(baseDto);

        assertThat(statsDto.getId()).isEqualTo(1L);
        assertThat(statsDto.getTitle()).isEqualTo("Test Course");
        assertThat(statsDto.getCourseCode()).isEqualTo("TEST-001");
        assertThat(statsDto.getEnrollmentCount()).isEqualTo(0); // Default value
    }

    @Test
    void testNullSafetyInConstructor() {
        CourseWithStatsDTO dto = new CourseWithStatsDTO(null);

        // Should not throw exception and have default values
        assertThat(dto.getId()).isNull();
        assertThat(dto.getEnrollmentCount()).isEqualTo(0);
        assertThat(dto.getCompletionRate()).isEqualTo(0.0);
    }
}