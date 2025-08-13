package com.satori.platform.service;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.Schedule;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.ScheduleRepository;
import com.satori.platform.repository.StudentProgressRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.service.dto.ScheduleDTO;
import com.satori.platform.service.exception.InsufficientPermissionException;
import com.satori.platform.service.mapper.ScheduleMapper;
import jakarta.persistence.EntityNotFoundException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.satori.platform.domain.Schedule}.
 */
@Service
@Transactional
public class ScheduleService {

    private static final Logger LOG = LoggerFactory.getLogger(ScheduleService.class);

    private final ScheduleRepository scheduleRepository;
    private final CourseRepository courseRepository;
    private final UserProfileRepository userProfileRepository;
    private final StudentProgressRepository studentProgressRepository;
    private final ScheduleMapper scheduleMapper;
    private final NotificationService notificationService;

     public ScheduleService(
            ScheduleRepository scheduleRepository,
            CourseRepository courseRepository,
            UserProfileRepository userProfileRepository,
            StudentProgressRepository studentProgressRepository,
            ScheduleMapper scheduleMapper,
            NotificationService notificationService) {
        this.scheduleRepository = scheduleRepository;
        this.courseRepository = courseRepository;
        this.userProfileRepository = userProfileRepository;
        this.studentProgressRepository = studentProgressRepository;
        this.scheduleMapper = scheduleMapper;
        this.notificationService = notificationService;
    }

    /**
     * Create a new schedule with conflict detection.
     *
     * @param scheduleDTO the schedule to create
     * @param teacherId   the teacher user ID
     * @return the created schedule
     * @throws InsufficientPermissionException if user is not teacher of the course
     * @throws IllegalArgumentException        if schedule conflicts exist
     */
    public ScheduleDTO createSchedule(ScheduleDTO scheduleDTO, Long teacherId) {
        LOG.debug("Request to create Schedule : {} by teacher: {}", scheduleDTO, teacherId);

        validateTeacherPermission(teacherId, scheduleDTO.getCourse().getId());
        validateScheduleData(scheduleDTO);
        checkForConflicts(scheduleDTO, null);

        Schedule schedule = scheduleMapper.toEntity(scheduleDTO);
        schedule.setId(null); // Ensure new entity

        schedule = scheduleRepository.save(schedule);
        LOG.info("Created new schedule with ID: {} by teacher: {}", schedule.getId(), teacherId);

        // Notify enrolled students of new schedule
        notifyStudentsOfScheduleChange(schedule, "NEW_SCHEDULE");

        return scheduleMapper.toDto(schedule);
    }

