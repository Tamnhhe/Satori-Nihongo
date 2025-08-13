package com.satori.platform.service;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.StudentProgress;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.enumeration.Role;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.StudentProfileRepository;
import com.satori.platform.repository.StudentProgressRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.service.dto.CourseDTO;
import com.satori.platform.service.dto.CourseEnrollmentDTO;
import com.satori.platform.service.dto.CourseWithStatsDTO;
import com.satori.platform.service.exception.InsufficientPermissionException;
import com.satori.platform.service.mapper.CourseMapper;
import jakarta.persistence.EntityNotFoundException;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Enhanced Service Implementation for managing
 * {@link com.satori.platform.domain.Course}.
 * Provides admin CRUD operations, validation, and course enrollment
 * functionality.
 */
@Service
@Transactional
public class EnhancedCourseService {

    private static final Logger LOG = LoggerFactory.getLogger(EnhancedCourseService.class);

    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final UserProfileRepository userProfileRepository;
    private final StudentProfileRepository studentProfileRepository;
    private final StudentProgressRepository studentProgressRepository;
    private final GiftCodeService giftCodeService;
    private final NotificationService notificationService;

    public EnhancedCourseService(
            CourseRepository courseRepository,
            CourseMapper courseMapper,
            UserProfileRepository userProfileRepository,
            StudentProfileRepository studentProfileRepository,
            StudentProgressRepository studentProgressRepository,
            GiftCodeService giftCodeService,
            NotificationService notificationService) {
        this.courseRepository = courseRepository;
        this.courseMapper = courseMapper;
        this.userProfileRepository = userProfileRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.studentProgressRepository = studentProgressRepository;
        this.giftCodeService = giftCodeService;
        this.notificationService = notificationService;
    }

    /**
     * Create a new course with admin validation.
     *
     * @param courseDTO the course to create
     * @param adminId   the admin user ID
     * @return the created course
     * @throws InsufficientPermissionException if user is not admin
     */
    public CourseDTO createCourse(CourseDTO courseDTO, Long adminId) {
        LOG.debug("Request to create Course : {} by admin: {}", courseDTO, adminId);

        validateAdminPermission(adminId);
        validateCourseData(courseDTO);

        Course course = courseMapper.toEntity(courseDTO);
        course.setId(null); // Ensure new entity

        course = courseRepository.save(course);
        LOG.info("Created new course with ID: {} by admin: {}", course.getId(), adminId);

        return courseMapper.toDto(course);
    }

    /**
     * Update an existing course with admin validation.
     *
     * @param courseId  the course ID to update
     * @param courseDTO the updated course data
     * @param adminId   the admin user ID
     * @return the updated course
     * @throws EntityNotFoundException         if course not found
     * @throws InsufficientPermissionException if user is not admin
     */
    public CourseDTO updateCourse(Long courseId, CourseDTO courseDTO, Long adminId) {
        LOG.debug("Request to update Course : {} by admin: {}", courseId, adminId);

        validateAdminPermission(adminId);
        validateCourseData(courseDTO);

        Course existingCourse = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with id: " + courseId));

        // Update fields
        existingCourse.setTitle(courseDTO.getTitle());
        existingCourse.setDescription(courseDTO.getDescription());
        existingCourse.setCourseCode(courseDTO.getCourseCode());

        if (courseDTO.getTeacher() != null) {
            UserProfile teacher = userProfileRepository.findById(courseDTO.getTeacher().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));
            existingCourse.setTeacher(teacher);
        }

        Course updatedCourse = courseRepository.save(existingCourse);
        LOG.info("Updated course with ID: {} by admin: {}", courseId, adminId);

        // Notify enrolled students of course updates
        notifyStudentsOfCourseUpdate(updatedCourse);

