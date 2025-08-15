import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { ArrowLeft, Check, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingScreen from '../../shared/components/loading-screen';
import styles from './quiz-screen.styles';

const { width: screenWidth } = Dimensions.get('window');

const quizData = [
  {
    id: 1,
    japanese: 'こんにちは',
    romanji: 'konnichiwa',
    correctAnswer: 'Xin chào',
    options: ['Xin chào', 'Tạm biệt', 'Rất vui được gặp bạn', 'Hẹn gặp lại'],
  },
  {
    id: 2,
    japanese: 'ありがとう',
    romanji: 'arigatou',
    correctAnswer: 'Cảm ơn',
    options: ['Xin lỗi', 'Cảm ơn', 'Không có gì', 'Tạm biệt'],
  },
  {
    id: 3,
    japanese: 'さようなら',
    romanji: 'sayounara',
    correctAnswer: 'Tạm biệt',
    options: ['Xin chào', 'Cảm ơn', 'Tạm biệt', 'Xin lỗi'],
  },
  {
    id: 4,
    japanese: 'すみません',
    romanji: 'sumimasen',
    correctAnswer: 'Xin lỗi',
    options: ['Xin lỗi', 'Cảm ơn', 'Xin chào', 'Tạm biệt'],
  },
  {
    id: 5,
    japanese: 'おはよう',
    romanji: 'ohayou',
    correctAnswer: 'Chào buổi sáng',
    options: ['Chào buổi tối', 'Chào buổi sáng', 'Chào buổi chiều', 'Tạm biệt'],
  },
];

// Generate quiz data based on lesson
const generateQuizData = (lessonId) => {
  const lessonQuizzes = {
    1: [
      {
        id: 1,
        japanese: 'こんにちは',
        romanji: 'konnichiwa',
        correctAnswer: 'Xin chào',
        options: ['Xin chào', 'Tạm biệt', 'Rất vui được gặp bạn', 'Hẹn gặp lại'],
      },
      {
        id: 2,
        japanese: 'はじめまして',
        romanji: 'hajimemashite',
        correctAnswer: 'Rất vui được gặp bạn',
        options: ['Xin chào', 'Tạm biệt', 'Rất vui được gặp bạn', 'Hẹn gặp lại'],
      },
      {
        id: 3,
        japanese: 'わたし',
        romanji: 'watashi',
        correctAnswer: 'Tôi',
        options: ['Bạn', 'Tôi', 'Anh ấy', 'Cô ấy'],
      },
      {
        id: 4,
        japanese: 'なまえ',
        romanji: 'namae',
        correctAnswer: 'Tên',
        options: ['Tên', 'Tuổi', 'Công việc', 'Quê quán'],
      },
    ],
    2: [
      {
        id: 1,
        japanese: 'いち',
        romanji: 'ichi',
        correctAnswer: 'Một',
        options: ['Một', 'Hai', 'Ba', 'Bốn'],
      },
      {
        id: 2,
        japanese: 'に',
        romanji: 'ni',
        correctAnswer: 'Hai',
        options: ['Một', 'Hai', 'Ba', 'Bốn'],
      },
      {
        id: 3,
        japanese: 'じかん',
        romanji: 'jikan',
        correctAnswer: 'Thời gian',
        options: ['Thời gian', 'Số đếm', 'Ngày', 'Tháng'],
      },
    ],
    3: [
      {
        id: 1,
        japanese: 'かぞく',
        romanji: 'kazoku',
        correctAnswer: 'Gia đình',
        options: ['Gia đình', 'Bạn bè', 'Đồng nghiệp', 'Người thân'],
      },
      {
        id: 2,
        japanese: 'おとうさん',
        romanji: 'otousan',
        correctAnswer: 'Bố',
        options: ['Mẹ', 'Bố', 'Anh trai', 'Em gái'],
      },
    ],
  };

  return lessonQuizzes[lessonId] || quizData;
};

function QuizScreen(props) {
  const { navigation, route } = props;
  const { lessonTitle = 'Quiz', lessonId = 1, practiceType = 'Trắc nghiệm' } = route.params || {};

  // Get quiz questions based on lesson
  const quizQuestions = generateQuizData(lessonId);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
  const [isLoading, setIsLoading] = useState(true);

  // Animation values
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const currentQuestion = quizQuestions[currentQuestionIndex];
  const totalQuestions = quizQuestions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Loading effect
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      if (!showResult && timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      } else if (timeLeft === 0 && !showResult) {
        // Time's up - auto select wrong answer
        handleAnswerSelect(null);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showResult]);

  // Progress animation
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, [progress]);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(30);
    setShowResult(false);
    setSelectedAnswer(null);

    // Fade in animation for new question
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentQuestionIndex]);

  const handleAnswerSelect = (answer) => {
    if (showResult) return;

    setSelectedAnswer(answer);
    setShowResult(true);

    const isCorrect = answer === currentQuestion.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
    }

    // Animate selection feedback
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto advance to next question after 2 seconds
    setTimeout(() => {
      if (currentQuestionIndex < totalQuestions - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz completed - navigate to completion screen
        showQuizCompletion();
      }
    }, 2000);
  };

  const showQuizCompletion = () => {
    const accuracy = Math.round((score / totalQuestions) * 100);

    navigation.navigate('QuizCompletion', {
      score,
      totalQuestions,
      accuracy,
      lessonTitle,
      wrongAnswers: totalQuestions - score,
    });
  };

  const getOptionStyle = (option) => {
    if (!showResult) {
      return styles.optionButton;
    }

    if (option === currentQuestion.correctAnswer) {
      return [styles.optionButton, styles.correctOption];
    }

    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return [styles.optionButton, styles.wrongOption];
    }

    return [styles.optionButton, styles.disabledOption];
  };

  const getOptionIcon = (option) => {
    if (!showResult) return null;

    if (option === currentQuestion.correctAnswer) {
      return <Check size={24} color="#10B981" />;
    }

    if (option === selectedAnswer && option !== currentQuestion.correctAnswer) {
      return <X size={24} color="#EF4444" />;
    }

    return null;
  };

  const getTimerColor = () => {
    if (timeLeft > 20) return '#10B981';
    if (timeLeft > 10) return '#F59E0B';
    return '#EF4444';
  };

  // Show loading screen first
  if (isLoading) {
    return (
      <LoadingScreen
        onComplete={() => setIsLoading(false)}
        title="Đang chuẩn bị quiz"
        subtitle="Sẵn sàng thử thách chưa?"
      />
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <Animated.View
                style={[
                  styles.progressFill,
                  {
                    width: progressAnim.interpolate({
                      inputRange: [0, 100],
                      outputRange: ['0%', '100%'],
                      extrapolate: 'clamp',
                    }),
                  },
                ]}
              />
            </View>
          </View>

          {/* Timer */}
          <View style={[styles.timerContainer, { backgroundColor: getTimerColor() }]}>
            <Text style={styles.timerText}>{timeLeft}</Text>
          </View>
        </View>

        {/* Question Counter */}
        <View style={styles.questionCounter}>
          <Text style={styles.questionCounterText}>
            Câu {currentQuestionIndex + 1}/{totalQuestions}
          </Text>
        </View>
      </LinearGradient>

      {/* Content */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Question Title */}
        <View style={styles.questionTitleContainer}>
          <Text style={styles.questionTitle}>Chọn đáp án đúng</Text>
        </View>

        {/* Question */}
        <View style={styles.questionContainer}>
          <Text style={styles.questionJapanese}>{currentQuestion.japanese}</Text>
          <Text style={styles.questionRomanji}>{currentQuestion.romanji}</Text>
        </View>

        {/* Answer Options */}
        <Animated.View style={[styles.optionsContainer, { transform: [{ scale: scaleAnim }] }]}>
          {currentQuestion.options.map((option, index) => {
            const icon = getOptionIcon(option);
            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleAnswerSelect(option)}
                style={getOptionStyle(option)}
                disabled={showResult}
                activeOpacity={0.8}
              >
                <View style={styles.optionContent}>
                  <Text style={styles.optionText}>{option}</Text>
                  {icon && <View style={styles.optionIcon}>{icon}</View>}
                </View>
              </TouchableOpacity>
            );
          })}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizScreen);
