import React, { useState, useCallback, useEffect } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import {
  Text,
  Card,
  Button,
  RadioButton,
  Checkbox,
  useTheme,
  ProgressBar,
  Surface,
  IconButton,
  Chip,
} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './quiz-screen.styles';

function QuizScreen({ route, navigation }) {
  const { quiz, lesson } = route.params || {};
  const theme = useTheme();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);

  // Mock quiz data - replace with real data from backend
  const mockQuiz = {
    id: quiz?.id || 1,
    title: quiz?.title || 'N5 Vocabulary Quiz',
    description: quiz?.description || 'Test your knowledge of basic Japanese vocabulary',
    isTest: quiz?.isTest || false,
    isPractice: quiz?.isPractice || true,
    timeLimit: quiz?.timeLimit || 300, // 5 minutes
    questions: [
      {
        id: 1,
        question: 'Từ "こんにちは" có nghĩa là gì?',
        type: 'MULTIPLE_CHOICE',
        options: ['Chào buổi sáng', 'Xin chào', 'Chào buổi tối', 'Tạm biệt'],
        correctAnswer: 1,
        explanation:
          'こんにちは (konnichiwa) là lời chào dùng vào ban ngày, tương đương với "Xin chào" trong tiếng Việt.',
      },
      {
        id: 2,
        question: 'Kanji nào đọc là "やま"?',
        type: 'MULTIPLE_CHOICE',
        options: ['川', '山', '田', '海'],
        correctAnswer: 1,
        explanation: '山 (yama) có nghĩa là núi.',
      },
      {
        id: 3,
        question: 'Chọn các từ chỉ màu sắc:',
        type: 'MULTIPLE_SELECT',
        options: ['あか (aka)', 'いぬ (inu)', 'あお (ao)', 'しろ (shiro)'],
        correctAnswers: [0, 2, 3],
        explanation:
          'あか (đỏ), あお (xanh), しろ (trắng) là các từ chỉ màu sắc. いぬ (inu) có nghĩa là chó.',
      },
    ],
  };

  const [quizData] = useState(mockQuiz);
  const totalQuestions = quizData.questions.length;

  // Timer effect
  useEffect(() => {
    if (quizStarted && timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !showResults) {
      handleSubmitQuiz();
    }
  }, [quizStarted, timeRemaining, showResults]);

  const startQuiz = useCallback(() => {
    setQuizStarted(true);
    setTimeRemaining(quizData.timeLimit);
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  }, [quizData.timeLimit]);

  const handleAnswer = useCallback((questionId, answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  }, []);

  const nextQuestion = useCallback(() => {
    if (currentQuestion < totalQuestions - 1) {
      setCurrentQuestion((prev) => prev + 1);
    }
  }, [currentQuestion, totalQuestions]);

  const previousQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  }, [currentQuestion]);

  const calculateScore = useCallback(() => {
    let correct = 0;

    quizData.questions.forEach((question) => {
      const userAnswer = answers[question.id];

      if (question.type === 'MULTIPLE_CHOICE') {
        if (userAnswer === question.correctAnswer) {
          correct++;
        }
      } else if (question.type === 'MULTIPLE_SELECT') {
        if (Array.isArray(userAnswer) && Array.isArray(question.correctAnswers)) {
          const sortedUser = [...userAnswer].sort();
          const sortedCorrect = [...question.correctAnswers].sort();

          if (
            sortedUser.length === sortedCorrect.length &&
            sortedUser.every((val, index) => val === sortedCorrect[index])
          ) {
            correct++;
          }
        }
      }
    });

    return correct;
  }, [quizData.questions, answers]);

  const handleSubmitQuiz = useCallback(() => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);

    // Show completion alert
    const percentage = Math.round((finalScore / totalQuestions) * 100);
    Alert.alert(
      'Quiz hoàn thành!',
      `Bạn đạt ${finalScore}/${totalQuestions} câu đúng (${percentage}%)`,
      [{ text: 'OK' }]
    );
  }, [calculateScore, totalQuestions]);

  const restartQuiz = useCallback(() => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
    setScore(0);
    setQuizStarted(false);
    setTimeRemaining(null);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const renderMultipleChoice = (question) => {
    const selectedAnswer = answers[question.id];

    return (
      <RadioButton.Group
        onValueChange={(value) => handleAnswer(question.id, parseInt(value))}
        value={selectedAnswer?.toString() || ''}
      >
        {question.options.map((option, index) => (
          <View key={index} style={styles.optionRow}>
            <RadioButton value={index.toString()} />
            <Text
              style={[styles.optionText, { color: theme.colors.onSurface }]}
              onPress={() => handleAnswer(question.id, index)}
            >
              {option}
            </Text>
          </View>
        ))}
      </RadioButton.Group>
    );
  };

  const renderMultipleSelect = (question) => {
    const selectedAnswers = answers[question.id] || [];

    return (
      <View>
        {question.options.map((option, index) => (
          <View key={index} style={styles.optionRow}>
            <Checkbox
              status={selectedAnswers.includes(index) ? 'checked' : 'unchecked'}
              onPress={() => {
                const newAnswers = selectedAnswers.includes(index)
                  ? selectedAnswers.filter((i) => i !== index)
                  : [...selectedAnswers, index];
                handleAnswer(question.id, newAnswers);
              }}
            />
            <Text
              style={[styles.optionText, { color: theme.colors.onSurface }]}
              onPress={() => {
                const newAnswers = selectedAnswers.includes(index)
                  ? selectedAnswers.filter((i) => i !== index)
                  : [...selectedAnswers, index];
                handleAnswer(question.id, newAnswers);
              }}
            >
              {option}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const renderResults = () => {
    const percentage = Math.round((score / totalQuestions) * 100);
    const passed = percentage >= 70;

    return (
      <ScrollView style={styles.resultsContainer}>
        <Card style={[styles.resultsCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.scoreHeader}>
              <MaterialCommunityIcons
                name={passed ? 'trophy' : 'medal'}
                size={48}
                color={passed ? theme.colors.primary : theme.colors.tertiary}
              />
              <Text style={[styles.scoreTitle, { color: theme.colors.onSurface }]}>
                Kết quả Quiz
              </Text>
            </View>

            <Text style={[styles.scoreText, { color: theme.colors.onSurface }]}>
              {score}/{totalQuestions} câu đúng ({percentage}%)
            </Text>

            <Chip
              mode="flat"
              style={[
                styles.resultChip,
                {
                  backgroundColor: passed
                    ? theme.colors.primaryContainer
                    : theme.colors.errorContainer,
                },
              ]}
              textStyle={{
                color: passed ? theme.colors.onPrimaryContainer : theme.colors.onErrorContainer,
              }}
              icon={passed ? 'check-circle' : 'close-circle'}
            >
              {passed ? 'Đạt' : 'Chưa đạt'}
            </Chip>
          </Card.Content>
        </Card>

        {/* Question Review */}
        {quizData.questions.map((question, index) => {
          const userAnswer = answers[question.id];
          const isCorrect =
            question.type === 'MULTIPLE_CHOICE'
              ? userAnswer === question.correctAnswer
              : Array.isArray(userAnswer) &&
                Array.isArray(question.correctAnswers) &&
                userAnswer.length === question.correctAnswers.length &&
                userAnswer.every((val) => question.correctAnswers.includes(val));

          return (
            <Card
              key={question.id}
              style={[styles.reviewCard, { backgroundColor: theme.colors.surface }]}
            >
              <Card.Content>
                <View style={styles.reviewHeader}>
                  <Text style={[styles.reviewQuestion, { color: theme.colors.onSurface }]}>
                    {index + 1}. {question.question}
                  </Text>
                  <MaterialCommunityIcons
                    name={isCorrect ? 'check-circle' : 'close-circle'}
                    size={24}
                    color={isCorrect ? theme.colors.primary : theme.colors.error}
                  />
                </View>

                {question.explanation && (
                  <Text style={[styles.explanation, { color: theme.colors.onSurfaceVariant }]}>
                    💡 {question.explanation}
                  </Text>
                )}
              </Card.Content>
            </Card>
          );
        })}

        <View style={styles.resultsActions}>
          <Button mode="outlined" onPress={restartQuiz} style={styles.actionButton} icon="restart">
            Làm lại
          </Button>

          <Button
            mode="contained"
            onPress={() => navigation.goBack()}
            style={[styles.actionButton, { backgroundColor: theme.colors.primary }]}
            icon="arrow-left"
          >
            Quay lại
          </Button>
        </View>
      </ScrollView>
    );
  };

  if (!quizStarted) {
    return (
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.startContainer}>
          <Card style={[styles.startCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <View style={styles.startHeader}>
                <MaterialCommunityIcons name="quiz" size={64} color={theme.colors.primary} />
                <Text style={[styles.quizTitle, { color: theme.colors.onSurface }]}>
                  {quizData.title}
                </Text>
                <Text style={[styles.quizDescription, { color: theme.colors.onSurfaceVariant }]}>
                  {quizData.description}
                </Text>
              </View>

              <View style={styles.quizInfo}>
                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="help-circle"
                    size={20}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                    {totalQuestions} câu hỏi
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name="clock"
                    size={20}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                    {Math.round(quizData.timeLimit / 60)} phút
                  </Text>
                </View>

                <View style={styles.infoRow}>
                  <MaterialCommunityIcons
                    name={quizData.isTest ? 'school' : 'brain'}
                    size={20}
                    color={theme.colors.onSurfaceVariant}
                  />
                  <Text style={[styles.infoText, { color: theme.colors.onSurfaceVariant }]}>
                    {quizData.isTest ? 'Kiểm tra' : 'Luyện tập'}
                  </Text>
                </View>
              </View>

              {lesson && (
                <Surface
                  style={[styles.lessonInfo, { backgroundColor: theme.colors.primaryContainer }]}
                >
                  <Text style={[styles.lessonText, { color: theme.colors.onPrimaryContainer }]}>
                    📚 Bài học: {lesson.title}
                  </Text>
                </Surface>
              )}

              <Button
                mode="contained"
                onPress={startQuiz}
                style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
                icon="play"
                contentStyle={styles.startButtonContent}
              >
                Bắt đầu Quiz
              </Button>
            </Card.Content>
          </Card>
        </ScrollView>
      </View>
    );
  }

  if (showResults) {
    return <View style={styles.container}>{renderResults()}</View>;
  }

  const question = quizData.questions[currentQuestion];
  const progress = (currentQuestion + 1) / totalQuestions;

  return (
    <View style={styles.container}>
      {/* Header */}
      <Surface style={[styles.header, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.headerContent}>
          <IconButton icon="close" size={24} onPress={() => navigation.goBack()} />
          <View style={styles.headerInfo}>
            <Text style={[styles.questionCounter, { color: theme.colors.onSurface }]}>
              {currentQuestion + 1}/{totalQuestions}
            </Text>
            {timeRemaining !== null && (
              <Text
                style={[
                  styles.timer,
                  {
                    color: timeRemaining < 60 ? theme.colors.error : theme.colors.onSurface,
                  },
                ]}
              >
                ⏰ {formatTime(timeRemaining)}
              </Text>
            )}
          </View>
        </View>

        <ProgressBar progress={progress} color={theme.colors.primary} style={styles.progressBar} />
      </Surface>

      {/* Question */}
      <ScrollView style={styles.questionContainer}>
        <Card style={[styles.questionCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.questionText, { color: theme.colors.onSurface }]}>
              {question.question}
            </Text>

            <View style={styles.optionsContainer}>
              {question.type === 'MULTIPLE_CHOICE' && renderMultipleChoice(question)}
              {question.type === 'MULTIPLE_SELECT' && renderMultipleSelect(question)}
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Navigation */}
      <Surface style={[styles.navigation, { backgroundColor: theme.colors.surface }]}>
        <Button
          mode="outlined"
          onPress={previousQuestion}
          disabled={currentQuestion === 0}
          style={styles.navButton}
          icon="arrow-left"
        >
          Trước
        </Button>

        {currentQuestion === totalQuestions - 1 ? (
          <Button
            mode="contained"
            onPress={handleSubmitQuiz}
            style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
            icon="check"
          >
            Nộp bài
          </Button>
        ) : (
          <Button
            mode="contained"
            onPress={nextQuestion}
            style={[styles.navButton, { backgroundColor: theme.colors.primary }]}
            icon="arrow-right"
          >
            Tiếp
          </Button>
        )}
      </Surface>
    </View>
  );
}

export default QuizScreen;
