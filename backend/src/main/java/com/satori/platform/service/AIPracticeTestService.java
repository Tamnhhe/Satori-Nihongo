package com.satori.platform.service;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.DifficultyLevel;
import com.satori.platform.domain.enumeration.QuizType;
import com.satori.platform.repository.*;
import com.satori.platform.service.dto.*;
import com.satori.platform.service.exception.AIServiceException;
import com.satori.platform.service.mapper.QuizMapper;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service for AI-powered practice test generation.
 * Generates practice tests based on course content and student performance
 * history.
 */
@Service
@Transactional
public class AIPracticeTestService {

    private static final Logger log = LoggerFactory.getLogger(AIPracticeTestService.class);

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final StudentQuizRepository studentQuizRepository;
    private final StudentAnalyticsService studentAnalyticsService;
    private final AIContentAnalysisService aiContentAnalysisService;
    private final java.util.Optional<SpringAIQuestionService> springAIQuestionService;
    private final RAGContentRetrievalService ragContentRetrievalService;
    private final QuizMapper quizMapper;

    @Value("${app.ai.practice-test.default-question-count:10}")
    private int defaultQuestionCount;

    @Value("${app.ai.practice-test.max-question-count:50}")
    private int maxQuestionCount;

    @Value("${app.ai.practice-test.fallback-enabled:true}")
    private boolean fallbackEnabled;

