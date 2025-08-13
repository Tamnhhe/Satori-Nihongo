package com.satori.platform.service;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.QuizType;
import com.satori.platform.repository.*;
import com.satori.platform.service.dto.*;
import com.satori.platform.service.mapper.QuizMapper;
import com.satori.platform.service.mapper.QuestionMapper;
import com.satori.platform.service.mapper.QuizQuestionMapper;
import com.satori.platform.security.SecurityUtils;
import com.satori.platform.web.rest.errors.BadRequestAlertException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Enhanced service for managing Quiz entities with admin/teacher specific
 * functionality.
 */
@Service
@Transactional
public class EnhancedQuizService {

    private static final Logger LOG = LoggerFactory.getLogger(EnhancedQuizService.class);

    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final QuizQuestionRepository quizQuestionRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final UserProfileRepository userProfileRepository;

    private final QuizMapper quizMapper;
    private final QuestionMapper questionMapper;
    private final QuizQuestionMapper quizQuestionMapper;

    public EnhancedQuizService(
            QuizRepository quizRepository,
            QuestionRepository questionRepository,
            QuizQuestionRepository quizQuestionRepository,
            CourseRepository courseRepository,
            LessonRepository lessonRepository,
            UserProfileRepository userProfileRepository,
            QuizMapper quizMapper,
            QuestionMapper questionMapper,
            QuizQuestionMapper quizQuestionMapper) {
        this.quizRepository = quizRepository;
        this.questionRepository = questionRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.courseRepository = courseRepository;
        this.lessonRepository = lessonRepository;
        this.userProfileRepository = userProfileRepository;
        this.quizMapper = quizMapper;
        this.questionMapper = questionMapper;
        this.quizQuestionMapper = quizQuestionMapper;
    }

    /**
     * Create a new quiz with questions and settings.
     */
    @Transactional
    public QuizBuilderDTO createQuizWithBuilder(QuizBuilderDTO quizBuilderDTO) {
        LOG.debug("Request to create quiz with builder: {}", quizBuilderDTO);

        // Create the quiz entity
        Quiz quiz = new Quiz();
        quiz.setTitle(quizBuilderDTO.getTitle());
        quiz.setDescription(quizBuilderDTO.getDescription());
        quiz.setIsTest(quizBuilderDTO.getIsTest());
        quiz.setIsPractice(quizBuilderDTO.getIsPractice());
        quiz.setQuizType(quizBuilderDTO.getQuizType());
        quiz.setTimeLimitMinutes(quizBuilderDTO.getTimeLimitMinutes());
        quiz.setIsActive(false); // New quizzes start inactive
        quiz.setIsTemplate(false);

        quiz = quizRepository.save(quiz);

        // Add questions with positions
        if (quizBuilderDTO.getQuestions() != null && !quizBuilderDTO.getQuestions().isEmpty()) {
            addQuestionsToQuiz(quiz, quizBuilderDTO.getQuestions());
        }

        // Associate with courses and lessons
        if (quizBuilderDTO.getCourseIds() != null && !quizBuilderDTO.getCourseIds().isEmpty()) {
            Set<Course> courses = new HashSet<>(courseRepository.findAllById(quizBuilderDTO.getCourseIds()));
            quiz.setCourses(courses);
        }

        if (quizBuilderDTO.getLessonIds() != null && !quizBuilderDTO.getLessonIds().isEmpty()) {
            Set<Lesson> lessons = new HashSet<>(lessonRepository.findAllById(quizBuilderDTO.getLessonIds()));
            quiz.setLessons(lessons);
        }

        quiz = quizRepository.save(quiz);

        return convertToQuizBuilderDTO(quiz);
    }

    /**
     * Update quiz with reordered questions.
     */
    @Transactional
    public QuizBuilderDTO updateQuizWithBuilder(Long quizId, QuizBuilderDTO quizBuilderDTO) {
        LOG.debug("Request to update quiz with builder: {}", quizId);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new BadRequestAlertException("Quiz not found", "quiz", "notfound"));

        // Update basic quiz properties
        quiz.setTitle(quizBuilderDTO.getTitle());
        quiz.setDescription(quizBuilderDTO.getDescription());
        quiz.setIsTest(quizBuilderDTO.getIsTest());
        quiz.setIsPractice(quizBuilderDTO.getIsPractice());
        quiz.setQuizType(quizBuilderDTO.getQuizType());
        quiz.setTimeLimitMinutes(quizBuilderDTO.getTimeLimitMinutes());

        // Update questions - remove existing and add new ones
        quizQuestionRepository.deleteByQuizId(quizId);

        if (quizBuilderDTO.getQuestions() != null && !quizBuilderDTO.getQuestions().isEmpty()) {
            addQuestionsToQuiz(quiz, quizBuilderDTO.getQuestions());
        }

        // Update course and lesson associations
        quiz.getCourses().clear();
        quiz.getLessons().clear();

