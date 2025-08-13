package com.satori.platform.service.dto;

import com.satori.platform.domain.StudentProfile;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

/**
 * A DTO for the {@link com.satori.platform.domain.CourseClass} entity with
 * enrollment statistics.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class CourseClassWithStatsDTO implements Serializable {

    private Long id;

    @NotNull
    private String code;

    @NotNull
    private String name;

    private String description;

    @NotNull
    private Instant startDate;

    @NotNull
    private Instant endDate;

    private Integer capacity;

    private CourseDTO course;

    private TeacherProfileDTO teacher;

    private Set<StudentProfileDTO> students = new HashSet<>();

    // Enrollment statistics
    private Integer currentEnrollment;
    private Integer availableSpots;
    private Integer waitlistCount;
    private Double enrollmentPercentage;
    private Boolean isFullyEnrolled;
    private Boolean isOverCapacity;

    // Status information
    private String status; // UPCOMING, ACTIVE, COMPLETED, CANCELLED

    private String className;

    private Integer maxStudents;

    private Integer currentStudents;

    private Long courseId;

    private Long teacherId;

    private List<StudentProfile> enrolledStudents;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Instant getStartDate() {
        return startDate;
    }

    public void setStartDate(Instant startDate) {
        this.startDate = startDate;
    }

    public Instant getEndDate() {
        return endDate;
    }

    public void setEndDate(Instant endDate) {
        this.endDate = endDate;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public CourseDTO getCourse() {
        return course;
    }

    public void setCourse(CourseDTO course) {
        this.course = course;
    }

    public TeacherProfileDTO getTeacher() {
        return teacher;
    }

    public void setTeacher(TeacherProfileDTO teacher) {
        this.teacher = teacher;
    }

    public Set<StudentProfileDTO> getStudents() {
        return students;
    }

    public void setStudents(Set<StudentProfileDTO> students) {
        this.students = students;
    }

    public Integer getCurrentEnrollment() {
        return currentEnrollment;
    }

    public void setCurrentEnrollment(Integer currentEnrollment) {
        this.currentEnrollment = currentEnrollment;
    }

    public Integer getAvailableSpots() {
        return availableSpots;
    }

    public void setAvailableSpots(Integer availableSpots) {
        this.availableSpots = availableSpots;
    }

    public Integer getWaitlistCount() {
        return waitlistCount;
    }

    public void setWaitlistCount(Integer waitlistCount) {
        this.waitlistCount = waitlistCount;
    }

    public Double getEnrollmentPercentage() {
        return enrollmentPercentage;
    }

    public void setEnrollmentPercentage(Double enrollmentPercentage) {
        this.enrollmentPercentage = enrollmentPercentage;
    }

    public Boolean getIsFullyEnrolled() {
        return isFullyEnrolled;
    }

    public void setIsFullyEnrolled(Boolean isFullyEnrolled) {
        this.isFullyEnrolled = isFullyEnrolled;
    }

    public Boolean getIsOverCapacity() {
        return isOverCapacity;
    }

    public void setIsOverCapacity(Boolean isOverCapacity) {
        this.isOverCapacity = isOverCapacity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getClassName() {
        return className;
    }

    public void setClassName(String className) {
        this.className = className;
    }

    public Integer getMaxStudents() {
        return maxStudents;
    }

    public void setMaxStudents(Integer maxStudents) {
        this.maxStudents = maxStudents;
    }

    public Integer getCurrentStudents() {
        return currentStudents;
    }

    public void setCurrentStudents(Integer currentStudents) {
        this.currentStudents = currentStudents;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public Long getTeacherId() {
        return teacherId;
    }

    public void setTeacherId(Long teacherId) {
        this.teacherId = teacherId;
    }

    public List<StudentProfile> getEnrolledStudents() {
        return enrolledStudents;
    }

    public void setEnrolledStudents(List<StudentProfile> enrolledStudents) {
        this.enrolledStudents = enrolledStudents;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CourseClassWithStatsDTO)) {
            return false;
        }

        CourseClassWithStatsDTO courseClassWithStatsDTO = (CourseClassWithStatsDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, courseClassWithStatsDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "CourseClassWithStatsDTO{" +
                "id=" + getId() +
                ", code='" + getCode() + "'" +
                ", name='" + getName() + "'" +
                ", description='" + getDescription() + "'" +
                ", startDate='" + getStartDate() + "'" +
                ", endDate='" + getEndDate() + "'" +
                ", capacity=" + getCapacity() +
                ", currentEnrollment=" + getCurrentEnrollment() +
                ", availableSpots=" + getAvailableSpots() +
                ", waitlistCount=" + getWaitlistCount() +
                ", enrollmentPercentage=" + getEnrollmentPercentage() +
                ", isFullyEnrolled=" + getIsFullyEnrolled() +
                ", isOverCapacity=" + getIsOverCapacity() +
                ", status='" + getStatus() + "'" +
                ", course=" + getCourse() +
                ", teacher=" + getTeacher() +
                "}";
    }
}