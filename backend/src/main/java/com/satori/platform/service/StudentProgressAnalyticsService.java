package com.satori.platform.service;

import com.satori.platform.domain.StudentQuiz;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.Course;
import com.satori.platform.domain.CourseClass;
import com.satori.platform.repository.StudentQuizRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.repository.CourseRepository;
import com.satori.platform.repository.CourseClassRepository;
import com.satori.platform.service.dto.StudentProgressDTO;
import com.satori.platform.service.dto.CourseProgressDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for student progress analytics and chart data
 */
@Service
@Transactional
public class StudentProgressAnalyticsService {

    private final Logger log = LoggerFactory.getLogger(StudentProgressAnalyticsService.class);

    private final StudentQuizRepository studentQuizRepository;
    private final UserProfileRepository userProfileRepository;
    private final CourseRepository courseRepository;
    private final CourseClassRepository courseClassRepository;

    public StudentProgressAnalyticsService(
            StudentQuizRepository studentQuizRepository,
            UserProfileRepository userProfileRepository,
            CourseRepository courseRepository,
            CourseClassRepository courseClassRepository) {
        this.studentQuizRepository = studentQuizRepository;
        this.userProfileRepository = userProfileRepository;
        this.courseRepository = courseRepository;
        this.courseClassRepository = courseClassRepository;
    }

    /**
     * Get student progress data for charts
     */
    @Transactional(readOnly = true)
    public List<StudentProgressDTO> getStudentProgressData(LocalDate startDate, LocalDate endDate, Long courseId,
            Long studentId) {
        log.debug("Getting student progress data from {} to {}, courseId: {}, studentId: {}",
                startDate, endDate, courseId, studentId);

        List<StudentQuiz> studentQuizzes = studentQuizRepository.findByDateRangeAndFilters(
                startDate.atStartOfDay(ZoneId.systemDefault()).toInstant(),
                endDate.atTime(23, 59, 59).atZone(ZoneId.systemDefault()).toInstant(),
                courseId,
                studentId);

        Map<String, StudentProgressDTO> progressMap = new HashMap<>();

        for (StudentQuiz studentQuiz : studentQuizzes) {
            if (studentQuiz.getStudent() == null || studentQuiz.getQuiz() == null) {
                continue;
            }

            UserProfile student = studentQuiz.getStudent();
            Set<Course> courses = studentQuiz.getQuiz().getCourses();

            if (courses == null || courses.isEmpty()) {
                continue;
            }

            // For simplicity, take the first course
            Course course = courses.iterator().next();

            LocalDate quizDate = studentQuiz.getStartTime() != null
                    ? studentQuiz.getStartTime().atZone(ZoneId.systemDefault()).toLocalDate()
                    : LocalDate.now();

            String key = student.getId() + "-" + course.getId() + "-" + quizDate.toString();

            StudentProgressDTO progress = progressMap.computeIfAbsent(key, k -> {
                StudentProgressDTO dto = new StudentProgressDTO();
                dto.setStudentId(student.getId());
                dto.setStudentName(student.getFullName());
                dto.setCourseId(course.getId());
                dto.setCourseName(course.getTitle());
                dto.setDate(quizDate);
                dto.setScore(0.0);
                dto.setCompletionRate(0.0);
                dto.setTimeSpent(0);
                dto.setQuizCount(0);
                dto.setLessonCount(0);
                return dto;
            });

            // Update progress data
            if (studentQuiz.getScore() != null) {
                double currentScore = progress.getScore() != null ? progress.getScore() : 0.0;
                int currentCount = progress.getQuizCount() != null ? progress.getQuizCount() : 0;

                // Calculate running average
                double newScore = (currentScore * currentCount + studentQuiz.getScore()) / (currentCount + 1);
                progress.setScore(newScore);
            }

            if (studentQuiz.getCompleted() != null && studentQuiz.getCompleted()) {
                progress.setQuizCount((progress.getQuizCount() != null ? progress.getQuizCount() : 0) + 1);
            }

            // Calculate time spent (if available)
            if (studentQuiz.getStartTime() != null && studentQuiz.getEndTime() != null) {
                long duration = java.time.Duration.between(studentQuiz.getStartTime(), studentQuiz.getEndTime())
                        .toMinutes();
                progress.setTimeSpent((progress.getTimeSpent() != null ? progress.getTimeSpent() : 0) + (int) duration);
            }
        }

        // Calculate completion rates
        for (StudentProgressDTO progress : progressMap.values()) {
            // Get total quizzes for the course to calculate completion rate
            Course course = courseRepository.findById(progress.getCourseId()).orElse(null);
            if (course != null) {
                // For now, use a simple completion rate based on quiz count
                // In a real implementation, you would calculate based on total available
                // quizzes
                progress.setCompletionRate(Math.min(progress.getQuizCount() * 10.0, 100.0));
            }
        }

        return new ArrayList<>(progressMap.values());
    }

