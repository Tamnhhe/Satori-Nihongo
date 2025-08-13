package com.satori.platform.validation;

import com.satori.platform.OnlineSatoriPlatformApp;
import com.satori.platform.domain.Quiz;
import com.satori.platform.domain.Question;
import com.satori.platform.domain.QuizQuestion;
import com.satori.platform.domain.StudentQuiz;
import com.satori.platform.domain.Course;
import com.satori.platform.domain.User;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.service.EnhancedQuizService;
import com.satori.platform.service.QuizAnalyticsService;
import com.satori.platform.service.QuizAssignmentService;
import com.satori.platform.service.StudentQuizService;
import com.satori.platform.service.QuestionService;
import com.satori.platform.service.QuizQuestionService;
import com.satori.platform.service.dto.QuizBuilderDTO;
import com.satori.platform.service.dto.QuizAnalyticsDTO;
import com.satori.platform.service.dto.QuizAssignmentDTO;
import com.satori.platform.service.dto.QuestionDTO;
import com.satori.platform.service.dto.StudentQuizDTO;
import com.satori.platform.service.mapper.QuizMapper;
import com.satori.platform.service.mapper.QuestionMapper;
import com.satori.platform.service.mapper.StudentQuizMapper;
import com.satori.platform.repository.QuizRepository;
import com.satori.platform.repository.QuestionRepository;
import com.satori.platform.repository.QuizQuestionRepository;
import com.satori.platform.repository.StudentQuizRepository;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.repository.StudentProfileRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.Arrays;

import static org.assertj.core.api.Assertions.*;

/**
 * Comprehensive validation tests for Quiz and Assessment Services.
 * 
 * Tests Requirements:
 * - 4.1: Service methods correctly process data and handle business logic
 * - 4.2: DTOs are correctly mapped from entities
 * - 4.5: Service validation passes confirming all business logic operates
 * correctly
 */
@SpringBootTest(classes = OnlineSatoriPlatformApp.class)
@ActiveProfiles("test")
@Transactional
public class QuizAndAssessmentServiceValidationTest {

    @Autowired
    private EnhancedQuizService enhancedQuizService;

    @Autowired
    private QuizAnalyticsService quizAnalyticsService;

    @Autowired
    private QuizAssignmentService quizAssignmentService;

    @Autowired
    private StudentQuizService studentQuizService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private QuizQuestionService quizQuestionService;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private StudentQuizRepository studentQuizRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private QuizMapper quizMapper;

    @Autowired
    private QuestionMapper questionMapper;

    @Autowired
    private StudentQuizMapper studentQuizMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private Quiz testQuiz;
    private Question testQuestion;
    private QuizQuestion testQuizQuestion;
    private StudentQuiz testStudentQuiz;
    private Course testCourse;
    private User testStudent;
    private UserProfile testStudentProfile;
    private StudentProfile testStudentProfileEntity;

