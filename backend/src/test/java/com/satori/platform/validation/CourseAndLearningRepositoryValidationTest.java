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
 * Comprehensive validation tests for course and learning repositories.
 * Tests CourseRepository, LessonRepository, CourseClassRepository, and
 * ScheduleRepository
 * operations including course assignment and scheduling repositories.
 * 
 * Requirements: 3.1, 3.2, 3.5
 */
@ApiValidationTestConfiguration
class CourseAndLearningRepositoryValidationTest {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private LessonRepository lessonRepository;

    @Autowired
    private CourseClassRepository courseClassRepository;

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private StudentProfileRepository studentProfileRepository;

    @Autowired
    private TeacherProfileRepository teacherProfileRepository;

    private Course testCourse;
    private Lesson testLesson;
    private CourseClass testCourseClass;
    private Schedule testSchedule;
    private UserProfile teacherProfile;
    private UserProfile studentProfile;
    private TeacherProfile teacher;
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

        teacher = new TeacherProfile();
        teacher.setUserProfile(teacherProfile);
        teacher = teacherProfileRepository.save(teacher);

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

        // Create test course class
        testCourseClass = new CourseClass();
        testCourseClass.setClassName("Test Class");
        testCourseClass.setCourse(testCourse);
        testCourseClass.setTeacher(teacherProfile);
        testCourseClass.setStartDate(Instant.now().plus(7, ChronoUnit.DAYS));
        testCourseClass.setEndDate(Instant.now().plus(30, ChronoUnit.DAYS));
        testCourseClass.setCapacity(20);

        Set<StudentProfile> students = new HashSet<>();
        students.add(student);
        testCourseClass.setStudents(students);

        testCourseClass = courseClassRepository.save(testCourseClass);

