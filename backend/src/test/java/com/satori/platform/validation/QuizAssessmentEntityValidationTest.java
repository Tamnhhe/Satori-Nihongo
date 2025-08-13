package com.satori.platform.validation;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.QuizType;
import com.satori.platform.domain.enumeration.Role;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;

import jakarta.persistence.*;
import java.lang.reflect.Field;
import java.time.Instant;
import java.util.Set;

import static org.assertj.core.api.Assertions.*;

/**
 * Test class for validating quiz and assessment entity mappings.
 * Validates Quiz, Question, QuizQuestion, StudentQuiz, and StudentQuizResponse
 * entities
 * with new schema changes from Liquibase.
 * 
 * Requirements: 2.1, 2.2, 2.5
 */
public class QuizAssessmentEntityValidationTest {

    @Test
    @DisplayName("Validate Quiz entity JPA annotations and new schema fields")
    void testQuizEntityMappings() {
        // Test entity annotation
        Entity entityAnnotation = Quiz.class.getAnnotation(Entity.class);
        assertThat(entityAnnotation).isNotNull();

        Table tableAnnotation = Quiz.class.getAnnotation(Table.class);
        assertThat(tableAnnotation).isNotNull();
        assertThat(tableAnnotation.name()).isEqualTo("quiz");

        // Test core field types
        assertThat(getFieldType(Quiz.class, "id")).isEqualTo(Long.class);
        assertThat(getFieldType(Quiz.class, "title")).isEqualTo(String.class);
        assertThat(getFieldType(Quiz.class, "description")).isEqualTo(String.class);
        assertThat(getFieldType(Quiz.class, "isTest")).isEqualTo(Boolean.class);
        assertThat(getFieldType(Quiz.class, "isPractice")).isEqualTo(Boolean.class);
        assertThat(getFieldType(Quiz.class, "quizType")).isEqualTo(QuizType.class);

        // Validate new columns from Liquibase changes (20250809000001)
        assertThat(getFieldType(Quiz.class, "isActive")).isEqualTo(Boolean.class);
        assertThat(getFieldType(Quiz.class, "activationTime")).isEqualTo(Instant.class);
        assertThat(getFieldType(Quiz.class, "deactivationTime")).isEqualTo(Instant.class);
        assertThat(getFieldType(Quiz.class, "timeLimitMinutes")).isEqualTo(Integer.class);
        assertThat(getFieldType(Quiz.class, "isTemplate")).isEqualTo(Boolean.class);
        assertThat(getFieldType(Quiz.class, "templateName")).isEqualTo(String.class);

        // Validate relationships
        assertThat(getFieldType(Quiz.class, "questions")).isEqualTo(Set.class);
        assertThat(getFieldType(Quiz.class, "assignedTos")).isEqualTo(Set.class);
        assertThat(getFieldType(Quiz.class, "courses")).isEqualTo(Set.class);
        assertThat(getFieldType(Quiz.class, "lessons")).isEqualTo(Set.class);

        // Test relationship annotations
        assertThat(hasFieldAnnotation(Quiz.class, "questions", OneToMany.class)).isTrue();
        assertThat(hasFieldAnnotation(Quiz.class, "assignedTos", OneToMany.class)).isTrue();
        assertThat(hasFieldAnnotation(Quiz.class, "courses", ManyToMany.class)).isTrue();
        assertThat(hasFieldAnnotation(Quiz.class, "lessons", ManyToMany.class)).isTrue();
    }

    @Test
    @DisplayName("Validate Question entity JPA annotations and field mappings")
    void testQuestionEntityMappings() {
        // Test entity annotation
        Entity entityAnnotation = Question.class.getAnnotation(Entity.class);
        assertThat(entityAnnotation).isNotNull();

        Table tableAnnotation = Question.class.getAnnotation(Table.class);
        assertThat(tableAnnotation).isNotNull();
        assertThat(tableAnnotation.name()).isEqualTo("question");

        // Test field types
        assertThat(getFieldType(Question.class, "id")).isEqualTo(Long.class);
        assertThat(getFieldType(Question.class, "content")).isEqualTo(String.class);
        assertThat(getFieldType(Question.class, "imageUrl")).isEqualTo(String.class);
        assertThat(getFieldType(Question.class, "suggestion")).isEqualTo(String.class);
        assertThat(getFieldType(Question.class, "answerExplanation")).isEqualTo(String.class);
        assertThat(getFieldType(Question.class, "correctAnswer")).isEqualTo(String.class);
        assertThat(getFieldType(Question.class, "type")).isEqualTo(String.class);

        // Validate relationships
        assertThat(getFieldType(Question.class, "quizQuestions")).isEqualTo(Set.class);
        assertThat(hasFieldAnnotation(Question.class, "quizQuestions", OneToMany.class)).isTrue();
    }

