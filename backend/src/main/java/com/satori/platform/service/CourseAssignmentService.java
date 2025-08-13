package com.satori.platform.service;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.CourseClass;
import com.satori.platform.domain.Schedule;
import com.satori.platform.domain.TeacherProfile;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.repository.CourseClassRepository;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.ScheduleRepository;
import com.satori.platform.repository.TeacherProfileRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.service.dto.CourseAssignmentDTO;
import com.satori.platform.service.dto.ScheduleConflictDTO;
import com.satori.platform.service.dto.ScheduleDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for managing course assignments and scheduling.
 */
@Service
@Transactional
public class CourseAssignmentService {

    private static final Logger LOG = LoggerFactory.getLogger(CourseAssignmentService.class);

    private final CourseRepository courseRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final CourseClassRepository courseClassRepository;
    private final ScheduleRepository scheduleRepository;
    private final UserProfileRepository userProfileRepository;

    public CourseAssignmentService(
            CourseRepository courseRepository,
            TeacherProfileRepository teacherProfileRepository,
            CourseClassRepository courseClassRepository,
            ScheduleRepository scheduleRepository,
            UserProfileRepository userProfileRepository) {
        this.courseRepository = courseRepository;
        this.teacherProfileRepository = teacherProfileRepository;
        this.courseClassRepository = courseClassRepository;
        this.scheduleRepository = scheduleRepository;
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * Assign a course to a teacher.
     *
     * @param assignmentDTO the assignment details
     * @return the updated course
     */
    public Course assignCourseToTeacher(CourseAssignmentDTO assignmentDTO) {
        LOG.debug("Assigning course {} to teacher {}", assignmentDTO.getCourseId(), assignmentDTO.getTeacherId());

        Course course = courseRepository.findById(assignmentDTO.getCourseId())
                .orElseThrow(() -> new BadRequestAlertException("Course not found", "course", "notfound"));

        UserProfile teacher = userProfileRepository.findById(assignmentDTO.getTeacherId())
                .orElseThrow(() -> new BadRequestAlertException("Teacher not found", "teacher", "notfound"));

        // Validate that the user is actually a teacher
        TeacherProfile teacherProfile = teacherProfileRepository.findByUserProfile(teacher)
                .orElseThrow(() -> new BadRequestAlertException("User is not a teacher", "teacher", "notteacher"));

        course.setTeacher(teacher);
        return courseRepository.save(course);
    }

    /**
     * Assign a course to multiple classes.
     *
     * @param assignmentDTO the assignment details
     * @return list of updated classes
     */
    public List<CourseClass> assignCourseToClasses(CourseAssignmentDTO assignmentDTO) {
        LOG.debug("Assigning course {} to classes {}", assignmentDTO.getCourseId(), assignmentDTO.getClassIds());

        Course course = courseRepository.findById(assignmentDTO.getCourseId())
                .orElseThrow(() -> new BadRequestAlertException("Course not found", "course", "notfound"));

        List<CourseClass> updatedClasses = new ArrayList<>();

        for (Long classId : assignmentDTO.getClassIds()) {
            CourseClass courseClass = courseClassRepository.findById(classId)
                    .orElseThrow(() -> new BadRequestAlertException("Class not found", "class", "notfound"));

            courseClass.setCourse(course);
            updatedClasses.add(courseClassRepository.save(courseClass));
        }

        return updatedClasses;
    }

    /**
     * Create a new schedule for a course.
     *
     * @param scheduleDTO the schedule details
     * @return the created schedule
     */
    public ScheduleDTO createSchedule(ScheduleDTO scheduleDTO) {
        LOG.debug("Creating schedule: {}", scheduleDTO);

        // Validate course exists
        Course course = courseRepository.findById(scheduleDTO.getCourseId())
                .orElseThrow(() -> new BadRequestAlertException("Course not found", "course", "notfound"));

        // Check for conflicts before creating
        ScheduleConflictDTO conflicts = checkScheduleConflicts(scheduleDTO);
        if (conflicts.isHasConflicts()) {
            throw new BadRequestAlertException("Schedule conflicts detected: " + conflicts.getMessage(),
                    "schedule", "conflicts");
        }

        Schedule schedule = new Schedule();
        schedule.setDate(scheduleDTO.getDate());
        schedule.setStartTime(scheduleDTO.getStartTime());
        schedule.setEndTime(scheduleDTO.getEndTime());
        schedule.setLocation(scheduleDTO.getLocation());
        schedule.setCourse(course);

        Schedule savedSchedule = scheduleRepository.save(schedule);
        return convertToScheduleDTO(savedSchedule);
    }

    /**
     * Update an existing schedule.
     *
     * @param scheduleId  the schedule ID
     * @param scheduleDTO the updated schedule details
     * @return the updated schedule
     */
    public ScheduleDTO updateSchedule(Long scheduleId, ScheduleDTO scheduleDTO) {
        LOG.debug("Updating schedule {}: {}", scheduleId, scheduleDTO);

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BadRequestAlertException("Schedule not found", "schedule", "notfound"));

        // Check for conflicts before updating (excluding current schedule)
        scheduleDTO.setId(scheduleId);
        ScheduleConflictDTO conflicts = checkScheduleConflicts(scheduleDTO);
        if (conflicts.isHasConflicts()) {
            throw new BadRequestAlertException("Schedule conflicts detected: " + conflicts.getMessage(),
                    "schedule", "conflicts");
        }

        schedule.setDate(scheduleDTO.getDate());
        schedule.setStartTime(scheduleDTO.getStartTime());
        schedule.setEndTime(scheduleDTO.getEndTime());
        schedule.setLocation(scheduleDTO.getLocation());

        Schedule savedSchedule = scheduleRepository.save(schedule);
        return convertToScheduleDTO(savedSchedule);
    }

