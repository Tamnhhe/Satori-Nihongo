package com.satori.platform.web.rest;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.CourseClass;
import com.satori.platform.domain.Lesson;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.service.QuizAssignmentService;
import com.satori.platform.service.dto.QuizAssignmentDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;

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
import java.util.Map;
import java.util.Optional;

/**
 * REST controller for Quiz Assignment management.
 */
@RestController
@RequestMapping("/api/admin/quiz-assignments")
@PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
public class QuizAssignmentResource {

    private static final Logger LOG = LoggerFactory.getLogger(QuizAssignmentResource.class);
    private static final String ENTITY_NAME = "quizAssignment";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final QuizAssignmentService quizAssignmentService;

    public QuizAssignmentResource(QuizAssignmentService quizAssignmentService) {
        this.quizAssignmentService = quizAssignmentService;
    }

    /**
     * POST /api/admin/quiz-assignments : Create a new quiz assignment.
     */
    @PostMapping("")
    public ResponseEntity<QuizAssignmentDTO> createQuizAssignment(@Valid @RequestBody QuizAssignmentDTO assignmentDTO)
            throws URISyntaxException {
        LOG.debug("REST request to create Quiz Assignment : {}", assignmentDTO);

        if (assignmentDTO.getId() != null) {
            throw new BadRequestAlertException("A new quiz assignment cannot already have an ID", ENTITY_NAME,
                    "idexists");
        }

        QuizAssignmentDTO result = quizAssignmentService.createQuizAssignment(assignmentDTO);

        return ResponseEntity.created(new URI("/api/admin/quiz-assignments/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                        result.getId().toString()))
                .body(result);
    }

    /**
     * PUT /api/admin/quiz-assignments/{id} : Update an existing quiz assignment.
     */
    @PutMapping("/{id}")
    public ResponseEntity<QuizAssignmentDTO> updateQuizAssignment(
            @PathVariable Long id,
            @Valid @RequestBody QuizAssignmentDTO assignmentDTO) {
        LOG.debug("REST request to update Quiz Assignment : {}", id);

        if (!id.equals(assignmentDTO.getQuizId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        QuizAssignmentDTO result = quizAssignmentService.updateQuizAssignment(id, assignmentDTO);

        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .body(result);
    }

    /**
     * GET /api/admin/quiz-assignments/{id} : Get quiz assignment details.
     */
    @GetMapping("/{id}")
    public ResponseEntity<QuizAssignmentDTO> getQuizAssignment(@PathVariable Long id) {
        LOG.debug("REST request to get Quiz Assignment : {}", id);

        Optional<QuizAssignmentDTO> assignmentDTO = quizAssignmentService.getQuizAssignment(id);
        return ResponseUtil.wrapOrNotFound(assignmentDTO);
    }

    /**
     * GET /api/admin/quiz-assignments : Get all quiz assignments.
     */
    @GetMapping("")
    public ResponseEntity<List<QuizAssignmentDTO>> getAllQuizAssignments(
            @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get all Quiz Assignments");

        Page<QuizAssignmentDTO> page = quizAssignmentService.getAllQuizAssignments(pageable);

        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(
                ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * GET /api/admin/quiz-assignments/courses : Get available courses for
     * assignment.
     */
    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAvailableCourses() {
        LOG.debug("REST request to get available courses for assignment");

        List<Course> courses = quizAssignmentService.getAvailableCourses();
        return ResponseEntity.ok(courses);
    }

    /**
     * GET /api/admin/quiz-assignments/lessons : Get available lessons for
     * assignment.
     */
    @GetMapping("/lessons")
    public ResponseEntity<List<Lesson>> getAvailableLessons(
            @RequestParam(required = false) List<Long> courseIds) {
        LOG.debug("REST request to get available lessons for courses: {}", courseIds);

        List<Lesson> lessons = quizAssignmentService.getAvailableLessons(courseIds);
        return ResponseEntity.ok(lessons);
    }

    /**
     * GET /api/admin/quiz-assignments/classes : Get available classes for
     * assignment.
     */
    @GetMapping("/classes")
    public ResponseEntity<List<CourseClass>> getAvailableClasses() {
        LOG.debug("REST request to get available classes for assignment");

        List<CourseClass> classes = quizAssignmentService.getAvailableClasses();
        return ResponseEntity.ok(classes);
    }

    /**
     * GET /api/admin/quiz-assignments/students : Get students in specific classes.
     */
    @GetMapping("/students")
    public ResponseEntity<List<StudentProfile>> getStudentsInClasses(
            @RequestParam List<Long> classIds) {
        LOG.debug("REST request to get students in classes: {}", classIds);

        List<StudentProfile> students = quizAssignmentService.getStudentsInClasses(classIds);
        return ResponseEntity.ok(students);
    }

    /**
     * POST /api/admin/quiz-assignments/preview : Preview assignment impact.
     */
    @PostMapping("/preview")
    public ResponseEntity<Map<String, Object>> previewAssignment(@Valid @RequestBody QuizAssignmentDTO assignmentDTO) {
        LOG.debug("REST request to preview Quiz Assignment : {}", assignmentDTO);

        Map<String, Object> preview = quizAssignmentService.previewAssignment(assignmentDTO);
        return ResponseEntity.ok(preview);
    }
}