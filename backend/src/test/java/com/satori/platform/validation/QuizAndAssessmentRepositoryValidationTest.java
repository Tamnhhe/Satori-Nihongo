package com.satori.platform.validation;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.Role;
import com.satori.platform.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;

import static org.assertj.core.api.Assertions.*;

/**
 * Comprehensive validation tests for quiz and assessment repositories.
 * Tests QuizRepository, QuestionRepository, QuizQuestionRepository,
 * StudentQuizRepository,
 * and StudentQuizResponseRepository with updated schema and quiz analytics
 * functionality.
 * 
 * Requirements: 3.1, 3.2, 3.5
 */
@ApiValidationTestConfiguration
class QuizAndAssessmentRepositoryValidationTest {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private StudentQuizRepository studentQuizRepository;

    @Autowired
    private StudentQuizResponseRepository studentQuizResponseRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    private Quiz testQuiz;
    private Question testQuestion;
    private QuizQuestion testQuizQuestion;
    private StudentQuiz testStudentQuiz;
    private StudentQuizResponse testStudentQuizResponse;
    private Course testCourse;
    private Lesson testLesson;
    private UserProfile teacherProfile;
    private UserProfile studentProfile;
    private StudentProfile student;

    @BeforeEach
    void setUp() {
        // Create teacher profile
        teacherProfile = new UserProfile();
        teacherProfile.setUsername("teacher");
        teacherProfile.setPasswordHash("hashedpassword");
        teacherProfile.setEmail("teacher@example.com");
        teacherProfile.setFullName("Test Teacher");
        teacherProfile.setRole(Role.GIANG_VIEN);
        teacherProfile = userProfileRepository.save(teacherProfile);

        // Create student profile
        studentProfile = new UserProfile();
        studentProfile.setUsername("student");
        studentProfile.setPasswordHash("hashedpassword");
        studentProfile.setEmail("student@example.com");
        studentProfile.setFullName("Test Student");
        studentProfile.setRole(Role.HOC_VIEN);
        studentProfile = userProfileRepository.save(studentProfile);

        student = new StudentProfile();
        student.setStudentId("STU001");
        student.setUserProfile(studentProfile);
        student = studentProfileRepository.save(student);

        // Create test course
        testCourse = new Course();
        testCourse.setCourseCode("TEST001");
        testCourse.setTitle("Test Course");
        testCourse.setDescription("Test Course Description");
        testCourse.setTeacher(teacherProfile);
        testCourse.setCreatedDate(Instant.now());
        testCourse.setLastModifiedDate(Instant.now());
        testCourse = courseRepository.save(testCourse);

        // Create test lesson
        testLesson = new Lesson();
        testLesson.setTitle("Test Lesson");
        testLesson.setContent("Test Lesson Content");
        testLesson.setCourse(testCourse);
        testLesson = lessonRepository.save(testLesson);

        // Create test quiz with new schema fields
        testQuiz = new Quiz();
        testQuiz.setTitle("Test Quiz");
        testQuiz.setDescription("Test Quiz Description");
        testQuiz.setIsActive(true);
        testQuiz.setActivationTime(Instant.now().minus(1, ChronoUnit.HOURS));
        testQuiz.setDeactivationTime(Instant.now().plus(7, ChronoUnit.DAYS));
        testQuiz.setTimeLimitMinutes(60);
        testQuiz.setIsTemplate(false);
        testQuiz.setTemplateName(null);

        Set<Course> courses = new HashSet<>();
        courses.add(testCourse);
        testQuiz.setCourses(courses);

        Set<Lesson> lessons = new HashSet<>();
        lessons.add(testLesson);
        testQuiz.setLessons(lessons);

        testQuiz = quizRepository.save(testQuiz);

        // Create test question
        testQuestion = new Question();
        testQuestion.setContent("What is the capital of Japan?");
        testQuestion.setType("MULTIPLE_CHOICE");
        testQuestion.setCorrectAnswer("Tokyo");
        testQuestion.setOptions("Tokyo,Osaka,Kyoto,Nagoya");
        testQuestion = questionRepository.save(testQuestion);

        // Create quiz question relationship
        testQuizQuestion = new QuizQuestion();
        testQuizQuestion.setQuiz(testQuiz);
        testQuizQuestion.setQuestion(testQuestion);
        testQuizQuestion.setPosition(1);
        testQuizQuestion.setPoints(10.0);
        testQuizQuestion = quizQuestionRepository.save(testQuizQuestion);

        // Create student quiz attempt
        testStudentQuiz = new StudentQuiz();
        testStudentQuiz.setQuiz(testQuiz);
        testStudentQuiz.setStudent(studentProfile);
        testStudentQuiz.setStartTime(Instant.now().minus(30, ChronoUnit.MINUTES));
        testStudentQuiz.setEndTime(Instant.now().minus(10, ChronoUnit.MINUTES));
        testStudentQuiz.setCompleted(true);
        testStudentQuiz.setScore(85.0);
        testStudentQuiz.setPaused(false);
        testStudentQuiz = studentQuizRepository.save(testStudentQuiz);

        // Create student quiz response
        testStudentQuizResponse = new StudentQuizResponse();
        testStudentQuizResponse.setStudentQuiz(testStudentQuiz);
        testStudentQuizResponse.setQuizQuestion(testQuizQuestion);
        testStudentQuizResponse.setSelectedAnswer("Tokyo");
        testStudentQuizResponse.setIsCorrect(true);
        testStudentQuizResponse.setResponseTime(Instant.now().minus(15, ChronoUnit.MINUTES));
        testStudentQuizResponse = studentQuizResponseRepository.save(testStudentQuizResponse);
    }

