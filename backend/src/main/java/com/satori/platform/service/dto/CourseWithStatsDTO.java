package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.DifficultyLevel;
import com.satori.platform.domain.enumeration.StudentLevel;
import java.util.Objects;

/**
 * A DTO for the {@link com.satori.platform.domain.Course} entity with
 * statistics and additional course metadata.
 */
public class CourseWithStatsDTO extends CourseDTO {

    private Integer enrollmentCount = 0;
    private Integer lessonsCount = 0;
    private Integer quizzesCount = 0;
    private Double completionRate = 0.0;
    private Double averageScore = 0.0;
    private Integer activeStudents = 0;
    private Integer totalClasses = 0;

    private StudentLevel level;
    private Integer duration;
    private Double price;
    private Boolean active;
    private DifficultyLevel difficultyLevel;
    private Integer totalEnrollments;

    public CourseWithStatsDTO() {
        super();
    }

    public CourseWithStatsDTO(CourseDTO courseDTO) {
        super();
        if (courseDTO != null) {
            this.setId(courseDTO.getId());
            this.setTitle(courseDTO.getTitle());
            this.setDescription(courseDTO.getDescription());
            this.setCourseCode(courseDTO.getCourseCode());
            this.setTeacher(courseDTO.getTeacher());
            this.setQuizzes(courseDTO.getQuizzes());
        }
    }

    /**
     * Creates a new CourseWithStatsDTO from a CourseDTO with default statistics.
     * 
     * @param courseDTO the base course DTO
     * @return a new CourseWithStatsDTO instance
     */
    public static CourseWithStatsDTO fromCourseDTO(CourseDTO courseDTO) {
        return new CourseWithStatsDTO(courseDTO);
    }

    /**
     * Creates a builder for CourseWithStatsDTO.
     * 
     * @return a new Builder instance
     */
    public static Builder builder() {
        return new Builder();
    }

    /**
     * Builder class for CourseWithStatsDTO following the builder pattern.
     */
    public static class Builder {
        private final CourseWithStatsDTO dto;

        private Builder() {
            this.dto = new CourseWithStatsDTO();
        }

        public Builder id(Long id) {
            dto.setId(id);
            return this;
        }

        public Builder title(String title) {
            dto.setTitle(title);
            return this;
        }

        public Builder description(String description) {
            dto.setDescription(description);
            return this;
        }

        public Builder courseCode(String courseCode) {
            dto.setCourseCode(courseCode);
            return this;
        }

        public Builder teacher(UserProfileDTO teacher) {
            dto.setTeacher(teacher);
            return this;
        }

        public Builder enrollmentCount(Integer enrollmentCount) {
            dto.setEnrollmentCount(enrollmentCount);
            return this;
        }

        public Builder lessonsCount(Integer lessonsCount) {
            dto.setLessonsCount(lessonsCount);
            return this;
        }

        public Builder quizzesCount(Integer quizzesCount) {
            dto.setQuizzesCount(quizzesCount);
            return this;
        }

        public Builder completionRate(Double completionRate) {
            dto.setCompletionRate(completionRate);
            return this;
        }

        public Builder averageScore(Double averageScore) {
            dto.setAverageScore(averageScore);
            return this;
        }

        public Builder activeStudents(Integer activeStudents) {
            dto.setActiveStudents(activeStudents);
            return this;
        }

        public Builder totalClasses(Integer totalClasses) {
            dto.setTotalClasses(totalClasses);
            return this;
        }

        public Builder level(StudentLevel level) {
            dto.setLevel(level);
            return this;
        }

        public Builder duration(Integer duration) {
            dto.setDuration(duration);
            return this;
        }

        public Builder price(Double price) {
            dto.setPrice(price);
            return this;
        }

        public Builder active(Boolean active) {
            dto.setActive(active);
            return this;
        }

        public Builder difficultyLevel(DifficultyLevel difficultyLevel) {
            dto.setDifficultyLevel(difficultyLevel);
            return this;
        }

        public Builder totalEnrollments(Integer totalEnrollments) {
            dto.setTotalEnrollments(totalEnrollments);
            return this;
        }

        public CourseWithStatsDTO build() {
            return dto;
        }
    }

    public Integer getEnrollmentCount() {
        return enrollmentCount;
    }

    public void setEnrollmentCount(Integer enrollmentCount) {
        this.enrollmentCount = enrollmentCount != null && enrollmentCount >= 0 ? enrollmentCount : 0;
    }

    public CourseWithStatsDTO enrollmentCount(Integer enrollmentCount) {
        this.setEnrollmentCount(enrollmentCount);
        return this;
    }

    public Integer getLessonsCount() {
        return lessonsCount;
    }

    public void setLessonsCount(Integer lessonsCount) {
        this.lessonsCount = lessonsCount != null && lessonsCount >= 0 ? lessonsCount : 0;
    }

    public CourseWithStatsDTO lessonsCount(Integer lessonsCount) {
        this.setLessonsCount(lessonsCount);
        return this;
    }

    public Integer getQuizzesCount() {
        return quizzesCount;
    }

    public void setQuizzesCount(Integer quizzesCount) {
        this.quizzesCount = quizzesCount != null && quizzesCount >= 0 ? quizzesCount : 0;
    }

