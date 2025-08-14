package com.satori.platform.service;

import com.satori.platform.domain.Quiz;
import com.satori.platform.domain.QuizQuestion;
import com.satori.platform.domain.StudentQuiz;
import com.satori.platform.domain.StudentQuizResponse;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.repository.QuizQuestionRepository;
import com.satori.platform.repository.QuizRepository;
import com.satori.platform.repository.StudentQuizRepository;
import com.satori.platform.repository.StudentQuizResponseRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.service.dto.*;
import com.satori.platform.service.dto.StudentQuizDTO;
import com.satori.platform.service.exception.QuizNotActiveException;
import com.satori.platform.service.exception.QuizSessionException;
import com.satori.platform.service.exception.QuizTimeExpiredException;
import com.satori.platform.service.mapper.QuizQuestionMapper;
import com.satori.platform.service.mapper.StudentQuizMapper;
import com.satori.platform.service.mapper.StudentQuizResponseMapper;
import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.satori.platform.domain.StudentQuiz}.
 * Enhance with session management, timing validation and performance optimizations.
 */
@Service
@Transactional
public class StudentQuizService {

    private static final Logger LOG = LoggerFactory.getLogger(StudentQuizService.class);
    private static final double PASSING_SCORE_PERCENTAGE = 70.0;
    private final StudentQuizRepository studentQuizRepository;
    private final StudentQuizResponseRepository studentQuizResponseRepository;
    private final QuizRepository quizRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final UserProfileRepository userProfileRepository;
    private final StudentQuizMapper studentQuizMapper;
    private final StudentQuizResponseMapper studentQuizResponseMapper;
    private final QuizQuestionMapper quizQuestionMapper;

    public StudentQuizService(
        StudentQuizRepository studentQuizRepository,
        StudentQuizResponseRepository studentQuizResponseRepository,
        QuizRepository quizRepository,
        QuizQuestionRepository quizQuestionRepository,
        UserProfileRepository userProfileRepository,
        StudentQuizMapper studentQuizMapper,
        StudentQuizResponseMapper studentQuizResponseMapper,
        QuizQuestionMapper quizQuestionMapper
    ) {
        this.studentQuizRepository = studentQuizRepository;
        this.studentQuizResponseRepository = studentQuizResponseRepository;
        this.quizRepository = quizRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.userProfileRepository = userProfileRepository;
        this.studentQuizMapper = studentQuizMapper;
        this.studentQuizResponseMapper = studentQuizResponseMapper;
        this.quizQuestionMapper = quizQuestionMapper;
    }

    /**
     * Save a studentQuiz.
     *
     * @param studentQuizDTO the entity to save.
     * @return the persisted entity.
     */
    public StudentQuizDTO save(StudentQuizDTO studentQuizDTO) {
        LOG.debug("Request to save StudentQuiz : {}", studentQuizDTO);
        StudentQuiz studentQuiz = studentQuizMapper.toEntity(studentQuizDTO);
        studentQuiz = studentQuizRepository.save(studentQuiz);
        return studentQuizMapper.toDto(studentQuiz);
    }

    /**
     * Update a studentQuiz.
     *
     * @param studentQuizDTO the entity to save.
     * @return the persisted entity.
     */
    public StudentQuizDTO update(StudentQuizDTO studentQuizDTO) {
        LOG.debug("Request to update StudentQuiz : {}", studentQuizDTO);
        StudentQuiz studentQuiz = studentQuizMapper.toEntity(studentQuizDTO);
        studentQuiz = studentQuizRepository.save(studentQuiz);
        return studentQuizMapper.toDto(studentQuiz);
    }

