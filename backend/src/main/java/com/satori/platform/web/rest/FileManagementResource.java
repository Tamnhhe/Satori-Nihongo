package com.satori.platform.web.rest;

import com.satori.platform.service.FileManagementService;
import com.satori.platform.service.dto.FileMetaDataDTO;
import com.satori.platform.service.exception.FileUploadException;
import com.satori.platform.service.exception.InsufficientPermissionException;
import com.satori.platform.security.SecurityUtils;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.domain.UserProfile;
import java.io.InputStream;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing file operations.
 */
@RestController
@RequestMapping("/api/files")
public class FileManagementResource {

    private static final Logger log = LoggerFactory.getLogger(FileManagementResource.class);

    private static final String ENTITY_NAME = "fileMetadata";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FileManagementService fileManagementService;
    private final UserProfileRepository userProfileRepository;

    public FileManagementResource(
            FileManagementService fileManagementService,
            UserProfileRepository userProfileRepository) {
        this.fileManagementService = fileManagementService;
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * {@code POST /lessons/{lessonId}/upload} : Upload a file to a lesson.
     *
     * @param lessonId the lesson ID to upload the file to
     * @param file     the file to upload
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new FileMetaDataDTO,
     *         or with status {@code 400 (Bad Request)} if the file is invalid,
     *         or with status {@code 403 (Forbidden)} if the user doesn't have
     *         permission.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/lessons/{lessonId}/upload")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<FileMetaDataDTO> uploadFile(
            @PathVariable Long lessonId,
            @RequestParam("file") MultipartFile file) throws URISyntaxException {
        log.debug("REST request to upload file to lesson : {}", lessonId);

        try {
            Long userId = getCurrentUserId();
            FileMetaDataDTO result = fileManagementService.uploadLessonFile(file, lessonId, userId);

            return ResponseEntity.created(new URI("/api/files/" + result.getId()))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                            result.getId().toString()))
                    .body(result);

        } catch (FileUploadException e) {
            log.error("File upload failed", e);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage());
        } catch (InsufficientPermissionException e) {
            log.error("Insufficient permission for file upload", e);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    /**
     * {@code GET /files/{id}/download} : Download a file.
     *
     * @param id the id of the file to download
     * @return the {@link ResponseEntity} with the file content
     */
    @GetMapping("/{id}/download")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<InputStreamResource> downloadFile(@PathVariable Long id) {
        log.debug("REST request to download file : {}", id);

        try {
            Long userId = getCurrentUserId();
            FileMetaDataDTO fileMetadata = fileManagementService.getFileMetadata(id, userId);
            InputStream fileStream = fileManagementService.downloadFile(id, userId);

            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=\"" + fileMetadata.getOriginalName() + "\"");
            headers.add(HttpHeaders.CONTENT_TYPE, fileMetadata.getMimeType());
            headers.add(HttpHeaders.CONTENT_LENGTH, fileMetadata.getFileSize().toString());

            return ResponseEntity.ok()
                    .headers(headers)
                    .body(new InputStreamResource(fileStream));

        } catch (InsufficientPermissionException e) {
            log.error("Insufficient permission for file download", e);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (FileUploadException e) {
            log.error("File download failed", e);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }

    /**
     * {@code GET /files/{id}} : Get file metadata.
     *
     * @param id the id of the FileMetaDataDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the FileMetaDataDTO,
     *         or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<FileMetaDataDTO> getFileMetadata(@PathVariable Long id) {
        log.debug("REST request to get FileMetadata : {}", id);

        try {
            Long userId = getCurrentUserId();
            FileMetaDataDTO FileMetaDataDTO = fileManagementService.getFileMetadata(id, userId);
            return ResponseUtil.wrapOrNotFound(Optional.of(FileMetaDataDTO));

        } catch (InsufficientPermissionException e) {
            log.error("Insufficient permission for file access", e);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    /**
     * {@code DELETE /files/{id}} : Delete a file.
     *
     * @param id the id of the file to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (No Content)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<Void> deleteFile(@PathVariable Long id) {
        log.debug("REST request to delete file : {}", id);

        try {
            Long userId = getCurrentUserId();
            fileManagementService.deleteFile(id, userId);

            return ResponseEntity.noContent()
                    .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                    .build();

        } catch (InsufficientPermissionException e) {
            log.error("Insufficient permission for file deletion", e);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (FileUploadException e) {
            log.error("File deletion failed", e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    /**
     * {@code GET /lessons/{lessonId}/files} : Get all files for a lesson.
     *
     * @param lessonId the lesson ID to get files for
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of files in body.
     */
    @GetMapping("/lessons/{lessonId}/files")
    @PreAuthorize("hasAuthority('ROLE_USER')")
    public ResponseEntity<List<FileMetaDataDTO>> getLessonFiles(@PathVariable Long lessonId) {
        log.debug("REST request to get files for lesson : {}", lessonId);

        try {
            Long userId = getCurrentUserId();
            List<FileMetaDataDTO> files = fileManagementService.getLessonFiles(lessonId, userId);
            return ResponseEntity.ok().body(files);

        } catch (InsufficientPermissionException e) {
            log.error("Insufficient permission for lesson file access", e);
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, e.getMessage());
        }
    }

    /**
     * Get current user ID from security context
     */
    private Long getCurrentUserId() {
        String currentUserLogin = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "User not authenticated"));

        UserProfile userProfile = userProfileRepository.findByUsername(currentUserLogin)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User profile not found"));

        return userProfile.getId();
    }
}
