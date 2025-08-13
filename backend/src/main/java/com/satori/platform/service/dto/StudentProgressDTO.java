package com.satori.platform.service.dto;

import java.time.LocalDate;
import java.util.Objects;

/**
 * DTO for student progress data used in analytics charts
 */
public class StudentProgressDTO {

    private Long studentId;
    private String studentName;
    private Long courseId;
    private String courseName;
    private LocalDate date;
    private Double score;
    private Double completionRate;
    private Integer timeSpent; // in minutes
    private Integer quizCount;
    private Integer lessonCount;

    public StudentProgressDTO() {
    }

    public StudentProgressDTO(Long studentId, String studentName, Long courseId, String courseName,
            LocalDate date, Double score, Double completionRate, Integer timeSpent,
            Integer quizCount, Integer lessonCount) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.courseId = courseId;
        this.courseName = courseName;
        this.date = date;
        this.score = score;
        this.completionRate = completionRate;
        this.timeSpent = timeSpent;
        this.quizCount = quizCount;
        this.lessonCount = lessonCount;
    }

    // Getters and Setters
    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate;
    }

    public Integer getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
    }

    public Integer getQuizCount() {
        return quizCount;
    }

    public void setQuizCount(Integer quizCount) {
        this.quizCount = quizCount;
    }

    public Integer getLessonCount() {
        return lessonCount;
    }

    public void setLessonCount(Integer lessonCount) {
        this.lessonCount = lessonCount;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof StudentProgressDTO))
            return false;
        StudentProgressDTO that = (StudentProgressDTO) o;
        return Objects.equals(studentId, that.studentId) &&
                Objects.equals(courseId, that.courseId) &&
                Objects.equals(date, that.date);
    }

    @Override
    public int hashCode() {
        return Objects.hash(studentId, courseId, date);
    }

    @Override
    public String toString() {
        return "StudentProgressDTO{" +
                "studentId=" + studentId +
                ", studentName='" + studentName + '\'' +
                ", courseId=" + courseId +
                ", courseName='" + courseName + '\'' +
                ", date=" + date +
                ", score=" + score +
                ", completionRate=" + completionRate +
                ", timeSpent=" + timeSpent +
                ", quizCount=" + quizCount +
                ", lessonCount=" + lessonCount +
                '}';
    }
}