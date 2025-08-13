package com.satori.platform.validation;

import com.satori.platform.OnlineSatoriPlatformApp;
import com.satori.platform.domain.Course;
import com.satori.platform.domain.Lesson;
import com.satori.platform.domain.CourseClass;
import com.satori.platform.domain.Schedule;
import com.satori.platform.domain.CourseAssignment;
import com.satori.platform.domain.StudentProfile;
import com.satori.platform.domain.TeacherProfile;
import com.satori.platform.domain.User;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.LessonRepository;
import com.satori.platform.repository.CourseClassRepository;
import com.satori.platform.repository.ScheduleRepository;
import com.satori.platform.repository.StudentProfileRepository;
import com.satori.platform.repository.TeacherProfileRepository;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.service.EnhancedCourseService;
import com.satori.platform.service.EnhancedLessonService;
import com.satori.platform.service.EnhancedCourseClassService;
import com.satori.platform.service.ScheduleService;
import com.satori.platform.service.CourseAssignmentService;
import com.satori.platform.service.dto.CourseWithStatsDTO;
import com.satori.platform.service.dto.LessonDTO;
import com.satori.platform.service.dto.CourseClassWithStatsDTO;
import com.satori.platform.service.dto.ScheduleDTO;
import com.satori.platform.service.dto.CourseAssignmentDTO;

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
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;
import java.util.List;
import java.util.Set;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Comprehensive data flow validation test for course management system.
 * Tests complete data flow from database through all layers to API endpoints.
 * 
 * Requirements: 6.1, 6.2, 6.5
 */
