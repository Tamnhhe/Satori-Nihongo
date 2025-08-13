import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { QuizBuilder } from './quiz-builder';
import { renderWithProviders, createMockQuiz, expectToBeAccessible } from '../../../shared/util/test-utils';

expect.extend(toHaveNoViolations);

const mockQuestions = [
  {
    id: '1',
    content: 'What is the Japanese word for "hello"?',
    type: 'MULTIPLE_CHOICE',
    correctAnswer: 'こんにちは',
    imageUrl: null,
    suggestion: 'Think about common greetings',
    answerExplanation: 'こんにちは (konnichiwa) is the most common greeting in Japanese',
    options: ['こんにちは', 'さようなら', 'ありがとう', 'すみません'],
  },
  {
    id: '2',
    content: 'Fill in the blank: 私は___です。(I am a student)',
    type: 'FILL_IN_BLANK',
    correctAnswer: '学生',
    imageUrl: null,
    suggestion: 'What word means student in Japanese?',
    answerExplanation: '学生 (gakusei) means student in Japanese',
  },
];

const mockQuiz = createMockQuiz({
  id: '1',
  title: 'Basic Japanese Quiz',
  description: 'Test your basic Japanese knowledge',
  questions: mockQuestions,
});

const mockInitialState = {
  quizManagement: {
    loading: false,
    currentQuiz: mockQuiz,
    questions: mockQuestions,
    availableQuestions: mockQuestions,
    draggedQuestion: null,
    saving: false,
  },
  authentication: {
    account: {
      authorities: ['ROLE_ADMIN'],
      login: 'admin',
    },
  },
};

