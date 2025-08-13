package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
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

    @JsonIgnoreProperties(value = { "teacherProfile", "studentProfile", "createdCourses", "quizAttempts" }, allowSetters = true)
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

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

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
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
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
