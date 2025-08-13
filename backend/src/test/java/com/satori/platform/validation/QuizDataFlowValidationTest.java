package com.satori.platform.validation;

import com.satori.platform.OnlineSatoriPlatformApp;
import com.satori.platform.domain.Quiz;
import com.satori.platform.domain.Question;
import com.satori.platform.domain.QuizQuestion;
import com.satori.platform.domain.StudentQuiz;
import com.satori.platform.domain.StudentQuizParticipation;
import com.satori.platform.domain.QuizAssignment;
import com.satori.platform.domain.Course;
import com.satori.platform.domain.CourseClass;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.User;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.repository.QuizRepository;
import com.satori.platform.repository.QuestionRepository;
import com.satori.platform.repository.QuizQuestionRepository;
import com.satori.platform.repository.StudentQuizRepository;
import com.satori.platform.repository.StudentQuizParticipationRepository;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.CourseClassRepository;
import com.satori.platform.repository.StudentProfileRepository;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.service.EnhancedQuizService;
import com.satori.platform.service.QuizAnalyticsService;
import com.satori.platform.service.QuizAssignmentService;
import com.satori.platform.service.StudentQuizService;
import com.satori.platform.service.dto.QuizBuilderDTO;
import com.satori.platform.service.dto.QuizAnalyticsDTO;
import com.satori.platform.service.dto.QuizAssignmentDTO;
import com.satori.platform.service.dto.StudentQuizDTO;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Comprehensive data flow validation test for quiz system.
 * Tests complete data flow from database through all layers to API endpoints.
 * 
 * Requirements: 6.1, 6.2, 6.5
 */
