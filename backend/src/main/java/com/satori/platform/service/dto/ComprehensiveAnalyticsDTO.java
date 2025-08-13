package com.satori.platform.service.dto;

import java.time.Instant;
import java.util.List;

public class ComprehensiveAnalyticsDTO {

    private CoursePerformanceMetrics coursePerformance;
    private StudentEngagementMetrics studentEngagement;
    private LearningPathAnalytics learningPath;
    private ComparativeAnalytics comparative;
    private Instant generatedAt;

    public ComprehensiveAnalyticsDTO() {
        this.generatedAt = Instant.now();
    }

    // Getters and setters
    public CoursePerformanceMetrics getCoursePerformance() {
        return coursePerformance;
    }

    public void setCoursePerformance(CoursePerformanceMetrics coursePerformance) {
        this.coursePerformance = coursePerformance;
    }

    public StudentEngagementMetrics getStudentEngagement() {
        return studentEngagement;
    }

    public void setStudentEngagement(StudentEngagementMetrics studentEngagement) {
        this.studentEngagement = studentEngagement;
    }

    public LearningPathAnalytics getLearningPath() {
        return learningPath;
    }

    public void setLearningPath(LearningPathAnalytics learningPath) {
        this.learningPath = learningPath;
    }

    public ComparativeAnalytics getComparative() {
        return comparative;
    }

    public void setComparative(ComparativeAnalytics comparative) {
        this.comparative = comparative;
    }

    public Instant getGeneratedAt() {
        return generatedAt;
    }

    public void setGeneratedAt(Instant generatedAt) {
        this.generatedAt = generatedAt;
    }

    public static class CoursePerformanceMetrics {
        private Double averageCompletionRate;
        private Double averageQuizScore;
        private Integer totalEnrollments;
        private Integer activeStudents;
        private List<CoursePerformanceDetail> courseDetails;

        // Getters and setters
        public Double getAverageCompletionRate() {
            return averageCompletionRate;
        }

        public void setAverageCompletionRate(Double averageCompletionRate) {
            this.averageCompletionRate = averageCompletionRate;
        }

        public Double getAverageQuizScore() {
            return averageQuizScore;
        }

        public void setAverageQuizScore(Double averageQuizScore) {
            this.averageQuizScore = averageQuizScore;
        }

        public Integer getTotalEnrollments() {
            return totalEnrollments;
        }

        public void setTotalEnrollments(Integer totalEnrollments) {
            this.totalEnrollments = totalEnrollments;
        }

        public Integer getActiveStudents() {
            return activeStudents;
        }

        public void setActiveStudents(Integer activeStudents) {
            this.activeStudents = activeStudents;
        }

        public List<CoursePerformanceDetail> getCourseDetails() {
            return courseDetails;
        }

        public void setCourseDetails(List<CoursePerformanceDetail> courseDetails) {
            this.courseDetails = courseDetails;
        }
    }

    public static class CoursePerformanceDetail {
        private String courseId;
        private String courseTitle;
        private Double completionRate;
        private Double averageScore;
        private Integer enrollmentCount;
        private String difficulty;

        // Getters and setters
        public String getCourseId() {
            return courseId;
        }

        public void setCourseId(String courseId) {
            this.courseId = courseId;
        }

        public String getCourseTitle() {
            return courseTitle;
        }

        public void setCourseTitle(String courseTitle) {
            this.courseTitle = courseTitle;
        }

        public Double getCompletionRate() {
            return completionRate;
        }

        public void setCompletionRate(Double completionRate) {
            this.completionRate = completionRate;
        }

        public Double getAverageScore() {
            return averageScore;
        }

        public void setAverageScore(Double averageScore) {
            this.averageScore = averageScore;
        }

        public Integer getEnrollmentCount() {
            return enrollmentCount;
        }

        public void setEnrollmentCount(Integer enrollmentCount) {
            this.enrollmentCount = enrollmentCount;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }
    }

    public static class StudentEngagementMetrics {
        private Double averageSessionDuration;
        private Double dailyActiveUsers;
        private Double weeklyRetentionRate;
        private List<EngagementTrend> engagementTrends;
        private List<ActivityPattern> activityPatterns;

        // Getters and setters
        public Double getAverageSessionDuration() {
            return averageSessionDuration;
        }

        public void setAverageSessionDuration(Double averageSessionDuration) {
            this.averageSessionDuration = averageSessionDuration;
        }

        public Double getDailyActiveUsers() {
            return dailyActiveUsers;
        }

        public void setDailyActiveUsers(Double dailyActiveUsers) {
            this.dailyActiveUsers = dailyActiveUsers;
        }

        public Double getWeeklyRetentionRate() {
            return weeklyRetentionRate;
        }

        public void setWeeklyRetentionRate(Double weeklyRetentionRate) {
            this.weeklyRetentionRate = weeklyRetentionRate;
        }

        public List<EngagementTrend> getEngagementTrends() {
            return engagementTrends;
        }

        public void setEngagementTrends(List<EngagementTrend> engagementTrends) {
            this.engagementTrends = engagementTrends;
        }

