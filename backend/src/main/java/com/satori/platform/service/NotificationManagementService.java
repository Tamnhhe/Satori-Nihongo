package com.satori.platform.service;

import com.satori.platform.domain.NotificationDelivery;
import com.satori.platform.domain.UserProfile;
import com.satori.platform.domain.enumeration.DeliveryStatus;
import com.satori.platform.domain.enumeration.NotificationType;
import com.satori.platform.domain.enumeration.Role;
import com.satori.platform.repository.NotificationDeliveryRepository;
import com.satori.platform.repository.UserProfileRepository;
import com.satori.platform.service.dto.NotificationContentDTO;
import com.satori.platform.service.dto.NotificationDeliveryDTO;
import com.satori.platform.service.dto.NotificationScheduleDTO;
import com.satori.platform.service.dto.NotificationTemplateDTO;
import com.satori.platform.web.rest.errors.BadRequestAlertException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service for managing notification templates, scheduling, and delivery
 * tracking.
 * Provides comprehensive notification management capabilities for admin
 * interface.
 */
@Service
@Transactional
public class NotificationManagementService {

    private static final Logger LOG = LoggerFactory.getLogger(NotificationManagementService.class);

    private final NotificationDeliveryRepository notificationDeliveryRepository;
    private final NotificationTemplateService notificationTemplateService;
    private final NotificationDeliveryService notificationDeliveryService;
    private final UserProfileRepository userProfileRepository;
    private final ObjectMapper objectMapper;

    // In-memory storage for templates and schedules (in a real implementation,
    // these would be in database)
    private final Map<Long, NotificationTemplateDTO> templates = new HashMap<>();
    private final Map<Long, NotificationScheduleDTO> schedules = new HashMap<>();
    private Long templateIdCounter = 1L;
    private Long scheduleIdCounter = 1L;

    public NotificationManagementService(
            NotificationDeliveryRepository notificationDeliveryRepository,
            NotificationTemplateService notificationTemplateService,
            NotificationDeliveryService notificationDeliveryService,
            UserProfileRepository userProfileRepository,
            ObjectMapper objectMapper) {
        this.notificationDeliveryRepository = notificationDeliveryRepository;
        this.notificationTemplateService = notificationTemplateService;
        this.notificationDeliveryService = notificationDeliveryService;
        this.userProfileRepository = userProfileRepository;
        this.objectMapper = objectMapper;

        // Initialize with default templates
        initializeDefaultTemplates();
    }

    /**
     * Create or update notification template
     * Requirements: 7.1
     */
    public NotificationTemplateDTO saveTemplate(NotificationTemplateDTO templateDTO) {
        LOG.debug("Saving notification template: {}", templateDTO.getName());

        if (templateDTO.getId() == null) {
            templateDTO.setId(templateIdCounter++);
            templateDTO.setCreatedAt(Instant.now());
        }
        templateDTO.setUpdatedAt(Instant.now());

        templates.put(templateDTO.getId(), templateDTO);
        LOG.debug("Saved notification template with ID: {}", templateDTO.getId());

        return templateDTO;
    }

