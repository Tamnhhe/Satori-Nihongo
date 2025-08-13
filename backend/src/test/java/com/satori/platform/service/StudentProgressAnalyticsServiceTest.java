package com.satori.platform.service;

import com.satori.platform.domain.*;
import com.satori.platform.repository.*;
import com.satori.platform.service.dto.StudentProgressDTO;
import com.satori.platform.service.dto.CourseProgressDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class StudentProgressAnalyticsServiceTest {

    @Mock
    private StudentQuizRepository studentQuizRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private CourseRepository courseRepository;

    @Mock
    private CourseClassRepository courseClassRepository;

    @InjectMocks
    private StudentProgressAnalyticsService studentProgressAnalyticsService;

    private UserProfile testStudent;
    private Course testCourse;
    private Quiz testQuiz;
    private StudentQuiz testStudentQuiz;

    @BeforeEach
    void setUp() {
        // Create test student
        testStudent = new UserProfile();
        testStudent.setId(1L);
        testStudent.setFullName("Test Student");

        // Create test course
        testCourse = new Course();
        testCourse.setId(1L);
        testCourse.setTitle("Test Course");

        // Create test quiz
        testQuiz = new Quiz();
        testQuiz.setId(1L);
        testQuiz.setTitle("Test Quiz");
        testQuiz.addCourse(testCourse);

        // Create test student quiz
        testStudentQuiz = new StudentQuiz();
        testStudentQuiz.setId(1L);
        testStudentQuiz.setStudent(testStudent);
        testStudentQuiz.setQuiz(testQuiz);
        testStudentQuiz.setScore(85.0);
        testStudentQuiz.setCompleted(true);
        testStudentQuiz.setStartTime(Instant.now().minusSeconds(3600));
        testStudentQuiz.setEndTime(Instant.now());
    }

    @Test
    void getStudentProgressData_ShouldReturnProgressData() {
        // Given
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();

        List<StudentQuiz> mockQuizzes = Arrays.asList(testStudentQuiz);
        when(studentQuizRepository.findByDateRangeAndFilters(any(Instant.class), any(Instant.class), isNull(),
                isNull()))
                .thenReturn(mockQuizzes);

        when(courseRepository.findById(1L)).thenReturn(Optional.of(testCourse));

        // When
        List<StudentProgressDTO> result = studentProgressAnalyticsService.getStudentProgressData(
                startDate, endDate, null, null);

        // Then
        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getStudentId()).isEqualTo(1L);
        assertThat(result.get(0).getStudentName()).isEqualTo("Test Student");
        assertThat(result.get(0).getCourseId()).isEqualTo(1L);
        assertThat(result.get(0).getCourseName()).isEqualTo("Test Course");
        assertThat(result.get(0).getScore()).isEqualTo(85.0);
    }

    @Test
    void getCourseProgressData_ShouldReturnCourseProgress() {
        // Given
        List<Course> mockCourses = Arrays.asList(testCourse);
        when(courseRepository.findAll()).thenReturn(mockCourses);
        when(courseClassRepository.findByCourseId(1L, Pageable.unpaged())).thenReturn(Page.empty());
        when(studentQuizRepository.findByCourseId(1L)).thenReturn(Arrays.asList(testStudentQuiz));

        // When
        List<CourseProgressDTO> result = studentProgressAnalyticsService.getCourseProgressData(null);

        // Then
        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getCourseId()).isEqualTo(1L);
        assertThat(result.get(0).getCourseName()).isEqualTo("Test Course");
        assertThat(result.get(0).getAverageScore()).isEqualTo(85.0);
    }

    @Test
    void getDetailedStudentProgress_ShouldReturnDetailedData() {
        // Given
        LocalDate startDate = LocalDate.now().minusDays(7);
        LocalDate endDate = LocalDate.now();
        Long studentId = 1L;
        Long courseId = 1L;

        List<StudentQuiz> mockQuizzes = Arrays.asList(testStudentQuiz);
        when(studentQuizRepository.findByDateRangeAndFilters(any(Instant.class), any(Instant.class), eq(courseId),
                eq(studentId)))
                .thenReturn(mockQuizzes);

        when(courseRepository.findById(1L)).thenReturn(Optional.of(testCourse));

        // When
        List<StudentProgressDTO> result = studentProgressAnalyticsService.getDetailedStudentProgress(
                studentId, courseId, startDate, endDate);

        // Then
        assertThat(result).isNotEmpty();
        assertThat(result.get(0).getStudentId()).isEqualTo(studentId);
        assertThat(result.get(0).getCourseId()).isEqualTo(courseId);
    }

    @Test
    void getProgressSummary_ShouldReturnSummaryData() {
        // Given
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();

        List<StudentQuiz> mockQuizzes = Arrays.asList(testStudentQuiz);
        when(studentQuizRepository.findByDateRangeAndFilters(any(Instant.class), any(Instant.class), isNull(),
                isNull()))
                .thenReturn(mockQuizzes);

        when(courseRepository.findById(1L)).thenReturn(Optional.of(testCourse));
        when(courseRepository.findAll()).thenReturn(Arrays.asList(testCourse));
        when(courseClassRepository.findByCourseId(1L, Pageable.unpaged())).thenReturn(Page.empty());
        when(studentQuizRepository.findByCourseId(1L)).thenReturn(Arrays.asList(testStudentQuiz));

        // When
        Map<String, Object> result = studentProgressAnalyticsService.getProgressSummary(
                startDate, endDate, null, null);

        // Then
        assertThat(result).isNotEmpty();
        assertThat(result.get("averageScore")).isEqualTo(85.0);
        assertThat(result.get("totalQuizzes")).isEqualTo(1);
        assertThat(result.get("activeStudents")).isEqualTo(1L);
        assertThat(result.get("totalCourses")).isEqualTo(1);
    }

    @Test
    void getStudentProgressData_WithEmptyData_ShouldReturnEmptyList() {
        // Given
        LocalDate startDate = LocalDate.now().minusDays(30);
        LocalDate endDate = LocalDate.now();

        when(studentQuizRepository.findByDateRangeAndFilters(any(Instant.class), any(Instant.class), isNull(),
                isNull()))
                .thenReturn(new ArrayList<>());

        // When
        List<StudentProgressDTO> result = studentProgressAnalyticsService.getStudentProgressData(
                startDate, endDate, null, null);

        // Then
        assertThat(result).isEmpty();
    }
}