    public AIPracticeTestService(
        QuizRepository quizRepository,
        QuestionRepository questionRepository,
        QuizQuestionRepository quizQuestionRepository,
        CourseRepository courseRepository,
        LessonRepository lessonRepository,
        StudentQuizRepository studentQuizRepository,
        StudentAnalyticsService studentAnalyticsService,
        AIContentAnalysisService aiContentAnalysisService,
        java.util.Optional<SpringAIQuestionService> springAIQuestionService,
        RAGContentRetrievalService ragContentRetrievalService,
        QuizMapper quizMapper
    ) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.studentQuizRepository = studentQuizRepository;
        this.studentAnalyticsService = studentAnalyticsService;
        this.aiContentAnalysisService = aiContentAnalysisService;
        this.springAIQuestionService = springAIQuestionService;
        this.ragContentRetrievalService = ragContentRetrievalService;
        this.quizMapper = quizMapper;
    }

    /**
     * Generate a practice test based on course content and student performance.
     *
     * @param request the practice test generation request
     * @return the generated practice test
     */
    @Transactional
    public QuizDTO generatePracticeTest(AIPracticeTestRequestDTO request) {
        log.debug("Generating AI practice test for request: {}", request);

        validateRequest(request);

        try {
            // Analyze student performance to determine focus areas
            StudentPerformanceAnalysisDTO performanceAnalysis = analyzeStudentPerformance(request);

            // Generate questions using AI service with RAG enhancement
            List<AIGeneratedQuestionDTO> aiQuestions = generateQuestionsWithAI(request, performanceAnalysis);

            // Create the practice quiz
            Quiz practiceQuiz = createPracticeQuiz(request, aiQuestions);

            log.info(
                "Successfully generated AI practice test with {} questions for student: {}",
                aiQuestions.size(),
                request.getStudentId()
            );

            return quizMapper.toDto(practiceQuiz);
        } catch (AIServiceException e) {
            log.warn("AI service failed, attempting fallback generation: {}", e.getMessage());
            if (fallbackEnabled) {
                return generateFallbackPracticeTest(request);
            } else {
                throw e;
            }
        }
    }

    /**
     * Generate practice test for a specific lesson.
     *
     * @param lessonId      the lesson ID
     * @param studentId     the student ID
     * @param questionCount the number of questions to generate
     * @return the generated practice test
     */
    @Transactional
    public QuizDTO generateLessonPracticeTest(Long lessonId, Long studentId, Integer questionCount) {
        log.debug("Generating lesson-based practice test for lesson: {} and student: {}", lessonId, studentId);

        Lesson lesson = lessonRepository
            .findById(lessonId)
            .orElseThrow(() -> new IllegalArgumentException("Lesson not found with id: " + lessonId));

        AIPracticeTestRequestDTO request = new AIPracticeTestRequestDTO();
        request.setStudentId(studentId);
        request.setLessonId(lessonId);
        request.setQuestionCount(questionCount != null ? questionCount : defaultQuestionCount);
        request.setDifficultyLevel(DifficultyLevel.MEDIUM);
        request.setIncludeImages(true);
        request.setFocusOnWeakAreas(true);

        return generatePracticeTest(request);
    }

    /**
     * Generate practice test for a specific course.
     *
     * @param courseId        the course ID
     * @param studentId       the student ID
     * @param questionCount   the number of questions to generate
     * @param difficultyLevel the difficulty level
     * @return the generated practice test
     */
    @Transactional
    public QuizDTO generateCoursePracticeTest(Long courseId, Long studentId, Integer questionCount, DifficultyLevel difficultyLevel) {
        log.debug("Generating course-based practice test for course: {} and student: {}", courseId, studentId);

        Course course = courseRepository
            .findById(courseId)
            .orElseThrow(() -> new IllegalArgumentException("Course not found with id: " + courseId));

        AIPracticeTestRequestDTO request = new AIPracticeTestRequestDTO();
        request.setStudentId(studentId);
        request.setCourseId(courseId);
        request.setQuestionCount(questionCount != null ? questionCount : defaultQuestionCount);
        request.setDifficultyLevel(difficultyLevel != null ? difficultyLevel : DifficultyLevel.MEDIUM);
        request.setIncludeImages(true);
        request.setFocusOnWeakAreas(true);

        return generatePracticeTest(request);
    }

    /**
     * Get available practice test topics for a student.
     *
     * @param studentId the student ID
     * @return list of available topics
     */
    @Transactional(readOnly = true)
    public List<PracticeTestTopicDTO> getAvailableTopics(Long studentId) {
        log.debug("Getting available practice test topics for student: {}", studentId);

        List<PracticeTestTopicDTO> topics = new ArrayList<>();

        // Get enrolled courses
        // Note: This would need to be implemented based on your enrollment system
        // For now, we'll return a basic structure

        return topics;
    }

    // Private helper methods

    private void validateRequest(AIPracticeTestRequestDTO request) {
        if (request.getStudentId() == null) {
            throw new IllegalArgumentException("Student ID is required");
        }

        if (request.getCourseId() == null && request.getLessonId() == null) {
            throw new IllegalArgumentException("Either course ID or lesson ID must be provided");
        }

        if (request.getQuestionCount() != null && request.getQuestionCount() > maxQuestionCount) {
            throw new IllegalArgumentException("Question count cannot exceed " + maxQuestionCount);
        }

        if (request.getQuestionCount() != null && request.getQuestionCount() < 1) {
            throw new IllegalArgumentException("Question count must be at least 1");
        }
    }

    private StudentPerformanceAnalysisDTO analyzeStudentPerformance(AIPracticeTestRequestDTO request) {
        log.debug("Analyzing student performance for practice test generation");

        StudentPerformanceAnalysisDTO analysis = new StudentPerformanceAnalysisDTO();
        analysis.setStudentId(request.getStudentId());

        try {
            // Get student analytics
            StudentAnalyticsDTO studentAnalytics = studentAnalyticsService.getStudentAnalytics(request.getStudentId());

            // Analyze weak areas based on quiz performance
            List<String> weakAreas = identifyWeakAreas(request, studentAnalytics);
            analysis.setWeakAreas(weakAreas);

            // Determine recommended difficulty
            DifficultyLevel recommendedDifficulty = determineRecommendedDifficulty(studentAnalytics);
            analysis.setRecommendedDifficulty(recommendedDifficulty);

            // Get recent performance trends
            analysis.setRecentPerformanceTrend(calculatePerformanceTrend(request.getStudentId()));
        } catch (Exception e) {
            log.warn("Failed to analyze student performance, using defaults: {}", e.getMessage());
            analysis.setWeakAreas(new ArrayList<>());
            analysis.setRecommendedDifficulty(DifficultyLevel.MEDIUM);
            analysis.setRecentPerformanceTrend(0.0);
        }

        return analysis;
    }

    private List<AIGeneratedQuestionDTO> generateQuestionsWithAI(
        AIPracticeTestRequestDTO request,
        StudentPerformanceAnalysisDTO performanceAnalysis
    ) {
        log.debug("Generating questions using AI service");

        // Prepare content for AI analysis (now includes RAG-enhanced content)
        String contentToAnalyze = gatherContentForAnalysis(request);

        // Enhance with weak area specific content using RAG
        if (request.getFocusOnWeakAreas() && !performanceAnalysis.getWeakAreas().isEmpty()) {
            contentToAnalyze += gatherWeakAreaContent(performanceAnalysis.getWeakAreas(), request.getCourseId());
        }

        // Create AI generation request
        AIQuestionGenerationRequestDTO aiRequest = new AIQuestionGenerationRequestDTO();
        aiRequest.setContent(contentToAnalyze);
        aiRequest.setQuestionCount(request.getQuestionCount() != null ? request.getQuestionCount() : defaultQuestionCount);
        aiRequest.setDifficultyLevel(
            request.getDifficultyLevel() != null ? request.getDifficultyLevel() : performanceAnalysis.getRecommendedDifficulty()
        );
        aiRequest.setIncludeImages(request.getIncludeImages() != null ? request.getIncludeImages() : false);
        aiRequest.setWeakAreas(performanceAnalysis.getWeakAreas());
        aiRequest.setFocusOnWeakAreas(request.getFocusOnWeakAreas() != null ? request.getFocusOnWeakAreas() : false);

        // Generate questions using AI service
        List<AIGeneratedQuestionDTO> questions = springAIQuestionService
            .map(service -> {
                try {
                    return service.generateQuestions(aiRequest);
                } catch (Exception e) {
                    log.warn("Spring AI generation failed, falling back to external AI service: {}", e.getMessage());
                    return aiContentAnalysisService.generateQuestions(aiRequest);
                }
            })
            .orElseGet(() -> aiContentAnalysisService.generateQuestions(aiRequest));

        // Validate and filter generated questions
        return validateAndFilterQuestions(questions);
    }

    private Quiz createPracticeQuiz(AIPracticeTestRequestDTO request, List<AIGeneratedQuestionDTO> aiQuestions) {
        log.debug("Creating practice quiz with {} AI-generated questions", aiQuestions.size());

        // Create the quiz
        Quiz practiceQuiz = new Quiz();
        practiceQuiz.setTitle("AI Practice Test - " + Instant.now().toString());
        practiceQuiz.setDescription("AI-generated practice test based on your performance and course content");
        practiceQuiz.setIsTest(false);
        practiceQuiz.setIsPractice(true);
        practiceQuiz.setQuizType(request.getCourseId() != null ? QuizType.COURSE : QuizType.LESSON);
        practiceQuiz.setIsActive(true);
        practiceQuiz.setTimeLimitMinutes(calculateTimeLimit(aiQuestions.size()));

        // Associate with course or lesson
        if (request.getCourseId() != null) {
            Course course = courseRepository
                .findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
            practiceQuiz.getCourses().add(course);
        }

        if (request.getLessonId() != null) {
            Lesson lesson = lessonRepository
                .findById(request.getLessonId())
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));
            practiceQuiz.getLessons().add(lesson);
        }

        practiceQuiz = quizRepository.save(practiceQuiz);

        // Create questions and quiz questions
        int position = 1;
        for (AIGeneratedQuestionDTO aiQuestion : aiQuestions) {
            Question question = createQuestionFromAI(aiQuestion);
            question = questionRepository.save(question);

            QuizQuestion quizQuestion = new QuizQuestion();
            quizQuestion.setQuiz(practiceQuiz);
            quizQuestion.setQuestion(question);
            quizQuestion.setPosition(position++);
            quizQuestionRepository.save(quizQuestion);
        }

        return practiceQuiz;
    }

    private QuizDTO generateFallbackPracticeTest(AIPracticeTestRequestDTO request) {
        log.debug("Generating fallback practice test using existing questions");

        // Find existing questions from the course/lesson
        List<Question> existingQuestions = findExistingQuestions(request);

        if (existingQuestions.isEmpty()) {
            throw new AIServiceException("No existing questions available for fallback generation");
        }

        // Select questions based on student performance
        List<Question> selectedQuestions = selectQuestionsForFallback(existingQuestions, request);

        // Create fallback quiz
        Quiz fallbackQuiz = createFallbackQuiz(request, selectedQuestions);

        log.info("Generated fallback practice test with {} questions", selectedQuestions.size());

        return quizMapper.toDto(fallbackQuiz);
    }

    private String gatherContentForAnalysis(AIPracticeTestRequestDTO request) {
        StringBuilder content = new StringBuilder();

        // First, gather basic course/lesson content (existing approach)
        if (request.getCourseId() != null) {
            Course course = courseRepository.findById(request.getCourseId()).orElse(null);
            if (course != null) {
                content.append("Course: ").append(course.getTitle()).append("\n");
                content.append("Description: ").append(course.getDescription()).append("\n\n");

                // Add lesson content
                for (Lesson lesson : course.getLessons()) {
                    content.append("Lesson: ").append(lesson.getTitle()).append("\n");
                    content.append(lesson.getContent()).append("\n\n");
                }
            }
        }

        if (request.getLessonId() != null) {
            Lesson lesson = lessonRepository.findById(request.getLessonId()).orElse(null);
            if (lesson != null) {
                content.append("Lesson: ").append(lesson.getTitle()).append("\n");
                content.append(lesson.getContent()).append("\n\n");
            }
        }

        // Enhanced: Use RAG to gather additional relevant content
        content.append(gatherRAGEnhancedContent(request));

        return content.toString();
    }

    private String gatherWeakAreaContent(List<String> weakAreas, Long courseId) {
        StringBuilder weakAreaContent = new StringBuilder();

        try {
            List<RAGContentResultDTO> weakAreaResults = ragContentRetrievalService.retrieveContentForWeakAreas(weakAreas, courseId);

            if (!weakAreaResults.isEmpty()) {
                weakAreaContent.append("\n=== Content for Weak Areas ===\n");
                for (RAGContentResultDTO result : weakAreaResults) {
                    weakAreaContent.append("Weak Area Support: ").append(result.getTitle()).append("\n");
                    weakAreaContent.append("Content: ").append(result.getContent()).append("\n");
                    weakAreaContent.append("Topics: ").append(String.join(", ", result.getTopics())).append("\n\n");
                }
            }
        } catch (Exception e) {
            log.warn("Failed to gather weak area content: {}", e.getMessage());
        }

        return weakAreaContent.toString();
    }

    private String gatherRAGEnhancedContent(AIPracticeTestRequestDTO request) {
        StringBuilder ragContent = new StringBuilder();

        try {
            // Create RAG request for general content
            RAGContentRequestDTO ragRequest = new RAGContentRequestDTO();

            // Build query from course/lesson context
            String query = buildRAGQuery(request);
            ragRequest.setQuery(query);
            ragRequest.setCourseId(request.getCourseId());
            ragRequest.setMaxResults(5);
            ragRequest.setSimilarityThreshold(0.7);

            // Retrieve relevant content
            List<RAGContentResultDTO> relevantContent = ragContentRetrievalService.retrieveRelevantContent(ragRequest);

            if (!relevantContent.isEmpty()) {
                ragContent.append("\n=== Additional Relevant Content ===\n");
                for (RAGContentResultDTO contentResult : relevantContent) {
                    ragContent.append("Source: ").append(contentResult.getSource()).append("\n");
                    ragContent.append("Title: ").append(contentResult.getTitle()).append("\n");
                    ragContent.append("Content: ").append(contentResult.getContent()).append("\n");
                    ragContent.append("Relevance: ").append(String.format("%.2f", contentResult.getRelevanceScore())).append("\n\n");
                }
            }
        } catch (Exception e) {
            log.warn("Failed to gather RAG-enhanced content: {}", e.getMessage());
        }

        return ragContent.toString();
    }

    private String buildRAGQuery(AIPracticeTestRequestDTO request) {
        StringBuilder query = new StringBuilder();

        if (request.getCourseId() != null) {
            Course course = courseRepository.findById(request.getCourseId()).orElse(null);
            if (course != null) {
                query.append(course.getTitle()).append(" ");
            }
        }

        if (request.getLessonId() != null) {
            Lesson lesson = lessonRepository.findById(request.getLessonId()).orElse(null);
            if (lesson != null) {
                query.append(lesson.getTitle()).append(" ");
            }
        }

        // Add difficulty level context
        if (request.getDifficultyLevel() != null) {
            query.append(request.getDifficultyLevel().toString().toLowerCase()).append(" level ");
        }

        query.append("examples explanations practice questions");

        return query.toString().trim();
    }

    private List<String> identifyWeakAreas(AIPracticeTestRequestDTO request, StudentAnalyticsDTO analytics) {
        List<String> weakAreas = new ArrayList<>();

        // Analyze quiz performance to identify weak areas
        if (analytics.getRecentQuizzes() != null) {
            for (QuizPerformanceDTO performance : analytics.getRecentQuizzes()) {
                if (performance.getScore() < 70.0) {
                    // This is a simplified approach - in reality, you'd analyze question topics
                    weakAreas.add("Topic from quiz: " + performance.getQuizTitle());
                }
            }
        }

        return weakAreas;
    }

    private DifficultyLevel determineRecommendedDifficulty(StudentAnalyticsDTO analytics) {
        if (analytics.getAverageQuizScore() != null) {
            double overallScore = analytics.getAverageQuizScore();

            if (overallScore >= 85.0) {
                return DifficultyLevel.HARD;
            } else if (overallScore >= 70.0) {
                return DifficultyLevel.MEDIUM;
            } else {
                return DifficultyLevel.EASY;
            }
        }

        return DifficultyLevel.MEDIUM;
    }

    private double calculatePerformanceTrend(Long studentId) {
        // Get recent quiz attempts and calculate trend
        List<StudentQuiz> recentQuizzes = studentQuizRepository.findRecentByStudentId(studentId, 10);

        if (recentQuizzes.size() < 2) {
            return 0.0;
        }

        // Simple trend calculation - compare first half with second half
        int midPoint = recentQuizzes.size() / 2;
        double firstHalfAvg = recentQuizzes
            .subList(0, midPoint)
            .stream()
            .mapToDouble(sq -> sq.getScore() != null ? sq.getScore() : 0.0)
            .average()
            .orElse(0.0);

        double secondHalfAvg = recentQuizzes
            .subList(midPoint, recentQuizzes.size())
            .stream()
            .mapToDouble(sq -> sq.getScore() != null ? sq.getScore() : 0.0)
            .average()
            .orElse(0.0);

        return secondHalfAvg - firstHalfAvg;
    }

    private List<AIGeneratedQuestionDTO> validateAndFilterQuestions(List<AIGeneratedQuestionDTO> questions) {
        return questions.stream().filter(this::isValidAIQuestion).collect(Collectors.toList());
    }

    private boolean isValidAIQuestion(AIGeneratedQuestionDTO question) {
        return (
            question.getContent() != null &&
            !question.getContent().trim().isEmpty() &&
            question.getCorrectAnswer() != null &&
            !question.getCorrectAnswer().trim().isEmpty() &&
            question.getType() != null &&
            !question.getType().trim().isEmpty()
        );
    }

    private Question createQuestionFromAI(AIGeneratedQuestionDTO aiQuestion) {
        Question question = new Question();
        question.setContent(aiQuestion.getContent());
        question.setCorrectAnswer(aiQuestion.getCorrectAnswer());
        question.setType(aiQuestion.getType());
        question.setAnswerExplanation(aiQuestion.getExplanation());
        question.setSuggestion(aiQuestion.getHint());
        question.setImageUrl(aiQuestion.getImageUrl());

        return question;
    }

    private int calculateTimeLimit(int questionCount) {
        // Allow 2 minutes per question with a minimum of 10 minutes
        return Math.max(10, questionCount * 2);
    }

    private List<Question> findExistingQuestions(AIPracticeTestRequestDTO request) {
        List<Question> questions = new ArrayList<>();

        if (request.getCourseId() != null) {
            // Find questions from quizzes associated with this course
            List<Quiz> courseQuizzes = quizRepository.findByCourseId(request.getCourseId());
            for (Quiz quiz : courseQuizzes) {
                List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizIdOrderByPosition(quiz.getId());
                questions.addAll(
                    quizQuestions.stream().map(QuizQuestion::getQuestion).filter(Objects::nonNull).collect(Collectors.toList())
                );
            }
        }

        if (request.getLessonId() != null) {
            // Find questions from quizzes associated with this lesson
            List<Quiz> lessonQuizzes = quizRepository.findByLessonId(request.getLessonId());
            for (Quiz quiz : lessonQuizzes) {
                List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizIdOrderByPosition(quiz.getId());
                questions.addAll(
                    quizQuestions.stream().map(QuizQuestion::getQuestion).filter(Objects::nonNull).collect(Collectors.toList())
                );
            }
        }

        return questions.stream().distinct().collect(Collectors.toList());
    }

    private List<Question> selectQuestionsForFallback(List<Question> existingQuestions, AIPracticeTestRequestDTO request) {
        int targetCount = request.getQuestionCount() != null ? request.getQuestionCount() : defaultQuestionCount;

        // Shuffle and select random questions
        Collections.shuffle(existingQuestions);

        return existingQuestions.stream().limit(Math.min(targetCount, existingQuestions.size())).collect(Collectors.toList());
    }

    private Quiz createFallbackQuiz(AIPracticeTestRequestDTO request, List<Question> selectedQuestions) {
        Quiz fallbackQuiz = new Quiz();
        fallbackQuiz.setTitle("Practice Test (Fallback) - " + Instant.now().toString());
        fallbackQuiz.setDescription("Practice test generated from existing questions");
        fallbackQuiz.setIsTest(false);
        fallbackQuiz.setIsPractice(true);
        fallbackQuiz.setQuizType(request.getCourseId() != null ? QuizType.COURSE : QuizType.LESSON);
        fallbackQuiz.setIsActive(true);
        fallbackQuiz.setTimeLimitMinutes(calculateTimeLimit(selectedQuestions.size()));

        // Associate with course or lesson
        if (request.getCourseId() != null) {
            Course course = courseRepository
                .findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found"));
            fallbackQuiz.getCourses().add(course);
        }

        if (request.getLessonId() != null) {
            Lesson lesson = lessonRepository
                .findById(request.getLessonId())
                .orElseThrow(() -> new IllegalArgumentException("Lesson not found"));
            fallbackQuiz.getLessons().add(lesson);
        }

        fallbackQuiz = quizRepository.save(fallbackQuiz);

        // Create quiz questions
        int position = 1;
        for (Question question : selectedQuestions) {
            QuizQuestion quizQuestion = new QuizQuestion();
            quizQuestion.setQuiz(fallbackQuiz);
            quizQuestion.setQuestion(question);
            quizQuestion.setPosition(position++);
            quizQuestionRepository.save(quizQuestion);
        }

        return fallbackQuiz;
    }
}
