package com.satori.platform.web.rest;

import com.satori.platform.repository.TeacherProfileRepository;
import com.satori.platform.service.TeacherProfileService;
import com.satori.platform.service.dto.TeacherProfileDTO;
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
 * REST controller for managing {@link com.satori.platform.domain.TeacherProfile}.
 */
@RestController
@RequestMapping("/api/teacher-profiles")
public class TeacherProfileResource {

    private static final Logger LOG = LoggerFactory.getLogger(TeacherProfileResource.class);

    private static final String ENTITY_NAME = "teacherProfile";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final TeacherProfileService teacherProfileService;

    private final TeacherProfileRepository teacherProfileRepository;

    public TeacherProfileResource(TeacherProfileService teacherProfileService, TeacherProfileRepository teacherProfileRepository) {
        this.teacherProfileService = teacherProfileService;
        this.teacherProfileRepository = teacherProfileRepository;
    }

    /**
     * {@code POST  /teacher-profiles} : Create a new teacherProfile.
     *
     * @param teacherProfileDTO the teacherProfileDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new teacherProfileDTO, or with status {@code 400 (Bad Request)} if the teacherProfile has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<TeacherProfileDTO> createTeacherProfile(@Valid @RequestBody TeacherProfileDTO teacherProfileDTO)
        throws URISyntaxException {
        LOG.debug("REST request to save TeacherProfile : {}", teacherProfileDTO);
        if (teacherProfileDTO.getId() != null) {
            throw new BadRequestAlertException("A new teacherProfile cannot already have an ID", ENTITY_NAME, "idexists");
        }
        teacherProfileDTO = teacherProfileService.save(teacherProfileDTO);
        return ResponseEntity.created(new URI("/api/teacher-profiles/" + teacherProfileDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, teacherProfileDTO.getId().toString()))
            .body(teacherProfileDTO);
    }

    /**
     * {@code PUT  /teacher-profiles/:id} : Updates an existing teacherProfile.
     *
     * @param id the id of the teacherProfileDTO to save.
     * @param teacherProfileDTO the teacherProfileDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teacherProfileDTO,
     * or with status {@code 400 (Bad Request)} if the teacherProfileDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the teacherProfileDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<TeacherProfileDTO> updateTeacherProfile(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody TeacherProfileDTO teacherProfileDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update TeacherProfile : {}, {}", id, teacherProfileDTO);
        if (teacherProfileDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teacherProfileDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teacherProfileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        teacherProfileDTO = teacherProfileService.update(teacherProfileDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, teacherProfileDTO.getId().toString()))
            .body(teacherProfileDTO);
    }

    /**
     * {@code PATCH  /teacher-profiles/:id} : Partial updates given fields of an existing teacherProfile, field will ignore if it is null
     *
     * @param id the id of the teacherProfileDTO to save.
     * @param teacherProfileDTO the teacherProfileDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated teacherProfileDTO,
     * or with status {@code 400 (Bad Request)} if the teacherProfileDTO is not valid,
     * or with status {@code 404 (Not Found)} if the teacherProfileDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the teacherProfileDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<TeacherProfileDTO> partialUpdateTeacherProfile(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody TeacherProfileDTO teacherProfileDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update TeacherProfile partially : {}, {}", id, teacherProfileDTO);
        if (teacherProfileDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, teacherProfileDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!teacherProfileRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<TeacherProfileDTO> result = teacherProfileService.partialUpdate(teacherProfileDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, teacherProfileDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /teacher-profiles} : get all the teacherProfiles.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of teacherProfiles in body.
     */
    @GetMapping("")
    public ResponseEntity<List<TeacherProfileDTO>> getAllTeacherProfiles(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "filter", required = false) String filter
    ) {
        if ("userprofile-is-null".equals(filter)) {
            LOG.debug("REST request to get all TeacherProfiles where userProfile is null");
            return new ResponseEntity<>(teacherProfileService.findAllWhereUserProfileIsNull(), HttpStatus.OK);
        }
        LOG.debug("REST request to get a page of TeacherProfiles");
        Page<TeacherProfileDTO> page = teacherProfileService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /teacher-profiles/:id} : get the "id" teacherProfile.
     *
     * @param id the id of the teacherProfileDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the teacherProfileDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<TeacherProfileDTO> getTeacherProfile(@PathVariable("id") Long id) {
        LOG.debug("REST request to get TeacherProfile : {}", id);
        Optional<TeacherProfileDTO> teacherProfileDTO = teacherProfileService.findOne(id);
        return ResponseUtil.wrapOrNotFound(teacherProfileDTO);
    }

    /**
     * {@code DELETE  /teacher-profiles/:id} : delete the "id" teacherProfile.
     *
     * @param id the id of the teacherProfileDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTeacherProfile(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete TeacherProfile : {}", id);
        teacherProfileService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