    @Test
    @DisplayName("Validate QuizQuestion entity JPA annotations and relationships")
    void testQuizQuestionEntityMappings() {
        // Test entity annotation
        Entity entityAnnotation = QuizQuestion.class.getAnnotation(Entity.class);
        assertThat(entityAnnotation).isNotNull();

        Table tableAnnotation = QuizQuestion.class.getAnnotation(Table.class);
        assertThat(tableAnnotation).isNotNull();
        assertThat(tableAnnotation.name()).isEqualTo("quiz_question");

        // Test field types
        assertThat(getFieldType(QuizQuestion.class, "id")).isEqualTo(Long.class);
        assertThat(getFieldType(QuizQuestion.class, "position")).isEqualTo(Integer.class);

        // Validate relationships
        assertThat(getFieldType(QuizQuestion.class, "quiz")).isEqualTo(Quiz.class);
        assertThat(getFieldType(QuizQuestion.class, "question")).isEqualTo(Question.class);

        // Test relationship annotations
        assertThat(hasFieldAnnotation(QuizQuestion.class, "quiz", ManyToOne.class)).isTrue();
        assertThat(hasFieldAnnotation(QuizQuestion.class, "question", ManyToOne.class)).isTrue();
    }

    @Test
    @DisplayName("Validate StudentQuiz entity JPA annotations and participation tracking fields")
    void testStudentQuizEntityMappings() {
        // Test entity annotation
        Entity entityAnnotation = StudentQuiz.class.getAnnotation(Entity.class);
        assertThat(entityAnnotation).isNotNull();

        Table tableAnnotation = StudentQuiz.class.getAnnotation(Table.class);
        assertThat(tableAnnotation).isNotNull();
        assertThat(tableAnnotation.name()).isEqualTo("student_quiz");

        // Test core field types
        assertThat(getFieldType(StudentQuiz.class, "id")).isEqualTo(Long.class);
        assertThat(getFieldType(StudentQuiz.class, "startTime")).isEqualTo(Instant.class);
        assertThat(getFieldType(StudentQuiz.class, "endTime")).isEqualTo(Instant.class);
        assertThat(getFieldType(StudentQuiz.class, "score")).isEqualTo(Double.class);
        assertThat(getFieldType(StudentQuiz.class, "completed")).isEqualTo(Boolean.class);

        // Test participation tracking fields
        assertThat(getFieldType(StudentQuiz.class, "paused")).isEqualTo(Boolean.class);
        assertThat(getFieldType(StudentQuiz.class, "pauseTime")).isEqualTo(Instant.class);
        assertThat(getFieldType(StudentQuiz.class, "resumeTime")).isEqualTo(Instant.class);
        assertThat(getFieldType(StudentQuiz.class, "totalPauseDurationSeconds")).isEqualTo(Integer.class);
        assertThat(getFieldType(StudentQuiz.class, "submittedAutomatically")).isEqualTo(Boolean.class);
        assertThat(getFieldType(StudentQuiz.class, "currentQuestionIndex")).isEqualTo(Integer.class);
        assertThat(getFieldType(StudentQuiz.class, "totalQuestions")).isEqualTo(Integer.class);
        assertThat(getFieldType(StudentQuiz.class, "correctAnswers")).isEqualTo(Integer.class);

        // Validate relationships
        assertThat(getFieldType(StudentQuiz.class, "quiz")).isEqualTo(Quiz.class);
        assertThat(getFieldType(StudentQuiz.class, "student")).isEqualTo(UserProfile.class);
        assertThat(getFieldType(StudentQuiz.class, "responses")).isEqualTo(Set.class);

        // Test relationship annotations
        assertThat(hasFieldAnnotation(StudentQuiz.class, "quiz", ManyToOne.class)).isTrue();
        assertThat(hasFieldAnnotation(StudentQuiz.class, "student", ManyToOne.class)).isTrue();
        assertThat(hasFieldAnnotation(StudentQuiz.class, "responses", OneToMany.class)).isTrue();
    }

