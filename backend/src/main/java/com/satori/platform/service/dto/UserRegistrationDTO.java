package com.satori.platform.service.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.Set;

/**
 * A DTO for user registration with role-based profile creation.
 */
public class UserRegistrationDTO {

    @NotBlank
    @Pattern(regexp = "^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
    @Size(min = 5, max = 254)
    private String email;

    @NotBlank
    @Size(min = 1, max = 50)
    @Pattern(regexp = "^[_.@A-Za-z0-9-]*$")
    private String login;

    @NotBlank
    @Size(min = 4, max = 100)
    private String password;

    @NotBlank
    @Size(max = 50)
    private String firstName;

    @NotBlank
    @Size(max = 50)
    private String lastName;

    @Size(min = 2, max = 10)
    private String langKey = "en";

    @Size(max = 50)
    private String timezone;

    private Set<String> authorities;

    // Profile-specific fields
    private String phoneNumber;
    private String address;
    private String bio;
    private String specialization; // For teachers
    private String studentId; // For students

    // Constructors
    public UserRegistrationDTO() {
        // Default constructor
    }

    // Getters and Setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public String getLangKey() {
        return langKey;
    }

    public void setLangKey(String langKey) {
        this.langKey = langKey;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Set<String> getAuthorities() {
        return authorities;
    }

    public void setAuthorities(Set<String> authorities) {
        this.authorities = authorities;
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

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    @Override
    public String toString() {
        return "UserRegistrationDTO{" +
                "email='" + email + '\'' +
                ", login='" + login + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", langKey='" + langKey + '\'' +
                ", timezone='" + timezone + '\'' +
                ", authorities=" + authorities +
                '}';
    }
}