    @BeforeEach
    void setUp() {
        // Create test student user
        testStudent = new User();
        testStudent.setLogin("student");
        testStudent.setEmail("student@example.com");
        testStudent.setFirstName("Test");
        testStudent.setLastName("Student");
        testStudent.setPassword(passwordEncoder.encode("password"));
        testStudent.setActivated(true);
        testStudent.setLangKey("en");
        testStudent.setCreatedBy("system");
        testStudent.setCreatedDate(Instant.now());
        testStudent = userRepository.save(testStudent);

        // Create test student profile
        testStudentProfile = new UserProfile();
        testStudentProfile.setUser(testStudent);
        testStudentProfile.setPhoneNumber("1234567890");
        testStudentProfile.setDateOfBirth(LocalDateTime.now().minusYears(20));
        testStudentProfile.setGender("MALE");
        testStudentProfile.setAddress("Student Address");
        testStudentProfile.setCity("Student City");
        testStudentProfile.setCountry("Student Country");
        testStudentProfile.setOccupation("Student");
        testStudentProfile = userProfileRepository.save(testStudentProfile);

        // Create test student profile entity
        testStudentProfileEntity = new StudentProfile();
        testStudentProfileEntity.setUserProfile(testStudentProfile);
        testStudentProfileEntity.setStudentId("STU001");
        testStudentProfileEntity.setEnrollmentDate(LocalDateTime.now());
        testStudentProfileEntity.setCurrentLevel("BEGINNER");
        testStudentProfileEntity.setLearningGoals("Learn Japanese basics");
        testStudentProfileEntity.setPreferredLearningStyle("VISUAL");
        testStudentProfileEntity = studentProfileRepository.save(testStudentProfileEntity);

        // Create test course
        testCourse = new Course();
        testCourse.setTitle("Test Japanese Course");
        testCourse.setDescription("A comprehensive Japanese language course");
        testCourse.setLevel("BEGINNER");
        testCourse.setDuration(120);
        testCourse.setPrice(299.99);
        testCourse.setActive(true);
        testCourse.setCreatedDate(LocalDateTime.now());
        testCourse.setUpdatedDate(LocalDateTime.now());
        testCourse = courseRepository.save(testCourse);

        // Create test quiz with new schema fields
        testQuiz = new Quiz();
        testQuiz.setTitle("Hiragana Quiz");
        testQuiz.setDescription("Test your knowledge of Hiragana characters");
        testQuiz.setCourse(testCourse);
        testQuiz.setQuestionCount(5);
        testQuiz.setTimeLimit(30);
        testQuiz.setPassingScore(70);
        testQuiz.setActive(true);
        testQuiz.setCreatedDate(LocalDateTime.now());
        testQuiz.setUpdatedDate(LocalDateTime.now());

        // Set new schema fields
        testQuiz.setIsActive(true);
        testQuiz.setActivationTime(LocalDateTime.now());
        testQuiz.setDeactivationTime(LocalDateTime.now().plusDays(30));
        testQuiz.setTimeLimitMinutes(30);
        testQuiz.setIsTemplate(false);
        testQuiz.setTemplateName(null);

        testQuiz = quizRepository.save(testQuiz);

        // Create test question
        testQuestion = new Question();
        testQuestion.setQuestionText("What is the Hiragana character for 'a'?");
        testQuestion.setQuestionType("MULTIPLE_CHOICE");
        testQuestion.setOptions(Arrays.asList("あ", "い", "う", "え"));
        testQuestion.setCorrectAnswer("あ");
        testQuestion.setPoints(10);
        testQuestion.setDifficulty("EASY");
        testQuestion.setExplanation("The Hiragana character for 'a' is あ");
        testQuestion.setActive(true);
        testQuestion = questionRepository.save(testQuestion);

        // Create test quiz question relationship
        testQuizQuestion = new QuizQuestion();
        testQuizQuestion.setQuiz(testQuiz);
        testQuizQuestion.setQuestion(testQuestion);
        testQuizQuestion.setOrderIndex(1);
        testQuizQuestion = quizQuestionRepository.save(testQuizQuestion);

        // Create test student quiz attempt
        testStudentQuiz = new StudentQuiz();
        testStudentQuiz.setQuiz(testQuiz);
        testStudentQuiz.setStudent(testStudentProfileEntity);
        testStudentQuiz.setStartTime(LocalDateTime.now().minusMinutes(10));
        testStudentQuiz.setEndTime(LocalDateTime.now().minusMinutes(5));
        testStudentQuiz.setScore(80);
        testStudentQuiz.setMaxScore(100);
        testStudentQuiz.setPassed(true);
        testStudentQuiz.setCompleted(true);
        testStudentQuiz = studentQuizRepository.save(testStudentQuiz);
    }

