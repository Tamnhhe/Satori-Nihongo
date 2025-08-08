package com.satori.platform.service;

import com.satori.platform.domain.*;
import com.satori.platform.repository.*;
import com.satori.platform.service.dto.*;
import com.satori.platform.service.dto.ConflictResolutionDTO.TimeSlotSuggestionDTO;
import com.satori.platform.service.mapper.CourseMapper;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for managing student and teacher calendars with schedule aggregation,
 * conflict detection, and meeting integration capabilities.
 */
@Service
@Transactional
public class CalendarService {

    private static final Logger LOG = LoggerFactory.getLogger(CalendarService.class);

    private final ScheduleRepository scheduleRepository;
    private final StudentProgressRepository studentProgressRepository;
    private final UserProfileRepository userProfileRepository;
    private final QuizRepository quizRepository;
    private final CourseRepository courseRepository;
    private final CourseMapper courseMapper;
    private final NotificationService notificationService;

    public CalendarService(
            ScheduleRepository scheduleRepository,
            StudentProgressRepository studentProgressRepository,
            UserProfileRepository userProfileRepository,
            QuizRepository quizRepository,
            CourseRepository courseRepository,
            CourseMapper courseMapper,
            NotificationService notificationService) {
        this.scheduleRepository = scheduleRepository;
        this.studentProgressRepository = studentProgressRepository;
        this.userProfileRepository = userProfileRepository;
        this.quizRepository = quizRepository;
        this.courseRepository = courseRepository;
        this.courseMapper = courseMapper;
        this.notificationService = notificationService;
    }

    /**
     * Get student calendar with all enrolled course schedules.
     *
     * @param studentId the student ID
     * @param startDate the start date for calendar view
     * @param endDate   the end date for calendar view
     * @return list of schedule events
     */
    @Transactional(readOnly = true)
    public List<ScheduleEventDTO> getStudentCalendar(Long studentId, Instant startDate, Instant endDate) {
        LOG.debug("Request to get student calendar for student: {} from {} to {}", studentId, startDate, endDate);

        UserProfile student = userProfileRepository.findById(studentId)
                .orElseThrow(() -> new EntityNotFoundException("Student not found with id: " + studentId));

        // Get all courses the student is enrolled in
        List<StudentProgress> enrollments = studentProgressRepository.findByStudentId(studentId);
        List<Long> courseIds = enrollments.stream()
                .map(progress -> progress.getCourse().getId())
                .collect(Collectors.toList());

        if (courseIds.isEmpty()) {
            return new ArrayList<>();
        }

        // Get schedules for enrolled courses
        List<ScheduleEventDTO> events = new ArrayList<>();

        for (Long courseId : courseIds) {
            List<Schedule> schedules = scheduleRepository.findByCourseIdAndDateBetween(courseId, startDate, endDate);
            events.addAll(schedules.stream()
                    .map(schedule -> convertScheduleToEvent(schedule, "LESSON"))
                    .collect(Collectors.toList()));
        }

        // Add quiz events
        events.addAll(getQuizEventsForStudent(studentId, courseIds, startDate, endDate));

        // Sort events by start time
        events.sort(Comparator.comparing(ScheduleEventDTO::getStartTime));

        LOG.info("Retrieved {} calendar events for student: {}", events.size(), studentId);
        return events;
    }

    /**
     * Get teacher calendar with all teaching schedules.
     *
     * @param teacherId the teacher ID
     * @param startDate the start date for calendar view
     * @param endDate   the end date for calendar view
     * @return list of schedule events
     */
    @Transactional(readOnly = true)
    public List<ScheduleEventDTO> getTeacherCalendar(Long teacherId, Instant startDate, Instant endDate) {
        LOG.debug("Request to get teacher calendar for teacher: {} from {} to {}", teacherId, startDate, endDate);

        UserProfile teacher = userProfileRepository.findById(teacherId)
                .orElseThrow(() -> new EntityNotFoundException("Teacher not found with id: " + teacherId));

        // Get all schedules for courses taught by this teacher
        List<Schedule> schedules = scheduleRepository.findByTeacherId(teacherId);

        // Filter by date range
        List<Schedule> filteredSchedules = schedules.stream()
                .filter(schedule -> !schedule.getStartTime().isBefore(startDate) &&
                        !schedule.getStartTime().isAfter(endDate))
                .collect(Collectors.toList());

        List<ScheduleEventDTO> events = filteredSchedules.stream()
                .map(schedule -> convertScheduleToEvent(schedule, "LESSON"))
                .collect(Collectors.toList());

        // Add quiz events for teacher's courses
        List<Long> courseIds = filteredSchedules.stream()
                .map(schedule -> schedule.getCourse().getId())
                .distinct()
                .collect(Collectors.toList());

        events.addAll(getQuizEventsForTeacher(teacherId, courseIds, startDate, endDate));

        // Sort events by start time
        events.sort(Comparator.comparing(ScheduleEventDTO::getStartTime));

        LOG.info("Retrieved {} calendar events for teacher: {}", events.size(), teacherId);
        return events;
    }