        return courseMapper.toDto(updatedCourse);
    }

    /**
     * Delete a course with admin validation and dependency handling.
     *
     * @param courseId the course ID to delete
     * @param adminId  the admin user ID
     * @throws EntityNotFoundException         if course not found
     * @throws InsufficientPermissionException if user is not admin
     */
    public void deleteCourse(Long courseId, Long adminId) {
        LOG.debug("Request to delete Course : {} by admin: {}", courseId, adminId);

        validateAdminPermission(adminId);

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found with id: " + courseId));

        // Handle dependent data
        handleCourseDeletion(course);

        courseRepository.delete(course);
        LOG.info("Deleted course with ID: {} by admin: {}", courseId, adminId);
    }

    /**
     * Get all courses with pagination and filtering.
     *
     * @param pageable pagination information
     * @return page of courses
     */
    @Transactional(readOnly = true)
    public Page<CourseDTO> findAllCourses(Pageable pageable) {
        LOG.debug("Request to get all Courses");
        return courseRepository.findAll(pageable).map(courseMapper::toDto);
    }

    /**
     * Get all courses with statistics for admin management.
     *
     * @param pageable pagination information
     * @return page of courses with statistics
     */
    @Transactional(readOnly = true)
    public Page<CourseWithStatsDTO> findAllCoursesWithStats(Pageable pageable) {
        LOG.debug("Request to get all Courses with statistics");
        return courseRepository.findAll(pageable).map(this::mapCourseToStatsDTO);
    }

    /**
     * Get courses by teacher.
     *
     * @param teacherId the teacher ID
     * @param pageable  pagination information
     * @return page of courses
     */
    @Transactional(readOnly = true)
    public Page<CourseDTO> findCoursesByTeacher(Long teacherId, Pageable pageable) {
        LOG.debug("Request to get Courses by teacher: {}", teacherId);
        return courseRepository.findByTeacherId(teacherId, pageable).map(courseMapper::toDto);
    }

    /**
     * Enroll student in course using gift code.
     *
     * @param enrollmentDTO the enrollment data
     * @return the enrollment result
     */
    public CourseEnrollmentDTO enrollStudentWithGiftCode(CourseEnrollmentDTO enrollmentDTO) {
        LOG.debug("Request to enroll student with gift code: {}", enrollmentDTO.getGiftCode());

        // Validate and redeem gift code
        var redemption = giftCodeService.redeemGiftCode(enrollmentDTO.getGiftCode(), enrollmentDTO.getStudentId());

        StudentProfile student = studentProfileRepository.findById(enrollmentDTO.getStudentId())
                .orElseThrow(() -> new EntityNotFoundException("Student not found"));

        // Get course from redemption response
        Course course = courseRepository.findById(redemption.getCourseId())
                .orElseThrow(() -> new EntityNotFoundException("Course not found"));

        // Create or update student progress
        createOrUpdateStudentProgress(student, course);

        // Send enrollment notification
        if (!course.getLessons().isEmpty()) {
            notificationService.sendContentUpdateNotification(
                    List.of(student.getUserProfile()),
                    course.getLessons().iterator().next());
        }

        CourseEnrollmentDTO result = new CourseEnrollmentDTO();
        result.setStudentId(student.getId());
        result.setCourseId(course.getId());
        result.setEnrollmentDate(Instant.now());
        result.setStatus("ENROLLED");

        LOG.info("Successfully enrolled student {} in course {}", student.getId(), course.getId());

        return result;
    }

    /**
     * Get course progress for a student.
     *
     * @param courseId  the course ID
     * @param studentId the student ID
     * @return the student progress
     */
    @Transactional(readOnly = true)
    public Optional<StudentProgress> getCourseProgress(Long courseId, Long studentId) {
        LOG.debug("Request to get course progress for student: {} in course: {}", studentId, courseId);
        return studentProgressRepository.findByStudentIdAndCourseId(studentId, courseId);
    }

    /**
     * Update course completion status for a student.
     *
     * @param courseId             the course ID
     * @param studentId            the student ID
     * @param completionPercentage the completion percentage
     */
    public void updateCourseProgress(Long courseId, Long studentId, Double completionPercentage) {
        LOG.debug("Request to update course progress for student: {} in course: {} to {}%",
                studentId, courseId, completionPercentage);

        StudentProgress progress = studentProgressRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new EntityNotFoundException("Student progress not found"));

        progress.setCompletionPercentage(completionPercentage);
        progress.setLastActivityDate(java.time.LocalDateTime.now());
        progress.setUpdatedDate(java.time.LocalDateTime.now());

        studentProgressRepository.save(progress);

        LOG.info("Updated course progress for student: {} in course: {} to {}%",
                studentId, courseId, completionPercentage);
    }

    private void validateAdminPermission(Long userId) {
        UserProfile user = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (user.getRole() != Role.ADMIN) {
            throw new InsufficientPermissionException("Only admins can perform this operation");
        }
    }

    private void validateCourseData(CourseDTO courseDTO) {
        if (courseDTO.getTitle() == null || courseDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Course title is required");
        }

        if (courseDTO.getCourseCode() != null &&
                courseRepository.existsByCourseCodeAndIdNot(courseDTO.getCourseCode(),
                        courseDTO.getId() != null ? courseDTO.getId() : -1L)) {
            throw new IllegalArgumentException("Course code already exists");
        }
    }

    private void handleCourseDeletion(Course course) {
        // Remove student progress records
        studentProgressRepository.deleteByCourseId(course.getId());

        // Deactivate related gift codes
        course.getGiftCodes().forEach(giftCode -> {
            giftCode.setActive(false);
        });
    }

    private void createOrUpdateStudentProgress(StudentProfile student, Course course) {
        Optional<StudentProgress> existingProgress = studentProgressRepository
                .findByStudentIdAndCourseId(student.getId(), course.getId());

        if (existingProgress.isEmpty()) {
            StudentProgress progress = new StudentProgress();
            progress.setStudent(student);
            progress.setCourse(course);
            progress.setCompletionPercentage(0.0);
            progress.setLessonsCompleted(0);
            progress.setTotalLessons(course.getLessons().size());
            progress.setQuizzesCompleted(0);
            progress.setTotalQuizzes(course.getQuizzes().size());
            progress.setFlashcardsMastered(0);
            progress.setStudyTimeMinutes(0);
            progress.setStreakDays(0);
            progress.setCreatedDate(java.time.LocalDateTime.now());
            progress.setUpdatedDate(java.time.LocalDateTime.now());
            progress.setLastActivityDate(java.time.LocalDateTime.now());

            studentProgressRepository.save(progress);
        }
    }

    private void notifyStudentsOfCourseUpdate(Course course) {
        List<StudentProfile> enrolledStudents = studentProgressRepository.findStudentsByCourseId(course.getId());

        enrolledStudents.forEach(student -> {
            try {
                // Use existing notification method with lesson content
                if (!course.getLessons().isEmpty()) {
                    notificationService.sendContentUpdateNotification(
                            List.of(student.getUserProfile()),
                            course.getLessons().iterator().next());
                }
            } catch (Exception e) {
                LOG.warn("Failed to send course update notification to student: {}", student.getId(), e);
            }
        });
    }

    private CourseWithStatsDTO mapCourseToStatsDTO(Course course) {
        CourseDTO courseDTO = courseMapper.toDto(course);
        CourseWithStatsDTO statsDTO = new CourseWithStatsDTO(courseDTO);

        // Calculate statistics
        int enrollmentCount = studentProgressRepository.countByCourseId(course.getId());
        int lessonsCount = course.getLessons().size();
        int quizzesCount = course.getQuizzes().size();

        // Calculate completion rate (average of all enrolled students)
        Double completionRate = studentProgressRepository.getAverageCompletionRateByCourseId(course.getId());

        // Calculate average score from quiz attempts
        Double averageScore = studentProgressRepository.getAverageScoreByCourseId(course.getId());

        // Count active students (students with activity in last 30 days)
        int activeStudents = studentProgressRepository.countActiveStudentsByCourseId(course.getId());

        // Count total classes for this course
        int totalClasses = courseRepository.countClassesByCourseId(course.getId());

        statsDTO.setEnrollmentCount(enrollmentCount);
        statsDTO.setLessonsCount(lessonsCount);
        statsDTO.setQuizzesCount(quizzesCount);
        statsDTO.setCompletionRate(completionRate != null ? completionRate : 0.0);
        statsDTO.setAverageScore(averageScore != null ? averageScore : 0.0);
        statsDTO.setActiveStudents(activeStudents);
        statsDTO.setTotalClasses(totalClasses);

        return statsDTO;
    }
}