    @Test
    @DisplayName("Validate StudentQuizResponse entity JPA annotations and response tracking")
    void testStudentQuizResponseEntityMappings() {
        // Test entity annotation
        Entity entityAnnotation = StudentQuizResponse.class.getAnnotation(Entity.class);
        assertThat(entityAnnotation).isNotNull();

        Table tableAnnotation = StudentQuizResponse.class.getAnnotation(Table.class);
        assertThat(tableAnnotation).isNotNull();
        assertThat(tableAnnotation.name()).isEqualTo("student_quiz_response");

        // Test field types
        assertThat(getFieldType(StudentQuizResponse.class, "id")).isEqualTo(Long.class);
        assertThat(getFieldType(StudentQuizResponse.class, "studentAnswer")).isEqualTo(String.class);
        assertThat(getFieldType(StudentQuizResponse.class, "isCorrect")).isEqualTo(Boolean.class);
        assertThat(getFieldType(StudentQuizResponse.class, "responseTime")).isEqualTo(Instant.class);
        assertThat(getFieldType(StudentQuizResponse.class, "timeSpentSeconds")).isEqualTo(Integer.class);

        // Validate relationships
        assertThat(getFieldType(StudentQuizResponse.class, "studentQuiz")).isEqualTo(StudentQuiz.class);
        assertThat(getFieldType(StudentQuizResponse.class, "quizQuestion")).isEqualTo(QuizQuestion.class);

        // Test relationship annotations
        assertThat(hasFieldAnnotation(StudentQuizResponse.class, "studentQuiz", ManyToOne.class)).isTrue();
        assertThat(hasFieldAnnotation(StudentQuizResponse.class, "quizQuestion", ManyToOne.class)).isTrue();
    }

    @Test
    @DisplayName("Test Quiz entity field validation and new schema features")
    void testQuizEntityFieldValidation() {
        Quiz quiz = new Quiz();

        // Test core setters and getters
        quiz.setTitle("Japanese Grammar Quiz");
        assertThat(quiz.getTitle()).isEqualTo("Japanese Grammar Quiz");

        quiz.setDescription("Test your knowledge of Japanese grammar");
        assertThat(quiz.getDescription()).isEqualTo("Test your knowledge of Japanese grammar");

        quiz.setIsTest(true);
        assertThat(quiz.getIsTest()).isTrue();

        quiz.setIsPractice(false);
        assertThat(quiz.getIsPractice()).isFalse();

        quiz.setQuizType(QuizType.COURSE);
        assertThat(quiz.getQuizType()).isEqualTo(QuizType.COURSE);

        // Test new schema fields from Liquibase changes
        quiz.setIsActive(true);
        assertThat(quiz.getIsActive()).isTrue();

        Instant now = Instant.now();
        quiz.setActivationTime(now);
        assertThat(quiz.getActivationTime()).isEqualTo(now);

        Instant later = now.plusSeconds(3600);
        quiz.setDeactivationTime(later);
        assertThat(quiz.getDeactivationTime()).isEqualTo(later);

        quiz.setTimeLimitMinutes(60);
        assertThat(quiz.getTimeLimitMinutes()).isEqualTo(60);

        quiz.setIsTemplate(false);
        assertThat(quiz.getIsTemplate()).isFalse();

        quiz.setTemplateName("Grammar Template");
        assertThat(quiz.getTemplateName()).isEqualTo("Grammar Template");

        // Test collections are initialized
        assertThat(quiz.getQuestions()).isNotNull();
        assertThat(quiz.getAssignedTos()).isNotNull();
        assertThat(quiz.getCourses()).isNotNull();
        assertThat(quiz.getLessons()).isNotNull();
    }

    @Test
    @DisplayName("Test QuizType enum validation")
    void testQuizTypeEnumValidation() {
        // Test QuizType enum values
        assertThat(QuizType.values()).containsExactlyInAnyOrder(QuizType.COURSE, QuizType.LESSON);

        Quiz quiz = new Quiz();
        quiz.setQuizType(QuizType.COURSE);
        assertThat(quiz.getQuizType()).isEqualTo(QuizType.COURSE);

        quiz.setQuizType(QuizType.LESSON);
        assertThat(quiz.getQuizType()).isEqualTo(QuizType.LESSON);
    }

