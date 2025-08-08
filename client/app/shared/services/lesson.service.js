/**
 * Lesson Service - handles lesson-related API calls
 * This service provides methods to interact with lesson endpoints on the backend
 */

import { Alert } from 'react-native';

class LessonService {
  constructor(api) {
    this.api = api;
  }

  /**
   * Get all lessons with pagination and sorting
   * @param {Object} options - Query options (page, size, sort)
   * @returns {Promise} API response
   */
  async getAllLessons(options = {}) {
    try {
      console.debug('LessonService: Getting all lessons', options);

      const params = {
        page: options.page || 0,
        size: options.size || 20,
        sort: options.sort || 'id,desc',
      };

      const response = await this.api.getAllLessons(params);

      if (response.ok) {
        console.debug('LessonService: Successfully loaded lessons', {
          count: response.data?.length || 0,
          totalItems: response.headers['x-total-count'],
        });

        return {
          success: true,
          data: response.data || [],
          headers: response.headers,
          pagination: this.parsePagination(response.headers),
        };
      } else {
        console.error('LessonService: Failed to load lessons', response.problem);
        return {
          success: false,
          error: response.problem || 'Unknown error',
          message: this.getErrorMessage(response),
        };
      }
    } catch (error) {
      console.error('LessonService: Exception in getAllLessons', error);
      return {
        success: false,
        error: 'network_error',
        message: 'Không thể kết nối với server',
      };
    }
  }

  /**
   * Get a single lesson by ID
   * @param {number} lessonId - The lesson ID
   * @returns {Promise} API response
   */
  async getLesson(lessonId) {
    try {
      console.debug('LessonService: Getting lesson', lessonId);

      const response = await this.api.getLesson(lessonId);

      if (response.ok) {
        console.debug('LessonService: Successfully loaded lesson', response.data?.title);
        return {
          success: true,
          data: response.data,
        };
      } else {
        console.error('LessonService: Failed to load lesson', response.problem);
        return {
          success: false,
          error: response.problem || 'Unknown error',
          message: this.getErrorMessage(response),
        };
      }
    } catch (error) {
      console.error('LessonService: Exception in getLesson', error);
      return {
        success: false,
        error: 'network_error',
        message: 'Không thể kết nối với server',
      };
    }
  }

  /**
   * Search lessons with query string
   * @param {string} query - Search query
   * @param {Object} options - Additional options
   * @returns {Promise} API response
   */
  async searchLessons(query, options = {}) {
    try {
      console.debug('LessonService: Searching lessons', query);

      const params = {
        page: options.page || 0,
        size: options.size || 20,
        sort: options.sort || 'id,desc',
        'title.contains': query, // JHipster style search
      };

      const response = await this.api.getAllLessons(params);

      if (response.ok) {
        console.debug('LessonService: Search completed', {
          query,
          results: response.data?.length || 0,
        });

        return {
          success: true,
          data: response.data || [],
          headers: response.headers,
          pagination: this.parsePagination(response.headers),
        };
      } else {
        return {
          success: false,
          error: response.problem || 'Unknown error',
          message: this.getErrorMessage(response),
        };
      }
    } catch (error) {
      console.error('LessonService: Exception in searchLessons', error);
      return {
        success: false,
        error: 'network_error',
        message: 'Không thể tìm kiếm',
      };
    }
  }

  /**
   * Parse pagination info from response headers
   * @param {Object} headers - Response headers
   * @returns {Object} Pagination info
   */
  parsePagination(headers) {
    const totalCount = parseInt(headers['x-total-count'] || '0');
    const links = this.parseLinks(headers.link || '');

    return {
      totalItems: totalCount,
      links,
      hasNext: !!links.next,
      hasPrev: !!links.prev,
    };
  }

  /**
   * Parse Link header for pagination
   * @param {string} linkHeader - Link header value
   * @returns {Object} Parsed links
   */
  parseLinks(linkHeader) {
    const links = {};

    if (!linkHeader) return links;

    const parts = linkHeader.split(',');
    parts.forEach((part) => {
      const section = part.split(';');
      if (section.length !== 2) return;

      const url = section[0].replace(/<(.*)>/, '$1').trim();
      const name = section[1].replace(/rel="(.*)"/, '$1').trim();
      links[name] = url;
    });

    return links;
  }

  /**
   * Get user-friendly error message
   * @param {Object} response - API response
   * @returns {string} Error message
   */
  getErrorMessage(response) {
    if (response.status === 401) {
      return 'Bạn cần đăng nhập để truy cập';
    } else if (response.status === 403) {
      return 'Bạn không có quyền truy cập';
    } else if (response.status === 404) {
      return 'Không tìm thấy dữ liệu';
    } else if (response.status >= 500) {
      return 'Lỗi server, vui lòng thử lại sau';
    } else {
      return response.data?.message || 'Có lỗi xảy ra';
    }
  }

  /**
   * Show error alert to user
   * @param {string} message - Error message
   * @param {string} title - Alert title
   */
  showError(message, title = 'Lỗi') {
    Alert.alert(title, message);
  }

  /**
   * Validate lesson data structure
   * @param {Object} lesson - Lesson object
   * @returns {boolean} Is valid
   */
  validateLesson(lesson) {
    return (
      lesson &&
      typeof lesson.id === 'number' &&
      typeof lesson.title === 'string' &&
      lesson.title.trim().length > 0
    );
  }

  /**
   * Transform backend lesson data for UI consumption
   * @param {Object} lesson - Raw lesson from backend
   * @returns {Object} Transformed lesson
   */
  transformLesson(lesson) {
    if (!this.validateLesson(lesson)) {
      console.warn('LessonService: Invalid lesson data', lesson);
      return null;
    }

    return {
      id: lesson.id,
      title: lesson.title || 'Chưa có tiêu đề',
      content: lesson.content || '',
      videoUrl: lesson.videoUrl,
      slideUrl: lesson.slideUrl,
      course: lesson.course
        ? {
            id: lesson.course.id,
            name: lesson.course.name || 'Khóa học',
            description: lesson.course.description,
          }
        : null,
      // Add mock data for features not yet in backend
      progress: Math.random(), // Will be replaced with real progress API
      isBookmarked: false, // Will be replaced with bookmark API
      isCompleted: false, // Will be replaced with completion API
      status: 'not-started', // Will be replaced with progress API
    };
  }

  /**
   * Transform array of lessons
   * @param {Array} lessons - Array of raw lessons from backend
   * @returns {Array} Array of transformed lessons
   */
  transformLessons(lessons) {
    if (!Array.isArray(lessons)) {
      return [];
    }

    return lessons
      .map((lesson) => this.transformLesson(lesson))
      .filter((lesson) => lesson !== null);
  }
}

export default LessonService;
