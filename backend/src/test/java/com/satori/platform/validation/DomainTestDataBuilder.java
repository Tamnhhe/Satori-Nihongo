package com.satori.platform.validation;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.*;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;

/**
 * Builder class for creating test domain entities.
 * Provides fluent API for test data creation with sensible defaults.
 */
public class DomainTestDataBuilder {

    // UserProfile builders
    public UserProfile createUserProfile(String username, String email, Role role) {
        UserProfile userProfile = new UserProfile();
        userProfile.setUsername(username);
        userProfile.setPasswordHash("hashedpassword");
        userProfile.setEmail(email);
        userProfile.setFullName("Test User " + username);
        userProfile.setRole(role);
        userProfile.setActivated(true);
        userProfile.setCreatedDate(Instant.now());
        userProfile.setLastModifiedDate(Instant.now());
        return userProfile;
    }

    public UserProfile createTeacherProfile(String username, String email) {
        return createUserProfile(username, email, Role.GIANG_VIEN);
    }

    public UserProfile createStudentProfile(String username, String email) {
        return createUserProfile(username, email, Role.HOC_VIEN);
    }

    public UserProfile createAdminProfile(String username, String email) {
        return createUserProfile(username, email, Role.ADMIN);
    }

    // Course builders
    public Course createCourse(String courseCode, String title, UserProfile teacher) {
        Course course = new Course();
        course.setCourseCode(courseCode);
        course.setTitle(title);
        course.setDescription("Test course description for " + title);
        course.setTeacher(teacher);
        course.setCreatedDate(Instant.now());
        course.setLastModifiedDate(Instant.now());
        return course;
    }

    public Course createCourseWithDefaults(String courseCode, UserProfile teacher) {
        return createCourse(courseCode, "Test Course " + courseCode, teacher);
    }

    // Lesson builders
    public Lesson createLesson(String title, String content, Course course) {
        Lesson lesson = new Lesson();
        lesson.setTitle(title);
        lesson.setContent(content);
        lesson.setCourse(course);
        lesson.setPosition(1);
        return lesson;
    }

    public Lesson createLessonWithDefaults(Course course) {
        return createLesson("Test Lesson", "Test lesson content", course);
    }

    // Quiz builders
    public Quiz createQuiz(String title, String description, Course course) {
        Quiz quiz = new Quiz();
        quiz.setTitle(title);
        quiz.setDescription(description);
        quiz.setTimeLimit(60); // 60 minutes default
        quiz.setIsActive(true);
        quiz.setCreatedDate(Instant.now());
        quiz.setLastModifiedDate(Instant.now());
        return quiz;
    }

    public Quiz createQuizWithDefaults(Course course) {
        return createQuiz("Test Quiz", "Test quiz description", course);
    }

    // Question builders
    public Question createQuestion(String questionText, String correctAnswer, QuestionType type) {
        Question question = new Question();
        question.setQuestionText(questionText);
        question.setCorrectAnswer(correctAnswer);
        question.setQuestionType(type);
        question.setPoints(1.0);
        return question;
    }

    public Question createMultipleChoiceQuestion(String questionText, String correctAnswer) {
        return createQuestion(questionText, correctAnswer, QuestionType.MULTIPLE_CHOICE);
    }

    // StudentProfile builders
    public StudentProfile createStudentProfile(UserProfile userProfile) {
        StudentProfile studentProfile = new StudentProfile();
        studentProfile.setUserProfile(userProfile);
        studentProfile.setStudentId("STU" + System.currentTimeMillis());
        studentProfile.setEnrollmentDate(LocalDateTime.now());
        return studentProfile;
    }

    // TeacherProfile builders
    public TeacherProfile createTeacherProfile(UserProfile userProfile) {
        TeacherProfile teacherProfile = new TeacherProfile();
        teacherProfile.setUserProfile(userProfile);
        teacherProfile.setEmployeeId("EMP" + System.currentTimeMillis());
        teacherProfile.setHireDate(LocalDateTime.now());
        teacherProfile.setDepartment("Test Department");
        return teacherProfile;
    }

    // CourseClass builders
    public CourseClass createCourseClass(String classCode, Course course, TeacherProfile teacher) {
        CourseClass courseClass = new CourseClass();
        courseClass.setClassCode(classCode);
        courseClass.setCourse(course);
        courseClass.setTeacher(teacher);
        courseClass.setCapacity(30);
        courseClass.setCurrentEnrollment(0);
        courseClass.setStartDate(LocalDateTime.now());
        courseClass.setEndDate(LocalDateTime.now().plusMonths(3));
        return courseClass;
    }

    // Schedule builders
    public Schedule createSchedule(CourseClass courseClass, String dayOfWeek, String startTime, String endTime) {
        Schedule schedule = new Schedule();
        schedule.setCourseClass(courseClass);
        schedule.setDayOfWeek(dayOfWeek);
        schedule.setStartTime(startTime);
        schedule.setEndTime(endTime);
        return schedule;
    }