    // QuizRepository Tests

    @Test
    void testQuizRepository_BasicCrudOperations() {
        // Test save
        Quiz newQuiz = new Quiz();
        newQuiz.setTitle("New Quiz");
        newQuiz.setDescription("New Quiz Description");
        newQuiz.setIsActive(false);
        newQuiz.setActivationTime(Instant.now().plus(1, ChronoUnit.HOURS));
        newQuiz.setDeactivationTime(Instant.now().plus(8, ChronoUnit.DAYS));
        newQuiz.setTimeLimitMinutes(45);
        newQuiz.setIsTemplate(false);

        Quiz savedQuiz = quizRepository.save(newQuiz);
        assertThat(savedQuiz.getId()).isNotNull();
        assertThat(savedQuiz.getTitle()).isEqualTo("New Quiz");

        // Test findById
        Optional<Quiz> foundQuiz = quizRepository.findById(savedQuiz.getId());
        assertThat(foundQuiz).isPresent();
        assertThat(foundQuiz.get().getDescription()).isEqualTo("New Quiz Description");

        // Test update
        savedQuiz.setTitle("Updated Quiz");
        Quiz updatedQuiz = quizRepository.save(savedQuiz);
        assertThat(updatedQuiz.getTitle()).isEqualTo("Updated Quiz");

        // Test delete
        quizRepository.delete(savedQuiz);
        Optional<Quiz> deletedQuiz = quizRepository.findById(savedQuiz.getId());
        assertThat(deletedQuiz).isEmpty();
    }

    @Test
    void testQuizRepository_NewSchemaFields() {
        // Test new schema fields are properly persisted and retrieved
        Optional<Quiz> foundQuiz = quizRepository.findById(testQuiz.getId());
        assertThat(foundQuiz).isPresent();

        Quiz quiz = foundQuiz.get();
        assertThat(quiz.getIsActive()).isTrue();
        assertThat(quiz.getActivationTime()).isNotNull();
        assertThat(quiz.getDeactivationTime()).isNotNull();
        assertThat(quiz.getTimeLimitMinutes()).isEqualTo(60);
        assertThat(quiz.getIsTemplate()).isFalse();
        assertThat(quiz.getTemplateName()).isNull();
    }

    @Test
    void testQuizRepository_CustomQueries() {
        // Test findByCourseId
        List<Quiz> quizzesByCourse = quizRepository.findByCourseId(testCourse.getId());
        assertThat(quizzesByCourse).hasSize(1);
        assertThat(quizzesByCourse.get(0).getTitle()).isEqualTo("Test Quiz");

        // Test findByLessonId
        List<Quiz> quizzesByLesson = quizRepository.findByLessonId(testLesson.getId());
        assertThat(quizzesByLesson).hasSize(1);
        assertThat(quizzesByLesson.get(0).getTitle()).isEqualTo("Test Quiz");

        // Test findActiveByCourseId
        List<Quiz> activeQuizzesByCourse = quizRepository.findActiveByCourseId(testCourse.getId());
        assertThat(activeQuizzesByCourse).hasSize(1);
        assertThat(activeQuizzesByCourse.get(0).getIsActive()).isTrue();

        // Test findActiveByLessonId
        List<Quiz> activeQuizzesByLesson = quizRepository.findActiveByLessonId(testLesson.getId());
        assertThat(activeQuizzesByLesson).hasSize(1);
        assertThat(activeQuizzesByLesson.get(0).getIsActive()).isTrue();

        // Test findByTeacherId
        Pageable pageable = PageRequest.of(0, 10);
        Page<Quiz> quizzesByTeacher = quizRepository.findByTeacherId(teacherProfile.getId(), pageable);
        assertThat(quizzesByTeacher.getContent()).hasSize(1);
        assertThat(quizzesByTeacher.getContent().get(0).getTitle()).isEqualTo("Test Quiz");
    }