        public List<ActivityPattern> getActivityPatterns() {
            return activityPatterns;
        }

        public void setActivityPatterns(List<ActivityPattern> activityPatterns) {
            this.activityPatterns = activityPatterns;
        }
    }

    public static class EngagementTrend {
        private String date;
        private Integer activeUsers;
        private Double averageSessionTime;
        private Integer completedLessons;

        // Getters and setters
        public String getDate() {
            return date;
        }

        public void setDate(String date) {
            this.date = date;
        }

        public Integer getActiveUsers() {
            return activeUsers;
        }

        public void setActiveUsers(Integer activeUsers) {
            this.activeUsers = activeUsers;
        }

        public Double getAverageSessionTime() {
            return averageSessionTime;
        }

        public void setAverageSessionTime(Double averageSessionTime) {
            this.averageSessionTime = averageSessionTime;
        }

        public Integer getCompletedLessons() {
            return completedLessons;
        }

        public void setCompletedLessons(Integer completedLessons) {
            this.completedLessons = completedLessons;
        }
    }

    public static class ActivityPattern {
        private String timeSlot;
        private Integer userCount;
        private String activityType;

        // Getters and setters
        public String getTimeSlot() {
            return timeSlot;
        }

        public void setTimeSlot(String timeSlot) {
            this.timeSlot = timeSlot;
        }

        public Integer getUserCount() {
            return userCount;
        }

        public void setUserCount(Integer userCount) {
            this.userCount = userCount;
        }

        public String getActivityType() {
            return activityType;
        }

        public void setActivityType(String activityType) {
            this.activityType = activityType;
        }
    }

    public static class LearningPathAnalytics {
        private List<PathProgressMetric> pathProgress;
        private List<DropoffPoint> commonDropoffPoints;
        private Double averagePathCompletion;
        private List<LearningVelocity> learningVelocities;

        // Getters and setters
        public List<PathProgressMetric> getPathProgress() {
            return pathProgress;
        }

        public void setPathProgress(List<PathProgressMetric> pathProgress) {
            this.pathProgress = pathProgress;
        }

        public List<DropoffPoint> getCommonDropoffPoints() {
            return commonDropoffPoints;
        }

        public void setCommonDropoffPoints(List<DropoffPoint> commonDropoffPoints) {
            this.commonDropoffPoints = commonDropoffPoints;
        }

        public Double getAveragePathCompletion() {
            return averagePathCompletion;
        }

        public void setAveragePathCompletion(Double averagePathCompletion) {
            this.averagePathCompletion = averagePathCompletion;
        }

        public List<LearningVelocity> getLearningVelocities() {
            return learningVelocities;
        }

        public void setLearningVelocities(List<LearningVelocity> learningVelocities) {
            this.learningVelocities = learningVelocities;
        }
    }

    public static class PathProgressMetric {
        private String courseId;
        private String courseName;
        private Integer totalLessons;
        private Double averageProgress;
        private Integer studentsEnrolled;

        // Getters and setters
        public String getCourseId() {
            return courseId;
        }

        public void setCourseId(String courseId) {
            this.courseId = courseId;
        }

        public String getCourseName() {
            return courseName;
        }

        public void setCourseName(String courseName) {
            this.courseName = courseName;
        }

        public Integer getTotalLessons() {
            return totalLessons;
        }

        public void setTotalLessons(Integer totalLessons) {
            this.totalLessons = totalLessons;
        }

        public Double getAverageProgress() {
            return averageProgress;
        }

        public void setAverageProgress(Double averageProgress) {
            this.averageProgress = averageProgress;
        }

        public Integer getStudentsEnrolled() {
            return studentsEnrolled;
        }

        public void setStudentsEnrolled(Integer studentsEnrolled) {
            this.studentsEnrolled = studentsEnrolled;
        }
    }

    public static class DropoffPoint {
        private String lessonId;
        private String lessonTitle;
        private Integer dropoffCount;
        private Double dropoffRate;

        // Getters and setters
        public String getLessonId() {
            return lessonId;
        }

        public void setLessonId(String lessonId) {
            this.lessonId = lessonId;
        }

        public String getLessonTitle() {
            return lessonTitle;
        }

        public void setLessonTitle(String lessonTitle) {
            this.lessonTitle = lessonTitle;
        }

        public Integer getDropoffCount() {
            return dropoffCount;
        }

        public void setDropoffCount(Integer dropoffCount) {
            this.dropoffCount = dropoffCount;
        }

        public Double getDropoffRate() {
            return dropoffRate;
        }

        public void setDropoffRate(Double dropoffRate) {
            this.dropoffRate = dropoffRate;
        }
    }

    public static class LearningVelocity {
        private String studentId;
        private String studentName;
        private Double lessonsPerWeek;
        private Double averageQuizScore;
        private String learningStyle;

        // Getters and setters
        public String getStudentId() {
            return studentId;
        }

        public void setStudentId(String studentId) {
            this.studentId = studentId;
        }

        public String getStudentName() {
            return studentName;
        }