describe('QuizBuilder Component', () => {
  it('should render quiz builder with quiz details', () => {
    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    expect(screen.getByTestId('quiz-builder')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Basic Japanese Quiz')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test your basic Japanese knowledge')).toBeInTheDocument();
  });

  it('should display quiz questions in order', () => {
    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    expect(screen.getByTestId('questions-list')).toBeInTheDocument();
    expect(screen.getByText('What is the Japanese word for "hello"?')).toBeInTheDocument();
    expect(screen.getByText(/Fill in the blank/)).toBeInTheDocument();
  });

  it('should handle quiz title changes', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={onSave} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    const titleInput = screen.getByTestId('quiz-title-input');
    await user.clear(titleInput);
    await user.type(titleInput, 'Updated Quiz Title');

    expect(titleInput).toHaveValue('Updated Quiz Title');
  });

  it('should handle quiz description changes', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    const descriptionInput = screen.getByTestId('quiz-description-input');
    await user.clear(descriptionInput);
    await user.type(descriptionInput, 'Updated description');

    expect(descriptionInput).toHaveValue('Updated description');
  });

  it('should handle drag and drop question reordering', () => {
    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    const firstQuestion = screen.getByTestId('question-item-1');
    const secondQuestion = screen.getByTestId('question-item-2');

    // Simulate drag and drop
    fireEvent.dragStart(firstQuestion);
    fireEvent.dragOver(secondQuestion);
    fireEvent.drop(secondQuestion);

    expect(screen.getByTestId('questions-reordered')).toBeInTheDocument();
  });

  it('should add new question when add button is clicked', async () => {
    const onQuestionAdd = jest.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={onQuestionAdd} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    const addQuestionButton = screen.getByTestId('add-question-button');
    await user.click(addQuestionButton);

    expect(onQuestionAdd).toHaveBeenCalled();
  });

  it('should edit question when edit button is clicked', async () => {
    const onQuestionEdit = jest.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <QuizBuilder
        quiz={mockQuiz}
        questions={mockQuestions}
        onSave={jest.fn()}
        onQuestionAdd={jest.fn()}
        onQuestionEdit={onQuestionEdit}
      />,
      { initialState: mockInitialState },
    );

    const editButtons = screen.getAllByTestId('edit-question-button');
    await user.click(editButtons[0]);

    expect(onQuestionEdit).toHaveBeenCalledWith(mockQuestions[0]);
  });

  it('should delete question when delete button is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    const deleteButtons = screen.getAllByTestId('delete-question-button');
    await user.click(deleteButtons[0]);

    // Confirm deletion
    const confirmButton = screen.getByTestId('confirm-delete-button');
    await user.click(confirmButton);

    expect(screen.queryByText('What is the Japanese word for "hello"?')).not.toBeInTheDocument();
  });

  it('should show question types with proper icons', () => {
    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    expect(screen.getByTestId('question-type-MULTIPLE_CHOICE')).toBeInTheDocument();
    expect(screen.getByTestId('question-type-FILL_IN_BLANK')).toBeInTheDocument();
  });

  it('should handle quiz settings', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    const settingsButton = screen.getByTestId('quiz-settings-button');
    await user.click(settingsButton);

    expect(screen.getByTestId('quiz-settings-modal')).toBeInTheDocument();

    const timeLimit = screen.getByTestId('time-limit-input');
    await user.clear(timeLimit);
    await user.type(timeLimit, '30');

    expect(timeLimit).toHaveValue('30');
  });

  it('should preview quiz when preview button is clicked', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    const previewButton = screen.getByTestId('preview-quiz-button');
    await user.click(previewButton);

    expect(screen.getByTestId('quiz-preview-modal')).toBeInTheDocument();
  });

  it('should save quiz when save button is clicked', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={onSave} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    const saveButton = screen.getByTestId('save-quiz-button');
    await user.click(saveButton);

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Basic Japanese Quiz',
          description: 'Test your basic Japanese knowledge',
        }),
      );
    });
  });

  it('should validate quiz before saving', async () => {
    const onSave = jest.fn();
    const user = userEvent.setup();

    renderWithProviders(
      <QuizBuilder quiz={{ ...mockQuiz, title: '' }} questions={[]} onSave={onSave} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    const saveButton = screen.getByTestId('save-quiz-button');
    await user.click(saveButton);

    expect(screen.getByText('Quiz title is required')).toBeInTheDocument();
    expect(screen.getByText('At least one question is required')).toBeInTheDocument();
    expect(onSave).not.toHaveBeenCalled();
  });

  it('should show loading state when saving', () => {
    const savingState = {
      ...mockInitialState,
      quizManagement: {
        ...mockInitialState.quizManagement,
        saving: true,
      },
    };

    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: savingState },
    );

    expect(screen.getByTestId('saving-indicator')).toBeInTheDocument();
    expect(screen.getByTestId('save-quiz-button')).toBeDisabled();
  });

  it('should handle question bank integration', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    const questionBankButton = screen.getByTestId('question-bank-button');
    await user.click(questionBankButton);

    expect(screen.getByTestId('question-bank-modal')).toBeInTheDocument();
  });

  it('should be accessible', async () => {
    const { container } = renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    await expectToBeAccessible(container);
  });

  it('should have proper ARIA labels and roles', () => {
    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    expect(screen.getByRole('main')).toHaveAttribute('aria-label', 'Quiz Builder');
    expect(screen.getByTestId('questions-list')).toHaveAttribute('role', 'list');

    const questionItems = screen.getAllByRole('listitem');
    expect(questionItems).toHaveLength(2);
  });

  it('should support keyboard navigation', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    const titleInput = screen.getByTestId('quiz-title-input');
    titleInput.focus();

    await user.keyboard('{Tab}');
    expect(screen.getByTestId('quiz-description-input')).toHaveFocus();

    await user.keyboard('{Tab}');
    expect(screen.getByTestId('add-question-button')).toHaveFocus();
  });

  it('should handle undo/redo functionality', async () => {
    const user = userEvent.setup();

    renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    // Make a change
    const titleInput = screen.getByTestId('quiz-title-input');
    await user.clear(titleInput);
    await user.type(titleInput, 'New Title');

    // Undo
    await user.keyboard('{Control>}z{/Control}');
    expect(titleInput).toHaveValue('Basic Japanese Quiz');

    // Redo
    await user.keyboard('{Control>}{Shift>}z{/Shift}{/Control}');
    expect(titleInput).toHaveValue('New Title');
  });

  it('should match snapshot', () => {
    const { container } = renderWithProviders(
      <QuizBuilder quiz={mockQuiz} questions={mockQuestions} onSave={jest.fn()} onQuestionAdd={jest.fn()} onQuestionEdit={jest.fn()} />,
      { initialState: mockInitialState },
    );

    expect(container.firstChild).toMatchSnapshot();
  });
});
