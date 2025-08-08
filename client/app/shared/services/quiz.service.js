/**
 * Quiz Service - handles quiz-related API calls
 */

import { Alert } from 'react-native';

class QuizService {
  constructor(api) {
    this.api = api;
  }

  /**
   * Get all quizzes with pagination
   * @param {Object} options - Query options (page, size, sort)
   * @returns {Promise} API response
   */
  async getAllQuizzes(options = {}) {
    try {
      console.debug('QuizService: Getting all quizzes', options);

      const params = {
        page: options.page || 0,
        size: options.size || 20,
        sort: options.sort || 'id,desc',
      };

      const response = await this.api.getAllQuizzes(params);

      if (response.ok) {
        console.debug('QuizService: Successfully loaded quizzes', {
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
        console.error('QuizService: Failed to load quizzes', response.problem);
        return {
          success: false,
          error: response.problem || 'Unknown error',
          message: this.getErrorMessage(response),
        };
      }
    } catch (error) {
      console.error('QuizService: Exception in getAllQuizzes', error);
      return {
        success: false,
        error: 'network_error',
        message: 'Không thể kết nối với server',
      };
    }
  }

  /**
   * Get quizzes by lesson ID
   * @param {number} lessonId - The lesson ID
   * @param {Object} options - Additional options
   * @returns {Promise} API response
   */
  async getQuizzesByLesson(lessonId, options = {}) {
    try {
      console.debug('QuizService: Getting quizzes for lesson', lessonId);

      const params = {
        page: options.page || 0,
        size: options.size || 20,
        sort: options.sort || 'id,desc',
        'lessons.id.equals': lessonId, // JHipster filter syntax
      };

      const response = await this.api.getAllQuizzes(params);

      if (response.ok) {
        console.debug('QuizService: Successfully loaded lesson quizzes', {
          lessonId,
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
      console.error('QuizService: Exception in getQuizzesByLesson', error);
      return {
        success: false,
        error: 'network_error',
        message: 'Không thể tải quiz của bài học',
      };
    }
  }

  /**
   * Get a single quiz by ID
   * @param {number} quizId - The quiz ID
   * @returns {Promise} API response
   */
  async getQuiz(quizId) {
    try {
      console.debug('QuizService: Getting quiz', quizId);

      const response = await this.api.getQuiz(quizId);

      if (response.ok) {
        console.debug('QuizService: Successfully loaded quiz', response.data?.title);
        return {
          success: true,
          data: response.data,
        };
      } else {
        console.error('QuizService: Failed to load quiz', response.problem);
        return {
          success: false,
          error: response.problem || 'Unknown error',
          message: this.getErrorMessage(response),
        };
      }
    } catch (error) {
      console.error('QuizService: Exception in getQuiz', error);
      return {
        success: false,
        error: 'network_error',
        message: 'Không thể kết nối với server',
      };
    }
  }

  /**
   * Get quiz questions by quiz ID
   * @param {number} quizId - The quiz ID
   * @returns {Promise} API response
   */
  async getQuizQuestions(quizId) {
    try {
      console.debug('QuizService: Getting quiz questions', quizId);

      const params = {
        'quiz.id.equals': quizId,
      };

      const response = await this.api.getAllQuizQuestions(params);

      if (response.ok) {
        console.debug('QuizService: Successfully loaded quiz questions', {
          quizId,
          count: response.data?.length || 0,
        });

        return {
          success: true,
          data: response.data || [],
        };
      } else {
        return {
          success: false,
          error: response.problem || 'Unknown error',
          message: this.getErrorMessage(response),
        };
      }
    } catch (error) {
      console.error('QuizService: Exception in getQuizQuestions', error);
      return {
        success: false,
        error: 'network_error',
        message: 'Không thể tải câu hỏi quiz',
      };
    }
  }

  /**
   * Submit quiz answer
   * @param {Object} submission - Quiz submission data
   * @returns {Promise} API response
   */
  async submitQuiz(submission) {
    try {
      console.debug('QuizService: Submitting quiz', submission);

      const response = await this.api.createStudentQuiz(submission);

      if (response.ok) {
        console.debug('QuizService: Successfully submitted quiz');
        return {
          success: true,
          data: response.data,
        };
      } else {
        return {
          success: false,
          error: response.problem || 'Unknown error',
          message: this.getErrorMessage(response),
        };
      }
    } catch (error) {
      console.error('QuizService: Exception in submitQuiz', error);
      return {
        success: false,
        error: 'network_error',
        message: 'Không thể gửi bài quiz',
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
   * Transform backend quiz data for UI consumption
   * @param {Object} quiz - Raw quiz from backend
   * @returns {Object} Transformed quiz
   */
  transformQuiz(quiz) {
    if (!quiz || !quiz.id) {
      console.warn('QuizService: Invalid quiz data', quiz);
      return null;
    }

    return {
      id: quiz.id,
      title: quiz.title || 'Quiz',
      description: quiz.description || '',
      isTest: quiz.isTest || false,
      isPractice: quiz.isPractice || false,
      quizType: quiz.quizType || 'MULTIPLE_CHOICE',
      courses: quiz.courses || [],
      lessons: quiz.lessons || [],
      questionsCount: 0, // Will be updated when questions are loaded
    };
  }

  /**
   * Transform quiz question data
   * @param {Object} question - Raw question from backend
   * @returns {Object} Transformed question
   */
  transformQuestion(question) {
    if (!question || !question.id) {
      return null;
    }

    return {
      id: question.id,
      question: question.question || '',
      questionType: question.questionType || 'MULTIPLE_CHOICE',
      options: question.options || [],
      correctAnswer: question.correctAnswer || '',
      explanation: question.explanation || '',
      difficulty: question.difficulty || 'EASY',
    };
  }

  /**
   * Transform array of quizzes
   * @param {Array} quizzes - Array of raw quizzes from backend
   * @returns {Array} Array of transformed quizzes
   */
  transformQuizzes(quizzes) {
    if (!Array.isArray(quizzes)) {
      return [];
    }

    return quizzes.map((quiz) => this.transformQuiz(quiz)).filter((quiz) => quiz !== null);
  }

  /**
   * Transform array of questions
   * @param {Array} questions - Array of raw questions from backend
   * @returns {Array} Array of transformed questions
   */
  transformQuestions(questions) {
    if (!Array.isArray(questions)) {
      return [];
    }

    return questions
      .map((question) => this.transformQuestion(question))
      .filter((question) => question !== null);
  }
}

export default QuizService;