    @Test
    void testQuizRepository_TemplateQueries() {
        // Create template quiz
        Quiz templateQuiz = new Quiz();
        templateQuiz.setTitle("Template Quiz");
        templateQuiz.setDescription("Template Quiz Description");
        templateQuiz.setIsActive(false);
        templateQuiz.setIsTemplate(true);
        templateQuiz.setTemplateName("Basic Template");
        quizRepository.save(templateQuiz);

        // Test findTemplatesByName
        List<Quiz> templates = quizRepository.findTemplatesByName("Basic");
        assertThat(templates).hasSize(1);
        assertThat(templates.get(0).getIsTemplate()).isTrue();
        assertThat(templates.get(0).getTemplateName()).isEqualTo("Basic Template");
    }

    @Test
    void testQuizRepository_ActivationQueries() {
        // Create quiz to be activated
        Quiz inactiveQuiz = new Quiz();
        inactiveQuiz.setTitle("Inactive Quiz");
        inactiveQuiz.setDescription("Quiz to be activated");
        inactiveQuiz.setIsActive(false);
        inactiveQuiz.setActivationTime(Instant.now().minus(1, ChronoUnit.MINUTES));
        inactiveQuiz.setDeactivationTime(Instant.now().plus(1, ChronoUnit.DAYS));
        inactiveQuiz.setIsTemplate(false);
        quizRepository.save(inactiveQuiz);

        // Test findQuizzesToActivate
        List<Quiz> quizzesToActivate = quizRepository.findQuizzesToActivate(Instant.now());
        assertThat(quizzesToActivate).hasSize(1);
        assertThat(quizzesToActivate.get(0).getTitle()).isEqualTo("Inactive Quiz");

        // Create quiz to be deactivated
        Quiz activeQuiz = new Quiz();
        activeQuiz.setTitle("Active Quiz");
        activeQuiz.setDescription("Quiz to be deactivated");
        activeQuiz.setIsActive(true);
        activeQuiz.setActivationTime(Instant.now().minus(2, ChronoUnit.HOURS));
        activeQuiz.setDeactivationTime(Instant.now().minus(1, ChronoUnit.MINUTES));
        activeQuiz.setIsTemplate(false);
        quizRepository.save(activeQuiz);

        // Test findQuizzesToDeactivate
        List<Quiz> quizzesToDeactivate = quizRepository.findQuizzesToDeactivate(Instant.now());
        assertThat(quizzesToDeactivate).hasSize(1);
        assertThat(quizzesToDeactivate.get(0).getTitle()).isEqualTo("Active Quiz");

        // Test findActiveQuizzesWithDueDateBetween
        Instant startDate = Instant.now().minus(1, ChronoUnit.HOURS);
        Instant endDate = Instant.now().plus(1, ChronoUnit.HOURS);
        List<Quiz> quizzesWithDueDate = quizRepository.findActiveQuizzesWithDueDateBetween(startDate, endDate);
        assertThat(quizzesWithDueDate).hasSize(1);
    }

    @Test
    void testQuizRepository_EagerRelationships() {
        // Test findOneWithEagerRelationships
        Optional<Quiz> quizWithRelationships = quizRepository.findOneWithEagerRelationships(testQuiz.getId());
        assertThat(quizWithRelationships).isPresent();
        assertThat(quizWithRelationships.get().getCourses()).isNotEmpty();
        assertThat(quizWithRelationships.get().getLessons()).isNotEmpty();

        // Test findAllWithEagerRelationships
        List<Quiz> allQuizzesWithRelationships = quizRepository.findAllWithEagerRelationships();
        assertThat(allQuizzesWithRelationships).isNotEmpty();

        // Test findAllWithEagerRelationships with pagination
        Pageable pageable = PageRequest.of(0, 10);
        Page<Quiz> quizzesWithRelationshipsPaged = quizRepository.findAllWithEagerRelationships(pageable);
        assertThat(quizzesWithRelationshipsPaged.getContent()).isNotEmpty();
    }

