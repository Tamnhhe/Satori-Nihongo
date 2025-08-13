package com.satori.platform.web.rest;

import com.satori.platform.domain.FileMetaData;
import com.satori.platform.domain.Flashcard;
import com.satori.platform.service.EnhancedLessonService;
import com.satori.platform.service.FlashcardService;
import com.satori.platform.service.dto.FlashcardDTO;
import com.satori.platform.service.dto.LessonDTO;
import com.satori.platform.service.exception.InsufficientPermissionException;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import com.satori.platform.security.SecurityUtils;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.domain.UserProfile;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing enhanced Lesson operations.
 * Provides content management, file upload, and flashcard management
 * capabilities.
 */
@RestController
@RequestMapping("/api/enhanced/lessons")
public class EnhancedLessonResource {

    private static final Logger LOG = LoggerFactory.getLogger(EnhancedLessonResource.class);
    private static final String ENTITY_NAME = "lesson";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EnhancedLessonService enhancedLessonService;
    private final FlashcardService flashcardService;
    private final UserProfileRepository userProfileRepository;

    public EnhancedLessonResource(EnhancedLessonService enhancedLessonService, FlashcardService flashcardService,
            UserProfileRepository userProfileRepository) {
        this.enhancedLessonService = enhancedLessonService;
        this.flashcardService = flashcardService;
        this.userProfileRepository = userProfileRepository;
    }

