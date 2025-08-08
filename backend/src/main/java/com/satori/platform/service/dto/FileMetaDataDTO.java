package com.satori.platform.service.dto;

import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.Objects;

/**
 * A DTO for the {@link com.satori.platform.domain.FileMetadata} entity.
 */
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FileMetaDataDTO implements Serializable {

    private Long id;

    @NotNull
    private String fileName;

    @NotNull
    private String originalName;

    @NotNull
    private String filePath;

    @NotNull
    private String fileType;

    @NotNull
    private Long fileSize;

    private String mimeType;

    private LocalDateTime uploadDate;

    private Integer version;

    private String checksum;

    private Long lessonId;

    private String lessonTitle;

    private Long uploadedById;

    private String uploadedByName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getOriginalName() {
        return originalName;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getMimeType() {
        return mimeType;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public LocalDateTime getUploadDate() {
        return uploadDate;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public Integer getVersion() {
        return version;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getChecksum() {
        return checksum;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }

    public Long getLessonId() {
        return lessonId;
    }

    public void setLessonId(Long lessonId) {
        this.lessonId = lessonId;
    }

    public String getLessonTitle() {
        return lessonTitle;
    }

    public void setLessonTitle(String lessonTitle) {
        this.lessonTitle = lessonTitle;
    }

    public Long getUploadedById() {
        return uploadedById;
    }

    public void setUploadedById(Long uploadedById) {
        this.uploadedById = uploadedById;
    }

    public String getUploadedByName() {
        return uploadedByName;
    }

    public void setUploadedByName(String uploadedByName) {
        this.uploadedByName = uploadedByName;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FileMetaDataDTO)) {
            return false;
        }

        FileMetaDataDTO fileMetaDataDTO = (FileMetaDataDTO) o;
        if (this.id == null) {
            return false;
        }
        return Objects.equals(this.id, fileMetaDataDTO.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(this.id);
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FileMetaDataDTO{" +
                "id=" + getId() +
                ", fileName='" + getFileName() + "'" +
                ", originalName='" + getOriginalName() + "'" +
                ", filePath='" + getFilePath() + "'" +
                ", fileType='" + getFileType() + "'" +
                ", fileSize=" + getFileSize() +
                ", mimeType='" + getMimeType() + "'" +
                ", uploadDate='" + getUploadDate() + "'" +
                ", version=" + getVersion() +
                ", checksum='" + getChecksum() + "'" +
                ", lessonId=" + getLessonId() +
                ", lessonTitle='" + getLessonTitle() + "'" +
                ", uploadedById=" + getUploadedById() +
                ", uploadedByName='" + getUploadedByName() + "'" +
                "}";
    }
}