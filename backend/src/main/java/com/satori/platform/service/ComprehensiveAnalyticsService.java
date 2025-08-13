package com.satori.platform.service;

import com.satori.platform.domain.Course;
import com.satori.platform.domain.CourseClass;
import com.satori.platform.domain.StudentProgress;
import com.satori.platform.domain.StudentQuiz;
import com.satori.platform.domain.User;
import com.satori.platform.repository.CourseClassRepository;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.StudentProgressRepository;
import com.satori.platform.repository.StudentQuizRepository;
import com.satori.platform.repository.UserRepository;
import com.satori.platform.security.AuthoritiesConstants;
import com.satori.platform.security.SecurityUtils;
import com.satori.platform.service.dto.ComprehensiveAnalyticsDTO;
import com.satori.platform.service.dto.ComprehensiveAnalyticsDTO.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ComprehensiveAnalyticsService {

    private final Logger log = LoggerFactory.getLogger(ComprehensiveAnalyticsService.class);

    private final CourseRepository courseRepository;
    private final CourseClassRepository courseClassRepository;
    private final StudentProgressRepository studentProgressRepository;
    private final StudentQuizRepository studentQuizRepository;
    private final UserRepository userRepository;

    public ComprehensiveAnalyticsService(
            CourseRepository courseRepository,
            CourseClassRepository courseClassRepository,
            StudentProgressRepository studentProgressRepository,
            StudentQuizRepository studentQuizRepository,
            UserRepository userRepository) {
        this.courseRepository = courseRepository;
        this.courseClassRepository = courseClassRepository;
        this.studentProgressRepository = studentProgressRepository;
        this.studentQuizRepository = studentQuizRepository;
        this.userRepository = userRepository;
    }

    public ComprehensiveAnalyticsDTO getComprehensiveAnalytics(String timeRange) {
        log.debug("Generating comprehensive analytics for time range: {}", timeRange);

        ComprehensiveAnalyticsDTO analytics = new ComprehensiveAnalyticsDTO();

        // Get date range based on parameter
        Instant startDate = getStartDateForRange(timeRange);
        Instant endDate = Instant.now();

        // Build all analytics components
        analytics.setCoursePerformance(buildCoursePerformanceMetrics(startDate, endDate));
        analytics.setStudentEngagement(buildStudentEngagementMetrics(startDate, endDate));
        analytics.setLearningPath(buildLearningPathAnalytics(startDate, endDate));
        analytics.setComparative(buildComparativeAnalytics(startDate, endDate));

        return analytics;
    }

    public ComprehensiveAnalyticsDTO getTeacherAnalytics(String teacherId, String timeRange) {
        log.debug("Generating teacher analytics for teacher: {} and time range: {}", teacherId, timeRange);

        // Get teacher's courses
        List<Course> teacherCourses = courseRepository.findByTeacherProfileUserId(teacherId);

        ComprehensiveAnalyticsDTO analytics = new ComprehensiveAnalyticsDTO();

        Instant startDate = getStartDateForRange(timeRange);
        Instant endDate = Instant.now();

        // Build analytics filtered by teacher's courses
        analytics.setCoursePerformance(buildTeacherCoursePerformanceMetrics(teacherCourses, startDate, endDate));
        analytics.setStudentEngagement(buildTeacherStudentEngagementMetrics(teacherCourses, startDate, endDate));
        analytics.setLearningPath(buildTeacherLearningPathAnalytics(teacherCourses, startDate, endDate));
        analytics.setComparative(buildTeacherComparativeAnalytics(teacherCourses, startDate, endDate));

        return analytics;
    }

    private CoursePerformanceMetrics buildCoursePerformanceMetrics(Instant startDate, Instant endDate) {
        CoursePerformanceMetrics metrics = new CoursePerformanceMetrics();

        List<Course> courses = courseRepository.findAll();
        List<CoursePerformanceDetail> courseDetails = new ArrayList<>();

        double totalCompletionRate = 0.0;
        double totalQuizScore = 0.0;
        int totalEnrollments = 0;
        int activeStudents = 0;

        for (Course course : courses) {
            CoursePerformanceDetail detail = new CoursePerformanceDetail();
            detail.setCourseId(course.getId().toString());
            detail.setCourseTitle(course.getTitle());

            // Calculate completion rate
            List<StudentProgress> progressList = studentProgressRepository.findByCourseId(course.getId());
            double completionRate = progressList.stream()
                    .mapToDouble(p -> p.getCompletionPercentage() != null ? p.getCompletionPercentage() : 0.0)
                    .average()
                    .orElse(0.0);
            detail.setCompletionRate(completionRate);

            // Calculate average quiz score
            List<StudentQuiz> quizzes = studentQuizRepository.findByCourseIdAndCompletedAtBetween(
                    course.getId().toString(), startDate, endDate);
            double avgScore = quizzes.stream()
                    .mapToDouble(q -> q.getScore() != null ? q.getScore() : 0.0)
                    .average()
                    .orElse(0.0);
            detail.setAverageScore(avgScore);

            // Get enrollment count
            int enrollmentCount = courseClassRepository.countStudentsByCourseId(course.getId().toString());
            detail.setEnrollmentCount(enrollmentCount);

            // Determine difficulty based on completion rate
            String difficulty = completionRate > 80 ? "Easy" : completionRate > 60 ? "Medium" : "Hard";
            detail.setDifficulty(difficulty);

            courseDetails.add(detail);

            // Aggregate totals
            totalCompletionRate += completionRate;
            totalQuizScore += avgScore;
            totalEnrollments += enrollmentCount;
            activeStudents += progressList.size();
        }

        metrics.setCourseDetails(courseDetails);
        metrics.setAverageCompletionRate(courses.isEmpty() ? 0.0 : totalCompletionRate / courses.size());
        metrics.setAverageQuizScore(courses.isEmpty() ? 0.0 : totalQuizScore / courses.size());
        metrics.setTotalEnrollments(totalEnrollments);
        metrics.setActiveStudents(activeStudents);

        return metrics;
    }

    private StudentEngagementMetrics buildStudentEngagementMetrics(Instant startDate, Instant endDate) {
        StudentEngagementMetrics metrics = new StudentEngagementMetrics();

        // Calculate average session duration (mock data for now)
        metrics.setAverageSessionDuration(45.5); // minutes

        // Calculate daily active users
        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);
        List<User> activeUsers = userRepository.findActiveUsersBetween(startDate, endDate);
        metrics.setDailyActiveUsers(daysBetween > 0 ? (double) activeUsers.size() / daysBetween : 0.0);

        // Calculate weekly retention rate (mock calculation)
        metrics.setWeeklyRetentionRate(75.3);

        // Build engagement trends
        List<EngagementTrend> trends = buildEngagementTrends(startDate, endDate);
        metrics.setEngagementTrends(trends);

        // Build activity patterns
        List<ActivityPattern> patterns = buildActivityPatterns(startDate, endDate);
        metrics.setActivityPatterns(patterns);

        return metrics;
    }

    private List<EngagementTrend> buildEngagementTrends(Instant startDate, Instant endDate) {
        List<EngagementTrend> trends = new ArrayList<>();

        LocalDate start = startDate.atZone(ZoneId.systemDefault()).toLocalDate();
        LocalDate end = endDate.atZone(ZoneId.systemDefault()).toLocalDate();

        for (LocalDate date = start; !date.isAfter(end); date = date.plusDays(1)) {
            EngagementTrend trend = new EngagementTrend();
            trend.setDate(date.format(DateTimeFormatter.ISO_LOCAL_DATE));

            Instant dayStart = date.atStartOfDay(ZoneId.systemDefault()).toInstant();
            Instant dayEnd = date.plusDays(1).atStartOfDay(ZoneId.systemDefault()).toInstant();

            // Count active users for the day
            List<User> dailyActiveUsers = userRepository.findActiveUsersBetween(dayStart, dayEnd);
            trend.setActiveUsers(dailyActiveUsers.size());

            // Mock session time and completed lessons
            trend.setAverageSessionTime(30.0 + Math.random() * 30); // 30-60 minutes
            trend.setCompletedLessons((int) (Math.random() * 50));

            trends.add(trend);
        }

        return trends;
    }

    private List<ActivityPattern> buildActivityPatterns(Instant startDate, Instant endDate) {
        List<ActivityPattern> patterns = new ArrayList<>();

        // Mock activity patterns by hour
        for (int hour = 0; hour < 24; hour++) {
            ActivityPattern pattern = new ActivityPattern();
            pattern.setTimeSlot(String.format("%02d:00", hour));
            pattern.setActivityType("Learning");

            // Mock user count based on typical learning patterns
            int userCount = 0;
            if (hour >= 8 && hour <= 22) { // Active hours
                userCount = (int) (Math.random() * 100 + 20);
            } else {
                userCount = (int) (Math.random() * 10);
            }
            pattern.setUserCount(userCount);

            patterns.add(pattern);
        }

        return patterns;
    }

    private LearningPathAnalytics buildLearningPathAnalytics(Instant startDate, Instant endDate) {
        LearningPathAnalytics analytics = new LearningPathAnalytics();

        // Build path progress metrics
        List<PathProgressMetric> pathProgress = new ArrayList<>();
        List<Course> courses = courseRepository.findAll();

        double totalCompletion = 0.0;

        for (Course course : courses) {
            PathProgressMetric metric = new PathProgressMetric();
            metric.setCourseId(course.getId().toString());
            metric.setCourseName(course.getTitle());
            metric.setTotalLessons(course.getLessons() != null ? course.getLessons().size() : 0);

            List<StudentProgress> progressList = studentProgressRepository.findByCourseId(course.getId());
            double avgProgress = progressList.stream()
                    .mapToDouble(p -> p.getCompletionPercentage() != null ? p.getCompletionPercentage() : 0.0)
                    .average()
                    .orElse(0.0);
            metric.setAverageProgress(avgProgress);
            metric.setStudentsEnrolled(progressList.size());

            pathProgress.add(metric);
            totalCompletion += avgProgress;
        }

        analytics.setPathProgress(pathProgress);
        analytics.setAveragePathCompletion(courses.isEmpty() ? 0.0 : totalCompletion / courses.size());

        // Build common dropoff points (mock data)
        List<DropoffPoint> dropoffPoints = buildDropoffPoints();
        analytics.setCommonDropoffPoints(dropoffPoints);

        // Build learning velocities
        List<LearningVelocity> velocities = buildLearningVelocities();
        analytics.setLearningVelocities(velocities);

        return analytics;
    }

    private List<DropoffPoint> buildDropoffPoints() {
        List<DropoffPoint> dropoffPoints = new ArrayList<>();

        // Mock dropoff points
        String[] lessonTitles = { "Introduction to Hiragana", "Basic Katakana", "Simple Kanji", "Grammar Basics" };
        for (int i = 0; i < lessonTitles.length; i++) {
            DropoffPoint point = new DropoffPoint();
            point.setLessonId("lesson_" + (i + 1));
            point.setLessonTitle(lessonTitles[i]);
            point.setDropoffCount((int) (Math.random() * 50 + 10));
            point.setDropoffRate(Math.random() * 30 + 5); // 5-35% dropoff rate
            dropoffPoints.add(point);
        }

        return dropoffPoints;
    }

    private List<LearningVelocity> buildLearningVelocities() {
        List<LearningVelocity> velocities = new ArrayList<>();

        // Get sample of students with progress
        Pageable pageable = PageRequest.of(0, 10);
        List<User> students = userRepository.findByAuthority(AuthoritiesConstants.STUDENT, pageable);

        for (User student : students) {
            LearningVelocity velocity = new LearningVelocity();
            velocity.setStudentId(student.getId().toString());
            velocity.setStudentName((student.getFirstName() != null ? student.getFirstName() : "") + " " + 
                                   (student.getLastName() != null ? student.getLastName() : ""));
            velocity.setLessonsPerWeek(Math.random() * 10 + 2); // 2-12 lessons per week
            velocity.setAverageQuizScore(Math.random() * 40 + 60); // 60-100 score
            velocity.setLearningStyle(Math.random() > 0.5 ? "Visual" : "Auditory");
            velocities.add(velocity);
        }

        return velocities;
    }

    private ComparativeAnalytics buildComparativeAnalytics(Instant startDate, Instant endDate) {
        ComparativeAnalytics analytics = new ComparativeAnalytics();

        // Build course comparisons
        List<CourseComparison> courseComparisons = buildCourseComparisons();
        analytics.setCourseComparisons(courseComparisons);

        // Build class comparisons
        List<ClassComparison> classComparisons = buildClassComparisons();
        analytics.setClassComparisons(classComparisons);

        // Build benchmark metrics
        BenchmarkMetrics benchmarks = buildBenchmarkMetrics(courseComparisons, classComparisons);
        analytics.setBenchmarks(benchmarks);

        return analytics;
    }

    private List<CourseComparison> buildCourseComparisons() {
        List<CourseComparison> comparisons = new ArrayList<>();
        List<Course> courses = courseRepository.findAll();

        for (Course course : courses) {
            CourseComparison comparison = new CourseComparison();
            comparison.setCourseId(course.getId().toString());
            comparison.setCourseTitle(course.getTitle());

            // Calculate metrics
            List<StudentProgress> progressList = studentProgressRepository.findByCourseId(course.getId());
            double completionRate = progressList.stream()
                    .mapToDouble(p -> p.getCompletionPercentage() != null ? p.getCompletionPercentage() : 0.0)
                    .average()
                    .orElse(0.0);
            comparison.setCompletionRate(completionRate);

            List<StudentQuiz> quizzes = studentQuizRepository.findByCourseId(course.getId());
            double avgScore = quizzes.stream()
                    .mapToDouble(q -> q.getScore() != null ? q.getScore() : 0.0)
                    .average()
                    .orElse(0.0);
            comparison.setAverageScore(avgScore);

            comparison.setEnrollmentCount(progressList.size());

            // Determine performance rank
            String rank = completionRate > 80 && avgScore > 85 ? "Excellent"
                    : completionRate > 60 && avgScore > 70 ? "Good"
                            : completionRate > 40 && avgScore > 60 ? "Average" : "Needs Improvement";
            comparison.setPerformanceRank(rank);

            comparisons.add(comparison);
        }

        return comparisons;
    }

    private List<ClassComparison> buildClassComparisons() {
        List<ClassComparison> comparisons = new ArrayList<>();
        List<CourseClass> classes = courseClassRepository.findAll();

        for (CourseClass courseClass : classes) {
            ClassComparison comparison = new ClassComparison();
            comparison.setClassId(courseClass.getId().toString());
            comparison.setClassName(courseClass.getName());
            comparison.setCourseTitle(courseClass.getCourse() != null ? courseClass.getCourse().getTitle() : "");

            // Calculate average GPA (mock calculation)
            comparison.setAverageGPA(Math.random() * 2 + 2.5); // 2.5-4.5 GPA

            // Get student count
            int studentCount = courseClass.getStudents() != null ? courseClass.getStudents().size() : 0;
            comparison.setStudentCount(studentCount);

            // Calculate engagement score (mock)
            comparison.setEngagementScore(Math.random() * 30 + 70); // 70-100 engagement

            comparisons.add(comparison);
        }

        return comparisons;
    }

    private BenchmarkMetrics buildBenchmarkMetrics(List<CourseComparison> courseComparisons,
            List<ClassComparison> classComparisons) {
        BenchmarkMetrics benchmarks = new BenchmarkMetrics();

        // Calculate platform averages
        double avgCompletion = courseComparisons.stream()
                .mapToDouble(CourseComparison::getCompletionRate)
                .average()
                .orElse(0.0);
        benchmarks.setPlatformAverageCompletion(avgCompletion);

        double avgScore = courseComparisons.stream()
                .mapToDouble(CourseComparison::getAverageScore)
                .average()
                .orElse(0.0);
        benchmarks.setPlatformAverageScore(avgScore);

        double avgEngagement = classComparisons.stream()
                .mapToDouble(ClassComparison::getEngagementScore)
                .average()
                .orElse(0.0);
        benchmarks.setPlatformEngagementRate(avgEngagement);

        // Find top performers
        Optional<CourseComparison> topCourse = courseComparisons.stream()
                .max(Comparator.comparing(CourseComparison::getCompletionRate));
        benchmarks.setTopPerformingCourse(topCourse.map(CourseComparison::getCourseTitle).orElse("N/A"));

        Optional<ClassComparison> topClass = classComparisons.stream()
                .max(Comparator.comparing(ClassComparison::getEngagementScore));
        benchmarks.setMostEngagingClass(topClass.map(ClassComparison::getClassName).orElse("N/A"));

        return benchmarks;
    }

    // Teacher-specific methods (filtered versions of the above)
    private CoursePerformanceMetrics buildTeacherCoursePerformanceMetrics(List<Course> teacherCourses,
            Instant startDate, Instant endDate) {
        // Similar to buildCoursePerformanceMetrics but filtered by teacher's courses
        CoursePerformanceMetrics metrics = new CoursePerformanceMetrics();
        List<CoursePerformanceDetail> courseDetails = new ArrayList<>();

        double totalCompletionRate = 0.0;
        double totalQuizScore = 0.0;
        int totalEnrollments = 0;
        int activeStudents = 0;

        for (Course course : teacherCourses) {
            CoursePerformanceDetail detail = new CoursePerformanceDetail();
            detail.setCourseId(course.getId().toString());
            detail.setCourseTitle(course.getTitle());

            List<StudentProgress> progressList = studentProgressRepository.findByCourseId(course.getId());
            double completionRate = progressList.stream()
                    .mapToDouble(p -> p.getCompletionPercentage() != null ? p.getCompletionPercentage() : 0.0)
                    .average()
                    .orElse(0.0);
            detail.setCompletionRate(completionRate);

            List<StudentQuiz> quizzes = studentQuizRepository.findByCourseIdAndCompletedAtBetween(
                    course.getId().toString(), startDate, endDate);
            double avgScore = quizzes.stream()
                    .mapToDouble(q -> q.getScore() != null ? q.getScore() : 0.0)
                    .average()
                    .orElse(0.0);
            detail.setAverageScore(avgScore);

            int enrollmentCount = courseClassRepository.countStudentsByCourseId(course.getId().toString());
            detail.setEnrollmentCount(enrollmentCount);

            String difficulty = completionRate > 80 ? "Easy" : completionRate > 60 ? "Medium" : "Hard";
            detail.setDifficulty(difficulty);

            courseDetails.add(detail);

            totalCompletionRate += completionRate;
            totalQuizScore += avgScore;
            totalEnrollments += enrollmentCount;
            activeStudents += progressList.size();
        }

        metrics.setCourseDetails(courseDetails);
        metrics.setAverageCompletionRate(teacherCourses.isEmpty() ? 0.0 : totalCompletionRate / teacherCourses.size());
        metrics.setAverageQuizScore(teacherCourses.isEmpty() ? 0.0 : totalQuizScore / teacherCourses.size());
        metrics.setTotalEnrollments(totalEnrollments);
        metrics.setActiveStudents(activeStudents);

        return metrics;
    }

    private StudentEngagementMetrics buildTeacherStudentEngagementMetrics(List<Course> teacherCourses,
            Instant startDate, Instant endDate) {
        // Similar implementation but filtered by teacher's courses
        return buildStudentEngagementMetrics(startDate, endDate); // Simplified for now
    }

    private LearningPathAnalytics buildTeacherLearningPathAnalytics(List<Course> teacherCourses, Instant startDate,
            Instant endDate) {
        LearningPathAnalytics analytics = new LearningPathAnalytics();

        List<PathProgressMetric> pathProgress = new ArrayList<>();
        double totalCompletion = 0.0;

        for (Course course : teacherCourses) {
            PathProgressMetric metric = new PathProgressMetric();
            metric.setCourseId(course.getId().toString());
            metric.setCourseName(course.getTitle());
            metric.setTotalLessons(course.getLessons() != null ? course.getLessons().size() : 0);

            List<StudentProgress> progressList = studentProgressRepository.findByCourseId(course.getId());
            double avgProgress = progressList.stream()
                    .mapToDouble(p -> p.getCompletionPercentage() != null ? p.getCompletionPercentage() : 0.0)
                    .average()
                    .orElse(0.0);
            metric.setAverageProgress(avgProgress);
            metric.setStudentsEnrolled(progressList.size());

            pathProgress.add(metric);
            totalCompletion += avgProgress;
        }

        analytics.setPathProgress(pathProgress);
        analytics.setAveragePathCompletion(teacherCourses.isEmpty() ? 0.0 : totalCompletion / teacherCourses.size());
        analytics.setCommonDropoffPoints(buildDropoffPoints());
        analytics.setLearningVelocities(buildLearningVelocities());

        return analytics;
    }

    private ComparativeAnalytics buildTeacherComparativeAnalytics(List<Course> teacherCourses, Instant startDate,
            Instant endDate) {
        ComparativeAnalytics analytics = new ComparativeAnalytics();

        // Filter comparisons to teacher's courses only
        List<CourseComparison> courseComparisons = buildCourseComparisons().stream()
                .filter(comp -> teacherCourses.stream().anyMatch(course -> course.getId().toString().equals(comp.getCourseId())))
                .collect(Collectors.toList());
        analytics.setCourseComparisons(courseComparisons);

        // Filter class comparisons to teacher's classes
        List<String> teacherCourseIds = teacherCourses.stream().map(course -> course.getId().toString()).collect(Collectors.toList());
        List<ClassComparison> classComparisons = buildClassComparisons().stream()
                .filter(comp -> {
                    // This would need proper filtering based on teacher's classes
                    return true; // Simplified for now
                })
                .collect(Collectors.toList());
        analytics.setClassComparisons(classComparisons);

        BenchmarkMetrics benchmarks = buildBenchmarkMetrics(courseComparisons, classComparisons);
        analytics.setBenchmarks(benchmarks);

        return analytics;
    }

    private Instant getStartDateForRange(String timeRange) {
        Instant now = Instant.now();
        switch (timeRange.toLowerCase()) {
            case "week":
                return now.minus(7, ChronoUnit.DAYS);
            case "month":
                return now.minus(30, ChronoUnit.DAYS);
            case "quarter":
                return now.minus(90, ChronoUnit.DAYS);
            case "year":
                return now.minus(365, ChronoUnit.DAYS);
            default:
                return now.minus(30, ChronoUnit.DAYS); // Default to month
        }
    }
}