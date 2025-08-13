package com.satori.platform.service;

import com.satori.platform.domain.CourseClass;
import com.satori.platform.domain.Schedule;
import com.satori.platform.domain.TeacherProfile;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.repository.CourseClassRepository;
import com.satori.platform.repository.ScheduleRepository;
import com.satori.platform.repository.TeacherProfileRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.service.dto.ScheduleConflictDTO;
import com.satori.platform.service.dto.ScheduleDTO;
import com.satori.platform.service.exception.InsufficientPermissionException;
import com.satori.platform.service.mapper.ScheduleMapper;
import jakarta.persistence.EntityNotFoundException;
import java.time.DayOfWeek;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing class schedules with conflict detection
 * and recurring support.
 */
@Service
@Transactional
public class ClassScheduleService {

    private static final Logger LOG = LoggerFactory.getLogger(ClassScheduleService.class);

    private final ScheduleRepository scheduleRepository;
    private final CourseClassRepository courseClassRepository;
    private final TeacherProfileRepository teacherProfileRepository;
    private final UserProfileRepository userProfileRepository;
    private final ScheduleMapper scheduleMapper;
    private final NotificationService notificationService;

    public ClassScheduleService(
            ScheduleRepository scheduleRepository,
            CourseClassRepository courseClassRepository,
            TeacherProfileRepository teacherProfileRepository,
            UserProfileRepository userProfileRepository,
            ScheduleMapper scheduleMapper,
            NotificationService notificationService) {
        this.scheduleRepository = scheduleRepository;
        this.courseClassRepository = courseClassRepository;
        this.teacherProfileRepository = teacherProfileRepository;
        this.userProfileRepository = userProfileRepository;
        this.scheduleMapper = scheduleMapper;
        this.notificationService = notificationService;
    }

    /**
     * Create a new class schedule with conflict detection.
     *
     * @param classId     the class ID
     * @param scheduleDTO the schedule to create
     * @param userId      the user ID creating the schedule
     * @return the created schedule
     */
    public ScheduleDTO createClassSchedule(Long classId, ScheduleDTO scheduleDTO, Long userId) {
        LOG.debug("Request to create class schedule for class: {} by user: {}", classId, userId);

        CourseClass courseClass = validateClassAccess(classId, userId);
        validateScheduleData(scheduleDTO);

        // Check for conflicts
        ScheduleConflictDTO conflicts = checkScheduleConflicts(classId, scheduleDTO, null);
        if (conflicts.isHasConflicts()) {
            throw new IllegalArgumentException("Schedule conflicts detected: " + conflicts.getMessage());
        }

        Schedule schedule = scheduleMapper.toEntity(scheduleDTO);
        schedule.setId(null); // Ensure new entity
        schedule.setCourse(courseClass.getCourse());

        schedule = scheduleRepository.save(schedule);
        LOG.info("Created new class schedule with ID: {} for class: {}", schedule.getId(), classId);

        // Notify enrolled students
        notifyStudentsOfScheduleChange(schedule, "NEW_SCHEDULE");

        return scheduleMapper.toDto(schedule);
    }

    /**
     * Create recurring class schedules.
     *
     * @param classId     the class ID
     * @param scheduleDTO the base schedule with recurring settings
     * @param userId      the user ID creating the schedules
     * @return list of created schedules
     */
    public List<ScheduleDTO> createRecurringClassSchedules(Long classId, ScheduleDTO scheduleDTO, Long userId) {
        LOG.debug("Request to create recurring class schedules for class: {} by user: {}", classId, userId);

        CourseClass courseClass = validateClassAccess(classId, userId);
        validateScheduleData(scheduleDTO);
        validateRecurringData(scheduleDTO);

        List<Schedule> createdSchedules = new ArrayList<>();
        List<ScheduleConflictDTO.ConflictDetail> allConflicts = new ArrayList<>();

        // Generate recurring schedule dates
        List<Instant> scheduleDates = generateRecurringDates(scheduleDTO);

        for (Instant scheduleDate : scheduleDates) {
            ScheduleDTO recurringSchedule = createRecurringScheduleInstance(scheduleDTO, scheduleDate);

            // Check for conflicts for this instance
            ScheduleConflictDTO conflicts = checkScheduleConflicts(classId, recurringSchedule, null);
            if (conflicts.isHasConflicts()) {
                allConflicts.addAll(conflicts.getConflicts());
                LOG.warn("Conflict detected for recurring schedule on {}: {}", scheduleDate, conflicts.getMessage());
                continue; // Skip this instance
            }

            Schedule schedule = scheduleMapper.toEntity(recurringSchedule);
            schedule.setId(null);
            schedule.setCourse(courseClass.getCourse());

            createdSchedules.add(scheduleRepository.save(schedule));
        }

        if (!allConflicts.isEmpty()) {
            LOG.warn("Some recurring schedules were skipped due to conflicts. Created {} out of {} schedules",
                    createdSchedules.size(), scheduleDates.size());
        }

        LOG.info("Created {} recurring class schedules for class: {}", createdSchedules.size(), classId);

        // Notify students of new recurring schedules
        createdSchedules.forEach(schedule -> notifyStudentsOfScheduleChange(schedule, "NEW_RECURRING_SCHEDULE"));

        return createdSchedules.stream().map(scheduleMapper::toDto).toList();
    }

