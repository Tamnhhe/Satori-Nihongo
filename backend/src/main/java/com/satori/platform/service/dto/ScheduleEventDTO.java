package com.satori.platform.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.Objects;

/**
 * A DTO for representing calendar schedule events.
 */
public class ScheduleEventDTO implements Serializable {

    private Long id;
    private String title;
    private String description;
    private Instant startTime;
    private Instant endTime;
    private String location;
    private String meetingUrl;
    private String eventType; // LESSON, QUIZ, MEETING, etc.
    private CourseDTO course;
    private String status; // SCHEDULED, CANCELLED, COMPLETED
    private Boolean isConflict;

    public ScheduleEventDTO() {
    }

    public ScheduleEventDTO(Long id, String title, String description, Instant startTime, Instant endTime,
            String location, String meetingUrl, String eventType, CourseDTO course, String status) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.startTime = startTime;
        this.endTime = endTime;
        this.location = location;
        this.meetingUrl = meetingUrl;
        this.eventType = eventType;
        this.course = course;
        this.status = status;
        this.isConflict = false;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getStartTime() {
        return startTime;
    }

    public void setStartTime(Instant startTime) {
        this.startTime = startTime;
    }

    public Instant getEndTime() {
        return endTime;
    }

    public void setEndTime(Instant endTime) {
        this.endTime = endTime;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getMeetingUrl() {
        return meetingUrl;
    }

    public void setMeetingUrl(String meetingUrl) {
        this.meetingUrl = meetingUrl;
    }

    public String getEventType() {
        return eventType;
    }

    public void setEventType(String eventType) {
        this.eventType = eventType;
    }

    public CourseDTO getCourse() {
        return course;
    }

    public void setCourse(CourseDTO course) {
        this.course = course;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getIsConflict() {
        return isConflict;
    }

    public void setIsConflict(Boolean isConflict) {
        this.isConflict = isConflict;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof ScheduleEventDTO))
            return false;
        ScheduleEventDTO that = (ScheduleEventDTO) o;
        return Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    @Override
    public String toString() {
        return "ScheduleEventDTO{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", location='" + location + '\'' +
                ", meetingUrl='" + meetingUrl + '\'' +
                ", eventType='" + eventType + '\'' +
                ", course=" + course +
                ", status='" + status + '\'' +
                ", isConflict=" + isConflict +
                '}';
    }
}