    @Test
    @DisplayName("Validate EnhancedQuizService operations")
    void testEnhancedQuizServiceOperations() {
        // Test quiz creation with enhanced features
        QuizBuilderDTO quizDTO = new QuizBuilderDTO();
        quizDTO.setTitle("Advanced Kanji Quiz");
        quizDTO.setDescription("Test your knowledge of advanced Kanji characters");
        quizDTO.setCourseId(testCourse.getId());
        quizDTO.setQuestionCount(10);
        quizDTO.setTimeLimit(45);
        quizDTO.setPassingScore(75);
        quizDTO.setActive(true);
        quizDTO.setIsTemplate(false);
        quizDTO.setTimeLimitMinutes(45);
        quizDTO.setActivationTime(LocalDateTime.now());
        quizDTO.setDeactivationTime(LocalDateTime.now().plusDays(60));

        QuizBuilderDTO createdQuiz = enhancedQuizService.createEnhancedQuiz(quizDTO);
        assertThat(createdQuiz).isNotNull();
        assertThat(createdQuiz.getTitle()).isEqualTo("Advanced Kanji Quiz");
        assertThat(createdQuiz.getTimeLimitMinutes()).isEqualTo(45);
        assertThat(createdQuiz.getPassingScore()).isEqualTo(75);

        // Test quiz update with new features
        createdQuiz.setDescription("Updated advanced Kanji quiz description");
        createdQuiz.setTimeLimitMinutes(60);
        QuizBuilderDTO updatedQuiz = enhancedQuizService.updateEnhancedQuiz(createdQuiz);
        assertThat(updatedQuiz.getDescription()).contains("Updated advanced Kanji");
        assertThat(updatedQuiz.getTimeLimitMinutes()).isEqualTo(60);

        // Test quiz retrieval with enhanced data
        Optional<QuizBuilderDTO> retrievedQuiz = enhancedQuizService.findEnhancedQuiz(createdQuiz.getId());
        assertThat(retrievedQuiz).isPresent();
        assertThat(retrievedQuiz.get().getTitle()).isEqualTo("Advanced Kanji Quiz");

        // Test quiz template functionality
        QuizBuilderDTO templateQuiz = new QuizBuilderDTO();
        templateQuiz.setTitle("Japanese Grammar Template");
        templateQuiz.setDescription("Template for Japanese grammar quizzes");
        templateQuiz.setCourseId(testCourse.getId());
        templateQuiz.setIsTemplate(true);
        templateQuiz.setTemplateName("Grammar Template");
        templateQuiz.setQuestionCount(15);
        templateQuiz.setTimeLimit(30);
        templateQuiz.setPassingScore(70);

        QuizBuilderDTO createdTemplate = enhancedQuizService.createEnhancedQuiz(templateQuiz);
        assertThat(createdTemplate.getIsTemplate()).isTrue();
        assertThat(createdTemplate.getTemplateName()).isEqualTo("Grammar Template");
    }

    @Test
    @DisplayName("Validate QuizAnalyticsService operations")
    void testQuizAnalyticsServiceOperations() {
        // Test quiz performance analytics
        QuizAnalyticsDTO analytics = quizAnalyticsService.getQuizAnalytics(testQuiz.getId());
        assertThat(analytics).isNotNull();
        assertThat(analytics.getQuizId()).isEqualTo(testQuiz.getId());
        assertThat(analytics.getTotalAttempts()).isGreaterThanOrEqualTo(1);

        // Test student performance analytics
        QuizAnalyticsDTO studentAnalytics = quizAnalyticsService.getStudentQuizAnalytics(
                testStudentProfileEntity.getId(), testQuiz.getId());
        assertThat(studentAnalytics).isNotNull();
        assertThat(studentAnalytics.getStudentId()).isEqualTo(testStudentProfileEntity.getId());

        // Test course quiz analytics
        List<QuizAnalyticsDTO> courseAnalytics = quizAnalyticsService.getCourseQuizAnalytics(testCourse.getId());
        assertThat(courseAnalytics).isNotEmpty();
        assertThat(courseAnalytics.size()).isGreaterThanOrEqualTo(1);

        // Test quiz difficulty analysis
        QuizAnalyticsDTO difficultyAnalysis = quizAnalyticsService.getQuizDifficultyAnalysis(testQuiz.getId());
        assertThat(difficultyAnalysis).isNotNull();
        assertThat(difficultyAnalysis.getAverageScore()).isGreaterThan(0);

        // Test quiz completion rates
        QuizAnalyticsDTO completionRates = quizAnalyticsService.getQuizCompletionRates(testQuiz.getId());
        assertThat(completionRates).isNotNull();
        assertThat(completionRates.getCompletionRate()).isGreaterThanOrEqualTo(0);
    }