    /**
     * Partially update a studentQuiz.
     *
     * @param studentQuizDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<StudentQuizDTO> partialUpdate(StudentQuizDTO studentQuizDTO) {
        LOG.debug("Request to partially update StudentQuiz : {}", studentQuizDTO);

        return studentQuizRepository
            .findById(studentQuizDTO.getId())
            .map(existingStudentQuiz -> {
                studentQuizMapper.partialUpdate(existingStudentQuiz, studentQuizDTO);

                return existingStudentQuiz;
            })
            .map(studentQuizRepository::save)
            .map(studentQuizMapper::toDto);
    }

    /**
     * Get all the studentQuizs.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<StudentQuizDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all StudentQuizs");
        return studentQuizRepository.findAll(pageable).map(studentQuizMapper::toDto);
    }

    /**
     * Get one studentQuiz by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<StudentQuizDTO> findOne(Long id) {
        LOG.debug("Request to get StudentQuiz : {}", id);
        return studentQuizRepository.findById(id).map(studentQuizMapper::toDto);
    }

    /**
     * Delete the studentQuiz by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete StudentQuiz : {}", id);
        studentQuizRepository.deleteById(id);
    }

    /**
     * Start a new quiz attempt for a student.
     *
     * @param quizId    the quiz ID
     * @param studentId the student ID
     * @return the quiz session DTO
     */
    public QuizSessionDTO startQuizAttempt(Long quizId, Long studentId) {
        LOG.debug("Request to start quiz attempt for quiz: {} and student: {}", quizId, studentId);

        Quiz quiz = quizRepository.findById(quizId).orElseThrow(() -> new IllegalArgumentException("Quiz not found with id: " + quizId));

        UserProfile student = userProfileRepository
            .findById(studentId)
            .orElseThrow(() -> new IllegalArgumentException("Student not found with id: " + studentId));

        // Validate quiz is active
        validateQuizActive(quiz);

        // Check if student already has an active attempt
        Optional<StudentQuiz> existingAttempt = studentQuizRepository.findActiveAttemptByStudentAndQuiz(studentId, quizId);
        if (existingAttempt.isPresent()) {
            return buildQuizSessionDTO(existingAttempt.orElseThrow());
        }

        // Create new attempt
        StudentQuiz studentQuiz = new StudentQuiz();
        studentQuiz.setQuiz(quiz);
        studentQuiz.setStudent(student);
        studentQuiz.setStartTime(Instant.now());
        studentQuiz.setCompleted(false);
        studentQuiz.setPaused(false);
        studentQuiz.setCurrentQuestionIndex(0);
        studentQuiz.setCorrectAnswers(0);
        studentQuiz.setTotalPauseDurationSeconds(0);
        studentQuiz.setSubmittedAutomatically(false);

        // Set total questions
        List<QuizQuestion> questions = quizQuestionRepository.findByQuizIdOrderByPosition(quizId);
        studentQuiz.setTotalQuestions(questions.size());

        studentQuiz = studentQuizRepository.save(studentQuiz);

        LOG.info("Started quiz attempt {} for student {} on quiz {}", studentQuiz.getId(), studentId, quizId);
        return buildQuizSessionDTO(studentQuiz);
    }

    /**
     * Submit an answer for a quiz question.
     *
     * @param studentQuizId  the student quiz attempt ID
     * @param quizQuestionId the quiz question ID
     * @param answer         the student's answer
     * @return the response DTO
     */
    public StudentQuizResponseDTO submitAnswer(Long studentQuizId, Long quizQuestionId, String answer) {
        LOG.debug("Request to submit answer for studentQuiz: {} and question: {}", studentQuizId, quizQuestionId);

        StudentQuiz studentQuiz = studentQuizRepository
            .findById(studentQuizId)
            .orElseThrow(() -> new IllegalArgumentException("StudentQuiz not found with id: " + studentQuizId));

        QuizQuestion quizQuestion = quizQuestionRepository
            .findById(quizQuestionId)
            .orElseThrow(() -> new IllegalArgumentException("QuizQuestion not found with id: " + quizQuestionId));

        // Validate quiz session
        validateQuizSession(studentQuiz);

        // Check if response already exists
        StudentQuizResponse existingResponse = studentQuizResponseRepository.findByStudentQuizIdAndQuizQuestionId(
            studentQuizId,
            quizQuestionId
        );

        if (existingResponse != null) {
            // Update existing response
            existingResponse.setStudentAnswer(answer);
            existingResponse.setResponseTime(Instant.now());
            existingResponse.setIsCorrect(isAnswerCorrect(quizQuestion, answer));
            existingResponse = studentQuizResponseRepository.save(existingResponse);
        } else {
            // Create new response
            existingResponse = new StudentQuizResponse();
            existingResponse.setStudentQuiz(studentQuiz);
            existingResponse.setQuizQuestion(quizQuestion);
            existingResponse.setStudentAnswer(answer);
            existingResponse.setResponseTime(Instant.now());
            existingResponse.setIsCorrect(isAnswerCorrect(quizQuestion, answer));
            existingResponse = studentQuizResponseRepository.save(existingResponse);
        }

        // Update student quiz progress
        updateQuizProgress(studentQuiz);

        return studentQuizResponseMapper.toDto(existingResponse);
    }

