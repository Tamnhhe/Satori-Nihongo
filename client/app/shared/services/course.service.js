/**
 * Course Service - handles course-related API calls
 */

import { Alert } from 'react-native';

class CourseService {
  constructor(api) {
    this.api = api;
  }

  /**
   * Get all courses with pagination
   * @param {Object} options - Query options (page, size, sort)
   * @returns {Promise} API response
   */
  async getAllCourses(options = {}) {
    try {
      console.debug('CourseService: Getting all courses', options);

      const params = {
        page: options.page || 0,
        size: options.size || 50, // Get more courses since they're usually fewer
        sort: options.sort || 'id,desc',
      };

      const response = await this.api.getAllCourses(params);

      if (response.ok) {
        console.debug('CourseService: Successfully loaded courses', {
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
        console.error('CourseService: Failed to load courses', response.problem);
        return {
          success: false,
          error: response.problem || 'Unknown error',
          message: this.getErrorMessage(response),
        };
      }
    } catch (error) {
      console.error('CourseService: Exception in getAllCourses', error);
      return {
        success: false,
        error: 'network_error',
        message: 'Không thể kết nối với server',
      };
    }
  }

  /**
   * Get a single course by ID
   * @param {number} courseId - The course ID
   * @returns {Promise} API response
   */
  async getCourse(courseId) {
    try {
      console.debug('CourseService: Getting course', courseId);

      const response = await this.api.getCourse(courseId);

      if (response.ok) {
        console.debug('CourseService: Successfully loaded course', response.data?.title);
        return {
          success: true,
          data: response.data,
        };
      } else {
        console.error('CourseService: Failed to load course', response.problem);
        return {
          success: false,
          error: response.problem || 'Unknown error',
          message: this.getErrorMessage(response),
        };
      }
    } catch (error) {
      console.error('CourseService: Exception in getCourse', error);
      return {
        success: false,
        error: 'network_error',
        message: 'Không thể kết nối với server',
      };
    }
  }

  /**
   * Get lessons by course ID
   * @param {number} courseId - The course ID
   * @param {Object} options - Additional options
   * @returns {Promise} API response
   */
  async getLessonsByCourse(courseId, options = {}) {
    try {
      console.debug('CourseService: Getting lessons for course', courseId);

      const params = {
        page: options.page || 0,
        size: options.size || 20,
        sort: options.sort || 'id,desc',
        'course.id.equals': courseId, // JHipster filter syntax
      };

      const response = await this.api.getAllLessons(params);

      if (response.ok) {
        console.debug('CourseService: Successfully loaded course lessons', {
          courseId,
          count: response.data?.length || 0,
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
      console.error('CourseService: Exception in getLessonsByCourse', error);
      return {
        success: false,
        error: 'network_error',
        message: 'Không thể tải bài học của khóa học',
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
   * Transform backend course data for UI consumption
   * @param {Object} course - Raw course from backend
   * @returns {Object} Transformed course
   */
  transformCourse(course) {
    if (!course || !course.id) {
      console.warn('CourseService: Invalid course data', course);
      return null;
    }

    return {
      id: course.id,
      title: course.title || 'Chưa có tên khóa học',
      description: course.description || '',
      courseCode: course.courseCode || '',
      teacher: course.teacher
        ? {
            id: course.teacher.id,
            name: course.teacher.name || 'Giáo viên',
            email: course.teacher.email,
          }
        : null,
      quizzes: course.quizzes ? course.quizzes.map((quiz) => this.transformQuiz(quiz)) : [],
      lessonsCount: 0, // Will be updated when lessons are loaded
    };
  }

  /**
   * Transform quiz data
   * @param {Object} quiz - Raw quiz from backend
   * @returns {Object} Transformed quiz
   */
  transformQuiz(quiz) {
    if (!quiz || !quiz.id) {
      return null;
    }

    return {
      id: quiz.id,
      title: quiz.title || 'Quiz',
      description: quiz.description || '',
      isTest: quiz.isTest || false,
      isPractice: quiz.isPractice || false,
      quizType: quiz.quizType || 'MULTIPLE_CHOICE',
    };
  }

  /**
   * Transform array of courses
   * @param {Array} courses - Array of raw courses from backend
   * @returns {Array} Array of transformed courses
   */
  transformCourses(courses) {
    if (!Array.isArray(courses)) {
      return [];
    }

    return courses
      .map((course) => this.transformCourse(course))
      .filter((course) => course !== null);
  }
}

export default CourseService;
