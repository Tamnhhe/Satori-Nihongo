package com.satori.platform.web.rest;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.CourseClass;
import com.satori.platform.service.CourseAssignmentService;
import com.satori.platform.service.dto.CourseAssignmentDTO;
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

/**
 * REST controller for managing course assignments and scheduling.
 */
@RestController
@RequestMapping("/api/course-assignment")
public class CourseAssignmentResource {

    private static final Logger LOG = LoggerFactory.getLogger(CourseAssignmentResource.class);
    private static final String ENTITY_NAME = "courseAssignment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CourseAssignmentService courseAssignmentService;

    public CourseAssignmentResource(CourseAssignmentService courseAssignmentService) {
        this.courseAssignmentService = courseAssignmentService;
    }

    /**
     * {@code POST /course-assignment/assign-teacher} : Assign a course to a
     * teacher.
     *
     * @param assignmentDTO the assignment details
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     *         updated course
     */
    @PostMapping("/assign-teacher")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Course> assignCourseToTeacher(@Valid @RequestBody CourseAssignmentDTO assignmentDTO) {
        LOG.debug("REST request to assign course to teacher: {}", assignmentDTO);

        if (assignmentDTO.getCourseId() == null || assignmentDTO.getTeacherId() == null) {
            throw new BadRequestAlertException("Course ID and Teacher ID are required", ENTITY_NAME, "missingids");
        }

        Course result = courseAssignmentService.assignCourseToTeacher(assignmentDTO);

        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(applicationName, "courseAssignment.teacherAssigned",
                        result.getId().toString()))
                .body(result);
    }

    /**
     * {@code POST /course-assignment/assign-classes} : Assign a course to multiple
     * classes.
     *
     * @param assignmentDTO the assignment details
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     *         updated classes
     */
    @PostMapping("/assign-classes")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<CourseClass>> assignCourseToClasses(
            @Valid @RequestBody CourseAssignmentDTO assignmentDTO) {
        LOG.debug("REST request to assign course to classes: {}", assignmentDTO);

        if (assignmentDTO.getCourseId() == null || assignmentDTO.getClassIds() == null ||
                assignmentDTO.getClassIds().isEmpty()) {
            throw new BadRequestAlertException("Course ID and Class IDs are required", ENTITY_NAME, "missingids");
        }

        List<CourseClass> result = courseAssignmentService.assignCourseToClasses(assignmentDTO);

        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(applicationName, "courseAssignment.classesAssigned",
                        String.valueOf(result.size())))
                .body(result);
    }

    /**
     * {@code POST /course-assignment/schedules} : Create a new schedule.
     *
     * @param scheduleDTO the schedule to create
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and the
     *         new schedule
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/schedules")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<ScheduleDTO> createSchedule(@Valid @RequestBody ScheduleDTO scheduleDTO)
            throws URISyntaxException {
        LOG.debug("REST request to create Schedule: {}", scheduleDTO);

        if (scheduleDTO.getId() != null) {
            throw new BadRequestAlertException("A new schedule cannot already have an ID", "schedule", "idexists");
        }

        ScheduleDTO result = courseAssignmentService.createSchedule(scheduleDTO);

        return ResponseEntity.created(new URI("/api/course-assignment/schedules/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, "schedule",
                        result.getId().toString()))
                .body(result);
    }

    /**
     * {@code PUT /course-assignment/schedules/{id}} : Update an existing schedule.
     *
     * @param id          the id of the schedule to save
     * @param scheduleDTO the schedule to update
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     *         updated schedule
     */
    @PutMapping("/schedules/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<ScheduleDTO> updateSchedule(
            @PathVariable(value = "id", required = false) final Long id,
            @Valid @RequestBody ScheduleDTO scheduleDTO) {
        LOG.debug("REST request to update Schedule: {}, {}", id, scheduleDTO);

        if (scheduleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", "schedule", "idnull");
        }
        if (!id.equals(scheduleDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", "schedule", "idinvalid");
        }

        ScheduleDTO result = courseAssignmentService.updateSchedule(id, scheduleDTO);

        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, "schedule",
                        scheduleDTO.getId().toString()))
                .body(result);
    }

    /**
     * {@code DELETE /course-assignment/schedules/{id}} : Delete a schedule.
     *
     * @param id the id of the schedule to delete
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}
     */
    @DeleteMapping("/schedules/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        LOG.debug("REST request to delete Schedule: {}", id);

        courseAssignmentService.deleteSchedule(id);

        return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, "schedule", id.toString()))
                .build();
    }

    /**
     * {@code POST /course-assignment/schedules/check-conflicts} : Check for
     * schedule conflicts.
     *
     * @param scheduleDTO the schedule to check
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and conflict
     *         details
     */
    @PostMapping("/schedules/check-conflicts")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<ScheduleConflictDTO> checkScheduleConflicts(@Valid @RequestBody ScheduleDTO scheduleDTO) {
        LOG.debug("REST request to check schedule conflicts: {}", scheduleDTO);

        ScheduleConflictDTO result = courseAssignmentService.checkScheduleConflicts(scheduleDTO);

        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code GET /course-assignment/schedules/course/{courseId}} : Get schedules
     * for a course.
     *
     * @param courseId the course ID
     * @param pageable the pagination information
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of schedules
     */
    @GetMapping("/schedules/course/{courseId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<List<ScheduleDTO>> getSchedulesByCourse(
            @PathVariable Long courseId,
            @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get Schedules for course: {}", courseId);

        Page<ScheduleDTO> page = courseAssignmentService.getSchedulesByCourse(courseId, pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET /course-assignment/schedules/teacher/{teacherId}} : Get schedules
     * for a teacher.
     *
     * @param teacherId the teacher ID
     * @param pageable  the pagination information
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of schedules
     */
    @GetMapping("/schedules/teacher/{teacherId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<List<ScheduleDTO>> getSchedulesByTeacher(
            @PathVariable Long teacherId,
            @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get Schedules for teacher: {}", teacherId);

        Page<ScheduleDTO> page = courseAssignmentService.getSchedulesByTeacher(teacherId, pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}