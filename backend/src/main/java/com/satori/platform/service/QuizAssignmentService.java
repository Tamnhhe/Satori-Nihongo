package com.satori.platform.service;

import com.satori.platform.domain.*;
import com.satori.platform.repository.*;
import com.satori.platform.service.dto.QuizAssignmentDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for managing Quiz Assignments.
 */
@Service
@Transactional
public class QuizAssignmentService {

    private static final Logger LOG = LoggerFactory.getLogger(QuizAssignmentService.class);

    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final CourseClassRepository courseClassRepository;
    private final StudentProfileRepository studentProfileRepository;

    public QuizAssignmentService(
            QuizRepository quizRepository,
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            CourseClassRepository courseClassRepository,
            StudentProfileRepository studentProfileRepository) {
        this.quizRepository = quizRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.courseClassRepository = courseClassRepository;
        this.studentProfileRepository = studentProfileRepository;
    }

    /**
     * Create a new quiz assignment.
     */
    @Transactional
    public QuizAssignmentDTO createQuizAssignment(QuizAssignmentDTO assignmentDTO) {
        LOG.debug("Request to create quiz assignment: {}", assignmentDTO);

        Quiz quiz = quizRepository.findById(assignmentDTO.getQuizId())
                .orElseThrow(() -> new BadRequestAlertException("Quiz not found", "quiz", "notfound"));

        // Update quiz settings based on assignment
        if (assignmentDTO.getTimeLimitMinutes() != null) {
            quiz.setTimeLimitMinutes(assignmentDTO.getTimeLimitMinutes());
        }

        quiz.setIsActive(assignmentDTO.getIsActive() != null ? assignmentDTO.getIsActive() : true);
        quiz.setActivationTime(assignmentDTO.getStartDate());
        quiz.setDeactivationTime(assignmentDTO.getEndDate());

        // Handle course assignments
        if (assignmentDTO.getCourseIds() != null && !assignmentDTO.getCourseIds().isEmpty()) {
            Set<Course> courses = new HashSet<>(courseRepository.findAllById(assignmentDTO.getCourseIds()));
            quiz.setCourses(courses);
        }

        // Handle lesson assignments
        if (assignmentDTO.getLessonIds() != null && !assignmentDTO.getLessonIds().isEmpty()) {
            Set<Lesson> lessons = new HashSet<>(lessonRepository.findAllById(assignmentDTO.getLessonIds()));
            quiz.setLessons(lessons);
        }

        quiz = quizRepository.save(quiz);

        return convertToDTO(quiz, assignmentDTO);
    }

    /**
     * Update an existing quiz assignment.
     */
    @Transactional
    public QuizAssignmentDTO updateQuizAssignment(Long quizId, QuizAssignmentDTO assignmentDTO) {
        LOG.debug("Request to update quiz assignment: {}", quizId);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new BadRequestAlertException("Quiz not found", "quiz", "notfound"));

        // Update quiz settings
        if (assignmentDTO.getTimeLimitMinutes() != null) {
            quiz.setTimeLimitMinutes(assignmentDTO.getTimeLimitMinutes());
        }

        quiz.setIsActive(assignmentDTO.getIsActive() != null ? assignmentDTO.getIsActive() : quiz.getIsActive());
        quiz.setActivationTime(assignmentDTO.getStartDate());
        quiz.setDeactivationTime(assignmentDTO.getEndDate());

        // Update course assignments
        quiz.getCourses().clear();
        if (assignmentDTO.getCourseIds() != null && !assignmentDTO.getCourseIds().isEmpty()) {
            Set<Course> courses = new HashSet<>(courseRepository.findAllById(assignmentDTO.getCourseIds()));
            quiz.setCourses(courses);
        }

        // Update lesson assignments
        quiz.getLessons().clear();
        if (assignmentDTO.getLessonIds() != null && !assignmentDTO.getLessonIds().isEmpty()) {
            Set<Lesson> lessons = new HashSet<>(lessonRepository.findAllById(assignmentDTO.getLessonIds()));
            quiz.setLessons(lessons);
        }

        quiz = quizRepository.save(quiz);

