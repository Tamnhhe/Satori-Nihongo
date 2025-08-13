package com.satori.platform.service.dto;

import java.util.List;
import java.util.ArrayList;

public class FolderStructureDTO {
    private String name;
    private String path;
    private String type; // "folder" or "file"
    private List<FolderStructureDTO> children;
    private FileMetaDataDTO fileMetadata;
    private Integer fileCount;
    private Long totalSize;

    // Constructors
    public FolderStructureDTO() {
        this.children = new ArrayList<>();
    }

    public FolderStructureDTO(String name, String path, String type) {
        this.name = name;
        this.path = path;
        this.type = type;
        this.children = new ArrayList<>();
    }

    public static FolderStructureDTO createFolder(String name, String path) {
        return new FolderStructureDTO(name, path, "folder");
    }

    public static FolderStructureDTO createFile(String name, String path, FileMetaDataDTO metadata) {
        FolderStructureDTO file = new FolderStructureDTO(name, path, "file");
        file.setFileMetadata(metadata);
        return file;
    }

    public void addChild(FolderStructureDTO child) {
        this.children.add(child);
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public List<FolderStructureDTO> getChildren() {
        return children;
    }

    public void setChildren(List<FolderStructureDTO> children) {
        this.children = children;
    }

    public FileMetaDataDTO getFileMetadata() {
        return fileMetadata;
    }

    public void setFileMetadata(FileMetaDataDTO fileMetadata) {
        this.fileMetadata = fileMetadata;
    }

    public Integer getFileCount() {
        return fileCount;
    }

    public void setFileCount(Integer fileCount) {
        this.fileCount = fileCount;
    }

    public Long getTotalSize() {
        return totalSize;
    }

    public void setTotalSize(Long totalSize) {
        this.totalSize = totalSize;
    }
}