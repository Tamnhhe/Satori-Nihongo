package com.satori.platform.web.rest;

import com.satori.platform.service.StudentAnalyticsService;
import com.satori.platform.service.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

/**
 * REST controller for managing student analytics and progress tracking.
 */
@RestController
@RequestMapping("/api/student-analytics")
public class StudentAnalyticsResource {

    private static final Logger log = LoggerFactory.getLogger(StudentAnalyticsResource.class);

    private final StudentAnalyticsService studentAnalyticsService;

    public StudentAnalyticsResource(StudentAnalyticsService studentAnalyticsService) {
        this.studentAnalyticsService = studentAnalyticsService;
    }

    /**
     * GET /api/student-analytics/{studentId} : Get comprehensive analytics for a
     * student.
     *
     * @param studentId the ID of the student
     * @return the ResponseEntity with status 200 (OK) and the analytics data
     */
    @GetMapping("/{studentId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or (hasRole('STUDENT') and #studentId == authentication.principal.id)")
    public ResponseEntity<StudentAnalyticsDTO> getStudentAnalytics(@PathVariable Long studentId) {
        log.debug("REST request to get analytics for student: {}", studentId);

        StudentAnalyticsDTO analytics = studentAnalyticsService.getStudentAnalytics(studentId);
        return ResponseEntity.ok(analytics);
    }

    /**
     * GET /api/student-analytics/{studentId}/course-performance : Get course
     * performance comparison.
     *
     * @param studentId the ID of the student
     * @return the ResponseEntity with status 200 (OK) and the course performance
     *         data
     */
    @GetMapping("/{studentId}/course-performance")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or (hasRole('STUDENT') and #studentId == authentication.principal.id)")
    public ResponseEntity<Map<String, CoursePerformanceDTO>> getCoursePerformanceComparison(
            @PathVariable Long studentId) {
        log.debug("REST request to get course performance comparison for student: {}", studentId);

        Map<String, CoursePerformanceDTO> coursePerformance = studentAnalyticsService
                .getCoursePerformanceComparison(studentId);
        return ResponseEntity.ok(coursePerformance);
    }

    /**
     * GET /api/student-analytics/{studentId}/progress-report : Generate progress
     * report for export.
     *
     * @param studentId the ID of the student
     * @param startDate the start date for the report period
     * @param endDate   the end date for the report period
     * @return the ResponseEntity with status 200 (OK) and the progress report
     */
    @GetMapping("/{studentId}/progress-report")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or (hasRole('STUDENT') and #studentId == authentication.principal.id)")
    public ResponseEntity<ProgressReportDTO> generateProgressReport(
            @PathVariable Long studentId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        log.debug("REST request to generate progress report for student: {} from {} to {}", studentId, startDate,
                endDate);

        ProgressReportDTO report = studentAnalyticsService.generateProgressReport(studentId, startDate, endDate);
        return ResponseEntity.ok(report);
    }

    /**
     * GET /api/student-analytics/{studentId}/progress-report/current : Generate
     * current progress report (last 30 days).
     *
     * @param studentId the ID of the student
     * @return the ResponseEntity with status 200 (OK) and the progress report
     */
    @GetMapping("/{studentId}/progress-report/current")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or (hasRole('STUDENT') and #studentId == authentication.principal.id)")
    public ResponseEntity<ProgressReportDTO> generateCurrentProgressReport(@PathVariable Long studentId) {
        log.debug("REST request to generate current progress report for student: {}", studentId);

        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(30);

        ProgressReportDTO report = studentAnalyticsService.generateProgressReport(studentId, startDate, endDate);
        return ResponseEntity.ok(report);
    }

    /**
     * GET /api/student-analytics/{studentId}/progress-report/semester : Generate
     * semester progress report (last 120 days).
     *
     * @param studentId the ID of the student
     * @return the ResponseEntity with status 200 (OK) and the progress report
     */
    @GetMapping("/{studentId}/progress-report/semester")
    @PreAuthorize("hasRole('ADMIN') or hasRole('TEACHER') or (hasRole('STUDENT') and #studentId == authentication.principal.id)")
    public ResponseEntity<ProgressReportDTO> generateSemesterProgressReport(@PathVariable Long studentId) {
        log.debug("REST request to generate semester progress report for student: {}", studentId);

        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(120);

        ProgressReportDTO report = studentAnalyticsService.generateProgressReport(studentId, startDate, endDate);
        return ResponseEntity.ok(report);
    }
}