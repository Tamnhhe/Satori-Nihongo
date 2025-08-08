package com.satori.platform.service.dto;

import jakarta.validation.constraints.Size;

/**
 * A DTO for completing user profile after registration.
 */
public class ProfileCompletionDTO {

    @Size(max = 20)
    private String phoneNumber;

    @Size(max = 255)
    private String address;

    @Size(max = 1000)
    private String bio;

    @Size(max = 50)
    private String timezone;

    @Size(max = 256)
    private String imageUrl;

    // Role-specific fields
    @Size(max = 100)
    private String specialization; // For teachers

    @Size(max = 50)
    private String studentId; // For students

    @Size(max = 100)
    private String department; // For teachers/students

    @Size(max = 100)
    private String institution; // For teachers

    // Constructors
    public ProfileCompletionDTO() {
        // Default constructor
    }

    // Getters and Setters
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

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
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

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }

    public String getInstitution() {
        return institution;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }

    @Override
    public String toString() {
        return "ProfileCompletionDTO{" +
                "phoneNumber='" + phoneNumber + '\'' +
                ", address='" + address + '\'' +
                ", timezone='" + timezone + '\'' +
                ", specialization='" + specialization + '\'' +
                ", studentId='" + studentId + '\'' +
                ", department='" + department + '\'' +
                '}';
    }
}