        return convertToDTO(quiz, assignmentDTO);
    }

    /**
     * Get quiz assignment details.
     */
    @Transactional(readOnly = true)
    public Optional<QuizAssignmentDTO> getQuizAssignment(Long quizId) {
        LOG.debug("Request to get quiz assignment: {}", quizId);

        return quizRepository.findOneWithEagerRelationships(quizId)
                .map(quiz -> convertToDTO(quiz, null));
    }

    /**
     * Get all quiz assignments for management.
     */
    @Transactional(readOnly = true)
    public Page<QuizAssignmentDTO> getAllQuizAssignments(Pageable pageable) {
        LOG.debug("Request to get all quiz assignments");

        Page<Quiz> quizzes = quizRepository.findAllWithEagerRelationships(pageable);
        List<QuizAssignmentDTO> assignments = quizzes.getContent().stream()
                .map(quiz -> convertToDTO(quiz, null))
                .collect(Collectors.toList());

        return new PageImpl<>(assignments, pageable, quizzes.getTotalElements());
    }

    /**
     * Get available courses for assignment.
     */
    @Transactional(readOnly = true)
    public List<Course> getAvailableCourses() {
        LOG.debug("Request to get available courses for assignment");
        return courseRepository.findAll();
    }

    /**
     * Get available lessons for assignment.
     */
    @Transactional(readOnly = true)
    public List<Lesson> getAvailableLessons(List<Long> courseIds) {
        LOG.debug("Request to get available lessons for courses: {}", courseIds);

        if (courseIds == null || courseIds.isEmpty()) {
            return lessonRepository.findAll();
        }

        return lessonRepository.findByCourseIdIn(courseIds);
    }

    /**
     * Get available classes for assignment.
     */
    @Transactional(readOnly = true)
    public List<CourseClass> getAvailableClasses() {
        LOG.debug("Request to get available classes for assignment");
        return courseClassRepository.findAll();
    }

    /**
     * Get students in specific classes.
     */
    @Transactional(readOnly = true)
    public List<StudentProfile> getStudentsInClasses(List<Long> classIds) {
        LOG.debug("Request to get students in classes: {}", classIds);

        if (classIds == null || classIds.isEmpty()) {
            return new ArrayList<>();
        }

        return studentProfileRepository.findByClassesIdIn(classIds);
    }

    /**
     * Preview assignment - get affected students count.
     */
    @Transactional(readOnly = true)
    public Map<String, Object> previewAssignment(QuizAssignmentDTO assignmentDTO) {
        LOG.debug("Request to preview quiz assignment: {}", assignmentDTO);

        Map<String, Object> preview = new HashMap<>();
        Set<Long> affectedStudentIds = new HashSet<>();

        // Count students from course assignments
        if (assignmentDTO.getCourseIds() != null && !assignmentDTO.getCourseIds().isEmpty()) {
            List<CourseClass> classes = courseClassRepository.findByCourseIdIn(assignmentDTO.getCourseIds());
            for (CourseClass courseClass : classes) {
                List<StudentProfile> students = studentProfileRepository.findByClassesId(courseClass.getId());
                affectedStudentIds.addAll(students.stream().map(StudentProfile::getId).collect(Collectors.toSet()));
            }
        }

        // Count students from class assignments
        if (assignmentDTO.getClassIds() != null && !assignmentDTO.getClassIds().isEmpty()) {
            List<StudentProfile> students = studentProfileRepository
                    .findByClassesIdIn(assignmentDTO.getClassIds());
            affectedStudentIds.addAll(students.stream().map(StudentProfile::getId).collect(Collectors.toSet()));
        }

        // Add individual student assignments
        if (assignmentDTO.getStudentIds() != null && !assignmentDTO.getStudentIds().isEmpty()) {
            affectedStudentIds.addAll(assignmentDTO.getStudentIds());
        }

        preview.put("totalStudents", affectedStudentIds.size());
        preview.put("courseCount", assignmentDTO.getCourseIds() != null ? assignmentDTO.getCourseIds().size() : 0);
        preview.put("lessonCount", assignmentDTO.getLessonIds() != null ? assignmentDTO.getLessonIds().size() : 0);
        preview.put("classCount", assignmentDTO.getClassIds() != null ? assignmentDTO.getClassIds().size() : 0);
        preview.put("individualStudentCount",
                assignmentDTO.getStudentIds() != null ? assignmentDTO.getStudentIds().size() : 0);

        return preview;
    }

    // Private helper methods

    private QuizAssignmentDTO convertToDTO(Quiz quiz, QuizAssignmentDTO originalDTO) {
        QuizAssignmentDTO dto = new QuizAssignmentDTO();
        dto.setId(quiz.getId());
        dto.setQuizId(quiz.getId());
        dto.setQuizTitle(quiz.getTitle());
        dto.setStartDate(quiz.getActivationTime());
        dto.setEndDate(quiz.getDeactivationTime());
        dto.setTimeLimitMinutes(quiz.getTimeLimitMinutes());
        dto.setIsActive(quiz.getIsActive());

        // Set course and lesson IDs
        dto.setCourseIds(quiz.getCourses().stream().map(Course::getId).collect(Collectors.toList()));
        dto.setLessonIds(quiz.getLessons().stream().map(Lesson::getId).collect(Collectors.toList()));

        // Copy additional settings from original DTO if provided
        if (originalDTO != null) {
            dto.setAssignmentType(originalDTO.getAssignmentType());
            dto.setStudentIds(originalDTO.getStudentIds());
            dto.setClassIds(originalDTO.getClassIds());
            dto.setMaxAttempts(originalDTO.getMaxAttempts());
            dto.setShowResultsImmediately(originalDTO.getShowResultsImmediately());
            dto.setRandomizeQuestions(originalDTO.getRandomizeQuestions());
            dto.setRandomizeAnswers(originalDTO.getRandomizeAnswers());
            dto.setInstructions(originalDTO.getInstructions());
            dto.setPassingScore(originalDTO.getPassingScore());
            dto.setIsGraded(originalDTO.getIsGraded());
            dto.setWeight(originalDTO.getWeight());
        }

        return dto;
    }
}