import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { ArrowLeft, RotateCcw, Home, Trophy, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './quiz-completion-screen.styles';

const { width: screenWidth } = Dimensions.get('window');

function QuizCompletionScreen(props) {
  const { navigation, route } = props;
  const {
    score = 0,
    totalQuestions = 0,
    wrongAnswers = 0,
    lessonTitle = 'Quiz',
    accuracy = 0,
  } = route.params || {};

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scoreCountAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Start entrance animations
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(scoreCountAnim, {
        toValue: score,
        duration: 2000,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handleRestart = () => {
    // Navigate back to Quiz with restart flag
    navigation.navigate('Quiz', {
      ...route.params,
      restart: true,
    });
  };

  const handleHome = () => {
    // Navigate to main Home tab
    navigation.navigate('Home');
  };

  const getPerformanceMessage = (accuracy) => {
    if (accuracy >= 90) return { message: 'Hoàn hảo!', icon: '🏆', color: '#10B981' };
    if (accuracy >= 80) return { message: 'Tuyệt vời!', icon: '⭐', color: '#3B82F6' };
    if (accuracy >= 70) return { message: 'Tốt lắm!', icon: '👍', color: '#F59E0B' };
    if (accuracy >= 50) return { message: 'Khá ổn!', icon: '💪', color: '#F97316' };
    return { message: 'Cần luyện tập!', icon: '📚', color: '#EF4444' };
  };

  const performance = getPerformanceMessage(accuracy);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Header */}
      <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <ArrowLeft size={24} color="#ffffff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Kết quả Quiz</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {/* Performance Icon */}
        <Animated.View style={[styles.performanceContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View
            style={[styles.performanceBackground, { backgroundColor: performance.color + '20' }]}
          >
            <Text style={styles.performanceIcon}>{performance.icon}</Text>
          </View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={[styles.messageContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.congratsText}>Quiz hoàn thành!</Text>
          <Text style={[styles.performanceText, { color: performance.color }]}>
            {performance.message}
          </Text>
          <Text style={styles.lessonTitle}>{lessonTitle}</Text>
        </Animated.View>

        {/* Score Display */}
        <View style={styles.scoreContainer}>
          <View style={styles.scoreCircle}>
            <Animated.Text style={styles.scoreNumber}>
              {scoreCountAnim.interpolate({
                inputRange: [0, totalQuestions],
                outputRange: ['0', score.toString()],
                extrapolate: 'clamp',
              })}
            </Animated.Text>
            <Text style={styles.scoreDivider}>/{totalQuestions}</Text>
            <Text style={styles.scoreLabel}>Điểm</Text>
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
            <Target size={24} color="#3B82F6" />
            <Text style={styles.statNumber}>{totalQuestions}</Text>
            <Text style={styles.statLabel}>Tổng câu</Text>
          </Animated.View>

          <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.correctIcon}>
              <Text style={styles.correctIconText}>✓</Text>
            </View>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{score}</Text>
            <Text style={styles.statLabel}>Đúng</Text>
          </Animated.View>

          <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
            <View style={styles.wrongIcon}>
              <Text style={styles.wrongIconText}>✗</Text>
            </View>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>{wrongAnswers}</Text>
            <Text style={styles.statLabel}>Sai</Text>
          </Animated.View>

          <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
            <Trophy size={24} color={performance.color} />
            <Text style={[styles.statNumber, { color: performance.color }]}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Chính xác</Text>
          </Animated.View>
        </View>

        {/* Motivational Message */}
        <View style={styles.motivationContainer}>
          {accuracy >= 80 ? (
            <Text style={styles.motivationText}>
              Xuất sắc! Bạn đã nắm vững kiến thức rất tốt. Hãy tiếp tục phát huy!
            </Text>
          ) : accuracy >= 60 ? (
            <Text style={styles.motivationText}>
              Khá tốt! Còn một chút nữa là bạn sẽ hoàn hảo. Hãy luyện tập thêm nhé!
            </Text>
          ) : (
            <Text style={styles.motivationText}>
              Đừng nản lòng! Mọi người đều phải bắt đầu từ đâu đó. Hãy thử lại!
            </Text>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.restartButton]}
          onPress={handleRestart}
        >
          <RotateCcw size={24} color="#ffffff" />
          <Text style={styles.actionText}>Làm lại</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.homeButton]} onPress={handleHome}>
          <Home size={24} color="#ffffff" />
          <Text style={styles.actionText}>Trang chủ</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizCompletionScreen);
