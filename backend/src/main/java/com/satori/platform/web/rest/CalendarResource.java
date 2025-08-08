package com.satori.platform.web.rest;

import com.satori.platform.service.CalendarService;
import com.satori.platform.service.dto.*;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * REST controller for managing calendar functionality.
 */
@RestController
@RequestMapping("/api/calendar")
public class CalendarResource {

    private static final Logger LOG = LoggerFactory.getLogger(CalendarResource.class);

    private static final String ENTITY_NAME = "calendar";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CalendarService calendarService;

    public CalendarResource(CalendarService calendarService) {
        this.calendarService = calendarService;
    }

    /**
     * GET /api/calendar/student/{studentId} : Get student calendar.
     *
     * @param studentId the student ID
     * @param startDate the start date (optional, defaults to current date)
     * @param endDate   the end date (optional, defaults to 30 days from start)
     * @return the ResponseEntity with status 200 (OK) and the list of schedule
     *         events
     */
    @GetMapping("/student/{studentId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<List<ScheduleEventDTO>> getStudentCalendar(
            @PathVariable Long studentId,
            @RequestParam(required = false) Instant startDate,
            @RequestParam(required = false) Instant endDate) {

        LOG.debug("REST request to get student calendar for student: {}", studentId);

        if (startDate == null) {
            startDate = Instant.now().truncatedTo(ChronoUnit.DAYS);
        }
        if (endDate == null) {
            endDate = startDate.plus(30, ChronoUnit.DAYS);
        }

        if (startDate.isAfter(endDate)) {
            throw new BadRequestAlertException("Start date must be before end date", ENTITY_NAME, "invalidDateRange");
        }

        List<ScheduleEventDTO> events = calendarService.getStudentCalendar(studentId, startDate, endDate);
        return ResponseEntity.ok().body(events);
    }

    /**
     * GET /api/calendar/teacher/{teacherId} : Get teacher calendar.
     *
     * @param teacherId the teacher ID
     * @param startDate the start date (optional, defaults to current date)
     * @param endDate   the end date (optional, defaults to 30 days from start)
     * @return the ResponseEntity with status 200 (OK) and the list of schedule
     *         events
     */
    @GetMapping("/teacher/{teacherId}")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<List<ScheduleEventDTO>> getTeacherCalendar(
            @PathVariable Long teacherId,
            @RequestParam(required = false) Instant startDate,
            @RequestParam(required = false) Instant endDate) {

        LOG.debug("REST request to get teacher calendar for teacher: {}", teacherId);

        if (startDate == null) {
            startDate = Instant.now().truncatedTo(ChronoUnit.DAYS);
        }
        if (endDate == null) {
            endDate = startDate.plus(30, ChronoUnit.DAYS);
        }

        if (startDate.isAfter(endDate)) {
            throw new BadRequestAlertException("Start date must be before end date", ENTITY_NAME, "invalidDateRange");
        }

        List<ScheduleEventDTO> events = calendarService.getTeacherCalendar(teacherId, startDate, endDate);
        return ResponseEntity.ok().body(events);
    }

    /**
     * POST /api/calendar/conflicts : Detect schedule conflicts and get resolution
     * suggestions.
     *
     * @param scheduleDTO the schedule to check for conflicts
     * @param userId      the user ID
     * @return the ResponseEntity with status 200 (OK) and conflict resolution
     *         information
     */
    @PostMapping("/conflicts")
    @PreAuthorize("hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<ConflictResolutionDTO> detectConflicts(
            @RequestBody ScheduleDTO scheduleDTO,
            @RequestParam Long userId) {

        LOG.debug("REST request to detect conflicts for schedule: {} by user: {}", scheduleDTO, userId);

        if (scheduleDTO.getStartTime() == null || scheduleDTO.getEndTime() == null) {
            throw new BadRequestAlertException("Start time and end time are required", ENTITY_NAME, "missingTimeData");
        }

        ConflictResolutionDTO resolution = calendarService.detectConflictsAndSuggestResolutions(scheduleDTO, userId);
        return ResponseEntity.ok().body(resolution);
    }

    /**
     * POST /api/calendar/notifications/{userId} : Create notification triggers for
     * upcoming classes.
     *
     * @param userId the user ID
     * @return the ResponseEntity with status 200 (OK)
     */
    @PostMapping("/notifications/{userId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<Void> createNotificationTriggers(@PathVariable Long userId) {
        LOG.debug("REST request to create notification triggers for user: {}", userId);

        calendarService.createScheduleNotificationTriggers(userId);
        return ResponseEntity.ok().build();
    }

    /**
     * GET /api/calendar/export/{userId} : Export calendar to external format.
     *
     * @param userId    the user ID
     * @param startDate the start date (optional, defaults to current date)
     * @param endDate   the end date (optional, defaults to 90 days from start)
     * @param format    the export format (ICS, GOOGLE, OUTLOOK)
     * @return the ResponseEntity with calendar export data
     */
    @GetMapping("/export/{userId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<String> exportCalendar(
            @PathVariable Long userId,
            @RequestParam(required = false) Instant startDate,
            @RequestParam(required = false) Instant endDate,
            @RequestParam(defaultValue = "ICS") String format) {

        LOG.debug("REST request to export calendar for user: {} in format: {}", userId, format);

        if (startDate == null) {
            startDate = Instant.now().truncatedTo(ChronoUnit.DAYS);
        }
        if (endDate == null) {
            endDate = startDate.plus(90, ChronoUnit.DAYS);
        }

        if (startDate.isAfter(endDate)) {
            throw new BadRequestAlertException("Start date must be before end date", ENTITY_NAME, "invalidDateRange");
        }

        CalendarExportDTO exportData = calendarService.exportCalendar(userId, startDate, endDate, format);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(exportData.getMimeType()));
        headers.setContentDispositionFormData("attachment", exportData.getFilename());

        return ResponseEntity.ok()
                .headers(headers)
                .body(exportData.getContent());
    }

    /**
     * GET /api/calendar/upcoming/{userId} : Get upcoming events for a user.
     *
     * @param userId the user ID
     * @param days   number of days to look ahead (default 7)
     * @return the ResponseEntity with status 200 (OK) and the list of upcoming
     *         events
     */
    @GetMapping("/upcoming/{userId}")
    @PreAuthorize("hasRole('STUDENT') or hasRole('TEACHER') or hasRole('ADMIN')")
    public ResponseEntity<List<ScheduleEventDTO>> getUpcomingEvents(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "7") int days) {

        LOG.debug("REST request to get upcoming events for user: {} for next {} days", userId, days);

        if (days < 1 || days > 365) {
            throw new BadRequestAlertException("Days must be between 1 and 365", ENTITY_NAME, "invalidDaysRange");
        }

        Instant startDate = Instant.now();
        Instant endDate = startDate.plus(days, ChronoUnit.DAYS);

        // Determine if user is teacher or student and get appropriate calendar
        // This is a simplified approach - in a real implementation, you'd check user
        // roles
        List<ScheduleEventDTO> events;
        try {
            // Try teacher calendar first
            events = calendarService.getTeacherCalendar(userId, startDate, endDate);
        } catch (Exception e) {
            // Fallback to student calendar
            events = calendarService.getStudentCalendar(userId, startDate, endDate);
        }

        // Filter to only upcoming events
        Instant now = Instant.now();
        List<ScheduleEventDTO> upcomingEvents = events.stream()
                .filter(event -> event.getStartTime().isAfter(now))
                .limit(10) // Limit to next 10 events
                .toList();

        return ResponseEntity.ok().body(upcomingEvents);
    }
}