    @Test
    @DisplayName("Validate QuizAssignmentService operations")
    void testQuizAssignmentServiceOperations() {
        // Test quiz assignment creation
        QuizAssignmentDTO assignmentDTO = new QuizAssignmentDTO();
        assignmentDTO.setQuizId(testQuiz.getId());
        assignmentDTO.setStudentId(testStudentProfileEntity.getId());
        assignmentDTO.setAssignedDate(LocalDateTime.now());
        assignmentDTO.setDueDate(LocalDateTime.now().plusDays(7));
        assignmentDTO.setMaxAttempts(3);
        assignmentDTO.setActive(true);

        QuizAssignmentDTO createdAssignment = quizAssignmentService.createAssignment(assignmentDTO);
        assertThat(createdAssignment).isNotNull();
        assertThat(createdAssignment.getQuizId()).isEqualTo(testQuiz.getId());
        assertThat(createdAssignment.getStudentId()).isEqualTo(testStudentProfileEntity.getId());
        assertThat(createdAssignment.getMaxAttempts()).isEqualTo(3);

        // Test assignment update
        createdAssignment.setMaxAttempts(5);
        createdAssignment.setDueDate(LocalDateTime.now().plusDays(14));
        QuizAssignmentDTO updatedAssignment = quizAssignmentService.updateAssignment(createdAssignment);
        assertThat(updatedAssignment.getMaxAttempts()).isEqualTo(5);
        assertThat(updatedAssignment.getDueDate()).isAfter(LocalDateTime.now().plusDays(10));

        // Test assignment retrieval
        Optional<QuizAssignmentDTO> retrievedAssignment = quizAssignmentService
                .findAssignment(createdAssignment.getId());
        assertThat(retrievedAssignment).isPresent();
        assertThat(retrievedAssignment.get().getMaxAttempts()).isEqualTo(5);

        // Test assignments by student
        List<QuizAssignmentDTO> studentAssignments = quizAssignmentService
                .findAssignmentsByStudent(testStudentProfileEntity.getId());
        assertThat(studentAssignments).isNotEmpty();

        // Test assignments by quiz
        List<QuizAssignmentDTO> quizAssignments = quizAssignmentService.findAssignmentsByQuiz(testQuiz.getId());
        assertThat(quizAssignments).isNotEmpty();
    }

    @Test
    @DisplayName("Validate StudentQuizService operations")
    void testStudentQuizServiceOperations() {
        // Test student quiz attempt creation
        StudentQuizDTO attemptDTO = studentQuizMapper.toDto(testStudentQuiz);
        attemptDTO.setId(null); // Create new attempt
        attemptDTO.setStartTime(LocalDateTime.now());
        attemptDTO.setEndTime(null); // In progress
        attemptDTO.setScore(0);
        attemptDTO.setCompleted(false);

        StudentQuizDTO createdAttempt = studentQuizService.startQuizAttempt(attemptDTO);
        assertThat(createdAttempt).isNotNull();
        assertThat(createdAttempt.getStartTime()).isNotNull();
        assertThat(createdAttempt.getCompleted()).isFalse();

        // Test quiz attempt completion
        createdAttempt.setEndTime(LocalDateTime.now());
        createdAttempt.setScore(85);
        createdAttempt.setMaxScore(100);
        createdAttempt.setPassed(true);
        createdAttempt.setCompleted(true);

        StudentQuizDTO completedAttempt = studentQuizService.completeQuizAttempt(createdAttempt);
        assertThat(completedAttempt.getCompleted()).isTrue();
        assertThat(completedAttempt.getScore()).isEqualTo(85);
        assertThat(completedAttempt.getPassed()).isTrue();

        // Test student quiz history
        List<StudentQuizDTO> studentHistory = studentQuizService
                .getStudentQuizHistory(testStudentProfileEntity.getId());
        assertThat(studentHistory).isNotEmpty();
        assertThat(studentHistory.size()).isGreaterThanOrEqualTo(2); // Original + created attempt

        // Test quiz attempts by quiz
        List<StudentQuizDTO> quizAttempts = studentQuizService.getQuizAttempts(testQuiz.getId());
        assertThat(quizAttempts).isNotEmpty();

        // Test student's best attempt
        Optional<StudentQuizDTO> bestAttempt = studentQuizService.getBestAttempt(
                testStudentProfileEntity.getId(), testQuiz.getId());
        assertThat(bestAttempt).isPresent();
        assertThat(bestAttempt.get().getScore()).isGreaterThanOrEqualTo(80);
    }

