package com.satori.platform.web.rest;

import com.satori.platform.service.FileManagementService;
import com.satori.platform.service.dto.FileMetaDataDTO;
import com.satori.platform.service.dto.FileUploadResponseDTO;
import com.satori.platform.service.dto.FolderStructureDTO;
import com.satori.platform.security.SecurityUtils;
import com.satori.platform.service.UserService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

/**
 * REST controller for managing file operations.
 */
@RestController
@RequestMapping("/api/admin/files")
@PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN')")
public class FileManagementResource {

    private final Logger log = LoggerFactory.getLogger(FileManagementResource.class);

    private final FileManagementService fileManagementService;
    private final UserService userService;

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    public FileManagementResource(FileManagementService fileManagementService, UserService userService) {
        this.fileManagementService = fileManagementService;
        this.userService = userService;
    }

    /**
     * POST /api/admin/files/upload : Upload a file with metadata
     */
    @PostMapping("/upload")
    public ResponseEntity<FileUploadResponseDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "folder", required = false) String folder,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "isPublic", defaultValue = "false") Boolean isPublic) {

        log.debug("REST request to upload file: {}", file.getOriginalFilename());

        if (file.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(FileUploadResponseDTO.error("File is empty"));
        }

        try {
            Long userId = getCurrentUserId();
            FileUploadResponseDTO response = fileManagementService.uploadFileWithMetadata(
                    file, folder, description, isPublic, userId);

            if (response.getSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            log.error("Error uploading file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(FileUploadResponseDTO.error("Internal server error: " + e.getMessage()));
        }
    }

    /**
     * GET /api/admin/files/structure : Get folder structure
     */
    @GetMapping("/structure")
    public ResponseEntity<FolderStructureDTO> getFolderStructure(
            @RequestParam(value = "path", required = false) String path) {

        log.debug("REST request to get folder structure for path: {}", path);

        try {
            Long userId = getCurrentUserId();
            FolderStructureDTO structure = fileManagementService.getFolderStructure(path, userId);
            return ResponseEntity.ok(structure);
        } catch (Exception e) {
            log.error("Error getting folder structure", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/admin/files/search : Search files
     */
    @GetMapping("/search")
    public ResponseEntity<List<FileMetaDataDTO>> searchFiles(
            @RequestParam(value = "query", required = false) String query,
            @RequestParam(value = "folder", required = false) String folder,
            @RequestParam(value = "mimeType", required = false) String mimeType) {

        log.debug("REST request to search files with query: {}", query);

        try {
            Long userId = getCurrentUserId();
            List<FileMetaDataDTO> files = fileManagementService.searchFiles(query, folder, mimeType, userId);
            return ResponseEntity.ok(files);
        } catch (Exception e) {
            log.error("Error searching files", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/admin/files/{id}/preview : Get file preview
     */
    @GetMapping("/{id}/preview")
    public ResponseEntity<FileMetaDataDTO> getFilePreview(@PathVariable String id) {
        log.debug("REST request to get file preview: {}", id);

        try {
            Long userId = getCurrentUserId();
            FileMetaDataDTO preview = fileManagementService.getFilePreview(id, userId);
            return ResponseEntity.ok(preview);
        } catch (Exception e) {
            log.error("Error getting file preview", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * PUT /api/admin/files/{id}/metadata : Update file metadata
     */
    @PutMapping("/{id}/metadata")
    public ResponseEntity<FileMetaDataDTO> updateFileMetadata(
            @PathVariable String id,
            @RequestBody Map<String, Object> metadata) {

        log.debug("REST request to update file metadata: {}", id);

        try {
            Long userId = getCurrentUserId();
            String description = (String) metadata.get("description");
            String folder = (String) metadata.get("folder");
            Boolean isPublic = (Boolean) metadata.get("isPublic");

            FileMetaDataDTO updatedFile = fileManagementService.updateFileMetadata(
                    id, description, folder, isPublic, userId);

            return ResponseEntity.ok(updatedFile);
        } catch (Exception e) {
            log.error("Error updating file metadata", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * GET /api/admin/files/{id}/download : Download a file
     */
    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable String id) {
        log.debug("REST request to download file: {}", id);

        try {
            Long userId = getCurrentUserId();
            InputStream fileStream = fileManagementService.downloadFile(Long.parseLong(id), userId);
            FileMetaDataDTO metadata = fileManagementService.getFilePreview(id, userId);

            InputStreamResource resource = new InputStreamResource(fileStream);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + metadata.getOriginalFileName() + "\"")
                    .contentType(MediaType.parseMediaType(metadata.getMimeType()))
                    .body(resource);

        } catch (Exception e) {
            log.error("Error downloading file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /api/admin/files/{id} : Delete a file
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable String id) {
        log.debug("REST request to delete file: {}", id);

        try {
            Long userId = getCurrentUserId();
            fileManagementService.deleteFile(Long.parseLong(id), userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting file", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * POST /api/admin/files/folders : Create a folder
     */
    @PostMapping("/folders")
    public ResponseEntity<Void> createFolder(@RequestBody Map<String, String> request) {
        log.debug("REST request to create folder: {}", request.get("path"));

        try {
            Long userId = getCurrentUserId();
            String folderPath = request.get("path");
            fileManagementService.createFolder(folderPath, userId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            log.error("Error creating folder", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * DELETE /api/admin/files/folders : Delete a folder
     */
    @DeleteMapping("/folders")
    public ResponseEntity<Void> deleteFolder(@RequestParam("path") String folderPath) {
        log.debug("REST request to delete folder: {}", folderPath);

        try {
            Long userId = getCurrentUserId();
            fileManagementService.deleteFolder(folderPath, userId);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            log.error("Error deleting folder", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    private Long getCurrentUserId() {
        return SecurityUtils.getCurrentUserLogin()
                .flatMap(userService::getUserWithAuthoritiesByLogin)
                .map(user -> user.getId())
                .orElseThrow(() -> new RuntimeException("Current user not found"));
    }
}