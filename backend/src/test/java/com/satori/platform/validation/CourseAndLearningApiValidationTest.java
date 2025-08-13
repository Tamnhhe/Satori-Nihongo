package com.satori.platform.validation;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satori.platform.OnlineSatoriPlatformApp;
import com.satori.platform.domain.*;
import com.satori.platform.repository.*;
import com.satori.platform.service.dto.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Nested;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureWebMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.hamcrest.Matchers.*;
import static com.satori.platform.validation.TestDataBuilder.*;

/**
 * Comprehensive API validation tests for Course & Learning Management
 * endpoints.
 * Tests all 7 endpoints: courses, course-classes, lessons, enhanced/lessons,
 * schedules, course-assignments, and class-schedules.
 * 
 * Requirements: 5.1, 5.2, 5.5
 */
@SpringBootTest(classes = OnlineSatoriPlatformApp.class)
@AutoConfigureWebMvc
@ActiveProfiles("test")
@Transactional
public class CourseAndLearningApiValidationTest {

        // Test Constants
        private static final String ADMIN_ROLE = "ROLE_ADMIN";
        private static final String USER_ROLE = "ROLE_USER";
        private static final Long NON_EXISTENT_ID = 99999L;
        private static final String SCHEDULED_STATUS = "SCHEDULED";
        private static final String ACTIVE_STATUS = "ACTIVE";
        private static final int DEFAULT_PAGE_SIZE = 20;
        private static final int DEFAULT_PAGE_NUMBER = 0;

        // Test Data Constants
        private static final String TEST_COURSE_TITLE = "Test Japanese Course";
        private static final String TEST_COURSE_DESCRIPTION = "A comprehensive Japanese language course";
        private static final String TEST_LEVEL_BEGINNER = "Beginner";
        private static final String TEST_LEVEL_INTERMEDIATE = "Intermediate";
        private static final String TEST_LEVEL_ADVANCED = "Advanced";
        private static final int TEST_COURSE_DURATION = 120;
        private static final double TEST_COURSE_PRICE = 100.0;
        private static final String TEST_CLASS_NAME = "Morning Class A";
        private static final int TEST_MAX_STUDENTS = 20;
        private static final int TEST_CURRENT_STUDENTS = 5;
        private static final String TEST_LESSON_TITLE = "Introduction to Hiragana";
        private static final String TEST_LESSON_CONTENT = "Basic Hiragana characters and pronunciation";
        private static final int TEST_LESSON_DURATION = 60;
        private static final int TEST_LESSON_ORDER = 1;

        @Autowired
        private MockMvc mockMvc;

        @Autowired
        private ObjectMapper objectMapper;

        @Autowired
        private CourseRepository courseRepository;

        @Autowired
        private CourseClassRepository courseClassRepository;

        @Autowired
        private LessonRepository lessonRepository;

        @Autowired
        private ScheduleRepository scheduleRepository;

        @Autowired
        private UserRepository userRepository;

        @Autowired
        private TeacherProfileRepository teacherProfileRepository;

        @Autowired
        private StudentProfileRepository studentProfileRepository;

        private User testTeacher;
        private User testStudent;
        private Course testCourse;
        private CourseClass testCourseClass;
        private Lesson testLesson;
        private Schedule testSchedule;

        @BeforeEach
        void setUp() {
                testTeacher = createTestTeacher();
                testStudent = createTestStudent();
                testCourse = createTestCourse();
                testCourseClass = createTestCourseClass();
                testLesson = createTestLesson();
                testSchedule = createTestSchedule();
        }

        private User createTestTeacher() {
                User teacher = new User();
                teacher.setLogin("testteacher");
                teacher.setEmail("teacher@test.com");
                teacher.setFirstName("Test");
                teacher.setLastName("Teacher");
                teacher.setActivated(true);
                teacher = userRepository.save(teacher);

                TeacherProfile teacherProfile = new TeacherProfile();
                teacherProfile.setUser(teacher);
                teacherProfile.setSpecialization("Japanese Language");
                teacherProfile.setExperience(5);
                teacherProfileRepository.save(teacherProfile);

                return teacher;
        }

