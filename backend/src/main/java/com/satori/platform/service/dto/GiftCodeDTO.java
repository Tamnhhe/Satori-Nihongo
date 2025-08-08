package com.satori.platform.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.satori.platform.domain.GiftCode} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class GiftCodeDTO implements Serializable {

    private Long id;

    @NotNull
    private String code;

    @NotNull
    private LocalDateTime expiryDate;

    @NotNull
    private Boolean active;

    private Integer maxUses;

    private Integer currentUses;

    private LocalDateTime createdDate;

    private Long courseId;

    private String courseTitle;

    private Long createdById;

    private String createdByLogin;

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

    public LocalDateTime getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDateTime expiryDate) {
        this.expiryDate = expiryDate;
    }

    public Boolean getActive() {
        return active;
    }

    public void setActive(Boolean active) {
        this.active = active;
    }

    public Integer getMaxUses() {
        return maxUses;
    }

    public void setMaxUses(Integer maxUses) {
        this.maxUses = maxUses;
    }

    public Integer getCurrentUses() {
        return currentUses;
    }

    public void setCurrentUses(Integer currentUses) {
        this.currentUses = currentUses;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public Long getCourseId() {
        return courseId;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

    public Long getCreatedById() {
        return createdById;
    }

    public void setCreatedById(Long createdById) {
        this.createdById = createdById;
    }

    public String getCreatedByLogin() {
        return createdByLogin;
    }

    public void setCreatedByLogin(String createdByLogin) {
        this.createdByLogin = createdByLogin;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof GiftCodeDTO)) {
            return false;
        }

        GiftCodeDTO giftCodeDTO = (GiftCodeDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, giftCodeDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "GiftCodeDTO{" +
                "id=" + getId() +
                ", code='" + getCode() + "'" +
                ", expiryDate='" + getExpiryDate() + "'" +
                ", active='" + getActive() + "'" +
                ", maxUses=" + getMaxUses() +
                ", currentUses=" + getCurrentUses() +
                ", createdDate='" + getCreatedDate() + "'" +
                ", courseId=" + getCourseId() +
                ", courseTitle='" + getCourseTitle() + "'" +
                ", createdById=" + getCreatedById() +
                ", createdByLogin='" + getCreatedByLogin() + "'" +
                "}";
    }
}