    /**
     * Pause a quiz attempt.
     *
     * @param studentQuizId the student quiz attempt ID
     * @return the updated quiz session DTO
     */
    public QuizSessionDTO pauseQuizAttempt(Long studentQuizId) {
        LOG.debug("Request to pause quiz attempt: {}", studentQuizId);

        StudentQuiz studentQuiz = studentQuizRepository
            .findById(studentQuizId)
            .orElseThrow(() -> new IllegalArgumentException("StudentQuiz not found with id: " + studentQuizId));

        validateQuizSession(studentQuiz);

        if (Boolean.TRUE.equals(studentQuiz.getPaused())) {
            throw new QuizSessionException("Quiz is already paused");
        }

        studentQuiz.setPaused(true);
        studentQuiz.setPauseTime(Instant.now());
        studentQuiz = studentQuizRepository.save(studentQuiz);

        LOG.info("Paused quiz attempt {}", studentQuizId);
        return buildQuizSessionDTO(studentQuiz);
    }

    /**
     * Resume a paused quiz attempt.
     *
     * @param studentQuizId the student quiz attempt ID
     * @return the updated quiz session DTO
     */
    public QuizSessionDTO resumeQuizAttempt(Long studentQuizId) {
        LOG.debug("Request to resume quiz attempt: {}", studentQuizId);

        StudentQuiz studentQuiz = studentQuizRepository
            .findById(studentQuizId)
            .orElseThrow(() -> new IllegalArgumentException("StudentQuiz not found with id: " + studentQuizId));

        validateQuizSession(studentQuiz);

        if (!Boolean.TRUE.equals(studentQuiz.getPaused())) {
            throw new QuizSessionException("Quiz is not paused");
        }

        // Calculate pause duration
        if (studentQuiz.getPauseTime() != null) {
            long pauseDuration = Duration.between(studentQuiz.getPauseTime(), Instant.now()).getSeconds();
            int totalPauseDuration = studentQuiz.getTotalPauseDurationSeconds() + (int) pauseDuration;
            studentQuiz.setTotalPauseDurationSeconds(totalPauseDuration);
        }

        studentQuiz.setPaused(false);
        studentQuiz.setResumeTime(Instant.now());
        studentQuiz.setPauseTime(null);
        studentQuiz = studentQuizRepository.save(studentQuiz);

        LOG.info("Resumed quiz attempt {}", studentQuizId);
        return buildQuizSessionDTO(studentQuiz);
    }

    /**
     * Submit a quiz attempt and calculate the final score.
     *
     * @param studentQuizId the student quiz attempt ID
     * @return the quiz result DTO
     */
    public QuizResultDTO submitQuizAttempt(Long studentQuizId) {
        LOG.debug("Request to submit quiz attempt: {}", studentQuizId);

        StudentQuiz studentQuiz = studentQuizRepository
            .findById(studentQuizId)
            .orElseThrow(() -> new IllegalArgumentException("StudentQuiz not found with id: " + studentQuizId));

        if (Boolean.TRUE.equals(studentQuiz.getCompleted())) {
            throw new QuizSessionException("Quiz is already completed");
        }

        // Complete the quiz
        studentQuiz.setCompleted(true);
        studentQuiz.setEndTime(Instant.now());

        // Calculate final score
        calculateAndSetFinalScore(studentQuiz);

        studentQuiz = studentQuizRepository.save(studentQuiz);

        LOG.info("Submitted quiz attempt {} with score {}", studentQuizId, studentQuiz.getScore());
        return buildQuizResultDTO(studentQuiz);
    }