    // StudentQuiz builders
    public StudentQuiz createStudentQuiz(StudentProfile student, Quiz quiz) {
        StudentQuiz studentQuiz = new StudentQuiz();
        studentQuiz.setStudent(student);
        studentQuiz.setQuiz(quiz);
        studentQuiz.setStartTime(Instant.now());
        studentQuiz.setStatus(QuizStatus.IN_PROGRESS);
        return studentQuiz;
    }

    // Flashcard builders
    public Flashcard createFlashcard(String front, String back, Lesson lesson) {
        Flashcard flashcard = new Flashcard();
        flashcard.setFront(front);
        flashcard.setBack(back);
        flashcard.setLesson(lesson);
        flashcard.setPosition(1);
        return flashcard;
    }

    // FileMetaData builders
    public FileMetaData createFileMetaData(String fileName, String originalName, String mimeType,
            Long fileSize, Lesson lesson, UserProfile uploadedBy) {
        FileMetaData fileMetaData = new FileMetaData();
        fileMetaData.setFileName(fileName);
        fileMetaData.setOriginalName(originalName);
        fileMetaData.setMimeType(mimeType);
        fileMetaData.setFileSize(fileSize);
        fileMetaData.setChecksum("checksum" + System.currentTimeMillis());
        fileMetaData.setFolderPath("/uploads/lessons");
        fileMetaData.setDescription("Test file description");
        fileMetaData.setIsPublic(true);
        fileMetaData.setUploadDate(Instant.now());
        fileMetaData.setLastAccessedDate(Instant.now());
        fileMetaData.setDownloadCount(0);
        fileMetaData.setLesson(lesson);
        fileMetaData.setUploadedBy(uploadedBy);
        return fileMetaData;
    }

    // NotificationDelivery builders
    public NotificationDelivery createNotificationDelivery(Long recipientId, NotificationType type,
            String channel, String subject) {
        NotificationDelivery notification = new NotificationDelivery();
        notification.setRecipientId(recipientId);
        notification.setNotificationType(type);
        notification.setDeliveryChannel(channel);
        notification.setSubject(subject);
        notification.setContent("Test notification content for " + subject);
        notification.setStatus(DeliveryStatus.PENDING);
        notification.setCreatedAt(Instant.now());
        notification.setScheduledAt(Instant.now().plus(1, ChronoUnit.HOURS));
        notification.setRetryCount(0);
        notification.setMaxRetries(3);
        return notification;
    }

    // NotificationPreference builders
    public NotificationPreference createNotificationPreference(UserProfile userProfile,
            NotificationType type, boolean enabled) {
        NotificationPreference preference = new NotificationPreference();
        preference.setUserProfile(userProfile);
        preference.setNotificationType(type);
        preference.setEnabled(enabled);
        return preference;
    }

    // AuditLog builders
    public AuditLog createAuditLog(String username, AuditAction action, String resourceType, Long resourceId) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUsername(username);
        auditLog.setAction(action);
        auditLog.setResourceType(resourceType);
        auditLog.setResourceId(resourceId);
        auditLog.setTimestamp(Instant.now());
        auditLog.setIpAddress("192.168.1.1");
        auditLog.setUserAgent("Test User Agent");
        auditLog.setSuccess(true);
        auditLog.setDetails("Test audit log entry");
        return auditLog;
    }

    // GiftCode builders
    public GiftCode createGiftCode(String code, Course course, UserProfile createdBy) {
        GiftCode giftCode = new GiftCode();
        giftCode.setCode(code);
        giftCode.setCourse(course);
        giftCode.setCreatedBy(createdBy);
        giftCode.setCreatedDate(LocalDateTime.now());
        giftCode.setExpiryDate(LocalDateTime.now().plusDays(30));
        giftCode.setActive(true);
        giftCode.setMaxUses(10);
        giftCode.setCurrentUses(0);
        giftCode.setDescription("Test gift code");
        return giftCode;
    }

    // Utility methods for creating multiple entities
    public List<UserProfile> createMultipleUsers(int count, Role role) {
        List<UserProfile> users = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            users.add(createUserProfile("user" + i, "user" + i + "@test.com", role));
        }
        return users;
    }

    public List<Course> createMultipleCourses(int count, UserProfile teacher) {
        List<Course> courses = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            courses.add(createCourse("COURSE" + i, "Course " + i, teacher));
        }
        return courses;
    }

    public List<Lesson> createMultipleLessons(int count, Course course) {
        List<Lesson> lessons = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            lessons.add(createLesson("Lesson " + i, "Content " + i, course));
        }
        return lessons;
    }

    public List<Quiz> createMultipleQuizzes(int count, Course course) {
        List<Quiz> quizzes = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            quizzes.add(createQuiz("Quiz " + i, "Description " + i, course));
        }
        return quizzes;
    }

    public List<FileMetaData> createMultipleFileMetaData(int count, Lesson lesson, UserProfile uploadedBy) {
        List<FileMetaData> files = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            files.add(createFileMetaData(
                    "file-" + i + ".txt",
                    "File " + i + ".txt",
                    "text/plain",
                    512L,
                    lesson,
                    uploadedBy));
        }
        return files;
    }
}