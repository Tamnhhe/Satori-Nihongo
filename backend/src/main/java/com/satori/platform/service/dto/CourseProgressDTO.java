package com.satori.platform.service.dto;

import java.util.Objects;

/**
 * DTO for course progress data used in analytics
 */
public class CourseProgressDTO {

    private Long courseId;
    private String courseName;
    private Double progress;
    private Double averageScore;
    private Integer completedLessons;
    private Integer totalLessons;
    private Integer enrolledStudents;
    private Integer activeStudents;

    public CourseProgressDTO() {
    }

    public CourseProgressDTO(Long courseId, String courseName, Double progress, Double averageScore,
            Integer completedLessons, Integer totalLessons, Integer enrolledStudents,
            Integer activeStudents) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.progress = progress;
        this.averageScore = averageScore;
        this.completedLessons = completedLessons;
        this.totalLessons = totalLessons;
        this.enrolledStudents = enrolledStudents;
        this.activeStudents = activeStudents;
    }

    // Getters and Setters
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

    public Double getProgress() {
        return progress;
    }

    public void setProgress(Double progress) {
        this.progress = progress;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore;
    }

    public Integer getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(Integer completedLessons) {
        this.completedLessons = completedLessons;
    }

    public Integer getTotalLessons() {
        return totalLessons;
    }

    public void setTotalLessons(Integer totalLessons) {
        this.totalLessons = totalLessons;
    }

    public Integer getEnrolledStudents() {
        return enrolledStudents;
    }

    public void setEnrolledStudents(Integer enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
    }

    public Integer getActiveStudents() {
        return activeStudents;
    }

    public void setActiveStudents(Integer activeStudents) {
        this.activeStudents = activeStudents;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof CourseProgressDTO))
            return false;
        CourseProgressDTO that = (CourseProgressDTO) o;
        return Objects.equals(courseId, that.courseId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(courseId);
    }

    @Override
    public String toString() {
        return "CourseProgressDTO{" +
                "courseId=" + courseId +
                ", courseName='" + courseName + '\'' +
                ", progress=" + progress +
                ", averageScore=" + averageScore +
                ", completedLessons=" + completedLessons +
                ", totalLessons=" + totalLessons +
                ", enrolledStudents=" + enrolledStudents +
                ", activeStudents=" + activeStudents +
                '}';
    }
}