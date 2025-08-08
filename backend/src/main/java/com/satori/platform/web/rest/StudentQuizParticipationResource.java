package com.satori.platform.web.rest;

import com.satori.platform.service.StudentQuizService;
import com.satori.platform.service.dto.*;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing student quiz participation.
 */
@RestController
@RequestMapping("/api/student-quiz-participation")
public class StudentQuizParticipationResource {

    private static final Logger LOG = LoggerFactory.getLogger(StudentQuizParticipationResource.class);

    private static final String ENTITY_NAME = "studentQuizParticipation";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StudentQuizService studentQuizService;

    public StudentQuizParticipationResource(StudentQuizService studentQuizService) {
        this.studentQuizService = studentQuizService;
    }

    /**
     * {@code POST  /start} : Start a new quiz attempt.
     *
     * @param quizId    the quiz ID
     * @param studentId the student ID
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new quiz session
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/start")
    public ResponseEntity<QuizSessionDTO> startQuizAttempt(
            @RequestParam Long quizId,
            @RequestParam Long studentId) throws URISyntaxException {
        LOG.debug("REST request to start quiz attempt for quiz: {} and student: {}", quizId, studentId);

        QuizSessionDTO result = studentQuizService.startQuizAttempt(quizId, studentId);
        return ResponseEntity.created(new URI("/api/student-quiz-participation/session/" + result.getStudentQuizId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                        result.getStudentQuizId().toString()))
                .body(result);
    }

    /**
     * {@code GET /session/{studentQuizId}} : Get the current quiz session.
     *
     * @param studentQuizId the student quiz ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the quiz
     *         session in body
     */
    @GetMapping("/session/{studentQuizId}")
    public ResponseEntity<QuizSessionDTO> getQuizSession(@PathVariable Long studentQuizId) {
        LOG.debug("REST request to get quiz session: {}", studentQuizId);

        Optional<StudentQuizDTO> studentQuiz = studentQuizService.findOne(studentQuizId);
        if (studentQuiz.isEmpty()) {
            throw new BadRequestAlertException("Student quiz not found", ENTITY_NAME, "notfound");
        }

        // Build session from existing student quiz - this could be enhanced
        // For now, we'll use the existing findOne method
        return ResponseUtil.wrapOrNotFound(studentQuiz.map(sq -> {
            QuizSessionDTO session = new QuizSessionDTO();
            session.setStudentQuizId(sq.getId());
            session.setStartTime(sq.getStartTime());
            session.setEndTime(sq.getEndTime());
            session.setCompleted(sq.getCompleted());
            session.setPaused(sq.getPaused());
            session.setScore(sq.getScore());
            session.setCurrentQuestionIndex(sq.getCurrentQuestionIndex());
            session.setTotalQuestions(sq.getTotalQuestions());
            session.setCorrectAnswers(sq.getCorrectAnswers());
            session.setAutoSubmitted(sq.getSubmittedAutomatically());
            return session;
        }));
    }

    /**
     * {@code POST  /answer} : Submit an answer for a quiz question.
     *
     * @param studentQuizId  the student quiz ID
     * @param quizQuestionId the quiz question ID
     * @param answer         the student's answer
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     *         response in body
     */
    @PostMapping("/answer")
    public ResponseEntity<StudentQuizResponseDTO> submitAnswer(
            @RequestParam Long studentQuizId,
            @RequestParam Long quizQuestionId,
            @RequestParam String answer) {
        LOG.debug("REST request to submit answer for studentQuiz: {} and question: {}", studentQuizId, quizQuestionId);

        StudentQuizResponseDTO result = studentQuizService.submitAnswer(studentQuizId, quizQuestionId, answer);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                        studentQuizId.toString()))
                .body(result);
    }

    /**
     * {@code POST /pause/{studentQuizId}} : Pause a quiz attempt.
     *
     * @param studentQuizId the student quiz ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     *         updated session in body
     */
    @PostMapping("/pause/{studentQuizId}")
    public ResponseEntity<QuizSessionDTO> pauseQuizAttempt(@PathVariable Long studentQuizId) {
        LOG.debug("REST request to pause quiz attempt: {}", studentQuizId);

        QuizSessionDTO result = studentQuizService.pauseQuizAttempt(studentQuizId);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                        studentQuizId.toString()))
                .body(result);
    }

    /**
     * {@code POST /resume/{studentQuizId}} : Resume a paused quiz attempt.
     *
     * @param studentQuizId the student quiz ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     *         updated session in body
     */
    @PostMapping("/resume/{studentQuizId}")
    public ResponseEntity<QuizSessionDTO> resumeQuizAttempt(@PathVariable Long studentQuizId) {
        LOG.debug("REST request to resume quiz attempt: {}", studentQuizId);

        QuizSessionDTO result = studentQuizService.resumeQuizAttempt(studentQuizId);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                        studentQuizId.toString()))
                .body(result);
    }

    /**
     * {@code POST /submit/{studentQuizId}} : Submit a quiz attempt.
     *
     * @param studentQuizId the student quiz ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the quiz
     *         result in body
     */
    @PostMapping("/submit/{studentQuizId}")
    public ResponseEntity<QuizResultDTO> submitQuizAttempt(@PathVariable Long studentQuizId) {
        LOG.debug("REST request to submit quiz attempt: {}", studentQuizId);

        QuizResultDTO result = studentQuizService.submitQuizAttempt(studentQuizId);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                        studentQuizId.toString()))
                .body(result);
    }

    /**
     * {@code GET /history/{studentId}} : Get quiz attempt history for a student.
     *
     * @param studentId the student ID
     * @param pageable  the pagination information
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of quiz results in body
     */
    @GetMapping("/history/{studentId}")
    public ResponseEntity<Page<QuizResultDTO>> getQuizHistory(
            @PathVariable Long studentId,
            Pageable pageable) {
        LOG.debug("REST request to get quiz history for student: {}", studentId);

        Page<QuizResultDTO> page = studentQuizService.getQuizHistory(studentId, pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * {@code GET /performance/{studentId}/{quizId}} : Get performance statistics
     * for a student and quiz.
     *
     * @param studentId the student ID
     * @param quizId    the quiz ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     *         performance stats in body
     */
    @GetMapping("/performance/{studentId}/{quizId}")
    public ResponseEntity<QuizPerformanceStatsDTO> getPerformanceStats(
            @PathVariable Long studentId,
            @PathVariable Long quizId) {
        LOG.debug("REST request to get performance stats for student: {} and quiz: {}", studentId, quizId);

        QuizPerformanceStatsDTO result = studentQuizService.getPerformanceStats(studentId, quizId);
        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code GET /current-session/{studentId}/{quizId}} : Get current quiz session
     * for a student.
     *
     * @param studentId the student ID
     * @param quizId    the quiz ID
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     *         current session in body
     */
    @GetMapping("/current-session/{studentId}/{quizId}")
    public ResponseEntity<QuizSessionDTO> getCurrentQuizSession(
            @PathVariable Long studentId,
            @PathVariable Long quizId) {
        LOG.debug("REST request to get current quiz session for student: {} and quiz: {}", studentId, quizId);

        Optional<QuizSessionDTO> result = studentQuizService.getCurrentQuizSession(studentId, quizId);
        return ResponseUtil.wrapOrNotFound(result);
    }
}