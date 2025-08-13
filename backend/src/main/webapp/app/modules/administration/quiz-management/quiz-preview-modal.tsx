import React, { useState, useEffect } from 'react';
import { Modal, Card, Button, Space, Radio, Checkbox, Input, Alert, Divider, Typography } from 'antd';
import { PlayCircleOutlined, ClockCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Translate } from 'react-jhipster';
import { IQuizBuilder, IQuizQuestionBuilder } from './quiz-management.reducer';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface QuizPreviewModalProps {
  open: boolean;
  quiz: IQuizBuilder | null;
  onClose: () => void;
}

interface PreviewAnswer {
  questionId: number;
  answer: string | string[];
}

export const QuizPreviewModal: React.FC<QuizPreviewModalProps> = ({ open, quiz, onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<PreviewAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    if (open && quiz) {
      setAnswers([]);
      setCurrentQuestionIndex(0);
    }
  }, [open, quiz]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (isStarted && timeRemaining && timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleTimeUp();
    }
    return () => clearTimeout(timer);
  }, [timeRemaining, isStarted]);

  const resetPreview = () => {
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setIsStarted(false);
    if (quiz?.timeLimitMinutes) {
      setTimeRemaining(quiz.timeLimitMinutes * 60);
    } else {
      setTimeRemaining(null);
    }
  };

  const startPreview = () => {
    setIsStarted(true);
  };

  const handleTimeUp = () => {
    Modal.info({
      title: 'Time Up!',
      content: 'The quiz time limit has been reached. In a real quiz, this would be automatically submitted.',
    });
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: number, answer: string | string[]) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => (a.questionId === questionId ? { ...a, answer } : a));
      } else {
        return [...prev, { questionId, answer }];
      }
    });
  };

  const getCurrentAnswer = (questionId: number): string | string[] => {
    const answer = answers.find(a => a.questionId === questionId);
    return answer?.answer || '';
  };

  const renderQuestion = (question: IQuizQuestionBuilder, index: number) => {
    const currentAnswer = getCurrentAnswer(question.questionId || 0);

    const renderAnswerInput = () => {
      switch (question.type) {
        case 'MULTIPLE_CHOICE':
          try {
            const options = JSON.parse(question.correctAnswer || '[]');
            if (Array.isArray(options)) {
              return (
                <Radio.Group value={currentAnswer} onChange={e => handleAnswerChange(question.questionId || 0, e.target.value)}>
                  <Space direction="vertical">
                    {options.map((option: any, optIndex: number) => (
                      <Radio key={optIndex} value={option.text}>
                        {option.text}
                      </Radio>
                    ))}
                  </Space>
                </Radio.Group>
              );
            }
          } catch (e) {
            // Fallback for simple text answers
            return (
              <Radio.Group value={currentAnswer} onChange={event => handleAnswerChange(question.questionId || 0, event.target.value)}>
                <Radio value={question.correctAnswer}>{question.correctAnswer}</Radio>
              </Radio.Group>
            );
          }
          break;

        case 'MULTIPLE_SELECT':
          try {
            const options = JSON.parse(question.correctAnswer || '[]');
            if (Array.isArray(options)) {
              return (
                <Checkbox.Group
                  value={Array.isArray(currentAnswer) ? currentAnswer : []}
                  onChange={values => handleAnswerChange(question.questionId || 0, values)}
                >
                  <Space direction="vertical">
                    {options.map((option: any, optIndex: number) => (
                      <Checkbox key={optIndex} value={option.text}>
                        {option.text}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              );
            }
          } catch (e) {
            // Fallback
            return (
              <Checkbox.Group
                value={Array.isArray(currentAnswer) ? currentAnswer : []}
                onChange={values => handleAnswerChange(question.questionId || 0, values)}
              >
                <Checkbox value={question.correctAnswer}>{question.correctAnswer}</Checkbox>
              </Checkbox.Group>
            );
          }
          break;

        case 'FILL_IN_BLANK':
          return (
            <Input
              placeholder="Enter your answer"
              value={currentAnswer as string}
              onChange={e => handleAnswerChange(question.questionId || 0, e.target.value)}
            />
          );

        case 'TRUE_FALSE':
          return (
            <Radio.Group value={currentAnswer} onChange={e => handleAnswerChange(question.questionId || 0, e.target.value)}>
              <Space direction="vertical">
                <Radio value="true">True</Radio>
                <Radio value="false">False</Radio>
              </Space>
            </Radio.Group>
          );

        case 'ESSAY':
          return (
            <TextArea
              rows={4}
              placeholder="Enter your essay answer"
              value={currentAnswer as string}
              onChange={e => handleAnswerChange(question.questionId || 0, e.target.value)}
            />
          );

        case 'MATCHING':
          return (
            <Alert
              message="Matching Question"
              description="This is a matching question. In a real implementation, you would drag and drop items to match them."
              type="info"
            />
          );

        case 'ORDERING':
          return (
            <Alert
              message="Ordering Question"
              description="This is an ordering question. In a real implementation, you would drag items to put them in the correct order."
              type="info"
            />
          );

        default:
          return (
            <Input
              placeholder="Enter your answer"
              value={currentAnswer as string}
              onChange={e => handleAnswerChange(question.questionId || 0, e.target.value)}
            />
          );
      }
    };

    return (
      <Card key={question.questionId} style={{ marginBottom: 16 }}>
        <div style={{ marginBottom: 16 }}>
          <Title level={5}>
            Question {index + 1} of {quiz?.questions?.length || 0}
          </Title>
          <div style={{ fontSize: '16px', marginBottom: 16 }}>{question.content}</div>

          {question.imageUrl && (
            <div style={{ marginBottom: 16 }}>
              <img src={question.imageUrl} alt="Question" style={{ maxWidth: '100%', maxHeight: 300, objectFit: 'contain' }} />
            </div>
          )}
        </div>

        <div style={{ marginBottom: 16 }}>{renderAnswerInput()}</div>

        {question.suggestion && (
          <Alert message="Hint" description={question.suggestion} type="info" showIcon style={{ marginBottom: 16 }} />
        )}
      </Card>
    );
  };

  if (!quiz) {
    return null;
  }

  const currentQuestion = quiz.questions?.[currentQuestionIndex];
  const totalQuestions = quiz.questions?.length || 0;

  return (
    <Modal title={`Quiz Preview: ${quiz.title}`} open={open} onCancel={onClose} width={800} footer={null} destroyOnHidden>
      {!isStarted ? (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Title level={3}>{quiz.title}</Title>

          {quiz.description && (
            <Text type="secondary" style={{ fontSize: '16px', display: 'block', marginBottom: 24 }}>
              {quiz.description}
            </Text>
          )}

          <Card style={{ marginBottom: 24 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <div>
                <QuestionCircleOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <div style={{ marginTop: 8 }}>
                  <strong>{totalQuestions} Questions</strong>
                </div>
              </div>

              {quiz.timeLimitMinutes && (
                <div>
                  <ClockCircleOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                  <div style={{ marginTop: 8 }}>
                    <strong>{quiz.timeLimitMinutes} Minutes</strong>
                  </div>
                </div>
              )}

              <div>
                <Text type="secondary">
                  Quiz Type: {quiz.quizType} | {quiz.isTest ? 'Test' : 'Practice'}
                </Text>
              </div>
            </Space>
          </Card>

          <Alert
            message="Preview Mode"
            description="This is a preview of how the quiz will appear to students. Your answers will not be saved."
            type="warning"
            style={{ marginBottom: 24 }}
          />

          <Button type="primary" size="large" icon={<PlayCircleOutlined />} onClick={startPreview}>
            Start Preview
          </Button>
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <Text strong>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </Text>
            </div>
            {timeRemaining !== null && (
              <div style={{ color: timeRemaining < 300 ? '#f5222d' : '#1890ff' }}>
                <ClockCircleOutlined /> {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          {currentQuestion && renderQuestion(currentQuestion, currentQuestionIndex)}

          <Divider />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button disabled={currentQuestionIndex === 0} onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}>
              Previous
            </Button>

            <Space>
              <Text type="secondary">
                {answers.length} of {totalQuestions} answered
              </Text>
            </Space>

            <Button
              type="primary"
              disabled={currentQuestionIndex === totalQuestions - 1}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            >
              Next
            </Button>
          </div>

          {currentQuestionIndex === totalQuestions - 1 && (
            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Button type="primary" size="large">
                Submit Quiz (Preview Only)
              </Button>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
};

export default QuizPreviewModal;
