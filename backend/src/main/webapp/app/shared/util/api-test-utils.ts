import axios, { AxiosResponse } from 'axios';
import MockAdapter from 'axios-mock-adapter';

// Create a mock adapter for axios
export const createMockAxios = () => {
  return new MockAdapter(axios);
};

// Mock API response helpers
export const mockApiSuccess = <T>(data: T, status = 200): AxiosResponse<T> => ({
  data,
  status,
  statusText: 'OK',
  headers: {},
  config: {} as any,
});

export const mockApiError = (message = 'API Error', status = 500) => ({
  response: {
    status,
    statusText: status === 404 ? 'Not Found' : 'Internal Server Error',
    data: { message },
    headers: {},
    config: {} as any,
  },
  message,
  name: 'AxiosError',
  isAxiosError: true,
});

// Mock pagination response
export const mockPaginatedResponse = <T>(data: T[], page = 0, size = 20, totalElements = data.length) => ({
  content: data,
  pageable: {
    sort: { sorted: false, unsorted: true },
    pageNumber: page,
    pageSize: size,
    offset: page * size,
    paged: true,
    unpaged: false,
  },
  totalElements,
  totalPages: Math.ceil(totalElements / size),
  last: page >= Math.ceil(totalElements / size) - 1,
  first: page === 0,
  numberOfElements: data.length,
  size,
  number: page,
  sort: { sorted: false, unsorted: true },
});

// Common API endpoints
export const API_ENDPOINTS = {
  // User Management
  USERS: '/api/admin/users',
  USER_PROFILES: '/api/user-profiles',
  USER_BULK_ACTIONS: '/api/admin/users/bulk',

  // Course Management
  COURSES: '/api/courses/manage',
  COURSE_CLASSES: '/api/course-classes',
  LESSONS: '/api/lessons',

  // Quiz Management
  QUIZZES: '/api/quizzes/manage',
  QUESTIONS: '/api/questions',
  QUIZ_ASSIGNMENTS: '/api/quiz-assignments',

  // Analytics
  ANALYTICS: '/api/analytics',
  STUDENT_ANALYTICS: '/api/student-analytics',
  QUIZ_ANALYTICS: '/api/quiz-analytics',

  // File Management
  FILE_UPLOAD: '/api/files/upload',
  FILE_MANAGEMENT: '/api/files',

  // Notifications
  NOTIFICATIONS: '/api/admin/notifications',
  NOTIFICATION_ANALYTICS: '/api/admin/notification-analytics',

  // System
  SYSTEM_HEALTH: '/api/management/health',
  SYSTEM_CONFIG: '/api/admin/system-config',
  AUDIT_LOGS: '/api/admin/audit-logs',
};

