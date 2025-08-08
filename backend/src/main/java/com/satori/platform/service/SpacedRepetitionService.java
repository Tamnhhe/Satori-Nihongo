package com.satori.platform.service;

import com.satori.platform.domain.enumeration.DifficultyLevel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * Service for implementing spaced repetition algorithm
 * Based on the SM-2 algorithm with modifications for educational context
 */
@Service
public class SpacedRepetitionService {

    private static final Logger LOG = LoggerFactory.getLogger(SpacedRepetitionService.class);

    // Base intervals in hours for different difficulty levels
    private static final int EASY_BASE_INTERVAL = 24 * 4; // 4 days
    private static final int MEDIUM_BASE_INTERVAL = 24 * 2; // 2 days
    private static final int HARD_BASE_INTERVAL = 24; // 1 day

    // Multipliers for subsequent reviews
    private static final double EASY_MULTIPLIER = 2.5;
    private static final double MEDIUM_MULTIPLIER = 2.0;
    private static final double HARD_MULTIPLIER = 1.5;

    // Accuracy thresholds for difficulty adjustment
    private static final double HIGH_ACCURACY_THRESHOLD = 85.0;
    private static final double LOW_ACCURACY_THRESHOLD = 60.0;

    /**
     * Calculate the next review date based on performance
     */
    public LocalDateTime calculateNextReviewDate(LocalDateTime lastReviewDate,
            Double accuracyPercentage,
            DifficultyLevel currentDifficulty,
            Integer reviewCount) {

        LOG.debug("Calculating next review date for accuracy: {}, difficulty: {}, review count: {}",
                accuracyPercentage, currentDifficulty, reviewCount);

        if (lastReviewDate == null) {
            lastReviewDate = LocalDateTime.now();
        }

        if (reviewCount == null || reviewCount < 1) {
            reviewCount = 1;
        }

        // Base interval based on difficulty
        int baseIntervalHours = getBaseInterval(currentDifficulty);

        // Calculate interval multiplier based on review count and accuracy
        double intervalMultiplier = calculateIntervalMultiplier(currentDifficulty, reviewCount, accuracyPercentage);

        // Apply accuracy adjustment
        double accuracyAdjustment = calculateAccuracyAdjustment(accuracyPercentage);

        // Calculate final interval
        long finalIntervalHours = Math.round(baseIntervalHours * intervalMultiplier * accuracyAdjustment);

        // Ensure minimum interval of 1 hour and maximum of 30 days
        finalIntervalHours = Math.max(1, Math.min(finalIntervalHours, 24 * 30));

        LocalDateTime nextReviewDate = lastReviewDate.plusHours(finalIntervalHours);

        LOG.debug("Next review date calculated: {} (interval: {} hours)", nextReviewDate, finalIntervalHours);

        return nextReviewDate;
    }

    /**
     * Recommend difficulty level based on performance
     */
    public DifficultyLevel recommendDifficultyLevel(Double averageAccuracy,
            DifficultyLevel currentDifficulty,
            Integer recentSessionCount) {

        LOG.debug("Recommending difficulty for accuracy: {}, current: {}, sessions: {}",
                averageAccuracy, currentDifficulty, recentSessionCount);

        if (averageAccuracy == null) {
            return DifficultyLevel.MEDIUM;
        }

        // If student is consistently performing well, increase difficulty
        if (averageAccuracy >= HIGH_ACCURACY_THRESHOLD && recentSessionCount >= 3) {
            switch (currentDifficulty) {
                case EASY:
                    return DifficultyLevel.MEDIUM;
                case MEDIUM:
                    return DifficultyLevel.HARD;
                case HARD:
                    return DifficultyLevel.HARD; // Stay at hard
                default:
                    return DifficultyLevel.MEDIUM;
            }
        }

        // If student is struggling, decrease difficulty
        if (averageAccuracy <= LOW_ACCURACY_THRESHOLD && recentSessionCount >= 2) {
            switch (currentDifficulty) {
                case HARD:
                    return DifficultyLevel.MEDIUM;
                case MEDIUM:
                    return DifficultyLevel.EASY;
                case EASY:
                    return DifficultyLevel.EASY; // Stay at easy
                default:
                    return DifficultyLevel.MEDIUM;
            }
        }

        // Otherwise, maintain current difficulty
        return currentDifficulty != null ? currentDifficulty : DifficultyLevel.MEDIUM;
    }

