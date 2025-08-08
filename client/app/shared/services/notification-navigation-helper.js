/**
 * Navigation Helper for Notifications
 * Provides navigation functionality for notification handlers
 */

class NotificationNavigationHelper {
  constructor() {
    this.navigationRef = null;
  }

  /**
   * Set navigation reference
   * @param {Object} navigationRef - React Navigation ref
   */
  setNavigationRef(navigationRef) {
    this.navigationRef = navigationRef;
    console.debug('NotificationNavigationHelper: Navigation ref set');
  }

  /**
   * Navigate to lessons screen
   */
  navigateToLessons() {
    try {
      if (this.navigationRef && this.navigationRef.current) {
        console.debug('NotificationNavigationHelper: Navigating to lessons');
        this.navigationRef.current.navigate('MyLesson');
        return true;
      } else {
        console.warn('NotificationNavigationHelper: Navigation ref not available');
        return false;
      }
    } catch (error) {
      console.error('NotificationNavigationHelper: Navigation failed', error);
      return false;
    }
  }

  /**
   * Navigate to specific lesson
   * @param {string|number} lessonId - Lesson ID
   */
  navigateToLesson(lessonId) {
    try {
      if (this.navigationRef && this.navigationRef.current) {
        console.debug('NotificationNavigationHelper: Navigating to lesson', lessonId);
        this.navigationRef.current.navigate('LessonDetail', { lessonId });
        return true;
      } else {
        console.warn('NotificationNavigationHelper: Navigation ref not available');
        return false;
      }
    } catch (error) {
      console.error('NotificationNavigationHelper: Navigation to lesson failed', error);
      return false;
    }
  }

  /**
   * Navigate to quiz screen
   * @param {string|number} quizId - Quiz ID
   * @param {string|number} lessonId - Lesson ID (optional)
   */
  navigateToQuiz(quizId, lessonId = null) {
    try {
      if (this.navigationRef && this.navigationRef.current) {
        console.debug('NotificationNavigationHelper: Navigating to quiz', { quizId, lessonId });
        const params = { quizId };
        if (lessonId) {
          params.lessonId = lessonId;
        }
        this.navigationRef.current.navigate('Quiz', params);
        return true;
      } else {
        console.warn('NotificationNavigationHelper: Navigation ref not available');
        return false;
      }
    } catch (error) {
      console.error('NotificationNavigationHelper: Navigation to quiz failed', error);
      return false;
    }
  }

  /**
   * Navigate to home screen
   */
  navigateToHome() {
    try {
      if (this.navigationRef && this.navigationRef.current) {
        console.debug('NotificationNavigationHelper: Navigating to home');
        this.navigationRef.current.navigate('Home');
        return true;
      } else {
        console.warn('NotificationNavigationHelper: Navigation ref not available');
        return false;
      }
    } catch (error) {
      console.error('NotificationNavigationHelper: Navigation to home failed', error);
      return false;
    }
  }

  /**
   * Check if navigation is available
   * @returns {boolean} Navigation availability
   */
  isNavigationAvailable() {
    return this.navigationRef && this.navigationRef.current !== null;
  }
}

// Create singleton instance
const notificationNavigationHelper = new NotificationNavigationHelper();

export default notificationNavigationHelper;