    // QuestionRepository Tests

    @Test
    void testQuestionRepository_BasicCrudOperations() {
        // Test save
        Question newQuestion = new Question();
        newQuestion.setContent("What is the largest city in Japan?");
        newQuestion.setType("MULTIPLE_CHOICE");
        newQuestion.setCorrectAnswer("Tokyo");
        newQuestion.setOptions("Tokyo,Osaka,Yokohama,Nagoya");

        Question savedQuestion = questionRepository.save(newQuestion);
        assertThat(savedQuestion.getId()).isNotNull();
        assertThat(savedQuestion.getContent()).isEqualTo("What is the largest city in Japan?");

        // Test findById
        Optional<Question> foundQuestion = questionRepository.findById(savedQuestion.getId());
        assertThat(foundQuestion).isPresent();
        assertThat(foundQuestion.get().getType()).isEqualTo("MULTIPLE_CHOICE");

        // Test update
        savedQuestion.setContent("Updated question content");
        Question updatedQuestion = questionRepository.save(savedQuestion);
        assertThat(updatedQuestion.getContent()).isEqualTo("Updated question content");

        // Test delete
        questionRepository.delete(savedQuestion);
        Optional<Question> deletedQuestion = questionRepository.findById(savedQuestion.getId());
        assertThat(deletedQuestion).isEmpty();
    }

    @Test
    void testQuestionRepository_SearchQueries() {
        Pageable pageable = PageRequest.of(0, 10);

        // Test findByContentContainingIgnoreCase
        Page<Question> questionsByContent = questionRepository.findByContentContainingIgnoreCase("capital", pageable);
        assertThat(questionsByContent.getContent()).hasSize(1);
        assertThat(questionsByContent.getContent().get(0).getContent()).contains("capital");

        // Test findByType
        Page<Question> questionsByType = questionRepository.findByType("MULTIPLE_CHOICE", pageable);
        assertThat(questionsByType.getContent()).hasSize(1);
        assertThat(questionsByType.getContent().get(0).getType()).isEqualTo("MULTIPLE_CHOICE");

        // Test findByContentContainingIgnoreCaseAndType
        Page<Question> questionsByContentAndType = questionRepository.findByContentContainingIgnoreCaseAndType(
                "japan", "MULTIPLE_CHOICE", pageable);
        assertThat(questionsByContentAndType.getContent()).hasSize(1);
        assertThat(questionsByContentAndType.getContent().get(0).getContent()).containsIgnoringCase("japan");
        assertThat(questionsByContentAndType.getContent().get(0).getType()).isEqualTo("MULTIPLE_CHOICE");
    }

    // QuizQuestionRepository Tests

    @Test
    void testQuizQuestionRepository_BasicCrudOperations() {
        // Create additional question for testing
        Question newQuestion = new Question();
        newQuestion.setContent("What is the currency of Japan?");
        newQuestion.setType("MULTIPLE_CHOICE");
        newQuestion.setCorrectAnswer("Yen");
        newQuestion.setOptions("Yen,Dollar,Euro,Won");
        newQuestion = questionRepository.save(newQuestion);

        // Test save
        QuizQuestion newQuizQuestion = new QuizQuestion();
        newQuizQuestion.setQuiz(testQuiz);
        newQuizQuestion.setQuestion(newQuestion);
        newQuizQuestion.setPosition(2);
        newQuizQuestion.setPoints(15.0);

        QuizQuestion savedQuizQuestion = quizQuestionRepository.save(newQuizQuestion);
        assertThat(savedQuizQuestion.getId()).isNotNull();
        assertThat(savedQuizQuestion.getPosition()).isEqualTo(2);

        // Test findById
        Optional<QuizQuestion> foundQuizQuestion = quizQuestionRepository.findById(savedQuizQuestion.getId());
        assertThat(foundQuizQuestion).isPresent();
        assertThat(foundQuizQuestion.get().getPoints()).isEqualTo(15.0);

        // Test update
        savedQuizQuestion.setPoints(20.0);
        QuizQuestion updatedQuizQuestion = quizQuestionRepository.save(savedQuizQuestion);
        assertThat(updatedQuizQuestion.getPoints()).isEqualTo(20.0);

        // Test delete
        quizQuestionRepository.delete(savedQuizQuestion);
        Optional<QuizQuestion> deletedQuizQuestion = quizQuestionRepository.findById(savedQuizQuestion.getId());
        assertThat(deletedQuizQuestion).isEmpty();
    }

