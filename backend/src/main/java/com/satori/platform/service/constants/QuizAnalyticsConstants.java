package com.satori.platform.service.constants;

/**
 * Constants for Quiz Analytics functionality.
 */
public final class QuizAnalyticsConstants {

    private QuizAnalyticsConstants() {
        // Constants class
    }

    // Score ranges for distribution
    public static final String SCORE_RANGE_0_20 = "0-20";
    public static final String SCORE_RANGE_21_40 = "21-40";
    public static final String SCORE_RANGE_41_60 = "41-60";
    public static final String SCORE_RANGE_61_80 = "61-80";
    public static final String SCORE_RANGE_81_100 = "81-100";

    // Performance levels
    public static final String PERFORMANCE_EXCELLENT = "Excellent";
    public static final String PERFORMANCE_GOOD = "Good";
    public static final String PERFORMANCE_AVERAGE = "Average";
    public static final String PERFORMANCE_NEEDS_IMPROVEMENT = "Needs Improvement";
    public static final String PERFORMANCE_NO_DATA = "No Data";

    // Difficulty levels
    public static final String DIFFICULTY_EASY = "Easy";
    public static final String DIFFICULTY_MEDIUM = "Medium";
    public static final String DIFFICULTY_HARD = "Hard";
    public static final String DIFFICULTY_UNKNOWN = "Unknown";

    // Score thresholds
    public static final double EXCELLENT_THRESHOLD = 85.0;
    public static final double GOOD_THRESHOLD = 70.0;
    public static final double AVERAGE_THRESHOLD = 50.0;
    public static final double EASY_QUESTION_THRESHOLD = 80.0;
    public static final double MEDIUM_QUESTION_THRESHOLD = 50.0;

    // Default limits
    public static final int DEFAULT_TOP_PERFORMERS_LIMIT = 5;
    public static final int DEFAULT_STRUGGLING_STUDENTS_LIMIT = 5;
    public static final int DEFAULT_COMMON_WRONG_ANSWERS_LIMIT = 3;

    // CSV headers
    public static final String CSV_HEADER_STUDENT_RESULTS = "Student ID,Student Name,Student Code,Score,Completion Date,Start Time,End Time,Time Spent (minutes),Status,Correct Answers,Total Questions,Completion Rate";

    public static final String CSV_HEADER_QUESTION_ANALYTICS = "Question Content,Question Type,Total Answers,Correct Answers,Correct Percentage,Difficulty,Average Time Spent";

    public static final String CSV_HEADER_TOP_PERFORMERS = "Student Name,Student Code,Best Score,Average Score,Total Attempts,Performance Level";
}