    /**
     * Detect schedule conflicts and provide resolution suggestions.
     *
     * @param scheduleDTO the proposed schedule
     * @param userId      the user ID (teacher or student)
     * @return conflict resolution information
     */
    @Transactional(readOnly = true)
    public ConflictResolutionDTO detectConflictsAndSuggestResolutions(ScheduleDTO scheduleDTO, Long userId) {
        LOG.debug("Request to detect conflicts for schedule: {} by user: {}", scheduleDTO, userId);

        List<ScheduleEventDTO> conflicts = new ArrayList<>();

        // Get user's existing calendar events
        Instant startDate = scheduleDTO.getStartTime().minus(1, ChronoUnit.DAYS);
        Instant endDate = scheduleDTO.getEndTime().plus(1, ChronoUnit.DAYS);

        UserProfile user = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        List<ScheduleEventDTO> existingEvents;
        if (isTeacher(user)) {
            existingEvents = getTeacherCalendar(userId, startDate, endDate);
        } else {
            existingEvents = getStudentCalendar(userId, startDate, endDate);
        }

        // Check for time conflicts
        for (ScheduleEventDTO event : existingEvents) {
            if (hasTimeConflict(scheduleDTO.getStartTime(), scheduleDTO.getEndTime(),
                    event.getStartTime(), event.getEndTime())) {
                event.setIsConflict(true);
                conflicts.add(event);
            }
        }

        // Generate resolution suggestions
        List<TimeSlotSuggestionDTO> suggestions = generateTimeSlotSuggestions(
                scheduleDTO, existingEvents, startDate, endDate);

        String resolutionMessage = conflicts.isEmpty() ? "No conflicts detected"
                : String.format("Found %d conflicts. Consider the suggested alternative time slots.", conflicts.size());

        return new ConflictResolutionDTO(conflicts, suggestions, resolutionMessage);
    }

    /**
     * Create schedule notification triggers for upcoming classes.
     *
     * @param userId the user ID
     */
    public void createScheduleNotificationTriggers(Long userId) {
        LOG.debug("Request to create notification triggers for user: {}", userId);

        UserProfile user = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        Instant now = Instant.now();
        Instant endDate = now.plus(7, ChronoUnit.DAYS); // Next 7 days

        List<ScheduleEventDTO> upcomingEvents;
        if (isTeacher(user)) {
            upcomingEvents = getTeacherCalendar(userId, now, endDate);
        } else {
            upcomingEvents = getStudentCalendar(userId, now, endDate);
        }

        // Create notification triggers for events within next 24 hours
        upcomingEvents.stream()
                .filter(event -> event.getStartTime().isAfter(now) &&
                        event.getStartTime().isBefore(now.plus(24, ChronoUnit.HOURS)))
                .forEach(event -> {
                    try {
                        // Create notification trigger based on event type
                        if ("LESSON".equals(event.getEventType())) {
                            Schedule schedule = scheduleRepository.findById(event.getId())
                                    .orElse(null);
                            if (schedule != null) {
                                notificationService.sendScheduleReminder(user, schedule);
                            }
                        }
                    } catch (Exception e) {
                        LOG.warn("Failed to create notification trigger for event: {}", event.getId(), e);
                    }
                });

        LOG.info("Created notification triggers for {} upcoming events for user: {}", upcomingEvents.size(), userId);
    }