    @Test
    void testQuizQuestionRepository_CustomQueries() {
        // Test findByQuizIdOrderByPosition
        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizIdOrderByPosition(testQuiz.getId());
        assertThat(quizQuestions).hasSize(1);
        assertThat(quizQuestions.get(0).getPosition()).isEqualTo(1);

        // Test countByQuizId
        long questionCount = quizQuestionRepository.countByQuizId(testQuiz.getId());
        assertThat(questionCount).isEqualTo(1);

        // Test findMaxPositionByQuizId
        Optional<Integer> maxPosition = quizQuestionRepository.findMaxPositionByQuizId(testQuiz.getId());
        assertThat(maxPosition).isPresent();
        assertThat(maxPosition.get()).isEqualTo(1);

        // Test findByQuizIdAndPositionGreaterThanEqual
        List<QuizQuestion> questionsFromPosition = quizQuestionRepository.findByQuizIdAndPositionGreaterThanEqual(
                testQuiz.getId(), 1);
        assertThat(questionsFromPosition).hasSize(1);
        assertThat(questionsFromPosition.get(0).getPosition()).isEqualTo(1);

        // Test findByQuizIdAndQuestionId
        Optional<QuizQuestion> specificQuizQuestion = quizQuestionRepository.findByQuizIdAndQuestionId(
                testQuiz.getId(), testQuestion.getId());
        assertThat(specificQuizQuestion).isPresent();
        assertThat(specificQuizQuestion.get().getPoints()).isEqualTo(10.0);
    }

    // StudentQuizRepository Tests

    @Test
    void testStudentQuizRepository_BasicCrudOperations() {
        // Test save
        StudentQuiz newStudentQuiz = new StudentQuiz();
        newStudentQuiz.setQuiz(testQuiz);
        newStudentQuiz.setStudent(studentProfile);
        newStudentQuiz.setStartTime(Instant.now());
        newStudentQuiz.setCompleted(false);
        newStudentQuiz.setPaused(false);

        StudentQuiz savedStudentQuiz = studentQuizRepository.save(newStudentQuiz);
        assertThat(savedStudentQuiz.getId()).isNotNull();
        assertThat(savedStudentQuiz.getCompleted()).isFalse();

        // Test findById
        Optional<StudentQuiz> foundStudentQuiz = studentQuizRepository.findById(savedStudentQuiz.getId());
        assertThat(foundStudentQuiz).isPresent();
        assertThat(foundStudentQuiz.get().getPaused()).isFalse();

        // Test update
        savedStudentQuiz.setCompleted(true);
        savedStudentQuiz.setEndTime(Instant.now());
        savedStudentQuiz.setScore(92.0);
        StudentQuiz updatedStudentQuiz = studentQuizRepository.save(savedStudentQuiz);
        assertThat(updatedStudentQuiz.getCompleted()).isTrue();
        assertThat(updatedStudentQuiz.getScore()).isEqualTo(92.0);

        // Test delete
        studentQuizRepository.delete(savedStudentQuiz);
        Optional<StudentQuiz> deletedStudentQuiz = studentQuizRepository.findById(savedStudentQuiz.getId());
        assertThat(deletedStudentQuiz).isEmpty();
    }

    @Test
    void testStudentQuizRepository_StudentQueries() {
        Pageable pageable = PageRequest.of(0, 10);

        // Test findByStudentIdOrderByStartTimeDesc
        Page<StudentQuiz> studentQuizzes = studentQuizRepository.findByStudentIdOrderByStartTimeDesc(
                studentProfile.getId(), pageable);
        assertThat(studentQuizzes.getContent()).hasSize(1);
        assertThat(studentQuizzes.getContent().get(0).getScore()).isEqualTo(85.0);

        // Test findByStudentIdAndQuizIdOrderByStartTimeDesc
        List<StudentQuiz> studentQuizAttempts = studentQuizRepository.findByStudentIdAndQuizIdOrderByStartTimeDesc(
                studentProfile.getId(), testQuiz.getId());
        assertThat(studentQuizAttempts).hasSize(1);
        assertThat(studentQuizAttempts.get(0).getCompleted()).isTrue();

        // Test countCompletedAttemptsByStudentAndQuiz
        Long completedAttempts = studentQuizRepository.countCompletedAttemptsByStudentAndQuiz(
                studentProfile.getId(), testQuiz.getId());
        assertThat(completedAttempts).isEqualTo(1);

        // Test findBestScoreByStudentAndQuiz
        Optional<Double> bestScore = studentQuizRepository.findBestScoreByStudentAndQuiz(
                studentProfile.getId(), testQuiz.getId());
        assertThat(bestScore).isPresent();
        assertThat(bestScore.get()).isEqualTo(85.0);

        // Test findAverageScoreByStudent
        Optional<Double> averageScore = studentQuizRepository.findAverageScoreByStudent(studentProfile.getId());
        assertThat(averageScore).isPresent();
        assertThat(averageScore.get()).isEqualTo(85.0);
    }

