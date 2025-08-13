package com.satori.platform.web.rest;

import com.satori.platform.domain.enumeration.Role;
import com.satori.platform.security.SecurityUtils;
import com.satori.platform.service.EnhancedCourseService;
import com.satori.platform.service.UserService;
import com.satori.platform.service.dto.CourseDTO;
import com.satori.platform.service.dto.CourseEnrollmentDTO;
import com.satori.platform.service.dto.CourseWithStatsDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import com.satori.platform.service.exception.InsufficientPermissionException;
import com.satori.platform.domain.StudentProgress;
import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
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
 * Enhanced REST controller for managing
 * {@link com.satori.platform.domain.Course}.
 * Provides admin and teacher-specific course management functionality.
 */
@RestController
@RequestMapping("/api/courses")
public class EnhancedCourseResource {

    private static final Logger LOG = LoggerFactory.getLogger(EnhancedCourseResource.class);
    private static final String ENTITY_NAME = "course";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EnhancedCourseService enhancedCourseService;
    private final UserService userService;

    public EnhancedCourseResource(EnhancedCourseService enhancedCourseService, UserService userService) {
        this.enhancedCourseService = enhancedCourseService;
        this.userService = userService;
    }

    /**
     * {@code GET /courses/manage} : Get all courses with statistics for admin
     * management.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of courses with stats in body.
     */
    @GetMapping("/manage")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<List<CourseWithStatsDTO>> getCoursesWithStats(
            @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get Courses with statistics for admin management");

        Page<CourseWithStatsDTO> page = enhancedCourseService.findAllCoursesWithStats(pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET /courses/teacher/{teacherId}} : Get courses by teacher.
     *
     * @param teacherId the teacher ID.
     * @param pageable  the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of courses in body.
     */
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<List<CourseDTO>> getCoursesByTeacher(
            @PathVariable Long teacherId,
            @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get Courses by teacher: {}", teacherId);

        // Validate teacher access - teachers can only access their own courses
        if (!SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN")) {
            Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();
            if (currentUserLogin.isPresent()) {
                var currentUser = userService.getUserWithAuthoritiesByLogin(currentUserLogin.get());
                if (currentUser.isPresent() && !currentUser.get().getId().equals(teacherId)) {
                    throw new InsufficientPermissionException("Teachers can only access their own courses");
                }
            }
        }

        Page<CourseDTO> page = enhancedCourseService.findCoursesByTeacher(teacherId, pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code POST /courses/manage} : Create a new course with admin validation.
     *
     * @param courseDTO the courseDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new courseDTO.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/manage")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<CourseDTO> createCourseWithValidation(@Valid @RequestBody CourseDTO courseDTO)
            throws URISyntaxException {
        LOG.debug("REST request to create Course with validation: {}", courseDTO);

        if (courseDTO.getId() != null) {
            throw new BadRequestAlertException("A new course cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();
        if (currentUserLogin.isEmpty()) {
            throw new BadRequestAlertException("Current user login not found", ENTITY_NAME, "usernotfound");
        }

        var currentUser = userService.getUserWithAuthoritiesByLogin(currentUserLogin.get());
        if (currentUser.isEmpty()) {
            throw new BadRequestAlertException("Current user not found", ENTITY_NAME, "usernotfound");
        }

        CourseDTO result = enhancedCourseService.createCourse(courseDTO, currentUser.get().getId());

        return ResponseEntity.created(new URI("/api/courses/manage/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                        result.getId().toString()))
                .body(result);
    }

    /**
     * {@code PUT /courses/manage/{id}} : Update an existing course with admin
     * validation.
     *
     * @param id        the id of the courseDTO to save.
     * @param courseDTO the courseDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated courseDTO.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/manage/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<CourseDTO> updateCourseWithValidation(
            @PathVariable(value = "id", required = false) final Long id,
            @Valid @RequestBody CourseDTO courseDTO) throws URISyntaxException {
        LOG.debug("REST request to update Course with validation: {}, {}", id, courseDTO);

        if (courseDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!id.equals(courseDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();
        if (currentUserLogin.isEmpty()) {
            throw new BadRequestAlertException("Current user login not found", ENTITY_NAME, "usernotfound");
        }

        var currentUser = userService.getUserWithAuthoritiesByLogin(currentUserLogin.get());
        if (currentUser.isEmpty()) {
            throw new BadRequestAlertException("Current user not found", ENTITY_NAME, "usernotfound");
        }

        CourseDTO result = enhancedCourseService.updateCourse(id, courseDTO, currentUser.get().getId());

        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                        courseDTO.getId().toString()))
                .body(result);
    }

    /**
     * {@code DELETE /courses/manage/{id}} : Delete a course with admin validation.
     *
     * @param id the id of the courseDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/manage/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteCourseWithValidation(@PathVariable Long id) {
        LOG.debug("REST request to delete Course with validation: {}", id);

        Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();
        if (currentUserLogin.isEmpty()) {
            throw new BadRequestAlertException("Current user login not found", ENTITY_NAME, "usernotfound");
        }

        var currentUser = userService.getUserWithAuthoritiesByLogin(currentUserLogin.get());
        if (currentUser.isEmpty()) {
            throw new BadRequestAlertException("Current user not found", ENTITY_NAME, "usernotfound");
        }

        enhancedCourseService.deleteCourse(id, currentUser.get().getId());

        return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
    }

    /**
     * {@code POST /courses/enroll} : Enroll student in course using gift code.
     *
     * @param enrollmentDTO the enrollment data.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and
     *         enrollment result.
     */
    @PostMapping("/enroll")
    public ResponseEntity<CourseEnrollmentDTO> enrollWithGiftCode(
            @Valid @RequestBody CourseEnrollmentDTO enrollmentDTO) {
        LOG.debug("REST request to enroll student with gift code: {}", enrollmentDTO.getGiftCode());

        CourseEnrollmentDTO result = enhancedCourseService.enrollStudentWithGiftCode(enrollmentDTO);

        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(applicationName, "courseManagement.enrolled",
                        enrollmentDTO.getStudentId().toString()))
                .body(result);
    }

    /**
     * {@code GET /courses/{courseId}/progress/{studentId}} : Get course progress
     * for student.
     *
     * @param courseId  the course ID.
     * @param studentId the student ID.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and student
     *         progress.
     */
    @GetMapping("/{courseId}/progress/{studentId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN') or hasAuthority('ROLE_HOC_VIEN')")
    public ResponseEntity<StudentProgress> getCourseProgress(@PathVariable Long courseId, @PathVariable Long studentId) {
        LOG.debug("REST request to get course progress for student: {} in course: {}", studentId, courseId);

        // Validate student access - students can only access their own progress
        if (!SecurityUtils.hasCurrentUserThisAuthority("ROLE_ADMIN")
                && !SecurityUtils.hasCurrentUserThisAuthority("ROLE_GIANG_VIEN")) {
            Optional<String> currentUserLogin = SecurityUtils.getCurrentUserLogin();
            if (currentUserLogin.isPresent()) {
                var currentUser = userService.getUserWithAuthoritiesByLogin(currentUserLogin.get());
                if (currentUser.isPresent() && !currentUser.get().getId().equals(studentId)) {
                    throw new InsufficientPermissionException("Students can only access their own progress");
                }
            }
        }

        var progress = enhancedCourseService.getCourseProgress(courseId, studentId);
        return ResponseUtil.wrapOrNotFound(progress);
    }

    /**
     * {@code PUT /courses/{courseId}/progress/{studentId}} : Update course progress
     * for student.
     *
     * @param courseId             the course ID.
     * @param studentId            the student ID.
     * @param completionPercentage the completion percentage.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PutMapping("/{courseId}/progress/{studentId}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<Void> updateCourseProgress(
            @PathVariable Long courseId,
            @PathVariable Long studentId,
            @RequestParam Double completionPercentage) {
        LOG.debug("REST request to update course progress for student: {} in course: {} to {}%",
                studentId, courseId, completionPercentage);

        enhancedCourseService.updateCourseProgress(courseId, studentId, completionPercentage);

        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(applicationName, "courseManagement.progressUpdated",
                        studentId.toString()))
                .build();
    }
}