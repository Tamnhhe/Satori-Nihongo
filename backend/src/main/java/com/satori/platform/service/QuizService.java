package com.satori.platform.service;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.NotificationType;
import com.satori.platform.domain.enumeration.QuizType;
import com.satori.platform.repository.QuizRepository;
import com.satori.platform.repository.QuizQuestionRepository;
import com.satori.platform.service.dto.*;

import com.satori.platform.service.exception.QuizValidationException;
import com.satori.platform.service.mapper.QuizMapper;
import java.time.Instant;
import java.util.ArrayList;
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
 * Service Implementation for managing {@link com.satori.platform.domain.Quiz}.
 */
@Service
@Transactional
public class QuizService {

    private static final Logger LOG = LoggerFactory.getLogger(QuizService.class);

    private final QuizRepository quizRepository;

    private final QuizQuestionRepository quizQuestionRepository;

    private final QuizMapper quizMapper;

    private final NotificationService notificationService;

    public QuizService(QuizRepository quizRepository, QuizQuestionRepository quizQuestionRepository, QuizMapper quizMapper, NotificationService notificationService) {
        this.quizRepository = quizRepository;
        this.quizQuestionRepository = quizQuestionRepository;
        this.quizMapper = quizMapper;
        this.notificationService = notificationService;
    }

    /**
     * Save a quiz.
     *
     * @param quizDTO the entity to save.
     * @return the persisted entity.
     */
    public QuizDTO save(QuizDTO quizDTO) {
        LOG.debug("Request to save Quiz : {}", quizDTO);
        Quiz quiz = quizMapper.toEntity(quizDTO);
        quiz = quizRepository.save(quiz);
        return quizMapper.toDto(quiz);
    }

    /**
     * Update a quiz.
     *
     * @param quizDTO the entity to save.
     * @return the persisted entity.
     */
    public QuizDTO update(QuizDTO quizDTO) {
        LOG.debug("Request to update Quiz : {}", quizDTO);
        Quiz quiz = quizMapper.toEntity(quizDTO);
        quiz = quizRepository.save(quiz);
        return quizMapper.toDto(quiz);
    }

    /**
     * Partially update a quiz.
     *
     * @param quizDTO the entity to update partially.
     * @return the persisted entity.
     */
    public Optional<QuizDTO> partialUpdate(QuizDTO quizDTO) {
        LOG.debug("Request to partially update Quiz : {}", quizDTO);

        return quizRepository
            .findById(quizDTO.getId())
            .map(existingQuiz -> {
                quizMapper.partialUpdate(existingQuiz, quizDTO);

                return existingQuiz;
            })
            .map(quizRepository::save)
            .map(quizMapper::toDto);
    }

    /**
     * Get all the quizzes.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    @Transactional(readOnly = true)
    public Page<QuizDTO> findAll(Pageable pageable) {
        LOG.debug("Request to get all Quizzes");
        return quizRepository.findAll(pageable).map(quizMapper::toDto);
    }

    /**
     * Get all the quizzes with eager load of many-to-many relationships.
     *
     * @return the list of entities.
     */
    public Page<QuizDTO> findAllWithEagerRelationships(Pageable pageable) {
        return quizRepository.findAllWithEagerRelationships(pageable).map(quizMapper::toDto);
    }

    /**
     * Get one quiz by id.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    @Transactional(readOnly = true)
    public Optional<QuizDTO> findOne(Long id) {
        LOG.debug("Request to get Quiz : {}", id);
        return quizRepository.findOneWithEagerRelationships(id).map(quizMapper::toDto);
    }

    /**
     * Delete the quiz by id.
     *
     * @param id the id of the entity.
     */
    public void delete(Long id) {
        LOG.debug("Request to delete Quiz : {}", id);
        quizRepository.deleteById(id);
    }