        public void setStudentName(String studentName) {
            this.studentName = studentName;
        }

        public Double getLessonsPerWeek() {
            return lessonsPerWeek;
        }

        public void setLessonsPerWeek(Double lessonsPerWeek) {
            this.lessonsPerWeek = lessonsPerWeek;
        }

        public Double getAverageQuizScore() {
            return averageQuizScore;
        }

        public void setAverageQuizScore(Double averageQuizScore) {
            this.averageQuizScore = averageQuizScore;
        }

        public String getLearningStyle() {
            return learningStyle;
        }

        public void setLearningStyle(String learningStyle) {
            this.learningStyle = learningStyle;
        }
    }

    public static class ComparativeAnalytics {
        private List<CourseComparison> courseComparisons;
        private List<ClassComparison> classComparisons;
        private BenchmarkMetrics benchmarks;

        // Getters and setters
        public List<CourseComparison> getCourseComparisons() {
            return courseComparisons;
        }

        public void setCourseComparisons(List<CourseComparison> courseComparisons) {
            this.courseComparisons = courseComparisons;
        }

        public List<ClassComparison> getClassComparisons() {
            return classComparisons;
        }

        public void setClassComparisons(List<ClassComparison> classComparisons) {
            this.classComparisons = classComparisons;
        }

        public BenchmarkMetrics getBenchmarks() {
            return benchmarks;
        }

        public void setBenchmarks(BenchmarkMetrics benchmarks) {
            this.benchmarks = benchmarks;
        }
    }

    public static class CourseComparison {
        private String courseId;
        private String courseTitle;
        private Double completionRate;
        private Double averageScore;
        private Integer enrollmentCount;
        private String performanceRank;

        // Getters and setters
        public String getCourseId() {
            return courseId;
        }

        public void setCourseId(String courseId) {
            this.courseId = courseId;
        }

        public String getCourseTitle() {
            return courseTitle;
        }

        public void setCourseTitle(String courseTitle) {
            this.courseTitle = courseTitle;
        }

        public Double getCompletionRate() {
            return completionRate;
        }

        public void setCompletionRate(Double completionRate) {
            this.completionRate = completionRate;
        }

        public Double getAverageScore() {
            return averageScore;
        }

        public void setAverageScore(Double averageScore) {
            this.averageScore = averageScore;
        }

        public Integer getEnrollmentCount() {
            return enrollmentCount;
        }

        public void setEnrollmentCount(Integer enrollmentCount) {
            this.enrollmentCount = enrollmentCount;
        }

        public String getPerformanceRank() {
            return performanceRank;
        }

        public void setPerformanceRank(String performanceRank) {
            this.performanceRank = performanceRank;
        }
    }

    public static class ClassComparison {
        private String classId;
        private String className;
        private String courseTitle;
        private Double averageGPA;
        private Integer studentCount;
        private Double engagementScore;

        // Getters and setters
        public String getClassId() {
            return classId;
        }

        public void setClassId(String classId) {
            this.classId = classId;
        }

        public String getClassName() {
            return className;
        }

        public void setClassName(String className) {
            this.className = className;
        }

        public String getCourseTitle() {
            return courseTitle;
        }

        public void setCourseTitle(String courseTitle) {
            this.courseTitle = courseTitle;
        }

        public Double getAverageGPA() {
            return averageGPA;
        }

        public void setAverageGPA(Double averageGPA) {
            this.averageGPA = averageGPA;
        }

        public Integer getStudentCount() {
            return studentCount;
        }

        public void setStudentCount(Integer studentCount) {
            this.studentCount = studentCount;
        }

        public Double getEngagementScore() {
            return engagementScore;
        }

        public void setEngagementScore(Double engagementScore) {
            this.engagementScore = engagementScore;
        }
    }

    public static class BenchmarkMetrics {
        private Double platformAverageCompletion;
        private Double platformAverageScore;
        private Double platformEngagementRate;
        private String topPerformingCourse;
        private String mostEngagingClass;

        // Getters and setters
        public Double getPlatformAverageCompletion() {
            return platformAverageCompletion;
        }

        public void setPlatformAverageCompletion(Double platformAverageCompletion) {
            this.platformAverageCompletion = platformAverageCompletion;
        }

        public Double getPlatformAverageScore() {
            return platformAverageScore;
        }

        public void setPlatformAverageScore(Double platformAverageScore) {
            this.platformAverageScore = platformAverageScore;
        }

        public Double getPlatformEngagementRate() {
            return platformEngagementRate;
        }

        public void setPlatformEngagementRate(Double platformEngagementRate) {
            this.platformEngagementRate = platformEngagementRate;
        }

        public String getTopPerformingCourse() {
            return topPerformingCourse;
        }

        public void setTopPerformingCourse(String topPerformingCourse) {
            this.topPerformingCourse = topPerformingCourse;
        }

        public String getMostEngagingClass() {
            return mostEngagingClass;
        }

        public void setMostEngagingClass(String mostEngagingClass) {
            this.mostEngagingClass = mostEngagingClass;
        }
    }
}