        private User createTestStudent() {
                User student = new User();
                student.setLogin("teststudent");
                student.setEmail("student@test.com");
                student.setFirstName("Test");
                student.setLastName("Student");
                student.setActivated(true);
                student = userRepository.save(student);

                StudentProfile studentProfile = new StudentProfile();
                studentProfile.setUser(student);
                studentProfile.setLevel("Beginner");
                studentProfileRepository.save(studentProfile);

                return student;
        }

        private Course createTestCourse() {
                Course course = new Course();
                course.setTitle(TEST_COURSE_TITLE);
                course.setDescription(TEST_COURSE_DESCRIPTION);
                course.setLevel(TEST_LEVEL_BEGINNER);
                course.setDuration(TEST_COURSE_DURATION);
                course.setPrice(TEST_COURSE_PRICE);
                course.setIsActive(true);
                return courseRepository.save(course);
        }

        private CourseClass createTestCourseClass() {
                CourseClass courseClass = new CourseClass();
                courseClass.setCourse(testCourse);
                courseClass.setTeacher(testTeacher);
                courseClass.setClassName(TEST_CLASS_NAME);
                courseClass.setMaxStudents(TEST_MAX_STUDENTS);
                courseClass.setCurrentStudents(TEST_CURRENT_STUDENTS);
                courseClass.setStartDate(LocalDate.now().plusDays(7));
                courseClass.setEndDate(LocalDate.now().plusDays(90));
                return courseClassRepository.save(courseClass);
        }

        private Lesson createTestLesson() {
                Lesson lesson = new Lesson();
                lesson.setCourse(testCourse);
                lesson.setTitle(TEST_LESSON_TITLE);
                lesson.setContent(TEST_LESSON_CONTENT);
                lesson.setOrderIndex(TEST_LESSON_ORDER);
                lesson.setDuration(TEST_LESSON_DURATION);
                return lessonRepository.save(lesson);
        }

        private Schedule createTestSchedule() {
                Schedule schedule = new Schedule();
                schedule.setCourseClass(testCourseClass);
                schedule.setLesson(testLesson);
                schedule.setScheduledDate(LocalDateTime.now().plusDays(1));
                schedule.setDuration(60);
                schedule.setStatus(SCHEDULED_STATUS);
                return scheduleRepository.save(schedule);
        }

        // ========== Helper Methods ==========

        /**
         * Performs a GET request and validates paginated response structure
         */
        private ResultActions performGetWithPagination(String url) throws Exception {
                return mockMvc.perform(get(url)
                                .param("page", String.valueOf(DEFAULT_PAGE_NUMBER))
                                .param("size", String.valueOf(DEFAULT_PAGE_SIZE)))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.content").isArray())
                                .andExpect(jsonPath("$.totalElements").exists())
                                .andExpect(jsonPath("$.totalPages").exists());
        }

        /**
         * Validates common course fields in JSON response
         */
        private ResultActions validateCourseFields(ResultActions resultActions, String jsonPath) throws Exception {
                return resultActions
                                .andExpect(jsonPath(jsonPath + ".id").exists())
                                .andExpect(jsonPath(jsonPath + ".title").exists())
                                .andExpect(jsonPath(jsonPath + ".description").exists())
                                .andExpect(jsonPath(jsonPath + ".level").exists())
                                .andExpect(jsonPath(jsonPath + ".duration").exists())
                                .andExpect(jsonPath(jsonPath + ".price").exists())
                                .andExpect(jsonPath(jsonPath + ".isActive").exists());
        }

