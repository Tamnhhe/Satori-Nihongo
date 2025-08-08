package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DifficultyLevel;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for flashcard review scheduling and recommendations
 */
public class FlashcardReviewScheduleDTO implements Serializable {

    private Long studentId;
    private List<FlashcardReviewItemDTO> reviewItems;
    private Integer totalItemsToReview;
    private Integer estimatedMinutes;
    private DifficultyLevel recommendedDifficultyLevel;
    private String recommendationReason;

    public FlashcardReviewScheduleDTO() {
    }

    public FlashcardReviewScheduleDTO(Long studentId) {
        this.studentId = studentId;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public List<FlashcardReviewItemDTO> getReviewItems() {
        return reviewItems;
    }

    public void setReviewItems(List<FlashcardReviewItemDTO> reviewItems) {
        this.reviewItems = reviewItems;
    }

    public Integer getTotalItemsToReview() {
        return totalItemsToReview;
    }

    public void setTotalItemsToReview(Integer totalItemsToReview) {
        this.totalItemsToReview = totalItemsToReview;
    }

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public void setEstimatedMinutes(Integer estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public DifficultyLevel getRecommendedDifficultyLevel() {
        return recommendedDifficultyLevel;
    }

    public void setRecommendedDifficultyLevel(DifficultyLevel recommendedDifficultyLevel) {
        this.recommendedDifficultyLevel = recommendedDifficultyLevel;
    }

    public String getRecommendationReason() {
        return recommendationReason;
    }

    public void setRecommendationReason(String recommendationReason) {
        this.recommendationReason = recommendationReason;
    }

    @Override
    public String toString() {
        return "FlashcardReviewScheduleDTO{" +
                "studentId=" + studentId +
                ", totalItemsToReview=" + totalItemsToReview +
                ", estimatedMinutes=" + estimatedMinutes +
                ", recommendedDifficultyLevel=" + recommendedDifficultyLevel +
                ", recommendationReason='" + recommendationReason + '\'' +
                '}';
    }

    /**
     * Inner DTO for individual review items
     */
    public static class FlashcardReviewItemDTO implements Serializable {
        private Long lessonId;
        private String lessonTitle;
        private Integer flashcardCount;
        private LocalDateTime lastReviewDate;
        private LocalDateTime nextReviewDate;
        private Double lastAccuracy;
        private DifficultyLevel difficultyLevel;
        private Integer priority; // 1 = highest priority

        public FlashcardReviewItemDTO() {
        }

        public FlashcardReviewItemDTO(Long lessonId, String lessonTitle) {
            this.lessonId = lessonId;
            this.lessonTitle = lessonTitle;
        }

        public Long getLessonId() {
            return lessonId;
        }

        public void setLessonId(Long lessonId) {
            this.lessonId = lessonId;
        }

        public String getLessonTitle() {
            return lessonTitle;
        }

        public void setLessonTitle(String lessonTitle) {
            this.lessonTitle = lessonTitle;
        }

        public Integer getFlashcardCount() {
            return flashcardCount;
        }

        public void setFlashcardCount(Integer flashcardCount) {
            this.flashcardCount = flashcardCount;
        }

        public LocalDateTime getLastReviewDate() {
            return lastReviewDate;
        }

        public void setLastReviewDate(LocalDateTime lastReviewDate) {
            this.lastReviewDate = lastReviewDate;
        }

        public LocalDateTime getNextReviewDate() {
            return nextReviewDate;
        }

        public void setNextReviewDate(LocalDateTime nextReviewDate) {
            this.nextReviewDate = nextReviewDate;
        }

        public Double getLastAccuracy() {
            return lastAccuracy;
        }

        public void setLastAccuracy(Double lastAccuracy) {
            this.lastAccuracy = lastAccuracy;
        }

        public DifficultyLevel getDifficultyLevel() {
            return difficultyLevel;
        }

        public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
            this.difficultyLevel = difficultyLevel;
        }

        public Integer getPriority() {
            return priority;
        }

        public void setPriority(Integer priority) {
            this.priority = priority;
        }

        @Override
        public String toString() {
            return "FlashcardReviewItemDTO{" +
                    "lessonId=" + lessonId +
                    ", lessonTitle='" + lessonTitle + '\'' +
                    ", flashcardCount=" + flashcardCount +
                    ", lastReviewDate=" + lastReviewDate +
                    ", nextReviewDate=" + nextReviewDate +
                    ", lastAccuracy=" + lastAccuracy +
                    ", difficultyLevel=" + difficultyLevel +
                    ", priority=" + priority +
                    '}';
        }
    }
}