    /**
     * Check for schedule conflicts.
     *
     * @param scheduleDTO the schedule to check
     * @return conflict details
     */
    @Transactional(readOnly = true)
    public ScheduleConflictDTO checkScheduleConflicts(ScheduleDTO scheduleDTO) {
        LOG.debug("Checking schedule conflicts for: {}", scheduleDTO);

        List<ScheduleConflictDTO.ConflictDetail> conflicts = new ArrayList<>();

        // Get course and teacher information
        Course course = courseRepository.findById(scheduleDTO.getCourseId())
                .orElseThrow(() -> new BadRequestAlertException("Course not found", "course", "notfound"));

        UserProfile teacher = course.getTeacher();

        // Check teacher conflicts
        if (teacher != null) {
            List<Schedule> teacherSchedules = scheduleRepository.findByTeacherAndTimeRange(
                    teacher.getId(), scheduleDTO.getStartTime(), scheduleDTO.getEndTime());

            for (Schedule conflictingSchedule : teacherSchedules) {
                // Skip if it's the same schedule being updated
                if (scheduleDTO.getId() != null && conflictingSchedule.getId().equals(scheduleDTO.getId())) {
                    continue;
                }

                if (isTimeOverlapping(scheduleDTO.getStartTime(), scheduleDTO.getEndTime(),
                        conflictingSchedule.getStartTime(), conflictingSchedule.getEndTime())) {

                    ScheduleConflictDTO.ConflictDetail conflict = new ScheduleConflictDTO.ConflictDetail();
                    conflict.setConflictType("TEACHER");
                    conflict.setConflictingScheduleId(conflictingSchedule.getId());
                    conflict.setConflictingCourseTitle(conflictingSchedule.getCourse().getTitle());
                    conflict.setConflictingTeacherName(teacher.getFullName());
                    conflict.setConflictingStartTime(conflictingSchedule.getStartTime());
                    conflict.setConflictingEndTime(conflictingSchedule.getEndTime());
                    conflict.setDescription("Teacher " + teacher.getFullName() + " is already scheduled for course " +
                            conflictingSchedule.getCourse().getTitle());
                    conflicts.add(conflict);
                }
            }
        }

        // Check location conflicts
        if (scheduleDTO.getLocation() != null && !scheduleDTO.getLocation().trim().isEmpty()) {
            List<Schedule> locationSchedules = scheduleRepository.findByLocationAndTimeRange(
                    scheduleDTO.getLocation(), scheduleDTO.getStartTime(), scheduleDTO.getEndTime());

            for (Schedule conflictingSchedule : locationSchedules) {
                // Skip if it's the same schedule being updated
                if (scheduleDTO.getId() != null && conflictingSchedule.getId().equals(scheduleDTO.getId())) {
                    continue;
                }

                if (isTimeOverlapping(scheduleDTO.getStartTime(), scheduleDTO.getEndTime(),
                        conflictingSchedule.getStartTime(), conflictingSchedule.getEndTime())) {

                    ScheduleConflictDTO.ConflictDetail conflict = new ScheduleConflictDTO.ConflictDetail();
                    conflict.setConflictType("LOCATION");
                    conflict.setConflictingScheduleId(conflictingSchedule.getId());
                    conflict.setConflictingCourseTitle(conflictingSchedule.getCourse().getTitle());
                    conflict.setConflictingLocation(conflictingSchedule.getLocation());
                    conflict.setConflictingStartTime(conflictingSchedule.getStartTime());
                    conflict.setConflictingEndTime(conflictingSchedule.getEndTime());
                    conflict.setDescription("Location " + scheduleDTO.getLocation() + " is already booked for course " +
                            conflictingSchedule.getCourse().getTitle());
                    conflicts.add(conflict);
                }
            }
        }

        boolean hasConflicts = !conflicts.isEmpty();
        String message = hasConflicts ? "Found " + conflicts.size() + " scheduling conflict(s)"
                : "No scheduling conflicts detected";

        return new ScheduleConflictDTO(hasConflicts, conflicts, message);
    }

