package com.satori.platform.validation;

import com.satori.platform.domain.*;
import com.satori.platform.domain.enumeration.*;
import com.satori.platform.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;

/**
 * Focused validation tests for notification-related repositories.
 * Tests NotificationDeliveryRepository and NotificationPreferenceRepository.
 * 
 * Requirements: 3.1, 3.5
 */
@ApiValidationTestConfiguration
class NotificationRepositoryValidationTest {

        @Autowired
        private NotificationDeliveryRepository notificationDeliveryRepository;

        @Autowired
        private NotificationPreferenceRepository notificationPreferenceRepository;

        @Autowired
        private UserProfileRepository userProfileRepository;

        private DomainTestDataBuilder testDataBuilder;
        private UserProfile testUserProfile;
        private NotificationDelivery testNotificationDelivery;
        private NotificationPreference testNotificationPreference;

        @BeforeEach
        void setUp() {
                testDataBuilder = new DomainTestDataBuilder();
                setupTestData();
        }

        private void setupTestData() {
                testUserProfile = testDataBuilder.createUserProfile("testuser", "test@example.com", Role.HOC_VIEN);
                testUserProfile = userProfileRepository.save(testUserProfile);

                testNotificationDelivery = testDataBuilder.createNotificationDelivery(
                                testUserProfile.getId(), NotificationType.QUIZ_REMINDER, "EMAIL", "Test Notification");
                testNotificationDelivery = notificationDeliveryRepository.save(testNotificationDelivery);

                testNotificationPreference = testDataBuilder.createNotificationPreference(
                                testUserProfile, NotificationType.QUIZ_REMINDER, true);
                testNotificationPreference = notificationPreferenceRepository.save(testNotificationPreference);
        }

        // NotificationDeliveryRepository Tests

        @Test
        void testNotificationDeliveryBasicCrud() {
                // Test save
                NotificationDelivery newNotification = testDataBuilder.createNotificationDelivery(
                                testUserProfile.getId(), NotificationType.COURSE_ENROLLMENT, "SMS",
                                "Course Enrollment");
                newNotification.setStatus(DeliveryStatus.SENT);
                newNotification.setSentAt(Instant.now());

                NotificationDelivery savedNotification = notificationDeliveryRepository.save(newNotification);
                assertThat(savedNotification.getId()).isNotNull();
                assertThat(savedNotification.getSubject()).isEqualTo("Course Enrollment");

                // Test findById
                Optional<NotificationDelivery> foundNotification = notificationDeliveryRepository
                                .findById(savedNotification.getId());
                assertThat(foundNotification).isPresent();
                assertThat(foundNotification.get().getDeliveryChannel()).isEqualTo("SMS");

                // Test update
                savedNotification.setStatus(DeliveryStatus.DELIVERED);
                savedNotification.setDeliveredAt(Instant.now());
                NotificationDelivery updatedNotification = notificationDeliveryRepository.save(savedNotification);
                assertThat(updatedNotification.getStatus()).isEqualTo(DeliveryStatus.DELIVERED);

                // Test delete
                notificationDeliveryRepository.delete(savedNotification);
                Optional<NotificationDelivery> deletedNotification = notificationDeliveryRepository
                                .findById(savedNotification.getId());
                assertThat(deletedNotification).isEmpty();
        }

        @Test
        void testNotificationDeliveryCustomQueries() {
                // Test findByRecipientId
                List<NotificationDelivery> notificationsByRecipient = notificationDeliveryRepository
                                .findByRecipientId(testUserProfile.getId());
                assertThat(notificationsByRecipient).hasSize(1);
                assertThat(notificationsByRecipient.get(0).getSubject()).isEqualTo("Test Notification");

                // Test findByDeliveryStatus
                List<NotificationDelivery> pendingNotifications = notificationDeliveryRepository
                                .findByDeliveryStatus("PENDING");
                assertThat(pendingNotifications).hasSize(1);
                assertThat(pendingNotifications.get(0).getStatus()).isEqualTo(DeliveryStatus.PENDING);

                // Test findPendingNotifications
                List<NotificationDelivery> pendingForProcessing = notificationDeliveryRepository
                                .findPendingNotifications(
                                                DeliveryStatus.PENDING, Instant.now().plus(2, ChronoUnit.HOURS));
                assertThat(pendingForProcessing).hasSize(1);

                // Test countByStatus
                long pendingCount = notificationDeliveryRepository.countByStatus(DeliveryStatus.PENDING);
                assertThat(pendingCount).isEqualTo(1);

                // Test findByRecipientIdOrderByCreatedAtDesc with pagination
                Pageable pageable = PageRequest.of(0, 10);
                Page<NotificationDelivery> notificationsPage = notificationDeliveryRepository
                                .findByRecipientIdOrderByCreatedAtDesc(testUserProfile.getId(), pageable);
                assertThat(notificationsPage.getContent()).hasSize(1);
                assertThat(notificationsPage.getContent().get(0).getRecipientId()).isEqualTo(testUserProfile.getId());
        }