    @Test
    @DisplayName("Validate QuestionService operations")
    void testQuestionServiceOperations() {
        // Test question creation
        QuestionDTO questionDTO = questionMapper.toDto(testQuestion);
        questionDTO.setId(null); // Create new question
        questionDTO.setQuestionText("What is the Hiragana character for 'ka'?");
        questionDTO.setOptions(Arrays.asList("か", "き", "く", "け"));
        questionDTO.setCorrectAnswer("か");
        questionDTO.setDifficulty("MEDIUM");

        QuestionDTO createdQuestion = questionService.save(questionDTO);
        assertThat(createdQuestion).isNotNull();
        assertThat(createdQuestion.getQuestionText()).contains("ka");
        assertThat(createdQuestion.getCorrectAnswer()).isEqualTo("か");
        assertThat(createdQuestion.getDifficulty()).isEqualTo("MEDIUM");

        // Test question update
        createdQuestion.setExplanation("The Hiragana character for 'ka' is か");
        QuestionDTO updatedQuestion = questionService.save(createdQuestion);
        assertThat(updatedQuestion.getExplanation()).contains("ka");

        // Test question retrieval
        Optional<QuestionDTO> retrievedQuestion = questionService.findOne(createdQuestion.getId());
        assertThat(retrievedQuestion).isPresent();
        assertThat(retrievedQuestion.get().getQuestionText()).contains("ka");

        // Test questions by difficulty
        List<QuestionDTO> easyQuestions = questionService.findByDifficulty("EASY");
        assertThat(easyQuestions).isNotEmpty();

        List<QuestionDTO> mediumQuestions = questionService.findByDifficulty("MEDIUM");
        assertThat(mediumQuestions).isNotEmpty();
    }

    @Test
    @DisplayName("Validate QuizQuestionService operations")
    void testQuizQuestionServiceOperations() {
        // Test adding question to quiz
        QuestionDTO newQuestion = new QuestionDTO();
        newQuestion.setQuestionText("What is the Hiragana character for 'sa'?");
        newQuestion.setQuestionType("MULTIPLE_CHOICE");
        newQuestion.setOptions(Arrays.asList("さ", "し", "す", "せ"));
        newQuestion.setCorrectAnswer("さ");
        newQuestion.setPoints(10);
        newQuestion.setDifficulty("EASY");
        newQuestion.setActive(true);

        QuestionDTO createdQuestion = questionService.save(newQuestion);

        // Add question to quiz
        quizQuestionService.addQuestionToQuiz(testQuiz.getId(), createdQuestion.getId(), 2);

        // Verify question was added
        List<QuestionDTO> quizQuestions = quizQuestionService.getQuizQuestions(testQuiz.getId());
        assertThat(quizQuestions).hasSize(2); // Original + new question

        // Test question ordering
        assertThat(quizQuestions.get(0).getId()).isEqualTo(testQuestion.getId()); // Order 1
        assertThat(quizQuestions.get(1).getId()).isEqualTo(createdQuestion.getId()); // Order 2

        // Test removing question from quiz
        quizQuestionService.removeQuestionFromQuiz(testQuiz.getId(), createdQuestion.getId());

        List<QuestionDTO> remainingQuestions = quizQuestionService.getQuizQuestions(testQuiz.getId());
        assertThat(remainingQuestions).hasSize(1);
        assertThat(remainingQuestions.get(0).getId()).isEqualTo(testQuestion.getId());

        // Test reordering questions
        quizQuestionService.addQuestionToQuiz(testQuiz.getId(), createdQuestion.getId(), 1); // Add at position 1
        quizQuestionService.reorderQuizQuestions(testQuiz.getId(),
                Arrays.asList(createdQuestion.getId(), testQuestion.getId()));

        List<QuestionDTO> reorderedQuestions = quizQuestionService.getQuizQuestions(testQuiz.getId());
        assertThat(reorderedQuestions.get(0).getId()).isEqualTo(createdQuestion.getId());
        assertThat(reorderedQuestions.get(1).getId()).isEqualTo(testQuestion.getId());
    }