        /**
         * Validates common lesson fields in JSON response
         */
        private ResultActions validateLessonFields(ResultActions resultActions, String jsonPath) throws Exception {
                return resultActions
                                .andExpect(jsonPath(jsonPath + ".id").exists())
                                .andExpect(jsonPath(jsonPath + ".title").exists())
                                .andExpect(jsonPath(jsonPath + ".content").exists())
                                .andExpect(jsonPath(jsonPath + ".orderIndex").exists())
                                .andExpect(jsonPath(jsonPath + ".duration").exists());
        }

        /**
         * Validates common schedule fields in JSON response
         */
        private ResultActions validateScheduleFields(ResultActions resultActions, String jsonPath) throws Exception {
                return resultActions
                                .andExpect(jsonPath(jsonPath + ".id").exists())
                                .andExpect(jsonPath(jsonPath + ".scheduledDate").exists())
                                .andExpect(jsonPath(jsonPath + ".duration").exists())
                                .andExpect(jsonPath(jsonPath + ".status").exists());
        }

        /**
         * Performs a POST request with JSON content
         */
        private ResultActions performPostWithJson(String url, Object content) throws Exception {
                return mockMvc.perform(post(url)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(content)));
        }

        /**
         * Performs a PUT request with JSON content
         */
        private ResultActions performPutWithJson(String url, Object content) throws Exception {
                return mockMvc.perform(put(url)
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(content)));
        }

        /**
         * Validates successful creation response
         */
        private ResultActions expectCreatedResponse(ResultActions resultActions) throws Exception {
                return resultActions
                                .andExpect(status().isCreated())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
        }

        /**
         * Validates successful update response
         */
        private ResultActions expectOkResponse(ResultActions resultActions) throws Exception {
                return resultActions
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON));
        }

        // ========== /api/courses - EnhancedCourseResource Tests ==========

        @Nested
        @DisplayName("Course Management Tests")
        class CourseManagementTests {

                @Test
                @DisplayName("GET /api/courses - Should return all courses with stats")
                @WithMockUser(authorities = { ADMIN_ROLE })
                void testGetAllCoursesWithStats() throws Exception {
                        ResultActions result = mockMvc.perform(get("/api/courses")
                                        .param("page", String.valueOf(DEFAULT_PAGE_NUMBER))
                                        .param("size", String.valueOf(DEFAULT_PAGE_SIZE))
                                        .param("sort", "id,asc"))
                                        .andExpect(status().isOk())
                                        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                        .andExpect(jsonPath("$.content").isArray())
                                        .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                                        .andExpect(jsonPath("$.totalElements").exists())
                                        .andExpect(jsonPath("$.totalPages").exists());

                        validateCourseFields(result, "$.content[0]");
                }

                @Test
                @DisplayName("GET /api/courses/{id} - Should return specific course with stats")
                @WithMockUser(authorities = { ADMIN_ROLE })
                void testGetCourseWithStats() throws Exception {
                        mockMvc.perform(get("/api/courses/{id}", testCourse.getId()))
                                        .andExpect(status().isOk())
                                        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                        .andExpect(jsonPath("$.id").value(testCourse.getId()))
                                        .andExpect(jsonPath("$.title").value(testCourse.getTitle()))
                                        .andExpect(jsonPath("$.description").value(testCourse.getDescription()))
                                        .andExpect(jsonPath("$.level").value(testCourse.getLevel()))
                                        .andExpect(jsonPath("$.duration").value(testCourse.getDuration()))
                                        .andExpect(jsonPath("$.price").value(testCourse.getPrice()))
                                        .andExpect(jsonPath("$.isActive").value(testCourse.getIsActive()));
                }

                @Test
                @DisplayName("POST /api/courses - Should create new course")
                @WithMockUser(authorities = { ADMIN_ROLE })
                void testCreateCourse() throws Exception {
                        CourseWithStatsDTO newCourse = TestDataBuilder.aCourse()
                                        .withTitle("Advanced Japanese Course")
                                        .withDescription("Advanced level Japanese language course")
                                        .withLevel(TEST_LEVEL_ADVANCED)
                                        .withDuration(180)
                                        .withPrice(200.0)
                                        .build();

                        expectCreatedResponse(performPostWithJson("/api/courses", newCourse))
                                        .andExpect(jsonPath("$.title").value("Advanced Japanese Course"))
                                        .andExpect(jsonPath("$.description")
                                                        .value("Advanced level Japanese language course"))
                                        .andExpect(jsonPath("$.level").value(TEST_LEVEL_ADVANCED))
                                        .andExpect(jsonPath("$.duration").value(180))
                                        .andExpect(jsonPath("$.price").value(200.0))
                                        .andExpect(jsonPath("$.isActive").value(true));
                }

                @Test
                @DisplayName("PUT /api/courses/{id} - Should update existing course")
                @WithMockUser(authorities = { ADMIN_ROLE })
                void testUpdateCourse() throws Exception {
                        CourseWithStatsDTO updatedCourse = TestDataBuilder.aCourse()
                                        .withTitle("Updated Japanese Course")
                                        .withDescription("Updated comprehensive Japanese language course")
                                        .withLevel(TEST_LEVEL_INTERMEDIATE)
                                        .withDuration(150)
                                        .withPrice(150.0)
                                        .build();
                        updatedCourse.setId(testCourse.getId());

                        expectOkResponse(performPutWithJson("/api/courses/" + testCourse.getId(), updatedCourse))
                                        .andExpect(jsonPath("$.id").value(testCourse.getId()))
                                        .andExpect(jsonPath("$.title").value("Updated Japanese Course"))
                                        .andExpect(jsonPath("$.level").value(TEST_LEVEL_INTERMEDIATE))
                                        .andExpect(jsonPath("$.duration").value(150))
                                        .andExpect(jsonPath("$.price").value(150.0));
                }

                @Test
                @DisplayName("DELETE /api/courses/{id} - Should delete course")
                @WithMockUser(authorities = { ADMIN_ROLE })
                void testDeleteCourse() throws Exception {
                        Course courseToDelete = new Course();
                        courseToDelete.setTitle("Course to Delete");
                        courseToDelete.setDescription("This course will be deleted");
                        courseToDelete.setLevel("Beginner");
                        courseToDelete.setDuration(60);
                        courseToDelete.setPrice(50.0);
                        courseToDelete.setIsActive(true);
                        courseToDelete = courseRepository.save(courseToDelete);

                        mockMvc.perform(delete("/api/courses/{id}", courseToDelete.getId()))
                                        .andExpect(status().isNoContent());

                        // Verify course is deleted
                        mockMvc.perform(get("/api/courses/{id}", courseToDelete.getId()))
                                        .andExpect(status().isNotFound());
                }
        }

        @Nested
        @DisplayName("Course Class Management Tests")
        class CourseClassManagementTests {

                @Test
                @DisplayName("GET /api/admin/course-classes - Should return all course classes")
                @WithMockUser(authorities = { ADMIN_ROLE })
                void testGetAllCourseClasses() throws Exception {
                        performGetWithPagination("/api/admin/course-classes")
                                        .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                                        .andExpect(jsonPath("$.content[0].id").exists())
                                        .andExpect(jsonPath("$.content[0].className").exists())
                                        .andExpect(jsonPath("$.content[0].maxStudents").exists())
                                        .andExpect(jsonPath("$.content[0].currentStudents").exists())
                                        .andExpect(jsonPath("$.content[0].startDate").exists())
                                        .andExpect(jsonPath("$.content[0].endDate").exists());
                }

                @Test
                @DisplayName("GET /api/admin/course-classes/{id} - Should return specific course class")
                @WithMockUser(authorities = { ADMIN_ROLE })
                void testGetCourseClass() throws Exception {
                        mockMvc.perform(get("/api/admin/course-classes/{id}", testCourseClass.getId()))
                                        .andExpect(status().isOk())
                                        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                        .andExpect(jsonPath("$.id").value(testCourseClass.getId()))
                                        .andExpect(jsonPath("$.className").value(testCourseClass.getClassName()))
                                        .andExpect(jsonPath("$.maxStudents").value(testCourseClass.getMaxStudents()))
                                        .andExpect(jsonPath("$.currentStudents")
                                                        .value(testCourseClass.getCurrentStudents()));
                }

                @Test
                @DisplayName("POST /api/admin/course-classes - Should create new course class")
                @WithMockUser(authorities = { ADMIN_ROLE })
                void testCreateCourseClass() throws Exception {
                        CourseClassWithStatsDTO newCourseClass = TestDataBuilder.aCourseClass()
                                        .withCourseId(testCourse.getId())
                                        .withTeacherId(testTeacher.getId())
                                        .withClassName("Evening Class B")
                                        .withMaxStudents(15)
                                        .withCurrentStudents(0)
                                        .withStartDate(LocalDate.now().plusDays(14))
                                        .withEndDate(LocalDate.now().plusDays(104))
                                        .build();

                        expectCreatedResponse(performPostWithJson("/api/admin/course-classes", newCourseClass))
                                        .andExpect(jsonPath("$.className").value("Evening Class B"))
                                        .andExpect(jsonPath("$.maxStudents").value(15))
                                        .andExpect(jsonPath("$.currentStudents").value(0));
                }
        }

        @Nested
        @DisplayName("Lesson Management Tests")
        class LessonManagementTests {

                @Test
                @DisplayName("GET /api/lessons - Should return all lessons")
                @WithMockUser(authorities = { USER_ROLE })
                void testGetAllLessons() throws Exception {
                        ResultActions result = performGetWithPagination("/api/lessons")
                                        .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))));

                        validateLessonFields(result, "$.content[0]");
                }

                @Test
                @DisplayName("GET /api/lessons/{id} - Should return specific lesson")
                @WithMockUser(authorities = { USER_ROLE })
                void testGetLesson() throws Exception {
                        mockMvc.perform(get("/api/lessons/{id}", testLesson.getId()))
                                        .andExpect(status().isOk())
                                        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                        .andExpect(jsonPath("$.id").value(testLesson.getId()))
                                        .andExpect(jsonPath("$.title").value(testLesson.getTitle()))
                                        .andExpect(jsonPath("$.content").value(testLesson.getContent()))
                                        .andExpect(jsonPath("$.orderIndex").value(testLesson.getOrderIndex()))
                                        .andExpect(jsonPath("$.duration").value(testLesson.getDuration()));
                }

                @Test
                @DisplayName("POST /api/lessons - Should create new lesson")
                @WithMockUser(authorities = { ADMIN_ROLE })
                void testCreateLesson() throws Exception {
                        LessonDTO newLesson = new LessonDTO();
                        newLesson.setCourseId(testCourse.getId());
                        newLesson.setTitle("Katakana Basics");
                        newLesson.setContent("Introduction to Katakana characters");
                        newLesson.setOrderIndex(2);
                        newLesson.setDuration(45);

                        mockMvc.perform(post("/api/lessons")
                                        .contentType(MediaType.APPLICATION_JSON)
                                        .content(objectMapper.writeValueAsString(newLesson)))
                                        .andExpect(status().isCreated())
                                        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                        .andExpect(jsonPath("$.title").value("Katakana Basics"))
                                        .andExpect(jsonPath("$.content").value("Introduction to Katakana characters"))
                                        .andExpect(jsonPath("$.orderIndex").value(2))
                                        .andExpect(jsonPath("$.duration").value(45));
                }
        }

        // ========== /api/enhanced/lessons - EnhancedLessonResource Tests ==========

        @Test
        @DisplayName("GET /api/enhanced/lessons - Should return enhanced lessons with additional data")
        @WithMockUser(authorities = { "ROLE_ADMIN" })
        void testGetEnhancedLessons() throws Exception {
                mockMvc.perform(get("/api/enhanced/lessons")
                                .param("courseId", testCourse.getId().toString()))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$").isArray())
                                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                                .andExpect(jsonPath("$[0].id").exists())
                                .andExpect(jsonPath("$[0].title").exists())
                                .andExpect(jsonPath("$[0].content").exists())
                                .andExpect(jsonPath("$[0].orderIndex").exists())
                                .andExpect(jsonPath("$[0].duration").exists());
        }

        @Test
        @DisplayName("GET /api/enhanced/lessons/{id}/content - Should return lesson content with media")
        @WithMockUser(authorities = { "ROLE_USER" })
        void testGetEnhancedLessonContent() throws Exception {
                mockMvc.perform(get("/api/enhanced/lessons/{id}/content", testLesson.getId()))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.lessonId").value(testLesson.getId()))
                                .andExpect(jsonPath("$.content").exists())
                                .andExpect(jsonPath("$.mediaFiles").exists());
        }

        // ========== /api/schedules - ScheduleResource Tests ==========

        @Test
        @DisplayName("GET /api/schedules - Should return all schedules")
        @WithMockUser(authorities = { "ROLE_USER" })
        void testGetAllSchedules() throws Exception {
                mockMvc.perform(get("/api/schedules")
                                .param("page", "0")
                                .param("size", "20"))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.content").isArray())
                                .andExpect(jsonPath("$.content", hasSize(greaterThanOrEqualTo(1))))
                                .andExpect(jsonPath("$.content[0].id").exists())
                                .andExpect(jsonPath("$.content[0].scheduledDate").exists())
                                .andExpect(jsonPath("$.content[0].duration").exists())
                                .andExpect(jsonPath("$.content[0].status").exists());
        }

        @Test
        @DisplayName("GET /api/schedules/class/{classId} - Should return schedules for specific class")
        @WithMockUser(authorities = { "ROLE_USER" })
        void testGetSchedulesByClass() throws Exception {
                mockMvc.perform(get("/api/schedules/class/{classId}", testCourseClass.getId()))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$").isArray())
                                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                                .andExpect(jsonPath("$[0].id").exists())
                                .andExpect(jsonPath("$[0].scheduledDate").exists())
                                .andExpect(jsonPath("$[0].duration").exists())
                                .andExpect(jsonPath("$[0].status").exists());
        }

        @Test
        @DisplayName("POST /api/schedules - Should create new schedule")
        @WithMockUser(authorities = { "ROLE_ADMIN" })
        void testCreateSchedule() throws Exception {
                ScheduleDTO newSchedule = new ScheduleDTO();
                newSchedule.setCourseClassId(testCourseClass.getId());
                newSchedule.setLessonId(testLesson.getId());
                newSchedule.setScheduledDate(LocalDateTime.now().plusDays(2));
                newSchedule.setDuration(60);
                newSchedule.setStatus("SCHEDULED");

                mockMvc.perform(post("/api/schedules")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(newSchedule)))
                                .andExpect(status().isCreated())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.duration").value(60))
                                .andExpect(jsonPath("$.status").value("SCHEDULED"));
        }

        // ========== /api/admin/course-assignments - CourseAssignmentResource Tests
        // ==========

        @Test
        @DisplayName("GET /api/admin/course-assignments - Should return all course assignments")
        @WithMockUser(authorities = { "ROLE_ADMIN" })
        void testGetAllCourseAssignments() throws Exception {
                mockMvc.perform(get("/api/admin/course-assignments")
                                .param("page", "0")
                                .param("size", "20"))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.content").isArray())
                                .andExpect(jsonPath("$.totalElements").exists())
                                .andExpect(jsonPath("$.totalPages").exists());
        }

        @Test
        @DisplayName("POST /api/admin/course-assignments - Should create course assignment")
        @WithMockUser(authorities = { "ROLE_ADMIN" })
        void testCreateCourseAssignment() throws Exception {
                CourseAssignmentDTO assignment = new CourseAssignmentDTO();
                assignment.setCourseId(testCourse.getId());
                assignment.setTeacherId(testTeacher.getId());
                assignment.setAssignmentDate(LocalDate.now());
                assignment.setStatus("ACTIVE");

                mockMvc.perform(post("/api/admin/course-assignments")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(assignment)))
                                .andExpect(status().isCreated())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.status").value("ACTIVE"));
        }

        // ========== /api/admin/class-schedules - ClassScheduleResource Tests
        // ==========

        @Test
        @DisplayName("GET /api/admin/class-schedules - Should return all class schedules")
        @WithMockUser(authorities = { "ROLE_ADMIN" })
        void testGetAllClassSchedules() throws Exception {
                mockMvc.perform(get("/api/admin/class-schedules")
                                .param("page", "0")
                                .param("size", "20"))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.content").isArray())
                                .andExpect(jsonPath("$.totalElements").exists())
                                .andExpect(jsonPath("$.totalPages").exists());
        }

        @Test
        @DisplayName("GET /api/admin/class-schedules/conflicts - Should check for schedule conflicts")
        @WithMockUser(authorities = { "ROLE_ADMIN" })
        void testCheckScheduleConflicts() throws Exception {
                mockMvc.perform(get("/api/admin/class-schedules/conflicts")
                                .param("teacherId", testTeacher.getId().toString())
                                .param("startDate", LocalDateTime.now().plusDays(1).toString())
                                .param("endDate", LocalDateTime.now().plusDays(1).plusHours(1).toString()))
                                .andExpect(status().isOk())
                                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                                .andExpect(jsonPath("$.hasConflicts").exists())
                                .andExpect(jsonPath("$.conflicts").isArray());
        }

        // ========== Authentication and Authorization Tests ==========

        @Test
        @DisplayName("Should require authentication for admin endpoints")
        void testAuthenticationRequired() throws Exception {
                mockMvc.perform(get("/api/admin/course-classes"))
                                .andExpect(status().isUnauthorized());

                mockMvc.perform(get("/api/admin/course-assignments"))
                                .andExpect(status().isUnauthorized());

                mockMvc.perform(get("/api/admin/class-schedules"))
                                .andExpect(status().isUnauthorized());
        }

        @Test
        @DisplayName("Should require admin role for admin endpoints")
        @WithMockUser(authorities = { "ROLE_USER" })
        void testAdminRoleRequired() throws Exception {
                mockMvc.perform(get("/api/admin/course-classes"))
                                .andExpect(status().isForbidden());

                mockMvc.perform(post("/api/admin/course-assignments")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content("{}"))
                                .andExpect(status().isForbidden());
        }

        // ========== Error Handling Tests ==========

        @Test
        @DisplayName("Should handle not found errors gracefully")
        @WithMockUser(authorities = { "ROLE_USER" })
        void testNotFoundHandling() throws Exception {
                mockMvc.perform(get("/api/courses/{id}", 99999L))
                                .andExpect(status().isNotFound());

                mockMvc.perform(get("/api/lessons/{id}", 99999L))
                                .andExpect(status().isNotFound());

                mockMvc.perform(get("/api/schedules/class/{classId}", 99999L))
                                .andExpect(status().isOk())
                                .andExpect(jsonPath("$").isArray())
                                .andExpect(jsonPath("$", hasSize(0)));
        }

        @Test
        @DisplayName("Should validate request data")
        @WithMockUser(authorities = { "ROLE_ADMIN" })
        void testRequestValidation() throws Exception {
                // Test invalid course creation
                CourseWithStatsDTO invalidCourse = new CourseWithStatsDTO();
                // Missing required fields

                mockMvc.perform(post("/api/courses")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidCourse)))
                                .andExpect(status().isBadRequest());

                // Test invalid lesson creation
                LessonDTO invalidLesson = new LessonDTO();
                // Missing required fields

                mockMvc.perform(post("/api/lessons")
                                .contentType(MediaType.APPLICATION_JSON)
                                .content(objectMapper.writeValueAsString(invalidLesson)))
                                .andExpect(status().isBadRequest());
        }
}