    @Test
    void testStudentQuizRepository_ActiveAttemptQueries() {
        // Create active (incomplete) attempt
        StudentQuiz activeAttempt = new StudentQuiz();
        activeAttempt.setQuiz(testQuiz);
        activeAttempt.setStudent(studentProfile);
        activeAttempt.setStartTime(Instant.now().minus(15, ChronoUnit.MINUTES));
        activeAttempt.setCompleted(false);
        activeAttempt.setPaused(false);
        studentQuizRepository.save(activeAttempt);

        // Test findActiveAttemptByStudentAndQuiz
        Optional<StudentQuiz> activeAttemptFound = studentQuizRepository.findActiveAttemptByStudentAndQuiz(
                studentProfile.getId(), testQuiz.getId());
        assertThat(activeAttemptFound).isPresent();
        assertThat(activeAttemptFound.get().getCompleted()).isFalse();

        // Test findAttemptsToAutoSubmit
        Instant cutoffTime = Instant.now().minus(testQuiz.getTimeLimitMinutes() + 5, ChronoUnit.MINUTES);
        List<StudentQuiz> attemptsToAutoSubmit = studentQuizRepository.findAttemptsToAutoSubmit(
                cutoffTime, Instant.now());
        assertThat(attemptsToAutoSubmit).hasSize(1);
        assertThat(attemptsToAutoSubmit.get(0).getCompleted()).isFalse();
    }

    @Test
    void testStudentQuizRepository_DateRangeQueries() {
        // Test findRecentAttemptsByStudent
        Instant since = Instant.now().minus(1, ChronoUnit.DAYS);
        List<StudentQuiz> recentAttempts = studentQuizRepository.findRecentAttemptsByStudent(
                studentProfile.getId(), since);
        assertThat(recentAttempts).hasSize(1);
        assertThat(recentAttempts.get(0).getScore()).isEqualTo(85.0);

        // Test findRecentByStudentId with limit
        List<StudentQuiz> recentLimited = studentQuizRepository.findRecentByStudentId(studentProfile.getId(), 5);
        assertThat(recentLimited).hasSize(1);

        // Test findByDateRangeAndFilters
        Instant startDate = Instant.now().minus(1, ChronoUnit.HOURS);
        Instant endDate = Instant.now();
        List<StudentQuiz> attemptsInRange = studentQuizRepository.findByDateRangeAndFilters(
                startDate, endDate, testCourse.getId(), studentProfile.getId());
        assertThat(attemptsInRange).hasSize(1);

        // Test findByCourseId
        List<StudentQuiz> attemptsByCourse = studentQuizRepository.findByCourseId(testCourse.getId());
        assertThat(attemptsByCourse).hasSize(1);
        assertThat(attemptsByCourse.get(0).getScore()).isEqualTo(85.0);
    }

    // StudentQuizResponseRepository Tests

    @Test
    void testStudentQuizResponseRepository_BasicCrudOperations() {
        // Create additional quiz question for testing
        Question newQuestion = new Question();
        newQuestion.setContent("What is the traditional Japanese currency?");
        newQuestion.setType("MULTIPLE_CHOICE");
        newQuestion.setCorrectAnswer("Yen");
        newQuestion.setOptions("Yen,Dollar,Euro,Won");
        newQuestion = questionRepository.save(newQuestion);

        QuizQuestion newQuizQuestion = new QuizQuestion();
        newQuizQuestion.setQuiz(testQuiz);
        newQuizQuestion.setQuestion(newQuestion);
        newQuizQuestion.setPosition(2);
        newQuizQuestion.setPoints(10.0);
        newQuizQuestion = quizQuestionRepository.save(newQuizQuestion);

        // Test save
        StudentQuizResponse newResponse = new StudentQuizResponse();
        newResponse.setStudentQuiz(testStudentQuiz);
        newResponse.setQuizQuestion(newQuizQuestion);
        newResponse.setSelectedAnswer("Yen");
        newResponse.setIsCorrect(true);
        newResponse.setResponseTime(Instant.now().minus(12, ChronoUnit.MINUTES));

        StudentQuizResponse savedResponse = studentQuizResponseRepository.save(newResponse);
        assertThat(savedResponse.getId()).isNotNull();
        assertThat(savedResponse.getSelectedAnswer()).isEqualTo("Yen");

        // Test findById
        Optional<StudentQuizResponse> foundResponse = studentQuizResponseRepository.findById(savedResponse.getId());
        assertThat(foundResponse).isPresent();
        assertThat(foundResponse.get().getIsCorrect()).isTrue();

        // Test update
        savedResponse.setSelectedAnswer("Dollar");
        savedResponse.setIsCorrect(false);
        StudentQuizResponse updatedResponse = studentQuizResponseRepository.save(savedResponse);
        assertThat(updatedResponse.getSelectedAnswer()).isEqualTo("Dollar");
        assertThat(updatedResponse.getIsCorrect()).isFalse();

        // Test delete
        studentQuizResponseRepository.delete(savedResponse);
        Optional<StudentQuizResponse> deletedResponse = studentQuizResponseRepository.findById(savedResponse.getId());
        assertThat(deletedResponse).isEmpty();
    }