    @Test
    @DisplayName("Test Question entity field validation")
    void testQuestionEntityFieldValidation() {
        Question question = new Question();

        // Test setters and getters
        question.setContent("What is the correct hiragana for 'ka'?");
        assertThat(question.getContent()).isEqualTo("What is the correct hiragana for 'ka'?");

        question.setImageUrl("https://example.com/hiragana-ka.png");
        assertThat(question.getImageUrl()).isEqualTo("https://example.com/hiragana-ka.png");

        question.setSuggestion("Think about the basic hiragana characters");
        assertThat(question.getSuggestion()).isEqualTo("Think about the basic hiragana characters");

        question.setAnswerExplanation("The hiragana for 'ka' is か");
        assertThat(question.getAnswerExplanation()).isEqualTo("The hiragana for 'ka' is か");

        question.setCorrectAnswer("か");
        assertThat(question.getCorrectAnswer()).isEqualTo("か");

        question.setType("multiple_choice");
        assertThat(question.getType()).isEqualTo("multiple_choice");

        // Test collections are initialized
        assertThat(question.getQuizQuestions()).isNotNull();
    }

    @Test
    @DisplayName("Test StudentQuiz entity participation tracking features")
    void testStudentQuizParticipationTracking() {
        StudentQuiz studentQuiz = new StudentQuiz();

        // Test core quiz attempt fields
        Instant startTime = Instant.now();
        studentQuiz.setStartTime(startTime);
        assertThat(studentQuiz.getStartTime()).isEqualTo(startTime);

        Instant endTime = startTime.plusSeconds(1800); // 30 minutes later
        studentQuiz.setEndTime(endTime);
        assertThat(studentQuiz.getEndTime()).isEqualTo(endTime);

        studentQuiz.setScore(85.5);
        assertThat(studentQuiz.getScore()).isEqualTo(85.5);

        studentQuiz.setCompleted(true);
        assertThat(studentQuiz.getCompleted()).isTrue();

        // Test participation tracking fields
        studentQuiz.setPaused(false);
        assertThat(studentQuiz.getPaused()).isFalse();

        Instant pauseTime = startTime.plusSeconds(600);
        studentQuiz.setPauseTime(pauseTime);
        assertThat(studentQuiz.getPauseTime()).isEqualTo(pauseTime);

        Instant resumeTime = pauseTime.plusSeconds(300);
        studentQuiz.setResumeTime(resumeTime);
        assertThat(studentQuiz.getResumeTime()).isEqualTo(resumeTime);

        studentQuiz.setTotalPauseDurationSeconds(300);
        assertThat(studentQuiz.getTotalPauseDurationSeconds()).isEqualTo(300);

        studentQuiz.setSubmittedAutomatically(false);
        assertThat(studentQuiz.getSubmittedAutomatically()).isFalse();

        studentQuiz.setCurrentQuestionIndex(5);
        assertThat(studentQuiz.getCurrentQuestionIndex()).isEqualTo(5);

        studentQuiz.setTotalQuestions(10);
        assertThat(studentQuiz.getTotalQuestions()).isEqualTo(10);

        studentQuiz.setCorrectAnswers(8);
        assertThat(studentQuiz.getCorrectAnswers()).isEqualTo(8);

        // Test collections are initialized
        assertThat(studentQuiz.getResponses()).isNotNull();
    }

    @Test
    @DisplayName("Test quiz entity relationships and bidirectional mappings")
    void testQuizEntityRelationships() {
        // Create entities
        UserProfile student = new UserProfile();
        student.setUsername("student");
        student.setEmail("student@example.com");
        student.setFullName("Student User");
        student.setRole(Role.HOC_VIEN);

        Quiz quiz = new Quiz();
        quiz.setTitle("Japanese Grammar Quiz");
        quiz.setIsTest(true);
        quiz.setIsPractice(false);
        quiz.setQuizType(QuizType.COURSE);

        Question question = new Question();
        question.setContent("What is the correct hiragana for 'ka'?");
        question.setCorrectAnswer("か");
        question.setType("multiple_choice");

        QuizQuestion quizQuestion = new QuizQuestion();
        quizQuestion.setPosition(1);

        StudentQuiz studentQuiz = new StudentQuiz();
        studentQuiz.setStartTime(Instant.now());
        studentQuiz.setCompleted(false);

        StudentQuizResponse response = new StudentQuizResponse();
        response.setStudentAnswer("か");
        response.setIsCorrect(true);
        response.setResponseTime(Instant.now());
        response.setTimeSpentSeconds(30);

        // Test bidirectional relationships
        quizQuestion.setQuiz(quiz);
        quizQuestion.setQuestion(question);
        quiz.addQuestions(quizQuestion);
        question.addQuizQuestions(quizQuestion);

        studentQuiz.setQuiz(quiz);
        studentQuiz.setStudent(student);
        quiz.addAssignedTo(studentQuiz);
        student.addQuizAttempts(studentQuiz);

        response.setStudentQuiz(studentQuiz);
        response.setQuizQuestion(quizQuestion);
        studentQuiz.addResponses(response);

        // Verify relationships are properly established
        assertThat(quiz.getQuestions()).contains(quizQuestion);
        assertThat(quizQuestion.getQuiz()).isEqualTo(quiz);
        assertThat(quizQuestion.getQuestion()).isEqualTo(question);
        assertThat(question.getQuizQuestions()).contains(quizQuestion);

        assertThat(quiz.getAssignedTos()).contains(studentQuiz);
        assertThat(studentQuiz.getQuiz()).isEqualTo(quiz);
        assertThat(studentQuiz.getStudent()).isEqualTo(student);
        assertThat(student.getQuizAttempts()).contains(studentQuiz);

        assertThat(studentQuiz.getResponses()).contains(response);
        assertThat(response.getStudentQuiz()).isEqualTo(studentQuiz);
        assertThat(response.getQuizQuestion()).isEqualTo(quizQuestion);
    }