    /**
     * Export calendar to external calendar format (ICS).
     *
     * @param userId    the user ID
     * @param startDate the start date for export
     * @param endDate   the end date for export
     * @param format    the export format (ICS, GOOGLE, OUTLOOK)
     * @return calendar export data
     */
    @Transactional(readOnly = true)
    public CalendarExportDTO exportCalendar(Long userId, Instant startDate, Instant endDate, String format) {
        LOG.debug("Request to export calendar for user: {} in format: {}", userId, format);

        UserProfile user = userProfileRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        List<ScheduleEventDTO> events;
        if (isTeacher(user)) {
            events = getTeacherCalendar(userId, startDate, endDate);
        } else {
            events = getStudentCalendar(userId, startDate, endDate);
        }

        String content;
        String filename;
        String mimeType;

        switch (format.toUpperCase()) {
            case "ICS":
                content = generateICSContent(events, user);
                filename = String.format("calendar_%s_%s.ics", user.getUsername(),
                        LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")));
                mimeType = "text/calendar";
                break;
            case "GOOGLE":
                content = generateGoogleCalendarUrl(events);
                filename = "google_calendar_import.txt";
                mimeType = "text/plain";
                break;
            case "OUTLOOK":
                content = generateOutlookCalendarContent(events);
                filename = "outlook_calendar.csv";
                mimeType = "text/csv";
                break;
            default:
                throw new IllegalArgumentException("Unsupported export format: " + format);
        }

        LOG.info("Exported {} events for user: {} in format: {}", events.size(), userId, format);
        return new CalendarExportDTO(format, content, filename, mimeType);
    }

    // Private helper methods

    private ScheduleEventDTO convertScheduleToEvent(Schedule schedule, String eventType) {
        CourseDTO courseDTO = courseMapper.toDto(schedule.getCourse());

        return new ScheduleEventDTO(
                schedule.getId(),
                schedule.getCourse().getTitle(),
                String.format("Class for %s", schedule.getCourse().getTitle()),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getLocation(),
                generateMeetingUrl(schedule),
                eventType,
                courseDTO,
                "SCHEDULED");
    }

    private List<ScheduleEventDTO> getQuizEventsForStudent(Long studentId, List<Long> courseIds,
            Instant startDate, Instant endDate) {
        // This would integrate with quiz scheduling when implemented
        // For now, return empty list as quiz scheduling is in future tasks
        return new ArrayList<>();
    }

    private List<ScheduleEventDTO> getQuizEventsForTeacher(Long teacherId, List<Long> courseIds,
            Instant startDate, Instant endDate) {
        // This would integrate with quiz scheduling when implemented
        // For now, return empty list as quiz scheduling is in future tasks
        return new ArrayList<>();
    }

    private boolean isTeacher(UserProfile user) {
        return user.getRole() == com.satori.platform.domain.enumeration.Role.GIANG_VIEN ||
                user.getRole() == com.satori.platform.domain.enumeration.Role.ADMIN;
    }

    private boolean hasTimeConflict(Instant start1, Instant end1, Instant start2, Instant end2) {
        return start1.isBefore(end2) && end1.isAfter(start2);
    }

    private List<TimeSlotSuggestionDTO> generateTimeSlotSuggestions(ScheduleDTO proposedSchedule,
            List<ScheduleEventDTO> existingEvents,
            Instant startDate, Instant endDate) {
        List<TimeSlotSuggestionDTO> suggestions = new ArrayList<>();

        long durationMinutes = ChronoUnit.MINUTES.between(proposedSchedule.getStartTime(),
                proposedSchedule.getEndTime());

        // Generate suggestions for the same day
        Instant dayStart = proposedSchedule.getStartTime().truncatedTo(ChronoUnit.DAYS).plus(8, ChronoUnit.HOURS); // 8
                                                                                                                   // AM
        Instant dayEnd = proposedSchedule.getStartTime().truncatedTo(ChronoUnit.DAYS).plus(18, ChronoUnit.HOURS); // 6
                                                                                                                  // PM

        // Find available slots
        List<Instant> busyTimes = existingEvents.stream()
                .filter(event -> event.getStartTime().truncatedTo(ChronoUnit.DAYS)
                        .equals(proposedSchedule.getStartTime().truncatedTo(ChronoUnit.DAYS)))
                .flatMap(event -> Arrays.stream(new Instant[] { event.getStartTime(), event.getEndTime() }))
                .sorted()
                .collect(Collectors.toList());

        // Simple algorithm to find gaps
        Instant currentTime = dayStart;
        int priority = 1;

        for (int i = 0; i < busyTimes.size() - 1; i += 2) {
            Instant busyStart = busyTimes.get(i);
            Instant busyEnd = busyTimes.get(i + 1);

            // Check if there's a gap before this busy period
            if (ChronoUnit.MINUTES.between(currentTime, busyStart) >= durationMinutes) {
                suggestions.add(new TimeSlotSuggestionDTO(
                        currentTime,
                        currentTime.plus(durationMinutes, ChronoUnit.MINUTES),
                        "Available slot before existing event",
                        priority++));
            }

            currentTime = busyEnd;
        }

        // Check for slot after all busy periods
        if (ChronoUnit.MINUTES.between(currentTime, dayEnd) >= durationMinutes) {
            suggestions.add(new TimeSlotSuggestionDTO(
                    currentTime,
                    currentTime.plus(durationMinutes, ChronoUnit.MINUTES),
                    "Available slot after existing events",
                    priority++));
        }

        return suggestions.stream()
                .limit(5) // Limit to top 5 suggestions
                .collect(Collectors.toList());
    }

    private String generateMeetingUrl(Schedule schedule) {
        // This would integrate with meeting platform (Zoom, Teams, etc.)
        // For now, return a placeholder URL
        return String.format("https://meeting.platform.com/join/%s", schedule.getId());
    }

    private String generateICSContent(List<ScheduleEventDTO> events, UserProfile user) {
        StringBuilder ics = new StringBuilder();
        ics.append("BEGIN:VCALENDAR\r\n");
        ics.append("VERSION:2.0\r\n");
        ics.append("PRODID:-//Satori Platform//Calendar Export//EN\r\n");
        ics.append("CALSCALE:GREGORIAN\r\n");

        for (ScheduleEventDTO event : events) {
            ics.append("BEGIN:VEVENT\r\n");
            ics.append("UID:").append(event.getId()).append("@satori.platform.com\r\n");
            ics.append("DTSTART:").append(formatICSDateTime(event.getStartTime())).append("\r\n");
            ics.append("DTEND:").append(formatICSDateTime(event.getEndTime())).append("\r\n");
            ics.append("SUMMARY:").append(event.getTitle()).append("\r\n");
            ics.append("DESCRIPTION:").append(event.getDescription()).append("\r\n");
            if (event.getLocation() != null) {
                ics.append("LOCATION:").append(event.getLocation()).append("\r\n");
            }
            if (event.getMeetingUrl() != null) {
                ics.append("URL:").append(event.getMeetingUrl()).append("\r\n");
            }
            ics.append("END:VEVENT\r\n");
        }

        ics.append("END:VCALENDAR\r\n");
        return ics.toString();
    }

    private String generateGoogleCalendarUrl(List<ScheduleEventDTO> events) {
        // Generate Google Calendar import URLs
        StringBuilder urls = new StringBuilder();
        urls.append("Google Calendar Import URLs:\n\n");

        for (ScheduleEventDTO event : events) {
            String url = String.format(
                    "https://calendar.google.com/calendar/render?action=TEMPLATE&text=%s&dates=%s/%s&details=%s&location=%s",
                    event.getTitle().replace(" ", "+"),
                    formatGoogleDateTime(event.getStartTime()),
                    formatGoogleDateTime(event.getEndTime()),
                    event.getDescription().replace(" ", "+"),
                    event.getLocation() != null ? event.getLocation().replace(" ", "+") : "");
            urls.append(url).append("\n\n");
        }

        return urls.toString();
    }

    private String generateOutlookCalendarContent(List<ScheduleEventDTO> events) {
        StringBuilder csv = new StringBuilder();
        csv.append("Subject,Start Date,Start Time,End Date,End Time,Description,Location\n");

        for (ScheduleEventDTO event : events) {
            LocalDateTime startDateTime = LocalDateTime.ofInstant(event.getStartTime(), ZoneId.systemDefault());
            LocalDateTime endDateTime = LocalDateTime.ofInstant(event.getEndTime(), ZoneId.systemDefault());

            csv.append(String.format("\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\",\"%s\"\n",
                    event.getTitle(),
                    startDateTime.format(DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                    startDateTime.format(DateTimeFormatter.ofPattern("HH:mm")),
                    endDateTime.format(DateTimeFormatter.ofPattern("MM/dd/yyyy")),
                    endDateTime.format(DateTimeFormatter.ofPattern("HH:mm")),
                    event.getDescription(),
                    event.getLocation() != null ? event.getLocation() : ""));
        }

        return csv.toString();
    }

    private String formatICSDateTime(Instant instant) {
        return LocalDateTime.ofInstant(instant, ZoneId.of("UTC"))
                .format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'"));
    }

    private String formatGoogleDateTime(Instant instant) {
        return LocalDateTime.ofInstant(instant, ZoneId.of("UTC"))
                .format(DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'"));
    }
}