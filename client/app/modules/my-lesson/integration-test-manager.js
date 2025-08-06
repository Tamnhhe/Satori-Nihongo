/**
 * Integration Test Script
 * Test the complete notification flow in the Satori Nihongo app
 */

import notificationService from '../../shared/services/notification.service';
import LessonService from '../../shared/services/lesson.service';
import CourseService from '../../shared/services/course.service';
import QuizService from '../../shared/services/quiz.service';

class IntegrationTestManager {
  constructor(api) {
    this.api = api;
    this.notificationService = notificationService;
    this.lessonService = new LessonService(api);
    this.courseService = new CourseService(api);
    this.quizService = new QuizService(api);
  }

  /**
   * Simulate complete login flow with notification
   */
  async simulateLoginFlow(username = 'Test User') {
    console.log('🚀 Starting login flow simulation...');

    try {
      // Step 1: Initialize notification service
      console.log('1️⃣ Initializing notification service...');
      const notificationToken = await this.notificationService.initialize();

      if (!notificationToken) {
        console.warn('⚠️ Notification service not available (probably on simulator)');
        return {
          success: false,
          message: 'Notification service not available on simulator',
        };
      }

      // Step 2: Get user's lessons data
      console.log('2️⃣ Fetching lesson data...');
      const lessonsResult = await this.lessonService.getAllLessons({
        page: 0,
        size: 100,
      });

      if (!lessonsResult.success) {
        throw new Error(`Failed to fetch lessons: ${lessonsResult.message}`);
      }

      const totalLessons = lessonsResult.data.length;
      const completedLessons = Math.floor(totalLessons * 0.2); // Simulate 20% completion
      const remainingLessons = totalLessons - completedLessons;

      console.log(
        `📊 Lesson stats: ${totalLessons} total, ${completedLessons} completed, ${remainingLessons} remaining`
      );

      // Step 3: Send welcome notification
      console.log('3️⃣ Sending welcome notification...');
      const notificationSent = await this.notificationService.sendWelcomeNotification(
        username,
        totalLessons,
        completedLessons
      );

      if (!notificationSent) {
        throw new Error('Failed to send welcome notification');
      }

      // Step 4: Set badge count
      console.log('4️⃣ Setting badge count...');
      await this.notificationService.setBadgeCount(remainingLessons);

      console.log('✅ Login flow simulation completed successfully!');

      return {
        success: true,
        message: `Welcome notification sent for ${username}`,
        data: {
          username,
          totalLessons,
          completedLessons,
          remainingLessons,
          notificationToken: notificationToken.substring(0, 20) + '...',
        },
      };
    } catch (error) {
      console.error('❌ Login flow simulation failed:', error);
      return {
        success: false,
        message: error.message,
        error,
      };
    }
  }

  /**
   * Test all notification types
   */
  async testAllNotifications() {
    console.log('🧪 Testing all notification types...');

    const results = [];

    try {
      // Initialize
      await this.notificationService.initialize();

      // Test 1: Welcome notification
      console.log('Testing welcome notification...');
      const welcomeResult = await this.notificationService.sendWelcomeNotification(
        'Test User',
        10,
        3
      );
      results.push({
        type: 'welcome',
        success: welcomeResult,
        message: welcomeResult
          ? 'Welcome notification sent'
          : 'Failed to send welcome notification',
      });

      // Test 2: Incomplete lessons notification
      console.log('Testing incomplete lessons notification...');
      const incompleteResult = await this.notificationService.sendIncompleteCoursesNotification(7);
      results.push({
        type: 'incomplete_lessons',
        success: incompleteResult,
        message: incompleteResult
          ? 'Incomplete lessons notification sent'
          : 'Failed to send incomplete lessons notification',
      });

      // Test 3: Quiz available notification
      console.log('Testing quiz available notification...');
      await this.notificationService.sendQuizAvailableNotification('Hiragana Basics', 3);
      results.push({
        type: 'quiz_available',
        success: true,
        message: 'Quiz available notification sent',
      });

      // Test 4: Remaining lessons notification
      console.log('Testing remaining lessons notification...');
      await this.notificationService.sendRemainingLessonsNotification(5);
      results.push({
        type: 'remaining_lessons',
        success: true,
        message: 'Remaining lessons notification sent',
      });

      return {
        success: true,
        message: 'All notification tests completed',
        results,
      };
    } catch (error) {
      console.error('Notification test failed:', error);
      return {
        success: false,
        message: error.message,
        results,
      };
    }
  }

  /**
   * Get comprehensive system status
   */
  async getSystemStatus() {
    console.log('📊 Getting system status...');

    const status = {
      timestamp: new Date().toISOString(),
      services: {},
      data: {},
      permissions: {},
    };

    try {
      // Test notification service
      status.services.notifications = {
        available: false,
        token: null,
        permissions: 'unknown',
      };

      try {
        const token = await this.notificationService.initialize();
        const permissions = await this.notificationService.getPermissionStatus();

        status.services.notifications = {
          available: !!token,
          token: token ? token.substring(0, 20) + '...' : null,
          permissions,
        };
      } catch (error) {
        status.services.notifications.error = error.message;
      }

      // Test lesson service
      status.services.lessons = {
        available: false,
        count: 0,
      };

      try {
        const lessonsResult = await this.lessonService.getAllLessons({ size: 1 });
        status.services.lessons = {
          available: lessonsResult.success,
          count: lessonsResult.pagination?.totalItems || 0,
          error: lessonsResult.success ? null : lessonsResult.message,
        };
      } catch (error) {
        status.services.lessons.error = error.message;
      }

      // Test course service
      status.services.courses = {
        available: false,
        count: 0,
      };

      try {
        const coursesResult = await this.courseService.getAllCourses({ size: 1 });
        status.services.courses = {
          available: coursesResult.success,
          count: coursesResult.pagination?.totalItems || 0,
          error: coursesResult.success ? null : coursesResult.message,
        };
      } catch (error) {
        status.services.courses.error = error.message;
      }

      // Test quiz service
      status.services.quizzes = {
        available: false,
        count: 0,
      };

      try {
        const quizzesResult = await this.quizService.getAllQuizzes({ size: 1 });
        status.services.quizzes = {
          available: quizzesResult.success,
          count: quizzesResult.pagination?.totalItems || 0,
          error: quizzesResult.success ? null : quizzesResult.message,
        };
      } catch (error) {
        status.services.quizzes.error = error.message;
      }

      return {
        success: true,
        status,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        status,
      };
    }
  }
}

export default IntegrationTestManager;