        if (quizBuilderDTO.getCourseIds() != null && !quizBuilderDTO.getCourseIds().isEmpty()) {
            Set<Course> courses = new HashSet<>(courseRepository.findAllById(quizBuilderDTO.getCourseIds()));
            quiz.setCourses(courses);
        }

        if (quizBuilderDTO.getLessonIds() != null && !quizBuilderDTO.getLessonIds().isEmpty()) {
            Set<Lesson> lessons = new HashSet<>(lessonRepository.findAllById(quizBuilderDTO.getLessonIds()));
            quiz.setLessons(lessons);
        }

        quiz = quizRepository.save(quiz);

        return convertToQuizBuilderDTO(quiz);
    }

    /**
     * Get quiz with builder format including questions and settings.
     */
    @Transactional(readOnly = true)
    public Optional<QuizBuilderDTO> getQuizForBuilder(Long quizId) {
        LOG.debug("Request to get quiz for builder: {}", quizId);

        return quizRepository.findOneWithEagerRelationships(quizId)
                .map(this::convertToQuizBuilderDTO);
    }

    /**
     * Get all quizzes for admin/teacher management.
     */
    @Transactional(readOnly = true)
    public Page<QuizManagementDTO> getAllQuizzesForManagement(Pageable pageable) {
        LOG.debug("Request to get all quizzes for management");

        return quizRepository.findAllWithEagerRelationships(pageable)
                .map(this::convertToQuizManagementDTO);
    }

    /**
     * Get quizzes by teacher (for teacher role).
     */
    @Transactional(readOnly = true)
    public Page<QuizManagementDTO> getQuizzesByTeacher(Long teacherId, Pageable pageable) {
        LOG.debug("Request to get quizzes by teacher: {}", teacherId);

        // Find quizzes associated with courses taught by this teacher
        return quizRepository.findByTeacherId(teacherId, pageable)
                .map(this::convertToQuizManagementDTO);
    }

    /**
     * Reorder questions in a quiz.
     */
    @Transactional
    public QuizBuilderDTO reorderQuestions(Long quizId, List<QuestionOrderDTO> questionOrders) {
        LOG.debug("Request to reorder questions in quiz: {}", quizId);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new BadRequestAlertException("Quiz not found", "quiz", "notfound"));

        // Update positions
        for (QuestionOrderDTO orderDTO : questionOrders) {
            QuizQuestion quizQuestion = quizQuestionRepository
                    .findByQuizIdAndQuestionId(quizId, orderDTO.getQuestionId())
                    .orElseThrow(
                            () -> new BadRequestAlertException("Quiz question not found", "quizQuestion", "notfound"));

            quizQuestion.setPosition(orderDTO.getPosition());
            quizQuestionRepository.save(quizQuestion);
        }

        return convertToQuizBuilderDTO(quiz);
    }

    /**
     * Get available questions for quiz builder (question bank).
     */
    @Transactional(readOnly = true)
    public Page<QuestionDTO> getAvailableQuestions(Pageable pageable, String searchTerm, String questionType) {
        LOG.debug("Request to get available questions with search: {} and type: {}", searchTerm, questionType);

        if (searchTerm != null && !searchTerm.trim().isEmpty() && questionType != null
                && !questionType.trim().isEmpty()) {
            return questionRepository.findByContentContainingIgnoreCaseAndType(searchTerm, questionType, pageable)
                    .map(questionMapper::toDto);
        } else if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            return questionRepository.findByContentContainingIgnoreCase(searchTerm, pageable)
                    .map(questionMapper::toDto);
        } else if (questionType != null && !questionType.trim().isEmpty()) {
            return questionRepository.findByType(questionType, pageable)
                    .map(questionMapper::toDto);
        } else {
            return questionRepository.findAll(pageable)
                    .map(questionMapper::toDto);
        }
    }

    /**
     * Get quiz settings for configuration.
     */
    @Transactional(readOnly = true)
    public QuizSettingsDTO getQuizSettings(Long quizId) {
        LOG.debug("Request to get quiz settings: {}", quizId);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new BadRequestAlertException("Quiz not found", "quiz", "notfound"));

        QuizSettingsDTO settings = new QuizSettingsDTO();
        settings.setQuizId(quiz.getId());
        settings.setTimeLimitMinutes(quiz.getTimeLimitMinutes());
        settings.setIsActive(quiz.getIsActive());
        settings.setActivationTime(quiz.getActivationTime());
        settings.setDeactivationTime(quiz.getDeactivationTime());
        settings.setMaxAttempts(3); // Default value, could be added to entity later
        settings.setShowResultsImmediately(true); // Default value
        settings.setRandomizeQuestions(false); // Default value
        settings.setRandomizeAnswers(false); // Default value

        return settings;
    }

    /**
     * Update quiz settings.
     */
    @Transactional
    public QuizSettingsDTO updateQuizSettings(Long quizId, QuizSettingsDTO settingsDTO) {
        LOG.debug("Request to update quiz settings: {}", quizId);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new BadRequestAlertException("Quiz not found", "quiz", "notfound"));

        quiz.setTimeLimitMinutes(settingsDTO.getTimeLimitMinutes());
        quiz.setIsActive(settingsDTO.getIsActive());
        quiz.setActivationTime(settingsDTO.getActivationTime());
        quiz.setDeactivationTime(settingsDTO.getDeactivationTime());

        quiz = quizRepository.save(quiz);

        return getQuizSettings(quiz.getId());
    }

    // Private helper methods

    private void addQuestionsToQuiz(Quiz quiz, List<QuizQuestionBuilderDTO> questions) {
        for (int i = 0; i < questions.size(); i++) {
            QuizQuestionBuilderDTO questionDTO = questions.get(i);

            Question question;
            if (questionDTO.getQuestionId() != null) {
                // Use existing question
                question = questionRepository.findById(questionDTO.getQuestionId())
                        .orElseThrow(() -> new BadRequestAlertException("Question not found", "question", "notfound"));
            } else {
                // Create new question
                question = new Question();
                question.setContent(questionDTO.getContent());
                question.setType(questionDTO.getType());
                question.setCorrectAnswer(questionDTO.getCorrectAnswer());
                question.setImageUrl(questionDTO.getImageUrl());
                question.setSuggestion(questionDTO.getSuggestion());
                question.setAnswerExplanation(questionDTO.getAnswerExplanation());
                question = questionRepository.save(question);
            }

            // Create quiz-question relationship
            QuizQuestion quizQuestion = new QuizQuestion();
            quizQuestion.setQuiz(quiz);
            quizQuestion.setQuestion(question);
            quizQuestion.setPosition(i + 1); // 1-based positioning
            quizQuestionRepository.save(quizQuestion);
        }
    }

    private QuizBuilderDTO convertToQuizBuilderDTO(Quiz quiz) {
        QuizBuilderDTO dto = new QuizBuilderDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setIsTest(quiz.getIsTest());
        dto.setIsPractice(quiz.getIsPractice());
        dto.setQuizType(quiz.getQuizType());
        dto.setTimeLimitMinutes(quiz.getTimeLimitMinutes());

        // Get questions in order
        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizIdOrderByPosition(quiz.getId());
        List<QuizQuestionBuilderDTO> questionDTOs = quizQuestions.stream()
                .map(this::convertToQuizQuestionBuilderDTO)
                .collect(Collectors.toList());
        dto.setQuestions(questionDTOs);

        // Set course and lesson IDs
        dto.setCourseIds(quiz.getCourses().stream().map(Course::getId).collect(Collectors.toList()));
        dto.setLessonIds(quiz.getLessons().stream().map(Lesson::getId).collect(Collectors.toList()));

        return dto;
    }

    private QuizQuestionBuilderDTO convertToQuizQuestionBuilderDTO(QuizQuestion quizQuestion) {
        QuizQuestionBuilderDTO dto = new QuizQuestionBuilderDTO();
        dto.setQuestionId(quizQuestion.getQuestion().getId());
        dto.setPosition(quizQuestion.getPosition());
        dto.setContent(quizQuestion.getQuestion().getContent());
        dto.setType(quizQuestion.getQuestion().getType());
        dto.setCorrectAnswer(quizQuestion.getQuestion().getCorrectAnswer());
        dto.setImageUrl(quizQuestion.getQuestion().getImageUrl());
        dto.setSuggestion(quizQuestion.getQuestion().getSuggestion());
        dto.setAnswerExplanation(quizQuestion.getQuestion().getAnswerExplanation());
        return dto;
    }

    private QuizManagementDTO convertToQuizManagementDTO(Quiz quiz) {
        QuizManagementDTO dto = new QuizManagementDTO();
        dto.setId(quiz.getId());
        dto.setTitle(quiz.getTitle());
        dto.setDescription(quiz.getDescription());
        dto.setQuizType(quiz.getQuizType());
        dto.setIsTest(quiz.getIsTest());
        dto.setIsPractice(quiz.getIsPractice());
        dto.setIsActive(quiz.getIsActive());
        dto.setTimeLimitMinutes(quiz.getTimeLimitMinutes());
        dto.setActivationTime(quiz.getActivationTime());
        dto.setDeactivationTime(quiz.getDeactivationTime());

        // Count questions
        Long questionCount = quizQuestionRepository.countByQuizId(quiz.getId());
        dto.setQuestionCount(questionCount.intValue());

        // Set associated courses and lessons
        dto.setCourseNames(quiz.getCourses().stream().map(Course::getTitle).collect(Collectors.toList()));
        dto.setLessonNames(quiz.getLessons().stream().map(Lesson::getTitle).collect(Collectors.toList()));

        return dto;
    }
}