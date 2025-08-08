package com.satori.platform.service.dto;

import java.io.Serializable;
import java.time.Instant;
import java.util.List;
import java.util.Objects;

/**
 * A DTO for schedule conflict resolution suggestions.
 */
public class ConflictResolutionDTO implements Serializable {

    private List<ScheduleEventDTO> conflicts;
    private List<TimeSlotSuggestionDTO> suggestions;
    private String resolutionMessage;

    public ConflictResolutionDTO() {
    }

    public ConflictResolutionDTO(List<ScheduleEventDTO> conflicts, List<TimeSlotSuggestionDTO> suggestions,
            String resolutionMessage) {
        this.conflicts = conflicts;
        this.suggestions = suggestions;
        this.resolutionMessage = resolutionMessage;
    }

    // Getters and Setters
    public List<ScheduleEventDTO> getConflicts() {
        return conflicts;
    }

    public void setConflicts(List<ScheduleEventDTO> conflicts) {
        this.conflicts = conflicts;
    }

    public List<TimeSlotSuggestionDTO> getSuggestions() {
        return suggestions;
    }

    public void setSuggestions(List<TimeSlotSuggestionDTO> suggestions) {
        this.suggestions = suggestions;
    }

    public String getResolutionMessage() {
        return resolutionMessage;
    }

    public void setResolutionMessage(String resolutionMessage) {
        this.resolutionMessage = resolutionMessage;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof ConflictResolutionDTO))
            return false;
        ConflictResolutionDTO that = (ConflictResolutionDTO) o;
        return Objects.equals(conflicts, that.conflicts) &&
                Objects.equals(suggestions, that.suggestions);
    }

    @Override
    public int hashCode() {
        return Objects.hash(conflicts, suggestions);
    }

    @Override
    public String toString() {
        return "ConflictResolutionDTO{" +
                "conflicts=" + conflicts +
                ", suggestions=" + suggestions +
                ", resolutionMessage='" + resolutionMessage + '\'' +
                '}';
    }

    /**
     * Inner class for time slot suggestions.
     */
    public static class TimeSlotSuggestionDTO implements Serializable {
        private Instant suggestedStartTime;
        private Instant suggestedEndTime;
        private String reason;
        private Integer priority; // 1 = highest priority

        public TimeSlotSuggestionDTO() {
        }

        public TimeSlotSuggestionDTO(Instant suggestedStartTime, Instant suggestedEndTime, String reason,
                Integer priority) {
            this.suggestedStartTime = suggestedStartTime;
            this.suggestedEndTime = suggestedEndTime;
            this.reason = reason;
            this.priority = priority;
        }

        // Getters and Setters
        public Instant getSuggestedStartTime() {
            return suggestedStartTime;
        }

        public void setSuggestedStartTime(Instant suggestedStartTime) {
            this.suggestedStartTime = suggestedStartTime;
        }

        public Instant getSuggestedEndTime() {
            return suggestedEndTime;
        }

        public void setSuggestedEndTime(Instant suggestedEndTime) {
            this.suggestedEndTime = suggestedEndTime;
        }

        public String getReason() {
            return reason;
        }

        public void setReason(String reason) {
            this.reason = reason;
        }

        public Integer getPriority() {
            return priority;
        }

        public void setPriority(Integer priority) {
            this.priority = priority;
        }

        @Override
        public boolean equals(Object o) {
            if (this == o)
                return true;
            if (!(o instanceof TimeSlotSuggestionDTO))
                return false;
            TimeSlotSuggestionDTO that = (TimeSlotSuggestionDTO) o;
            return Objects.equals(suggestedStartTime, that.suggestedStartTime) &&
                    Objects.equals(suggestedEndTime, that.suggestedEndTime);
        }

        @Override
        public int hashCode() {
            return Objects.hash(suggestedStartTime, suggestedEndTime);
        }

        @Override
        public String toString() {
            return "TimeSlotSuggestionDTO{" +
                    "suggestedStartTime=" + suggestedStartTime +
                    ", suggestedEndTime=" + suggestedEndTime +
                    ", reason='" + reason + '\'' +
                    ", priority=" + priority +
                    '}';
        }
    }
}