    /**
     * Update an existing class schedule.
     *
     * @param classId     the class ID
     * @param scheduleId  the schedule ID to update
     * @param scheduleDTO the updated schedule data
     * @param userId      the user ID updating the schedule
     * @return the updated schedule
     */
    public ScheduleDTO updateClassSchedule(Long classId, Long scheduleId, ScheduleDTO scheduleDTO, Long userId) {
        LOG.debug("Request to update class schedule: {} for class: {} by user: {}", scheduleId, classId, userId);

        validateClassAccess(classId, userId);
        validateScheduleData(scheduleDTO);

        Schedule existingSchedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + scheduleId));

        // Verify schedule belongs to the class
        if (!existingSchedule.getCourse().getId().equals(classId)) {
            throw new IllegalArgumentException("Schedule does not belong to the specified class");
        }

        // Check for conflicts (excluding current schedule)
        ScheduleConflictDTO conflicts = checkScheduleConflicts(classId, scheduleDTO, scheduleId);
        if (conflicts.isHasConflicts()) {
            throw new IllegalArgumentException("Schedule conflicts detected: " + conflicts.getMessage());
        }

        // Update fields
        existingSchedule.setDate(scheduleDTO.getDate());
        existingSchedule.setStartTime(scheduleDTO.getStartTime());
        existingSchedule.setEndTime(scheduleDTO.getEndTime());
        existingSchedule.setLocation(scheduleDTO.getLocation());

        Schedule updatedSchedule = scheduleRepository.save(existingSchedule);
        LOG.info("Updated class schedule with ID: {} for class: {}", scheduleId, classId);

        // Notify students of schedule update
        notifyStudentsOfScheduleChange(updatedSchedule, "SCHEDULE_UPDATE");

        return scheduleMapper.toDto(updatedSchedule);
    }

    /**
     * Delete a class schedule.
     *
     * @param classId    the class ID
     * @param scheduleId the schedule ID to delete
     * @param userId     the user ID deleting the schedule
     */
    public void deleteClassSchedule(Long classId, Long scheduleId, Long userId) {
        LOG.debug("Request to delete class schedule: {} for class: {} by user: {}", scheduleId, classId, userId);

        validateClassAccess(classId, userId);

        Schedule schedule = scheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new EntityNotFoundException("Schedule not found with id: " + scheduleId));

        // Verify schedule belongs to the class
        if (!schedule.getCourse().getId().equals(classId)) {
            throw new IllegalArgumentException("Schedule does not belong to the specified class");
        }

        // Notify students before deletion
        notifyStudentsOfScheduleChange(schedule, "SCHEDULE_CANCELLED");

        scheduleRepository.delete(schedule);
        LOG.info("Deleted class schedule with ID: {} for class: {}", scheduleId, classId);
    }

    /**
     * Get schedules for a class.
     *
     * @param classId  the class ID
     * @param pageable pagination information
     * @return page of schedules
     */
    @Transactional(readOnly = true)
    public Page<ScheduleDTO> getClassSchedules(Long classId, Pageable pageable) {
        LOG.debug("Request to get schedules for class: {}", classId);

        CourseClass courseClass = courseClassRepository.findById(classId)
                .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + classId));

        Page<Schedule> schedules = scheduleRepository.findByCourseIdOrderByDateAscStartTimeAsc(
                courseClass.getCourse().getId(), pageable);

        return schedules.map(scheduleMapper::toDto);
    }

    /**
     * Check for schedule conflicts.
     *
     * @param classId     the class ID
     * @param scheduleDTO the schedule to check
     * @param excludeId   the schedule ID to exclude from conflict check
     * @return conflict detection result
     */
    @Transactional(readOnly = true)
    public ScheduleConflictDTO checkScheduleConflicts(Long classId, ScheduleDTO scheduleDTO, Long excludeId) {
        LOG.debug("Request to check conflicts for class schedule: {}", scheduleDTO);

        CourseClass courseClass = courseClassRepository.findById(classId)
                .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + classId));

        List<ScheduleConflictDTO.ConflictDetail> conflicts = new ArrayList<>();

        // Check teacher conflicts
        TeacherProfile teacher = courseClass.getTeacher();
        if (teacher != null) {
            List<Schedule> teacherConflicts = scheduleRepository.findTeacherConflicts(
                    teacher.getId(), scheduleDTO.getStartTime(), scheduleDTO.getEndTime());

            if (excludeId != null) {
                teacherConflicts = teacherConflicts.stream()
                        .filter(schedule -> !schedule.getId().equals(excludeId))
                        .toList();
            }

            for (Schedule conflict : teacherConflicts) {
                ScheduleConflictDTO.ConflictDetail detail = new ScheduleConflictDTO.ConflictDetail();
                detail.setConflictType("TEACHER");
                detail.setConflictingScheduleId(conflict.getId());
                detail.setConflictingCourseTitle(conflict.getCourse().getTitle());
                detail.setConflictingTeacherName(teacher.getUserProfile().getFullName());
                detail.setConflictingStartTime(conflict.getStartTime());
                detail.setConflictingEndTime(conflict.getEndTime());
                detail.setDescription(String.format("Teacher %s is already scheduled for course %s",
                        teacher.getUserProfile().getFullName(), conflict.getCourse().getTitle()));
                conflicts.add(detail);
            }
        }

        // Check location conflicts
        if (scheduleDTO.getLocation() != null && !scheduleDTO.getLocation().trim().isEmpty()) {
            List<Schedule> locationConflicts = scheduleRepository.findLocationConflicts(
                    scheduleDTO.getLocation(), scheduleDTO.getStartTime(), scheduleDTO.getEndTime());

            if (excludeId != null) {
                locationConflicts = locationConflicts.stream()
                        .filter(schedule -> !schedule.getId().equals(excludeId))
                        .toList();
            }

            for (Schedule conflict : locationConflicts) {
                ScheduleConflictDTO.ConflictDetail detail = new ScheduleConflictDTO.ConflictDetail();
                detail.setConflictType("LOCATION");
                detail.setConflictingScheduleId(conflict.getId());
                detail.setConflictingCourseTitle(conflict.getCourse().getTitle());
                detail.setConflictingLocation(conflict.getLocation());
                detail.setConflictingStartTime(conflict.getStartTime());
                detail.setConflictingEndTime(conflict.getEndTime());
                detail.setDescription(String.format("Location %s is already booked for course %s",
                        conflict.getLocation(), conflict.getCourse().getTitle()));
                conflicts.add(detail);
            }
        }

        boolean hasConflicts = !conflicts.isEmpty();
        String message = hasConflicts
                ? String.format("Found %d conflict(s)", conflicts.size())
                : "No conflicts detected";

        return new ScheduleConflictDTO(hasConflicts, conflicts, message);
    }

    private CourseClass validateClassAccess(Long classId, Long userId) {
        CourseClass courseClass = courseClassRepository.findById(classId)
                .orElseThrow(() -> new EntityNotFoundException("Class not found with id: " + classId));

        UserProfile user = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        // Check if user is admin or the teacher of the course
        if (user.getRole() != com.satori.platform.domain.enumeration.Role.ADMIN &&
                !courseClass.getTeacher().getUserProfile().getId().equals(userId)) {
            throw new InsufficientPermissionException("Only the course teacher or admin can manage class schedules");
        }

        return courseClass;
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

        // Check if schedule is in the past
        if (scheduleDTO.getStartTime().isBefore(Instant.now().minus(1, ChronoUnit.HOURS))) {
            throw new IllegalArgumentException("Cannot schedule classes in the past");
        }
    }

    private void validateRecurringData(ScheduleDTO scheduleDTO) {
        // Add validation for recurring schedule data
        // This would be extended based on the recurring fields in ScheduleDTO
    }

    private List<Instant> generateRecurringDates(ScheduleDTO scheduleDTO) {
        List<Instant> dates = new ArrayList<>();

        // This is a simplified implementation
        // In a real implementation, you would parse the recurring settings
        // and generate appropriate dates based on the recurring type and rules

        LocalDate startDate = scheduleDTO.getDate().atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate endDate = scheduleDTO.getDate().atZone(ZoneId.systemDefault()).toLocalDate().plusWeeks(10); // Example:
                                                                                                              // 10
                                                                                                              // weeks

        LocalDate currentDate = startDate;
        while (!currentDate.isAfter(endDate) && dates.size() < 50) { // Max 50 occurrences
            dates.add(currentDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
            currentDate = currentDate.plusWeeks(1); // Weekly recurrence example
        }

        return dates;
    }

    private ScheduleDTO createRecurringScheduleInstance(ScheduleDTO baseSchedule, Instant scheduleDate) {
        ScheduleDTO instance = new ScheduleDTO();
        instance.setDate(scheduleDate);

        // Calculate start and end times for this date
        LocalDate date = scheduleDate.atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate baseDate = baseSchedule.getDate().atZone(ZoneId.systemDefault()).toLocalDate();

        long daysDiff = ChronoUnit.DAYS.between(baseDate, date);

        instance.setStartTime(baseSchedule.getStartTime().plus(daysDiff, ChronoUnit.DAYS));
        instance.setEndTime(baseSchedule.getEndTime().plus(daysDiff, ChronoUnit.DAYS));
        instance.setLocation(baseSchedule.getLocation());

        return instance;
    }

    private void notifyStudentsOfScheduleChange(Schedule schedule, String changeType) {
        // Implementation would notify enrolled students
        // This is a placeholder for the notification logic
        LOG.debug("Notifying students of schedule change: {} for schedule: {}", changeType, schedule.getId());
    }
}