package com.satori.platform.service.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

public class ReportConfigurationDTO {

    private String id;
    private String name;
    private String description;
    private ReportType reportType;
    private ReportFormat format;
    private LocalDate startDate;
    private LocalDate endDate;
    private Set<String> courseIds;
    private Set<String> classIds;
    private Set<String> studentIds;
    private Set<String> teacherIds;
    private List<String> metrics;
    private String createdBy;
    private LocalDateTime createdDate;
    private ReportSchedule schedule;
    private boolean isScheduled;

    public enum ReportType {
        STUDENT_PROGRESS,
        COURSE_ANALYTICS,
        QUIZ_PERFORMANCE,
        TEACHER_PERFORMANCE,
        SYSTEM_OVERVIEW,
        CUSTOM
    }

    public enum ReportFormat {
        PDF,
        EXCEL,
        CSV
    }

    public static class ReportSchedule {
        private ScheduleFrequency frequency;
        private LocalDateTime nextRun;
        private List<String> recipients;
        private boolean isActive;

        public enum ScheduleFrequency {
            DAILY,
            WEEKLY,
            MONTHLY,
            QUARTERLY
        }

        // Getters and setters
        public ScheduleFrequency getFrequency() {
            return frequency;
        }

        public void setFrequency(ScheduleFrequency frequency) {
            this.frequency = frequency;
        }

        public LocalDateTime getNextRun() {
            return nextRun;
        }

        public void setNextRun(LocalDateTime nextRun) {
            this.nextRun = nextRun;
        }

        public List<String> getRecipients() {
            return recipients;
        }

        public void setRecipients(List<String> recipients) {
            this.recipients = recipients;
        }

        public boolean isActive() {
            return isActive;
        }

        public void setActive(boolean active) {
            isActive = active;
        }
    }

    // Getters and setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ReportType getReportType() {
        return reportType;
    }

    public void setReportType(ReportType reportType) {
        this.reportType = reportType;
    }

    public ReportFormat getFormat() {
        return format;
    }

    public void setFormat(ReportFormat format) {
        this.format = format;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public Set<String> getCourseIds() {
        return courseIds;
    }

    public void setCourseIds(Set<String> courseIds) {
        this.courseIds = courseIds;
    }

    public Set<String> getClassIds() {
        return classIds;
    }

    public void setClassIds(Set<String> classIds) {
        this.classIds = classIds;
    }

    public Set<String> getStudentIds() {
        return studentIds;
    }

    public void setStudentIds(Set<String> studentIds) {
        this.studentIds = studentIds;
    }

    public Set<String> getTeacherIds() {
        return teacherIds;
    }

    public void setTeacherIds(Set<String> teacherIds) {
        this.teacherIds = teacherIds;
    }

    public List<String> getMetrics() {
        return metrics;
    }

    public void setMetrics(List<String> metrics) {
        this.metrics = metrics;
    }

    public String getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public ReportSchedule getSchedule() {
        return schedule;
    }

    public void setSchedule(ReportSchedule schedule) {
        this.schedule = schedule;
    }

    public boolean isScheduled() {
        return isScheduled;
    }

    public void setScheduled(boolean scheduled) {
        isScheduled = scheduled;
    }
}