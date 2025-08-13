package com.satori.platform.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * A FileMetaData entity for managing uploaded files.
 */
@Entity
@Table(name = "file_meta_data")
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

    @Column(name = "file_type")
    private String fileType;

    @Column(name = "file_size")
    private Long fileSize;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "upload_date")
    private LocalDateTime uploadDate;

    @Column(name = "version")
    private Integer version;

    @Column(name = "checksum")
    private String checksum;

    @Column(name = "folder_path")
    private String folderPath;

    @Column(name = "description")
    private String description;

    @Column(name = "is_public")
    private Boolean isPublic;

    @Column(name = "download_count")
    private Integer downloadCount;

    @Column(name = "last_accessed_date")
    private LocalDateTime lastAccessedDate;

    @Column(name = "original_file_name")
    private String originalFileName;

    @Column(name = "deleted")
    private Boolean deleted;

    @Column(name = "deleted_date")
    private LocalDateTime deletedDate;

    @Column(name = "metadata", columnDefinition = "TEXT")
    private String metadata;

    @Column(name = "processed")
    private Boolean processed;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "user", "teacherProfile", "studentProfile" }, allowSetters = true)
    private UserProfile userProfile;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "course", "flashcards", "fileMetaData" }, allowSetters = true)
    private Lesson lesson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "user", "socialAccounts", "teacherProfile", "studentProfile" }, allowSetters = true)
    private UserProfile uploadedBy;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public FileMetaData id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return this.fileName;
    }

    public FileMetaData fileName(String fileName) {
        this.setFileName(fileName);
        return this;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getOriginalName() {
        return this.originalName;
    }

    public FileMetaData originalName(String originalName) {
        this.setOriginalName(originalName);
        return this;
    }

    public void setOriginalName(String originalName) {
        this.originalName = originalName;
    }

    public String getFilePath() {
        return this.filePath;
    }

    public FileMetaData filePath(String filePath) {
        this.setFilePath(filePath);
        return this;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }

    public String getFileType() {
        return this.fileType;
    }

    public FileMetaData fileType(String fileType) {
        this.setFileType(fileType);
        return this;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return this.fileSize;
    }

    public FileMetaData fileSize(Long fileSize) {
        this.setFileSize(fileSize);
        return this;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public String getMimeType() {
        return this.mimeType;
    }

    public FileMetaData mimeType(String mimeType) {
        this.setMimeType(mimeType);
        return this;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public LocalDateTime getUploadDate() {
        return this.uploadDate;
    }

    public FileMetaData uploadDate(LocalDateTime uploadDate) {
        this.setUploadDate(uploadDate);
        return this;
    }

    public void setUploadDate(LocalDateTime uploadDate) {
        this.uploadDate = uploadDate;
    }

    public Integer getVersion() {
        return this.version;
    }

    public FileMetaData version(Integer version) {
        this.setVersion(version);
        return this;
    }

    public void setVersion(Integer version) {
        this.version = version;
    }

    public String getChecksum() {
        return this.checksum;
    }

    public FileMetaData checksum(String checksum) {
        this.setChecksum(checksum);
        return this;
    }

    public void setChecksum(String checksum) {
        this.checksum = checksum;
    }

    public String getFolderPath() {
        return this.folderPath;
    }

    public FileMetaData folderPath(String folderPath) {
        this.setFolderPath(folderPath);
        return this;
    }

    public void setFolderPath(String folderPath) {
        this.folderPath = folderPath;
    }

    public String getDescription() {
        return this.description;
    }

    public FileMetaData description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getIsPublic() {
        return this.isPublic;
    }

    public FileMetaData isPublic(Boolean isPublic) {
        this.setIsPublic(isPublic);
        return this;
    }

    public void setIsPublic(Boolean isPublic) {
        this.isPublic = isPublic;
    }

    public Integer getDownloadCount() {
        return this.downloadCount;
    }

    public FileMetaData downloadCount(Integer downloadCount) {
        this.setDownloadCount(downloadCount);
        return this;
    }

    public void setDownloadCount(Integer downloadCount) {
        this.downloadCount = downloadCount;
    }

    public LocalDateTime getLastAccessedDate() {
        return this.lastAccessedDate;
    }

    public FileMetaData lastAccessedDate(LocalDateTime lastAccessedDate) {
        this.setLastAccessedDate(lastAccessedDate);
        return this;
    }

    public void setLastAccessedDate(LocalDateTime lastAccessedDate) {
        this.lastAccessedDate = lastAccessedDate;
    }

    public Lesson getLesson() {
        return this.lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

    public FileMetaData lesson(Lesson lesson) {
        this.setLesson(lesson);
        return this;
    }

    public UserProfile getUploadedBy() {
        return this.uploadedBy;
    }

    public void setUploadedBy(UserProfile userProfile) {
        this.uploadedBy = userProfile;
    }

    public FileMetaData uploadedBy(UserProfile userProfile) {
        this.setUploadedBy(userProfile);
        return this;
    }

    public String getOriginalFileName() {
        return this.originalFileName;
    }

    public FileMetaData originalFileName(String originalFileName) {
        this.setOriginalFileName(originalFileName);
        return this;
    }

    public void setOriginalFileName(String originalFileName) {
        this.originalFileName = originalFileName;
    }

    public Boolean getDeleted() {
        return this.deleted;
    }

    public FileMetaData deleted(Boolean deleted) {
        this.setDeleted(deleted);
        return this;
    }

    public void setDeleted(Boolean deleted) {
        this.deleted = deleted;
    }

    public LocalDateTime getDeletedDate() {
        return this.deletedDate;
    }

    public FileMetaData deletedDate(LocalDateTime deletedDate) {
        this.setDeletedDate(deletedDate);
        return this;
    }

    public void setDeletedDate(LocalDateTime deletedDate) {
        this.deletedDate = deletedDate;
    }

    public String getMetadata() {
        return this.metadata;
    }

    public FileMetaData metadata(String metadata) {
        this.setMetadata(metadata);
        return this;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public Boolean getProcessed() {
        return this.processed;
    }

    public FileMetaData processed(Boolean processed) {
        this.setProcessed(processed);
        return this;
    }

    public void setProcessed(Boolean processed) {
        this.processed = processed;
    }

    public UserProfile getUserProfile() {
        return this.userProfile;
    }

    public void setUserProfile(UserProfile userProfile) {
        this.userProfile = userProfile;
    }

    public FileMetaData userProfile(UserProfile userProfile) {
        this.setUserProfile(userProfile);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and
    // setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof FileMetaData)) {
            return false;
        }
        return getId() != null && getId().equals(((FileMetaData) o).getId());
    }

    @Override
    public int hashCode() {
        // see
        // https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
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
                ", folderPath='" + getFolderPath() + "'" +
                ", description='" + getDescription() + "'" +
                ", isPublic='" + getIsPublic() + "'" +
                ", downloadCount=" + getDownloadCount() +
                ", lastAccessedDate='" + getLastAccessedDate() + "'" +
                "}";
    }
}