        @Test
        void testNotificationAnalyticsQueries() {
                // Create additional notifications for analytics testing
                createNotificationAnalyticsTestData();

                // Test getDeliveryStatistics
                Instant startDate = Instant.now().minus(2, ChronoUnit.HOURS);
                Instant endDate = Instant.now().plus(1, ChronoUnit.HOURS);
                List<Object[]> deliveryStats = notificationDeliveryRepository.getDeliveryStatistics(startDate, endDate);
                assertThat(deliveryStats).isNotEmpty();

                // Test getDeliveryRate
                Double deliveryRate = notificationDeliveryRepository.getDeliveryRate(startDate, endDate);
                assertThat(deliveryRate).isNotNull();
                assertThat(deliveryRate).isGreaterThan(0.0);

                // Test getDeliveryStatisticsByType
                List<Object[]> deliveryStatsByType = notificationDeliveryRepository.getDeliveryStatisticsByType(
                                startDate,
                                endDate);
                assertThat(deliveryStatsByType).isNotEmpty();

                // Test getDeliveryStatisticsByChannel
                List<Object[]> deliveryStatsByChannel = notificationDeliveryRepository.getDeliveryStatisticsByChannel(
                                startDate,
                                endDate);
                assertThat(deliveryStatsByChannel).isNotEmpty();
        }

        // NotificationPreferenceRepository Tests

        @Test
        void testNotificationPreferenceBasicCrud() {
                // Test save
                NotificationPreference newPreference = testDataBuilder.createNotificationPreference(
                                testUserProfile, NotificationType.COURSE_ENROLLMENT, false);

                NotificationPreference savedPreference = notificationPreferenceRepository.save(newPreference);
                assertThat(savedPreference.getId()).isNotNull();
                assertThat(savedPreference.getEnabled()).isFalse();

                // Test findById
                Optional<NotificationPreference> foundPreference = notificationPreferenceRepository
                                .findById(savedPreference.getId());
                assertThat(foundPreference).isPresent();
                assertThat(foundPreference.get().getNotificationType()).isEqualTo(NotificationType.COURSE_ENROLLMENT);

                // Test update
                savedPreference.setEnabled(true);
                NotificationPreference updatedPreference = notificationPreferenceRepository.save(savedPreference);
                assertThat(updatedPreference.getEnabled()).isTrue();

                // Test delete
                notificationPreferenceRepository.delete(savedPreference);
                Optional<NotificationPreference> deletedPreference = notificationPreferenceRepository
                                .findById(savedPreference.getId());
                assertThat(deletedPreference).isEmpty();
        }

        @Test
        void testNotificationPreferenceCustomQueries() {
                // Test findByUserProfile
                List<NotificationPreference> preferencesByUser = notificationPreferenceRepository
                                .findByUserProfile(testUserProfile);
                assertThat(preferencesByUser).hasSize(1);
                assertThat(preferencesByUser.get(0).getNotificationType()).isEqualTo(NotificationType.QUIZ_REMINDER);

                // Test findByUserProfileAndNotificationType
                Optional<NotificationPreference> specificPreference = notificationPreferenceRepository
                                .findByUserProfileAndNotificationType(testUserProfile, NotificationType.QUIZ_REMINDER);
                assertThat(specificPreference).isPresent();
                assertThat(specificPreference.get().getEnabled()).isTrue();

                // Test findAllEnabled
                List<NotificationPreference> enabledPreferences = notificationPreferenceRepository.findAllEnabled();
                assertThat(enabledPreferences).hasSize(1);
                assertThat(enabledPreferences.get(0).getEnabled()).isTrue();

                // Test isNotificationEnabled
                boolean isEnabled = notificationPreferenceRepository.isNotificationEnabled(
                                testUserProfile.getId(), NotificationType.QUIZ_REMINDER);
                assertThat(isEnabled).isTrue();

                boolean isDisabled = notificationPreferenceRepository.isNotificationEnabled(
                                testUserProfile.getId(), NotificationType.COURSE_ENROLLMENT);
                assertThat(isDisabled).isFalse();
        }

        private void createNotificationAnalyticsTestData() {
                Instant baseTime = Instant.now().minus(1, ChronoUnit.DAYS);

                // Create successful notifications
                for (int i = 0; i < 3; i++) {
                        NotificationDelivery notification = testDataBuilder.createNotificationDelivery(
                                        testUserProfile.getId(), NotificationType.QUIZ_REMINDER, "EMAIL",
                                        "Quiz Reminder " + i);
                        notification.setStatus(DeliveryStatus.DELIVERED);
                        notification.setCreatedAt(baseTime.plus(i, ChronoUnit.HOURS));
                        notification.setSentAt(baseTime.plus(i, ChronoUnit.HOURS).plus(1, ChronoUnit.MINUTES));
                        notification.setDeliveredAt(baseTime.plus(i, ChronoUnit.HOURS).plus(2, ChronoUnit.MINUTES));
                        notificationDeliveryRepository.save(notification);
                }

                // Create failed notifications
                for (int i = 0; i < 2; i++) {
                        NotificationDelivery notification = testDataBuilder.createNotificationDelivery(
                                        testUserProfile.getId(), NotificationType.LESSON_REMINDER, "SMS",
                                        "Lesson Reminder " + i);
                        notification.setStatus(DeliveryStatus.FAILED);
                        notification.setCreatedAt(baseTime.plus(i + 4, ChronoUnit.HOURS));
                        notification.setRetryCount(3);
                        notification.setErrorMessage("SMS delivery failed");
                        notificationDeliveryRepository.save(notification);
                }
        }
}