    /**
     * Auto-submit quiz attempts that have exceeded time limits.
     */
    @Async
    public void autoSubmitExpiredQuizzes() {
        LOG.debug("Running auto-submit for expired quizzes");

        Instant now = Instant.now();
        Instant cutoffTime = now.minus(Duration.ofHours(24)); // Look back 24 hours for time limits

        List<StudentQuiz> expiredAttempts = studentQuizRepository.findAttemptsToAutoSubmit(cutoffTime, now);

        for (StudentQuiz attempt : expiredAttempts) {
            try {
                attempt.setCompleted(true);
                attempt.setEndTime(now);
                attempt.setSubmittedAutomatically(true);
                calculateAndSetFinalScore(attempt);
                studentQuizRepository.save(attempt);

                LOG.info("Auto-submitted expired quiz attempt {}", attempt.getId());
            } catch (Exception e) {
                LOG.error("Error auto-submitting quiz attempt {}: {}", attempt.getId(), e.getMessage());
            }
        }
    }

    /**
     * Get quiz attempt history for a student.
     *
     * @param studentId the student ID
     * @param pageable  pagination information
     * @return page of quiz results
     */
    @Transactional(readOnly = true)
    public Page<QuizResultDTO> getQuizHistory(Long studentId, Pageable pageable) {
        LOG.debug("Request to get quiz history for student: {}", studentId);

        Page<StudentQuiz> attempts = studentQuizRepository.findByStudentIdOrderByStartTimeDesc(studentId, pageable);
        return attempts.map(this::buildQuizResultDTO);
    }

    /**
     * Get performance statistics for a student and quiz.
     *
     * @param studentId the student ID
     * @param quizId    the quiz ID
     * @return performance statistics
     */
    @Transactional(readOnly = true)
    public QuizPerformanceStatsDTO getPerformanceStats(Long studentId, Long quizId) {
        LOG.debug("Request to get performance stats for student: {} and quiz: {}", studentId, quizId);

        List<StudentQuiz> attempts = studentQuizRepository.findByStudentIdAndQuizIdOrderByStartTimeDesc(studentId, quizId);

        QuizPerformanceStatsDTO stats = new QuizPerformanceStatsDTO();
        stats.setTotalAttempts((long) attempts.size());

        if (!attempts.isEmpty()) {
            List<Double> scores = attempts
                .stream()
                .filter(a -> Boolean.TRUE.equals(a.getCompleted()) && a.getScore() != null)
                .map(StudentQuiz::getScore)
                .collect(Collectors.toList());

            if (!scores.isEmpty()) {
                stats.setBestScore(scores.stream().mapToDouble(Double::doubleValue).max().orElse(0.0));
                stats.setAverageScore(scores.stream().mapToDouble(Double::doubleValue).average().orElse(0.0));
                stats.setLastScore(scores.get(0)); // Most recent score

                // Calculate improvement rate
                if (scores.size() > 1) {
                    double firstScore = scores.get(scores.size() - 1);
                    double lastScore = scores.get(0);
                    stats.setImprovementRate(((lastScore - firstScore) / firstScore) * 100);
                }

                // Determine performance trend
                stats.setPerformanceTrend(calculatePerformanceTrend(scores));
                stats.setRecommendation(generateRecommendation(stats));
            }
        }

        return stats;
    }

    /**
     * Get current quiz session for a student.
     *
     * @param studentId the student ID
     * @param quizId    the quiz ID
     * @return the current quiz session or empty if none active
     */
    @Transactional(readOnly = true)
    public Optional<QuizSessionDTO> getCurrentQuizSession(Long studentId, Long quizId) {
        LOG.debug("Request to get current quiz session for student: {} and quiz: {}", studentId, quizId);

        Optional<StudentQuiz> activeAttempt = studentQuizRepository.findActiveAttemptByStudentAndQuiz(studentId, quizId);
        return activeAttempt.map(this::buildQuizSessionDTO);
    }

    // Helper methods

