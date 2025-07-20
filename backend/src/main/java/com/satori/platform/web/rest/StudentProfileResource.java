package com.satori.platform.web.rest;

import com.satori.platform.repository.StudentProfileRepository;
import com.satori.platform.service.StudentProfileService;
import com.satori.platform.service.dto.StudentProfileDTO;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.satori.platform.domain.StudentProfile}.
 */
@RestController
@RequestMapping("/api/student-profiles")
public class StudentProfileResource {

    private static final Logger LOG = LoggerFactory.getLogger(StudentProfileResource.class);

    private static final String ENTITY_NAME = "studentProfile";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final StudentProfileService studentProfileService;

    private final StudentProfileRepository studentProfileRepository;

    public StudentProfileResource(StudentProfileService studentProfileService, StudentProfileRepository studentProfileRepository) {
        this.studentProfileService = studentProfileService;
        this.studentProfileRepository = studentProfileRepository;
    }

    /**
     * {@code POST  /student-profiles} : Create a new studentProfile.
     *
     * @param studentProfileDTO the studentProfileDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new studentProfileDTO, or with status {@code 400 (Bad Request)} if the studentProfile has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<StudentProfileDTO> createStudentProfile(@Valid @RequestBody StudentProfileDTO studentProfileDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save StudentProfile : {}", studentProfileDTO);
        if (studentProfileDTO.getId() != null) {
            throw new BadRequestAlertException("A new studentProfile cannot already have an ID", ENTITY_NAME, "idexists");
        }
        studentProfileDTO = studentProfileService.save(studentProfileDTO);
        return ResponseEntity.created(new URI("/api/student-profiles/" + studentProfileDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, studentProfileDTO.getId().toString()))
            .body(studentProfileDTO);
    }

    /**
     * {@code PUT  /student-profiles/:id} : Updates an existing studentProfile.
     *
     * @param id the id of the studentProfileDTO to save.
     * @param studentProfileDTO the studentProfileDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studentProfileDTO,
     * or with status {@code 400 (Bad Request)} if the studentProfileDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the studentProfileDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<StudentProfileDTO> updateStudentProfile(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody StudentProfileDTO studentProfileDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update StudentProfile : {}, {}", id, studentProfileDTO);
        if (studentProfileDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studentProfileDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studentProfileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        studentProfileDTO = studentProfileService.update(studentProfileDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studentProfileDTO.getId().toString()))
            .body(studentProfileDTO);
    }

    /**
     * {@code PATCH  /student-profiles/:id} : Partial updates given fields of an existing studentProfile, field will ignore if it is null
     *
     * @param id the id of the studentProfileDTO to save.
     * @param studentProfileDTO the studentProfileDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated studentProfileDTO,
     * or with status {@code 400 (Bad Request)} if the studentProfileDTO is not valid,
     * or with status {@code 404 (Not Found)} if the studentProfileDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the studentProfileDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<StudentProfileDTO> partialUpdateStudentProfile(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody StudentProfileDTO studentProfileDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update StudentProfile partially : {}, {}", id, studentProfileDTO);
        if (studentProfileDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, studentProfileDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!studentProfileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<StudentProfileDTO> result = studentProfileService.partialUpdate(studentProfileDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, studentProfileDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /student-profiles} : get all the studentProfiles.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of studentProfiles in body.
     */
    @GetMapping("")
    public ResponseEntity<List<StudentProfileDTO>> getAllStudentProfiles(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "filter", required = false) String filter
    ) {
        if ("userprofile-is-null".equals(filter)) {
            LOG.debug("REST request to get all StudentProfiles where userProfile is null");
            return new ResponseEntity<>(studentProfileService.findAllWhereUserProfileIsNull(), HttpStatus.OK);
        }
        LOG.debug("REST request to get a page of StudentProfiles");
        Page<StudentProfileDTO> page = studentProfileService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /student-profiles/:id} : get the "id" studentProfile.
     *
     * @param id the id of the studentProfileDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the studentProfileDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<StudentProfileDTO> getStudentProfile(@PathVariable("id") Long id) {
        LOG.debug("REST request to get StudentProfile : {}", id);
        Optional<StudentProfileDTO> studentProfileDTO = studentProfileService.findOne(id);
        return ResponseUtil.wrapOrNotFound(studentProfileDTO);
    }

    /**
     * {@code DELETE  /student-profiles/:id} : delete the "id" studentProfile.
     *
     * @param id the id of the studentProfileDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStudentProfile(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete StudentProfile : {}", id);
        studentProfileService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
