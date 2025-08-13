package com.satori.platform.service;

import com.satori.platform.domain.CourseClass;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.repository.CourseClassRepository;
import com.satori.platform.repository.StudentProfileRepository;
import com.satori.platform.service.dto.CourseClassDTO;
import com.satori.platform.service.dto.CourseClassWithStatsDTO;
import com.satori.platform.service.dto.StudentProfileDTO;
import com.satori.platform.service.mapper.CourseClassMapper;
import com.satori.platform.service.mapper.StudentProfileMapper;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Enhanced Service Implementation for managing
 * {@link com.satori.platform.domain.CourseClass} with enrollment tracking.
 */
@Service
@Transactional
public class EnhancedCourseClassService {

    private static final Logger LOG = LoggerFactory.getLogger(EnhancedCourseClassService.class);

    private final CourseClassRepository courseClassRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final CourseClassMapper courseClassMapper;
    private final StudentProfileMapper studentProfileMapper;

    public EnhancedCourseClassService(
            CourseClassRepository courseClassRepository,
            StudentProfileRepository studentProfileRepository,
            CourseClassMapper courseClassMapper,
            StudentProfileMapper studentProfileMapper) {
        this.courseClassRepository = courseClassRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.courseClassMapper = courseClassMapper;
        this.studentProfileMapper = studentProfileMapper;
    }

