package com.satori.platform.service;

import com.satori.platform.domain.Flashcard;
import com.satori.platform.domain.FlashcardSession;
import com.satori.platform.domain.Lesson;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.enumeration.DifficultyLevel;
import com.satori.platform.repository.FlashcardRepository;
import com.satori.platform.repository.FlashcardSessionRepository;
import com.satori.platform.repository.LessonRepository;
import com.satori.platform.repository.StudentProfileRepository;
import com.satori.platform.service.dto.FlashcardDTO;
import com.satori.platform.service.dto.FlashcardSessionDTO;
import com.satori.platform.service.dto.FlashcardPerformanceDTO;
import com.satori.platform.service.dto.FlashcardReviewScheduleDTO;
import com.satori.platform.service.mapper.FlashcardMapper;
import com.satori.platform.service.mapper.FlashcardSessionMapper;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link com.satori.platform.domain.Flashcard}.
 */
@Service
@Transactional
public class FlashcardService {

    private static final Logger LOG = LoggerFactory.getLogger(FlashcardService.class);

    private final FlashcardRepository flashcardRepository;
    private final FlashcardSessionRepository flashcardSessionRepository;
    private final LessonRepository lessonRepository;
    private final StudentProfileRepository studentProfileRepository;

    private final FlashcardMapper flashcardMapper;
    private final FlashcardSessionMapper flashcardSessionMapper;
    private final SpacedRepetitionService spacedRepetitionService;

    public FlashcardService(
            FlashcardRepository flashcardRepository,
            FlashcardSessionRepository flashcardSessionRepository,
            LessonRepository lessonRepository,
            StudentProfileRepository studentProfileRepository,
            FlashcardMapper flashcardMapper,
            FlashcardSessionMapper flashcardSessionMapper,
            SpacedRepetitionService spacedRepetitionService) {
        this.flashcardRepository = flashcardRepository;
        this.flashcardSessionRepository = flashcardSessionRepository;
        this.lessonRepository = lessonRepository;
        this.studentProfileRepository = studentProfileRepository;
        this.flashcardMapper = flashcardMapper;
        this.flashcardSessionMapper = flashcardSessionMapper;
        this.spacedRepetitionService = spacedRepetitionService;
    }

    /**
     * Save a flashcard.
     *
     * @param flashcardDTO the entity to save.
     * @return the persisted entity.
     */
    public FlashcardDTO save(FlashcardDTO flashcardDTO) {
        LOG.debug("Request to save Flashcard : {}", flashcardDTO);
        Flashcard flashcard = flashcardMapper.toEntity(flashcardDTO);
        flashcard = flashcardRepository.save(flashcard);
        return flashcardMapper.toDto(flashcard);
    }

    /**
     * Update a flashcard.
     *
     * @param flashcardDTO the entity to save.
     * @return the persisted entity.
     */
    public FlashcardDTO update(FlashcardDTO flashcardDTO) {
        LOG.debug("Request to update Flashcard : {}", flashcardDTO);
        Flashcard flashcard = flashcardMapper.toEntity(flashcardDTO);
        flashcard = flashcardRepository.save(flashcard);
        return flashcardMapper.toDto(flashcard);
    }