    /**
     * Get schedules for a course.
     *
     * @param courseId the course ID
     * @param pageable pagination information
     * @return page of schedules
     */
    @Transactional(readOnly = true)
    public Page<ScheduleDTO> getSchedulesByCourse(Long courseId, Pageable pageable) {
        LOG.debug("Getting schedules for course: {}", courseId);

        Page<Schedule> schedules = scheduleRepository.findByCourseId(courseId, pageable);
        List<ScheduleDTO> scheduleDTOs = schedules.getContent().stream()
                .map(this::convertToScheduleDTO)
                .toList();

        return new PageImpl<>(scheduleDTOs, pageable, schedules.getTotalElements());
    }

    /**
     * Get schedules for a teacher.
     *
     * @param teacherId the teacher ID
     * @param pageable  pagination information
     * @return page of schedules
     */
    @Transactional(readOnly = true)
    public Page<ScheduleDTO> getSchedulesByTeacher(Long teacherId, Pageable pageable) {
        LOG.debug("Getting schedules for teacher: {}", teacherId);

        Page<Schedule> schedules = scheduleRepository.findByTeacherId(teacherId, pageable);
        List<ScheduleDTO> scheduleDTOs = schedules.getContent().stream()
                .map(this::convertToScheduleDTO)
                .toList();

        return new PageImpl<>(scheduleDTOs, pageable, schedules.getTotalElements());
    }

    /**
     * Delete a schedule.
     *
     * @param scheduleId the schedule ID
     */
    public void deleteSchedule(Long scheduleId) {
        LOG.debug("Deleting schedule: {}", scheduleId);

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new BadRequestAlertException("Schedule not found", "schedule", "notfound"));

        scheduleRepository.delete(schedule);
    }

    private boolean isTimeOverlapping(Instant start1, Instant end1, Instant start2, Instant end2) {
        return start1.isBefore(end2) && end1.isAfter(start2);
    }

    private ScheduleDTO convertToScheduleDTO(Schedule schedule) {
        ScheduleDTO dto = new ScheduleDTO();
        dto.setId(schedule.getId());
        dto.setDate(schedule.getDate());
        dto.setStartTime(schedule.getStartTime());
        dto.setEndTime(schedule.getEndTime());
        dto.setLocation(schedule.getLocation());

        if (schedule.getCourse() != null) {
            dto.setCourseId(schedule.getCourse().getId());
            dto.setCourseTitle(schedule.getCourse().getTitle());

            if (schedule.getCourse().getTeacher() != null) {
                dto.setTeacherId(schedule.getCourse().getTeacher().getId());
                dto.setTeacherName(schedule.getCourse().getTeacher().getFullName());
            }
        }

        return dto;
    }
}