package com.satori.platform.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;

import com.satori.platform.domain.CourseClass;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.repository.CourseClassRepository;
import com.satori.platform.repository.StudentProfileRepository;
import com.satori.platform.service.dto.CourseClassWithStatsDTO;
import com.satori.platform.service.mapper.CourseClassMapper;
import com.satori.platform.service.mapper.StudentProfileMapper;
import java.time.Instant;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class EnhancedCourseClassServiceTest {

    @Mock
    private CourseClassRepository courseClassRepository;

    @Mock
    private StudentProfileRepository studentProfileRepository;

    @Mock
    private CourseClassMapper courseClassMapper;

    @Mock
    private StudentProfileMapper studentProfileMapper;

    private EnhancedCourseClassService enhancedCourseClassService;

    private CourseClass courseClass;
    private StudentProfile student1;
    private StudentProfile student2;
    private StudentProfile student3;

    @BeforeEach
    void setUp() {
        enhancedCourseClassService = new EnhancedCourseClassService(
                courseClassRepository,
                studentProfileRepository,
                courseClassMapper,
                studentProfileMapper);

        // Setup test data
        courseClass = new CourseClass();
        courseClass.setId(1L);
        courseClass.setCode("TEST-001");
        courseClass.setName("Test Class");
        courseClass.setCapacity(2); // Small capacity for testing
        courseClass.setStartDate(Instant.now().plusSeconds(3600));
        courseClass.setEndDate(Instant.now().plusSeconds(7200));
        courseClass.setStudents(new HashSet<>());

        student1 = new StudentProfile();
        student1.setId(1L);
        student1.setStudentId("STU001");

        student2 = new StudentProfile();
        student2.setId(2L);
        student2.setStudentId("STU002");

        student3 = new StudentProfile();
        student3.setId(3L);
        student3.setStudentId("STU003");
    }

    @Test
    void testBulkEnrollmentWithinCapacity() {
        // Given
        when(courseClassRepository.findOneWithEagerRelationships(1L)).thenReturn(Optional.of(courseClass));
        when(studentProfileRepository.findAllById(Arrays.asList(1L, 2L))).thenReturn(Arrays.asList(student1, student2));
        when(courseClassRepository.save(any(CourseClass.class))).thenReturn(courseClass);

        // When
        EnhancedCourseClassService.EnrollmentResult result = enhancedCourseClassService
                .addMultipleStudentsToClass(1L, Arrays.asList(1L, 2L), false);

        // Then
        assertThat(result.getCourseClass()).isPresent();
        assertThat(result.getEnrolled()).isEqualTo(2);
        assertThat(result.getWaitlisted()).isEqualTo(0);
        assertThat(result.getRejected()).isEqualTo(0);
        assertThat(result.getAlreadyEnrolled()).isEqualTo(0);
    }

    @Test
    void testBulkEnrollmentWithWaitlist() {
        // Given - class already has 2 students (at capacity)
        Set<StudentProfile> existingStudents = new HashSet<>();
        existingStudents.add(student1);
        existingStudents.add(student2);
        courseClass.setStudents(existingStudents);

        when(courseClassRepository.findOneWithEagerRelationships(1L)).thenReturn(Optional.of(courseClass));
        when(studentProfileRepository.findAllById(Arrays.asList(3L))).thenReturn(Arrays.asList(student3));
        when(courseClassRepository.save(any(CourseClass.class))).thenReturn(courseClass);

        // When - try to add one more student with waitlist enabled
        EnhancedCourseClassService.EnrollmentResult result = enhancedCourseClassService
                .addMultipleStudentsToClass(1L, Arrays.asList(3L), true);

        // Then
        assertThat(result.getCourseClass()).isPresent();
        assertThat(result.getEnrolled()).isEqualTo(0);
        assertThat(result.getWaitlisted()).isEqualTo(1);
        assertThat(result.getRejected()).isEqualTo(0);
        assertThat(result.getAlreadyEnrolled()).isEqualTo(0);
    }

    @Test
    void testBulkEnrollmentWithoutWaitlist() {
        // Given - class already has 2 students (at capacity)
        Set<StudentProfile> existingStudents = new HashSet<>();
        existingStudents.add(student1);
        existingStudents.add(student2);
        courseClass.setStudents(existingStudents);

        when(courseClassRepository.findOneWithEagerRelationships(1L)).thenReturn(Optional.of(courseClass));
        when(studentProfileRepository.findAllById(Arrays.asList(3L))).thenReturn(Arrays.asList(student3));
        when(courseClassRepository.save(any(CourseClass.class))).thenReturn(courseClass);

        // When - try to add one more student without waitlist
        EnhancedCourseClassService.EnrollmentResult result = enhancedCourseClassService
                .addMultipleStudentsToClass(1L, Arrays.asList(3L), false);

        // Then
        assertThat(result.getCourseClass()).isPresent();
        assertThat(result.getEnrolled()).isEqualTo(0);
        assertThat(result.getWaitlisted()).isEqualTo(0);
        assertThat(result.getRejected()).isEqualTo(1);
        assertThat(result.getAlreadyEnrolled()).isEqualTo(0);
    }

    @Test
    void testAddStudentWithWaitlist() {
        // Given - class already has 2 students (at capacity)
        Set<StudentProfile> existingStudents = new HashSet<>();
        existingStudents.add(student1);
        existingStudents.add(student2);
        courseClass.setStudents(existingStudents);

        when(courseClassRepository.findOneWithEagerRelationships(1L)).thenReturn(Optional.of(courseClass));
        when(studentProfileRepository.findById(3L)).thenReturn(Optional.of(student3));
        when(courseClassRepository.save(any(CourseClass.class))).thenReturn(courseClass);

        // When - add student with forceAdd = true (waitlist)
        Optional<CourseClassWithStatsDTO> result = enhancedCourseClassService
                .addStudentToClass(1L, 3L, true);

        // Then
        assertThat(result).isPresent();
        // Verify student was added to the class (over capacity)
        assertThat(courseClass.getStudents()).hasSize(3);
    }

    @Test
    void testAddStudentWithoutWaitlist() {
        // Given - class already has 2 students (at capacity)
        Set<StudentProfile> existingStudents = new HashSet<>();
        existingStudents.add(student1);
        existingStudents.add(student2);
        courseClass.setStudents(existingStudents);

        when(courseClassRepository.findOneWithEagerRelationships(1L)).thenReturn(Optional.of(courseClass));
        when(studentProfileRepository.findById(3L)).thenReturn(Optional.of(student3));

        // When - add student with forceAdd = false (no waitlist)
        Optional<CourseClassWithStatsDTO> result = enhancedCourseClassService
                .addStudentToClass(1L, 3L, false);

        // Then
        assertThat(result).isEmpty();
        // Verify student was not added to the class
        assertThat(courseClass.getStudents()).hasSize(2);
    }
}