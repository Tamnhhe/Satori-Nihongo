package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A GiftCode.
 */
@Entity
@Table(name = "giftcode")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GiftCode implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @NotNull
    @Column(name = "expiry_date", nullable = false)
    private LocalDateTime expiryDate;

    @NotNull
    @Column(name = "active", nullable = false)
    private Boolean active;

    @Column(name = "max_uses")
    private Integer maxUses;

    @Column(name = "current_uses")
    private Integer currentUses;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "lessons", "schedules", "teacher", "quizzes", "giftCodes" }, allowSetters = true)
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "teacherProfile", "studentProfile", "createdCourses", "quizAttempts",
            "notificationPreferences", "createdGiftcodes" }, allowSetters = true)
    private UserProfile createdBy;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public GiftCode id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public GiftCode code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public LocalDateTime getExpiryDate() {
        return this.expiryDate;
    }

    public GiftCode expiryDate(LocalDateTime expiryDate) {
        this.setExpiryDate(expiryDate);
        return this;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Boolean getActive() {
        return this.active;
    }

    public GiftCode active(Boolean active) {
        this.setActive(active);
        return this;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Integer getMaxUses() {
        return this.maxUses;
    }

    public GiftCode maxUses(Integer maxUses) {
        this.setMaxUses(maxUses);
        return this;
    }

    public void setMaxUses(Integer maxUses) {
        this.maxUses = maxUses;
    }

    public Integer getCurrentUses() {
        return this.currentUses;
    }

    public GiftCode currentUses(Integer currentUses) {
        this.setCurrentUses(currentUses);
        return this;
    }

    public void setCurrentUses(Integer currentUses) {
        this.currentUses = currentUses;
    }

    public LocalDateTime getCreatedDate() {
        return this.createdDate;
    }

    public GiftCode createdDate(LocalDateTime createdDate) {
        this.setCreatedDate(createdDate);
        return this;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public String getDescription() {
        return this.description;
    }

    public GiftCode description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Course getCourse() {
        return this.course;
    }

    public GiftCode course(Course course) {
        this.setCourse(course);
        return this;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public UserProfile getCreatedBy() {
        return this.createdBy;
    }

    public GiftCode createdBy(UserProfile userProfile) {
        this.setCreatedBy(userProfile);
        return this;
    }

    public void setCreatedBy(UserProfile userProfile) {
        this.createdBy = userProfile;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here
    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GiftCode)) {
            return false;
        }
        return id != null && id.equals(((GiftCode) o).id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public String toString() {
        return "GiftCode{" +
                "id=" + getId() +
                ", code='" + getCode() + "'" +
                ", expiryDate='" + getExpiryDate() + "'" +
                ", active='" + getActive() + "'" +
                ", maxUses=" + getMaxUses() +
                ", currentUses=" + getCurrentUses() +
                ", createdDate='" + getCreatedDate() + "'" +
                "}";
    }
}