package com.satori.platform.web.rest;

import com.satori.platform.repository.QuizQuestionRepository;
import com.satori.platform.service.QuizQuestionService;
import com.satori.platform.service.dto.QuizQuestionDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
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
 * REST controller for managing {@link com.satori.platform.domain.QuizQuestion}.
 */
@RestController
@RequestMapping("/api/quiz-questions")
public class QuizQuestionResource {

    private static final Logger LOG = LoggerFactory.getLogger(QuizQuestionResource.class);

    private static final String ENTITY_NAME = "quizQuestion";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuizQuestionService quizQuestionService;

    private final QuizQuestionRepository quizQuestionRepository;

    public QuizQuestionResource(QuizQuestionService quizQuestionService, QuizQuestionRepository quizQuestionRepository) {
        this.quizQuestionService = quizQuestionService;
        this.quizQuestionRepository = quizQuestionRepository;
    }

    /**
     * {@code POST  /quiz-questions} : Create a new quizQuestion.
     *
     * @param quizQuestionDTO the quizQuestionDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new quizQuestionDTO, or with status {@code 400 (Bad Request)} if the quizQuestion has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<QuizQuestionDTO> createQuizQuestion(@Valid @RequestBody QuizQuestionDTO quizQuestionDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save QuizQuestion : {}", quizQuestionDTO);
        if (quizQuestionDTO.getId() != null) {
            throw new BadRequestAlertException("A new quizQuestion cannot already have an ID", ENTITY_NAME, "idexists");
        }
        quizQuestionDTO = quizQuestionService.save(quizQuestionDTO);
        return ResponseEntity.created(new URI("/api/quiz-questions/" + quizQuestionDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, quizQuestionDTO.getId().toString()))
            .body(quizQuestionDTO);
    }

    /**
     * {@code PUT  /quiz-questions/:id} : Updates an existing quizQuestion.
     *
     * @param id the id of the quizQuestionDTO to save.
     * @param quizQuestionDTO the quizQuestionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated quizQuestionDTO,
     * or with status {@code 400 (Bad Request)} if the quizQuestionDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the quizQuestionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<QuizQuestionDTO> updateQuizQuestion(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody QuizQuestionDTO quizQuestionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update QuizQuestion : {}, {}", id, quizQuestionDTO);
        if (quizQuestionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, quizQuestionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!quizQuestionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        quizQuestionDTO = quizQuestionService.update(quizQuestionDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, quizQuestionDTO.getId().toString()))
            .body(quizQuestionDTO);
    }

    /**
     * {@code PATCH  /quiz-questions/:id} : Partial updates given fields of an existing quizQuestion, field will ignore if it is null
     *
     * @param id the id of the quizQuestionDTO to save.
     * @param quizQuestionDTO the quizQuestionDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated quizQuestionDTO,
     * or with status {@code 400 (Bad Request)} if the quizQuestionDTO is not valid,
     * or with status {@code 404 (Not Found)} if the quizQuestionDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the quizQuestionDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<QuizQuestionDTO> partialUpdateQuizQuestion(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody QuizQuestionDTO quizQuestionDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update QuizQuestion partially : {}, {}", id, quizQuestionDTO);
        if (quizQuestionDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, quizQuestionDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!quizQuestionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<QuizQuestionDTO> result = quizQuestionService.partialUpdate(quizQuestionDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, quizQuestionDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /quiz-questions} : get all the quizQuestions.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of quizQuestions in body.
     */
    @GetMapping("")
    public ResponseEntity<List<QuizQuestionDTO>> getAllQuizQuestions(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of QuizQuestions");
        Page<QuizQuestionDTO> page = quizQuestionService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /quiz-questions/:id} : get the "id" quizQuestion.
     *
     * @param id the id of the quizQuestionDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the quizQuestionDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<QuizQuestionDTO> getQuizQuestion(@PathVariable("id") Long id) {
        LOG.debug("REST request to get QuizQuestion : {}", id);
        Optional<QuizQuestionDTO> quizQuestionDTO = quizQuestionService.findOne(id);
        return ResponseUtil.wrapOrNotFound(quizQuestionDTO);
    }

    /**
     * {@code DELETE  /quiz-questions/:id} : delete the "id" quizQuestion.
     *
     * @param id the id of the quizQuestionDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuizQuestion(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete QuizQuestion : {}", id);
        quizQuestionService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