    /**
     * Calculate priority score for review scheduling (lower score = higher
     * priority)
     */
    public Integer calculateReviewPriority(LocalDateTime nextReviewDate,
            Double lastAccuracy,
            Integer daysSinceLastReview) {

        LocalDateTime now = LocalDateTime.now();

        // Base priority based on how overdue the review is
        int priority = 5; // Default medium priority

        if (nextReviewDate != null && nextReviewDate.isBefore(now)) {
            long hoursOverdue = java.time.Duration.between(nextReviewDate, now).toHours();
            if (hoursOverdue > 72) { // More than 3 days overdue
                priority = 1; // Highest priority
            } else if (hoursOverdue > 24) { // More than 1 day overdue
                priority = 2; // High priority
            } else if (hoursOverdue > 0) { // Overdue
                priority = 3; // Medium-high priority
            }
        }

        // Adjust priority based on last accuracy
        if (lastAccuracy != null && lastAccuracy < LOW_ACCURACY_THRESHOLD) {
            priority = Math.max(1, priority - 1); // Increase priority for poor performance
        } else if (lastAccuracy != null && lastAccuracy > HIGH_ACCURACY_THRESHOLD) {
            priority = Math.min(10, priority + 1); // Decrease priority for good performance
        }

        // Adjust for long gaps in study
        if (daysSinceLastReview != null && daysSinceLastReview > 7) {
            priority = Math.max(1, priority - 1); // Increase priority for long gaps
        }

        return priority;
    }

    /**
     * Estimate study time needed based on flashcard count and difficulty
     */
    public Integer estimateStudyTime(Integer flashcardCount, DifficultyLevel difficultyLevel) {
        if (flashcardCount == null || flashcardCount <= 0) {
            return 0;
        }

        // Base time per card in minutes
        double baseTimePerCard = switch (difficultyLevel) {
            case EASY -> 0.5;
            case MEDIUM -> 1.0;
            case HARD -> 1.5;
        };

        // Add overhead for session setup and breaks
        int baseTime = (int) Math.ceil(flashcardCount * baseTimePerCard);
        int overhead = Math.max(2, baseTime / 10); // 10% overhead, minimum 2 minutes

        return baseTime + overhead;
    }

    private int getBaseInterval(DifficultyLevel difficulty) {
        return switch (difficulty) {
            case EASY -> EASY_BASE_INTERVAL;
            case MEDIUM -> MEDIUM_BASE_INTERVAL;
            case HARD -> HARD_BASE_INTERVAL;
        };
    }

    private double calculateIntervalMultiplier(DifficultyLevel difficulty, Integer reviewCount, Double accuracy) {
        double baseMultiplier = switch (difficulty) {
            case EASY -> EASY_MULTIPLIER;
            case MEDIUM -> MEDIUM_MULTIPLIER;
            case HARD -> HARD_MULTIPLIER;
        };

        // Increase multiplier with each successful review
        double reviewMultiplier = Math.pow(baseMultiplier, Math.max(0, reviewCount - 1));

        // Cap the multiplier to prevent extremely long intervals
        return Math.min(reviewMultiplier, 10.0);
    }

    private double calculateAccuracyAdjustment(Double accuracy) {
        if (accuracy == null) {
            return 1.0;
        }

        // Adjust interval based on accuracy
        if (accuracy >= 90.0) {
            return 1.3; // Extend interval for excellent performance
        } else if (accuracy >= 80.0) {
            return 1.1; // Slightly extend interval for good performance
        } else if (accuracy >= 70.0) {
            return 1.0; // Normal interval for average performance
        } else if (accuracy >= 60.0) {
            return 0.8; // Shorten interval for below average performance
        } else {
            return 0.6; // Significantly shorten interval for poor performance
        }
    }
}