package com.satori.platform.web.rest;

import com.satori.platform.service.EnhancedCourseClassService;
import com.satori.platform.service.dto.CourseClassWithStatsDTO;
import com.satori.platform.service.dto.StudentProfileDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
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
 * {@link com.satori.platform.domain.CourseClass} with enrollment tracking.
 */
@RestController
@RequestMapping("/api/admin/course-classes")
public class EnhancedCourseClassResource {

        private static final Logger LOG = LoggerFactory.getLogger(EnhancedCourseClassResource.class);

        private static final String ENTITY_NAME = "courseClass";

        @Value("${jhipster.clientApp.name}")
        private String applicationName;

        private final EnhancedCourseClassService enhancedCourseClassService;

        public EnhancedCourseClassResource(EnhancedCourseClassService enhancedCourseClassService) {
                this.enhancedCourseClassService = enhancedCourseClassService;
        }

        /**
         * {@code GET  /course-classes} : get all course classes with enrollment
         * statistics.
         *
         * @param pageable the pagination information.
         * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
         *         of course classes in body.
         */
        @GetMapping("")
        @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
        public ResponseEntity<List<CourseClassWithStatsDTO>> getAllCourseClassesWithStats(
                        @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
                LOG.debug("REST request to get a page of CourseClasses with stats");
                Page<CourseClassWithStatsDTO> page = enhancedCourseClassService.findAllWithStats(pageable);
                HttpHeaders headers = PaginationUtil
                                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
                return ResponseEntity.ok().headers(headers).body(page.getContent());
        }

        /**
         * {@code GET  /course-classes/teacher/:teacherId} : get course classes by
         * teacher with enrollment statistics.
         *
         * @param teacherId the teacher ID.
         * @param pageable  the pagination information.
         * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
         *         of course classes in body.
         */
        @GetMapping("/teacher/{teacherId}")
        @PreAuthorize("hasAuthority('ROLE_ADMIN') or (hasAuthority('ROLE_GIANG_VIEN') and @userService.getCurrentUserProfile().teacherProfile.id == #teacherId)")
        public ResponseEntity<List<CourseClassWithStatsDTO>> getCourseClassesByTeacherWithStats(
                        @PathVariable Long teacherId,
                        @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
                LOG.debug("REST request to get CourseClasses by teacher {} with stats", teacherId);
                Page<CourseClassWithStatsDTO> page = enhancedCourseClassService.findByTeacherWithStats(teacherId,
                                pageable);
                HttpHeaders headers = PaginationUtil
                                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
                return ResponseEntity.ok().headers(headers).body(page.getContent());
        }

        /**
         * {@code GET  /course-classes/:id} : get the course class with enrollment
         * statistics.
         *
         * @param id the id of the course class to retrieve.
         * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
         *         the course class, or with status {@code 404 (Not Found)}.
         */
        @GetMapping("/{id}")
        @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
        public ResponseEntity<CourseClassWithStatsDTO> getCourseClassWithStats(@PathVariable Long id) {
                LOG.debug("REST request to get CourseClass {} with stats", id);
                Optional<CourseClassWithStatsDTO> courseClassWithStatsDTO = enhancedCourseClassService
                                .findOneWithStats(id);
                return ResponseUtil.wrapOrNotFound(courseClassWithStatsDTO);
        }

        /**
         * {@code POST  /course-classes/:id/students/:studentId} : add student to course
         * class with waitlist support.
         *
         * @param id        the course class ID.
         * @param studentId the student ID.
         * @param forceAdd  whether to add to waitlist if capacity is exceeded.
         * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
         *         updated course class.
         */
        @PostMapping("/{id}/students/{studentId}")
        @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
        public ResponseEntity<CourseClassWithStatsDTO> addStudentToClass(
                        @PathVariable Long id,
                        @PathVariable Long studentId,
                        @RequestParam(defaultValue = "false") boolean forceAdd) {
                LOG.debug("REST request to add student {} to class {} (forceAdd: {})", studentId, id, forceAdd);
                Optional<CourseClassWithStatsDTO> result = enhancedCourseClassService.addStudentToClass(id, studentId,
                                forceAdd);

                if (result.isPresent()) {
                        CourseClassWithStatsDTO courseClass = result.get();
                        String message = courseClass.getIsOverCapacity() && forceAdd
                                        ? "Student added to waitlist successfully"
                                        : "Student added to class successfully";

                        return ResponseEntity.ok()
                                        .headers(HeaderUtil.createAlert(applicationName, message, studentId.toString()))
                                        .body(courseClass);
                } else {
                        throw new BadRequestAlertException(
                                        "Cannot add student to class - capacity exceeded or student not found",
                                        ENTITY_NAME, "enrollmentfailed");
                }
        }

        /**
         * {@code DELETE  /course-classes/:id/students/:studentId} : remove student from
         * course class.
         *
         * @param id        the course class ID.
         * @param studentId the student ID.
         * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
         *         updated course class.
         */
        @DeleteMapping("/{id}/students/{studentId}")
        @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
        public ResponseEntity<CourseClassWithStatsDTO> removeStudentFromClass(
                        @PathVariable Long id,
                        @PathVariable Long studentId) {
                LOG.debug("REST request to remove student {} from class {}", studentId, id);
                Optional<CourseClassWithStatsDTO> result = enhancedCourseClassService.removeStudentFromClass(id,
                                studentId);

                if (result.isPresent()) {
                        return ResponseEntity.ok()
                                        .headers(HeaderUtil.createAlert(applicationName,
                                                        "Student removed from class successfully",
                                                        studentId.toString()))
                                        .body(result.get());
                } else {
                        throw new BadRequestAlertException(
                                        "Cannot remove student from class - class or student not found",
                                        ENTITY_NAME, "unenrollmentfailed");
                }
        }