    @Test
    @DisplayName("Test quiz analytics and assignment entity relationships")
    void testQuizAnalyticsAndAssignmentEntities() {
        // Create a complete quiz scenario
        Quiz quiz = new Quiz();
        quiz.setTitle("Comprehensive Japanese Test");
        quiz.setIsTest(true);
        quiz.setIsPractice(false);
        quiz.setQuizType(QuizType.COURSE);
        quiz.setIsActive(true);
        quiz.setTimeLimitMinutes(90);

        // Create multiple questions
        Question q1 = new Question();
        q1.setContent("Question 1");
        q1.setCorrectAnswer("Answer 1");
        q1.setType("multiple_choice");

        Question q2 = new Question();
        q2.setContent("Question 2");
        q2.setCorrectAnswer("Answer 2");
        q2.setType("text_input");

        // Create quiz-question relationships
        QuizQuestion qq1 = new QuizQuestion();
        qq1.setPosition(1);
        qq1.setQuiz(quiz);
        qq1.setQuestion(q1);

        QuizQuestion qq2 = new QuizQuestion();
        qq2.setPosition(2);
        qq2.setQuiz(quiz);
        qq2.setQuestion(q2);

        quiz.addQuestions(qq1);
        quiz.addQuestions(qq2);

        // Create student attempts
        UserProfile student1 = new UserProfile();
        student1.setRole(Role.HOC_VIEN);

        UserProfile student2 = new UserProfile();
        student2.setRole(Role.HOC_VIEN);

        StudentQuiz attempt1 = new StudentQuiz();
        attempt1.setQuiz(quiz);
        attempt1.setStudent(student1);
        attempt1.setTotalQuestions(2);
        attempt1.setCorrectAnswers(2);
        attempt1.setScore(100.0);
        attempt1.setCompleted(true);

        StudentQuiz attempt2 = new StudentQuiz();
        attempt2.setQuiz(quiz);
        attempt2.setStudent(student2);
        attempt2.setTotalQuestions(2);
        attempt2.setCorrectAnswers(1);
        attempt2.setScore(50.0);
        attempt2.setCompleted(true);

        quiz.addAssignedTo(attempt1);
        quiz.addAssignedTo(attempt2);

        // Verify the complete quiz structure
        assertThat(quiz.getQuestions()).hasSize(2);
        assertThat(quiz.getAssignedTos()).hasSize(2);
        assertThat(quiz.getQuestions().stream().mapToInt(QuizQuestion::getPosition).sum()).isEqualTo(3); // 1 + 2

        // Verify analytics data is properly structured
        double averageScore = quiz.getAssignedTos().stream()
                .filter(sq -> sq.getCompleted() && sq.getScore() != null)
                .mapToDouble(StudentQuiz::getScore)
                .average()
                .orElse(0.0);
        assertThat(averageScore).isEqualTo(75.0); // (100 + 50) / 2
    }

    // Helper methods
    private Class<?> getFieldType(Class<?> clazz, String fieldName) {
        try {
            Field field = clazz.getDeclaredField(fieldName);
            return field.getType();
        } catch (NoSuchFieldException e) {
            fail("Field " + fieldName + " not found in " + clazz.getSimpleName());
            return null;
        }
    }

    private boolean hasFieldAnnotation(Class<?> clazz, String fieldName,
            Class<? extends java.lang.annotation.Annotation> annotationClass) {
        try {
            Field field = clazz.getDeclaredField(fieldName);
            return field.isAnnotationPresent(annotationClass);
        } catch (NoSuchFieldException e) {
            fail("Field " + fieldName + " not found in " + clazz.getSimpleName());
            return false;
        }
    }
}