    /**
     * Update an existing schedule with conflict detection.
     *
     * @param scheduleId  the schedule ID to update
     * @param scheduleDTO the updated schedule data
     * @param teacherId   the teacher user ID
     * @return the updated schedule
     * @throws EntityNotFoundException         if schedule not found
     * @throws InsufficientPermissionException if user is not teacher of the course
     * @throws IllegalArgumentException        if schedule conflicts exist
     */
    public ScheduleDTO updateSchedule(Long scheduleId, ScheduleDTO scheduleDTO, Long teacherId) {
        LOG.debug("Request to update Schedule : {} by teacher: {}", scheduleId, teacherId);

        Schedule existingSchedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + scheduleId));

        validateTeacherPermission(teacherId, existingSchedule.getCourse().getId());
        validateScheduleData(scheduleDTO);
        checkForConflicts(scheduleDTO, scheduleId);

        // Update fields
        existingSchedule.setDate(scheduleDTO.getDate());
        existingSchedule.setStartTime(scheduleDTO.getStartTime());
        existingSchedule.setEndTime(scheduleDTO.getEndTime());
        existingSchedule.setLocation(scheduleDTO.getLocation());

        Schedule updatedSchedule = scheduleRepository.save(existingSchedule);
        LOG.info("Updated schedule with ID: {} by teacher: {}", scheduleId, teacherId);

        // Notify enrolled students of schedule update
        notifyStudentsOfScheduleChange(updatedSchedule, "SCHEDULE_UPDATE");

        return scheduleMapper.toDto(updatedSchedule);
    }

    /**
     * Delete a schedule with teacher validation.
     *
     * @param scheduleId the schedule ID to delete
     * @param teacherId  the teacher user ID
     * @throws EntityNotFoundException         if schedule not found
     * @throws InsufficientPermissionException if user is not teacher of the course
     */
    public void deleteSchedule(Long scheduleId, Long teacherId) {
        LOG.debug("Request to delete Schedule : {} by teacher: {}", scheduleId, teacherId);

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + scheduleId));

        validateTeacherPermission(teacherId, schedule.getCourse().getId());

        // Notify students before deletion
        notifyStudentsOfScheduleChange(schedule, "SCHEDULE_CANCELLED");

        scheduleRepository.delete(schedule);
        LOG.info("Deleted schedule with ID: {} by teacher: {}", scheduleId, teacherId);
    }

    /**
     * Get schedules by course.
     *
     * @param courseId the course ID
     * @return list of schedules
     */
    @Transactional(readOnly = true)
    public List<ScheduleDTO> getSchedulesByCourse(Long courseId) {
        LOG.debug("Request to get schedules for course: {}", courseId);

        List<Schedule> schedules = scheduleRepository.findByCourseId(courseId);
        return schedules.stream()
                .map(scheduleMapper::toDto)
                .toList();
    }

    /**
     * Get schedules by teacher.
     *
     * @param teacherId the teacher ID
     * @return list of schedules
     */
    @Transactional(readOnly = true)
    public List<ScheduleDTO> getSchedulesByTeacher(Long teacherId) {
        LOG.debug("Request to get schedules for teacher: {}", teacherId);

        List<Schedule> schedules = scheduleRepository.findByTeacherId(teacherId);
        return schedules.stream()
                .map(scheduleMapper::toDto)
                .toList();
    }

    /**
     * Get upcoming schedules for a course.
     *
     * @param courseId the course ID
     * @return list of upcoming schedules
     */
    @Transactional(readOnly = true)
    public List<ScheduleDTO> getUpcomingSchedulesByCourse(Long courseId) {
        LOG.debug("Request to get upcoming schedules for course: {}", courseId);

        List<Schedule> schedules = scheduleRepository.findUpcomingSchedulesByCourseId(courseId, Instant.now());
        return schedules.stream()
                .map(scheduleMapper::toDto)
                .toList();
    }

    /**
     * Add students to a scheduled lesson.
     *
     * @param scheduleId the schedule ID
     * @param studentIds the list of student IDs to add
     * @param teacherId  the teacher user ID
     * @throws EntityNotFoundException         if schedule not found
     * @throws InsufficientPermissionException if user is not teacher of the course
     */
    public void addStudentsToSchedule(Long scheduleId, List<Long> studentIds, Long teacherId) {
        LOG.debug("Request to add students {} to schedule: {} by teacher: {}", studentIds, scheduleId, teacherId);

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + scheduleId));

        validateTeacherPermission(teacherId, schedule.getCourse().getId());

        // Ensure students are enrolled in the course
        Course course = schedule.getCourse();
        for (Long studentId : studentIds) {
            if (!studentProgressRepository.existsByStudentIdAndCourseId(studentId, course.getId())) {
                throw new IllegalArgumentException(
                        "Student " + studentId + " is not enrolled in course " + course.getId());
            }
        }

        // Notify students of schedule assignment
        List<StudentProfile> students = studentIds.stream()
                .map(studentId -> studentProgressRepository.findByStudentIdAndCourseId(studentId, course.getId())
                        .map(progress -> progress.getStudent())
                        .orElseThrow(() -> new EntityNotFoundException("Student progress not found")))
                .toList();

        notifyStudentsOfScheduleAssignment(schedule, students);

        LOG.info("Added {} students to schedule: {}", studentIds.size(), scheduleId);
    }

    /**
     * Check for schedule conflicts.
     *
     * @param scheduleDTO the schedule to check
     * @param excludeId   the schedule ID to exclude from conflict check (for
     *                    updates)
     * @return list of conflicting schedules
     */
    @Transactional(readOnly = true)
    public List<ScheduleDTO> checkScheduleConflicts(ScheduleDTO scheduleDTO, Long excludeId) {
        LOG.debug("Request to check conflicts for schedule: {}", scheduleDTO);

        List<Schedule> conflicts = scheduleRepository.findConflictingSchedules(
                scheduleDTO.getCourse().getId(),
                scheduleDTO.getStartTime(),
                scheduleDTO.getEndTime());

        if (excludeId != null) {
            conflicts = conflicts.stream()
                    .filter(schedule -> !schedule.getId().equals(excludeId))
                    .toList();
        }

        return conflicts.stream()
                .map(scheduleMapper::toDto)
                .toList();
    }

    private void validateTeacherPermission(Long teacherId, Long courseId) {
        UserProfile teacher = userProfileRepository.findById(teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new EntityNotFoundException("Course not found"));

        if (!course.getTeacher().getId().equals(teacherId)
                && teacher.getRole() != com.satori.platform.domain.enumeration.Role.ADMIN) {
            throw new InsufficientPermissionException("Only the course teacher or admin can perform this operation");
        }
    }

    private void validateScheduleData(ScheduleDTO scheduleDTO) {
        if (scheduleDTO.getDate() == null) {
            throw new IllegalArgumentException("Schedule date is required");
        }

        if (scheduleDTO.getStartTime() == null) {
            throw new IllegalArgumentException("Schedule start time is required");
        }

        if (scheduleDTO.getEndTime() == null) {
            throw new IllegalArgumentException("Schedule end time is required");
        }

        if (scheduleDTO.getStartTime().isAfter(scheduleDTO.getEndTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        if (scheduleDTO.getCourse() == null || scheduleDTO.getCourse().getId() == null) {
            throw new IllegalArgumentException("Course is required for schedule");
        }

        // Check if schedule is in the past
        if (scheduleDTO.getStartTime().isBefore(Instant.now().minus(1, ChronoUnit.HOURS))) {
            throw new IllegalArgumentException("Cannot schedule classes in the past");
        }
    }

    private void checkForConflicts(ScheduleDTO scheduleDTO, Long excludeId) {
        List<ScheduleDTO> conflicts = checkScheduleConflicts(scheduleDTO, excludeId);

        if (!conflicts.isEmpty()) {
            String conflictDetails = conflicts.stream()
                    .map(conflict -> String.format("Schedule ID %d from %s to %s",
                            conflict.getId(),
                            conflict.getStartTime(),
                            conflict.getEndTime()))
                    .reduce((a, b) -> a + "; " + b)
                    .orElse("");

            throw new IllegalArgumentException("Schedule conflicts detected: " + conflictDetails);
        }
    }

    private void notifyStudentsOfScheduleChange(Schedule schedule, String changeType) {
        Course course = schedule.getCourse();
        List<StudentProfile> enrolledStudents = studentProgressRepository.findStudentsByCourseId(course.getId());

        enrolledStudents.forEach(student -> {
            try {
                notificationService.sendScheduleReminder(student.getUserProfile(), schedule);
            } catch (Exception e) {
                LOG.warn("Failed to send schedule notification to student: {}", student.getId(), e);
            }
        });
    }

    private void notifyStudentsOfScheduleAssignment(Schedule schedule, List<StudentProfile> students) {
        students.forEach(student -> {
            try {
                notificationService.sendScheduleReminder(student.getUserProfile(), schedule);
            } catch (Exception e) {
                LOG.warn("Failed to send schedule assignment notification to student: {}", student.getId(), e);
            }
        });
    }

    // Legacy methods for compatibility with existing ScheduleResource

    /**
     * Save a schedule (legacy method).
     *
     * @param scheduleDTO the entity to save
     * @return the persisted entity
     */
    public ScheduleDTO save(ScheduleDTO scheduleDTO) {
        LOG.debug("Request to save Schedule : {}", scheduleDTO);
        // For new schedules, we need to determine the teacher from the course
        if (scheduleDTO.getId() == null && scheduleDTO.getCourse() != null) {
            Course course = courseRepository.findById(scheduleDTO.getCourse().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Course not found"));
            return createSchedule(scheduleDTO, course.getTeacher().getId());
        }
        throw new IllegalArgumentException("Cannot save schedule without course information");
    }

    /**
     * Update a schedule (legacy method).
     *
     * @param scheduleDTO the entity to update
     * @return the persisted entity
     */
    public ScheduleDTO update(ScheduleDTO scheduleDTO) {
        LOG.debug("Request to update Schedule : {}", scheduleDTO);
        if (scheduleDTO.getId() != null && scheduleDTO.getCourse() != null) {
            Course course = courseRepository.findById(scheduleDTO.getCourse().getId())
                    .orElseThrow(() -> new EntityNotFoundException("Course not found"));
            return updateSchedule(scheduleDTO.getId(), scheduleDTO, course.getTeacher().getId());
        }
        throw new IllegalArgumentException("Cannot update schedule without ID and course information");
    }

    /**
     * Partially update a schedule (legacy method).
     *
     * @param scheduleDTO the entity to update partially
     * @return the persisted entity
     */
    public Optional<ScheduleDTO> partialUpdate(ScheduleDTO scheduleDTO) {
        LOG.debug("Request to partially update Schedule : {}", scheduleDTO);
        if (scheduleDTO.getId() != null) {
            Schedule existingSchedule = scheduleRepository.findById(scheduleDTO.getId())
                    .orElseThrow(() -> new EntityNotFoundException("Schedule not found"));

            // Update only non-null fields
            if (scheduleDTO.getDate() != null) {
                existingSchedule.setDate(scheduleDTO.getDate());
            }
            if (scheduleDTO.getStartTime() != null) {
                existingSchedule.setStartTime(scheduleDTO.getStartTime());
            }
            if (scheduleDTO.getEndTime() != null) {
                existingSchedule.setEndTime(scheduleDTO.getEndTime());
            }
            if (scheduleDTO.getLocation() != null) {
                existingSchedule.setLocation(scheduleDTO.getLocation());
            }

            Schedule updatedSchedule = scheduleRepository.save(existingSchedule);
            return Optional.of(scheduleMapper.toDto(updatedSchedule));
        }
        return Optional.empty();
    }

    /**
     * Get all schedules (legacy method).
     *
     * @param pageable the pagination information
     * @return the list of entities
     */
    @Transactional(readOnly = true)
    public Page<ScheduleDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Schedules");
        return scheduleRepository.findAll(pageable).map(scheduleMapper::toDto);
    }

    /**
     * Get one schedule by id (legacy method).
     *
     * @param id the id of the entity
     * @return the entity
     */
    @Transactional(readOnly = true)
    public Optional<ScheduleDTO> findOne(Long id) {
        LOG.debug("Request to get Schedule : {}", id);
        return scheduleRepository.findById(id).map(scheduleMapper::toDto);
    }

    /**
     * Delete the schedule by id (legacy method).
     *
     * @param id the id of the entity
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Schedule : {}", id);
        Schedule schedule = scheduleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found"));

        // Use the teacher ID from the course for permission validation
        deleteSchedule(id, schedule.getCourse().getTeacher().getId());
    }
}