        /**
         * {@code POST  /course-classes/:id/students/bulk} : add multiple students to
         * course class with enhanced capacity management.
         *
         * @param id      the course class ID.
         * @param request the bulk enrollment request.
         * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
         *         updated course class with enrollment results.
         */
        @PostMapping("/{id}/students/bulk")
        @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
        public ResponseEntity<BulkEnrollmentResponse> addMultipleStudentsToClass(
                        @PathVariable Long id,
                        @Valid @RequestBody BulkEnrollmentRequest request) {
                LOG.debug("REST request to add {} students to class {} (allowWaitlist: {})",
                                request.getStudentIds().size(), id, request.isAllowWaitlist());

                EnhancedCourseClassService.EnrollmentResult result = enhancedCourseClassService
                                .addMultipleStudentsToClass(id, request.getStudentIds(), request.isAllowWaitlist());

                if (result.getCourseClass().isPresent()) {
                        BulkEnrollmentResponse response = new BulkEnrollmentResponse(
                                        result.getCourseClass().get(),
                                        result.getEnrolled(),
                                        result.getWaitlisted(),
                                        result.getRejected(),
                                        result.getAlreadyEnrolled());

                        String message = String.format(
                                        "Enrollment completed: %d enrolled, %d waitlisted, %d rejected, %d already enrolled",
                                        result.getEnrolled(), result.getWaitlisted(), result.getRejected(),
                                        result.getAlreadyEnrolled());

                        return ResponseEntity.ok()
                                        .headers(HeaderUtil.createAlert(applicationName, message,
                                                        String.valueOf(result.getTotal())))
                                        .body(response);
                } else {
                        throw new BadRequestAlertException("Cannot add students to class - class not found",
                                        ENTITY_NAME,
                                        "bulkenrollmentfailed");
                }
        }

        /**
         * Request DTO for bulk enrollment operations.
         */
        public static class BulkEnrollmentRequest {
                @Valid
                private List<Long> studentIds;
                private boolean allowWaitlist = false;

                public List<Long> getStudentIds() {
                        return studentIds;
                }

                public void setStudentIds(List<Long> studentIds) {
                        this.studentIds = studentIds;
                }

                public boolean isAllowWaitlist() {
                        return allowWaitlist;
                }

                public void setAllowWaitlist(boolean allowWaitlist) {
                        this.allowWaitlist = allowWaitlist;
                }
        }

        /**
         * Response DTO for bulk enrollment operations.
         */
        public static class BulkEnrollmentResponse {
                private final CourseClassWithStatsDTO courseClass;
                private final int enrolled;
                private final int waitlisted;
                private final int rejected;
                private final int alreadyEnrolled;

                public BulkEnrollmentResponse(CourseClassWithStatsDTO courseClass, int enrolled, int waitlisted,
                                int rejected, int alreadyEnrolled) {
                        this.courseClass = courseClass;
                        this.enrolled = enrolled;
                        this.waitlisted = waitlisted;
                        this.rejected = rejected;
                        this.alreadyEnrolled = alreadyEnrolled;
                }

                public CourseClassWithStatsDTO getCourseClass() {
                        return courseClass;
                }

                public int getEnrolled() {
                        return enrolled;
                }

                public int getWaitlisted() {
                        return waitlisted;
                }

                public int getRejected() {
                        return rejected;
                }

                public int getAlreadyEnrolled() {
                        return alreadyEnrolled;
                }

                public int getTotal() {
                        return enrolled + waitlisted + rejected + alreadyEnrolled;
                }
        }

        /**
         * {@code GET  /course-classes/:id/available-students} : get available students
         * for enrollment.
         *
         * @param id       the course class ID.
         * @param pageable the pagination information.
         * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
         *         of available students.
         */
        @GetMapping("/{id}/available-students")
        @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
        public ResponseEntity<List<StudentProfileDTO>> getAvailableStudentsForClass(
                        @PathVariable Long id,
                        @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
                LOG.debug("REST request to get available students for class {}", id);
                Page<StudentProfileDTO> page = enhancedCourseClassService.findAvailableStudentsForClass(id, pageable);
                HttpHeaders headers = PaginationUtil
                                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
                return ResponseEntity.ok().headers(headers).body(page.getContent());
        }

        /**
         * {@code GET  /course-classes/:id/available-students/search} : search available
         * students for enrollment.
         *
         * @param id         the course class ID.
         * @param searchTerm the search term.
         * @param pageable   the pagination information.
         * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
         *         of matching students.
         */
        @GetMapping("/{id}/available-students/search")
        @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
        public ResponseEntity<List<StudentProfileDTO>> searchAvailableStudentsForClass(
                        @PathVariable Long id,
                        @RequestParam String searchTerm,
                        @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
                LOG.debug("REST request to search available students for class {} with term: {}", id, searchTerm);
                Page<StudentProfileDTO> page = enhancedCourseClassService.searchAvailableStudentsForClass(id,
                                searchTerm,
                                pageable);
                HttpHeaders headers = PaginationUtil
                                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
                return ResponseEntity.ok().headers(headers).body(page.getContent());
        }
}