    @Test
    void testStudentQuizResponseRepository_CustomQueries() {
        // Test findByStudentQuizIdOrderByQuizQuestionPosition
        List<StudentQuizResponse> responses = studentQuizResponseRepository
                .findByStudentQuizIdOrderByQuizQuestionPosition(
                        testStudentQuiz.getId());
        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getSelectedAnswer()).isEqualTo("Tokyo");

        // Test findByStudentQuizIdAndQuizQuestionId
        StudentQuizResponse specificResponse = studentQuizResponseRepository.findByStudentQuizIdAndQuizQuestionId(
                testStudentQuiz.getId(), testQuizQuestion.getId());
        assertThat(specificResponse).isNotNull();
        assertThat(specificResponse.getIsCorrect()).isTrue();

        // Test countCorrectResponsesByStudentQuizId
        Long correctCount = studentQuizResponseRepository.countCorrectResponsesByStudentQuizId(testStudentQuiz.getId());
        assertThat(correctCount).isEqualTo(1);

        // Test countByStudentQuizId
        Long totalCount = studentQuizResponseRepository.countByStudentQuizId(testStudentQuiz.getId());
        assertThat(totalCount).isEqualTo(1);
    }

    // Integration Tests

    @Test
    void testQuizAndAssessmentRepositories_Integration() {
        // Test complete quiz workflow
        Quiz newQuiz = new Quiz();
        newQuiz.setTitle("Integration Quiz");
        newQuiz.setDescription("Integration Test Quiz");
        newQuiz.setIsActive(true);
        newQuiz.setActivationTime(Instant.now().minus(1, ChronoUnit.HOURS));
        newQuiz.setDeactivationTime(Instant.now().plus(7, ChronoUnit.DAYS));
        newQuiz.setTimeLimitMinutes(30);
        newQuiz.setIsTemplate(false);

        Set<Course> courses = new HashSet<>();
        courses.add(testCourse);
        newQuiz.setCourses(courses);

        Quiz savedQuiz = quizRepository.save(newQuiz);

        // Create questions for the quiz
        Question question1 = new Question();
        question1.setContent("Integration Question 1");
        question1.setType("MULTIPLE_CHOICE");
        question1.setCorrectAnswer("A");
        question1.setOptions("A,B,C,D");
        question1 = questionRepository.save(question1);

        Question question2 = new Question();
        question2.setContent("Integration Question 2");
        question2.setType("TRUE_FALSE");
        question2.setCorrectAnswer("True");
        question2.setOptions("True,False");
        question2 = questionRepository.save(question2);

        // Create quiz questions
        QuizQuestion quizQuestion1 = new QuizQuestion();
        quizQuestion1.setQuiz(savedQuiz);
        quizQuestion1.setQuestion(question1);
        quizQuestion1.setPosition(1);
        quizQuestion1.setPoints(5.0);
        quizQuestion1 = quizQuestionRepository.save(quizQuestion1);

        QuizQuestion quizQuestion2 = new QuizQuestion();
        quizQuestion2.setQuiz(savedQuiz);
        quizQuestion2.setQuestion(question2);
        quizQuestion2.setPosition(2);
        quizQuestion2.setPoints(5.0);
        quizQuestion2 = quizQuestionRepository.save(quizQuestion2);

        // Create student quiz attempt
        StudentQuiz studentQuizAttempt = new StudentQuiz();
        studentQuizAttempt.setQuiz(savedQuiz);
        studentQuizAttempt.setStudent(studentProfile);
        studentQuizAttempt.setStartTime(Instant.now().minus(20, ChronoUnit.MINUTES));
        studentQuizAttempt.setEndTime(Instant.now().minus(5, ChronoUnit.MINUTES));
        studentQuizAttempt.setCompleted(true);
        studentQuizAttempt.setScore(80.0);
        studentQuizAttempt.setPaused(false);
        studentQuizAttempt = studentQuizRepository.save(studentQuizAttempt);

        // Create student responses
        StudentQuizResponse response1 = new StudentQuizResponse();
        response1.setStudentQuiz(studentQuizAttempt);
        response1.setQuizQuestion(quizQuestion1);
        response1.setSelectedAnswer("A");
        response1.setIsCorrect(true);
        response1.setResponseTime(Instant.now().minus(18, ChronoUnit.MINUTES));
        studentQuizResponseRepository.save(response1);

        StudentQuizResponse response2 = new StudentQuizResponse();
        response2.setStudentQuiz(studentQuizAttempt);
        response2.setQuizQuestion(quizQuestion2);
        response2.setSelectedAnswer("False");
        response2.setIsCorrect(false);
        response2.setResponseTime(Instant.now().minus(10, ChronoUnit.MINUTES));
        studentQuizResponseRepository.save(response2);

        // Verify all entities are properly linked
        assertThat(savedQuiz.getId()).isNotNull();
        assertThat(question1.getId()).isNotNull();
        assertThat(question2.getId()).isNotNull();
        assertThat(quizQuestion1.getId()).isNotNull();
        assertThat(quizQuestion2.getId()).isNotNull();
        assertThat(studentQuizAttempt.getId()).isNotNull();

        // Test cross-repository queries
        List<QuizQuestion> quizQuestions = quizQuestionRepository.findByQuizIdOrderByPosition(savedQuiz.getId());
        assertThat(quizQuestions).hasSize(2);
        assertThat(quizQuestions.get(0).getPosition()).isEqualTo(1);
        assertThat(quizQuestions.get(1).getPosition()).isEqualTo(2);

        List<StudentQuizResponse> responses = studentQuizResponseRepository
                .findByStudentQuizIdOrderByQuizQuestionPosition(
                        studentQuizAttempt.getId());
        assertThat(responses).hasSize(2);

        Long correctResponses = studentQuizResponseRepository.countCorrectResponsesByStudentQuizId(
                studentQuizAttempt.getId());
        assertThat(correctResponses).isEqualTo(1);

        Optional<Double> bestScore = studentQuizRepository.findBestScoreByStudentAndQuiz(
                studentProfile.getId(), savedQuiz.getId());
        assertThat(bestScore).isPresent();
        assertThat(bestScore.get()).isEqualTo(80.0);
    }

    @Test
    void testRepositoryPerformance() {
        // Create multiple quizzes for performance testing
        List<Quiz> quizzes = new ArrayList<>();
        for (int i = 0; i < 15; i++) {
            Quiz quiz = new Quiz();
            quiz.setTitle("Performance Quiz " + i);
            quiz.setDescription("Performance Test Quiz " + i);
            quiz.setIsActive(true);
            quiz.setActivationTime(Instant.now().minus(1, ChronoUnit.HOURS));
            quiz.setDeactivationTime(Instant.now().plus(7, ChronoUnit.DAYS));
            quiz.setTimeLimitMinutes(30);
            quiz.setIsTemplate(false);
            quizzes.add(quiz);
        }

        long startTime = System.currentTimeMillis();
        quizRepository.saveAll(quizzes);
        long saveTime = System.currentTimeMillis() - startTime;

        startTime = System.currentTimeMillis();
        List<Quiz> allQuizzes = quizRepository.findAll();
        long findTime = System.currentTimeMillis() - startTime;

        // Performance assertions (should complete within reasonable time)
        assertThat(saveTime).isLessThan(3000); // 3 seconds
        assertThat(findTime).isLessThan(1000); // 1 second
        assertThat(allQuizzes.size()).isGreaterThanOrEqualTo(15);

        // Test complex query performance
        startTime = System.currentTimeMillis();
        List<Quiz> activeByCourse = quizRepository.findActiveByCourseId(testCourse.getId());
        long complexQueryTime = System.currentTimeMillis() - startTime;

        assertThat(complexQueryTime).isLessThan(1000); // 1 second
        assertThat(activeByCourse).isNotEmpty();
    }
}