        // Create test schedule
        testSchedule = new Schedule();
        testSchedule.setCourse(testCourse);
        testSchedule.setDate(Instant.now().plus(1, ChronoUnit.DAYS));
        testSchedule.setStartTime(Instant.now().plus(1, ChronoUnit.DAYS));
        testSchedule.setEndTime(Instant.now().plus(1, ChronoUnit.DAYS).plus(2, ChronoUnit.HOURS));
        testSchedule.setLocation("Room 101");
        testSchedule = scheduleRepository.save(testSchedule);
    }

    // CourseRepository Tests

    @Test
    void testCourseRepository_BasicCrudOperations() {
        // Test save
        Course newCourse = new Course();
        newCourse.setCourseCode("NEW001");
        newCourse.setTitle("New Course");
        newCourse.setDescription("New Course Description");
        newCourse.setTeacher(teacherProfile);
        newCourse.setCreatedDate(Instant.now());
        newCourse.setLastModifiedDate(Instant.now());

        Course savedCourse = courseRepository.save(newCourse);
        assertThat(savedCourse.getId()).isNotNull();
        assertThat(savedCourse.getCourseCode()).isEqualTo("NEW001");

        // Test findById
        Optional<Course> foundCourse = courseRepository.findById(savedCourse.getId());
        assertThat(foundCourse).isPresent();
        assertThat(foundCourse.get().getTitle()).isEqualTo("New Course");

        // Test update
        savedCourse.setTitle("Updated Course");
        Course updatedCourse = courseRepository.save(savedCourse);
        assertThat(updatedCourse.getTitle()).isEqualTo("Updated Course");

        // Test delete
        courseRepository.delete(savedCourse);
        Optional<Course> deletedCourse = courseRepository.findById(savedCourse.getId());
        assertThat(deletedCourse).isEmpty();
    }

    @Test
    void testCourseRepository_CustomQueries() {
        // Test findByTeacherId
        Pageable pageable = PageRequest.of(0, 10);
        Page<Course> coursesByTeacher = courseRepository.findByTeacherId(teacherProfile.getId(), pageable);
        assertThat(coursesByTeacher.getContent()).hasSize(1);
        assertThat(coursesByTeacher.getContent().get(0).getCourseCode()).isEqualTo("TEST001");

        // Test existsByCourseCodeAndIdNot
        boolean exists = courseRepository.existsByCourseCodeAndIdNot("TEST001", 999L);
        assertThat(exists).isTrue();

        boolean notExists = courseRepository.existsByCourseCodeAndIdNot("NONEXISTENT", testCourse.getId());
        assertThat(notExists).isFalse();

        // Test findByCourseCode
        Course foundByCourseCode = courseRepository.findByCourseCode("TEST001");
        assertThat(foundByCourseCode).isNotNull();
        assertThat(foundByCourseCode.getTitle()).isEqualTo("Test Course");

        // Test findByTitleContainingIgnoreCase
        Page<Course> coursesByTitle = courseRepository.findByTitleContainingIgnoreCase("test", pageable);
        assertThat(coursesByTitle.getContent()).hasSize(1);
        assertThat(coursesByTitle.getContent().get(0).getTitle()).isEqualTo("Test Course");

        // Test findCoursesWithLessonCount
        Page<Object[]> coursesWithLessonCount = courseRepository.findCoursesWithLessonCount(pageable);
        assertThat(coursesWithLessonCount.getContent()).isNotEmpty();

        // Test countClassesByCourseId
        int classCount = courseRepository.countClassesByCourseId(testCourse.getId());
        assertThat(classCount).isEqualTo(1);

        // Test findByTeacherProfileUserId
        List<Course> coursesByTeacherUserId = courseRepository.findByTeacherProfileUserId("teacher");
        assertThat(coursesByTeacherUserId).hasSize(1);
        assertThat(coursesByTeacherUserId.get(0).getCourseCode()).isEqualTo("TEST001");
    }

    // LessonRepository Tests

    @Test
    void testLessonRepository_BasicCrudOperations() {
        // Test save
        Lesson newLesson = new Lesson();
        newLesson.setTitle("New Lesson");
        newLesson.setContent("New Lesson Content");
        newLesson.setCourse(testCourse);

        Lesson savedLesson = lessonRepository.save(newLesson);
        assertThat(savedLesson.getId()).isNotNull();
        assertThat(savedLesson.getTitle()).isEqualTo("New Lesson");

        // Test findById
        Optional<Lesson> foundLesson = lessonRepository.findById(savedLesson.getId());
        assertThat(foundLesson).isPresent();
        assertThat(foundLesson.get().getContent()).isEqualTo("New Lesson Content");

        // Test update
        savedLesson.setTitle("Updated Lesson");
        Lesson updatedLesson = lessonRepository.save(savedLesson);
        assertThat(updatedLesson.getTitle()).isEqualTo("Updated Lesson");

        // Test delete
        lessonRepository.delete(savedLesson);
        Optional<Lesson> deletedLesson = lessonRepository.findById(savedLesson.getId());
        assertThat(deletedLesson).isEmpty();
    }

    @Test
    void testLessonRepository_CustomQueries() {
        // Test findByCourseId
        List<Lesson> lessonsByCourse = lessonRepository.findByCourseId(testCourse.getId());
        assertThat(lessonsByCourse).hasSize(1);
        assertThat(lessonsByCourse.get(0).getTitle()).isEqualTo("Test Lesson");

        // Test findByCourseIdOrderByTitle
        List<Lesson> lessonsOrderedByTitle = lessonRepository.findByCourseIdOrderByTitle(testCourse.getId());
        assertThat(lessonsOrderedByTitle).hasSize(1);
        assertThat(lessonsOrderedByTitle.get(0).getTitle()).isEqualTo("Test Lesson");

        // Test findByCourseIdWithFileAttachments
        List<Lesson> lessonsWithAttachments = lessonRepository.findByCourseIdWithFileAttachments(testCourse.getId());
        assertThat(lessonsWithAttachments).hasSize(1);

        // Test countByCourseId
        long lessonCount = lessonRepository.countByCourseId(testCourse.getId());
        assertThat(lessonCount).isEqualTo(1);

        // Test findByCourseIdAndTitleContainingIgnoreCase
        List<Lesson> lessonsByTitle = lessonRepository.findByCourseIdAndTitleContainingIgnoreCase(
                testCourse.getId(), "test");
        assertThat(lessonsByTitle).hasSize(1);
        assertThat(lessonsByTitle.get(0).getTitle()).isEqualTo("Test Lesson");

        // Test findByCourseIdIn
        List<Long> courseIds = Arrays.asList(testCourse.getId());
        List<Lesson> lessonsByMultipleCourses = lessonRepository.findByCourseIdIn(courseIds);
        assertThat(lessonsByMultipleCourses).hasSize(1);
    }

    // CourseClassRepository Tests

    @Test
    void testCourseClassRepository_BasicCrudOperations() {
        // Test save
        CourseClass newCourseClass = new CourseClass();
        newCourseClass.setClassName("New Class");
        newCourseClass.setCourse(testCourse);
        newCourseClass.setTeacher(teacherProfile);
        newCourseClass.setStartDate(Instant.now().plus(14, ChronoUnit.DAYS));
        newCourseClass.setEndDate(Instant.now().plus(60, ChronoUnit.DAYS));
        newCourseClass.setCapacity(15);

        CourseClass savedCourseClass = courseClassRepository.save(newCourseClass);
        assertThat(savedCourseClass.getId()).isNotNull();
        assertThat(savedCourseClass.getClassName()).isEqualTo("New Class");

        // Test findById
        Optional<CourseClass> foundCourseClass = courseClassRepository.findById(savedCourseClass.getId());
        assertThat(foundCourseClass).isPresent();
        assertThat(foundCourseClass.get().getCapacity()).isEqualTo(15);

        // Test update
        savedCourseClass.setClassName("Updated Class");
        CourseClass updatedCourseClass = courseClassRepository.save(savedCourseClass);
        assertThat(updatedCourseClass.getClassName()).isEqualTo("Updated Class");

        // Test delete
        courseClassRepository.delete(savedCourseClass);
        Optional<CourseClass> deletedCourseClass = courseClassRepository.findById(savedCourseClass.getId());
        assertThat(deletedCourseClass).isEmpty();
    }

    @Test
    void testCourseClassRepository_CustomQueries() {
        Pageable pageable = PageRequest.of(0, 10);

        // Test findByTeacherId
        Page<CourseClass> classesByTeacher = courseClassRepository.findByTeacherId(teacherProfile.getId(), pageable);
        assertThat(classesByTeacher.getContent()).hasSize(1);
        assertThat(classesByTeacher.getContent().get(0).getClassName()).isEqualTo("Test Class");

        // Test findByCourseId
        Page<CourseClass> classesByCourse = courseClassRepository.findByCourseId(testCourse.getId(), pageable);
        assertThat(classesByCourse.getContent()).hasSize(1);
        assertThat(classesByCourse.getContent().get(0).getClassName()).isEqualTo("Test Class");

        // Test findByStatus - UPCOMING
        Page<CourseClass> upcomingClasses = courseClassRepository.findByStatus("UPCOMING", pageable);
        assertThat(upcomingClasses.getContent()).hasSize(1);

        // Test findWithAvailableSpots
        Page<CourseClass> classesWithSpots = courseClassRepository.findWithAvailableSpots(pageable);
        assertThat(classesWithSpots.getContent()).hasSize(1);

        // Test findByCourseIdIn
        List<Long> courseIds = Arrays.asList(testCourse.getId());
        List<CourseClass> classesByMultipleCourses = courseClassRepository.findByCourseIdIn(courseIds);
        assertThat(classesByMultipleCourses).hasSize(1);
    }

    @Test
    void testCourseClassRepository_EagerRelationships() {
        // Test findOneWithEagerRelationships
        Optional<CourseClass> classWithRelationships = courseClassRepository
                .findOneWithEagerRelationships(testCourseClass.getId());
        assertThat(classWithRelationships).isPresent();
        assertThat(classWithRelationships.get().getStudents()).isNotEmpty();

        // Test findAllWithEagerRelationships
        List<CourseClass> allClassesWithRelationships = courseClassRepository.findAllWithEagerRelationships();
        assertThat(allClassesWithRelationships).isNotEmpty();

        // Test findAllWithEagerRelationships with pagination
        Pageable pageable = PageRequest.of(0, 10);
        Page<CourseClass> classesWithRelationshipsPaged = courseClassRepository.findAllWithEagerRelationships(pageable);
        assertThat(classesWithRelationshipsPaged.getContent()).isNotEmpty();
    }

    // ScheduleRepository Tests

    @Test
    void testScheduleRepository_BasicCrudOperations() {
        // Test save
        Schedule newSchedule = new Schedule();
        newSchedule.setCourse(testCourse);
        newSchedule.setDate(Instant.now().plus(2, ChronoUnit.DAYS));
        newSchedule.setStartTime(Instant.now().plus(2, ChronoUnit.DAYS));
        newSchedule.setEndTime(Instant.now().plus(2, ChronoUnit.DAYS).plus(1, ChronoUnit.HOURS));
        newSchedule.setLocation("Room 102");

        Schedule savedSchedule = scheduleRepository.save(newSchedule);
        assertThat(savedSchedule.getId()).isNotNull();
        assertThat(savedSchedule.getLocation()).isEqualTo("Room 102");

        // Test findById
        Optional<Schedule> foundSchedule = scheduleRepository.findById(savedSchedule.getId());
        assertThat(foundSchedule).isPresent();
        assertThat(foundSchedule.get().getLocation()).isEqualTo("Room 102");

        // Test update
        savedSchedule.setLocation("Room 103");
        Schedule updatedSchedule = scheduleRepository.save(savedSchedule);
        assertThat(updatedSchedule.getLocation()).isEqualTo("Room 103");

        // Test delete
        scheduleRepository.delete(savedSchedule);
        Optional<Schedule> deletedSchedule = scheduleRepository.findById(savedSchedule.getId());
        assertThat(deletedSchedule).isEmpty();
    }

    @Test
    void testScheduleRepository_DateRangeQueries() {
        Instant startDate = Instant.now();
        Instant endDate = Instant.now().plus(7, ChronoUnit.DAYS);

        // Test findByDateBetween
        List<Schedule> schedulesByDateRange = scheduleRepository.findByDateBetween(startDate, endDate);
        assertThat(schedulesByDateRange).hasSize(1);
        assertThat(schedulesByDateRange.get(0).getLocation()).isEqualTo("Room 101");

        // Test findByCourseIdAndDateBetween
        List<Schedule> schedulesByCourseAndDate = scheduleRepository.findByCourseIdAndDateBetween(
                testCourse.getId(), startDate, endDate);
        assertThat(schedulesByCourseAndDate).hasSize(1);
        assertThat(schedulesByCourseAndDate.get(0).getLocation()).isEqualTo("Room 101");
    }

    @Test
    void testScheduleRepository_ConflictDetection() {
        Instant conflictStart = testSchedule.getStartTime().minus(30, ChronoUnit.MINUTES);
        Instant conflictEnd = testSchedule.getEndTime().plus(30, ChronoUnit.MINUTES);

        // Test findConflictingSchedules
        List<Schedule> conflictingSchedules = scheduleRepository.findConflictingSchedules(
                testCourse.getId(), conflictStart, conflictEnd);
        assertThat(conflictingSchedules).hasSize(1);

        // Test findTeacherConflicts
        List<Schedule> teacherConflicts = scheduleRepository.findTeacherConflicts(
                teacherProfile.getId(), conflictStart, conflictEnd);
        assertThat(teacherConflicts).hasSize(1);

        // Test findLocationConflicts
        List<Schedule> locationConflicts = scheduleRepository.findLocationConflicts(
                "Room 101", conflictStart, conflictEnd);
        assertThat(locationConflicts).hasSize(1);

        // Test findByTeacherAndTimeRange
        List<Schedule> teacherTimeRangeConflicts = scheduleRepository.findByTeacherAndTimeRange(
                teacherProfile.getId(), conflictStart, conflictEnd);
        assertThat(teacherTimeRangeConflicts).hasSize(1);

        // Test findByLocationAndTimeRange
        List<Schedule> locationTimeRangeConflicts = scheduleRepository.findByLocationAndTimeRange(
                "Room 101", conflictStart, conflictEnd);
        assertThat(locationTimeRangeConflicts).hasSize(1);
    }

    @Test
    void testScheduleRepository_CourseAndTeacherQueries() {
        // Test findByCourseId
        List<Schedule> schedulesByCourse = scheduleRepository.findByCourseId(testCourse.getId());
        assertThat(schedulesByCourse).hasSize(1);
        assertThat(schedulesByCourse.get(0).getLocation()).isEqualTo("Room 101");

        // Test findByTeacherId
        List<Schedule> schedulesByTeacher = scheduleRepository.findByTeacherId(teacherProfile.getId());
        assertThat(schedulesByTeacher).hasSize(1);
        assertThat(schedulesByTeacher.get(0).getLocation()).isEqualTo("Room 101");

        // Test findUpcomingSchedulesByCourseId
        List<Schedule> upcomingSchedules = scheduleRepository.findUpcomingSchedulesByCourseId(
                testCourse.getId(), Instant.now());
        assertThat(upcomingSchedules).hasSize(1);

        // Test paginated queries
        Pageable pageable = PageRequest.of(0, 10);

        Page<Schedule> schedulesByCoursePageable = scheduleRepository.findByCourseId(testCourse.getId(), pageable);
        assertThat(schedulesByCoursePageable.getContent()).hasSize(1);

        Page<Schedule> schedulesByTeacherPageable = scheduleRepository.findByTeacherId(teacherProfile.getId(),
                pageable);
        assertThat(schedulesByTeacherPageable.getContent()).hasSize(1);

        Page<Schedule> schedulesOrderedByDate = scheduleRepository.findByCourseIdOrderByDateAscStartTimeAsc(
                testCourse.getId(), pageable);
        assertThat(schedulesOrderedByDate.getContent()).hasSize(1);
    }

    // Integration Tests

    @Test
    void testCourseAndLearningRepositories_Integration() {
        // Test complete course creation flow
        Course newCourse = new Course();
        newCourse.setCourseCode("INT001");
        newCourse.setTitle("Integration Course");
        newCourse.setDescription("Integration Test Course");
        newCourse.setTeacher(teacherProfile);
        newCourse.setCreatedDate(Instant.now());
        newCourse.setLastModifiedDate(Instant.now());
        Course savedCourse = courseRepository.save(newCourse);

        // Create lesson for the course
        Lesson newLesson = new Lesson();
        newLesson.setTitle("Integration Lesson");
        newLesson.setContent("Integration Lesson Content");
        newLesson.setCourse(savedCourse);
        Lesson savedLesson = lessonRepository.save(newLesson);

        // Create course class
        CourseClass newCourseClass = new CourseClass();
        newCourseClass.setClassName("Integration Class");
        newCourseClass.setCourse(savedCourse);
        newCourseClass.setTeacher(teacherProfile);
        newCourseClass.setStartDate(Instant.now().plus(7, ChronoUnit.DAYS));
        newCourseClass.setEndDate(Instant.now().plus(30, ChronoUnit.DAYS));
        newCourseClass.setCapacity(25);
        CourseClass savedCourseClass = courseClassRepository.save(newCourseClass);

        // Create schedule for the course
        Schedule newSchedule = new Schedule();
        newSchedule.setCourse(savedCourse);
        newSchedule.setDate(Instant.now().plus(3, ChronoUnit.DAYS));
        newSchedule.setStartTime(Instant.now().plus(3, ChronoUnit.DAYS));
        newSchedule.setEndTime(Instant.now().plus(3, ChronoUnit.DAYS).plus(2, ChronoUnit.HOURS));
        newSchedule.setLocation("Room 201");
        Schedule savedSchedule = scheduleRepository.save(newSchedule);

        // Verify all entities are properly linked
        assertThat(savedCourse.getId()).isNotNull();
        assertThat(savedLesson.getId()).isNotNull();
        assertThat(savedCourseClass.getId()).isNotNull();
        assertThat(savedSchedule.getId()).isNotNull();

        assertThat(savedLesson.getCourse().getId()).isEqualTo(savedCourse.getId());
        assertThat(savedCourseClass.getCourse().getId()).isEqualTo(savedCourse.getId());
        assertThat(savedSchedule.getCourse().getId()).isEqualTo(savedCourse.getId());

        // Test cross-repository queries
        List<Lesson> courseLessons = lessonRepository.findByCourseId(savedCourse.getId());
        assertThat(courseLessons).hasSize(1);
        assertThat(courseLessons.get(0).getTitle()).isEqualTo("Integration Lesson");

        Pageable pageable = PageRequest.of(0, 10);
        Page<CourseClass> courseClasses = courseClassRepository.findByCourseId(savedCourse.getId(), pageable);
        assertThat(courseClasses.getContent()).hasSize(1);
        assertThat(courseClasses.getContent().get(0).getClassName()).isEqualTo("Integration Class");

        List<Schedule> courseSchedules = scheduleRepository.findByCourseId(savedCourse.getId());
        assertThat(courseSchedules).hasSize(1);
        assertThat(courseSchedules.get(0).getLocation()).isEqualTo("Room 201");
    }

    @Test
    void testRepositoryPerformance() {
        // Create multiple courses for performance testing
        List<Course> courses = new ArrayList<>();
        for (int i = 0; i < 20; i++) {
            Course course = new Course();
            course.setCourseCode("PERF" + String.format("%03d", i));
            course.setTitle("Performance Course " + i);
            course.setDescription("Performance Test Course " + i);
            course.setTeacher(teacherProfile);
            course.setCreatedDate(Instant.now());
            course.setLastModifiedDate(Instant.now());
            courses.add(course);
        }

        long startTime = System.currentTimeMillis();
        courseRepository.saveAll(courses);
        long saveTime = System.currentTimeMillis() - startTime;

        startTime = System.currentTimeMillis();
        List<Course> allCourses = courseRepository.findAll();
        long findTime = System.currentTimeMillis() - startTime;

        // Performance assertions (should complete within reasonable time)
        assertThat(saveTime).isLessThan(3000); // 3 seconds
        assertThat(findTime).isLessThan(1000); // 1 second
        assertThat(allCourses.size()).isGreaterThanOrEqualTo(20);

        // Test complex query performance
        startTime = System.currentTimeMillis();
        Pageable pageable = PageRequest.of(0, 10);
        Page<Object[]> coursesWithLessonCount = courseRepository.findCoursesWithLessonCount(pageable);
        long complexQueryTime = System.currentTimeMillis() - startTime;

        assertThat(complexQueryTime).isLessThan(2000); // 2 seconds
        assertThat(coursesWithLessonCount.getContent()).isNotEmpty();
    }

    @Test
    void testScheduleConflictScenarios() {
        // Create overlapping schedules to test conflict detection
        Instant baseTime = Instant.now().plus(5, ChronoUnit.DAYS);

        // Schedule 1: 10:00 - 12:00
        Schedule schedule1 = new Schedule();
        schedule1.setCourse(testCourse);
        schedule1.setDate(baseTime);
        schedule1.setStartTime(baseTime.plus(10, ChronoUnit.HOURS));
        schedule1.setEndTime(baseTime.plus(12, ChronoUnit.HOURS));
        schedule1.setLocation("Room 301");
        scheduleRepository.save(schedule1);

        // Test various conflict scenarios

        // Overlapping start time (9:30 - 11:00)
        List<Schedule> conflicts1 = scheduleRepository.findLocationConflicts(
                "Room 301",
                baseTime.plus(9, ChronoUnit.HOURS).plus(30, ChronoUnit.MINUTES),
                baseTime.plus(11, ChronoUnit.HOURS));
        assertThat(conflicts1).hasSize(1);

        // Overlapping end time (11:00 - 13:00)
        List<Schedule> conflicts2 = scheduleRepository.findLocationConflicts(
                "Room 301",
                baseTime.plus(11, ChronoUnit.HOURS),
                baseTime.plus(13, ChronoUnit.HOURS));
        assertThat(conflicts2).hasSize(1);

        // Completely contained (10:30 - 11:30)
        List<Schedule> conflicts3 = scheduleRepository.findLocationConflicts(
                "Room 301",
                baseTime.plus(10, ChronoUnit.HOURS).plus(30, ChronoUnit.MINUTES),
                baseTime.plus(11, ChronoUnit.HOURS).plus(30, ChronoUnit.MINUTES));
        assertThat(conflicts3).hasSize(1);

        // No conflict (8:00 - 9:00)
        List<Schedule> noConflicts = scheduleRepository.findLocationConflicts(
                "Room 301",
                baseTime.plus(8, ChronoUnit.HOURS),
                baseTime.plus(9, ChronoUnit.HOURS));
        assertThat(noConflicts).isEmpty();
    }
}