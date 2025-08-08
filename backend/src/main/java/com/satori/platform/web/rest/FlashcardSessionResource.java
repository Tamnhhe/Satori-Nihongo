package com.satori.platform.web.rest;

import com.satori.platform.domain.enumeration.DifficultyLevel;
import com.satori.platform.service.FlashcardService;
import com.satori.platform.service.dto.FlashcardDTO;
import com.satori.platform.service.dto.FlashcardSessionDTO;
import com.satori.platform.service.dto.FlashcardPerformanceDTO;
import com.satori.platform.service.dto.FlashcardReviewScheduleDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST controller for managing flashcard sessions and spaced repetition.
 */
@RestController
@RequestMapping("/api/flashcard-sessions")
public class FlashcardSessionResource {

    private static final Logger LOG = LoggerFactory.getLogger(FlashcardSessionResource.class);

    private final FlashcardService flashcardService;

    public FlashcardSessionResource(FlashcardService flashcardService) {
        this.flashcardService = flashcardService;
    }

    /**
     * GET /api/flashcard-sessions/lesson/{lessonId}/flashcards : Get flashcards for
     * a lesson
     */
    @GetMapping("/lesson/{lessonId}/flashcards")
    public ResponseEntity<List<FlashcardDTO>> getFlashcardsForLesson(@PathVariable Long lessonId) {
        LOG.debug("REST request to get flashcards for lesson: {}", lessonId);
        List<FlashcardDTO> flashcards = flashcardService.getFlashcardsForLesson(lessonId);
        return ResponseEntity.ok(flashcards);
    }

    /**
     * POST /api/flashcard-sessions/start : Start a new flashcard session
     */
    @PostMapping("/start")
    public ResponseEntity<FlashcardSessionDTO> startFlashcardSession(
            @RequestParam Long studentId,
            @RequestParam Long lessonId,
            @RequestParam(required = false) DifficultyLevel difficultyLevel) {

        LOG.debug("REST request to start flashcard session for student: {}, lesson: {}", studentId, lessonId);

        FlashcardSessionDTO session = flashcardService.startFlashcardSession(studentId, lessonId, difficultyLevel);
        return ResponseEntity.ok(session);
    }

    /**
     * PUT /api/flashcard-sessions/{sessionId}/response : Record a flashcard
     * response
     */
    @PutMapping("/{sessionId}/response")
    public ResponseEntity<FlashcardSessionDTO> recordFlashcardResponse(
            @PathVariable Long sessionId,
            @RequestParam Long flashcardId,
            @RequestParam Boolean correct) {

        LOG.debug("REST request to record response for session: {}, flashcard: {}, correct: {}",
                sessionId, flashcardId, correct);

        FlashcardSessionDTO session = flashcardService.recordFlashcardResponse(sessionId, flashcardId, correct);
        return ResponseEntity.ok(session);
    }

    /**
     * PUT /api/flashcard-sessions/{sessionId}/complete : Complete a flashcard
     * session
     */
    @PutMapping("/{sessionId}/complete")
    public ResponseEntity<FlashcardSessionDTO> completeFlashcardSession(@PathVariable Long sessionId) {
        LOG.debug("REST request to complete flashcard session: {}", sessionId);

        FlashcardSessionDTO session = flashcardService.completeFlashcardSession(sessionId);
        return ResponseEntity.ok(session);
    }

    /**
     * GET /api/flashcard-sessions/student/{studentId}/review : Get flashcards
     * needing review
     */
    @GetMapping("/student/{studentId}/review")
    public ResponseEntity<List<FlashcardDTO>> getReviewFlashcards(@PathVariable Long studentId) {
        LOG.debug("REST request to get review flashcards for student: {}", studentId);

        List<FlashcardDTO> reviewFlashcards = flashcardService.getReviewFlashcards(studentId);
        return ResponseEntity.ok(reviewFlashcards);
    }

    /**
     * GET /api/flashcard-sessions/student/{studentId}/lesson/{lessonId}/performance
     * : Get performance analytics
     */
    @GetMapping("/student/{studentId}/lesson/{lessonId}/performance")
    public ResponseEntity<FlashcardPerformanceDTO> getStudentPerformance(
            @PathVariable Long studentId,
            @PathVariable Long lessonId) {

        LOG.debug("REST request to get performance for student: {}, lesson: {}", studentId, lessonId);

        FlashcardPerformanceDTO performance = flashcardService.getStudentPerformance(studentId, lessonId);
        return ResponseEntity.ok(performance);
    }

    /**
     * GET /api/flashcard-sessions/student/{studentId}/review-schedule : Get review
     * schedule
     */
    @GetMapping("/student/{studentId}/review-schedule")
    public ResponseEntity<FlashcardReviewScheduleDTO> getReviewSchedule(@PathVariable Long studentId) {
        LOG.debug("REST request to get review schedule for student: {}", studentId);

        FlashcardReviewScheduleDTO schedule = flashcardService.getReviewSchedule(studentId);
        return ResponseEntity.ok(schedule);
    }
}