    /**
     * Get course progress data for analytics
     */
    @Transactional(readOnly = true)
    public List<CourseProgressDTO> getCourseProgressData(Long teacherId) {
        log.debug("Getting course progress data for teacher: {}", teacherId);

        List<Course> courses;
        if (teacherId != null) {
            courses = courseRepository.findByTeacherId(teacherId, Pageable.unpaged()).getContent();
        } else {
            courses = courseRepository.findAll();
        }

        return courses.stream().map(course -> {
            CourseProgressDTO dto = new CourseProgressDTO();
            dto.setCourseId(course.getId());
            dto.setCourseName(course.getTitle());

            // Get course classes to calculate enrollment
            List<CourseClass> courseClasses = courseClassRepository.findByCourseId(course.getId(), Pageable.unpaged())
                    .getContent();
            int totalEnrolled = courseClasses.stream()
                    .mapToInt(cc -> cc.getStudents() != null ? cc.getStudents().size() : 0)
                    .sum();
            dto.setEnrolledStudents(totalEnrolled);

            // Calculate average score from student quizzes
            List<StudentQuiz> courseQuizzes = studentQuizRepository.findByCourseId(course.getId());
            if (!courseQuizzes.isEmpty()) {
                double averageScore = courseQuizzes.stream()
                        .filter(sq -> sq.getScore() != null)
                        .mapToDouble(StudentQuiz::getScore)
                        .average()
                        .orElse(0.0);
                dto.setAverageScore(averageScore);

                // Calculate active students (students who have taken quizzes recently)
                long activeStudents = courseQuizzes.stream()
                        .filter(sq -> sq.getStartTime() != null &&
                                sq.getStartTime().isAfter(LocalDate.now().minusDays(30)
                                        .atStartOfDay(ZoneId.systemDefault()).toInstant()))
                        .map(sq -> sq.getStudent().getId())
                        .distinct()
                        .count();
                dto.setActiveStudents((int) activeStudents);
            } else {
                dto.setAverageScore(0.0);
                dto.setActiveStudents(0);
            }

            // Calculate lesson progress
            if (course.getLessons() != null) {
                dto.setTotalLessons(course.getLessons().size());
                // For now, assume all lessons are available (completed lessons would need
                // tracking)
                dto.setCompletedLessons(course.getLessons().size());
            } else {
                dto.setTotalLessons(0);
                dto.setCompletedLessons(0);
            }

            // Calculate overall progress percentage
            if (dto.getTotalLessons() > 0) {
                double progress = (dto.getCompletedLessons().doubleValue() / dto.getTotalLessons()) * 100;
                dto.setProgress(progress);
            } else {
                dto.setProgress(0.0);
            }

            return dto;
        }).collect(Collectors.toList());
    }

    /**
     * Get detailed student progress for drill-down analysis
     */
    @Transactional(readOnly = true)
    public List<StudentProgressDTO> getDetailedStudentProgress(Long studentId, Long courseId, LocalDate startDate,
            LocalDate endDate) {
        log.debug("Getting detailed progress for student: {}, course: {}", studentId, courseId);

        return getStudentProgressData(startDate, endDate, courseId, studentId);
    }

    /**
     * Get student progress summary for a specific time period
     */
    @Transactional(readOnly = true)
    public Map<String, Object> getProgressSummary(LocalDate startDate, LocalDate endDate, Long courseId,
            Long teacherId) {
        log.debug("Getting progress summary from {} to {}", startDate, endDate);

        List<StudentProgressDTO> progressData = getStudentProgressData(startDate, endDate, courseId, null);
        List<CourseProgressDTO> courseData = getCourseProgressData(teacherId);

        Map<String, Object> summary = new HashMap<>();

        // Calculate summary statistics
        if (!progressData.isEmpty()) {
            double avgScore = progressData.stream()
                    .filter(p -> p.getScore() != null)
                    .mapToDouble(StudentProgressDTO::getScore)
                    .average()
                    .orElse(0.0);

            double avgCompletion = progressData.stream()
                    .filter(p -> p.getCompletionRate() != null)
                    .mapToDouble(StudentProgressDTO::getCompletionRate)
                    .average()
                    .orElse(0.0);

            int totalQuizzes = progressData.stream()
                    .filter(p -> p.getQuizCount() != null)
                    .mapToInt(StudentProgressDTO::getQuizCount)
                    .sum();

            summary.put("averageScore", Math.round(avgScore * 100.0) / 100.0);
            summary.put("averageCompletion", Math.round(avgCompletion * 100.0) / 100.0);
            summary.put("totalQuizzes", totalQuizzes);
            summary.put("activeStudents",
                    progressData.stream().map(StudentProgressDTO::getStudentId).distinct().count());
        } else {
            summary.put("averageScore", 0.0);
            summary.put("averageCompletion", 0.0);
            summary.put("totalQuizzes", 0);
            summary.put("activeStudents", 0L);
        }

        summary.put("totalCourses", courseData.size());
        summary.put("progressData", progressData);
        summary.put("courseData", courseData);

        return summary;
    }
}