package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.satori.platform.domain.enumeration.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A UserProfile.
 */
@Entity
@Table(name = "user_profile")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class UserProfile implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "username", nullable = false)
    private String username;

    @NotNull
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @NotNull
    @Column(name = "email", nullable = false)
    private String email;

    @NotNull
    @Column(name = "full_name", nullable = false)
    private String fullName;

    @Column(name = "gender")
    private Boolean gender;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private TeacherProfile teacherProfile;

    @JsonIgnoreProperties(value = { "userProfile", "classes" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private StudentProfile studentProfile;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "teacher")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "lessons", "schedules", "teacher", "quizzes" }, allowSetters = true)
    private Set<Course> createdCourses = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "student")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "quiz", "student" }, allowSetters = true)
    private Set<StudentQuiz> quizAttempts = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "userProfile")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "userProfile" }, allowSetters = true)
    private Set<NotificationPreference> notificationPreferences = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "createdBy")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "course", "createdBy" }, allowSetters = true)
    private Set<GiftCode> createdGiftCodes = new HashSet<>();

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "uploadedBy")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "lesson", "uploadedBy" }, allowSetters = true)
    private Set<FileMetaData> uploadedFiles = new HashSet<>();
    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public UserProfile id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return this.username;
    }

    public UserProfile username(String username) {
        this.setUsername(username);
        return this;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPasswordHash() {
        return this.passwordHash;
    }

    public UserProfile passwordHash(String passwordHash) {
        this.setPasswordHash(passwordHash);
        return this;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getEmail() {
        return this.email;
    }

    public UserProfile email(String email) {
        this.setEmail(email);
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return this.fullName;
    }

    public UserProfile fullName(String fullName) {
        this.setFullName(fullName);
        return this;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Boolean getGender() {
        return this.gender;
    }

    public UserProfile gender(Boolean gender) {
        this.setGender(gender);
        return this;
    }

    public void setGender(Boolean gender) {
        this.gender = gender;
    }

    public Role getRole() {
        return this.role;
    }

    public UserProfile role(Role role) {
        this.setRole(role);
        return this;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public TeacherProfile getTeacherProfile() {
        return this.teacherProfile;
    }

    public void setTeacherProfile(TeacherProfile teacherProfile) {
        this.teacherProfile = teacherProfile;
    }

    public UserProfile teacherProfile(TeacherProfile teacherProfile) {
        this.setTeacherProfile(teacherProfile);
        return this;
    }

    public StudentProfile getStudentProfile() {
        return this.studentProfile;
    }

    public void setStudentProfile(StudentProfile studentProfile) {
        this.studentProfile = studentProfile;
    }

    public UserProfile studentProfile(StudentProfile studentProfile) {
        this.setStudentProfile(studentProfile);
        return this;
    }

    public Set<Course> getCreatedCourses() {
        return this.createdCourses;
    }

    public void setCreatedCourses(Set<Course> courses) {
        if (this.createdCourses != null) {
            this.createdCourses.forEach(i -> i.setTeacher(null));
        }
        if (courses != null) {
            courses.forEach(i -> i.setTeacher(this));
        }
        this.createdCourses = courses;
    }

    public UserProfile createdCourses(Set<Course> courses) {
        this.setCreatedCourses(courses);
        return this;
    }

    public UserProfile addCreatedCourses(Course course) {
        this.createdCourses.add(course);
        course.setTeacher(this);
        return this;
    }

    public UserProfile removeCreatedCourses(Course course) {
        this.createdCourses.remove(course);
        course.setTeacher(null);
        return this;
    }

    public Set<StudentQuiz> getQuizAttempts() {
        return this.quizAttempts;
    }

    public void setQuizAttempts(Set<StudentQuiz> studentQuizs) {
        if (this.quizAttempts != null) {
            this.quizAttempts.forEach(i -> i.setStudent(null));
        }
        if (studentQuizs != null) {
            studentQuizs.forEach(i -> i.setStudent(this));
        }
        this.quizAttempts = studentQuizs;
    }

    public UserProfile quizAttempts(Set<StudentQuiz> studentQuizs) {
        this.setQuizAttempts(studentQuizs);
        return this;
    }

    public UserProfile addQuizAttempts(StudentQuiz studentQuiz) {
        this.quizAttempts.add(studentQuiz);
        studentQuiz.setStudent(this);
        return this;
    }

    public UserProfile removeQuizAttempts(StudentQuiz studentQuiz) {
        this.quizAttempts.remove(studentQuiz);
        studentQuiz.setStudent(null);
        return this;
    }

    public Set<NotificationPreference> getNotificationPreferences() {
        return this.notificationPreferences;
    }

    public void setNotificationPreferences(Set<NotificationPreference> notificationPreferences) {
        if (this.notificationPreferences != null) {
            this.notificationPreferences.forEach(i -> i.setUserProfile(null));
        }
        if (notificationPreferences != null) {
            notificationPreferences.forEach(i -> i.setUserProfile(this));
        }
        this.notificationPreferences = notificationPreferences;
    }

    public UserProfile notificationPreferences(Set<NotificationPreference> notificationPreferences) {
        this.setNotificationPreferences(notificationPreferences);
        return this;
    }

    public UserProfile addNotificationPreferences(NotificationPreference notificationPreference) {
        this.notificationPreferences.add(notificationPreference);
        notificationPreference.setUserProfile(this);
        return this;
    }

    public UserProfile removeNotificationPreferences(NotificationPreference notificationPreference) {
        this.notificationPreferences.remove(notificationPreference);
        notificationPreference.setUserProfile(null);
        return this;
    }

    public Set<GiftCode> getCreatedGiftCodes() {
        return this.createdGiftCodes;
    }

    public void setCreatedGiftCodes(Set<GiftCode> giftCodes) {
        if (this.createdGiftCodes != null) {
            this.createdGiftCodes.forEach(i -> i.setCreatedBy(null));
        }
        if (giftCodes != null) {
            giftCodes.forEach(i -> i.setCreatedBy(this));
        }
        this.createdGiftCodes = giftCodes;
    }

    public UserProfile createdGiftCodes(Set<GiftCode> giftCodes) {
        this.setCreatedGiftCodes(giftCodes);
        return this;
    }

    public UserProfile addCreatedGiftCodes(GiftCode giftCode) {
        this.createdGiftCodes.add(giftCode);
        giftCode.setCreatedBy(this);
        return this;
    }

    public UserProfile removeCreatedGiftCodes(GiftCode giftCode) {
        this.createdGiftCodes.remove(giftCode);
        giftCode.setCreatedBy(null);
        return this;
    }

    public Set<FileMetaData> getUploadedFiles() {
        return this.uploadedFiles;
    }

    public void setUploadedFiles(Set<FileMetaData> fileMetadatas) {
        if (this.uploadedFiles != null) {
            this.uploadedFiles.forEach(i -> i.setUploadedBy(null));
        }
        if (fileMetadatas != null) {
            fileMetadatas.forEach(i -> i.setUploadedBy(this));
        }
        this.uploadedFiles = fileMetadatas;
    }

    public UserProfile uploadedFiles(Set<FileMetaData> fileMetadatas) {
        this.setUploadedFiles(fileMetadatas);
        return this;
    }

    public UserProfile addUploadedFiles(FileMetaData fileMetadata) {
        this.uploadedFiles.add(fileMetadata);
        fileMetadata.setUploadedBy(this);
        return this;
    }

    public UserProfile removeUploadedFiles(FileMetaData fileMetadata) {
        this.uploadedFiles.remove(fileMetadata);
        fileMetadata.setUploadedBy(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof UserProfile)) {
            return false;
        }
        return getId() != null && getId().equals(((UserProfile) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "UserProfile{" +
            "id=" + getId() +
            ", username='" + getUsername() + "'" +
            ", passwordHash='" + getPasswordHash() + "'" +
            ", email='" + getEmail() + "'" +
            ", fullName='" + getFullName() + "'" +
            ", gender='" + getGender() + "'" +
            ", role='" + getRole() + "'" +
            "}";
    }
}
