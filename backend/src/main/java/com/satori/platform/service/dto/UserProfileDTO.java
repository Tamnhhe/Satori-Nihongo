package com.satori.platform.service.dto;

import com.satori.platform.domain.enumeration.Role;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.satori.platform.domain.UserProfile} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserProfileDTO implements Serializable {

    private Long id;

    @NotNull
    private String username;

    @NotNull
    private String passwordHash;

    @NotNull
    private String email;

    @NotNull
    private String fullName;

    private Boolean gender;

    @NotNull
    private Role role;

    private TeacherProfileDTO teacherProfile;

    private StudentProfileDTO studentProfile;

    private String phoneNumber;

    private String address;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Boolean getGender() {
        return gender;
    }

    public void setGender(Boolean gender) {
        this.gender = gender;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public TeacherProfileDTO getTeacherProfile() {
        return teacherProfile;
    }

    public void setTeacherProfile(TeacherProfileDTO teacherProfile) {
        this.teacherProfile = teacherProfile;
    }

    public StudentProfileDTO getStudentProfile() {
        return studentProfile;
    }

    public void setStudentProfile(StudentProfileDTO studentProfile) {
        this.studentProfile = studentProfile;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }

    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserProfileDTO)) {
            return false;
        }

        UserProfileDTO userProfileDTO = (UserProfileDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, userProfileDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserProfileDTO{" +
                "id=" + getId() +
                ", username='" + getUsername() + "'" +
                ", passwordHash='" + getPasswordHash() + "'" +
                ", email='" + getEmail() + "'" +
                ", fullName='" + getFullName() + "'" +
                ", gender='" + getGender() + "'" +
                ", role='" + getRole() + "'" +
                ", teacherProfile=" + getTeacherProfile() +
                ", studentProfile=" + getStudentProfile() +
                "}";
    }
}
