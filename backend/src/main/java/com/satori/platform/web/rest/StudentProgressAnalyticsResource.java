package com.satori.platform.web.rest;

import com.satori.platform.service.StudentProgressAnalyticsService;
import com.satori.platform.service.dto.StudentProgressDTO;
import com.satori.platform.service.dto.CourseProgressDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing student progress analytics.
 */
@RestController
@RequestMapping("/api/analytics")
public class StudentProgressAnalyticsResource {

    private final Logger log = LoggerFactory.getLogger(StudentProgressAnalyticsResource.class);

    private final StudentProgressAnalyticsService studentProgressAnalyticsService;

    public StudentProgressAnalyticsResource(StudentProgressAnalyticsService studentProgressAnalyticsService) {
        this.studentProgressAnalyticsService = studentProgressAnalyticsService;
    }

    /**
     * GET /api/analytics/student-progress : Get student progress data for charts
     *
     * @param startDate the start date for the data range
     * @param endDate   the end date for the data range
     * @param courseId  optional course filter
     * @param studentId optional student filter
     * @return the ResponseEntity with status 200 (OK) and the list of student
     *         progress data
     */
    @GetMapping("/student-progress")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<List<StudentProgressDTO>> getStudentProgressData(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Long studentId) {

        log.debug("REST request to get student progress data from {} to {}, courseId: {}, studentId: {}",
                startDate, endDate, courseId, studentId);

        List<StudentProgressDTO> result = studentProgressAnalyticsService.getStudentProgressData(
                startDate, endDate, courseId, studentId);

        return ResponseEntity.ok().body(result);
    }

    /**
     * GET /api/analytics/course-progress : Get course progress data
     *
     * @param teacherId optional teacher filter (for teachers to see only their
     *                  courses)
     * @return the ResponseEntity with status 200 (OK) and the list of course
     *         progress data
     */
    @GetMapping("/course-progress")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<List<CourseProgressDTO>> getCourseProgressData(
            @RequestParam(required = false) Long teacherId) {

        log.debug("REST request to get course progress data for teacher: {}", teacherId);

        List<CourseProgressDTO> result = studentProgressAnalyticsService.getCourseProgressData(teacherId);

        return ResponseEntity.ok().body(result);
    }

    /**
     * GET /api/analytics/student-progress/detailed : Get detailed student progress
     * for drill-down
     *
     * @param studentId the student ID
     * @param courseId  optional course filter
     * @param startDate the start date for the data range
     * @param endDate   the end date for the data range
     * @return the ResponseEntity with status 200 (OK) and the detailed progress
     *         data
     */
    @GetMapping("/student-progress/detailed")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<List<StudentProgressDTO>> getDetailedStudentProgress(
            @RequestParam Long studentId,
            @RequestParam(required = false) Long courseId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        log.debug("REST request to get detailed student progress for student: {}, course: {}", studentId, courseId);

        List<StudentProgressDTO> result = studentProgressAnalyticsService.getDetailedStudentProgress(
                studentId, courseId, startDate, endDate);

        return ResponseEntity.ok().body(result);
    }

    /**
     * GET /api/analytics/progress-summary : Get progress summary statistics
     *
     * @param startDate the start date for the data range
     * @param endDate   the end date for the data range
     * @param courseId  optional course filter
     * @param teacherId optional teacher filter
     * @return the ResponseEntity with status 200 (OK) and the summary data
     */
    @GetMapping("/progress-summary")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<Map<String, Object>> getProgressSummary(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) Long courseId,
            @RequestParam(required = false) Long teacherId) {

        log.debug("REST request to get progress summary from {} to {}", startDate, endDate);

        Map<String, Object> result = studentProgressAnalyticsService.getProgressSummary(
                startDate, endDate, courseId, teacherId);

        return ResponseEntity.ok().body(result);
    }
}