@SpringBootTest(classes = OnlineSatoriPlatformApp.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Transactional
public class QuizDataFlowValidationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuizQuestionRepository quizQuestionRepository;

    @Autowired
    private StudentQuizRepository studentQuizRepository;

    @Autowired
    private StudentQuizParticipationRepository studentQuizParticipationRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private CourseClassRepository courseClassRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private EnhancedQuizService enhancedQuizService;

    @Autowired
    private QuizAnalyticsService quizAnalyticsService;

    @Autowired
    private QuizAssignmentService quizAssignmentService;

    @Autowired
    private StudentQuizService studentQuizService;

    private String baseUrl;
    private HttpHeaders headers;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api";
        headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
    }

    @Test
    @DisplayName("Test quiz data with new fields through all layers")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testQuizDataWithNewFieldsThroughAllLayers() {
        // Step 1: Create quiz at database layer with new schema fields
        Quiz quiz = createTestQuizWithNewFields();
        Quiz savedQuiz = quizRepository.save(quiz);

        // Verify database persistence with new fields
        Optional<Quiz> dbQuiz = quizRepository.findById(savedQuiz.getId());
        assertThat(dbQuiz).isPresent();
        assertThat(dbQuiz.get().getIsActive()).isEqualTo(quiz.getIsActive());
        assertThat(dbQuiz.get().getActivationTime()).isEqualTo(quiz.getActivationTime());
        assertThat(dbQuiz.get().getDeactivationTime()).isEqualTo(quiz.getDeactivationTime());
        assertThat(dbQuiz.get().getTimeLimitMinutes()).isEqualTo(quiz.getTimeLimitMinutes());
        assertThat(dbQuiz.get().getIsTemplate()).isEqualTo(quiz.getIsTemplate());
        assertThat(dbQuiz.get().getTemplateName()).isEqualTo(quiz.getTemplateName());

        // Step 2: Test service layer data transformation with new fields
        Optional<QuizBuilderDTO> serviceResponse = enhancedQuizService.findOne(savedQuiz.getId());
        assertThat(serviceResponse).isPresent();
        QuizBuilderDTO quizDTO = serviceResponse.get();
        assertThat(quizDTO.getId()).isEqualTo(savedQuiz.getId());
        assertThat(quizDTO.getTitle()).isEqualTo(savedQuiz.getTitle());
        assertThat(quizDTO.getIsActive()).isEqualTo(savedQuiz.getIsActive());
        assertThat(quizDTO.getTimeLimitMinutes()).isEqualTo(savedQuiz.getTimeLimitMinutes());
        assertThat(quizDTO.getIsTemplate()).isEqualTo(savedQuiz.getIsTemplate());

        // Step 3: Test API layer data consistency with new fields
        ResponseEntity<QuizBuilderDTO> apiResponse = restTemplate.exchange(
                baseUrl + "/admin/quizzes/" + savedQuiz.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                QuizBuilderDTO.class);

        assertThat(apiResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        QuizBuilderDTO apiQuiz = apiResponse.getBody();
        assertThat(apiQuiz).isNotNull();
        assertThat(apiQuiz.getId()).isEqualTo(savedQuiz.getId());
        assertThat(apiQuiz.getIsActive()).isEqualTo(savedQuiz.getIsActive());
        assertThat(apiQuiz.getTimeLimitMinutes()).isEqualTo(savedQuiz.getTimeLimitMinutes());
        assertThat(apiQuiz.getIsTemplate()).isEqualTo(savedQuiz.getIsTemplate());
    }

    @Test
    @DisplayName("Test quiz assignment and participation tracking")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testQuizAssignmentAndParticipationTracking() {
        // Step 1: Create complete quiz structure
        Course course = createTestCourse();
        Course savedCourse = courseRepository.save(course);

        CourseClass courseClass = createTestCourseClass(savedCourse);
        CourseClass savedClass = courseClassRepository.save(courseClass);

        Quiz quiz = createTestQuizWithNewFields();
        Quiz savedQuiz = quizRepository.save(quiz);

        // Step 2: Create quiz assignment
        QuizAssignmentDTO assignment = new QuizAssignmentDTO();
        assignment.setQuizId(savedQuiz.getId());
        assignment.setCourseClassId(savedClass.getId());
        assignment.setAssignedDate(Instant.now());
        assignment.setDueDate(Instant.now().plusSeconds(86400 * 7)); // 7 days later
        assignment.setMaxAttempts(3);
        assignment.setActive(true);

        QuizAssignmentDTO savedAssignment = quizAssignmentService.save(assignment);
        assertThat(savedAssignment).isNotNull();
        assertThat(savedAssignment.getQuizId()).isEqualTo(savedQuiz.getId());
        assertThat(savedAssignment.getCourseClassId()).isEqualTo(savedClass.getId());

        // Step 3: Create student and participation
        User user = createTestUser();
        User savedUser = userRepository.save(user);

        UserProfile userProfile = createTestUserProfile(savedUser);
        UserProfile savedProfile = userProfileRepository.save(userProfile);

        StudentProfile student = createTestStudentProfile(savedProfile);
        StudentProfile savedStudent = studentProfileRepository.save(student);

        // Step 4: Test student quiz participation
        StudentQuiz studentQuiz = createTestStudentQuiz(savedQuiz, savedStudent);
        StudentQuiz savedStudentQuiz = studentQuizRepository.save(studentQuiz);

        StudentQuizParticipation participation = createTestParticipation(savedStudentQuiz);
        StudentQuizParticipation savedParticipation = studentQuizParticipationRepository.save(participation);

        // Step 5: Verify participation data consistency
        Optional<StudentQuizParticipation> dbParticipation = studentQuizParticipationRepository
                .findById(savedParticipation.getId());
        assertThat(dbParticipation).isPresent();
        assertThat(dbParticipation.get().getStudentQuiz().getId()).isEqualTo(savedStudentQuiz.getId());
        assertThat(dbParticipation.get().getStartTime()).isEqualTo(participation.getStartTime());
        assertThat(dbParticipation.get().getEndTime()).isEqualTo(participation.getEndTime());
        assertThat(dbParticipation.get().getScore()).isEqualTo(participation.getScore());

        // Step 6: Test service layer participation tracking
        List<StudentQuizParticipation> studentParticipations = studentQuizService
                .getStudentParticipations(savedStudent.getId());
        assertThat(studentParticipations).hasSize(1);
        assertThat(studentParticipations.get(0).getId()).isEqualTo(savedParticipation.getId());

        // Step 7: Test API participation consistency
        ResponseEntity<StudentQuizDTO> participationResponse = restTemplate.exchange(
                baseUrl + "/student-quiz-participation/" + savedParticipation.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                StudentQuizDTO.class);

        assertThat(participationResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        StudentQuizDTO apiParticipation = participationResponse.getBody();
        assertThat(apiParticipation).isNotNull();
        assertThat(apiParticipation.getQuizId()).isEqualTo(savedQuiz.getId());
        assertThat(apiParticipation.getStudentId()).isEqualTo(savedStudent.getId());
    }

    @Test
    @DisplayName("Test analytics and reporting data consistency")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testAnalyticsAndReportingDataConsistency() {
        // Step 1: Create quiz with questions
        Quiz quiz = createTestQuizWithNewFields();
        Quiz savedQuiz = quizRepository.save(quiz);

        Question question1 = createTestQuestion();
        Question savedQuestion1 = questionRepository.save(question1);

        Question question2 = createTestQuestion();
        question2.setQuestionText("What is the Japanese word for 'book'?");
        Question savedQuestion2 = questionRepository.save(question2);

        // Step 2: Create quiz-question relationships
        QuizQuestion quizQuestion1 = createTestQuizQuestion(savedQuiz, savedQuestion1, 1);
        QuizQuestion savedQuizQuestion1 = quizQuestionRepository.save(quizQuestion1);

        QuizQuestion quizQuestion2 = createTestQuizQuestion(savedQuiz, savedQuestion2, 2);
        QuizQuestion savedQuizQuestion2 = quizQuestionRepository.save(quizQuestion2);

        // Step 3: Create multiple student attempts for analytics
        User user1 = createTestUser();
        user1.setLogin("student1" + System.currentTimeMillis());
        user1.setEmail("student1" + System.currentTimeMillis() + "@example.com");
        User savedUser1 = userRepository.save(user1);

        UserProfile profile1 = createTestUserProfile(savedUser1);
        UserProfile savedProfile1 = userProfileRepository.save(profile1);

        StudentProfile student1 = createTestStudentProfile(savedProfile1);
        StudentProfile savedStudent1 = studentProfileRepository.save(student1);

        User user2 = createTestUser();
        user2.setLogin("student2" + System.currentTimeMillis());
        user2.setEmail("student2" + System.currentTimeMillis() + "@example.com");
        User savedUser2 = userRepository.save(user2);

        UserProfile profile2 = createTestUserProfile(savedUser2);
        UserProfile savedProfile2 = userProfileRepository.save(profile2);

        StudentProfile student2 = createTestStudentProfile(savedProfile2);
        StudentProfile savedStudent2 = studentProfileRepository.save(student2);

        // Step 4: Create student quiz attempts with different scores
        StudentQuiz studentQuiz1 = createTestStudentQuiz(savedQuiz, savedStudent1);
        studentQuiz1.setScore(85.0);
        StudentQuiz savedStudentQuiz1 = studentQuizRepository.save(studentQuiz1);

        StudentQuiz studentQuiz2 = createTestStudentQuiz(savedQuiz, savedStudent2);
        studentQuiz2.setScore(92.0);
        StudentQuiz savedStudentQuiz2 = studentQuizRepository.save(studentQuiz2);

        // Step 5: Test analytics service data aggregation
        QuizAnalyticsDTO analytics = quizAnalyticsService.getQuizAnalytics(savedQuiz.getId());
        assertThat(analytics).isNotNull();
        assertThat(analytics.getQuizId()).isEqualTo(savedQuiz.getId());
        assertThat(analytics.getTotalAttempts()).isEqualTo(2);
        assertThat(analytics.getAverageScore()).isEqualTo(88.5); // (85 + 92) / 2
        assertThat(analytics.getHighestScore()).isEqualTo(92.0);
        assertThat(analytics.getLowestScore()).isEqualTo(85.0);

        // Step 6: Test question-level analytics
        Double question1Accuracy = quizAnalyticsService.getQuestionAccuracy(savedQuestion1.getId());
        assertThat(question1Accuracy).isNotNull();

        Double question2Accuracy = quizAnalyticsService.getQuestionAccuracy(savedQuestion2.getId());
        assertThat(question2Accuracy).isNotNull();

        // Step 7: Test API analytics consistency
        ResponseEntity<QuizAnalyticsDTO> analyticsResponse = restTemplate.exchange(
                baseUrl + "/admin/quiz-analytics/" + savedQuiz.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                QuizAnalyticsDTO.class);

        assertThat(analyticsResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        QuizAnalyticsDTO apiAnalytics = analyticsResponse.getBody();
        assertThat(apiAnalytics).isNotNull();
        assertThat(apiAnalytics.getQuizId()).isEqualTo(savedQuiz.getId());
        assertThat(apiAnalytics.getTotalAttempts()).isEqualTo(2);
        assertThat(apiAnalytics.getAverageScore()).isEqualTo(88.5);
    }

    @Test
    @DisplayName("Test quiz template functionality and data flow")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testQuizTemplateFunctionalityAndDataFlow() {
        // Step 1: Create quiz template
        Quiz template = createTestQuizWithNewFields();
        template.setIsTemplate(true);
        template.setTemplateName("Japanese Vocabulary Template");
        Quiz savedTemplate = quizRepository.save(template);

        // Step 2: Verify template persistence
        Optional<Quiz> dbTemplate = quizRepository.findById(savedTemplate.getId());
        assertThat(dbTemplate).isPresent();
        assertThat(dbTemplate.get().getIsTemplate()).isTrue();
        assertThat(dbTemplate.get().getTemplateName()).isEqualTo("Japanese Vocabulary Template");

        // Step 3: Test service layer template operations
        List<Quiz> templates = enhancedQuizService.findAllTemplates();
        assertThat(templates).hasSize(1);
        assertThat(templates.get(0).getId()).isEqualTo(savedTemplate.getId());
        assertThat(templates.get(0).getIsTemplate()).isTrue();

        // Step 4: Create quiz from template
        QuizBuilderDTO newQuizFromTemplate = enhancedQuizService.createFromTemplate(savedTemplate.getId());
        assertThat(newQuizFromTemplate).isNotNull();
        assertThat(newQuizFromTemplate.getTitle()).contains(savedTemplate.getTitle());
        assertThat(newQuizFromTemplate.getIsTemplate()).isFalse(); // New quiz should not be a template
        assertThat(newQuizFromTemplate.getTimeLimitMinutes()).isEqualTo(savedTemplate.getTimeLimitMinutes());

        // Step 5: Test API template consistency
        ResponseEntity<QuizBuilderDTO[]> templatesResponse = restTemplate.exchange(
                baseUrl + "/admin/quizzes/templates",
                HttpMethod.GET,
                new HttpEntity<>(headers),
                QuizBuilderDTO[].class);

        assertThat(templatesResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        QuizBuilderDTO[] apiTemplates = templatesResponse.getBody();
        assertThat(apiTemplates).isNotNull();
        assertThat(apiTemplates).hasSize(1);
        assertThat(apiTemplates[0].getId()).isEqualTo(savedTemplate.getId());
        assertThat(apiTemplates[0].getIsTemplate()).isTrue();
    }

    @Test
    @DisplayName("Test quiz activation and scheduling data flow")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testQuizActivationAndSchedulingDataFlow() {
        // Step 1: Create scheduled quiz
        Quiz quiz = createTestQuizWithNewFields();
        quiz.setIsActive(false);
        quiz.setActivationTime(Instant.now().plusSeconds(3600)); // 1 hour from now
        quiz.setDeactivationTime(Instant.now().plusSeconds(7200)); // 2 hours from now
        Quiz savedQuiz = quizRepository.save(quiz);

        // Step 2: Verify scheduling data persistence
        Optional<Quiz> dbQuiz = quizRepository.findById(savedQuiz.getId());
        assertThat(dbQuiz).isPresent();
        assertThat(dbQuiz.get().getIsActive()).isFalse();
        assertThat(dbQuiz.get().getActivationTime()).isEqualTo(quiz.getActivationTime());
        assertThat(dbQuiz.get().getDeactivationTime()).isEqualTo(quiz.getDeactivationTime());

        // Step 3: Test service layer scheduling operations
        List<Quiz> scheduledQuizzes = enhancedQuizService.findScheduledQuizzes();
        assertThat(scheduledQuizzes).contains(savedQuiz);

        boolean isCurrentlyActive = enhancedQuizService.isQuizCurrentlyActive(savedQuiz.getId());
        assertThat(isCurrentlyActive).isFalse(); // Should not be active yet

        // Step 4: Test manual activation
        enhancedQuizService.activateQuiz(savedQuiz.getId());

        Optional<Quiz> activatedQuiz = quizRepository.findById(savedQuiz.getId());
        assertThat(activatedQuiz).isPresent();
        assertThat(activatedQuiz.get().getIsActive()).isTrue();

        // Step 5: Test API scheduling consistency
        ResponseEntity<QuizBuilderDTO> scheduledResponse = restTemplate.exchange(
                baseUrl + "/admin/quizzes/" + savedQuiz.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                QuizBuilderDTO.class);

        assertThat(scheduledResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        QuizBuilderDTO apiQuiz = scheduledResponse.getBody();
        assertThat(apiQuiz).isNotNull();
        assertThat(apiQuiz.getIsActive()).isTrue();
        assertThat(apiQuiz.getActivationTime()).isEqualTo(savedQuiz.getActivationTime());
        assertThat(apiQuiz.getDeactivationTime()).isEqualTo(savedQuiz.getDeactivationTime());
    }

    // Helper methods for creating test data
    private Quiz createTestQuizWithNewFields() {
        Quiz quiz = new Quiz();
        quiz.setTitle("Test Quiz " + System.currentTimeMillis());
        quiz.setDescription("Test quiz description");
        quiz.setIsActive(true);
        quiz.setActivationTime(Instant.now());
        quiz.setDeactivationTime(Instant.now().plusSeconds(86400)); // 24 hours later
        quiz.setTimeLimitMinutes(30);
        quiz.setIsTemplate(false);
        quiz.setTemplateName(null);
        quiz.setCreatedDate(Instant.now());
        return quiz;
    }

    private Question createTestQuestion() {
        Question question = new Question();
        question.setQuestionText("What is the Japanese word for 'hello'?");
        question.setQuestionType("MULTIPLE_CHOICE");
        question.setCorrectAnswer("こんにちは");
        question.setOptions("こんにちは,さようなら,ありがとう,すみません");
        question.setPoints(10);
        question.setDifficultyLevel("BEGINNER");
        question.setActive(true);
        question.setCreatedDate(Instant.now());
        return question;
    }

    private QuizQuestion createTestQuizQuestion(Quiz quiz, Question question, int orderIndex) {
        QuizQuestion quizQuestion = new QuizQuestion();
        quizQuestion.setQuiz(quiz);
        quizQuestion.setQuestion(question);
        quizQuestion.setOrderIndex(orderIndex);
        quizQuestion.setPoints(question.getPoints());
        return quizQuestion;
    }

    private StudentQuiz createTestStudentQuiz(Quiz quiz, StudentProfile student) {
        StudentQuiz studentQuiz = new StudentQuiz();
        studentQuiz.setQuiz(quiz);
        studentQuiz.setStudent(student);
        studentQuiz.setStartTime(Instant.now());
        studentQuiz.setEndTime(Instant.now().plusSeconds(1800)); // 30 minutes later
        studentQuiz.setScore(88.0);
        studentQuiz.setCompleted(true);
        studentQuiz.setAttemptNumber(1);
        return studentQuiz;
    }

    private StudentQuizParticipation createTestParticipation(StudentQuiz studentQuiz) {
        StudentQuizParticipation participation = new StudentQuizParticipation();
        participation.setStudentQuiz(studentQuiz);
        participation.setStartTime(studentQuiz.getStartTime());
        participation.setEndTime(studentQuiz.getEndTime());
        participation.setScore(studentQuiz.getScore());
        participation.setCompleted(true);
        participation.setTimeSpent(1800); // 30 minutes in seconds
        return participation;
    }

    private Course createTestCourse() {
        Course course = new Course();
        course.setTitle("Test Course " + System.currentTimeMillis());
        course.setDescription("Test course description");
        course.setDifficultyLevel("Beginner");
        course.setEstimatedDuration(40);
        course.setLanguage("Japanese");
        course.setActive(true);
        course.setCreatedDate(Instant.now());
        return course;
    }

    private CourseClass createTestCourseClass(Course course) {
        CourseClass courseClass = new CourseClass();
        courseClass.setCourse(course);
        courseClass.setClassName("Test Class " + System.currentTimeMillis());
        courseClass.setDescription("Test class description");
        courseClass.setMaxStudents(20);
        courseClass.setStartDate(Instant.now());
        courseClass.setEndDate(Instant.now().plusSeconds(86400 * 30)); // 30 days later
        courseClass.setActive(true);
        return courseClass;
    }

    private User createTestUser() {
        User user = new User();
        user.setLogin("testuser" + System.currentTimeMillis());
        user.setEmail("test" + System.currentTimeMillis() + "@example.com");
        user.setFirstName("Test");
        user.setLastName("User");
        user.setActivated(true);
        user.setLangKey("en");
        return user;
    }

    private UserProfile createTestUserProfile(User user) {
        UserProfile profile = new UserProfile();
        profile.setUser(user);
        profile.setPhoneNumber("123-456-7890");
        profile.setDateOfBirth(Instant.now().minusSeconds(86400 * 365 * 25)); // 25 years ago
        profile.setAddress("123 Test Street");
        profile.setCity("Test City");
        profile.setCountry("Test Country");
        return profile;
    }

    private StudentProfile createTestStudentProfile(UserProfile userProfile) {
        StudentProfile student = new StudentProfile();
        student.setUserProfile(userProfile);
        student.setStudentId("STU" + System.currentTimeMillis());
        student.setEnrollmentDate(Instant.now());
        student.setGradeLevel("Beginner");
        student.setLearningGoals("Learn Japanese");
        return student;
    }
}