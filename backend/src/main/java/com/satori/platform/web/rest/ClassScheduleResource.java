package com.satori.platform.web.rest;

import com.satori.platform.service.ClassScheduleService;
import com.satori.platform.service.dto.ScheduleConflictDTO;
import com.satori.platform.service.dto.ScheduleDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
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

/**
 * REST controller for managing class schedules.
 */
@RestController
@RequestMapping("/api/admin/course-classes")
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
public class ClassScheduleResource {

    private static final Logger LOG = LoggerFactory.getLogger(ClassScheduleResource.class);

    private static final String ENTITY_NAME = "classSchedule";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClassScheduleService classScheduleService;

    public ClassScheduleResource(ClassScheduleService classScheduleService) {
        this.classScheduleService = classScheduleService;
    }

    /**
     * {@code POST /{classId}/schedules} : Create a new class schedule.
     *
     * @param classId     the class ID
     * @param scheduleDTO the schedule to create
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new schedule,
     *         or with status {@code 400 (Bad Request)} if the schedule has already
     *         an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/{classId}/schedules")
    public ResponseEntity<ScheduleDTO> createClassSchedule(
            @PathVariable Long classId,
            @Valid @RequestBody ScheduleDTO scheduleDTO) throws URISyntaxException {
        LOG.debug("REST request to save class schedule for class: {}", classId);

        if (scheduleDTO.getId() != null) {
            throw new BadRequestAlertException("A new schedule cannot already have an ID", ENTITY_NAME, "idexists");
        }

        // Get current user ID from security context
        Long userId = getCurrentUserId();

        ScheduleDTO result = classScheduleService.createClassSchedule(classId, scheduleDTO, userId);

        return ResponseEntity.created(new URI("/api/admin/course-classes/" + classId + "/schedules/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                        result.getId().toString()))
                .body(result);
    }

    /**
     * {@code POST /{classId}/schedules/recurring} : Create recurring class
     * schedules.
     *
     * @param classId     the class ID
     * @param scheduleDTO the base schedule with recurring settings
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the created schedules
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/{classId}/schedules/recurring")
    public ResponseEntity<List<ScheduleDTO>> createRecurringClassSchedules(
            @PathVariable Long classId,
            @Valid @RequestBody ScheduleDTO scheduleDTO) throws URISyntaxException {
        LOG.debug("REST request to create recurring class schedules for class: {}", classId);

        if (scheduleDTO.getId() != null) {
            throw new BadRequestAlertException("A new schedule cannot already have an ID", ENTITY_NAME, "idexists");
        }

        // Get current user ID from security context
        Long userId = getCurrentUserId();

        List<ScheduleDTO> result = classScheduleService.createRecurringClassSchedules(classId, scheduleDTO, userId);

        return ResponseEntity.created(new URI("/api/admin/course-classes/" + classId + "/schedules"))
                .headers(HeaderUtil.createAlert(applicationName, "Created " + result.size() + " recurring schedules",
                        ""))
                .body(result);
    }

    /**
     * {@code PUT /{classId}/schedules/{id}} : Updates an existing class schedule.
     *
     * @param classId     the class ID
     * @param id          the schedule ID
     * @param scheduleDTO the schedule to update
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated schedule,
     *         or with status {@code 400 (Bad Request)} if the schedule is not
     *         valid,
     *         or with status {@code 500 (Internal Server Error)} if the schedule
     *         couldn't be updated
     */
    @PutMapping("/{classId}/schedules/{id}")
    public ResponseEntity<ScheduleDTO> updateClassSchedule(
            @PathVariable Long classId,
            @PathVariable(value = "id", required = false) final Long id,
            @Valid @RequestBody ScheduleDTO scheduleDTO) {
        LOG.debug("REST request to update class schedule: {} for class: {}", id, classId);

        if (scheduleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!scheduleDTO.getId().equals(id)) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        // Get current user ID from security context
        Long userId = getCurrentUserId();

        ScheduleDTO result = classScheduleService.updateClassSchedule(classId, id, scheduleDTO, userId);

        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                        scheduleDTO.getId().toString()))
                .body(result);
    }

    /**
     * {@code GET /{classId}/schedules} : get all class schedules.
     *
     * @param classId  the class ID
     * @param pageable the pagination information
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of schedules in body
     */
    @GetMapping("/{classId}/schedules")
    public ResponseEntity<List<ScheduleDTO>> getClassSchedules(
            @PathVariable Long classId,
            @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get class schedules for class: {}", classId);

        Page<ScheduleDTO> page = classScheduleService.getClassSchedules(classId, pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);

        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code POST /{classId}/schedules/check-conflicts} : Check for schedule
     * conflicts.
     *
     * @param classId     the class ID
     * @param scheduleDTO the schedule to check
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and conflict
     *         information in body
     */
    @PostMapping("/{classId}/schedules/check-conflicts")
    public ResponseEntity<ScheduleConflictDTO> checkClassScheduleConflicts(
            @PathVariable Long classId,
            @Valid @RequestBody ScheduleDTO scheduleDTO) {
        LOG.debug("REST request to check conflicts for class schedule in class: {}", classId);

        ScheduleConflictDTO result = classScheduleService.checkScheduleConflicts(classId, scheduleDTO,
                scheduleDTO.getId());

        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code DELETE /{classId}/schedules/{id}} : delete the class schedule.
     *
     * @param classId the class ID
     * @param id      the schedule ID
     * @return the {@link ResponseEntity} with status {@code 204 (No Content)}
     */
    @DeleteMapping("/{classId}/schedules/{id}")
    public ResponseEntity<Void> deleteClassSchedule(@PathVariable Long classId, @PathVariable Long id) {
        LOG.debug("REST request to delete class schedule: {} for class: {}", id, classId);

        // Get current user ID from security context
        Long userId = getCurrentUserId();

        classScheduleService.deleteClassSchedule(classId, id, userId);

        return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
    }

    /**
     * Alternative endpoint for deleting schedules directly by schedule ID.
     */
    @DeleteMapping("/schedules/{id}")
    public ResponseEntity<Void> deleteScheduleById(@PathVariable Long id) {
        LOG.debug("REST request to delete schedule: {}", id);

        // This would need to be implemented to find the class ID from the schedule
        // For now, we'll throw an exception to indicate this endpoint needs the class
        // context
        throw new BadRequestAlertException("Use the class-specific endpoint to delete schedules", ENTITY_NAME,
                "invalidendpoint");
    }

    private Long getCurrentUserId() {
        // This is a placeholder - in a real implementation, you would extract the user
        // ID
        // from the Spring Security context
        return 1L; // Placeholder
    }
}