    private void validateQuizActive(Quiz quiz) {
        if (!Boolean.TRUE.equals(quiz.getIsActive())) {
            throw new QuizNotActiveException(quiz.getId());
        }

        Instant now = Instant.now();
        if (quiz.getActivationTime() != null && now.isBefore(quiz.getActivationTime())) {
            throw new QuizNotActiveException("Quiz has not started yet");
        }

        if (quiz.getDeactivationTime() != null && now.isAfter(quiz.getDeactivationTime())) {
            throw new QuizTimeExpiredException(quiz.getId());
        }
    }

    private void validateQuizSession(StudentQuiz studentQuiz) {
        if (Boolean.TRUE.equals(studentQuiz.getCompleted())) {
            throw new QuizSessionException("Quiz is already completed");
        }

        // Check if quiz time limit exceeded
        Quiz quiz = studentQuiz.getQuiz();
        if (quiz.getTimeLimitMinutes() != null && studentQuiz.getStartTime() != null) {
            Instant timeLimit = studentQuiz.getStartTime().plus(Duration.ofMinutes(quiz.getTimeLimitMinutes()));
            if (Instant.now().isAfter(timeLimit)) {
                throw new QuizTimeExpiredException("Quiz time limit exceeded");
            }
        }

        // Check if quiz is still active
        validateQuizActive(quiz);
    }

    private boolean isAnswerCorrect(QuizQuestion quizQuestion, String studentAnswer) {
        if (studentAnswer == null || quizQuestion.getQuestion() == null) {
            return false;
        }

        String correctAnswer = quizQuestion.getQuestion().getCorrectAnswer();
        if (correctAnswer == null) {
            return false;
        }

        // Simple string comparison - could be enhanced for different question types
        return correctAnswer.trim().equalsIgnoreCase(studentAnswer.trim());
    }

    private void updateQuizProgress(StudentQuiz studentQuiz) {
        Long correctCount = studentQuizResponseRepository.countCorrectResponsesByStudentQuizId(studentQuiz.getId());
        studentQuiz.setCorrectAnswers(correctCount.intValue());
        studentQuizRepository.save(studentQuiz);
    }

    private void calculateAndSetFinalScore(StudentQuiz studentQuiz) {
        Long correctCount = studentQuizResponseRepository.countCorrectResponsesByStudentQuizId(studentQuiz.getId());
        Long totalCount = studentQuizResponseRepository.countByStudentQuizId(studentQuiz.getId());

        if (totalCount > 0) {
            double score = (correctCount.doubleValue() / totalCount.doubleValue()) * 100.0;
            studentQuiz.setScore(score);
            studentQuiz.setCorrectAnswers(correctCount.intValue());
        } else {
            studentQuiz.setScore(0.0);
            studentQuiz.setCorrectAnswers(0);
        }
    }

    private QuizSessionDTO buildQuizSessionDTO(StudentQuiz studentQuiz) {
        QuizSessionDTO session = new QuizSessionDTO();
        session.setStudentQuizId(studentQuiz.getId());
        session.setQuizId(studentQuiz.getQuiz().getId());
        session.setQuizTitle(studentQuiz.getQuiz().getTitle());
        session.setStartTime(studentQuiz.getStartTime());
        session.setEndTime(studentQuiz.getEndTime());
        session.setCompleted(studentQuiz.getCompleted());
        session.setPaused(studentQuiz.getPaused());
        session.setCurrentQuestionIndex(studentQuiz.getCurrentQuestionIndex());
        session.setTotalQuestions(studentQuiz.getTotalQuestions());
        session.setScore(studentQuiz.getScore());
        session.setCorrectAnswers(studentQuiz.getCorrectAnswers());
        session.setAutoSubmitted(studentQuiz.getSubmittedAutomatically());

        // Set timing information
        Quiz quiz = studentQuiz.getQuiz();
        session.setTimeLimitMinutes(quiz.getTimeLimitMinutes());

        if (quiz.getTimeLimitMinutes() != null && studentQuiz.getStartTime() != null && !Boolean.TRUE.equals(studentQuiz.getCompleted())) {
            Instant timeLimit = studentQuiz.getStartTime().plus(Duration.ofMinutes(quiz.getTimeLimitMinutes()));
            long remainingSeconds = Duration.between(Instant.now(), timeLimit).getSeconds();
            session.setRemainingTimeSeconds(Math.max(0, (int) remainingSeconds));
        }

        // Set questions and responses
        List<QuizQuestion> questions = quizQuestionRepository.findByQuizIdOrderByPosition(studentQuiz.getQuiz().getId());
        session.setQuestions(questions.stream().map(quizQuestionMapper::toDto).collect(Collectors.toList()));

        List<StudentQuizResponse> responses = studentQuizResponseRepository.findByStudentQuizIdOrderByQuizQuestionPosition(
            studentQuiz.getId()
        );
        session.setResponses(responses.stream().map(studentQuizResponseMapper::toDto).collect(Collectors.toList()));

        // Set session controls
        session.setCanPause(!Boolean.TRUE.equals(studentQuiz.getCompleted()) && !Boolean.TRUE.equals(studentQuiz.getPaused()));
        session.setCanResume(!Boolean.TRUE.equals(studentQuiz.getCompleted()) && Boolean.TRUE.equals(studentQuiz.getPaused()));

        return session;
    }

