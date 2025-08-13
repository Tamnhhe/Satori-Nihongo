import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { configureStore, Store } from '@reduxjs/toolkit';
import { AccessibilityProvider } from '../components/accessibility/AccessibilityProvider';

// Mock store configuration for testing
export const createMockStore = (initialState: any = {}) => {
  const mockReducer = (state = {}, action: any) => state;

  return configureStore({
    reducer: mockReducer,
    preloadedState: {
      authentication: { account: null, isAuthenticated: false },
      adminDashboard: { loading: false, data: null },
      enhancedUserManagement: { loading: false, users: [], totalItems: 0 },
      locale: { currentLocale: 'en' },
      applicationProfile: { inProduction: false },
      ...initialState,
    },
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
};

// Custom render function with providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  initialState?: any;
  store?: Store;
  route?: string;
}

export const renderWithProviders = (
  ui: ReactElement,
  { initialState = {}, store = createMockStore(initialState), route = '/', ...renderOptions }: CustomRenderOptions = {},
) => {
  // Set initial route
  window.history.pushState({}, 'Test page', route);

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>
        <AccessibilityProvider>{children}</AccessibilityProvider>
      </BrowserRouter>
    </Provider>
  );

  return {
    store,
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  };
};

// Mock data generators
export const createMockUser = (overrides: any = {}) => ({
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  fullName: 'Test User',
  role: 'HOC_VIEN',
  isActive: true,
  lastLogin: new Date().toISOString(),
  createdDate: new Date().toISOString(),
  ...overrides,
});

export const createMockCourse = (overrides: any = {}) => ({
  id: '1',
  title: 'Test Course',
  description: 'Test course description',
  courseCode: 'TC001',
  status: 'ACTIVE',
  enrollmentCount: 25,
  createdDate: new Date().toISOString(),
  ...overrides,
});

export const createMockQuiz = (overrides: any = {}) => ({
  id: '1',
  title: 'Test Quiz',
  description: 'Test quiz description',
  quizType: 'COURSE',
  isTest: false,
  isPractice: true,
  questions: [],
  createdDate: new Date().toISOString(),
  ...overrides,
});

export const createMockStudentProgress = (overrides: any = {}) => ({
  studentId: '1',
  studentName: 'Test Student',
  courseProgress: [
    {
      courseId: 'c1',
      courseName: 'Test Course',
      progress: 75,
      completedLessons: 15,
      totalLessons: 20,
    },
  ],
  overallGPA: 3.5,
  completionRate: 75,
  ...overrides,
});

// Mock API responses
export const mockApiResponse = <T,>(data: T, delay = 0) => {
  return new Promise<T>(resolve => {
    setTimeout(() => resolve(data), delay);
  });
};

export const mockApiError = (message = 'API Error', status = 500, delay = 0) => {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(
        new Error(
          JSON.stringify({
            response: {
              status,
              data: { message },
            },
          }),
        ),
      );
    }, delay);
  });
};

// Test helpers for accessibility
export const expectToBeAccessible = async (container: HTMLElement) => {
  const { axe, toHaveNoViolations } = await import('jest-axe');
  (expect as any).extend(toHaveNoViolations);

  const results = await axe(container);
  (expect(results) as any).toHaveNoViolations();
};

// Test helpers for responsive design
export const mockViewport = (width: number, height: number = 768) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });

  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });

  // Trigger resize event
  window.dispatchEvent(new Event('resize'));
};

// Mock intersection observer for lazy loading tests
export const mockIntersectionObserver = () => {
  const mockObserver = jest.fn();
  mockObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });

  window.IntersectionObserver = mockObserver;
  return mockObserver;
};

// Mock resize observer for responsive components
export const mockResizeObserver = () => {
  const mockObserver = jest.fn();
  mockObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null,
  });

  window.ResizeObserver = mockObserver;
  return mockObserver;
};

// Wait for async operations in tests
export const waitForLoadingToFinish = () => {
  return new Promise(resolve => setTimeout(resolve, 0));
};

// Mock file upload for testing
export const createMockFile = (name = 'test.jpg', size = 1024, type = 'image/jpeg') => {
  const file = new File(['test content'], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Mock drag and drop events
export const createMockDragEvent = (files: File[] = []) => {
  return {
    dataTransfer: {
      files,
      items: files.map(file => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file,
      })),
      types: ['Files'],
    },
    preventDefault: jest.fn(),
    stopPropagation: jest.fn(),
  };
};

// Test data cleanup
export const cleanupTestData = () => {
  // Reset any global mocks or test data
  jest.clearAllMocks();

  // Reset viewport
  mockViewport(1024, 768);

  // Clear local storage
  localStorage.clear();
  sessionStorage.clear();
};

// Custom matchers for better test assertions
export const customMatchers = {
  toHaveLoadingState(received: HTMLElement) {
    const hasLoadingIndicator = received.querySelector('[data-testid="loading"]') !== null;
    const hasSkeletonLoader = received.querySelector('[data-testid="skeleton"]') !== null;

    return {
      message: () => `Expected element to have loading state`,
      pass: hasLoadingIndicator || hasSkeletonLoader,
    };
  },

  toHaveErrorState(received: HTMLElement) {
    const hasErrorMessage = received.querySelector('[data-testid="error"]') !== null;
    const hasErrorClass = received.classList.contains('error');

    return {
      message: () => `Expected element to have error state`,
      pass: hasErrorMessage || hasErrorClass,
    };
  },
};

// Export everything for easy importing
export * from '@testing-library/react';
export * from '@testing-library/user-event';
export { default as userEvent } from '@testing-library/user-event';