// Mock data generators for API responses
export const generateMockUsers = (count = 5) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `user-${index + 1}`,
    username: `user${index + 1}`,
    email: `user${index + 1}@example.com`,
    fullName: `User ${index + 1}`,
    role: index === 0 ? 'ADMIN' : index % 2 === 0 ? 'GIANG_VIEN' : 'HOC_VIEN',
    isActive: index % 3 !== 0,
    lastLogin: new Date(Date.now() - index * 24 * 60 * 60 * 1000).toISOString(),
    createdDate: new Date(Date.now() - (index + 10) * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

export const generateMockCourses = (count = 3) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `course-${index + 1}`,
    title: `Course ${index + 1}`,
    description: `Description for course ${index + 1}`,
    courseCode: `C00${index + 1}`,
    status: index % 2 === 0 ? 'ACTIVE' : 'DRAFT',
    enrollmentCount: Math.floor(Math.random() * 50) + 10,
    createdDate: new Date(Date.now() - index * 7 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

export const generateMockQuizzes = (count = 4) => {
  return Array.from({ length: count }, (_, index) => ({
    id: `quiz-${index + 1}`,
    title: `Quiz ${index + 1}`,
    description: `Description for quiz ${index + 1}`,
    quizType: index % 2 === 0 ? 'COURSE' : 'LESSON',
    isTest: index % 3 === 0,
    isPractice: index % 3 !== 0,
    questionCount: Math.floor(Math.random() * 10) + 5,
    createdDate: new Date(Date.now() - index * 3 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

export const generateMockQuestions = (count = 10) => {
  const types = ['MULTIPLE_CHOICE', 'FILL_IN_BLANK', 'ESSAY'];
  return Array.from({ length: count }, (_, index) => ({
    id: `question-${index + 1}`,
    content: `Question ${index + 1} content`,
    type: types[index % types.length],
    correctAnswer: `Answer ${index + 1}`,
    imageUrl: index % 4 === 0 ? `/images/question-${index + 1}.jpg` : null,
    suggestion: `Hint for question ${index + 1}`,
    answerExplanation: `Explanation for question ${index + 1}`,
  }));
};

export const generateMockAnalytics = () => ({
  userStats: {
    totalUsers: 150,
    activeUsers: 120,
    newRegistrations: 25,
    roleDistribution: [
      { role: 'ADMIN', count: 5 },
      { role: 'GIANG_VIEN', count: 20 },
      { role: 'HOC_VIEN', count: 125 },
    ],
  },
  systemHealth: {
    status: 'UP',
    diskSpace: { free: 85, total: 100 },
    database: { status: 'UP', responseTime: 45 },
    memory: { used: 60, max: 100 },
  },
  courseAnalytics: {
    totalCourses: 25,
    activeCourses: 20,
    averageEnrollment: 35,
    completionRate: 78,
  },
});

// Setup common API mocks
export const setupCommonApiMocks = (mockAxios: InstanceType<typeof MockAdapter>) => {
  // User management endpoints
  mockAxios.onGet(API_ENDPOINTS.USERS).reply(200, mockPaginatedResponse(generateMockUsers()));
  mockAxios.onPost(API_ENDPOINTS.USERS).reply(201, generateMockUsers(1)[0]);
  mockAxios.onPut(new RegExp(`${API_ENDPOINTS.USERS}/.*`)).reply(200, generateMockUsers(1)[0]);
  mockAxios.onDelete(new RegExp(`${API_ENDPOINTS.USERS}/.*`)).reply(204);

  // Course management endpoints
  mockAxios.onGet(API_ENDPOINTS.COURSES).reply(200, mockPaginatedResponse(generateMockCourses()));
  mockAxios.onPost(API_ENDPOINTS.COURSES).reply(201, generateMockCourses(1)[0]);
  mockAxios.onPut(new RegExp(`${API_ENDPOINTS.COURSES}/.*`)).reply(200, generateMockCourses(1)[0]);
  mockAxios.onDelete(new RegExp(`${API_ENDPOINTS.COURSES}/.*`)).reply(204);

  // Quiz management endpoints
  mockAxios.onGet(API_ENDPOINTS.QUIZZES).reply(200, mockPaginatedResponse(generateMockQuizzes()));
  mockAxios.onPost(API_ENDPOINTS.QUIZZES).reply(201, generateMockQuizzes(1)[0]);
  mockAxios.onPut(new RegExp(`${API_ENDPOINTS.QUIZZES}/.*`)).reply(200, generateMockQuizzes(1)[0]);
  mockAxios.onDelete(new RegExp(`${API_ENDPOINTS.QUIZZES}/.*`)).reply(204);

  // Questions endpoints
  mockAxios.onGet(API_ENDPOINTS.QUESTIONS).reply(200, generateMockQuestions());
  mockAxios.onPost(API_ENDPOINTS.QUESTIONS).reply(201, generateMockQuestions(1)[0]);

  // Analytics endpoints
  mockAxios.onGet(API_ENDPOINTS.ANALYTICS).reply(200, generateMockAnalytics());
  mockAxios.onGet(API_ENDPOINTS.STUDENT_ANALYTICS).reply(200, { students: generateMockUsers(10) });

  // System endpoints
  mockAxios.onGet(API_ENDPOINTS.SYSTEM_HEALTH).reply(200, { status: 'UP' });
};

// Error simulation helpers
export const simulateNetworkError = (mockAxios: InstanceType<typeof MockAdapter>, endpoint: string) => {
  mockAxios.onAny(endpoint).networkError();
};

export const simulateTimeout = (mockAxios: InstanceType<typeof MockAdapter>, endpoint: string) => {
  mockAxios.onAny(endpoint).timeout();
};

export const simulateServerError = (mockAxios: InstanceType<typeof MockAdapter>, endpoint: string, status = 500) => {
  mockAxios.onAny(endpoint).reply(status, { message: 'Internal Server Error' });
};

// Test utilities for async operations
export const waitForApiCall = (mockAxios: InstanceType<typeof MockAdapter>, method: string, url: string) => {
  return new Promise(resolve => {
    // Use a more direct approach to wait for API calls
    const originalRequest = axios.request;
    axios.request = (config: any) => {
      if (config.method?.toLowerCase() === method.toLowerCase() && config.url === url) {
        resolve(config);
      }
      return originalRequest(config);
    };
  });
};

// Validation helpers
export const validateApiRequest = (config: any, expectedData?: any) => {
  expect(config).toBeDefined();
  expect(config.url).toBeDefined();
  expect(config.method).toBeDefined();

  if (expectedData) {
    expect(JSON.parse(config.data)).toEqual(expectedData);
  }
};

export const validatePaginationParams = (config: any, page = 0, size = 20, sort?: string) => {
  const params = new URLSearchParams(config.url.split('?')[1]);
  expect(params.get('page')).toBe(page.toString());
  expect(params.get('size')).toBe(size.toString());

  if (sort) {
    expect(params.get('sort')).toBe(sort);
  }
};

// Export axios mock adapter type for TypeScript
export type MockAxiosType = InstanceType<typeof MockAdapter>;
