package com.satori.platform.service.dto;

public class FileUploadResponseDTO {
    private String fileId;
    private String fileName;
    private String fileUrl;
    private String thumbnailUrl;
    private Long fileSize;
    private String mimeType;
    private Boolean success;
    private String message;

    // Constructors
    public FileUploadResponseDTO() {
    }

    public FileUploadResponseDTO(String fileId, String fileName, String fileUrl,
            Long fileSize, String mimeType, Boolean success) {
        this.fileId = fileId;
        this.fileName = fileName;
        this.fileUrl = fileUrl;
        this.fileSize = fileSize;
        this.mimeType = mimeType;
        this.success = success;
    }

    public static FileUploadResponseDTO success(String fileId, String fileName, String fileUrl,
            Long fileSize, String mimeType) {
        FileUploadResponseDTO response = new FileUploadResponseDTO(fileId, fileName, fileUrl, fileSize, mimeType, true);
        response.setMessage("File uploaded successfully");
        return response;
    }

    public static FileUploadResponseDTO error(String message) {
        FileUploadResponseDTO response = new FileUploadResponseDTO();
        response.setSuccess(false);
        response.setMessage(message);
        return response;
    }

    // Getters and Setters
    public String getFileId() {
        return fileId;
    }

    public void setFileId(String fileId) {
        this.fileId = fileId;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getThumbnailUrl() {
        return thumbnailUrl;
    }

    public void setThumbnailUrl(String thumbnailUrl) {
        this.thumbnailUrl = thumbnailUrl;
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

    public Boolean getSuccess() {
        return success;
    }

    public void setSuccess(Boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}