package com.satori.platform.web.rest;

import com.satori.platform.repository.StudentQuizRepository;
import com.satori.platform.service.StudentQuizService;
import com.satori.platform.service.dto.StudentQuizDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
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
 * REST controller for managing {@link com.satori.platform.domain.StudentQuiz}.
 */
@RestController
@RequestMapping("/api/student-quizs")
public class StudentQuizResource {

    private static final Logger LOG = LoggerFactory.getLogger(StudentQuizResource.class);

    private static final String ENTITY_NAME = "studentQuiz";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StudentQuizService studentQuizService;

    private final StudentQuizRepository studentQuizRepository;

    public StudentQuizResource(StudentQuizService studentQuizService, StudentQuizRepository studentQuizRepository) {
        this.studentQuizService = studentQuizService;
        this.studentQuizRepository = studentQuizRepository;
    }

    /**
     * {@code POST  /student-quizs} : Create a new studentQuiz.
     *
     * @param studentQuizDTO the studentQuizDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new studentQuizDTO, or with status {@code 400 (Bad Request)} if the studentQuiz has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<StudentQuizDTO> createStudentQuiz(@RequestBody StudentQuizDTO studentQuizDTO) throws URISyntaxException {
        LOG.debug("REST request to save StudentQuiz : {}", studentQuizDTO);
        if (studentQuizDTO.getId() != null) {
            throw new BadRequestAlertException("A new studentQuiz cannot already have an ID", ENTITY_NAME, "idexists");
        }
        studentQuizDTO = studentQuizService.save(studentQuizDTO);
        return ResponseEntity.created(new URI("/api/student-quizs/" + studentQuizDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, studentQuizDTO.getId().toString()))
            .body(studentQuizDTO);
    }

    /**
     * {@code PUT  /student-quizs/:id} : Updates an existing studentQuiz.
     *
     * @param id the id of the studentQuizDTO to save.
     * @param studentQuizDTO the studentQuizDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studentQuizDTO,
     * or with status {@code 400 (Bad Request)} if the studentQuizDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the studentQuizDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<StudentQuizDTO> updateStudentQuiz(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody StudentQuizDTO studentQuizDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update StudentQuiz : {}, {}", id, studentQuizDTO);
        if (studentQuizDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studentQuizDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studentQuizRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        studentQuizDTO = studentQuizService.update(studentQuizDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studentQuizDTO.getId().toString()))
            .body(studentQuizDTO);
    }

    /**
     * {@code PATCH  /student-quizs/:id} : Partial updates given fields of an existing studentQuiz, field will ignore if it is null
     *
     * @param id the id of the studentQuizDTO to save.
     * @param studentQuizDTO the studentQuizDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studentQuizDTO,
     * or with status {@code 400 (Bad Request)} if the studentQuizDTO is not valid,
     * or with status {@code 404 (Not Found)} if the studentQuizDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the studentQuizDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StudentQuizDTO> partialUpdateStudentQuiz(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody StudentQuizDTO studentQuizDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update StudentQuiz partially : {}, {}", id, studentQuizDTO);
        if (studentQuizDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studentQuizDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studentQuizRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StudentQuizDTO> result = studentQuizService.partialUpdate(studentQuizDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studentQuizDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /student-quizs} : get all the studentQuizs.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of studentQuizs in body.
     */
    @GetMapping("")
    public ResponseEntity<List<StudentQuizDTO>> getAllStudentQuizs(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of StudentQuizs");
        Page<StudentQuizDTO> page = studentQuizService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /student-quizs/:id} : get the "id" studentQuiz.
     *
     * @param id the id of the studentQuizDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the studentQuizDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<StudentQuizDTO> getStudentQuiz(@PathVariable("id") Long id) {
        LOG.debug("REST request to get StudentQuiz : {}", id);
        Optional<StudentQuizDTO> studentQuizDTO = studentQuizService.findOne(id);
        return ResponseUtil.wrapOrNotFound(studentQuizDTO);
    }

    /**
     * {@code DELETE  /student-quizs/:id} : delete the "id" studentQuiz.
     *
     * @param id the id of the studentQuizDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentQuiz(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete StudentQuiz : {}", id);
        studentQuizService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