    private QuizResultDTO buildQuizResultDTO(StudentQuiz studentQuiz) {
        QuizResultDTO result = new QuizResultDTO();
        result.setStudentQuizId(studentQuiz.getId());
        result.setQuizId(studentQuiz.getQuiz().getId());
        result.setQuizTitle(studentQuiz.getQuiz().getTitle());
        result.setStartTime(studentQuiz.getStartTime());
        result.setEndTime(studentQuiz.getEndTime());
        result.setScore(studentQuiz.getScore());
        result.setCorrectAnswers(studentQuiz.getCorrectAnswers());
        result.setTotalQuestions(studentQuiz.getTotalQuestions());
        result.setAutoSubmitted(studentQuiz.getSubmittedAutomatically());

        if (studentQuiz.getScore() != null && studentQuiz.getTotalQuestions() != null && studentQuiz.getTotalQuestions() > 0) {
            result.setPercentage(studentQuiz.getScore());
            result.setPassed(studentQuiz.getScore() >= PASSING_SCORE_PERCENTAGE);
            result.setGrade(calculateGrade(studentQuiz.getScore()));
        }

        if (studentQuiz.getStartTime() != null && studentQuiz.getEndTime() != null) {
            long timeTaken = Duration.between(studentQuiz.getStartTime(), studentQuiz.getEndTime()).getSeconds();
            result.setTimeTakenSeconds((int) timeTaken);
        }

        // Include responses if completed
        if (Boolean.TRUE.equals(studentQuiz.getCompleted())) {
            List<StudentQuizResponse> responses = studentQuizResponseRepository.findByStudentQuizIdOrderByQuizQuestionPosition(
                studentQuiz.getId()
            );
            result.setResponses(responses.stream().map(studentQuizResponseMapper::toDto).collect(Collectors.toList()));
        }

        return result;
    }

    private String calculateGrade(Double score) {
        if (score >= 90) return "A";
        if (score >= 80) return "B";
        if (score >= 70) return "C";
        if (score >= 60) return "D";
        return "F";
    }

    private String calculatePerformanceTrend(List<Double> scores) {
        if (scores.size() < 2) return "INSUFFICIENT_DATA";

        double recentAverage = scores
            .subList(0, Math.min(3, scores.size()))
            .stream()
            .mapToDouble(Double::doubleValue)
            .average()
            .orElse(0.0);
        double olderAverage = scores
            .subList(Math.max(0, scores.size() - 3), scores.size())
            .stream()
            .mapToDouble(Double::doubleValue)
            .average()
            .orElse(0.0);

        if (recentAverage > olderAverage + 5) return "IMPROVING";
        if (recentAverage < olderAverage - 5) return "DECLINING";
        return "STABLE";
    }

    private String generateRecommendation(QuizPerformanceStatsDTO stats) {
        if (stats.getAverageScore() == null) return "Take more quizzes to get personalized recommendations";

        if (stats.getAverageScore() < 60) {
            return "Review course materials and practice more before attempting quizzes";
        } else if (stats.getAverageScore() < 80) {
            return "Good progress! Focus on areas where you got questions wrong";
        } else {
            return "Excellent performance! Consider helping other students or taking advanced topics";
        }
    }
}
