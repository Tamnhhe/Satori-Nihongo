package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A FileMetadata
 */
@Entity
@Table(name = "file_metadata")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class FileMetaData implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "file_name", nullable = false)
    private String fileName;

    @NotNull
    @Column(name = "original_name", nullable = false)
    private String originalName;

    @NotNull
    @Column(name = "file_path", nullable = false)
    private String filePath;

    @NotNull
    @Column(name = "file_type", nullable = false)
    private String fileType;

    @NotNull
    @Column(name = "file_size", nullable = false)
    private Long fileSize;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @Column(name = "version")
    private Integer version;

    @Column(name = "checksum")
    private String checksum;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value =  {"flashcards", "course", "quizzes", "fileAttachments" }, allowSetters = true)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = {"teacherProfile", "studentProfile", "createdCourses", "quizAttempts", "notificationPreferences", "createdGiftcodes", "uploadedFiles"}, allowSetters = true)
    private UserProfile uploadedBy;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public FileMetaData id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public FileMetaData fileName(String fileName) {
        this.setFileName(fileName);
        return this;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getOriginalName() {
        return originalName;
    }

    public FileMetaData originalName(String originalName) {
        this.setOriginalName(originalName);
        return this;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public String getFilePath() {
        return filePath;
    }

    public FileMetaData filePath(String filePath) {
        this.setFilePath(filePath);
        return this;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileType() {
        return fileType;
    }

    public FileMetaData fileType(String fileType) {
        this.setFileType(fileType);
        return this;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public FileMetaData fileSize(Long fileSize) {
        this.setFileSize(fileSize);
        return this;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }
    public String getMimeType() {
        return mimeType;
    }
    public FileMetaData mimeType(String mimeType) {
        this.setMimeType(mimeType);
        return this;
    }
    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }
    public LocalDateTime getUploadDate() {
        return uploadDate;
    }
    public FileMetaData uploadDate(LocalDateTime uploadDate) {
        this.setUploadDate(uploadDate);
        return this;
    }
    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }
    public Integer getVersion() {
        return version;
    }
    public FileMetaData version(Integer version) {
        this.setVersion(version);
        return this;
    }
    public void setVersion(Integer version) {
        this.version = version;
    }
    public String getChecksum() {
        return checksum;
    }
    public FileMetaData checksum(String checksum) {
        this.setChecksum(checksum);
        return this;
    }
    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }
    public Lesson getLesson() {
        return lesson;
    }
    public FileMetaData lesson(Lesson lesson) {
        this.setLesson(lesson);
        return this;
    }
    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }
    public UserProfile getUploadedBy() {
        return uploadedBy;
    }
    public FileMetaData uploadedBy(UserProfile uploadedBy) {
        this.setUploadedBy(uploadedBy);
        return this;
    }
    public void setUploadedBy(UserProfile uploadedBy) {
        this.uploadedBy = uploadedBy;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FileMetaData)) {
            return false;
        }
        return id != null && id.equals(((FileMetaData) o).id);
    }
    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "FileMetaData{" +
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
            '}';
    }

}