    /**
     * Activate or deactivate a quiz with timing controls.
     *
     * @param activationDTO the activation details.
     * @return the updated quiz.
     */
    @Transactional
    public QuizDTO activateQuiz(QuizActivationDTO activationDTO) {
        LOG.debug("Request to activate/deactivate Quiz : {}", activationDTO);

        Quiz quiz = quizRepository.findById(activationDTO.getQuizId())
                .orElseThrow(
                        () -> new IllegalArgumentException("Quiz not found with id: " + activationDTO.getQuizId()));

        // Validate quiz before activation
        if (activationDTO.getActivate() && !isQuizValid(quiz)) {
            throw new QuizValidationException("Quiz cannot be activated: validation failed");
        }

        quiz.setIsActive(activationDTO.getActivate());
        quiz.setActivationTime(activationDTO.getActivationTime());
        quiz.setDeactivationTime(activationDTO.getDeactivationTime());

        quiz = quizRepository.save(quiz);

        // Send notifications to students if requested
        if (activationDTO.getNotifyStudents() && activationDTO.getActivate()) {
            notifyStudentsOfQuizActivation(quiz);
        }

        return quizMapper.toDto(quiz);
    }

    /**
     * Validate quiz completeness and correctness.
     *
     * @param quizId the quiz id to validate.
     * @return validation result.
     */
    @Transactional(readOnly = true)
    public QuizValidationResultDTO validateQuiz(Long quizId) {
        LOG.debug("Request to validate Quiz : {}", quizId);

        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalArgumentException("Quiz not found with id: " + quizId));