    /**
     * Get all course classes with enrollment statistics.
     *
     * @param pageable the pagination information.
     * @return the list of entities with stats.
     */
    @Transactional(readOnly = true)
    public Page<CourseClassWithStatsDTO> findAllWithStats(Pageable pageable) {
        LOG.debug("Request to get all CourseClasses with enrollment stats");
        Page<CourseClass> courseClasses = courseClassRepository.findAllWithEagerRelationships(pageable);

        List<CourseClassWithStatsDTO> courseClassWithStats = courseClasses.getContent().stream()
                .map(this::mapToWithStatsDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(courseClassWithStats, pageable, courseClasses.getTotalElements());
    }

    /**
     * Get course classes by teacher with enrollment statistics.
     *
     * @param teacherId the teacher ID.
     * @param pageable  the pagination information.
     * @return the list of entities with stats.
     */
    @Transactional(readOnly = true)
    public Page<CourseClassWithStatsDTO> findByTeacherWithStats(Long teacherId, Pageable pageable) {
        LOG.debug("Request to get CourseClasses by teacher {} with enrollment stats", teacherId);
        Page<CourseClass> courseClasses = courseClassRepository.findByTeacherId(teacherId, pageable);

        List<CourseClassWithStatsDTO> courseClassWithStats = courseClasses.getContent().stream()
                .map(this::mapToWithStatsDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(courseClassWithStats, pageable, courseClasses.getTotalElements());
    }

    /**
     * Get one course class by id with enrollment statistics.
     *
     * @param id the id of the entity.
     * @return the entity with stats.
     */
    @Transactional(readOnly = true)
    public Optional<CourseClassWithStatsDTO> findOneWithStats(Long id) {
        LOG.debug("Request to get CourseClass {} with enrollment stats", id);
        return courseClassRepository.findOneWithEagerRelationships(id)
                .map(this::mapToWithStatsDTO);
    }

    /**
     * Add student to course class with waitlist support.
     *
     * @param classId   the class ID.
     * @param studentId the student ID.
     * @param forceAdd  whether to add to waitlist if capacity is exceeded.
     * @return the updated course class with stats.
     */
    public Optional<CourseClassWithStatsDTO> addStudentToClass(Long classId, Long studentId, boolean forceAdd) {
        LOG.debug("Request to add student {} to class {} (forceAdd: {})", studentId, classId, forceAdd);

        Optional<CourseClass> courseClassOpt = courseClassRepository.findOneWithEagerRelationships(classId);
        Optional<StudentProfile> studentOpt = studentProfileRepository.findById(studentId);

        if (courseClassOpt.isPresent() && studentOpt.isPresent()) {
            CourseClass courseClass = courseClassOpt.get();
            StudentProfile student = studentOpt.get();

            // Check if student is already enrolled
            if (courseClass.getStudents().contains(student)) {
                LOG.warn("Student {} is already enrolled in class {}", studentId, classId);
                return Optional.of(mapToWithStatsDTO(courseClass));
            }

            // Check capacity
            boolean hasCapacity = courseClass.getCapacity() == null ||
                    courseClass.getStudents().size() < courseClass.getCapacity();

            if (hasCapacity || forceAdd) {
                courseClass.addStudents(student);
                courseClass = courseClassRepository.save(courseClass);

                if (!hasCapacity) {
                    LOG.info("Student {} added to class {} over capacity (waitlist)", studentId, classId);
                } else {
                    LOG.info("Student {} added to class {} within capacity", studentId, classId);
                }

                return Optional.of(mapToWithStatsDTO(courseClass));
            } else {
                LOG.warn("Cannot add student {} to class {} - capacity exceeded and forceAdd is false", studentId,
                        classId);
                return Optional.empty();
            }
        }

        return Optional.empty();
    }

    /**
     * Add student to course class (backward compatibility).
     *
     * @param classId   the class ID.
     * @param studentId the student ID.
     * @return the updated course class with stats.
     */
    public Optional<CourseClassWithStatsDTO> addStudentToClass(Long classId, Long studentId) {
        return addStudentToClass(classId, studentId, false);
    }

    /**
     * Remove student from course class.
     *
     * @param classId   the class ID.
     * @param studentId the student ID.
     * @return the updated course class with stats.
     */
    public Optional<CourseClassWithStatsDTO> removeStudentFromClass(Long classId, Long studentId) {
        LOG.debug("Request to remove student {} from class {}", studentId, classId);

        Optional<CourseClass> courseClassOpt = courseClassRepository.findOneWithEagerRelationships(classId);
        Optional<StudentProfile> studentOpt = studentProfileRepository.findById(studentId);

        if (courseClassOpt.isPresent() && studentOpt.isPresent()) {
            CourseClass courseClass = courseClassOpt.get();
            StudentProfile student = studentOpt.get();

            courseClass.removeStudents(student);
            courseClass = courseClassRepository.save(courseClass);
            return Optional.of(mapToWithStatsDTO(courseClass));
        }

        return Optional.empty();
    }

    /**
     * Add multiple students to course class with enhanced capacity management.
     *
     * @param classId       the class ID.
     * @param studentIds    the list of student IDs.
     * @param allowWaitlist whether to allow adding students to waitlist when
     *                      capacity is exceeded.
     * @return the updated course class with stats and enrollment results.
     */
    public EnrollmentResult addMultipleStudentsToClass(Long classId, List<Long> studentIds, boolean allowWaitlist) {
        LOG.debug("Request to add {} students to class {} (allowWaitlist: {})", studentIds.size(), classId,
                allowWaitlist);

        Optional<CourseClass> courseClassOpt = courseClassRepository.findOneWithEagerRelationships(classId);

        if (courseClassOpt.isEmpty()) {
            return new EnrollmentResult(Optional.empty(), 0, 0, 0, studentIds.size());
        }

        CourseClass courseClass = courseClassOpt.get();
        List<StudentProfile> students = studentProfileRepository.findAllById(studentIds);

        final int currentEnrollment = courseClass.getStudents().size();
        final int capacity = courseClass.getCapacity() != null ? courseClass.getCapacity() : Integer.MAX_VALUE;
        final int availableSpots = Math.max(0, capacity - currentEnrollment);

        // Filter out already enrolled students
        List<StudentProfile> eligibleStudents = students.stream()
                .filter(student -> !courseClass.getStudents().contains(student))
                .collect(Collectors.toList());

        int alreadyEnrolled = students.size() - eligibleStudents.size();
        int enrolled = 0;
        int waitlisted = 0;
        int rejected = 0;

        // Add students within capacity
        List<StudentProfile> studentsToEnroll = eligibleStudents.stream()
                .limit(availableSpots)
                .collect(Collectors.toList());

        for (StudentProfile student : studentsToEnroll) {
            courseClass.addStudents(student);
        }
        enrolled = studentsToEnroll.size();

        // Handle remaining students (waitlist or reject)
        List<StudentProfile> remainingStudents = eligibleStudents.stream()
                .skip(availableSpots)
                .collect(Collectors.toList());

        if (allowWaitlist && !remainingStudents.isEmpty()) {
            // Add to waitlist (over capacity)
            for (StudentProfile student : remainingStudents) {
                courseClass.addStudents(student);
            }
            waitlisted = remainingStudents.size();
        } else {
            rejected = remainingStudents.size();
        }

        CourseClass savedCourseClass = courseClassRepository.save(courseClass);

        LOG.info("Bulk enrollment to class {}: enrolled={}, waitlisted={}, rejected={}, already_enrolled={}",
                classId, enrolled, waitlisted, rejected, alreadyEnrolled);

        return new EnrollmentResult(
                Optional.of(mapToWithStatsDTO(savedCourseClass)),
                enrolled,
                waitlisted,
                rejected,
                alreadyEnrolled);
    }

    /**
     * Add multiple students to course class (backward compatibility).
     *
     * @param classId    the class ID.
     * @param studentIds the list of student IDs.
     * @return the updated course class with stats.
     */
    public Optional<CourseClassWithStatsDTO> addMultipleStudentsToClass(Long classId, List<Long> studentIds) {
        EnrollmentResult result = addMultipleStudentsToClass(classId, studentIds, false);
        return result.getCourseClass();
    }

    /**
     * Result of bulk enrollment operation.
     */
    public static class EnrollmentResult {
        private final Optional<CourseClassWithStatsDTO> courseClass;
        private final int enrolled;
        private final int waitlisted;
        private final int rejected;
        private final int alreadyEnrolled;

        public EnrollmentResult(Optional<CourseClassWithStatsDTO> courseClass, int enrolled, int waitlisted,
                int rejected, int alreadyEnrolled) {
            this.courseClass = courseClass;
            this.enrolled = enrolled;
            this.waitlisted = waitlisted;
            this.rejected = rejected;
            this.alreadyEnrolled = alreadyEnrolled;
        }

        public Optional<CourseClassWithStatsDTO> getCourseClass() {
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
     * Get available students for enrollment (not already in the class).
     *
     * @param classId  the class ID.
     * @param pageable the pagination information.
     * @return the list of available students.
     */
    @Transactional(readOnly = true)
    public Page<StudentProfileDTO> findAvailableStudentsForClass(Long classId, Pageable pageable) {
        LOG.debug("Request to get available students for class {}", classId);

        Optional<CourseClass> courseClassOpt = courseClassRepository.findOneWithEagerRelationships(classId);

        if (courseClassOpt.isPresent()) {
            CourseClass courseClass = courseClassOpt.get();
            Set<Long> enrolledStudentIds = courseClass.getStudents().stream()
                    .map(StudentProfile::getId)
                    .collect(Collectors.toSet());

            Page<StudentProfile> availableStudents = studentProfileRepository
                    .findByIdNotIn(enrolledStudentIds, pageable);

            return availableStudents.map(studentProfileMapper::toDto);
        }

        return Page.empty();
    }

    /**
     * Search students by name or student ID for enrollment.
     *
     * @param classId    the class ID.
     * @param searchTerm the search term.
     * @param pageable   the pagination information.
     * @return the list of matching students.
     */
    @Transactional(readOnly = true)
    public Page<StudentProfileDTO> searchAvailableStudentsForClass(Long classId, String searchTerm, Pageable pageable) {
        LOG.debug("Request to search available students for class {} with term: {}", classId, searchTerm);

        Optional<CourseClass> courseClassOpt = courseClassRepository.findOneWithEagerRelationships(classId);

        if (courseClassOpt.isPresent()) {
            CourseClass courseClass = courseClassOpt.get();
            Set<Long> enrolledStudentIds = courseClass.getStudents().stream()
                    .map(StudentProfile::getId)
                    .collect(Collectors.toSet());

            Page<StudentProfile> matchingStudents = studentProfileRepository
                    .findByStudentIdContainingIgnoreCaseOrUserProfile_FullNameContainingIgnoreCaseAndIdNotIn(
                            searchTerm, searchTerm, enrolledStudentIds, pageable);

            return matchingStudents.map(studentProfileMapper::toDto);
        }

        return Page.empty();
    }

    /**
     * Map CourseClass entity to CourseClassWithStatsDTO with calculated statistics.
     */
    private CourseClassWithStatsDTO mapToWithStatsDTO(CourseClass courseClass) {
        CourseClassWithStatsDTO dto = new CourseClassWithStatsDTO();

        // Basic mapping
        dto.setId(courseClass.getId());
        dto.setCode(courseClass.getCode());
        dto.setName(courseClass.getName());
        dto.setDescription(courseClass.getDescription());
        dto.setStartDate(courseClass.getStartDate());
        dto.setEndDate(courseClass.getEndDate());
        dto.setCapacity(courseClass.getCapacity());

        // Map relationships
        if (courseClass.getCourse() != null) {
            dto.setCourse(courseClassMapper.toDto(courseClass).getCourse());
        }
        if (courseClass.getTeacher() != null) {
            dto.setTeacher(courseClassMapper.toDto(courseClass).getTeacher());
        }

        // Calculate enrollment statistics
        int currentEnrollment = courseClass.getStudents().size();
        dto.setCurrentEnrollment(currentEnrollment);
        dto.setStudents(courseClass.getStudents().stream()
                .map(studentProfileMapper::toDto)
                .collect(Collectors.toSet()));

        if (courseClass.getCapacity() != null) {
            int availableSpots = Math.max(0, courseClass.getCapacity() - currentEnrollment);
            int waitlistCount = Math.max(0, currentEnrollment - courseClass.getCapacity());

            dto.setAvailableSpots(availableSpots);
            dto.setWaitlistCount(waitlistCount);
            dto.setEnrollmentPercentage((double) currentEnrollment / courseClass.getCapacity() * 100);
            dto.setIsFullyEnrolled(currentEnrollment >= courseClass.getCapacity());
            dto.setIsOverCapacity(currentEnrollment > courseClass.getCapacity());
        } else {
            dto.setAvailableSpots(null);
            dto.setWaitlistCount(0);
            dto.setEnrollmentPercentage(null);
            dto.setIsFullyEnrolled(false);
            dto.setIsOverCapacity(false);
        }

        // Calculate status based on dates
        Instant now = Instant.now();
        if (courseClass.getStartDate().isAfter(now)) {
            dto.setStatus("UPCOMING");
        } else if (courseClass.getEndDate().isBefore(now)) {
            dto.setStatus("COMPLETED");
        } else {
            dto.setStatus("ACTIVE");
        }

        return dto;
    }
}