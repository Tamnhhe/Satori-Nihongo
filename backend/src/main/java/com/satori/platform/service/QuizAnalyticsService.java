package com.satori.platform.service;

import com.satori.platform.domain.*;
import com.satori.platform.repository.*;
import com.satori.platform.service.dto.QuizAnalyticsDTO;
import com.satori.platform.service.dto.QuestionAnalyticsDTO;
import com.satori.platform.service.dto.TimeBasedAnalyticsDTO;
import com.satori.platform.service.dto.StudentPerformanceDTO;
import com.satori.platform.service.constants.QuizAnalyticsConstants;
import com.satori.platform.web.rest.errors.BadRequestAlertException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for Quiz Analytics.
 */
@Service
@Transactional(readOnly = true)
public class QuizAnalyticsService {

    private static final Logger LOG = LoggerFactory.getLogger(QuizAnalyticsService.class);

    private final QuizRepository quizRepository;
    private final StudentQuizRepository studentQuizRepository;
    private final QuizQuestionRepository quizQuestionRepository;

    private final StudentQuizResponseRepository studentQuizResponseRepository;

    public QuizAnalyticsService(
            QuizRepository quizRepository,
            StudentQuizRepository studentQuizRepository,
            QuizQuestionRepository quizQuestionRepository,
            StudentQuizResponseRepository studentQuizResponseRepository) {
        this.quizRepository = quizRepository;
        this.studentQuizRepository = studentQuizRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.studentQuizResponseRepository = studentQuizResponseRepository;
    }

    /**
     * Get comprehensive analytics for a quiz.
     */
    public QuizAnalyticsDTO getQuizAnalytics(Long quizId) {
        LOG.debug("Request to get quiz analytics: {}", quizId);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new BadRequestAlertException("Quiz not found", "quiz", "notfound"));

        QuizAnalyticsDTO analytics = new QuizAnalyticsDTO();
        analytics.setQuizId(quizId);
        analytics.setQuizTitle(quiz.getTitle());

        // Get all student quiz attempts
        List<StudentQuiz> attempts = studentQuizRepository.findByQuizId(quizId);

        if (attempts.isEmpty()) {
            // Return empty analytics if no attempts
            analytics.setTotalAttempts(0);
            analytics.setCompletedAttempts(0);
            analytics.setUniqueStudents(0);
            analytics.setAverageScore(0.0);
            analytics.setCompletionRate(0.0);
            analytics.setScoreDistribution(new HashMap<>());
            return analytics;
        }

        // Basic statistics
        analytics.setTotalAttempts(attempts.size());

        List<StudentQuiz> completedAttempts = attempts.stream()
                .filter(sq -> sq.getScore() != null && sq.getCompleted() != null && sq.getCompleted())
                .collect(Collectors.toList());

        analytics.setCompletedAttempts(completedAttempts.size());

        Set<Long> uniqueStudentIds = attempts.stream()
                .map(sq -> sq.getStudent().getId())
                .collect(Collectors.toSet());
        analytics.setUniqueStudents(uniqueStudentIds.size());

        if (!completedAttempts.isEmpty()) {
            // Score statistics
            List<Double> scores = completedAttempts.stream()
                    .map(StudentQuiz::getScore)
                    .collect(Collectors.toList());

            analytics.setAverageScore(scores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0));
            analytics.setHighestScore(scores.stream().mapToDouble(Double::doubleValue).max().orElse(0.0));
            analytics.setLowestScore(scores.stream().mapToDouble(Double::doubleValue).min().orElse(0.0));

            // Completion rate
            analytics.setCompletionRate((double) completedAttempts.size() / attempts.size() * 100);

            // Score distribution
            analytics.setScoreDistribution(calculateScoreDistribution(scores));

            // Time-based analytics
            analytics.setTimeBasedAnalytics(calculateTimeBasedAnalytics(completedAttempts));

            // Student performance
            analytics.setTopPerformers(
                    getTopPerformers(completedAttempts, QuizAnalyticsConstants.DEFAULT_TOP_PERFORMERS_LIMIT));
            analytics.setStrugglingStudents(
                    getStrugglingStudents(completedAttempts, QuizAnalyticsConstants.DEFAULT_STRUGGLING_STUDENTS_LIMIT));

            // Last attempt
            analytics.setLastAttempt(
                    attempts.stream()
                            .map(StudentQuiz::getStartTime)
                            .filter(Objects::nonNull)
                            .max(Instant::compareTo)
                            .orElse(null));

