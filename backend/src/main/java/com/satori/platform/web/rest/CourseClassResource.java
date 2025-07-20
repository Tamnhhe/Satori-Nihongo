package com.satori.platform.web.rest;

import com.satori.platform.repository.CourseClassRepository;
import com.satori.platform.service.CourseClassService;
import com.satori.platform.service.dto.CourseClassDTO;
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
 * REST controller for managing {@link com.satori.platform.domain.CourseClass}.
 */
@RestController
@RequestMapping("/api/course-classes")
public class CourseClassResource {

    private static final Logger LOG = LoggerFactory.getLogger(CourseClassResource.class);

    private static final String ENTITY_NAME = "courseClass";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CourseClassService courseClassService;

    private final CourseClassRepository courseClassRepository;

    public CourseClassResource(CourseClassService courseClassService, CourseClassRepository courseClassRepository) {
        this.courseClassService = courseClassService;
        this.courseClassRepository = courseClassRepository;
    }

    /**
     * {@code POST  /course-classes} : Create a new courseClass.
     *
     * @param courseClassDTO the courseClassDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new courseClassDTO, or with status {@code 400 (Bad Request)} if the courseClass has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<CourseClassDTO> createCourseClass(@Valid @RequestBody CourseClassDTO courseClassDTO) throws URISyntaxException {
        LOG.debug("REST request to save CourseClass : {}", courseClassDTO);
        if (courseClassDTO.getId() != null) {
            throw new BadRequestAlertException("A new courseClass cannot already have an ID", ENTITY_NAME, "idexists");
        }
        courseClassDTO = courseClassService.save(courseClassDTO);
        return ResponseEntity.created(new URI("/api/course-classes/" + courseClassDTO.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, courseClassDTO.getId().toString()))
            .body(courseClassDTO);
    }

    /**
     * {@code PUT  /course-classes/:id} : Updates an existing courseClass.
     *
     * @param id the id of the courseClassDTO to save.
     * @param courseClassDTO the courseClassDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courseClassDTO,
     * or with status {@code 400 (Bad Request)} if the courseClassDTO is not valid,
     * or with status {@code 500 (Internal Server Error)} if the courseClassDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<CourseClassDTO> updateCourseClass(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody CourseClassDTO courseClassDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to update CourseClass : {}, {}", id, courseClassDTO);
        if (courseClassDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courseClassDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseClassRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        courseClassDTO = courseClassService.update(courseClassDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, courseClassDTO.getId().toString()))
            .body(courseClassDTO);
    }

    /**
     * {@code PATCH  /course-classes/:id} : Partial updates given fields of an existing courseClass, field will ignore if it is null
     *
     * @param id the id of the courseClassDTO to save.
     * @param courseClassDTO the courseClassDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courseClassDTO,
     * or with status {@code 400 (Bad Request)} if the courseClassDTO is not valid,
     * or with status {@code 404 (Not Found)} if the courseClassDTO is not found,
     * or with status {@code 500 (Internal Server Error)} if the courseClassDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<CourseClassDTO> partialUpdateCourseClass(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody CourseClassDTO courseClassDTO
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update CourseClass partially : {}, {}", id, courseClassDTO);
        if (courseClassDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courseClassDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!courseClassRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<CourseClassDTO> result = courseClassService.partialUpdate(courseClassDTO);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, courseClassDTO.getId().toString())
        );
    }

    /**
     * {@code GET  /course-classes} : get all the courseClasses.
     *
     * @param pageable the pagination information.
     * @param eagerload flag to eager load entities from relationships (This is applicable for many-to-many).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of courseClasses in body.
     */
    @GetMapping("")
    public ResponseEntity<List<CourseClassDTO>> getAllCourseClasses(
        @org.springdoc.core.annotations.ParameterObject Pageable pageable,
        @RequestParam(name = "eagerload", required = false, defaultValue = "true") boolean eagerload
    ) {
        LOG.debug("REST request to get a page of CourseClasses");
        Page<CourseClassDTO> page;
        if (eagerload) {
            page = courseClassService.findAllWithEagerRelationships(pageable);
        } else {
            page = courseClassService.findAll(pageable);
        }
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /course-classes/:id} : get the "id" courseClass.
     *
     * @param id the id of the courseClassDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the courseClassDTO, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<CourseClassDTO> getCourseClass(@PathVariable("id") Long id) {
        LOG.debug("REST request to get CourseClass : {}", id);
        Optional<CourseClassDTO> courseClassDTO = courseClassService.findOne(id);
        return ResponseUtil.wrapOrNotFound(courseClassDTO);
    }

    /**
     * {@code DELETE  /course-classes/:id} : delete the "id" courseClass.
     *
     * @param id the id of the courseClassDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCourseClass(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete CourseClass : {}", id);
        courseClassService.delete(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
