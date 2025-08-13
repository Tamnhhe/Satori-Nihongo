package com.satori.platform.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;

/**
 * DTO for schedule conflict detection
 */
public class ScheduleConflictDTO implements Serializable {

    private static final long serialVersionUID = 1L;

    private boolean hasConflicts;

    private List<ConflictDetail> conflicts;

    private String message;

    public ScheduleConflictDTO() {
    }

    public ScheduleConflictDTO(boolean hasConflicts, List<ConflictDetail> conflicts, String message) {
        this.hasConflicts = hasConflicts;
        this.conflicts = conflicts;
        this.message = message;
    }

    public boolean isHasConflicts() {
        return hasConflicts;
    }

    public void setHasConflicts(boolean hasConflicts) {
        this.hasConflicts = hasConflicts;
    }

    public List<ConflictDetail> getConflicts() {
        return conflicts;
    }

    public void setConflicts(List<ConflictDetail> conflicts) {
        this.conflicts = conflicts;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public static class ConflictDetail implements Serializable {
        private static final long serialVersionUID = 1L;

        private String conflictType; // "TEACHER", "LOCATION", "CLASS"
        private Long conflictingScheduleId;
        private String conflictingCourseTitle;
        private String conflictingTeacherName;
        private String conflictingLocation;
        private Instant conflictingStartTime;
        private Instant conflictingEndTime;
        private String description;

        public ConflictDetail() {
        }

        public ConflictDetail(String conflictType, Long conflictingScheduleId, String description) {
            this.conflictType = conflictType;
            this.conflictingScheduleId = conflictingScheduleId;
            this.description = description;
        }

        public String getConflictType() {
            return conflictType;
        }

        public void setConflictType(String conflictType) {
            this.conflictType = conflictType;
        }

        public Long getConflictingScheduleId() {
            return conflictingScheduleId;
        }

        public void setConflictingScheduleId(Long conflictingScheduleId) {
            this.conflictingScheduleId = conflictingScheduleId;
        }

        public String getConflictingCourseTitle() {
            return conflictingCourseTitle;
        }

        public void setConflictingCourseTitle(String conflictingCourseTitle) {
            this.conflictingCourseTitle = conflictingCourseTitle;
        }

        public String getConflictingTeacherName() {
            return conflictingTeacherName;
        }

        public void setConflictingTeacherName(String conflictingTeacherName) {
            this.conflictingTeacherName = conflictingTeacherName;
        }

        public String getConflictingLocation() {
            return conflictingLocation;
        }

        public void setConflictingLocation(String conflictingLocation) {
            this.conflictingLocation = conflictingLocation;
        }

        public Instant getConflictingStartTime() {
            return conflictingStartTime;
        }

        public void setConflictingStartTime(Instant conflictingStartTime) {
            this.conflictingStartTime = conflictingStartTime;
        }

        public Instant getConflictingEndTime() {
            return conflictingEndTime;
        }

        public void setConflictingEndTime(Instant conflictingEndTime) {
            this.conflictingEndTime = conflictingEndTime;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        @Override
        public String toString() {
            return "ConflictDetail{" +
                    "conflictType='" + conflictType + '\'' +
                    ", conflictingScheduleId=" + conflictingScheduleId +
                    ", conflictingCourseTitle='" + conflictingCourseTitle + '\'' +
                    ", conflictingTeacherName='" + conflictingTeacherName + '\'' +
                    ", conflictingLocation='" + conflictingLocation + '\'' +
                    ", conflictingStartTime=" + conflictingStartTime +
                    ", conflictingEndTime=" + conflictingEndTime +
                    ", description='" + description + '\'' +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "ScheduleConflictDTO{" +
                "hasConflicts=" + hasConflicts +
                ", conflicts=" + conflicts +
                ", message='" + message + '\'' +
                '}';
    }
}