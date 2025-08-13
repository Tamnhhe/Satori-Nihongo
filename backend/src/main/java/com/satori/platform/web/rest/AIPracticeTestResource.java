package com.satori.platform.web.rest;

import com.satori.platform.domain.enumeration.DifficultyLevel;
import com.satori.platform.service.AIPracticeTestService;
import com.satori.platform.service.dto.*;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;

/**
 * REST controller for managing AI-powered practice test generation.
 */
@RestController
@RequestMapping("/api/ai-practice-tests")
public class AIPracticeTestResource {

    private static final Logger log = LoggerFactory.getLogger(AIPracticeTestResource.class);

    private static final String ENTITY_NAME = "aiPracticeTest";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AIPracticeTestService aiPracticeTestService;

    public AIPracticeTestResource(AIPracticeTestService aiPracticeTestService) {
        this.aiPracticeTestService = aiPracticeTestService;
    }

    /**
     * {@code POST  /ai-practice-tests} : Generate a new AI practice test.
     *
     * @param request the practice test generation request
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new quiz, or with status {@code 400 (Bad Request)} if the
     *         request is invalid.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<QuizDTO> generatePracticeTest(@Valid @RequestBody AIPracticeTestRequestDTO request)
            throws URISyntaxException {
        log.debug("REST request to generate AI practice test : {}", request);

        if (request.getStudentId() == null) {
            throw new BadRequestAlertException("Student ID is required", ENTITY_NAME, "studentidnull");
        }

        if (request.getCourseId() == null && request.getLessonId() == null) {
            throw new BadRequestAlertException("Either course ID or lesson ID must be provided", ENTITY_NAME,
                    "missingcontext");
        }

        QuizDTO result = aiPracticeTestService.generatePracticeTest(request);

        return ResponseEntity.created(new URI("/api/ai-practice-tests/" + result.getId()))
                .body(result);
    }

    /**
     * {@code POST /ai-practice-tests/course/{courseId}} : Generate a practice test
     * for a specific course.
     *
     * @param courseId        the course ID
     * @param studentId       the student ID
     * @param questionCount   the number of questions to generate
     * @param difficultyLevel the difficulty level
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new quiz.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/course/{courseId}")
    public ResponseEntity<QuizDTO> generateCoursePracticeTest(
            @PathVariable Long courseId,
            @RequestParam Long studentId,
            @RequestParam(required = false) Integer questionCount,
            @RequestParam(required = false) DifficultyLevel difficultyLevel) throws URISyntaxException {

        log.debug("REST request to generate course practice test for course: {} and student: {}", courseId, studentId);

        QuizDTO result = aiPracticeTestService.generateCoursePracticeTest(courseId, studentId, questionCount,
                difficultyLevel);

        return ResponseEntity.created(new URI("/api/ai-practice-tests/" + result.getId()))
                .body(result);
    }

    /**
     * {@code POST /ai-practice-tests/lesson/{lessonId}} : Generate a practice test
     * for a specific lesson.
     *
     * @param lessonId      the lesson ID
     * @param studentId     the student ID
     * @param questionCount the number of questions to generate
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new quiz.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lesson/{lessonId}")
    public ResponseEntity<QuizDTO> generateLessonPracticeTest(
            @PathVariable Long lessonId,
            @RequestParam Long studentId,
            @RequestParam(required = false) Integer questionCount) throws URISyntaxException {

        log.debug("REST request to generate lesson practice test for lesson: {} and student: {}", lessonId, studentId);

        QuizDTO result = aiPracticeTestService.generateLessonPracticeTest(lessonId, studentId, questionCount);

        return ResponseEntity.created(new URI("/api/ai-practice-tests/" + result.getId()))
                .body(result);
    }

    /**
     * {@code GET  /ai-practice-tests/topics} : Get available practice test topics
     * for a student.
     *
     * @param studentId the student ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of topics in body.
     */
    @GetMapping("/topics")
    public ResponseEntity<List<PracticeTestTopicDTO>> getAvailableTopics(@RequestParam Long studentId) {
        log.debug("REST request to get available practice test topics for student: {}", studentId);

        List<PracticeTestTopicDTO> topics = aiPracticeTestService.getAvailableTopics(studentId);

        return ResponseEntity.ok().body(topics);
    }
}