    /**
     * Partially update a flashcard.
     *
     * @param flashcardDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<FlashcardDTO> partialUpdate(FlashcardDTO flashcardDTO) {
        LOG.debug("Request to partially update Flashcard : {}", flashcardDTO);

        return flashcardRepository
            .findById(flashcardDTO.getId())
            .map(existingFlashcard -> {
                flashcardMapper.partialUpdate(existingFlashcard, flashcardDTO);

                return existingFlashcard;
            })
            .map(flashcardRepository::save)
            .map(flashcardMapper::toDto);
    }

    /**
     * Get all the flashcards.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<FlashcardDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Flashcards");
        return flashcardRepository.findAll(pageable).map(flashcardMapper::toDto);
    }

    /**
     * Get one flashcard by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<FlashcardDTO> findOne(Long id) {
        LOG.debug("Request to get Flashcard : {}", id);
        return flashcardRepository.findById(id).map(flashcardMapper::toDto);
    }

    /**
     * Delete the flashcard by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Flashcard : {}", id);
        flashcardRepository.deleteById(id);
    }

    // ===== ENHANCED FLASHCARD SESSION MANAGEMENT =====

    /**
     * Get flashcards for a lesson ordered by position
     */
    @Transactional(readOnly = true)
    public List<FlashcardDTO> getFlashcardsForLesson(Long lessonId) {
        LOG.debug("Request to get flashcards for lesson: {}", lessonId);

        Optional<Lesson> lesson = lessonRepository.findById(lessonId);
        if (lesson.isEmpty()) {
            return new ArrayList<>();
        }

        return flashcardRepository.findByLessonOrderByPosition(lesson.get())
                .stream()
                .map(flashcardMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Start a new flashcard session for a student and lesson
     */
    public FlashcardSessionDTO startFlashcardSession(Long studentId, Long lessonId, DifficultyLevel difficultyLevel) {
        LOG.debug("Starting flashcard session for student: {}, lesson: {}, difficulty: {}", studentId, lessonId,
                difficultyLevel);

        Optional<StudentProfile> student = studentProfileRepository.findById(studentId);
        Optional<Lesson> lesson = lessonRepository.findById(lessonId);

        if (student.isEmpty() || lesson.isEmpty()) {
            throw new IllegalArgumentException("Student or lesson not found");
        }

        // Check for existing incomplete session
        List<FlashcardSession> incompleteSessions = flashcardSessionRepository
                .findByStudentAndCompletedFalseOrderBySessionDateDesc(student.get());

        if (!incompleteSessions.isEmpty()) {
            LOG.debug("Found existing incomplete session, returning it");
            return flashcardSessionMapper.toDto(incompleteSessions.get(0));
        }

        // Create new session
        FlashcardSession session = new FlashcardSession();
        session.setStudent(student.get());
        session.setLesson(lesson.get());
        session.setSessionDate(LocalDateTime.now());
        session.setDifficultyLevel(difficultyLevel != null ? difficultyLevel : DifficultyLevel.MEDIUM);
        session.setCompleted(false);
        session.setCardsStudied(0);
        session.setCorrectAnswers(0);
        session.setIncorrectAnswers(0);
        session.setAccuracyPercentage(0.0);

        session = flashcardSessionRepository.save(session);

        LOG.debug("Created new flashcard session: {}", session.getId());
        return flashcardSessionMapper.toDto(session);
    }

    /**
     * Record a flashcard response during a session
     */
    public FlashcardSessionDTO recordFlashcardResponse(Long sessionId, Long flashcardId, Boolean correct) {
        LOG.debug("Recording flashcard response for session: {}, flashcard: {}, correct: {}", sessionId, flashcardId,
                correct);

        Optional<FlashcardSession> sessionOpt = flashcardSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new IllegalArgumentException("Flashcard session not found");
        }

        FlashcardSession session = sessionOpt.get();

        // Update session statistics
        session.setCardsStudied(session.getCardsStudied() + 1);
        if (correct) {
            session.setCorrectAnswers(session.getCorrectAnswers() + 1);
        } else {
            session.setIncorrectAnswers(session.getIncorrectAnswers() + 1);
        }

        // Calculate accuracy percentage
        double accuracy = (double) session.getCorrectAnswers() / session.getCardsStudied() * 100.0;
        session.setAccuracyPercentage(accuracy);

        session = flashcardSessionRepository.save(session);

        LOG.debug("Updated session statistics - Cards: {}, Correct: {}, Accuracy: {}%",
                session.getCardsStudied(), session.getCorrectAnswers(), accuracy);

        return flashcardSessionMapper.toDto(session);
    }

    /**
     * Complete a flashcard session and calculate next review date
     */
    public FlashcardSessionDTO completeFlashcardSession(Long sessionId) {
        LOG.debug("Completing flashcard session: {}", sessionId);

        Optional<FlashcardSession> sessionOpt = flashcardSessionRepository.findById(sessionId);
        if (sessionOpt.isEmpty()) {
            throw new IllegalArgumentException("Flashcard session not found");
        }

        FlashcardSession session = sessionOpt.get();

        // Calculate session duration
        if (session.getSessionDate() != null) {
            long durationMinutes = ChronoUnit.MINUTES.between(session.getSessionDate(), LocalDateTime.now());
            session.setDurationMinutes((int) durationMinutes);
        }

        // Mark as completed
        session.setCompleted(true);

        // Calculate next review date using spaced repetition
        List<FlashcardSession> previousSessions = flashcardSessionRepository
                .findByStudentAndLessonOrderBySessionDateDesc(session.getStudent(), session.getLesson());

        int reviewCount = previousSessions.size();
        LocalDateTime nextReviewDate = spacedRepetitionService.calculateNextReviewDate(
                session.getSessionDate(),
                session.getAccuracyPercentage(),
                session.getDifficultyLevel(),
                reviewCount);

        session.setNextReviewDate(nextReviewDate);

        // Adjust difficulty level based on performance
        Double averageAccuracy = flashcardSessionRepository
                .findAverageAccuracyByStudentAndLesson(session.getStudent(), session.getLesson())
                .orElse(session.getAccuracyPercentage());

        DifficultyLevel recommendedDifficulty = spacedRepetitionService.recommendDifficultyLevel(
                averageAccuracy,
                session.getDifficultyLevel(),
                Math.min(reviewCount, 5) // Consider last 5 sessions
        );

        session.setDifficultyLevel(recommendedDifficulty);

        session = flashcardSessionRepository.save(session);

        LOG.debug("Completed session - Duration: {} min, Next review: {}, Difficulty: {}",
                session.getDurationMinutes(), nextReviewDate, recommendedDifficulty);

        return flashcardSessionMapper.toDto(session);
    }

    /**
     * Get flashcards that need review for a student
     */
    @Transactional(readOnly = true)
    public List<FlashcardDTO> getReviewFlashcards(Long studentId) {
        LOG.debug("Getting review flashcards for student: {}", studentId);

        Optional<StudentProfile> student = studentProfileRepository.findById(studentId);
        if (student.isEmpty()) {
            return new ArrayList<>();
        }

        List<FlashcardSession> sessionsNeedingReview = flashcardSessionRepository
                .findSessionsNeedingReview(student.get(), LocalDateTime.now());

        List<FlashcardDTO> reviewFlashcards = new ArrayList<>();

        for (FlashcardSession session : sessionsNeedingReview) {
            List<Flashcard> lessonFlashcards = flashcardRepository
                    .findByLessonOrderByPosition(session.getLesson());

            reviewFlashcards.addAll(lessonFlashcards.stream()
                    .map(flashcardMapper::toDto)
                    .collect(Collectors.toList()));
        }

        LOG.debug("Found {} flashcards needing review", reviewFlashcards.size());
        return reviewFlashcards;
    }

    /**
     * Get performance analytics for a student
     */
    @Transactional(readOnly = true)
    public FlashcardPerformanceDTO getStudentPerformance(Long studentId, Long lessonId) {
        LOG.debug("Getting performance analytics for student: {}, lesson: {}", studentId, lessonId);

        Optional<StudentProfile> student = studentProfileRepository.findById(studentId);
        Optional<Lesson> lesson = lessonRepository.findById(lessonId);

        if (student.isEmpty() || lesson.isEmpty()) {
            return new FlashcardPerformanceDTO();
        }

        FlashcardPerformanceDTO performance = new FlashcardPerformanceDTO(studentId, lessonId, lesson.get().getTitle());

        // Get all sessions for this lesson
        List<FlashcardSession> sessions = flashcardSessionRepository
                .findByStudentAndLessonOrderBySessionDateDesc(student.get(), lesson.get());

        if (sessions.isEmpty()) {
            return performance;
        }

        // Calculate overall statistics
        Double averageAccuracy = flashcardSessionRepository
                .findAverageAccuracyByStudentAndLesson(student.get(), lesson.get())
                .orElse(0.0);

        Long totalSessions = flashcardSessionRepository
                .countCompletedSessionsByStudentAndLesson(student.get(), lesson.get());

        Long totalStudyTime = flashcardSessionRepository
                .findTotalStudyTimeByStudent(student.get())
                .orElse(0L);

        // Get recent sessions for trend analysis
        List<FlashcardSessionDTO> recentSessions = sessions.stream()
                .limit(5)
                .map(flashcardSessionMapper::toDto)
                .collect(Collectors.toList());

        // Calculate improvement trend
        Double improvementTrend = calculateImprovementTrend(sessions);

        // Get latest session info
        FlashcardSession latestSession = sessions.get(0);

        // Calculate total cards studied
        Integer totalCardsStudied = sessions.stream()
                .mapToInt(s -> s.getCardsStudied() != null ? s.getCardsStudied() : 0)
                .sum();

        // Check if review is needed
        Boolean needsReview = latestSession.getNextReviewDate() != null &&
                latestSession.getNextReviewDate().isBefore(LocalDateTime.now());

        // Set performance data
        performance.setOverallAccuracy(averageAccuracy);
        performance.setTotalSessions(totalSessions.intValue());
        performance.setTotalCardsStudied(totalCardsStudied);
        performance.setTotalStudyTimeMinutes(totalStudyTime);
        performance.setCurrentDifficultyLevel(latestSession.getDifficultyLevel());
        performance.setLastStudyDate(latestSession.getSessionDate());
        performance.setNextReviewDate(latestSession.getNextReviewDate());
        performance.setRecentSessions(recentSessions);
        performance.setImprovementTrend(improvementTrend);
        performance.setNeedsReview(needsReview);

        LOG.debug("Performance calculated - Accuracy: {}%, Sessions: {}, Needs review: {}",
                averageAccuracy, totalSessions, needsReview);

        return performance;
    }

    /**
     * Get review schedule recommendations for a student
     */
    @Transactional(readOnly = true)
    public FlashcardReviewScheduleDTO getReviewSchedule(Long studentId) {
        LOG.debug("Getting review schedule for student: {}", studentId);

        Optional<StudentProfile> student = studentProfileRepository.findById(studentId);
        if (student.isEmpty()) {
            return new FlashcardReviewScheduleDTO();
        }

        FlashcardReviewScheduleDTO schedule = new FlashcardReviewScheduleDTO(studentId);

        // Get latest session per lesson
        List<FlashcardSession> latestSessions = flashcardSessionRepository
                .findLatestSessionPerLesson(student.get());

        List<FlashcardReviewScheduleDTO.FlashcardReviewItemDTO> reviewItems = new ArrayList<>();
        int totalEstimatedMinutes = 0;

        for (FlashcardSession session : latestSessions) {
            Lesson lesson = session.getLesson();

            // Count flashcards in lesson
            List<Flashcard> flashcards = flashcardRepository.findByLessonOrderByPosition(lesson);

            // Calculate days since last review
            Integer daysSinceLastReview = session.getSessionDate() != null
                    ? (int) ChronoUnit.DAYS.between(session.getSessionDate(), LocalDateTime.now())
                    : null;

            // Calculate priority
            Integer priority = spacedRepetitionService.calculateReviewPriority(
                    session.getNextReviewDate(),
                    session.getAccuracyPercentage(),
                    daysSinceLastReview);

            // Estimate study time
            Integer estimatedMinutes = spacedRepetitionService.estimateStudyTime(
                    flashcards.size(),
                    session.getDifficultyLevel());

            FlashcardReviewScheduleDTO.FlashcardReviewItemDTO reviewItem = new FlashcardReviewScheduleDTO.FlashcardReviewItemDTO(
                    lesson.getId(), lesson.getTitle());

            reviewItem.setFlashcardCount(flashcards.size());
            reviewItem.setLastReviewDate(session.getSessionDate());
            reviewItem.setNextReviewDate(session.getNextReviewDate());
            reviewItem.setLastAccuracy(session.getAccuracyPercentage());
            reviewItem.setDifficultyLevel(session.getDifficultyLevel());
            reviewItem.setPriority(priority);

            reviewItems.add(reviewItem);
            totalEstimatedMinutes += estimatedMinutes;
        }

        // Sort by priority (lower number = higher priority)
        reviewItems.sort(Comparator.comparing(FlashcardReviewScheduleDTO.FlashcardReviewItemDTO::getPriority));

        // Calculate overall recommendations
        Double averageAccuracy = flashcardSessionRepository
                .findAverageAccuracyByStudent(student.get())
                .orElse(75.0);

        DifficultyLevel recommendedDifficulty = spacedRepetitionService.recommendDifficultyLevel(
                averageAccuracy,
                DifficultyLevel.MEDIUM,
                latestSessions.size());

        String recommendationReason = generateRecommendationReason(averageAccuracy, reviewItems.size());

        schedule.setReviewItems(reviewItems);
        schedule.setTotalItemsToReview(reviewItems.size());
        schedule.setEstimatedMinutes(totalEstimatedMinutes);
        schedule.setRecommendedDifficultyLevel(recommendedDifficulty);
        schedule.setRecommendationReason(recommendationReason);

        LOG.debug("Review schedule generated - {} items, {} minutes estimated",
                reviewItems.size(), totalEstimatedMinutes);

        return schedule;
    }

    private Double calculateImprovementTrend(List<FlashcardSession> sessions) {
        if (sessions.size() < 2) {
            return 0.0;
        }

        // Compare recent sessions with older ones
        List<FlashcardSession> recent = sessions.stream().limit(3).collect(Collectors.toList());
        List<FlashcardSession> older = sessions.stream().skip(3).limit(3).collect(Collectors.toList());

        if (older.isEmpty()) {
            return 0.0;
        }

        double recentAvg = recent.stream()
                .mapToDouble(s -> s.getAccuracyPercentage() != null ? s.getAccuracyPercentage() : 0.0)
                .average()
                .orElse(0.0);

        double olderAvg = older.stream()
                .mapToDouble(s -> s.getAccuracyPercentage() != null ? s.getAccuracyPercentage() : 0.0)
                .average()
                .orElse(0.0);

        return recentAvg - olderAvg;
    }

    private String generateRecommendationReason(Double averageAccuracy, Integer itemsToReview) {
        if (averageAccuracy >= 85.0) {
            return "Excellent performance! Consider increasing difficulty level.";
        } else if (averageAccuracy >= 75.0) {
            return "Good progress. Continue with current study pattern.";
        } else if (averageAccuracy >= 60.0) {
            return "Room for improvement. Consider more frequent review sessions.";
        } else {
            return "Focus on fundamentals. Consider easier difficulty level and more practice.";
        }
    }
}
