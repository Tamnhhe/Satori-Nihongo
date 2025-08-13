package com.satori.platform.web.rest;

import com.satori.platform.service.QuizAnalyticsService;
import com.satori.platform.service.dto.QuizAnalyticsDTO;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for Quiz Analytics.
 */
@RestController
@RequestMapping("/api/admin/quiz-analytics")
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
public class QuizAnalyticsResource {

    private static final Logger LOG = LoggerFactory.getLogger(QuizAnalyticsResource.class);

    private final QuizAnalyticsService quizAnalyticsService;

    public QuizAnalyticsResource(QuizAnalyticsService quizAnalyticsService) {
        this.quizAnalyticsService = quizAnalyticsService;
    }

    /**
     * GET /api/admin/quiz-analytics/{id} : Get comprehensive analytics for a quiz.
     */
    @GetMapping("/{id}")
    public ResponseEntity<QuizAnalyticsDTO> getQuizAnalytics(@PathVariable Long id) {
        LOG.debug("REST request to get Quiz Analytics : {}", id);

        QuizAnalyticsDTO analytics = quizAnalyticsService.getQuizAnalytics(id);
        return ResponseEntity.ok(analytics);
    }

    /**
     * GET /api/admin/quiz-analytics/summary : Get analytics summary for multiple
     * quizzes.
     */
    @GetMapping("/summary")
    public ResponseEntity<List<QuizAnalyticsDTO>> getQuizAnalyticsSummary(
            @RequestParam List<Long> quizIds) {
        LOG.debug("REST request to get Quiz Analytics Summary for: {}", quizIds);

        List<QuizAnalyticsDTO> summaries = quizAnalyticsService.getQuizAnalyticsSummary(quizIds);
        return ResponseEntity.ok(summaries);
    }

    /**
     * GET /api/admin/quiz-analytics/{id}/export : Export quiz results to CSV.
     */
    @GetMapping("/{id}/export")
    public ResponseEntity<String> exportQuizResults(@PathVariable Long id) {
        LOG.debug("REST request to export Quiz Results : {}", id);

        String csvData = quizAnalyticsService.exportQuizResults(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "quiz_results_" + id + ".csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }

    /**
     * GET /api/admin/quiz-analytics/{id}/export-analytics : Export comprehensive
     * quiz analytics to CSV.
     */
    @GetMapping("/{id}/export-analytics")
    public ResponseEntity<String> exportQuizAnalytics(@PathVariable Long id) {
        LOG.debug("REST request to export Quiz Analytics : {}", id);

        String csvData = quizAnalyticsService.exportQuizAnalytics(id);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.TEXT_PLAIN);
        headers.setContentDispositionFormData("attachment", "quiz_analytics_" + id + ".csv");

        return ResponseEntity.ok()
                .headers(headers)
                .body(csvData);
    }
}