            // Calculate average time spent
            double avgTimeSpent = completedAttempts.stream()
                    .filter(sq -> sq.getStartTime() != null && sq.getEndTime() != null)
                    .mapToLong(sq -> java.time.Duration.between(sq.getStartTime(), sq.getEndTime()).toMinutes())
                    .average()
                    .orElse(0.0);
            analytics.setAverageTimeSpent(avgTimeSpent);
        }

        // Question-level analytics
        analytics.setQuestionAnalytics(calculateQuestionAnalytics(quizId, completedAttempts));

        return analytics;
    }

    /**
     * Get quiz analytics for multiple quizzes (summary view).
     */
    public List<QuizAnalyticsDTO> getQuizAnalyticsSummary(List<Long> quizIds) {
        LOG.debug("Request to get quiz analytics summary for: {}", quizIds);

        return quizIds.stream()
                .map(this::getQuizAnalyticsSummary)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Get summary analytics for a single quiz.
     */
    private QuizAnalyticsDTO getQuizAnalyticsSummary(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId).orElse(null);
        if (quiz == null) {
            return null;
        }

        QuizAnalyticsDTO summary = new QuizAnalyticsDTO();
        summary.setQuizId(quizId);
        summary.setQuizTitle(quiz.getTitle());

        List<StudentQuiz> attempts = studentQuizRepository.findByQuizId(quizId);
        summary.setTotalAttempts(attempts.size());

        List<StudentQuiz> completedAttempts = attempts.stream()
                .filter(sq -> sq.getScore() != null && sq.getCompleted() != null && sq.getCompleted())
                .collect(Collectors.toList());

        summary.setCompletedAttempts(completedAttempts.size());
        summary.setUniqueStudents(
                attempts.stream()
                        .map(sq -> sq.getStudent().getId())
                        .collect(Collectors.toSet())
                        .size());

        if (!completedAttempts.isEmpty()) {
            summary.setAverageScore(
                    completedAttempts.stream()
                            .mapToDouble(StudentQuiz::getScore)
                            .average()
                            .orElse(0.0));
            summary.setCompletionRate((double) completedAttempts.size() / attempts.size() * 100);
        } else {
            summary.setAverageScore(0.0);
            summary.setCompletionRate(0.0);
        }

        return summary;
    }

    /**
     * Export quiz results to CSV format.
     */
    public String exportQuizResults(Long quizId) {
        LOG.debug("Request to export quiz results: {}", quizId);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new BadRequestAlertException("Quiz not found", "quiz", "notfound"));

        List<StudentQuiz> attempts = studentQuizRepository.findByQuizId(quizId);

        StringBuilder csv = new StringBuilder();

        // CSV Header
        csv.append(QuizAnalyticsConstants.CSV_HEADER_STUDENT_RESULTS).append("\n");

        // CSV Data
        for (StudentQuiz attempt : attempts) {
            UserProfile student = attempt.getStudent();
            csv.append("\"").append(student.getId()).append("\",");
            csv.append("\"").append(student.getFullName()).append("\",");

            // Get student code from StudentProfile if available
            String studentCode = "N/A";
            if (student.getStudentProfile() != null) {
                studentCode = student.getStudentProfile().getStudentId();
            }
            csv.append("\"").append(studentCode).append("\",");

            csv.append(attempt.getScore() != null ? attempt.getScore() : "N/A").append(",");
            csv.append("\"").append(attempt.getEndTime() != null ? attempt.getEndTime().toString() : "N/A")
                    .append("\",");
            csv.append("\"").append(attempt.getStartTime() != null ? attempt.getStartTime().toString() : "N/A")
                    .append("\",");
            csv.append("\"").append(attempt.getEndTime() != null ? attempt.getEndTime().toString() : "N/A")
                    .append("\",");

            // Calculate time spent
            if (attempt.getStartTime() != null && attempt.getEndTime() != null) {
                long timeSpentMinutes = java.time.Duration.between(attempt.getStartTime(), attempt.getEndTime())
                        .toMinutes();
                csv.append(timeSpentMinutes);
            } else {
                csv.append("N/A");
            }
            csv.append(",");

            csv.append("\"")
                    .append(attempt.getCompleted() != null && attempt.getCompleted() ? "Completed" : "In Progress")
                    .append("\",");

            // Get question-level details
            Long correctAnswers = studentQuizResponseRepository.countCorrectResponsesByStudentQuizId(attempt.getId());
            Long totalQuestions = studentQuizResponseRepository.countByStudentQuizId(attempt.getId());

            csv.append(correctAnswers != null ? correctAnswers : 0).append(",");
            csv.append(totalQuestions != null ? totalQuestions : 0).append(",");

            // Completion rate
            if (totalQuestions != null && totalQuestions > 0) {
                double completionRate = (double) correctAnswers / totalQuestions * 100;
                csv.append(String.format("%.1f%%", completionRate));
            } else {
                csv.append("N/A");
            }

            csv.append("\n");
        }

        return csv.toString();
    }

    /**
     * Export detailed quiz analytics to CSV format.
     */
    public String exportQuizAnalytics(Long quizId) {
        LOG.debug("Request to export quiz analytics: {}", quizId);

        QuizAnalyticsDTO analytics = getQuizAnalytics(quizId);
        StringBuilder csv = new StringBuilder();

        // Analytics Summary
        csv.append("Quiz Analytics Summary\n");
        csv.append("Quiz Title,").append("\"").append(analytics.getQuizTitle()).append("\"\n");
        csv.append("Total Attempts,").append(analytics.getTotalAttempts()).append("\n");
        csv.append("Completed Attempts,").append(analytics.getCompletedAttempts()).append("\n");
        csv.append("Unique Students,").append(analytics.getUniqueStudents()).append("\n");
        csv.append("Average Score,").append(analytics.getAverageScore()).append("%\n");
        csv.append("Highest Score,").append(analytics.getHighestScore()).append("%\n");
        csv.append("Lowest Score,").append(analytics.getLowestScore()).append("%\n");
        csv.append("Completion Rate,").append(analytics.getCompletionRate()).append("%\n");
        csv.append("\n");

        // Score Distribution
        csv.append("Score Distribution\n");
        csv.append("Score Range,Count,Percentage\n");
        if (analytics.getScoreDistribution() != null) {
            for (Map.Entry<String, Integer> entry : analytics.getScoreDistribution().entrySet()) {
                double percentage = analytics.getCompletedAttempts() > 0
                        ? (double) entry.getValue() / analytics.getCompletedAttempts() * 100
                        : 0;
                csv.append("\"").append(entry.getKey()).append("\",")
                        .append(entry.getValue()).append(",")
                        .append(String.format("%.1f%%", percentage)).append("\n");
            }
        }
        csv.append("\n");

        // Top Performers
        csv.append("Top Performers\n");
        csv.append("Student Name,Student Code,Best Score,Average Score,Total Attempts,Performance Level\n");
        if (analytics.getTopPerformers() != null) {
            for (StudentPerformanceDTO performer : analytics.getTopPerformers()) {
                csv.append("\"").append(performer.getStudentName()).append("\",");
                csv.append("\"").append(performer.getStudentCode()).append("\",");
                csv.append(String.format("%.1f%%", performer.getBestScore())).append(",");
                csv.append(String.format("%.1f%%", performer.getAverageScore())).append(",");
                csv.append(performer.getTotalAttempts()).append(",");
                csv.append("\"").append(performer.getPerformanceLevel()).append("\"\n");
            }
        }
        csv.append("\n");

        // Question Analytics
        csv.append("Question Analytics\n");
        csv.append(
                "Question Content,Question Type,Total Answers,Correct Answers,Correct Percentage,Difficulty,Average Time Spent\n");
        if (analytics.getQuestionAnalytics() != null) {
            for (QuestionAnalyticsDTO question : analytics.getQuestionAnalytics()) {
                csv.append("\"").append(question.getQuestionContent()).append("\",");
                csv.append("\"").append(question.getQuestionType()).append("\",");
                csv.append(question.getTotalAnswers()).append(",");
                csv.append(question.getCorrectAnswers()).append(",");
                csv.append(String.format("%.1f%%", question.getCorrectPercentage())).append(",");
                csv.append("\"").append(question.getDifficultyLevel()).append("\",");
                csv.append(String.format("%.1f seconds", question.getAverageTimeSpent())).append("\n");
            }
        }

        return csv.toString();
    }

    // Private helper methods

    private Map<String, Integer> calculateScoreDistribution(List<Double> scores) {
        Map<String, Integer> distribution = new LinkedHashMap<>();
        distribution.put(QuizAnalyticsConstants.SCORE_RANGE_0_20, 0);
        distribution.put(QuizAnalyticsConstants.SCORE_RANGE_21_40, 0);
        distribution.put(QuizAnalyticsConstants.SCORE_RANGE_41_60, 0);
        distribution.put(QuizAnalyticsConstants.SCORE_RANGE_61_80, 0);
        distribution.put(QuizAnalyticsConstants.SCORE_RANGE_81_100, 0);

        for (Double score : scores) {
            if (score <= 20) {
                distribution.put(QuizAnalyticsConstants.SCORE_RANGE_0_20,
                        distribution.get(QuizAnalyticsConstants.SCORE_RANGE_0_20) + 1);
            } else if (score <= 40) {
                distribution.put(QuizAnalyticsConstants.SCORE_RANGE_21_40,
                        distribution.get(QuizAnalyticsConstants.SCORE_RANGE_21_40) + 1);
            } else if (score <= 60) {
                distribution.put(QuizAnalyticsConstants.SCORE_RANGE_41_60,
                        distribution.get(QuizAnalyticsConstants.SCORE_RANGE_41_60) + 1);
            } else if (score <= 80) {
                distribution.put(QuizAnalyticsConstants.SCORE_RANGE_61_80,
                        distribution.get(QuizAnalyticsConstants.SCORE_RANGE_61_80) + 1);
            } else {
                distribution.put(QuizAnalyticsConstants.SCORE_RANGE_81_100,
                        distribution.get(QuizAnalyticsConstants.SCORE_RANGE_81_100) + 1);
            }
        }

        return distribution;
    }

    private List<TimeBasedAnalyticsDTO> calculateTimeBasedAnalytics(List<StudentQuiz> attempts) {
        // Group attempts by date
        Map<String, List<StudentQuiz>> attemptsByDate = attempts.stream()
                .filter(sq -> sq.getStartTime() != null)
                .collect(Collectors.groupingBy(sq -> LocalDate.ofInstant(sq.getStartTime(), ZoneId.systemDefault())
                        .format(DateTimeFormatter.ISO_LOCAL_DATE)));

        return attemptsByDate.entrySet().stream()
                .map(entry -> {
                    List<StudentQuiz> dayAttempts = entry.getValue();
                    List<StudentQuiz> completedDayAttempts = dayAttempts.stream()
                            .filter(sq -> sq.getCompleted() != null && sq.getCompleted())
                            .collect(Collectors.toList());

                    TimeBasedAnalyticsDTO dayAnalytics = new TimeBasedAnalyticsDTO();
                    dayAnalytics.setPeriod(entry.getKey());
                    dayAnalytics.setDate(LocalDate.parse(entry.getKey()));
                    dayAnalytics.setAttempts(dayAttempts.size());
                    dayAnalytics.setCompletedAttempts(completedDayAttempts.size());
                    dayAnalytics.setAverageScore(
                            completedDayAttempts.stream()
                                    .mapToDouble(StudentQuiz::getScore)
                                    .average()
                                    .orElse(0.0));
                    dayAnalytics.setUniqueStudents(
                            dayAttempts.stream()
                                    .map(sq -> sq.getStudent().getId())
                                    .collect(Collectors.toSet())
                                    .size());
                    dayAnalytics.setCompletionRate(
                            dayAttempts.size() > 0 ? (double) completedDayAttempts.size() / dayAttempts.size() * 100
                                    : 0.0);

                    return dayAnalytics;
                })
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());
    }

    private List<StudentPerformanceDTO> getTopPerformers(List<StudentQuiz> attempts, int limit) {
        return attempts.stream()
                .collect(Collectors.groupingBy(sq -> sq.getStudent().getId()))
                .entrySet().stream()
                .map(entry -> this.createStudentPerformanceDTO(entry.getValue()))
                .sorted((a, b) -> Double.compare(
                        b.getBestScore() != null ? b.getBestScore() : 0.0,
                        a.getBestScore() != null ? a.getBestScore() : 0.0))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private List<StudentPerformanceDTO> getStrugglingStudents(List<StudentQuiz> attempts, int limit) {
        return attempts.stream()
                .collect(Collectors.groupingBy(sq -> sq.getStudent().getId()))
                .entrySet().stream()
                .map(entry -> this.createStudentPerformanceDTO(entry.getValue()))
                .sorted((a, b) -> Double.compare(
                        a.getAverageScore() != null ? a.getAverageScore() : 0.0,
                        b.getAverageScore() != null ? b.getAverageScore() : 0.0))
                .limit(limit)
                .collect(Collectors.toList());
    }

    private List<QuestionAnalyticsDTO> calculateQuestionAnalytics(Long quizId, List<StudentQuiz> attempts) {
        List<QuestionAnalyticsDTO> questionAnalytics = new ArrayList<>();

        // Get all quiz questions for this quiz
        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizIdOrderByPosition(quizId);

        for (QuizQuestion quizQuestion : quizQuestions) {
            QuestionAnalyticsDTO questionStats = new QuestionAnalyticsDTO(
                    quizQuestion.getQuestion().getId(),
                    quizQuestion.getQuestion().getContent(),
                    quizQuestion.getQuestion().getType().toString());

            // Get all responses for this question from completed attempts
            List<StudentQuizResponse> responses = new ArrayList<>();
            for (StudentQuiz attempt : attempts) {
                StudentQuizResponse response = studentQuizResponseRepository
                        .findByStudentQuizIdAndQuizQuestionId(attempt.getId(), quizQuestion.getId());
                if (response != null) {
                    responses.add(response);
                }
            }

            int totalAnswers = responses.size();
            int correctAnswers = (int) responses.stream()
                    .filter(r -> r.getIsCorrect() != null && r.getIsCorrect())
                    .count();

            questionStats.setTotalAnswers(totalAnswers);
            questionStats.setCorrectAnswers(correctAnswers);
            questionStats.setCorrectPercentage(
                    totalAnswers > 0 ? (double) correctAnswers / totalAnswers * 100 : 0.0);

            // Calculate answer distribution for multiple choice questions
            Map<String, Integer> answerDistribution = new HashMap<>();
            List<String> commonWrongAnswers = new ArrayList<>();

            for (StudentQuizResponse response : responses) {
                if (response.getStudentAnswer() != null) {
                    answerDistribution.put(response.getStudentAnswer(),
                            answerDistribution.getOrDefault(response.getStudentAnswer(), 0) + 1);

                    // Track wrong answers
                    if (response.getIsCorrect() != null && !response.getIsCorrect()) {
                        commonWrongAnswers.add(response.getStudentAnswer());
                    }
                }
            }

            questionStats.setAnswerDistribution(answerDistribution);

            // Get most common wrong answers (top 3)
            Map<String, Long> wrongAnswerCounts = commonWrongAnswers.stream()
                    .collect(Collectors.groupingBy(answer -> answer, Collectors.counting()));

            List<String> topWrongAnswers = wrongAnswerCounts.entrySet().stream()
                    .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                    .limit(3)
                    .map(Map.Entry::getKey)
                    .collect(Collectors.toList());

            questionStats.setCommonWrongAnswers(topWrongAnswers);

            // Average time spent (if available)
            double avgTimeSpent = responses.stream()
                    .filter(r -> r.getTimeSpentSeconds() != null)
                    .mapToInt(StudentQuizResponse::getTimeSpentSeconds)
                    .average()
                    .orElse(0.0);
            questionStats.setAverageTimeSpent(avgTimeSpent);

            questionAnalytics.add(questionStats);
        }

        return questionAnalytics;
    }

    /**
     * Helper method to create StudentPerformanceDTO from student attempts.
     */
    private StudentPerformanceDTO createStudentPerformanceDTO(List<StudentQuiz> studentAttempts) {
        if (studentAttempts.isEmpty()) {
            return null;
        }

        UserProfile student = studentAttempts.get(0).getStudent();
        List<StudentQuiz> completedAttempts = studentAttempts.stream()
                .filter(sq -> sq.getCompleted() != null && sq.getCompleted())
                .collect(Collectors.toList());

        StudentPerformanceDTO performance = new StudentPerformanceDTO(
                student.getId(),
                student.getFullName(),
                student.getStudentProfile() != null ? student.getStudentProfile().getStudentId() : "N/A");

        performance.setTotalAttempts(studentAttempts.size());
        performance.setCompletedAttempts(completedAttempts.size());

        if (!completedAttempts.isEmpty()) {
            performance.setBestScore(
                    completedAttempts.stream()
                            .mapToDouble(StudentQuiz::getScore)
                            .max()
                            .orElse(0.0));
            performance.setAverageScore(
                    completedAttempts.stream()
                            .mapToDouble(StudentQuiz::getScore)
                            .average()
                            .orElse(0.0));

            // Calculate improvement rate
            if (completedAttempts.size() > 1) {
                List<StudentQuiz> sortedAttempts = completedAttempts.stream()
                        .sorted((a, b) -> a.getStartTime().compareTo(b.getStartTime()))
                        .collect(Collectors.toList());

                double firstScore = sortedAttempts.get(0).getScore();
                double lastScore = sortedAttempts.get(sortedAttempts.size() - 1).getScore();

                if (firstScore > 0) {
                    performance.setImprovementRate((lastScore - firstScore) / firstScore * 100);
                }
            }
        } else {
            performance.setBestScore(0.0);
            performance.setAverageScore(0.0);
            performance.setImprovementRate(0.0);
        }

        performance.setLastAttempt(
                studentAttempts.stream()
                        .map(StudentQuiz::getStartTime)
                        .filter(Objects::nonNull)
                        .max(Instant::compareTo)
                        .orElse(null));

        performance.setPerformanceLevel(performance.calculatePerformanceLevel());

        return performance;
    }
}