    /**
     * Get all notification templates
     * Requirements: 7.1
     */
    @Transactional(readOnly = true)
    public Page<NotificationTemplateDTO> getAllTemplates(Pageable pageable) {
        LOG.debug("Getting all notification templates");

        List<NotificationTemplateDTO> templateList = new ArrayList<>(templates.values());
        templateList.sort(Comparator.comparing(NotificationTemplateDTO::getCreatedAt).reversed());

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), templateList.size());

        if (start > templateList.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, templateList.size());
        }

        List<NotificationTemplateDTO> pageContent = templateList.subList(start, end);
        return new PageImpl<>(pageContent, pageable, templateList.size());
    }

    /**
     * Get notification template by ID
     * Requirements: 7.1
     */
    @Transactional(readOnly = true)
    public Optional<NotificationTemplateDTO> getTemplate(Long id) {
        LOG.debug("Getting notification template with ID: {}", id);
        return Optional.ofNullable(templates.get(id));
    }

    /**
     * Delete notification template
     * Requirements: 7.1
     */
    public void deleteTemplate(Long id) {
        LOG.debug("Deleting notification template with ID: {}", id);

        if (!templates.containsKey(id)) {
            throw new BadRequestAlertException("Template not found", "notificationTemplate", "notfound");
        }

        templates.remove(id);
        LOG.debug("Deleted notification template with ID: {}", id);
    }

    /**
     * Create or update notification schedule
     * Requirements: 7.2
     */
    public NotificationScheduleDTO saveSchedule(NotificationScheduleDTO scheduleDTO) {
        LOG.debug("Saving notification schedule: {}", scheduleDTO.getTitle());

        // Validate template exists
        if (!templates.containsKey(scheduleDTO.getTemplateId())) {
            throw new BadRequestAlertException("Template not found", "notificationSchedule", "templatenotfound");
        }

        if (scheduleDTO.getId() == null) {
            scheduleDTO.setId(scheduleIdCounter++);
            scheduleDTO.setCreatedAt(Instant.now());
        }
        scheduleDTO.setUpdatedAt(Instant.now());

        // Calculate target recipients
        Long recipientCount = calculateTargetRecipients(scheduleDTO);
        scheduleDTO.setTotalRecipients(recipientCount);

        schedules.put(scheduleDTO.getId(), scheduleDTO);
        LOG.debug("Saved notification schedule with ID: {}", scheduleDTO.getId());

        return scheduleDTO;
    }

    /**
     * Get all notification schedules
     * Requirements: 7.2
     */
    @Transactional(readOnly = true)
    public Page<NotificationScheduleDTO> getAllSchedules(Pageable pageable) {
        LOG.debug("Getting all notification schedules");

        List<NotificationScheduleDTO> scheduleList = new ArrayList<>(schedules.values());
        scheduleList.sort(Comparator.comparing(NotificationScheduleDTO::getCreatedAt).reversed());

        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), scheduleList.size());

        if (start > scheduleList.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, scheduleList.size());
        }

        List<NotificationScheduleDTO> pageContent = scheduleList.subList(start, end);
        return new PageImpl<>(pageContent, pageable, scheduleList.size());
    }

    /**
     * Get notification schedule by ID
     * Requirements: 7.2
     */
    @Transactional(readOnly = true)
    public Optional<NotificationScheduleDTO> getSchedule(Long id) {
        LOG.debug("Getting notification schedule with ID: {}", id);
        return Optional.ofNullable(schedules.get(id));
    }

    /**
     * Send notification immediately
     * Requirements: 7.2
     */
    public void sendNotificationNow(Long scheduleId) {
        LOG.debug("Sending notification immediately for schedule ID: {}", scheduleId);

        NotificationScheduleDTO schedule = schedules.get(scheduleId);
        if (schedule == null) {
            throw new BadRequestAlertException("Schedule not found", "notificationSchedule", "notfound");
        }

        NotificationTemplateDTO template = templates.get(schedule.getTemplateId());
        if (template == null) {
            throw new BadRequestAlertException("Template not found", "notificationTemplate", "notfound");
        }

        // Get target recipients
        List<UserProfile> recipients = getTargetRecipients(schedule);

        // Create notification content
        NotificationContentDTO content = createNotificationContent(template, schedule);

        // Queue notifications for delivery
        List<NotificationDelivery> deliveries = new ArrayList<>();

        if (schedule.isEmailEnabled()) {
            deliveries.addAll(notificationDeliveryService.queueBulkNotifications(
                    recipients, content, schedule.getType(), "EMAIL"));
        }

        if (schedule.isPushEnabled()) {
            deliveries.addAll(notificationDeliveryService.queueBulkNotifications(
                    recipients, content, schedule.getType(), "PUSH"));
        }

        if (schedule.isInAppEnabled()) {
            deliveries.addAll(notificationDeliveryService.queueBulkNotifications(
                    recipients, content, schedule.getType(), "IN_APP"));
        }

        // Update schedule status and statistics
        schedule.setStatus("SENT");
        schedule.setSentCount((long) deliveries.size());
        schedule.setUpdatedAt(Instant.now());
        schedules.put(scheduleId, schedule);

        LOG.debug("Queued {} notifications for immediate delivery", deliveries.size());
    }

    /**
     * Get delivery status tracking for a schedule
     * Requirements: 7.2
     */
    @Transactional(readOnly = true)
    public Page<NotificationDeliveryDTO> getDeliveryStatus(Long scheduleId, Pageable pageable) {
        LOG.debug("Getting delivery status for schedule ID: {}", scheduleId);

        // In a real implementation, you would query by schedule ID
        // For now, we'll return recent deliveries as an example
        Page<NotificationDelivery> deliveries = notificationDeliveryRepository.findAll(pageable);

        List<NotificationDeliveryDTO> deliveryDTOs = deliveries.getContent().stream()
                .map(this::convertToDeliveryDTO)
                .collect(Collectors.toList());

        return new PageImpl<>(deliveryDTOs, pageable, deliveries.getTotalElements());
    }

    /**
     * Retry failed notification delivery
     * Requirements: 7.2
     */
    public void retryFailedDelivery(Long deliveryId) {
        LOG.debug("Retrying failed delivery with ID: {}", deliveryId);

        Optional<NotificationDelivery> deliveryOpt = notificationDeliveryRepository.findById(deliveryId);
        if (deliveryOpt.isEmpty()) {
            throw new BadRequestAlertException("Delivery not found", "notificationDelivery", "notfound");
        }

        NotificationDelivery delivery = deliveryOpt.get();
        if (!delivery.canRetry()) {
            throw new BadRequestAlertException("Delivery cannot be retried", "notificationDelivery", "cannotretry");
        }

        // Reset for retry
        delivery.setStatus(DeliveryStatus.PENDING);
        delivery.setNextRetryAt(null);
        delivery.setFailureReason(null);
        delivery.setFailedAt(null);

        notificationDeliveryRepository.save(delivery);
        LOG.debug("Reset delivery {} for retry", deliveryId);
    }

    /**
     * Cancel scheduled notification
     * Requirements: 7.2
     */
    public void cancelScheduledNotification(Long scheduleId) {
        LOG.debug("Cancelling scheduled notification with ID: {}", scheduleId);

        NotificationScheduleDTO schedule = schedules.get(scheduleId);
        if (schedule == null) {
            throw new BadRequestAlertException("Schedule not found", "notificationSchedule", "notfound");
        }

        if (!"SCHEDULED".equals(schedule.getStatus()) && !"DRAFT".equals(schedule.getStatus())) {
            throw new BadRequestAlertException("Cannot cancel notification", "notificationSchedule", "cannotcancel");
        }

        schedule.setStatus("CANCELLED");
        schedule.setUpdatedAt(Instant.now());
        schedules.put(scheduleId, schedule);

        LOG.debug("Cancelled scheduled notification with ID: {}", scheduleId);
    }

    // Private helper methods

    private void initializeDefaultTemplates() {
        // Schedule reminder template
        NotificationTemplateDTO scheduleTemplate = new NotificationTemplateDTO(
                "Schedule Reminder",
                NotificationType.SCHEDULE_REMINDER,
                "Class Reminder: {{course.title}}",
                "Dear {{user.fullName}},\n\nThis is a reminder that you have a class scheduled:\n\nCourse: {{course.title}}\nDate: {{schedule.date}}\nTime: {{schedule.startTime}}\n\nPlease be on time.\n\nBest regards,\nSatori Learning Platform");
        scheduleTemplate.setPushTitle("Class Reminder");
        scheduleTemplate.setPushMessage("{{course.title}} starts at {{schedule.startTime}}");
        scheduleTemplate.setInAppTitle("Class Reminder");
        scheduleTemplate.setInAppMessage("You have a class scheduled for {{course.title}}");
        saveTemplate(scheduleTemplate);

        // Quiz reminder template
        NotificationTemplateDTO quizTemplate = new NotificationTemplateDTO(
                "Quiz Reminder",
                NotificationType.QUIZ_REMINDER,
                "Quiz Due Soon: {{quiz.title}}",
                "Dear {{user.fullName}},\n\nThis is a reminder that you have a quiz due soon:\n\nQuiz: {{quiz.title}}\nDue in: {{hoursUntilDue}} hours\n\nPlease complete it before the deadline.\n\nBest regards,\nSatori Learning Platform");
        quizTemplate.setPushTitle("Quiz Due Soon");
        quizTemplate.setPushMessage("{{quiz.title}} is due in {{hoursUntilDue}} hours");
        quizTemplate.setInAppTitle("Quiz Reminder");
        quizTemplate.setInAppMessage("Don't forget to complete {{quiz.title}}");
        saveTemplate(quizTemplate);

        // Course announcement template
        NotificationTemplateDTO announcementTemplate = new NotificationTemplateDTO(
                "Course Announcement",
                NotificationType.COURSE_ANNOUNCEMENT,
                "Announcement: {{course.title}}",
                "Dear {{user.fullName}},\n\nNew announcement for {{course.title}}:\n\n{{announcement}}\n\nBest regards,\nSatori Learning Platform");
        announcementTemplate.setPushTitle("Course Announcement");
        announcementTemplate.setPushMessage("New announcement for {{course.title}}");
        announcementTemplate.setInAppTitle("Course Announcement");
        announcementTemplate.setInAppMessage("Check the new announcement for {{course.title}}");
        saveTemplate(announcementTemplate);
    }

    private Long calculateTargetRecipients(NotificationScheduleDTO schedule) {
        List<UserProfile> recipients = getTargetRecipients(schedule);
        return (long) recipients.size();
    }

    private List<UserProfile> getTargetRecipients(NotificationScheduleDTO schedule) {
        List<UserProfile> recipients = new ArrayList<>();

        // Target specific users
        if (schedule.getTargetUserIds() != null && !schedule.getTargetUserIds().isEmpty()) {
            recipients.addAll(userProfileRepository.findAllById(schedule.getTargetUserIds()));
        }

        // Target by roles
        if (schedule.getTargetRoles() != null && !schedule.getTargetRoles().isEmpty()) {
            for (String role : schedule.getTargetRoles()) {
                try {
                    Role roleEnum = Role.valueOf(role.replace("ROLE_", ""));
                    recipients.addAll(userProfileRepository.findByRole(roleEnum));
                } catch (IllegalArgumentException e) {
                    LOG.warn("Invalid role: {}", role);
                }
            }
        }

        // Target by courses
        if (schedule.getTargetCourseIds() != null && !schedule.getTargetCourseIds().isEmpty()) {
            // In a real implementation, you would query users enrolled in these courses
            // For now, we'll just return all users
            if (recipients.isEmpty()) {
                recipients.addAll(userProfileRepository.findAll());
            }
        }

        // If no specific targeting, return all users
        if (recipients.isEmpty()) {
            recipients.addAll(userProfileRepository.findAll());
        }

        return recipients.stream().distinct().collect(Collectors.toList());
    }

    private NotificationContentDTO createNotificationContent(NotificationTemplateDTO template,
            NotificationScheduleDTO schedule) {
        NotificationContentDTO content = new NotificationContentDTO();

        content.setEmailSubject(template.getEmailSubject());
        content.setEmailContent(template.getEmailContent());
        content.setPushTitle(template.getPushTitle());
        content.setPushMessage(template.getPushMessage());
        content.setInAppTitle(template.getInAppTitle());
        content.setInAppMessage(template.getInAppMessage());
        content.setLocale(template.getLocale());

        content.setEmailEnabled(schedule.isEmailEnabled());
        content.setPushEnabled(schedule.isPushEnabled());
        content.setInAppEnabled(schedule.isInAppEnabled());

        return content;
    }

    private NotificationDeliveryDTO convertToDeliveryDTO(NotificationDelivery delivery) {
        NotificationDeliveryDTO dto = new NotificationDeliveryDTO();

        dto.setId(delivery.getId());
        dto.setRecipientId(delivery.getRecipientId());
        dto.setRecipientEmail(delivery.getRecipientEmail());
        dto.setNotificationType(delivery.getNotificationType());
        dto.setDeliveryChannel(delivery.getDeliveryChannel());
        dto.setStatus(delivery.getStatus());
        dto.setSubject(delivery.getSubject());
        dto.setContent(delivery.getContent());
        dto.setScheduledAt(delivery.getScheduledAt());
        dto.setSentAt(delivery.getSentAt());
        dto.setDeliveredAt(delivery.getDeliveredAt());
        dto.setFailedAt(delivery.getFailedAt());
        dto.setFailureReason(delivery.getFailureReason());
        dto.setRetryCount(delivery.getRetryCount());
        dto.setMaxRetries(delivery.getMaxRetries());
        dto.setNextRetryAt(delivery.getNextRetryAt());
        dto.setExternalId(delivery.getExternalId());
        dto.setCreatedAt(delivery.getCreatedAt());
        dto.setUpdatedAt(delivery.getUpdatedAt());

        // Parse metadata
        if (delivery.getMetadata() != null) {
            try {
                @SuppressWarnings("unchecked")
                Map<String, Object> metadata = objectMapper.readValue(delivery.getMetadata(), Map.class);
                dto.setMetadata(metadata);
            } catch (JsonProcessingException e) {
                LOG.warn("Failed to parse metadata for delivery {}", delivery.getId(), e);
            }
        }

        // Get recipient name
        Optional<UserProfile> userOpt = userProfileRepository.findById(delivery.getRecipientId());
        userOpt.ifPresent(user -> dto.setRecipientName(user.getFullName()));

        return dto;
    }
}