    @Test
    @DisplayName("Validate DTO mapping consistency")
    void testDTOMappingConsistency() {
        // Test Quiz to QuizBuilderDTO mapping
        QuizBuilderDTO quizDTO = quizMapper.toDto(testQuiz);
        assertThat(quizDTO).isNotNull();
        assertThat(quizDTO.getTitle()).isEqualTo(testQuiz.getTitle());
        assertThat(quizDTO.getDescription()).isEqualTo(testQuiz.getDescription());
        assertThat(quizDTO.getQuestionCount()).isEqualTo(testQuiz.getQuestionCount());
        assertThat(quizDTO.getTimeLimit()).isEqualTo(testQuiz.getTimeLimit());
        assertThat(quizDTO.getPassingScore()).isEqualTo(testQuiz.getPassingScore());

        // Test Question to QuestionDTO mapping
        QuestionDTO questionDTO = questionMapper.toDto(testQuestion);
        assertThat(questionDTO).isNotNull();
        assertThat(questionDTO.getQuestionText()).isEqualTo(testQuestion.getQuestionText());
        assertThat(questionDTO.getQuestionType()).isEqualTo(testQuestion.getQuestionType());
        assertThat(questionDTO.getCorrectAnswer()).isEqualTo(testQuestion.getCorrectAnswer());
        assertThat(questionDTO.getPoints()).isEqualTo(testQuestion.getPoints());
        assertThat(questionDTO.getDifficulty()).isEqualTo(testQuestion.getDifficulty());

        // Test StudentQuiz to StudentQuizDTO mapping
        StudentQuizDTO studentQuizDTO = studentQuizMapper.toDto(testStudentQuiz);
        assertThat(studentQuizDTO).isNotNull();
        assertThat(studentQuizDTO.getScore()).isEqualTo(testStudentQuiz.getScore());
        assertThat(studentQuizDTO.getMaxScore()).isEqualTo(testStudentQuiz.getMaxScore());
        assertThat(studentQuizDTO.getPassed()).isEqualTo(testStudentQuiz.getPassed());
        assertThat(studentQuizDTO.getCompleted()).isEqualTo(testStudentQuiz.getCompleted());
    }

    @Test
    @DisplayName("Validate service error handling")
    void testServiceErrorHandling() {
        // Test quiz creation with invalid data
        QuizBuilderDTO invalidQuizDTO = new QuizBuilderDTO();
        invalidQuizDTO.setTitle(""); // Empty title
        invalidQuizDTO.setQuestionCount(-1); // Invalid question count
        invalidQuizDTO.setTimeLimit(-10); // Invalid time limit

        assertThatThrownBy(() -> enhancedQuizService.createEnhancedQuiz(invalidQuizDTO))
                .isInstanceOf(Exception.class);

        // Test question creation with invalid data
        QuestionDTO invalidQuestionDTO = new QuestionDTO();
        invalidQuestionDTO.setQuestionText(""); // Empty question text
        invalidQuestionDTO.setPoints(-5); // Negative points

        assertThatThrownBy(() -> questionService.save(invalidQuestionDTO))
                .isInstanceOf(Exception.class);

        // Test student quiz attempt with non-existent quiz
        StudentQuizDTO invalidAttemptDTO = new StudentQuizDTO();
        invalidAttemptDTO.setQuizId(999999L); // Non-existent quiz
        invalidAttemptDTO.setStudentId(testStudentProfileEntity.getId());

        assertThatThrownBy(() -> studentQuizService.startQuizAttempt(invalidAttemptDTO))
                .isInstanceOf(Exception.class);
    }