@SpringBootTest(classes = OnlineSatoriPlatformApp.class, webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Transactional
public class CourseDataFlowValidationTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseClassRepository courseClassRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private TeacherProfileRepository teacherProfileRepository;

    @Autowired
    private EnhancedCourseService enhancedCourseService;

    @Autowired
    private EnhancedLessonService enhancedLessonService;

    @Autowired
    private EnhancedCourseClassService enhancedCourseClassService;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private CourseAssignmentService courseAssignmentService;

    private String baseUrl;
    private HttpHeaders headers;

    @BeforeEach
    void setUp() {
        baseUrl = "http://localhost:" + port + "/api";
        headers = new HttpHeaders();
        headers.set("Content-Type", "application/json");
    }

    @Test
    @DisplayName("Test complete course data flow through all layers")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testCompleteCourseDataFlowThroughAllLayers() {
        // Step 1: Create course at database layer
        Course course = createTestCourse();
        Course savedCourse = courseRepository.save(course);

        // Verify database persistence
        Optional<Course> dbCourse = courseRepository.findById(savedCourse.getId());
        assertThat(dbCourse).isPresent();
        assertThat(dbCourse.get().getTitle()).isEqualTo(course.getTitle());
        assertThat(dbCourse.get().getDescription()).isEqualTo(course.getDescription());
        assertThat(dbCourse.get().getDifficultyLevel()).isEqualTo(course.getDifficultyLevel());
        assertThat(dbCourse.get().getEstimatedDuration()).isEqualTo(course.getEstimatedDuration());

        // Step 2: Test service layer data transformation
        Optional<CourseWithStatsDTO> serviceResponse = enhancedCourseService.getCourseWithStats(savedCourse.getId());
        assertThat(serviceResponse).isPresent();
        CourseWithStatsDTO courseDTO = serviceResponse.get();
        assertThat(courseDTO.getId()).isEqualTo(savedCourse.getId());
        assertThat(courseDTO.getTitle()).isEqualTo(savedCourse.getTitle());
        assertThat(courseDTO.getDescription()).isEqualTo(savedCourse.getDescription());
        assertThat(courseDTO.getDifficultyLevel()).isEqualTo(savedCourse.getDifficultyLevel());

        // Step 3: Test API layer data consistency
        ResponseEntity<CourseWithStatsDTO> apiResponse = restTemplate.exchange(
                baseUrl + "/courses/" + savedCourse.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                CourseWithStatsDTO.class);

        assertThat(apiResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        CourseWithStatsDTO apiCourse = apiResponse.getBody();
        assertThat(apiCourse).isNotNull();
        assertThat(apiCourse.getId()).isEqualTo(savedCourse.getId());
        assertThat(apiCourse.getTitle()).isEqualTo(savedCourse.getTitle());
        assertThat(apiCourse.getDescription()).isEqualTo(savedCourse.getDescription());
    }

    @Test
    @DisplayName("Test lesson and class data consistency")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testLessonAndClassDataConsistency() {
        // Step 1: Create course and lesson chain
        Course course = createTestCourse();
        Course savedCourse = courseRepository.save(course);

        Lesson lesson = createTestLesson(savedCourse);
        Lesson savedLesson = lessonRepository.save(lesson);

        // Step 2: Create course class
        CourseClass courseClass = createTestCourseClass(savedCourse);
        CourseClass savedClass = courseClassRepository.save(courseClass);

        // Step 3: Verify data consistency across layers
        Optional<Lesson> dbLesson = lessonRepository.findById(savedLesson.getId());
        assertThat(dbLesson).isPresent();
        assertThat(dbLesson.get().getCourse().getId()).isEqualTo(savedCourse.getId());
        assertThat(dbLesson.get().getTitle()).isEqualTo(lesson.getTitle());
        assertThat(dbLesson.get().getContent()).isEqualTo(lesson.getContent());

        Optional<CourseClass> dbClass = courseClassRepository.findById(savedClass.getId());
        assertThat(dbClass).isPresent();
        assertThat(dbClass.get().getCourse().getId()).isEqualTo(savedCourse.getId());

        // Step 4: Test service layer data flow
        Optional<LessonDTO> serviceLesson = enhancedLessonService.findOne(savedLesson.getId());
        assertThat(serviceLesson).isPresent();
        assertThat(serviceLesson.get().getCourseId()).isEqualTo(savedCourse.getId());
        assertThat(serviceLesson.get().getTitle()).isEqualTo(savedLesson.getTitle());

        Optional<CourseClassWithStatsDTO> serviceClass = enhancedCourseClassService
                .findOneWithStats(savedClass.getId());
        assertThat(serviceClass).isPresent();
        assertThat(serviceClass.get().getCourseId()).isEqualTo(savedCourse.getId());

        // Step 5: Test API data consistency
        ResponseEntity<LessonDTO> lessonResponse = restTemplate.exchange(
                baseUrl + "/enhanced/lessons/" + savedLesson.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                LessonDTO.class);

        assertThat(lessonResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        LessonDTO apiLesson = lessonResponse.getBody();
        assertThat(apiLesson).isNotNull();
        assertThat(apiLesson.getId()).isEqualTo(savedLesson.getId());
        assertThat(apiLesson.getCourseId()).isEqualTo(savedCourse.getId());

        ResponseEntity<CourseClassWithStatsDTO> classResponse = restTemplate.exchange(
                baseUrl + "/admin/course-classes/" + savedClass.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                CourseClassWithStatsDTO.class);

        assertThat(classResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        CourseClassWithStatsDTO apiClass = classResponse.getBody();
        assertThat(apiClass).isNotNull();
        assertThat(apiClass.getId()).isEqualTo(savedClass.getId());
        assertThat(apiClass.getCourseId()).isEqualTo(savedCourse.getId());
    }

    @Test
    @DisplayName("Test scheduling and assignment data consistency")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testSchedulingAndAssignmentDataConsistency() {
        // Step 1: Create complete course structure
        Course course = createTestCourse();
        Course savedCourse = courseRepository.save(course);

        CourseClass courseClass = createTestCourseClass(savedCourse);
        CourseClass savedClass = courseClassRepository.save(courseClass);

        // Step 2: Create schedule
        Schedule schedule = createTestSchedule(savedClass);
        Schedule savedSchedule = scheduleRepository.save(schedule);

        // Step 3: Verify scheduling data consistency
        Optional<Schedule> dbSchedule = scheduleRepository.findById(savedSchedule.getId());
        assertThat(dbSchedule).isPresent();
        assertThat(dbSchedule.get().getCourseClass().getId()).isEqualTo(savedClass.getId());
        assertThat(dbSchedule.get().getStartTime()).isEqualTo(schedule.getStartTime());
        assertThat(dbSchedule.get().getEndTime()).isEqualTo(schedule.getEndTime());
        assertThat(dbSchedule.get().getDayOfWeek()).isEqualTo(schedule.getDayOfWeek());

        // Step 4: Test service layer scheduling
        Optional<ScheduleDTO> serviceSchedule = scheduleService.findOne(savedSchedule.getId());
        assertThat(serviceSchedule).isPresent();
        assertThat(serviceSchedule.get().getCourseClassId()).isEqualTo(savedClass.getId());
        assertThat(serviceSchedule.get().getStartTime()).isEqualTo(savedSchedule.getStartTime());
        assertThat(serviceSchedule.get().getEndTime()).isEqualTo(savedSchedule.getEndTime());

        // Step 5: Test schedule conflict detection
        List<Schedule> conflictingSchedules = scheduleService.findConflictingSchedules(
                savedSchedule.getStartTime(),
                savedSchedule.getEndTime(),
                savedSchedule.getDayOfWeek());
        assertThat(conflictingSchedules).contains(savedSchedule);

        // Step 6: Test API scheduling consistency
        ResponseEntity<ScheduleDTO> scheduleResponse = restTemplate.exchange(
                baseUrl + "/schedules/" + savedSchedule.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                ScheduleDTO.class);

        assertThat(scheduleResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        ScheduleDTO apiSchedule = scheduleResponse.getBody();
        assertThat(apiSchedule).isNotNull();
        assertThat(apiSchedule.getId()).isEqualTo(savedSchedule.getId());
        assertThat(apiSchedule.getCourseClassId()).isEqualTo(savedClass.getId());
    }

    @Test
    @DisplayName("Test student enrollment and progress tracking")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testStudentEnrollmentAndProgressTracking() {
        // Step 1: Create complete course and student structure
        Course course = createTestCourse();
        Course savedCourse = courseRepository.save(course);

        CourseClass courseClass = createTestCourseClass(savedCourse);
        CourseClass savedClass = courseClassRepository.save(courseClass);

        // Create student
        User user = createTestUser();
        User savedUser = userRepository.save(user);

        UserProfile userProfile = createTestUserProfile(savedUser);
        UserProfile savedProfile = userProfileRepository.save(userProfile);

        StudentProfile student = createTestStudentProfile(savedProfile);
        StudentProfile savedStudent = studentProfileRepository.save(student);

        // Step 2: Enroll student in class
        enhancedCourseClassService.enrollStudent(savedClass.getId(), savedStudent.getId());

        // Step 3: Verify enrollment data consistency
        Optional<CourseClass> enrolledClass = courseClassRepository.findById(savedClass.getId());
        assertThat(enrolledClass).isPresent();

        List<StudentProfile> enrolledStudents = enhancedCourseClassService.getEnrolledStudents(savedClass.getId());
        assertThat(enrolledStudents).hasSize(1);
        assertThat(enrolledStudents.get(0).getId()).isEqualTo(savedStudent.getId());

        // Step 4: Test progress tracking
        enhancedCourseService.updateStudentProgress(savedCourse.getId(), savedStudent.getId(), 75.0);

        Double progress = enhancedCourseService.getStudentProgress(savedCourse.getId(), savedStudent.getId());
        assertThat(progress).isEqualTo(75.0);

        // Step 5: Test API enrollment consistency
        ResponseEntity<CourseClassWithStatsDTO> classResponse = restTemplate.exchange(
                baseUrl + "/admin/course-classes/" + savedClass.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                CourseClassWithStatsDTO.class);

        assertThat(classResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        CourseClassWithStatsDTO apiClass = classResponse.getBody();
        assertThat(apiClass).isNotNull();
        assertThat(apiClass.getEnrolledStudents()).isEqualTo(1);

        // Step 6: Test course statistics consistency
        ResponseEntity<CourseWithStatsDTO> courseResponse = restTemplate.exchange(
                baseUrl + "/courses/" + savedCourse.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                CourseWithStatsDTO.class);

        assertThat(courseResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        CourseWithStatsDTO apiCourse = courseResponse.getBody();
        assertThat(apiCourse).isNotNull();
        assertThat(apiCourse.getTotalEnrollments()).isEqualTo(1);
    }

    @Test
    @DisplayName("Test teacher assignment and course management")
    @WithMockUser(authorities = { "ROLE_ADMIN" })
    void testTeacherAssignmentAndCourseManagement() {
        // Step 1: Create course and teacher
        Course course = createTestCourse();
        Course savedCourse = courseRepository.save(course);

        User teacherUser = createTestUser();
        teacherUser.setLogin("teacher" + System.currentTimeMillis());
        teacherUser.setEmail("teacher" + System.currentTimeMillis() + "@example.com");
        User savedTeacherUser = userRepository.save(teacherUser);

        UserProfile teacherProfile = createTestUserProfile(savedTeacherUser);
        UserProfile savedTeacherProfile = userProfileRepository.save(teacherProfile);

        TeacherProfile teacher = createTestTeacherProfile(savedTeacherProfile);
        TeacherProfile savedTeacher = teacherProfileRepository.save(teacher);

        // Step 2: Create course class and assign teacher
        CourseClass courseClass = createTestCourseClass(savedCourse);
        courseClass.setTeacher(savedTeacher);
        CourseClass savedClass = courseClassRepository.save(courseClass);

        // Step 3: Verify teacher assignment consistency
        Optional<CourseClass> assignedClass = courseClassRepository.findById(savedClass.getId());
        assertThat(assignedClass).isPresent();
        assertThat(assignedClass.get().getTeacher().getId()).isEqualTo(savedTeacher.getId());

        // Step 4: Test service layer teacher management
        List<CourseClass> teacherClasses = enhancedCourseClassService.findClassesByTeacher(savedTeacher.getId());
        assertThat(teacherClasses).hasSize(1);
        assertThat(teacherClasses.get(0).getId()).isEqualTo(savedClass.getId());

        // Step 5: Test course assignment service
        CourseAssignmentDTO assignment = new CourseAssignmentDTO();
        assignment.setCourseId(savedCourse.getId());
        assignment.setTeacherId(savedTeacher.getId());
        assignment.setAssignedDate(Instant.now());
        assignment.setActive(true);

        CourseAssignmentDTO savedAssignment = courseAssignmentService.save(assignment);
        assertThat(savedAssignment).isNotNull();
        assertThat(savedAssignment.getCourseId()).isEqualTo(savedCourse.getId());
        assertThat(savedAssignment.getTeacherId()).isEqualTo(savedTeacher.getId());

        // Step 6: Test API teacher assignment consistency
        ResponseEntity<CourseClassWithStatsDTO> classResponse = restTemplate.exchange(
                baseUrl + "/admin/course-classes/" + savedClass.getId(),
                HttpMethod.GET,
                new HttpEntity<>(headers),
                CourseClassWithStatsDTO.class);

        assertThat(classResponse.getStatusCode()).isEqualTo(HttpStatus.OK);
        CourseClassWithStatsDTO apiClass = classResponse.getBody();
        assertThat(apiClass).isNotNull();
        assertThat(apiClass.getTeacherId()).isEqualTo(savedTeacher.getId());
    }

    // Helper methods for creating test data
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

    private Lesson createTestLesson(Course course) {
        Lesson lesson = new Lesson();
        lesson.setCourse(course);
        lesson.setTitle("Test Lesson " + System.currentTimeMillis());
        lesson.setContent("Test lesson content");
        lesson.setOrderIndex(1);
        lesson.setDuration(60);
        lesson.setActive(true);
        lesson.setCreatedDate(Instant.now());
        return lesson;
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

    private Schedule createTestSchedule(CourseClass courseClass) {
        Schedule schedule = new Schedule();
        schedule.setCourseClass(courseClass);
        schedule.setDayOfWeek("MONDAY");
        schedule.setStartTime(LocalDateTime.now().plusDays(1).withHour(10).withMinute(0));
        schedule.setEndTime(LocalDateTime.now().plusDays(1).withHour(11).withMinute(30));
        schedule.setRecurring(true);
        schedule.setActive(true);
        return schedule;
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

    private TeacherProfile createTestTeacherProfile(UserProfile userProfile) {
        TeacherProfile teacher = new TeacherProfile();
        teacher.setUserProfile(userProfile);
        teacher.setEmployeeId("EMP" + System.currentTimeMillis());
        teacher.setHireDate(Instant.now().minusSeconds(86400 * 30)); // 30 days ago
        teacher.setDepartment("Japanese Language");
        teacher.setSpecialization("Grammar and Conversation");
        teacher.setQualifications("JLPT N1, Teaching Certificate");
        return teacher;
    }
}