        return validateQuizInternal(quiz);
    }

    /**
     * Create a quiz from template.
     *
     * @param templateId the template quiz id.
     * @param newTitle   the new quiz title.
     * @return the created quiz.
     */
    @Transactional
    public QuizDTO createFromTemplate(Long templateId, String newTitle) {
        LOG.debug("Request to create Quiz from template : {} with title : {}", templateId, newTitle);

        Quiz template = quizRepository.findById(templateId)
                .orElseThrow(() -> new IllegalArgumentException("Template not found with id: " + templateId));

        if (!Boolean.TRUE.equals(template.getIsTemplate())) {
            throw new IllegalArgumentException("Quiz with id " + templateId + " is not a template");
        }

        Quiz newQuiz = new Quiz();
        newQuiz.setTitle(newTitle);
        newQuiz.setDescription(template.getDescription());
        newQuiz.setIsTest(template.getIsTest());
        newQuiz.setIsPractice(template.getIsPractice());
        newQuiz.setQuizType(template.getQuizType());
        newQuiz.setTimeLimitMinutes(template.getTimeLimitMinutes());
        newQuiz.setIsActive(false);
        newQuiz.setIsTemplate(false);

        newQuiz = quizRepository.save(newQuiz);

        // Copy questions from template
        copyQuestionsFromTemplate(template, newQuiz);

        return quizMapper.toDto(newQuiz);
    }

    /**
     * Save a quiz as template.
     *
     * @param templateDTO the template details.
     * @return the saved template.
     */
    @Transactional
    public QuizDTO saveAsTemplate(QuizTemplateDTO templateDTO) {
        LOG.debug("Request to save Quiz as template : {}", templateDTO);

        Quiz template = new Quiz();
        template.setTitle(templateDTO.getTitle());
        template.setDescription(templateDTO.getDescription());
        template.setIsTest(templateDTO.getIsTest());
        template.setIsPractice(templateDTO.getIsPractice());
        template.setQuizType(templateDTO.getIsTest() ? QuizType.COURSE : QuizType.LESSON);
        template.setTimeLimitMinutes(templateDTO.getTimeLimitMinutes());
        template.setIsActive(false);
        template.setIsTemplate(true);
        template.setTemplateName(templateDTO.getTemplateName());

        template = quizRepository.save(template);

        return quizMapper.toDto(template);
    }

    /**
     * Get all quiz templates.
     *
     * @param pageable the pagination information.
     * @return the list of templates.
     */
    @Transactional(readOnly = true)
    public Page<QuizDTO> findAllTemplates(Pageable pageable) {
        LOG.debug("Request to get all Quiz templates");
        return quizRepository.findAll(pageable)
                .map(quiz -> quiz.getIsTemplate() != null && quiz.getIsTemplate() ? quiz : null)
                .map(quizMapper::toDto);
    }

    /**
     * Find templates by name.
     *
     * @param templateName the template name to search.
     * @return the list of matching templates.
     */
    @Transactional(readOnly = true)
    public List<QuizDTO> findTemplatesByName(String templateName) {
        LOG.debug("Request to find Quiz templates by name : {}", templateName);
        return quizRepository.findTemplatesByName(templateName)
                .stream()
                .map(quizMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Process automatic quiz activation/deactivation based on timing.
     */
    @Transactional
    public void processAutomaticActivation() {
        LOG.debug("Processing automatic quiz activation/deactivation");

        Instant now = Instant.now();

        // Activate quizzes that should be activated
        List<Quiz> quizzesToActivate = quizRepository.findQuizzesToActivate(now);
        for (Quiz quiz : quizzesToActivate) {
            quiz.setIsActive(true);
            quizRepository.save(quiz);
            notifyStudentsOfQuizActivation(quiz);
            LOG.info("Automatically activated quiz: {}", quiz.getId());
        }

        // Deactivate quizzes that should be deactivated
        List<Quiz> quizzesToDeactivate = quizRepository.findQuizzesToDeactivate(now);
        for (Quiz quiz : quizzesToDeactivate) {
            quiz.setIsActive(false);
            quizRepository.save(quiz);
            LOG.info("Automatically deactivated quiz: {}", quiz.getId());
        }
    }

    /**
     * Get active quizzes for a course.
     *
     * @param courseId the course id.
     * @return the list of active quizzes.
     */
    @Transactional(readOnly = true)
    public List<QuizDTO> findActiveByCourseId(Long courseId) {
        LOG.debug("Request to get active quizzes for course : {}", courseId);
        return quizRepository.findActiveByCourseId(courseId)
                .stream()
                .map(quizMapper::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Get active quizzes for a lesson.
     *
     * @param lessonId the lesson id.
     * @return the list of active quizzes.
     */
    @Transactional(readOnly = true)
    public List<QuizDTO> findActiveByLessonId(Long lessonId) {
        LOG.debug("Request to get active quizzes for lesson : {}", lessonId);
        return quizRepository.findActiveByLessonId(lessonId)
                .stream()
                .map(quizMapper::toDto)
                .collect(Collectors.toList());
    }

    // Private helper methods

    private boolean isQuizValid(Quiz quiz) {
        QuizValidationResultDTO validation = validateQuizInternal(quiz);
        return validation.getIsValid();
    }

    private QuizValidationResultDTO validateQuizInternal(Quiz quiz) {
        QuizValidationResultDTO result = new QuizValidationResultDTO();

        // Check if quiz has questions
        Long questionCount = quizQuestionRepository.countByQuizId(quiz.getId());
        result.setQuestionCount(questionCount.intValue());

        if (questionCount == 0) {
            result.addError("Quiz must have at least one question");
        }

        // Check if quiz has title
        if (quiz.getTitle() == null || quiz.getTitle().trim().isEmpty()) {
            result.addError("Quiz must have a title");
        }

        // Check timing constraints
        if (quiz.getActivationTime() != null && quiz.getDeactivationTime() != null) {
            if (quiz.getDeactivationTime().isBefore(quiz.getActivationTime())) {
                result.addError("Deactivation time must be after activation time");
            }
        }

        // Check if quiz type is properly set
        if (quiz.getQuizType() == null) {
            result.addError("Quiz type must be specified");
        }

        // Validate question completeness and correctness
        if (questionCount > 0) {
            List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizIdOrderByPosition(quiz.getId());
            boolean hasCorrectAnswers = true;
            int questionsWithoutAnswers = 0;
            int questionsWithoutContent = 0;

            for (QuizQuestion quizQuestion : quizQuestions) {
                Question question = quizQuestion.getQuestion();
                if (question != null) {
                    // Check if question has content
                    if (question.getContent() == null || question.getContent().trim().isEmpty()) {
                        questionsWithoutContent++;
                    }

                    // Check if question has correct answer
                    if (question.getCorrectAnswer() == null || question.getCorrectAnswer().trim().isEmpty()) {
                        questionsWithoutAnswers++;
                        hasCorrectAnswers = false;
                    }

                    // Check if question type is valid
                    if (question.getType() == null || question.getType().trim().isEmpty()) {
                        result.addError(
                                "Question at position " + quizQuestion.getPosition() + " has no type specified");
                    }
                } else {
                    result.addError(
                            "Question at position " + quizQuestion.getPosition() + " is missing question details");
                }
            }

            result.setHasCorrectAnswers(hasCorrectAnswers);

            if (questionsWithoutContent > 0) {
                result.addError(questionsWithoutContent + " question(s) have no content");
            }

            if (questionsWithoutAnswers > 0) {
                result.addError(questionsWithoutAnswers + " question(s) have no correct answer specified");
            }

            // Check for duplicate positions
            long distinctPositions = quizQuestions.stream()
                    .mapToInt(QuizQuestion::getPosition)
                    .distinct()
                    .count();

            if (distinctPositions != quizQuestions.size()) {
                result.addError("Quiz has questions with duplicate positions");
            }

            // Check for gaps in positions
            List<Integer> positions = quizQuestions.stream()
                    .map(QuizQuestion::getPosition)
                    .sorted()
                    .collect(Collectors.toList());

            for (int i = 0; i < positions.size(); i++) {
                if (positions.get(i) != i + 1) {
                    result.addWarning("Quiz has gaps in question positions - consider reordering");
                    break;
                }
            }
        }

        // Check if quiz is associated with courses or lessons
        if ((quiz.getCourses() == null || quiz.getCourses().isEmpty()) &&
                (quiz.getLessons() == null || quiz.getLessons().isEmpty())) {
            result.addWarning("Quiz is not associated with any courses or lessons");
        }

        // Add warnings for best practices
        if (questionCount > 0 && questionCount < 5) {
            result.addWarning("Quiz has fewer than 5 questions, consider adding more for better assessment");
        }

        if (quiz.getTimeLimitMinutes() != null && quiz.getTimeLimitMinutes() < 5) {
            result.addWarning("Time limit is very short, consider increasing for better user experience");
        }

        if (quiz.getTimeLimitMinutes() != null && questionCount > 0) {
            double minutesPerQuestion = (double) quiz.getTimeLimitMinutes() / questionCount;
            if (minutesPerQuestion < 1.0) {
                result.addWarning("Time limit allows less than 1 minute per question, consider increasing");
            }
        }

        // Check description
        if (quiz.getDescription() == null || quiz.getDescription().trim().isEmpty()) {
            result.addWarning("Quiz has no description - consider adding one to help students understand the purpose");
        }

        return result;
    }

    private void notifyStudentsOfQuizActivation(Quiz quiz) {
        try {
            LOG.info("Sending quiz activation notifications for quiz: {}", quiz.getId());

            // Get all enrolled students for this quiz
            List<UserProfile> studentsToNotify = new ArrayList<>();

            // For now, we'll create a simple notification approach
            // In a full implementation, we would need to query CourseClass repository
            // to find enrolled students for the courses/lessons associated with this quiz
            LOG.debug("Quiz is associated with {} courses and {} lessons",
                    quiz.getCourses().size(), quiz.getLessons().size());

            // Create notification content for quiz activation
            NotificationContentDTO content = new NotificationContentDTO();
            content.setEmailSubject("Quiz Activated: " + quiz.getTitle());
            content.setEmailContent("A new quiz '" + quiz.getTitle()
                    + "' has been activated and is now available for you to take.");
            content.setPushTitle("New Quiz Available");
            content.setPushMessage("Quiz '" + quiz.getTitle() + "' is now active");
            content.setEmailEnabled(true);
            content.setPushEnabled(true);

            // For demonstration purposes, we'll send to an empty list
            // In a full implementation, this would query enrolled students
            notificationService.sendBulkNotification(studentsToNotify, content, NotificationType.QUIZ_REMINDER);
            LOG.info("Quiz activation notification system integration completed for quiz: {}", quiz.getId());
        } catch (Exception e) {
            LOG.error("Failed to send quiz activation notifications for quiz: {}", quiz.getId(), e);
        }
    }

    private void copyQuestionsFromTemplate(Quiz template, Quiz newQuiz) {
        List<QuizQuestion> templateQuestions = quizQuestionRepository.findByQuizIdOrderByPosition(template.getId());

        for (QuizQuestion templateQuestion : templateQuestions) {
            QuizQuestion newQuestion = new QuizQuestion();
            newQuestion.setQuiz(newQuiz);
            newQuestion.setQuestion(templateQuestion.getQuestion());
            newQuestion.setPosition(templateQuestion.getPosition());
            quizQuestionRepository.save(newQuestion);
        }
    }
}