    @Test
    @DisplayName("Validate service business logic")
    void testServiceBusinessLogic() {
        // Test quiz time limit enforcement
        QuizBuilderDTO timedQuiz = new QuizBuilderDTO();
        timedQuiz.setTitle("Timed Quiz Test");
        timedQuiz.setDescription("Quiz with strict time limit");
        timedQuiz.setCourseId(testCourse.getId());
        timedQuiz.setTimeLimitMinutes(5); // 5 minute limit
        timedQuiz.setQuestionCount(3);
        timedQuiz.setPassingScore(60);
        timedQuiz.setActive(true);

        QuizBuilderDTO createdTimedQuiz = enhancedQuizService.createEnhancedQuiz(timedQuiz);
        assertThat(createdTimedQuiz.getTimeLimitMinutes()).isEqualTo(5);

        // Test quiz activation/deactivation logic
        QuizBuilderDTO scheduledQuiz = new QuizBuilderDTO();
        scheduledQuiz.setTitle("Scheduled Quiz");
        scheduledQuiz.setDescription("Quiz with activation schedule");
        scheduledQuiz.setCourseId(testCourse.getId());
        scheduledQuiz.setActivationTime(LocalDateTime.now().plusDays(1));
        scheduledQuiz.setDeactivationTime(LocalDateTime.now().plusDays(8));
        scheduledQuiz.setQuestionCount(5);
        scheduledQuiz.setPassingScore(70);
        scheduledQuiz.setActive(true);

        QuizBuilderDTO createdScheduledQuiz = enhancedQuizService.createEnhancedQuiz(scheduledQuiz);
        assertThat(createdScheduledQuiz.getActivationTime()).isAfter(LocalDateTime.now());
        assertThat(createdScheduledQuiz.getDeactivationTime()).isAfter(createdScheduledQuiz.getActivationTime());

        // Test passing score logic
        StudentQuizDTO passingAttempt = new StudentQuizDTO();
        passingAttempt.setQuizId(testQuiz.getId());
        passingAttempt.setStudentId(testStudentProfileEntity.getId());
        passingAttempt.setScore(75); // Above passing score of 70
        passingAttempt.setMaxScore(100);
        passingAttempt.setCompleted(true);

        StudentQuizDTO createdPassingAttempt = studentQuizService.startQuizAttempt(passingAttempt);
        createdPassingAttempt.setScore(75);
        createdPassingAttempt.setCompleted(true);

        StudentQuizDTO completedPassingAttempt = studentQuizService.completeQuizAttempt(createdPassingAttempt);
        assertThat(completedPassingAttempt.getPassed()).isTrue();

        // Test failing score logic
        StudentQuizDTO failingAttempt = new StudentQuizDTO();
        failingAttempt.setQuizId(testQuiz.getId());
        failingAttempt.setStudentId(testStudentProfileEntity.getId());
        failingAttempt.setScore(50); // Below passing score of 70
        failingAttempt.setMaxScore(100);
        failingAttempt.setCompleted(true);

        StudentQuizDTO createdFailingAttempt = studentQuizService.startQuizAttempt(failingAttempt);
        createdFailingAttempt.setScore(50);
        createdFailingAttempt.setCompleted(true);

        StudentQuizDTO completedFailingAttempt = studentQuizService.completeQuizAttempt(createdFailingAttempt);
        assertThat(completedFailingAttempt.getPassed()).isFalse();
    }

    @Test
    @DisplayName("Validate service transaction handling")
    void testServiceTransactionHandling() {
        // Test that services properly handle transactions
        long initialQuizCount = quizRepository.count();
        long initialQuestionCount = questionRepository.count();

        // Create a quiz with questions in a transaction
        QuizBuilderDTO quizDTO = new QuizBuilderDTO();
        quizDTO.setTitle("Transaction Test Quiz");
        quizDTO.setDescription("Quiz for testing transactions");
        quizDTO.setCourseId(testCourse.getId());
        quizDTO.setQuestionCount(2);
        quizDTO.setTimeLimit(20);
        quizDTO.setPassingScore(60);
        quizDTO.setActive(true);

        QuizBuilderDTO createdQuiz = enhancedQuizService.createEnhancedQuiz(quizDTO);
        assertThat(createdQuiz).isNotNull();

        // Create questions for the quiz
        QuestionDTO question1DTO = new QuestionDTO();
        question1DTO.setQuestionText("Transaction test question 1");
        question1DTO.setQuestionType("MULTIPLE_CHOICE");
        question1DTO.setOptions(Arrays.asList("A", "B", "C", "D"));
        question1DTO.setCorrectAnswer("A");
        question1DTO.setPoints(10);
        question1DTO.setDifficulty("EASY");
        question1DTO.setActive(true);

        QuestionDTO createdQuestion1 = questionService.save(question1DTO);
        assertThat(createdQuestion1).isNotNull();

        // Add question to quiz
        quizQuestionService.addQuestionToQuiz(createdQuiz.getId(), createdQuestion1.getId(), 1);

        // Verify counts increased
        long finalQuizCount = quizRepository.count();
        long finalQuestionCount = questionRepository.count();

        assertThat(finalQuizCount).isEqualTo(initialQuizCount + 1);
        assertThat(finalQuestionCount).isEqualTo(initialQuestionCount + 1);

        // Transaction will be rolled back after test, so entities won't persist
    }
}