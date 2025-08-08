package com.satori.platform.service;

import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.StudentProgress;
import com.satori.platform.domain.StudentQuiz;
import com.satori.platform.domain.FlashcardSession;
import com.satori.platform.repository.StudentProgressRepository;
import com.satori.platform.repository.StudentQuizRepository;
import com.satori.platform.repository.FlashcardSessionRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.service.dto.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for comprehensive student analytics and performance calculations.
 */
@Service
@Transactional
public class StudentAnalyticsService {

    private static final Logger log = LoggerFactory.getLogger(StudentAnalyticsService.class);
    private static final int RECENT_ACTIVITY_DAYS = 30;
    private static final double MASTERY_THRESHOLD = 80.0;
    private static final double EXCELLENT_PERFORMANCE = 90.0;
    private static final double GOOD_PERFORMANCE = 75.0;
    private static final double NEEDS_IMPROVEMENT = 60.0;

    private final StudentProgressRepository studentProgressRepository;
    private final StudentQuizRepository studentQuizRepository;
    private final FlashcardSessionRepository flashcardSessionRepository;
    private final UserProfileRepository userProfileRepository;

    public StudentAnalyticsService(
            StudentProgressRepository studentProgressRepository,
            StudentQuizRepository studentQuizRepository,
            FlashcardSessionRepository flashcardSessionRepository,
            UserProfileRepository userProfileRepository) {
        this.studentProgressRepository = studentProgressRepository;
        this.studentQuizRepository = studentQuizRepository;
        this.flashcardSessionRepository = flashcardSessionRepository;
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * Get comprehensive analytics for a student.
     */
    @Transactional(readOnly = true)
    public StudentAnalyticsDTO getStudentAnalytics(Long studentId) {
        log.debug("Getting comprehensive analytics for student: {}", studentId);

        var userProfile = userProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        StudentAnalyticsDTO analytics = new StudentAnalyticsDTO(studentId, userProfile.getFullName());

        // Get basic progress metrics
        populateBasicMetrics(analytics, studentId);

        // Get quiz performance metrics
        populateQuizMetrics(analytics, studentId);

        // Get flashcard performance metrics
        populateFlashcardMetrics(analytics, studentId);

        // Get course-specific performance
        populateCoursePerformance(analytics, studentId);

        // Get recent activity
        populateRecentActivity(analytics, studentId);

        // Generate improvement recommendations
        generateImprovementRecommendations(analytics);

        // Get progress history for visualization
        populateProgressHistory(analytics, studentId);

        return analytics;
    }

    /**
     * Get course performance comparison for a student.
     */
    @Transactional(readOnly = true)
    public Map<String, CoursePerformanceDTO> getCoursePerformanceComparison(Long studentId) {
        log.debug("Getting course performance comparison for student: {}", studentId);

        List<StudentProgress> progressList = studentProgressRepository.findByStudentId(studentId);
        Map<String, CoursePerformanceDTO> coursePerformance = new HashMap<>();

        for (StudentProgress progress : progressList) {
            CoursePerformanceDTO courseDto = new CoursePerformanceDTO(
                    progress.getCourse().getId(),
                    progress.getCourse().getTitle());

            courseDto.setCompletionPercentage(progress.getCompletionPercentage());
            courseDto.setLessonsCompleted(progress.getLessonsCompleted());
            courseDto.setTotalLessons(progress.getTotalLessons());
            courseDto.setQuizzesCompleted(progress.getQuizzesCompleted());
            courseDto.setTotalQuizzes(progress.getTotalQuizzes());
            courseDto.setAverageQuizScore(progress.getAverageQuizScore());
            courseDto.setFlashcardsMastered(progress.getFlashcardsMastered());
            courseDto.setTotalFlashcards(progress.getTotalFlashcards());
            courseDto.setStudyTimeMinutes(progress.getStudyTimeMinutes());
            courseDto.setLastActivityDate(progress.getLastActivityDate());
            courseDto.setIsCompleted(
                    progress.getCompletionPercentage() != null && progress.getCompletionPercentage() >= 100.0);

            // Calculate performance grade
            courseDto.setPerformanceGrade(calculatePerformanceGrade(progress.getAverageQuizScore()));

            coursePerformance.put(progress.getCourse().getTitle(), courseDto);
        }

        return coursePerformance;
    }

    /**
     * Generate progress report for export.
     */
    @Transactional(readOnly = true)
    public ProgressReportDTO generateProgressReport(Long studentId, LocalDateTime startDate, LocalDateTime endDate) {
        log.debug("Generating progress report for student: {} from {} to {}", studentId, startDate, endDate);

        var userProfile = userProfileRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found: " + studentId));

        ProgressReportDTO report = new ProgressReportDTO(
                studentId,
                userProfile.getFullName(),
                userProfile.getEmail());

        report.setReportPeriodStart(startDate);
        report.setReportPeriodEnd(endDate);

        // Get analytics data
        StudentAnalyticsDTO analytics = getStudentAnalytics(studentId);

        // Populate report with analytics data
        report.setOverallCompletionPercentage(analytics.getOverallCompletionPercentage());
        report.setAverageQuizScore(analytics.getAverageQuizScore());
        report.setTotalStudyTimeMinutes(analytics.getTotalStudyTimeMinutes());
        report.setStreakDays(analytics.getStreakDays());
        report.setPerformanceTrend(analytics.getPerformanceTrend());

        // Get course performances
        report.setCoursePerformances(new ArrayList<>(analytics.getCoursePerformance().values()));

        // Get filtered quiz history for the period
        List<QuizPerformanceDTO> filteredQuizHistory = analytics.getRecentQuizzes().stream()
                .filter(quiz -> quiz.getCompletionDate().isAfter(startDate)
                        && quiz.getCompletionDate().isBefore(endDate))
                .collect(Collectors.toList());
        report.setQuizHistory(filteredQuizHistory);

        // Get filtered flashcard sessions for the period
        List<FlashcardPerformanceDTO> filteredFlashcardSessions = analytics.getRecentFlashcardSessions().stream()
                .filter(session -> session.getLastStudyDate() != null
                        && session.getLastStudyDate().isAfter(startDate)
                        && session.getLastStudyDate().isBefore(endDate))
                .collect(Collectors.toList());
        report.setFlashcardSessions(filteredFlashcardSessions);

        // Get progress history for the period
        List<ProgressDataPointDTO> filteredProgressHistory = analytics.getProgressHistory().stream()
                .filter(point -> point.getDate().isAfter(startDate) && point.getDate().isBefore(endDate))
                .collect(Collectors.toList());
        report.setProgressHistory(filteredProgressHistory);

        // Set recommendations
        report.setImprovementRecommendations(analytics.getImprovementRecommendations());

        // Analyze strengths and improvement areas
        analyzeStrengthsAndImprovements(report, analytics);

        return report;
    }

    private void populateBasicMetrics(StudentAnalyticsDTO analytics, Long studentId) {
        // Overall completion percentage
        Double overallCompletion = studentProgressRepository.getOverallCompletionPercentageByStudentId(studentId);
        analytics.setOverallCompletionPercentage(overallCompletion != null ? overallCompletion : 0.0);

        // Course counts
        Long totalEnrolled = studentProgressRepository.getTotalEnrolledCoursesCountByStudentId(studentId);
        Long completed = studentProgressRepository.getCompletedCoursesCountByStudentId(studentId);
        analytics.setTotalCoursesEnrolled(totalEnrolled.intValue());
        analytics.setCoursesCompleted(completed.intValue());

        // Study time
        Integer totalStudyTime = studentProgressRepository.getTotalStudyTimeByStudentId(studentId);
        analytics.setTotalStudyTimeMinutes(totalStudyTime != null ? totalStudyTime : 0);

        // Get latest progress for streak and trend
        List<StudentProgress> recentProgress = studentProgressRepository
                .findByStudentIdOrderByLastActivityDateDesc(studentId);
        if (!recentProgress.isEmpty()) {
            StudentProgress latest = recentProgress.get(0);
            analytics.setLastActivityDate(latest.getLastActivityDate());
            analytics.setStreakDays(latest.getStreakDays());
            analytics.setPerformanceTrend(latest.getPerformanceTrend());
        }
    }

    private void populateQuizMetrics(StudentAnalyticsDTO analytics, Long studentId) {
        // Quiz completion metrics
        Integer totalQuizzesCompleted = studentProgressRepository.getTotalQuizzesCompletedByStudentId(studentId);
        Integer totalQuizzesAvailable = studentProgressRepository.getTotalQuizzesAvailableByStudentId(studentId);
        Double averageQuizScore = studentProgressRepository.getAverageQuizScoreByStudentId(studentId);

        analytics.setTotalQuizzesCompleted(totalQuizzesCompleted != null ? totalQuizzesCompleted : 0);
        analytics.setTotalQuizzesAvailable(totalQuizzesAvailable != null ? totalQuizzesAvailable : 0);
        analytics.setAverageQuizScore(averageQuizScore != null ? averageQuizScore : 0.0);

        // Calculate completion rate
        if (totalQuizzesAvailable != null && totalQuizzesAvailable > 0) {
            double completionRate = (totalQuizzesCompleted.doubleValue() / totalQuizzesAvailable.doubleValue()) * 100.0;
            analytics.setQuizCompletionRate(completionRate);
        } else {
            analytics.setQuizCompletionRate(0.0);
        }
    }

    private void populateFlashcardMetrics(StudentAnalyticsDTO analytics, Long studentId) {
        // Flashcard metrics
        Integer totalFlashcardsMastered = studentProgressRepository.getTotalFlashcardsMasteredByStudentId(studentId);
        Integer totalFlashcardsAvailable = studentProgressRepository.getTotalFlashcardsAvailableByStudentId(studentId);
        Double averageFlashcardAccuracy = flashcardSessionRepository.getAverageAccuracyByStudentId(studentId);

        analytics.setTotalFlashcardsMastered(totalFlashcardsMastered != null ? totalFlashcardsMastered : 0);
        analytics.setTotalFlashcardsAvailable(totalFlashcardsAvailable != null ? totalFlashcardsAvailable : 0);
        analytics.setAverageFlashcardAccuracy(averageFlashcardAccuracy != null ? averageFlashcardAccuracy : 0.0);

        // Calculate mastery rate
        if (totalFlashcardsAvailable != null && totalFlashcardsAvailable > 0) {
            double masteryRate = (totalFlashcardsMastered.doubleValue() / totalFlashcardsAvailable.doubleValue())
                    * 100.0;
            analytics.setFlashcardMasteryRate(masteryRate);
        } else {
            analytics.setFlashcardMasteryRate(0.0);
        }
    }

    private void populateCoursePerformance(StudentAnalyticsDTO analytics, Long studentId) {
        Map<String, CoursePerformanceDTO> coursePerformance = getCoursePerformanceComparison(studentId);
        analytics.setCoursePerformance(coursePerformance);
    }

    private void populateRecentActivity(StudentAnalyticsDTO analytics, Long studentId) {
        LocalDateTime since = LocalDateTime.now().minusDays(RECENT_ACTIVITY_DAYS);

        // Recent quiz attempts
        List<StudentQuiz> recentQuizzes = studentQuizRepository.findRecentAttemptsByStudent(studentId,
                since.atZone(java.time.ZoneId.systemDefault()).toInstant());
        List<QuizPerformanceDTO> quizPerformances = recentQuizzes.stream()
                .map(this::convertToQuizPerformanceDTO)
                .collect(Collectors.toList());
        analytics.setRecentQuizzes(quizPerformances);

        // Recent flashcard sessions
        List<FlashcardSession> recentSessions = flashcardSessionRepository.findRecentSessionsByStudentId(studentId,
                since);
        List<FlashcardPerformanceDTO> flashcardPerformances = recentSessions.stream()
                .map(this::convertToFlashcardPerformanceDTO)
                .collect(Collectors.toList());
        analytics.setRecentFlashcardSessions(flashcardPerformances);
    }

    private void populateProgressHistory(StudentAnalyticsDTO analytics, Long studentId) {
        LocalDateTime endDate = LocalDateTime.now();
        LocalDateTime startDate = endDate.minusDays(90); // Last 3 months

        List<ProgressDataPointDTO> progressHistory = new ArrayList<>();

        // Get quiz progress data
        List<StudentQuiz> quizHistory = studentQuizRepository.findRecentAttemptsByStudent(studentId,
                startDate.atZone(java.time.ZoneId.systemDefault()).toInstant());
        for (StudentQuiz quiz : quizHistory) {
            ProgressDataPointDTO dataPoint = new ProgressDataPointDTO();
            dataPoint.setDate(quiz.getStartTime().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
            dataPoint.setQuizScore(quiz.getScore());
            dataPoint.setActivityType("QUIZ");
            dataPoint.setCourseName(quiz.getQuiz().getCourses().iterator().next().getTitle());
            progressHistory.add(dataPoint);
        }

        // Get flashcard progress data
        List<FlashcardSession> flashcardHistory = flashcardSessionRepository.findPerformanceTrendData(studentId,
                startDate, endDate);
        for (FlashcardSession session : flashcardHistory) {
            ProgressDataPointDTO dataPoint = new ProgressDataPointDTO();
            dataPoint.setDate(session.getSessionDate());
            dataPoint.setFlashcardAccuracy(session.getAccuracyPercentage());
            dataPoint.setStudyTimeMinutes(session.getDurationMinutes());
            dataPoint.setActivityType("FLASHCARD");
            dataPoint.setCourseName(session.getLesson().getCourse().getTitle());
            dataPoint.setLessonName(session.getLesson().getTitle());
            progressHistory.add(dataPoint);
        }

        // Sort by date
        progressHistory.sort(Comparator.comparing(ProgressDataPointDTO::getDate));
        analytics.setProgressHistory(progressHistory);
    }

    private void generateImprovementRecommendations(StudentAnalyticsDTO analytics) {
        List<String> recommendations = new ArrayList<>();

        // Quiz performance recommendations
        if (analytics.getAverageQuizScore() < NEEDS_IMPROVEMENT) {
            recommendations.add("Focus on reviewing quiz materials and practice more frequently");
            recommendations.add("Consider spending more time on lessons before attempting quizzes");
        }

        // Flashcard recommendations
        if (analytics.getAverageFlashcardAccuracy() < MASTERY_THRESHOLD) {
            recommendations.add("Increase flashcard practice frequency for better retention");
            recommendations.add("Focus on difficult flashcards that need more review");
        }

        // Study time recommendations
        if (analytics.getTotalStudyTimeMinutes() < 300) { // Less than 5 hours total
            recommendations.add("Increase daily study time to improve overall performance");
        }

        // Completion rate recommendations
        if (analytics.getQuizCompletionRate() < 50.0) {
            recommendations.add("Complete more available quizzes to assess your understanding");
        }

        // Course completion recommendations
        if (analytics.getCoursesCompleted() == 0 && analytics.getTotalCoursesEnrolled() > 0) {
            recommendations.add("Focus on completing at least one course to build momentum");
        }

        // Streak recommendations
        if (analytics.getStreakDays() == null || analytics.getStreakDays() < 3) {
            recommendations.add("Try to study consistently every day to build a learning streak");
        }

        // Performance trend recommendations
        if ("DECLINING".equals(analytics.getPerformanceTrend())) {
            recommendations.add("Your performance is declining. Consider reviewing previous materials");
            recommendations.add("Take breaks and ensure you're not experiencing burnout");
        }

        analytics.setImprovementRecommendations(recommendations);
    }

    private void analyzeStrengthsAndImprovements(ProgressReportDTO report, StudentAnalyticsDTO analytics) {
        List<String> strengths = new ArrayList<>();
        List<String> improvements = new ArrayList<>();

        // Analyze quiz performance
        if (analytics.getAverageQuizScore() >= EXCELLENT_PERFORMANCE) {
            strengths.add("Excellent quiz performance");
        } else if (analytics.getAverageQuizScore() >= GOOD_PERFORMANCE) {
            strengths.add("Good quiz performance");
        } else {
            improvements.add("Quiz performance needs improvement");
        }

        // Analyze flashcard performance
        if (analytics.getAverageFlashcardAccuracy() >= MASTERY_THRESHOLD) {
            strengths.add("Strong flashcard mastery");
        } else {
            improvements.add("Flashcard accuracy needs improvement");
        }

        // Analyze completion rates
        if (analytics.getQuizCompletionRate() >= 80.0) {
            strengths.add("High quiz completion rate");
        } else {
            improvements.add("Complete more available quizzes");
        }

        // Analyze consistency
        if (analytics.getStreakDays() != null && analytics.getStreakDays() >= 7) {
            strengths.add("Consistent study habits");
        } else {
            improvements.add("Build more consistent study habits");
        }

        report.setStrengthAreas(strengths);
        report.setImprovementAreas(improvements);
    }

    private String calculatePerformanceGrade(Double averageScore) {
        if (averageScore == null)
            return "N/A";
        if (averageScore >= 90.0)
            return "A";
        if (averageScore >= 80.0)
            return "B";
        if (averageScore >= 70.0)
            return "C";
        if (averageScore >= 60.0)
            return "D";
        return "F";
    }

    private QuizPerformanceDTO convertToQuizPerformanceDTO(StudentQuiz studentQuiz) {
        QuizPerformanceDTO dto = new QuizPerformanceDTO();
        dto.setQuizId(studentQuiz.getQuiz().getId());
        dto.setQuizTitle(studentQuiz.getQuiz().getTitle());
        dto.setScore(studentQuiz.getScore());
        dto.setCompletionDate(studentQuiz.getEndTime().atZone(java.time.ZoneId.systemDefault()).toLocalDateTime());
        dto.setTimeTakenMinutes(calculateTimeTaken(studentQuiz));
        dto.setCorrectAnswers(studentQuiz.getCorrectAnswers());
        dto.setTotalQuestions(studentQuiz.getTotalQuestions());
        return dto;
    }

    private FlashcardPerformanceDTO convertToFlashcardPerformanceDTO(FlashcardSession session) {
        FlashcardPerformanceDTO dto = new FlashcardPerformanceDTO();
        dto.setStudentId(session.getStudent().getId());
        dto.setLessonId(session.getLesson().getId());
        dto.setLessonTitle(session.getLesson().getTitle());
        dto.setLastStudyDate(session.getSessionDate());
        dto.setSessionDate(session.getSessionDate());
        dto.setTotalCardsStudied(session.getCardsStudied());
        dto.setCardsStudied(session.getCardsStudied());
        dto.setOverallAccuracy(session.getAccuracyPercentage());
        dto.setAccuracyPercentage(session.getAccuracyPercentage());
        dto.setCorrectAnswers(session.getCorrectAnswers());
        dto.setIncorrectAnswers(session.getIncorrectAnswers());
        dto.setCurrentDifficultyLevel(session.getDifficultyLevel());
        dto.setTotalStudyTimeMinutes(
                session.getDurationMinutes() != null ? session.getDurationMinutes().longValue() : 0L);
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setNextReviewDate(session.getNextReviewDate());
        return dto;
    }

    private Integer calculateTimeTaken(StudentQuiz studentQuiz) {
        if (studentQuiz.getStartTime() != null && studentQuiz.getEndTime() != null) {
            long minutes = ChronoUnit.MINUTES.between(studentQuiz.getStartTime(), studentQuiz.getEndTime());
            return (int) minutes;
        }
        return null;
    }
}