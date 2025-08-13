import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QuizManagement } from './quiz-management';
import { renderWithProviders } from '../../../shared/util/test-utils';
import {
  createMockAxios,
  API_ENDPOINTS,
  generateMockQuizzes,
  generateMockQuestions,
  mockPaginatedResponse,
  simulateServerError,
  validateApiRequest,
  MockAxiosType,
} from '../../../shared/util/api-test-utils';

describe('QuizManagement Integration Tests', () => {
  let mockAxios: MockAxiosType;

  beforeEach(() => {
    mockAxios = createMockAxios();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  afterAll(() => {
    mockAxios.restore();
  });

  describe('Quiz API Integration', () => {
    it('should fetch quizzes and questions on component mount', async () => {
      const mockQuizzes = generateMockQuizzes(3);
      const mockQuestions = generateMockQuestions(10);

      mockAxios.onGet(API_ENDPOINTS.QUIZZES).reply(200, mockPaginatedResponse(mockQuizzes));
      mockAxios.onGet(API_ENDPOINTS.QUESTIONS).reply(200, mockQuestions);

      renderWithProviders(<QuizManagement />);

      await waitFor(() => {
        expect(screen.getByText(mockQuizzes[0].title)).toBeInTheDocument();
        expect(screen.getByText(mockQuizzes[1].title)).toBeInTheDocument();
      });

      // Verify API calls
      expect(mockAxios.history.get).toHaveLength(2);
      expect(mockAxios.history.get[0].url).toContain(API_ENDPOINTS.QUIZZES);
      expect(mockAxios.history.get[1].url).toContain(API_ENDPOINTS.QUESTIONS);
    });

    it('should create quiz with questions and settings', async () => {
      const newQuiz = {
        title: 'New Japanese Quiz',
        description: 'Test quiz for beginners',
        quizType: 'COURSE',
        isTest: true,
        isPractice: false,
        timeLimit: 30,
        maxAttempts: 3,
        questions: [
          {
            content: 'What is "hello" in Japanese?',
            type: 'MULTIPLE_CHOICE',
            correctAnswer: 'こんにちは',
            options: ['こんにちは', 'さようなら', 'ありがとう', 'すみません'],
          },
        ],
      };

      mockAxios.onPost(API_ENDPOINTS.QUIZZES).reply(201, { id: 'new-quiz-id', ...newQuiz });
      mockAxios.onPost(API_ENDPOINTS.QUESTIONS).reply(201, { id: 'new-question-id', ...newQuiz.questions[0] });

      const user = userEvent.setup();
      renderWithProviders(<QuizManagement />);

      // Open quiz builder
      const createQuizButton = screen.getByTestId('create-quiz-button');
      await user.click(createQuizButton);

      // Fill quiz details
      await user.type(screen.getByTestId('quiz-title-input'), newQuiz.title);
      await user.type(screen.getByTestId('quiz-description-input'), newQuiz.description);
      await user.selectOptions(screen.getByTestId('quiz-type-select'), newQuiz.quizType);

      // Configure quiz settings
      const settingsButton = screen.getByTestId('quiz-settings-button');
      await user.click(settingsButton);

      await user.click(screen.getByTestId('is-test-checkbox'));
      await user.type(screen.getByTestId('time-limit-input'), newQuiz.timeLimit.toString());
      await user.type(screen.getByTestId('max-attempts-input'), newQuiz.maxAttempts.toString());

      const saveSettingsButton = screen.getByTestId('save-settings-button');
      await user.click(saveSettingsButton);

      // Add question
      const addQuestionButton = screen.getByTestId('add-question-button');
      await user.click(addQuestionButton);

      await user.type(screen.getByTestId('question-content-input'), newQuiz.questions[0].content);
      await user.selectOptions(screen.getByTestId('question-type-select'), newQuiz.questions[0].type);
      await user.type(screen.getByTestId('correct-answer-input'), newQuiz.questions[0].correctAnswer);

      // Add multiple choice options
      for (let i = 0; i < newQuiz.questions[0].options.length; i++) {
        await user.type(screen.getByTestId(`option-${i}-input`), newQuiz.questions[0].options[i]);
      }

      const saveQuestionButton = screen.getByTestId('save-question-button');
      await user.click(saveQuestionButton);

      // Save quiz
      const saveQuizButton = screen.getByTestId('save-quiz-button');
      await user.click(saveQuizButton);

      await waitFor(() => {
        expect(mockAxios.history.post).toHaveLength(2); // Quiz + Question
      });

      // Verify quiz creation
      const quizRequest = mockAxios.history.post.find(req => req.url === API_ENDPOINTS.QUIZZES);
      expect(quizRequest).toBeDefined();
      validateApiRequest(
        quizRequest,
        expect.objectContaining({
          title: newQuiz.title,
          description: newQuiz.description,
          quizType: newQuiz.quizType,
          isTest: newQuiz.isTest,
          timeLimit: newQuiz.timeLimit,
        }),
      );

      // Verify question creation
      const questionRequest = mockAxios.history.post.find(req => req.url === API_ENDPOINTS.QUESTIONS);
      expect(questionRequest).toBeDefined();
    });

    it('should handle quiz assignment to courses and lessons', async () => {
      const mockQuizzes = generateMockQuizzes(1);
      const assignmentData = {
        quizId: mockQuizzes[0].id,
        targetType: 'COURSE',
        targetIds: ['course-1', 'course-2'],
        startDate: '2024-02-01T00:00:00Z',
        endDate: '2024-02-28T23:59:59Z',
        isRequired: true,
      };

      mockAxios.onGet(API_ENDPOINTS.QUIZZES).reply(200, mockPaginatedResponse(mockQuizzes));
      mockAxios.onPost(API_ENDPOINTS.QUIZ_ASSIGNMENTS).reply(201, assignmentData);

      const user = userEvent.setup();
      renderWithProviders(<QuizManagement />);

      // Wait for quizzes to load
      await waitFor(() => {
        expect(screen.getByText(mockQuizzes[0].title)).toBeInTheDocument();
      });

      // Open assignment modal
      const assignButton = screen.getByTestId('assign-quiz-button');
      await user.click(assignButton);

      // Configure assignment
      await user.selectOptions(screen.getByTestId('target-type-select'), assignmentData.targetType);

      // Select courses
      const courseSelect = screen.getByTestId('course-multi-select');
      await user.selectOptions(courseSelect, assignmentData.targetIds);

      // Set dates
      await user.type(screen.getByTestId('start-date-input'), '2024-02-01');
      await user.type(screen.getByTestId('end-date-input'), '2024-02-28');

      // Mark as required
      await user.click(screen.getByTestId('is-required-checkbox'));

      // Save assignment
      const saveAssignmentButton = screen.getByTestId('save-assignment-button');
      await user.click(saveAssignmentButton);

      await waitFor(() => {
        expect(mockAxios.history.post).toHaveLength(1);
      });

      validateApiRequest(mockAxios.history.post[0], assignmentData);
    });

    it('should handle question bank integration and reuse', async () => {
      const mockQuestions = generateMockQuestions(5);
      const existingQuizId = 'existing-quiz-id';

      mockAxios.onGet(API_ENDPOINTS.QUESTIONS).reply(200, mockQuestions);
      mockAxios.onPost(`${API_ENDPOINTS.QUIZZES}/${existingQuizId}/questions`).reply(200, { success: true });

      const user = userEvent.setup();
      renderWithProviders(<QuizManagement />);

      // Open quiz builder for existing quiz
      const editQuizButton = screen.getByTestId('edit-quiz-button');
      await user.click(editQuizButton);

      // Open question bank
      const questionBankButton = screen.getByTestId('question-bank-button');
      await user.click(questionBankButton);

      // Wait for questions to load
      await waitFor(() => {
        expect(screen.getByText(mockQuestions[0].content)).toBeInTheDocument();
      });

      // Select questions from bank
      const questionCheckboxes = screen.getAllByTestId(/question-checkbox-/);
      await user.click(questionCheckboxes[0]);
      await user.click(questionCheckboxes[1]);

      // Add selected questions to quiz
      const addSelectedButton = screen.getByTestId('add-selected-questions-button');
      await user.click(addSelectedButton);

      await waitFor(() => {
        expect(mockAxios.history.post).toHaveLength(1);
      });

      // Verify questions were added to quiz
      const addQuestionsRequest = mockAxios.history.post[0];
      expect(addQuestionsRequest.url).toBe(`${API_ENDPOINTS.QUIZZES}/${existingQuizId}/questions`);
    });

    it('should handle quiz analytics and performance tracking', async () => {
      const mockQuizzes = generateMockQuizzes(1);
      const quizAnalytics = {
        totalAttempts: 150,
        averageScore: 78.5,
        completionRate: 92,
        timeSpentAverage: 25.5,
        questionAnalytics: [
          {
            questionId: 'q1',
            correctAnswers: 120,
            incorrectAnswers: 30,
            averageTime: 45,
            difficultyLevel: 'MEDIUM',
          },
        ],
      };

      mockAxios.onGet(API_ENDPOINTS.QUIZZES).reply(200, mockPaginatedResponse(mockQuizzes));
      mockAxios.onGet(`${API_ENDPOINTS.QUIZ_ANALYTICS}/${mockQuizzes[0].id}`).reply(200, quizAnalytics);

      const user = userEvent.setup();
      renderWithProviders(<QuizManagement />);

      // Wait for quizzes to load
      await waitFor(() => {
        expect(screen.getByText(mockQuizzes[0].title)).toBeInTheDocument();
      });

      // Open analytics dashboard
      const analyticsButton = screen.getByTestId('quiz-analytics-button');
      await user.click(analyticsButton);

      // Wait for analytics to load
      await waitFor(() => {
        expect(screen.getByText('150 attempts')).toBeInTheDocument();
        expect(screen.getByText('78.5% average score')).toBeInTheDocument();
        expect(screen.getByText('92% completion rate')).toBeInTheDocument();
      });

      // Verify analytics API call
      const analyticsCall = mockAxios.history.get.find(call => call.url?.includes('/quiz-analytics/'));
      expect(analyticsCall).toBeDefined();
    });

    it('should handle bulk quiz operations', async () => {
      const mockQuizzes = generateMockQuizzes(3);
      const bulkActionData = {
        action: 'ACTIVATE',
        quizIds: [mockQuizzes[0].id, mockQuizzes[1].id],
      };

      mockAxios.onGet(API_ENDPOINTS.QUIZZES).reply(200, mockPaginatedResponse(mockQuizzes));
      mockAxios.onPost(`${API_ENDPOINTS.QUIZZES}/bulk-actions`).reply(200, { success: true });

      const user = userEvent.setup();
      renderWithProviders(<QuizManagement />);

      // Wait for quizzes to load
      await waitFor(() => {
        expect(screen.getByText(mockQuizzes[0].title)).toBeInTheDocument();
      });

      // Select quizzes
      const selectAllCheckbox = screen.getByTestId('select-all-checkbox');
      await user.click(selectAllCheckbox);

      // Perform bulk action
      const bulkActivateButton = screen.getByTestId('bulk-activate-button');
      await user.click(bulkActivateButton);

      await waitFor(() => {
        expect(mockAxios.history.post).toHaveLength(1);
      });

      validateApiRequest(
        mockAxios.history.post[0],
        expect.objectContaining({
          action: 'ACTIVATE',
        }),
      );
    });

    it('should handle quiz preview and testing', async () => {
      const mockQuizzes = generateMockQuizzes(1);
      const mockQuestions = generateMockQuestions(3);
      const previewData = {
        quiz: mockQuizzes[0],
        questions: mockQuestions,
        settings: {
          timeLimit: 30,
          showCorrectAnswers: false,
          allowReview: true,
        },
      };

      mockAxios.onGet(API_ENDPOINTS.QUIZZES).reply(200, mockPaginatedResponse(mockQuizzes));
      mockAxios.onGet(`${API_ENDPOINTS.QUIZZES}/${mockQuizzes[0].id}/preview`).reply(200, previewData);

      const user = userEvent.setup();
      renderWithProviders(<QuizManagement />);

      // Wait for quizzes to load
      await waitFor(() => {
        expect(screen.getByText(mockQuizzes[0].title)).toBeInTheDocument();
      });

      // Open quiz preview
      const previewButton = screen.getByTestId('preview-quiz-button');
      await user.click(previewButton);

      // Wait for preview to load
      await waitFor(() => {
        expect(screen.getByTestId('quiz-preview-modal')).toBeInTheDocument();
        expect(screen.getByText(mockQuestions[0].content)).toBeInTheDocument();
      });

      // Verify preview API call
      const previewCall = mockAxios.history.get.find(call => call.url?.includes('/preview'));
      expect(previewCall).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle quiz validation errors', async () => {
      const validationErrors = {
        message: 'Validation failed',
        errors: {
          title: 'Quiz title is required',
          questions: 'At least one question is required',
          timeLimit: 'Time limit must be positive',
        },
      };

      mockAxios.onPost(API_ENDPOINTS.QUIZZES).reply(400, validationErrors);

      const user = userEvent.setup();
      renderWithProviders(<QuizManagement />);

      // Try to create invalid quiz
      const createQuizButton = screen.getByTestId('create-quiz-button');
      await user.click(createQuizButton);

      const saveQuizButton = screen.getByTestId('save-quiz-button');
      await user.click(saveQuizButton);

      await waitFor(() => {
        expect(screen.getByText('Quiz title is required')).toBeInTheDocument();
        expect(screen.getByText('At least one question is required')).toBeInTheDocument();
      });
    });

    it('should handle question import errors', async () => {
      const importError = {
        message: 'Import failed',
        details: {
          invalidQuestions: [
            { line: 5, error: 'Missing correct answer' },
            { line: 12, error: 'Invalid question type' },
          ],
        },
      };

      mockAxios.onPost(`${API_ENDPOINTS.QUESTIONS}/import`).reply(400, importError);

      const user = userEvent.setup();
      renderWithProviders(<QuizManagement />);

      // Try to import questions
      const importButton = screen.getByTestId('import-questions-button');
      await user.click(importButton);

      const fileInput = screen.getByTestId('import-file-input');
      const csvFile = new File(['invalid,csv,content'], 'questions.csv', { type: 'text/csv' });
      await user.upload(fileInput, csvFile);

      const confirmImportButton = screen.getByTestId('confirm-import-button');
      await user.click(confirmImportButton);

      await waitFor(() => {
        expect(screen.getByText('Import failed')).toBeInTheDocument();
        expect(screen.getByText('Line 5: Missing correct answer')).toBeInTheDocument();
        expect(screen.getByText('Line 12: Invalid question type')).toBeInTheDocument();
      });
    });

    it('should handle quiz assignment conflicts', async () => {
      const conflictError = {
        message: 'Assignment conflict detected',
        conflicts: [
          {
            type: 'SCHEDULE_CONFLICT',
            message: 'Quiz overlaps with existing assignment',
            details: {
              existingQuiz: 'Basic Grammar Quiz',
              conflictPeriod: '2024-02-01 to 2024-02-15',
            },
          },
        ],
      };

      mockAxios.onPost(API_ENDPOINTS.QUIZ_ASSIGNMENTS).reply(409, conflictError);

      const user = userEvent.setup();
      renderWithProviders(<QuizManagement />);

      // Try to create conflicting assignment
      const assignButton = screen.getByTestId('assign-quiz-button');
      await user.click(assignButton);

      // Fill assignment details that would conflict
      await user.selectOptions(screen.getByTestId('target-type-select'), 'COURSE');
      await user.type(screen.getByTestId('start-date-input'), '2024-02-01');
      await user.type(screen.getByTestId('end-date-input'), '2024-02-15');

      const saveAssignmentButton = screen.getByTestId('save-assignment-button');
      await user.click(saveAssignmentButton);

      await waitFor(() => {
        expect(screen.getByText('Assignment conflict detected')).toBeInTheDocument();
        expect(screen.getByText('Quiz overlaps with existing assignment')).toBeInTheDocument();
      });
    });
  });

  describe('Performance and Optimization', () => {
    it('should implement question lazy loading for large question banks', async () => {
      const largeQuestionSet = generateMockQuestions(100);

      mockAxios.onGet(API_ENDPOINTS.QUESTIONS).reply(config => {
        const params = new URLSearchParams(config.url?.split('?')[1]);
        const page = parseInt(params.get('page') || '0', 10);
        const size = parseInt(params.get('size') || '20', 10);

        const start = page * size;
        const end = start + size;
        const pageData = largeQuestionSet.slice(start, end);

        return [200, mockPaginatedResponse(pageData, page, size, largeQuestionSet.length)];
      });

      renderWithProviders(<QuizManagement />);

      // Open question bank
      const questionBankButton = screen.getByTestId('question-bank-button');
      await userEvent.setup().click(questionBankButton);

      // Should load first page of questions
      await waitFor(() => {
        expect(screen.getAllByTestId(/question-item-/)).toHaveLength(20);
      });

      // Verify pagination was used
      const questionRequest = mockAxios.history.get.find(call => call.url?.includes(API_ENDPOINTS.QUESTIONS));
      expect(questionRequest?.url).toContain('page=0');
      expect(questionRequest?.url).toContain('size=20');
    });

    it('should cache quiz data for better performance', async () => {
      const mockQuizzes = generateMockQuizzes(3);
      mockAxios.onGet(API_ENDPOINTS.QUIZZES).reply(200, mockPaginatedResponse(mockQuizzes));

      const { rerender } = renderWithProviders(<QuizManagement />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText(mockQuizzes[0].title)).toBeInTheDocument();
      });

      // Re-render component
      rerender(<QuizManagement />);

      // Should use cached data, no additional API calls
      expect(mockAxios.history.get).toHaveLength(1);
    });

    it('should debounce search requests', async () => {
      const mockQuizzes = generateMockQuizzes(5);
      mockAxios.onGet(API_ENDPOINTS.QUIZZES).reply(200, mockPaginatedResponse(mockQuizzes));

      const user = userEvent.setup();
      renderWithProviders(<QuizManagement />);

      // Type search term quickly
      const searchInput = screen.getByTestId('quiz-search-input');
      await user.type(searchInput, 'japanese');

      // Wait for debounced search
      await waitFor(
        () => {
          expect(mockAxios.history.get.length).toBeGreaterThan(1);
        },
        { timeout: 1000 },
      );

      // Should have made fewer requests than characters typed due to debouncing
      expect(mockAxios.history.get.length).toBeLessThan(9); // 'japanese' has 8 characters + initial load
    });
  });
});
