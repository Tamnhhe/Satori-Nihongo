package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.Instant;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A TeacherProfile.
 */
@Entity
@Table(name = "teacher_profile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TeacherProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "teacher_code", nullable = false)
    private String teacherCode;

    @Column(name = "specialization")
    private String specialization;

    @Column(name = "experience")
    private Integer experience;

    @Column(name = "employee_id")
    private String employeeId;

    @Column(name = "hire_date")
    private Instant hireDate;

    @Column(name = "department")
    private String department;

    @Column(name = "qualifications")
    private String qualifications;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private User user;

    @JsonIgnoreProperties(value = { "teacherProfile", "studentProfile", "createdCourses",
            "quizAttempts" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "teacherProfile")
    private UserProfile userProfile;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public TeacherProfile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeacherCode() {
        return this.teacherCode;
    }

    public TeacherProfile teacherCode(String teacherCode) {
        this.setTeacherCode(teacherCode);
        return this;
    }

    public void setTeacherCode(String teacherCode) {
        this.teacherCode = teacherCode;
    }

    public String getSpecialization() {
        return this.specialization;
    }

    public TeacherProfile specialization(String specialization) {
        this.setSpecialization(specialization);
        return this;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Integer getExperience() {
        return this.experience;
    }

    public TeacherProfile experience(Integer experience) {
        this.setExperience(experience);
        return this;
    }

    public void setExperience(Integer experience) {
        this.experience = experience;
    }

    public String getEmployeeId() {
        return this.employeeId;
    }

    public TeacherProfile employeeId(String employeeId) {
        this.setEmployeeId(employeeId);
        return this;
    }

    public void setEmployeeId(String employeeId) {
        this.employeeId = employeeId;
    }

    public Instant getHireDate() {
        return this.hireDate;
    }

    public TeacherProfile hireDate(Instant hireDate) {
        this.setHireDate(hireDate);
        return this;
    }

    public void setHireDate(Instant hireDate) {
        this.hireDate = hireDate;
    }

    public String getDepartment() {
        return this.department;
    }

    public TeacherProfile department(String department) {
        this.setDepartment(department);
        return this;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getQualifications() {
        return this.qualifications;
    }

    public TeacherProfile qualifications(String qualifications) {
        this.setQualifications(qualifications);
        return this;
    }

    public void setQualifications(String qualifications) {
        this.qualifications = qualifications;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TeacherProfile user(User user) {
        this.setUser(user);
        return this;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        if (this.userProfile != null) {
            this.userProfile.setTeacherProfile(null);
        }
        if (userProfile != null) {
            userProfile.setTeacherProfile(this);
        }
        this.userProfile = userProfile;
    }

    public TeacherProfile userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TeacherProfile)) {
            return false;
        }
        return getId() != null && getId().equals(((TeacherProfile) o).getId());
    }

    @Override
    public int hashCode() {
        // see
        // https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TeacherProfile{" +
                "id=" + getId() +
                ", teacherCode='" + getTeacherCode() + "'" +
                "}";
    }
}