    public CourseWithStatsDTO quizzesCount(Integer quizzesCount) {
        this.setQuizzesCount(quizzesCount);
        return this;
    }

    public Double getCompletionRate() {
        return completionRate;
    }

    public void setCompletionRate(Double completionRate) {
        this.completionRate = completionRate != null && completionRate >= 0.0 && completionRate <= 100.0
                ? completionRate
                : 0.0;
    }

    public CourseWithStatsDTO completionRate(Double completionRate) {
        this.setCompletionRate(completionRate);
        return this;
    }

    public Double getAverageScore() {
        return averageScore;
    }

    public void setAverageScore(Double averageScore) {
        this.averageScore = averageScore != null && averageScore >= 0.0 && averageScore <= 100.0 ? averageScore : 0.0;
    }

    public CourseWithStatsDTO averageScore(Double averageScore) {
        this.setAverageScore(averageScore);
        return this;
    }

    public Integer getActiveStudents() {
        return activeStudents;
    }

    public void setActiveStudents(Integer activeStudents) {
        this.activeStudents = activeStudents;
    }

    public CourseWithStatsDTO activeStudents(Integer activeStudents) {
        this.setActiveStudents(activeStudents);
        return this;
    }

    public Integer getTotalClasses() {
        return totalClasses;
    }

    public void setTotalClasses(Integer totalClasses) {
        this.totalClasses = totalClasses;
    }

    public CourseWithStatsDTO totalClasses(Integer totalClasses) {
        this.setTotalClasses(totalClasses);
        return this;
    }

    public StudentLevel getLevel() {
        return level;
    }

    public void setLevel(StudentLevel level) {
        this.level = level;
    }

    public CourseWithStatsDTO level(StudentLevel level) {
        this.setLevel(level);
        return this;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public CourseWithStatsDTO duration(Integer duration) {
        this.setDuration(duration);
        return this;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price != null && price >= 0.0 ? price : 0.0;
    }

    public CourseWithStatsDTO price(Double price) {
        this.setPrice(price);
        return this;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public CourseWithStatsDTO active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public DifficultyLevel getDifficultyLevel() {
        return difficultyLevel;
    }

    public void setDifficultyLevel(DifficultyLevel difficultyLevel) {
        this.difficultyLevel = difficultyLevel;
    }

    public CourseWithStatsDTO difficultyLevel(DifficultyLevel difficultyLevel) {
        this.setDifficultyLevel(difficultyLevel);
        return this;
    }

    public Integer getTotalEnrollments() {
        return totalEnrollments;
    }

    public void setTotalEnrollments(Integer totalEnrollments) {
        this.totalEnrollments = totalEnrollments;
    }

    public CourseWithStatsDTO totalEnrollments(Integer totalEnrollments) {
        this.setTotalEnrollments(totalEnrollments);
        return this;
    }

    /**
     * Calculates the enrollment rate as a percentage.
     * 
     * @return enrollment rate percentage, or 0.0 if totalEnrollments is null or
     *         zero
     */
    public Double getEnrollmentRate() {
        if (totalEnrollments == null || totalEnrollments == 0) {
            return 0.0;
        }
        return (enrollmentCount != null ? enrollmentCount.doubleValue() : 0.0) / totalEnrollments * 100.0;
    }

    /**
     * Checks if the course has any statistical data.
     * 
     * @return true if any statistics are available
     */
    public boolean hasStatistics() {
        return (enrollmentCount != null && enrollmentCount > 0) ||
                (lessonsCount != null && lessonsCount > 0) ||
                (quizzesCount != null && quizzesCount > 0) ||
                (activeStudents != null && activeStudents > 0);
    }

    /**
     * Gets a formatted price string with currency symbol.
     * 
     * @return formatted price string, or "Free" if price is null or zero
     */
    public String getFormattedPrice() {
        if (price == null || price == 0.0) {
            return "Free";
        }
        return String.format("$%.2f", price);
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof CourseWithStatsDTO)) {
            return false;
        }

        CourseWithStatsDTO courseWithStatsDTO = (CourseWithStatsDTO) o;
        if (this.getId() == null) {
            return false;
        }
        return Objects.equals(this.getId(), courseWithStatsDTO.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.getId());
    }

    @Override
    public String toString() {
        return "CourseWithStatsDTO{" +
                "id=" + getId() +
                ", title='" + getTitle() + "'" +
                ", description='" + getDescription() + "'" +
                ", courseCode='" + getCourseCode() + "'" +
                ", teacher=" + getTeacher() +
                ", enrollmentCount=" + getEnrollmentCount() +
                ", lessonsCount=" + getLessonsCount() +
                ", quizzesCount=" + getQuizzesCount() +
                ", completionRate=" + getCompletionRate() +
                ", averageScore=" + getAverageScore() +
                ", activeStudents=" + getActiveStudents() +
                ", totalClasses=" + getTotalClasses() +
                ", level=" + getLevel() +
                ", duration=" + getDuration() +
                ", price=" + getPrice() +
                ", active=" + getActive() +
                ", difficultyLevel=" + getDifficultyLevel() +
                ", totalEnrollments=" + getTotalEnrollments() +
                "}";
    }
}