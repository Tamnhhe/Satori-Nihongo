/**
 * Notification Service - handles push notifications
 */

import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform, Alert } from 'react-native';
import Constants from 'expo-constants';

// Import navigation helper
import notificationNavigationHelper from './notification-navigation-helper';

// Configure notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
    this.notificationListener = null;
    this.responseListener = null;
    this.isExpoGo = Constants.appOwnership === 'expo';
    this.isInitialized = false;
  }

  /**
   * Check if we're running in Expo Go (which has limitations)
   */
  isRunningInExpoGo() {
    return this.isExpoGo;
  }

  /**
   * Initialize notification service (only once)
   * @returns {Promise<string|null>} Push token or null if failed
   */
  async initialize() {
    // Only initialize once
    if (this.isInitialized) {
      console.debug('NotificationService: Already initialized, skipping...');
      return this.expoPushToken || 'already-initialized';
    }

    try {
      console.debug('NotificationService: Initializing...');

      // Check if running in Expo Go
      if (this.isRunningInExpoGo()) {
        console.warn('NotificationService: Running in Expo Go - push notifications are limited');
        console.warn(
          'NotificationService: Only local notifications will work. Use development build for full functionality.'
        );

        // Still set up local notifications which work in Expo Go
        await this.setupLocalNotifications();
        this.isInitialized = true;
        return 'expo-go-local-only';
      }

      // Check if device supports notifications
      if (!Device.isDevice) {
        console.warn('NotificationService: Must use physical device for Push Notifications');
        return null;
      }

      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('NotificationService: Failed to get push token for push notification!');
        return null;
      }

      // Get push token (only works in development/production builds)
      try {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId || 'your-expo-project-id',
        });

        this.expoPushToken = token.data;
        console.debug('NotificationService: Push token:', this.expoPushToken);
      } catch (tokenError) {
        console.warn(
          'NotificationService: Failed to get push token (expected in Expo Go):',
          tokenError.message
        );
        // Continue with local notifications only
      }

      // Configure for Android
      if (Platform.OS === 'android') {
        await this.setupAndroidChannels();
      }

      // Set up listeners
      this.setupNotificationListeners();

      this.isInitialized = true;
      return this.expoPushToken || 'local-notifications-only';
    } catch (error) {
      console.error('NotificationService: Initialization failed', error);
      this.isInitialized = false;
      return null;
    }
  }

  /**
   * Set up local notifications (works in Expo Go)
   */
  async setupLocalNotifications() {
    try {
      // Request permissions for local notifications
      const { status } = await Notifications.requestPermissionsAsync();

      if (status !== 'granted') {
        console.warn('NotificationService: Local notification permissions not granted');
        return false;
      }

      // Configure for Android
      if (Platform.OS === 'android') {
        await this.setupAndroidChannels();
      }

      console.debug('NotificationService: Local notifications ready');
      return true;
    } catch (error) {
      console.error('NotificationService: Failed to setup local notifications', error);
      return false;
    }
  }

  /**
   * Set up Android notification channels
   */
  async setupAndroidChannels() {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });

    // Create lesson notifications channel
    await Notifications.setNotificationChannelAsync('lesson-notifications', {
      name: 'Lesson Notifications',
      description: 'Notifications about lessons and learning progress',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  /**
   * Set up notification listeners
   */
  setupNotificationListeners() {
    // Listener for notifications received while app is foregrounded
    this.notificationListener = Notifications.addNotificationReceivedListener((notification) => {
      console.debug('NotificationService: Notification received:', notification);
    });

    // Listener for user tapping on notifications
    this.responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
      console.debug('NotificationService: Notification tapped:', response);
      this.handleNotificationResponse(response);
    });
  }

  /**
   * Handle notification tap response
   * @param {Object} response - Notification response
   */
  handleNotificationResponse(response) {
    const { notification } = response;
    const { data } = notification.request.content;

    // Handle different notification types
    if (data && data.type) {
      switch (data.type) {
        case 'lesson_reminder':
        case 'welcome_back':
        case 'incomplete_lessons':
          // Navigate to lessons screen
          console.debug('NotificationService: Navigating to lessons');
          const navigated = notificationNavigationHelper.navigateToLessons();
          if (!navigated) {
            console.warn('NotificationService: Navigation to lessons failed');
          }
          break;
        case 'quiz_available':
          // Navigate to quiz screen (for now, navigate to lessons)
          console.debug('NotificationService: Navigating to quiz');
          const quizNavigated = notificationNavigationHelper.navigateToLessons();
          if (!quizNavigated) {
            console.warn('NotificationService: Navigation to quiz failed');
          }
          break;
        case 'all_completed':
          // Navigate to home or lessons to see completion status
          console.debug('NotificationService: Navigating to lessons for completion status');
          const completedNavigated = notificationNavigationHelper.navigateToLessons();
          if (!completedNavigated) {
            console.warn('NotificationService: Navigation failed');
          }
          break;
        default:
          console.debug('NotificationService: Unknown notification type');
      }
    }
  }

  /**
   * Send notification about remaining lessons
   * @param {number} remainingLessons - Number of remaining lessons
   * @param {Object} userInfo - Additional user information
   */
  async sendRemainingLessonsNotification(remainingLessons, userInfo = {}) {
    try {
      if (remainingLessons <= 0) {
        console.debug('NotificationService: No remaining lessons, skipping notification');
        return;
      }

      const title = '📚 Satori Nihongo';
      const body = `Bạn còn ${remainingLessons} bài học chưa hoàn thành. Hãy tiếp tục học tập nhé! 🌟`;

      await this.scheduleLocalNotification({
        title,
        body,
        data: {
          type: 'lesson_reminder',
          remainingLessons,
          timestamp: Date.now(),
          ...userInfo,
        },
        badge: remainingLessons,
      });

      console.debug('NotificationService: Remaining lessons notification sent', {
        remainingLessons,
        title,
        body,
      });
    } catch (error) {
      console.error('NotificationService: Failed to send remaining lessons notification', error);
    }
  }

  /**
   * Send welcome notification after login
   * @param {string} userName - User's name
   * @param {number} totalLessons - Total number of lessons
   * @param {number} completedLessons - Number of completed lessons
   */
  async sendWelcomeNotification(userName, totalLessons, completedLessons) {
    try {
      // Only send if service is initialized
      if (!this.isInitialized) {
        console.warn(
          'NotificationService: Service not initialized, cannot send welcome notification'
        );
        return false;
      }

      const remainingLessons = totalLessons - completedLessons;

      let title, body;

      if (remainingLessons <= 0) {
        // User has completed all lessons
        title = '🎉 Chúc mừng!';
        body = `Chào ${userName}! Bạn đã hoàn thành tất cả ${totalLessons} bài học. Tuyệt vời! 🌟`;
      } else {
        // User has remaining lessons
        title = '👋 Chào mừng trở lại!';
        body = `Chào ${userName}! Bạn còn ${remainingLessons} bài học chưa hoàn thành. Hãy tiếp tục học tập nhé! 📚`;
      }

      // Check if running in Expo Go
      if (this.isRunningInExpoGo()) {
        console.debug(
          'NotificationService: Expo Go detected - showing alert instead of notification'
        );

        // Show alert as fallback for Expo Go
        Alert.alert(title, body, [
          {
            text: 'OK',
            style: 'default',
          },
          {
            text: 'Xem bài học',
            style: 'default',
            onPress: () => {
              console.debug('NotificationService: User wants to view lessons');
              // Navigate to lessons screen using navigation helper
              const navigated = notificationNavigationHelper.navigateToLessons();
              if (!navigated) {
                console.warn(
                  'NotificationService: Navigation to lessons failed - nav ref not available'
                );
                Alert.alert(
                  'Thông báo',
                  'Không thể chuyển đến trang bài học. Vui lòng mở tab Bài học thủ công.'
                );
              }
            },
          },
        ]);

        console.debug('NotificationService: Alert shown as notification fallback', {
          userName,
          totalLessons,
          completedLessons,
          remainingLessons,
        });

        return true;
      }

      // Try to send actual notification for development/production builds
      try {
        if (remainingLessons <= 0) {
          await this.scheduleLocalNotification({
            title,
            body,
            data: {
              type: 'all_completed',
              userName,
              totalLessons,
              timestamp: Date.now(),
            },
            badge: 0,
          });
        } else {
          await this.scheduleLocalNotification({
            title,
            body,
            data: {
              type: 'welcome_back',
              userName,
              totalLessons,
              completedLessons,
              remainingLessons,
              timestamp: Date.now(),
            },
            badge: remainingLessons,
          });
        }

        console.debug('NotificationService: Welcome notification sent', {
          userName,
          totalLessons,
          completedLessons,
          remainingLessons,
        });

        return true;
      } catch (notificationError) {
        console.warn(
          'NotificationService: Failed to send notification, showing alert instead',
          notificationError
        );

        // Fallback to alert if notification fails
        Alert.alert(title, body, [
          {
            text: 'OK',
            style: 'default',
          },
          {
            text: 'Xem bài học',
            style: 'default',
            onPress: () => {
              console.debug('NotificationService: User wants to view lessons (fallback)');
              const navigated = notificationNavigationHelper.navigateToLessons();
              if (!navigated) {
                console.warn(
                  'NotificationService: Navigation to lessons failed - nav ref not available'
                );
                Alert.alert(
                  'Thông báo',
                  'Không thể chuyển đến trang bài học. Vui lòng mở tab Bài học thủ công.'
                );
              }
            },
          },
        ]);
        return true;
      }
    } catch (error) {
      console.error('NotificationService: Failed to send welcome notification', error);
      return false;
    }
  }

  /**
   * Send quiz available notification
   * @param {string} lessonTitle - Title of the lesson
   * @param {number} quizCount - Number of available quizzes
   */
  async sendQuizAvailableNotification(lessonTitle, quizCount) {
    try {
      const title = '🧩 Quiz mới có sẵn!';
      const body = `${quizCount} quiz cho bài "${lessonTitle}" đã sẵn sàng. Hãy thử sức nhé!`;

      await this.scheduleLocalNotification({
        title,
        body,
        data: {
          type: 'quiz_available',
          lessonTitle,
          quizCount,
          timestamp: Date.now(),
        },
      });

      console.debug('NotificationService: Quiz available notification sent', {
        lessonTitle,
        quizCount,
      });
    } catch (error) {
      console.error('NotificationService: Failed to send quiz notification', error);
    }
  }

  /**
   * Send notification about incomplete courses/lessons
   * @param {number} incompleteCount - Number of incomplete lessons
   * @returns {Promise<boolean>} Success status
   */
  async sendIncompleteCoursesNotification(incompleteCount) {
    try {
      if (incompleteCount <= 0) {
        console.debug('NotificationService: No incomplete lessons, skipping notification');
        return true;
      }

      const title = '📚 Satori Nihongo';
      const body = `Bạn còn ${incompleteCount} bài học chưa hoàn thành. Hãy tiếp tục học tập nhé! 🌟`;

      await this.scheduleLocalNotification({
        title,
        body,
        data: {
          type: 'incomplete_lessons',
          incompleteCount,
          timestamp: Date.now(),
        },
        badge: incompleteCount,
      });

      console.debug('NotificationService: Incomplete courses notification sent', {
        incompleteCount,
        title,
        body,
      });

      return true;
    } catch (error) {
      console.error('NotificationService: Failed to send incomplete courses notification', error);
      return false;
    }
  }

  /**
   * Schedule a local notification
   * @param {Object} notificationData - Notification content and data
   * @param {number} delaySeconds - Delay in seconds (default: immediate)
   */
  async scheduleLocalNotification(notificationData, delaySeconds = 1) {
    try {
      const { title, body, data, badge } = notificationData;

      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          badge,
          sound: 'default',
          priority: Notifications.AndroidNotificationPriority.HIGH,
          channelId: 'lesson-notifications',
        },
        trigger: {
          seconds: delaySeconds,
        },
      });

      console.debug('NotificationService: Local notification scheduled', {
        title,
        body,
        delaySeconds,
      });
    } catch (error) {
      console.error('NotificationService: Failed to schedule notification', error);
    }
  }

  /**
   * Cancel all notifications
   */
  async cancelAllNotifications() {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.debug('NotificationService: All notifications cancelled');
    } catch (error) {
      console.error('NotificationService: Failed to cancel notifications', error);
    }
  }

  /**
   * Set notification badge count
   * @param {number} count - Badge count
   */
  async setBadgeCount(count) {
    try {
      await Notifications.setBadgeCountAsync(count);
      console.debug('NotificationService: Badge count set to', count);
    } catch (error) {
      console.error('NotificationService: Failed to set badge count', error);
    }
  }

  /**
   * Get notification permissions status
   * @returns {Promise<string>} Permission status
   */
  async getPermissionStatus() {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      return status;
    } catch (error) {
      console.error('NotificationService: Failed to get permission status', error);
      return 'unknown';
    }
  }

  /**
   * Cleanup listeners
   */
  cleanup() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }

  /**
   * Calculate remaining lessons from lesson data
   * @param {Array} lessons - Array of lessons
   * @returns {number} Number of remaining lessons
   */
  calculateRemainingLessons(lessons) {
    if (!Array.isArray(lessons)) {
      return 0;
    }

    return lessons.filter((lesson) => !lesson.isCompleted && lesson.status !== 'completed').length;
  }

  /**
   * Get learning progress summary
   * @param {Array} lessons - Array of lessons
   * @returns {Object} Progress summary
   */
  getLearningProgress(lessons) {
    if (!Array.isArray(lessons)) {
      return {
        total: 0,
        completed: 0,
        remaining: 0,
        percentage: 0,
      };
    }

    const total = lessons.length;
    const completed = lessons.filter(
      (lesson) => lesson.isCompleted || lesson.status === 'completed'
    ).length;
    const remaining = total - completed;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      remaining,
      percentage,
    };
  }

  /**
   * Check if the notification service is initialized
   * @returns {boolean} Initialization status
   */
  isInitialized() {
    return this.isInitialized;
  }

  /**
   * Send notification only if service is initialized
   * @param {Function} notificationFunction - Function to send notification
   * @param {...any} args - Arguments for the notification function
   * @returns {Promise<boolean>} Success status
   */
  async sendNotificationIfReady(notificationFunction, ...args) {
    if (!this.isInitialized) {
      console.warn('NotificationService: Service not initialized, skipping notification');
      return false;
    }

    try {
      await notificationFunction.apply(this, args);
      return true;
    } catch (error) {
      console.error('NotificationService: Failed to send notification', error);
      return false;
    }
  }
}

// Create singleton instance
const notificationServiceInstance = new NotificationService();

export default notificationServiceInstance;
