package com.satori.platform.service;

import com.satori.platform.repository.*;
import com.satori.platform.service.dto.ComprehensiveAnalyticsDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class ComprehensiveAnalyticsServiceTest {

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CourseClassRepository courseClassRepository;

    @Mock
    private StudentProgressRepository studentProgressRepository;

    @Mock
    private StudentQuizRepository studentQuizRepository;

    @Mock
    private UserRepository userRepository;

    private ComprehensiveAnalyticsService comprehensiveAnalyticsService;

    @BeforeEach
    void setUp() {
        comprehensiveAnalyticsService = new ComprehensiveAnalyticsService(
                courseRepository,
                courseClassRepository,
                studentProgressRepository,
                studentQuizRepository,
                userRepository);
    }

    @Test
    void shouldGetComprehensiveAnalytics() {
        // Given
        when(courseRepository.findAll()).thenReturn(new ArrayList<>());
        when(userRepository.findActiveUsersBetween(org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any()))
                .thenReturn(new ArrayList<>());
        when(courseClassRepository.findAll()).thenReturn(new ArrayList<>());

        // When
        ComprehensiveAnalyticsDTO result = comprehensiveAnalyticsService.getComprehensiveAnalytics("month");

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getCoursePerformance()).isNotNull();
        assertThat(result.getStudentEngagement()).isNotNull();
        assertThat(result.getLearningPath()).isNotNull();
        assertThat(result.getComparative()).isNotNull();
        assertThat(result.getGeneratedAt()).isNotNull();
    }

    @Test
    void shouldGetTeacherAnalytics() {
        // Given
        String teacherId = "teacher123";
        when(courseRepository.findByTeacherProfileUserId(teacherId)).thenReturn(new ArrayList<>());
        when(userRepository.findActiveUsersBetween(org.mockito.ArgumentMatchers.any(),
                org.mockito.ArgumentMatchers.any()))
                .thenReturn(new ArrayList<>());
        when(courseClassRepository.findAll()).thenReturn(new ArrayList<>());

        // When
        ComprehensiveAnalyticsDTO result = comprehensiveAnalyticsService.getTeacherAnalytics(teacherId, "month");

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getCoursePerformance()).isNotNull();
        assertThat(result.getStudentEngagement()).isNotNull();
        assertThat(result.getLearningPath()).isNotNull();
        assertThat(result.getComparative()).isNotNull();
        assertThat(result.getGeneratedAt()).isNotNull();
    }
}