    /**
     * {@code POST  /enhanced/lessons} : Create a new lesson with teacher
     * validation.
     *
     * @param lessonDTO the lessonDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new lessonDTO,
     *         or with status {@code 400 (Bad Request)} if the lesson has already an
     *         ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN')")
    public ResponseEntity<LessonDTO> createLesson(@Valid @RequestBody LessonDTO lessonDTO) throws URISyntaxException {
        LOG.debug("REST request to save Lesson : {}", lessonDTO);

        if (lessonDTO.getId() != null) {
            throw new BadRequestAlertException("A new lesson cannot already have an ID", ENTITY_NAME, "idexists");
        }

        Long teacherId = getCurrentUserId();
        try {
            LessonDTO result = enhancedLessonService.createLesson(lessonDTO, teacherId);
            return ResponseEntity.created(new URI("/api/enhanced/lessons/" + result.getId()))
                    .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                            result.getId().toString()))
                    .body(result);
        } catch (InsufficientPermissionException e) {
            throw new BadRequestAlertException(e.getMessage(), ENTITY_NAME, "insufficientpermission");
        }
    }

    /**
     * {@code PUT  /enhanced/lessons/:id} : Updates an existing lesson.
     *
     * @param id        the id of the lessonDTO to save.
     * @param lessonDTO the lessonDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated lessonDTO,
     *         or with status {@code 400 (Bad Request)} if the lessonDTO is not
     *         valid,
     *         or with status {@code 500 (Internal Server Error)} if the lessonDTO
     *         couldn't be updated.
     */
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN')")
    public ResponseEntity<LessonDTO> updateLesson(
            @PathVariable(value = "id", required = false) final Long id,
            @Valid @RequestBody LessonDTO lessonDTO) {
        LOG.debug("REST request to update Lesson : {}, {}", id, lessonDTO);

        if (lessonDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!lessonDTO.getId().equals(id)) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        Long teacherId = getCurrentUserId();
        try {
            LessonDTO result = enhancedLessonService.updateLesson(id, lessonDTO, teacherId);
            return ResponseEntity.ok()
                    .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                            lessonDTO.getId().toString()))
                    .body(result);
        } catch (EntityNotFoundException e) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        } catch (InsufficientPermissionException e) {
            throw new BadRequestAlertException(e.getMessage(), ENTITY_NAME, "insufficientpermission");
        }
    }

    /**
     * {@code DELETE  /enhanced/lessons/:id} : delete the "id" lesson.
     *
     * @param id the id of the lessonDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN')")
    public ResponseEntity<Void> deleteLesson(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Lesson : {}", id);

        Long teacherId = getCurrentUserId();
        try {
            enhancedLessonService.deleteLesson(id, teacherId);
            return ResponseEntity.noContent()
                    .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                    .build();
        } catch (EntityNotFoundException e) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        } catch (InsufficientPermissionException e) {
            throw new BadRequestAlertException(e.getMessage(), ENTITY_NAME, "insufficientpermission");
        }
    }

    /**
     * {@code GET  /enhanced/lessons/course/:courseId} : get lessons by course with
     * file attachments.
     *
     * @param courseId the course ID.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of lessons in body.
     */
    @GetMapping("/course/{courseId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN') or hasRole('HOC_VIEN')")
    public ResponseEntity<List<LessonDTO>> getLessonsByCourse(@PathVariable("courseId") Long courseId) {
        LOG.debug("REST request to get Lessons by course : {}", courseId);
        List<LessonDTO> lessons = enhancedLessonService.getLessonsByCourseWithFiles(courseId);
        return ResponseEntity.ok().body(lessons);
    }

    /**
     * {@code POST  /enhanced/lessons/:id/upload} : Upload media file for lesson.
     *
     * @param id   the lesson ID.
     * @param file the file to upload.
     * @param type the type of media (video, slide, attachment).
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the file
     *         metadata.
     */
    @PostMapping("/{id}/upload")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN')")
    public ResponseEntity<Map<String, Object>> uploadMedia(
            @PathVariable("id") Long id,
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "type", defaultValue = "attachment") String type) {
        LOG.debug("REST request to upload media for Lesson : {}, type: {}", id, type);

        Long teacherId = getCurrentUserId();
        try {
            FileMetaData fileMetaData = enhancedLessonService.addFileAttachment(id, file, teacherId);

            Map<String, Object> response = Map.of(
                    "id", fileMetaData.getId(),
                    "fileName", fileMetaData.getFileName(),
                    // FileMetaData doesn't have getFileUrl; use filePath as the stored location
                    "fileUrl", fileMetaData.getFilePath(),
                    "fileSize", fileMetaData.getFileSize(),
                    // FileMetaData doesn't have getContentType; use mimeType
                    "contentType", fileMetaData.getMimeType(),
                    // For backward compatibility keep "url" aligned with fileUrl
                    "url", fileMetaData.getFilePath());

            return ResponseEntity.ok().body(response);
        } catch (EntityNotFoundException e) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        } catch (InsufficientPermissionException e) {
            throw new BadRequestAlertException(e.getMessage(), ENTITY_NAME, "insufficientpermission");
        } catch (Exception e) {
            LOG.error("Error uploading file for lesson {}", id, e);
            throw new BadRequestAlertException("File upload failed: " + e.getMessage(), ENTITY_NAME, "uploadfailed");
        }
    }

    /**
     * {@code DELETE  /enhanced/lessons/:id/attachments/:fileId} : Remove file
     * attachment from lesson.
     *
     * @param id     the lesson ID.
     * @param fileId the file ID to remove.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}/attachments/{fileId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN')")
    public ResponseEntity<Void> removeFileAttachment(
            @PathVariable("id") Long id,
            @PathVariable("fileId") Long fileId) {
        LOG.debug("REST request to remove file attachment {} from Lesson : {}", fileId, id);

        Long teacherId = getCurrentUserId();
        try {
            enhancedLessonService.removeFileAttachment(id, fileId, teacherId);
            return ResponseEntity.noContent().build();
        } catch (EntityNotFoundException e) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        } catch (InsufficientPermissionException e) {
            throw new BadRequestAlertException(e.getMessage(), ENTITY_NAME, "insufficientpermission");
        }
    }

    /**
     * {@code DELETE  /enhanced/lessons/:id/media/:mediaType} : Remove media URL
     * from lesson.
     *
     * @param id        the lesson ID.
     * @param mediaType the media type (video or slide).
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}/media/{mediaType}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN')")
    public ResponseEntity<Void> removeMedia(
            @PathVariable("id") Long id,
            @PathVariable("mediaType") String mediaType) {
        LOG.debug("REST request to remove {} from Lesson : {}", mediaType, id);

        // This would be implemented to clear videoUrl or slideUrl
        // For now, we'll return a not implemented response
        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).build();
    }

    /**
     * {@code POST  /enhanced/lessons/:id/flashcards} : Add flashcard to lesson.
     *
     * @param id           the lesson ID.
     * @param flashcardDTO the flashcard to add.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and the
     *         new flashcard.
     */
    @PostMapping("/{id}/flashcards")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN')")
    public ResponseEntity<FlashcardDTO> addFlashcard(
            @PathVariable("id") Long id,
            @Valid @RequestBody FlashcardDTO flashcardDTO) throws URISyntaxException {
        LOG.debug("REST request to add Flashcard to Lesson : {}", id);

        // Set the lesson ID
        flashcardDTO.setLesson(new com.satori.platform.service.dto.LessonDTO());
        flashcardDTO.getLesson().setId(id);

        FlashcardDTO result = flashcardService.save(flashcardDTO);
        return ResponseEntity.created(new URI("/api/enhanced/lessons/" + id + "/flashcards/" + result.getId()))
                .body(result);
    }

    /**
     * {@code PUT  /enhanced/lessons/:id/flashcards/:flashcardId} : Update
     * flashcard.
     *
     * @param id           the lesson ID.
     * @param flashcardId  the flashcard ID.
     * @param flashcardDTO the flashcard to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the
     *         updated flashcard.
     */
    @PutMapping("/{id}/flashcards/{flashcardId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN')")
    public ResponseEntity<FlashcardDTO> updateFlashcard(
            @PathVariable("id") Long id,
            @PathVariable("flashcardId") Long flashcardId,
            @Valid @RequestBody FlashcardDTO flashcardDTO) {
        LOG.debug("REST request to update Flashcard : {} in Lesson : {}", flashcardId, id);

        flashcardDTO.setId(flashcardId);
        FlashcardDTO result = flashcardService.update(flashcardDTO);
        return ResponseEntity.ok().body(result);
    }

    /**
     * {@code DELETE  /enhanced/lessons/:id/flashcards/:flashcardId} : Delete
     * flashcard.
     *
     * @param id          the lesson ID.
     * @param flashcardId the flashcard ID.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}/flashcards/{flashcardId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN')")
    public ResponseEntity<Void> deleteFlashcard(
            @PathVariable("id") Long id,
            @PathVariable("flashcardId") Long flashcardId) {
        LOG.debug("REST request to delete Flashcard : {} from Lesson : {}", flashcardId, id);

        flashcardService.delete(flashcardId);
        return ResponseEntity.noContent().build();
    }

    /**
     * {@code PUT  /enhanced/lessons/:id/flashcards/reorder} : Reorder flashcards.
     *
     * @param id      the lesson ID.
     * @param request the reorder request containing flashcard IDs in new order.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)}.
     */
    @PutMapping("/{id}/flashcards/reorder")
    @PreAuthorize("hasRole('ADMIN') or hasRole('GIANG_VIEN')")
    public ResponseEntity<Void> reorderFlashcards(
            @PathVariable("id") Long id,
            @RequestBody Map<String, List<Long>> request) {
        LOG.debug("REST request to reorder Flashcards in Lesson : {}", id);

        List<Long> flashcardIds = request.get("flashcardIds");
        if (flashcardIds != null) {
            // Update positions based on the new order
            for (int i = 0; i < flashcardIds.size(); i++) {
                Long flashcardId = flashcardIds.get(i);
                FlashcardDTO flashcard = flashcardService.findOne(flashcardId)
                        .orElseThrow(
                                () -> new BadRequestAlertException("Flashcard not found", "flashcard", "idnotfound"));
                flashcard.setPosition(i);
                flashcardService.update(flashcard);
            }
        }

        return ResponseEntity.ok().build();
    }

    private Long getCurrentUserId() {
        String currentUserLogin = SecurityUtils.getCurrentUserLogin()
                .orElseThrow(
                        () -> new BadRequestAlertException("User not authenticated", ENTITY_NAME, "notauthenticated"));

        UserProfile userProfile = userProfileRepository.findByUsername(currentUserLogin)
                .orElseThrow(
                        () -> new BadRequestAlertException("User profile not found", ENTITY_NAME, "profilenotfound"));

        return userProfile.getId();
    }
}