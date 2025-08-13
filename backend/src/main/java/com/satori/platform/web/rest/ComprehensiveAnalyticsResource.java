package com.satori.platform.web.rest;

import com.satori.platform.security.AuthoritiesConstants;
import com.satori.platform.security.SecurityUtils;
import com.satori.platform.service.ComprehensiveAnalyticsService;
import com.satori.platform.service.dto.ComprehensiveAnalyticsDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

/**
 * REST controller for managing comprehensive analytics.
 */
@RestController
@RequestMapping("/api/analytics")
public class ComprehensiveAnalyticsResource {

    private final Logger log = LoggerFactory.getLogger(ComprehensiveAnalyticsResource.class);

    private final ComprehensiveAnalyticsService comprehensiveAnalyticsService;

    public ComprehensiveAnalyticsResource(ComprehensiveAnalyticsService comprehensiveAnalyticsService) {
        this.comprehensiveAnalyticsService = comprehensiveAnalyticsService;
    }

    /**
     * GET /comprehensive : Get comprehensive analytics for admins
     *
     * @param timeRange the time range for analytics (week, month, quarter, year)
     * @return the ResponseEntity with status 200 (OK) and comprehensive analytics
     *         data
     */
    @GetMapping("/comprehensive")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<ComprehensiveAnalyticsDTO> getComprehensiveAnalytics(
            @RequestParam(defaultValue = "month") String timeRange) {
        log.debug("REST request to get comprehensive analytics for time range: {}", timeRange);

        ComprehensiveAnalyticsDTO analytics = comprehensiveAnalyticsService.getComprehensiveAnalytics(timeRange);
        return ResponseEntity.ok(analytics);
    }

    /**
     * GET /comprehensive/teacher : Get comprehensive analytics for teachers
     *
     * @param timeRange the time range for analytics (week, month, quarter, year)
     * @return the ResponseEntity with status 200 (OK) and teacher-specific
     *         analytics data
     */
    @GetMapping("/comprehensive/teacher")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.TEACHER + "') or hasAuthority('" + AuthoritiesConstants.ADMIN
            + "')")
    public ResponseEntity<ComprehensiveAnalyticsDTO> getTeacherAnalytics(
            @RequestParam(defaultValue = "month") String timeRange) {
        log.debug("REST request to get teacher analytics for time range: {}", timeRange);

        String currentUserId = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new RuntimeException("Current user login not found"));

        ComprehensiveAnalyticsDTO analytics = comprehensiveAnalyticsService.getTeacherAnalytics(currentUserId,
                timeRange);
        return ResponseEntity.ok(analytics);
    }

    /**
     * GET /comprehensive/teacher/{teacherId} : Get comprehensive analytics for a
     * specific teacher (admin only)
     *
     * @param teacherId the ID of the teacher
     * @param timeRange the time range for analytics (week, month, quarter, year)
     * @return the ResponseEntity with status 200 (OK) and teacher-specific
     *         analytics data
     */
    @GetMapping("/comprehensive/teacher/{teacherId}")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "')")
    public ResponseEntity<ComprehensiveAnalyticsDTO> getSpecificTeacherAnalytics(
            @PathVariable String teacherId,
            @RequestParam(defaultValue = "month") String timeRange) {
        log.debug("REST request to get analytics for teacher: {} and time range: {}", teacherId, timeRange);

        ComprehensiveAnalyticsDTO analytics = comprehensiveAnalyticsService.getTeacherAnalytics(teacherId, timeRange);
        return ResponseEntity.ok(analytics);
    }

    /**
     * GET /comprehensive/course-performance : Get course performance metrics
     *
     * @param timeRange the time range for analytics
     * @return the ResponseEntity with status 200 (OK) and course performance data
     */
    @GetMapping("/comprehensive/course-performance")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "') or hasAuthority('" + AuthoritiesConstants.TEACHER
            + "')")
    public ResponseEntity<ComprehensiveAnalyticsDTO.CoursePerformanceMetrics> getCoursePerformanceMetrics(
            @RequestParam(defaultValue = "month") String timeRange) {
        log.debug("REST request to get course performance metrics for time range: {}", timeRange);

        ComprehensiveAnalyticsDTO analytics = comprehensiveAnalyticsService.getComprehensiveAnalytics(timeRange);
        return ResponseEntity.ok(analytics.getCoursePerformance());
    }

    /**
     * GET /comprehensive/student-engagement : Get student engagement metrics
     *
     * @param timeRange the time range for analytics
     * @return the ResponseEntity with status 200 (OK) and student engagement data
     */
    @GetMapping("/comprehensive/student-engagement")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "') or hasAuthority('" + AuthoritiesConstants.TEACHER
            + "')")
    public ResponseEntity<ComprehensiveAnalyticsDTO.StudentEngagementMetrics> getStudentEngagementMetrics(
            @RequestParam(defaultValue = "month") String timeRange) {
        log.debug("REST request to get student engagement metrics for time range: {}", timeRange);

        ComprehensiveAnalyticsDTO analytics = comprehensiveAnalyticsService.getComprehensiveAnalytics(timeRange);
        return ResponseEntity.ok(analytics.getStudentEngagement());
    }

    /**
     * GET /comprehensive/learning-path : Get learning path analytics
     *
     * @param timeRange the time range for analytics
     * @return the ResponseEntity with status 200 (OK) and learning path data
     */
    @GetMapping("/comprehensive/learning-path")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "') or hasAuthority('" + AuthoritiesConstants.TEACHER
            + "')")
    public ResponseEntity<ComprehensiveAnalyticsDTO.LearningPathAnalytics> getLearningPathAnalytics(
            @RequestParam(defaultValue = "month") String timeRange) {
        log.debug("REST request to get learning path analytics for time range: {}", timeRange);

        ComprehensiveAnalyticsDTO analytics = comprehensiveAnalyticsService.getComprehensiveAnalytics(timeRange);
        return ResponseEntity.ok(analytics.getLearningPath());
    }

    /**
     * GET /comprehensive/comparative : Get comparative analytics
     *
     * @param timeRange the time range for analytics
     * @return the ResponseEntity with status 200 (OK) and comparative analytics
     *         data
     */
    @GetMapping("/comprehensive/comparative")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.ADMIN + "') or hasAuthority('" + AuthoritiesConstants.TEACHER
            + "')")
    public ResponseEntity<ComprehensiveAnalyticsDTO.ComparativeAnalytics> getComparativeAnalytics(
            @RequestParam(defaultValue = "month") String timeRange) {
        log.debug("REST request to get comparative analytics for time range: {}", timeRange);

        ComprehensiveAnalyticsDTO analytics = comprehensiveAnalyticsService.getComprehensiveAnalytics(timeRange);
        return ResponseEntity.ok(analytics.getComparative());
    }
}