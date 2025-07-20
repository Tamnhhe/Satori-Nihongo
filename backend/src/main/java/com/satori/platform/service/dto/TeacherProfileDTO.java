package com.satori.platform.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.util.Objects;

/**
 * A DTO for the {@link com.satori.platform.domain.TeacherProfile} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class TeacherProfileDTO implements Serializable {

    private Long id;

    @NotNull
    private String teacherCode;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTeacherCode() {
        return teacherCode;
    }

    public void setTeacherCode(String teacherCode) {
        this.teacherCode = teacherCode;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof TeacherProfileDTO)) {
            return false;
        }

        TeacherProfileDTO teacherProfileDTO = (TeacherProfileDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, teacherProfileDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "TeacherProfileDTO{" +
            "id=" + getId() +
            ", teacherCode='" + getTeacherCode() + "'" +
            "}";
    }
}
