package com.satori.platform.web.rest;

import com.satori.platform.service.NotificationManagementService;
import com.satori.platform.service.dto.NotificationDeliveryDTO;
import com.satori.platform.service.dto.NotificationScheduleDTO;
import com.satori.platform.service.dto.NotificationTemplateDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import jakarta.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Optional;

/**
 * REST controller for managing notification templates, scheduling, and delivery
 * tracking.
 * Provides comprehensive notification management for admin interface.
 */
@RestController
@RequestMapping("/api/admin/notifications")
public class NotificationManagementResource {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationManagementResource.class);

    private static final String ENTITY_NAME = "notificationManagement";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final NotificationManagementService notificationManagementService;

    public NotificationManagementResource(NotificationManagementService notificationManagementService) {
        this.notificationManagementService = notificationManagementService;
    }

    // Template Management Endpoints

    /**
     * POST /api/admin/notifications/templates : Create a new notification template.
     * Requirements: 7.1
     */
    @PostMapping("/templates")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<NotificationTemplateDTO> createTemplate(
            @Valid @RequestBody NotificationTemplateDTO templateDTO)
            throws URISyntaxException {
        LOG.debug("REST request to save NotificationTemplate : {}", templateDTO);

        if (templateDTO.getId() != null) {
            throw new BadRequestAlertException("A new template cannot already have an ID", ENTITY_NAME, "idexists");
        }

        NotificationTemplateDTO result = notificationManagementService.saveTemplate(templateDTO);
        return ResponseEntity.created(new URI("/api/admin/notifications/templates/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                        result.getId().toString()))
                .body(result);
    }

    /**
     * PUT /api/admin/notifications/templates/:id : Update an existing notification
     * template.
     * Requirements: 7.1
     */
    @PutMapping("/templates/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<NotificationTemplateDTO> updateTemplate(
            @PathVariable(value = "id", required = false) final Long id,
            @Valid @RequestBody NotificationTemplateDTO templateDTO) throws URISyntaxException {
        LOG.debug("REST request to update NotificationTemplate : {}, {}", id, templateDTO);

        if (templateDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!templateDTO.getId().equals(id)) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        NotificationTemplateDTO result = notificationManagementService.saveTemplate(templateDTO);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                        templateDTO.getId().toString()))
                .body(result);
    }

    /**
     * GET /api/admin/notifications/templates : Get all notification templates.
     * Requirements: 7.1
     */
    @GetMapping("/templates")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<Page<NotificationTemplateDTO>> getAllTemplates(Pageable pageable) {
        LOG.debug("REST request to get all NotificationTemplates");

        Page<NotificationTemplateDTO> page = notificationManagementService.getAllTemplates(pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * GET /api/admin/notifications/templates/:id : Get the notification template.
     * Requirements: 7.1
     */
    @GetMapping("/templates/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<NotificationTemplateDTO> getTemplate(@PathVariable Long id) {
        LOG.debug("REST request to get NotificationTemplate : {}", id);

        Optional<NotificationTemplateDTO> templateDTO = notificationManagementService.getTemplate(id);
        return ResponseUtil.wrapOrNotFound(templateDTO);
    }

    /**
     * DELETE /api/admin/notifications/templates/:id : Delete the notification
     * template.
     * Requirements: 7.1
     */
    @DeleteMapping("/templates/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> deleteTemplate(@PathVariable Long id) {
        LOG.debug("REST request to delete NotificationTemplate : {}", id);

        notificationManagementService.deleteTemplate(id);
        return ResponseEntity.noContent()
                .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
                .build();
    }

    // Schedule Management Endpoints

    /**
     * POST /api/admin/notifications/schedules : Create a new notification schedule.
     * Requirements: 7.2
     */
    @PostMapping("/schedules")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<NotificationScheduleDTO> createSchedule(
            @Valid @RequestBody NotificationScheduleDTO scheduleDTO)
            throws URISyntaxException {
        LOG.debug("REST request to save NotificationSchedule : {}", scheduleDTO);

        if (scheduleDTO.getId() != null) {
            throw new BadRequestAlertException("A new schedule cannot already have an ID", ENTITY_NAME, "idexists");
        }

        NotificationScheduleDTO result = notificationManagementService.saveSchedule(scheduleDTO);
        return ResponseEntity.created(new URI("/api/admin/notifications/schedules/" + result.getId()))
                .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME,
                        result.getId().toString()))
                .body(result);
    }

    /**
     * PUT /api/admin/notifications/schedules/:id : Update an existing notification
     * schedule.
     * Requirements: 7.2
     */
    @PutMapping("/schedules/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<NotificationScheduleDTO> updateSchedule(
            @PathVariable(value = "id", required = false) final Long id,
            @Valid @RequestBody NotificationScheduleDTO scheduleDTO) throws URISyntaxException {
        LOG.debug("REST request to update NotificationSchedule : {}, {}", id, scheduleDTO);

        if (scheduleDTO.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!scheduleDTO.getId().equals(id)) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        NotificationScheduleDTO result = notificationManagementService.saveSchedule(scheduleDTO);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME,
                        scheduleDTO.getId().toString()))
                .body(result);
    }

    /**
     * GET /api/admin/notifications/schedules : Get all notification schedules.
     * Requirements: 7.2
     */
    @GetMapping("/schedules")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<Page<NotificationScheduleDTO>> getAllSchedules(Pageable pageable) {
        LOG.debug("REST request to get all NotificationSchedules");

        Page<NotificationScheduleDTO> page = notificationManagementService.getAllSchedules(pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * GET /api/admin/notifications/schedules/:id : Get the notification schedule.
     * Requirements: 7.2
     */
    @GetMapping("/schedules/{id}")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<NotificationScheduleDTO> getSchedule(@PathVariable Long id) {
        LOG.debug("REST request to get NotificationSchedule : {}", id);

        Optional<NotificationScheduleDTO> scheduleDTO = notificationManagementService.getSchedule(id);
        return ResponseUtil.wrapOrNotFound(scheduleDTO);
    }

    /**
     * POST /api/admin/notifications/schedules/:id/send : Send notification
     * immediately.
     * Requirements: 7.2
     */
    @PostMapping("/schedules/{id}/send")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<Void> sendNotificationNow(@PathVariable Long id) {
        LOG.debug("REST request to send notification immediately : {}", id);

        notificationManagementService.sendNotificationNow(id);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(applicationName, "Notification sent successfully", id.toString()))
                .build();
    }

    /**
     * POST /api/admin/notifications/schedules/:id/cancel : Cancel scheduled
     * notification.
     * Requirements: 7.2
     */
    @PostMapping("/schedules/{id}/cancel")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<Void> cancelScheduledNotification(@PathVariable Long id) {
        LOG.debug("REST request to cancel scheduled notification : {}", id);

        notificationManagementService.cancelScheduledNotification(id);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(applicationName, "Notification cancelled successfully", id.toString()))
                .build();
    }

    // Delivery Tracking Endpoints

    /**
     * GET /api/admin/notifications/schedules/:id/deliveries : Get delivery status
     * for a schedule.
     * Requirements: 7.2
     */
    @GetMapping("/schedules/{id}/deliveries")
    @PreAuthorize("hasAuthority('ROLE_ADMIN') or hasAuthority('ROLE_GIANG_VIEN')")
    public ResponseEntity<Page<NotificationDeliveryDTO>> getDeliveryStatus(@PathVariable Long id, Pageable pageable) {
        LOG.debug("REST request to get delivery status for schedule : {}", id);

        Page<NotificationDeliveryDTO> page = notificationManagementService.getDeliveryStatus(id, pageable);
        HttpHeaders headers = PaginationUtil
                .generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page);
    }

    /**
     * POST /api/admin/notifications/deliveries/:id/retry : Retry failed
     * notification delivery.
     * Requirements: 7.2
     */
    @PostMapping("/deliveries/{id}/retry")
    @PreAuthorize("hasAuthority('ROLE_ADMIN')")
    public ResponseEntity<Void> retryFailedDelivery(@PathVariable Long id) {
        LOG.debug("REST request to retry failed delivery : {}", id);

        notificationManagementService.retryFailedDelivery(id);
        return ResponseEntity.ok()
                .headers(HeaderUtil.createAlert(applicationName, "Delivery retry initiated", id.toString()))
                .build();
    }
}