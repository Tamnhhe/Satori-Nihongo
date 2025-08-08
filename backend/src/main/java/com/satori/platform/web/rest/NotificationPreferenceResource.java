package com.satori.platform.web.rest;

import com.satori.platform.domain.enumeration.NotificationType;
import com.satori.platform.repository.NotificationPreferenceRepository;
import com.satori.platform.service.NotificationPreferenceService;
import com.satori.platform.service.dto.NotificationPreferenceDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing
 * {@link com.satori.platform.domain.NotificationPreference}.
 */
@RestController
@RequestMapping("/api/notification-preferences")
public class NotificationPreferenceResource {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationPreferenceResource.class);

    private static final String ENTITY_NAME = "notificationPreference";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NotificationPreferenceService notificationPreferenceService;
    private final NotificationPreferenceRepository notificationPreferenceRepository;

    public NotificationPreferenceResource(
            NotificationPreferenceService notificationPreferenceService,
            NotificationPreferenceRepository notificationPreferenceRepository) {
        this.notificationPreferenceService = notificationPreferenceService;
        this.notificationPreferenceRepository = notificationPreferenceRepository;
    }

    /**
     * {@code POST  /notification-preferences} : Create a new notification
     * preference.
     *
     * @param notificationPreferenceDTO the notificationPreferenceDTO to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with
     *         body the new notificationPreferenceDTO, or with status
     *         {@code 400 (Bad Request)} if the notification preference has already
     *         an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<NotificationPreferenceDTO> createNotificationPreference(
            @Valid @RequestBody NotificationPreferenceDTO notificationPreferenceDTO) throws URISyntaxException {
        LOG.debug("REST request to save NotificationPreference : {}", notificationPreferenceDTO);
        if (notificationPreferenceDTO.getId() != null) {
            throw new BadRequestAlertException("A new notification preference cannot already have an ID", ENTITY_NAME,
                    "idexists");
        }
        notificationPreferenceDTO = notificationPreferenceService.save(notificationPreferenceDTO);
        return ResponseEntity.created(new URI("/api/notification-preferences/" + notificationPreferenceDTO.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                        notificationPreferenceDTO.getId().toString()))
                .body(notificationPreferenceDTO);
    }

    /**
     * {@code PUT  /notification-preferences/:id} : Updates an existing notification
     * preference.
     *
     * @param id                        the id of the notificationPreferenceDTO to
     *                                  save.
     * @param notificationPreferenceDTO the notificationPreferenceDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated notificationPreferenceDTO,
     *         or with status {@code 400 (Bad Request)} if the
     *         notificationPreferenceDTO is not valid,
     *         or with status {@code 500 (Internal Server Error)} if the
     *         notificationPreferenceDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<NotificationPreferenceDTO> updateNotificationPreference(
            @PathVariable(value = "id", required = false) final Long id,
            @Valid @RequestBody NotificationPreferenceDTO notificationPreferenceDTO) throws URISyntaxException {
        LOG.debug("REST request to update NotificationPreference : {}, {}", id, notificationPreferenceDTO);
        if (notificationPreferenceDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, notificationPreferenceDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notificationPreferenceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        notificationPreferenceDTO = notificationPreferenceService.update(notificationPreferenceDTO);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                        notificationPreferenceDTO.getId().toString()))
                .body(notificationPreferenceDTO);
    }

    /**
     * {@code PATCH  /notification-preferences/:id} : Partial updates given fields
     * of an existing notification preference, field will ignore if it is null
     *
     * @param id                        the id of the notificationPreferenceDTO to
     *                                  save.
     * @param notificationPreferenceDTO the notificationPreferenceDTO to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated notificationPreferenceDTO,
     *         or with status {@code 400 (Bad Request)} if the
     *         notificationPreferenceDTO is not valid,
     *         or with status {@code 404 (Not Found)} if the
     *         notificationPreferenceDTO is not found,
     *         or with status {@code 500 (Internal Server Error)} if the
     *         notificationPreferenceDTO couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<NotificationPreferenceDTO> partialUpdateNotificationPreference(
            @PathVariable(value = "id", required = false) final Long id,
            @NotNull @RequestBody NotificationPreferenceDTO notificationPreferenceDTO) throws URISyntaxException {
        LOG.debug("REST request to partial update NotificationPreference partially : {}, {}", id,
                notificationPreferenceDTO);
        if (notificationPreferenceDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, notificationPreferenceDTO.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!notificationPreferenceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<NotificationPreferenceDTO> result = notificationPreferenceService
                .partialUpdate(notificationPreferenceDTO);

        return ResponseUtil.wrapOrNotFound(
                result,
                HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                        notificationPreferenceDTO.getId().toString()));
    }

    /**
     * {@code GET  /notification-preferences} : get all the notification
     * preferences.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of notification preferences in body.
     */
    @GetMapping("")
    public ResponseEntity<List<NotificationPreferenceDTO>> getAllNotificationPreferences(
            @org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of NotificationPreferences");
        Page<NotificationPreferenceDTO> page = notificationPreferenceService.findAll(pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /notification-preferences/:id} : get the "id" notification
     * preference.
     *
     * @param id the id of the notificationPreferenceDTO to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the notificationPreferenceDTO, or with status
     *         {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<NotificationPreferenceDTO> getNotificationPreference(@PathVariable("id") Long id) {
        LOG.debug("REST request to get NotificationPreference : {}", id);
        Optional<NotificationPreferenceDTO> notificationPreferenceDTO = notificationPreferenceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(notificationPreferenceDTO);
    }

    /**
     * {@code DELETE  /notification-preferences/:id} : delete the "id" notification
     * preference.
     *
     * @param id the id of the notificationPreferenceDTO to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNotificationPreference(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete NotificationPreference : {}", id);
        notificationPreferenceService.delete(id);
        return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
    }

    /**
     * {@code GET  /notification-preferences/user/:userProfileId} : get all
     * notification preferences for a specific user.
     *
     * @param userProfileId the user profile ID.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of notification preferences in body.
     */
    @GetMapping("/user/{userProfileId}")
    public ResponseEntity<List<NotificationPreferenceDTO>> getNotificationPreferencesByUser(
            @PathVariable("userProfileId") Long userProfileId) {
        LOG.debug("REST request to get NotificationPreferences for user : {}", userProfileId);
        List<NotificationPreferenceDTO> preferences = notificationPreferenceService.findByUserProfileId(userProfileId);
        return ResponseEntity.ok().body(preferences);
    }

    /**
     * {@code GET  /notification-preferences/user/:userProfileId/enabled} : get all
     * enabled notification preferences for a specific user.
     *
     * @param userProfileId the user profile ID.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list
     *         of enabled notification preferences in body.
     */
    @GetMapping("/user/{userProfileId}/enabled")
    public ResponseEntity<List<NotificationPreferenceDTO>> getEnabledNotificationPreferencesByUser(
            @PathVariable("userProfileId") Long userProfileId) {
        LOG.debug("REST request to get enabled NotificationPreferences for user : {}", userProfileId);
        List<NotificationPreferenceDTO> preferences = notificationPreferenceService
                .findEnabledByUserProfileId(userProfileId);
        return ResponseEntity.ok().body(preferences);
    }

    /**
     * {@code GET  /notification-preferences/user/:userProfileId/type/:notificationType}
     * : get a specific notification preference by user and type.
     *
     * @param userProfileId    the user profile ID.
     * @param notificationType the notification type.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the notificationPreferenceDTO, or with status
     *         {@code 404 (Not Found)}.
     */
    @GetMapping("/user/{userProfileId}/type/{notificationType}")
    public ResponseEntity<NotificationPreferenceDTO> getNotificationPreferenceByUserAndType(
            @PathVariable("userProfileId") Long userProfileId,
            @PathVariable("notificationType") NotificationType notificationType) {
        LOG.debug("REST request to get NotificationPreference for user {} and type {}", userProfileId,
                notificationType);
        Optional<NotificationPreferenceDTO> notificationPreferenceDTO = notificationPreferenceService
                .findByUserProfileIdAndNotificationType(userProfileId, notificationType);
        return ResponseUtil.wrapOrNotFound(notificationPreferenceDTO);
    }

    /**
     * {@code GET  /notification-preferences/user/:userProfileId/type/:notificationType/enabled}
     * : check if a notification type is enabled for a user.
     *
     * @param userProfileId    the user profile ID.
     * @param notificationType the notification type.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the boolean result.
     */
    @GetMapping("/user/{userProfileId}/type/{notificationType}/enabled")
    public ResponseEntity<Boolean> isNotificationEnabled(
            @PathVariable("userProfileId") Long userProfileId,
            @PathVariable("notificationType") NotificationType notificationType) {
        LOG.debug("REST request to check if notification {} is enabled for user {}", notificationType, userProfileId);
        boolean enabled = notificationPreferenceService.isNotificationEnabled(userProfileId, notificationType);
        return ResponseEntity.ok().body(enabled);
    }

    /**
     * {@code PUT  /notification-preferences/user/:userProfileId/type/:notificationType}
     * : create or update a notification preference for a user and type.
     *
     * @param userProfileId             the user profile ID.
     * @param notificationType          the notification type.
     * @param notificationPreferenceDTO the notification preference data.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the updated notificationPreferenceDTO.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/user/{userProfileId}/type/{notificationType}")
    public ResponseEntity<NotificationPreferenceDTO> createOrUpdateNotificationPreference(
            @PathVariable("userProfileId") Long userProfileId,
            @PathVariable("notificationType") NotificationType notificationType,
            @Valid @RequestBody NotificationPreferenceDTO notificationPreferenceDTO) throws URISyntaxException {
        LOG.debug("REST request to create or update NotificationPreference for user {} and type {}", userProfileId,
                notificationType);
        NotificationPreferenceDTO result = notificationPreferenceService
                .createOrUpdatePreference(userProfileId, notificationType, notificationPreferenceDTO);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                        result.getId().toString()))
                .body(result);
    }

    /**
     * {@code POST  /notification-preferences/user/:userProfileId/initialize} :
     * initialize default notification preferences for a user.
     *
     * @param userProfileId the user profile ID.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body
     *         the list of created default preferences.
     */
    @PostMapping("/user/{userProfileId}/initialize")
    public ResponseEntity<List<NotificationPreferenceDTO>> initializeDefaultPreferences(
            @PathVariable("userProfileId") Long userProfileId) {
        LOG.debug("REST request to initialize default NotificationPreferences for user : {}", userProfileId);
        List<NotificationPreferenceDTO> preferences = notificationPreferenceService
                .initializeDefaultPreferences(userProfileId);
        return ResponseEntity.ok().body(preferences);
    }
}