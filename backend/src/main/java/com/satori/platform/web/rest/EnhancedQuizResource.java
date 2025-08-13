package com.satori.platform.web.rest;

import com.satori.platform.service.EnhancedQuizService;
import com.satori.platform.service.dto.*;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import com.satori.platform.security.SecurityUtils;

import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

/**
 * REST controller for enhanced Quiz management functionality.
 */
@RestController
@RequestMapping("/api/admin/quizzes")
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
public class EnhancedQuizResource {

    private static final Logger LOG = LoggerFactory.getLogger(EnhancedQuizResource.class);
    private static final String ENTITY_NAME = "quiz";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EnhancedQuizService enhancedQuizService;

    public EnhancedQuizResource(EnhancedQuizService enhancedQuizService) {
        this.enhancedQuizService = enhancedQuizService;
    }

    /**
     * POST /api/admin/quizzes/builder : Create a new quiz using the builder.
     */
    @PostMapping("/builder")
    public ResponseEntity<QuizBuilderDTO> createQuizWithBuilder(@Valid @RequestBody QuizBuilderDTO quizBuilderDTO)
            throws URISyntaxException {
        LOG.debug("REST request to create Quiz with builder : {}", quizBuilderDTO);

        if (quizBuilderDTO.getId() != null) {
            throw new BadRequestAlertException("A new quiz cannot already have an ID", ENTITY_NAME, "idexists");
        }

        QuizBuilderDTO result = enhancedQuizService.createQuizWithBuilder(quizBuilderDTO);

        return ResponseEntity.created(new URI("/api/admin/quizzes/builder/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                        result.getId().toString()))
                .body(result);
    }

    /**
     * PUT /api/admin/quizzes/builder/{id} : Update an existing quiz using the
     * builder.
     */
    @PutMapping("/builder/{id}")
    public ResponseEntity<QuizBuilderDTO> updateQuizWithBuilder(
            @PathVariable Long id,
            @Valid @RequestBody QuizBuilderDTO quizBuilderDTO) {
        LOG.debug("REST request to update Quiz with builder : {}", id);

        if (!id.equals(quizBuilderDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        QuizBuilderDTO result = enhancedQuizService.updateQuizWithBuilder(id, quizBuilderDTO);

        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .body(result);
    }

    /**
     * GET /api/admin/quizzes/builder/{id} : Get quiz for builder.
     */
    @GetMapping("/builder/{id}")
    public ResponseEntity<QuizBuilderDTO> getQuizForBuilder(@PathVariable Long id) {
        LOG.debug("REST request to get Quiz for builder : {}", id);

        Optional<QuizBuilderDTO> quizBuilderDTO = enhancedQuizService.getQuizForBuilder(id);
        return ResponseUtil.wrapOrNotFound(quizBuilderDTO);
    }

    /**
     * GET /api/admin/quizzes/management : Get all quizzes for management.
     */
    @GetMapping("/management")
    public ResponseEntity<List<QuizManagementDTO>> getAllQuizzesForManagement(
            @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get all quizzes for management");

        Page<QuizManagementDTO> page;

        // Check if user is teacher - if so, only show their quizzes
        if (SecurityUtils.hasCurrentUserThisAuthority("ROLE_GIANG_VIEN") &&
                !SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN")) {
            // Get teacher ID from current user context
            // For now, we'll get all quizzes - in a full implementation,
            // we would extract the teacher ID from the security context
            page = enhancedQuizService.getAllQuizzesForManagement(pageable);
        } else {
            page = enhancedQuizService.getAllQuizzesForManagement(pageable);
        }

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
                ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * POST /api/admin/quizzes/{id}/reorder : Reorder questions in a quiz.
     */
    @PostMapping("/{id}/reorder")
    public ResponseEntity<QuizBuilderDTO> reorderQuestions(
            @PathVariable Long id,
            @Valid @RequestBody List<QuestionOrderDTO> questionOrders) {
        LOG.debug("REST request to reorder questions in quiz : {}", id);

        QuizBuilderDTO result = enhancedQuizService.reorderQuestions(id, questionOrders);

        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .body(result);
    }

    /**
     * GET /api/admin/quizzes/questions : Get available questions for quiz builder.
     */
    @GetMapping("/questions")
    public ResponseEntity<List<QuestionDTO>> getAvailableQuestions(
            @org.springdoc.core.annotations.ParameterObject Pageable pageable,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String type) {
        LOG.debug("REST request to get available questions with search: {} and type: {}", search, type);

        Page<QuestionDTO> page = enhancedQuizService.getAvailableQuestions(pageable, search, type);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
                ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /api/admin/quizzes/{id}/settings : Get quiz settings.
     */
    @GetMapping("/{id}/settings")
    public ResponseEntity<QuizSettingsDTO> getQuizSettings(@PathVariable Long id) {
        LOG.debug("REST request to get quiz settings : {}", id);

        QuizSettingsDTO settings = enhancedQuizService.getQuizSettings(id);
        return ResponseEntity.ok(settings);
    }

    /**
     * PUT /api/admin/quizzes/{id}/settings : Update quiz settings.
     */
    @PutMapping("/{id}/settings")
    public ResponseEntity<QuizSettingsDTO> updateQuizSettings(
            @PathVariable Long id,
            @Valid @RequestBody QuizSettingsDTO settingsDTO) {
        LOG.debug("REST request to update quiz settings : {}", id);

        if (!id.equals(settingsDTO.getQuizId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        QuizSettingsDTO result = enhancedQuizService.updateQuizSettings(id, settingsDTO);

        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .body(result);
    }
}