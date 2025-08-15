import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { ArrowLeft, RotateCcw, Home, Trophy, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './flashcard-completion-screen.styles';

const { width: screenWidth } = Dimensions.get('window');

function FlashcardCompletionScreen(props) {
  const { navigation, route } = props;
  const {
    correctCount = 0,
    wrongCount = 0,
    totalCards = 0,
    lessonTitle = 'Flashcard',
    accuracy = 0,
  } = route.params || {};

  // Animation refs
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

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
      Animated.timing(progressAnim, {
        toValue: accuracy,
        duration: 1500,
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  const handleRestart = () => {
    // Navigate back to FlashcardScreen with restart flag
    navigation.navigate('Flashcard', {
      ...route.params,
      restart: true,
    });
  };

  const handleHome = () => {
    // Navigate to main Home tab
    navigation.navigate('Home');
  };

  const handleBackToList = () => {
    // Go back to FlashcardList
    navigation.goBack();
    navigation.goBack();
  };

  const getPerformanceMessage = (accuracy) => {
    if (accuracy >= 90) return { message: 'Xuất sắc!', icon: '🏆', color: '#10B981' };
    if (accuracy >= 80) return { message: 'Tốt lắm!', icon: '⭐', color: '#3B82F6' };
    if (accuracy >= 70) return { message: 'Khá tốt!', icon: '👍', color: '#F59E0B' };
    if (accuracy >= 50) return { message: 'Cần cải thiện', icon: '💪', color: '#F97316' };
    return { message: 'Hãy thử lại!', icon: '📚', color: '#EF4444' };
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
          <Text style={styles.headerTitle}>Hoàn thành!</Text>
          <View style={styles.placeholder} />
        </View>
      </LinearGradient>

      {/* Content */}
      <View style={styles.content}>
        {/* Trophy Icon */}
        <Animated.View style={[styles.trophyContainer, { transform: [{ scale: scaleAnim }] }]}>
          <View style={[styles.trophyBackground, { backgroundColor: performance.color + '20' }]}>
            <Text style={styles.trophyIcon}>{performance.icon}</Text>
          </View>
        </Animated.View>

        {/* Success Message */}
        <Animated.View style={[styles.messageContainer, { transform: [{ scale: scaleAnim }] }]}>
          <Text style={styles.congratsText}>Chúc mừng!</Text>
          <Text style={[styles.performanceText, { color: performance.color }]}>
            {performance.message}
          </Text>
          <Text style={styles.lessonTitle}>Bạn đã hoàn thành {lessonTitle}</Text>
        </Animated.View>

        {/* Statistics */}
        <View style={styles.statsContainer}>
          <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={styles.statNumber}>{totalCards}</Text>
            <Text style={styles.statLabel}>Tổng thẻ</Text>
          </Animated.View>
          <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>{correctCount}</Text>
            <Text style={styles.statLabel}>Đúng</Text>
          </Animated.View>
          <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={[styles.statNumber, { color: '#EF4444' }]}>{wrongCount}</Text>
            <Text style={styles.statLabel}>Sai</Text>
          </Animated.View>
          <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
            <Text style={[styles.statNumber, { color: performance.color }]}>{accuracy}%</Text>
            <Text style={styles.statLabel}>Độ chính xác</Text>
          </Animated.View>
        </View>

        {/* Progress Ring */}
        <View style={styles.progressRingContainer}>
          <View style={styles.progressRing}>
            <Animated.Text style={styles.progressText}>
              {progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', `${accuracy}%`],
                extrapolate: 'clamp',
              })}
            </Animated.Text>
          </View>
        </View>

        {/* Motivational Message */}
        <View style={styles.motivationContainer}>
          {accuracy >= 80 ? (
            <Text style={styles.motivationText}>
              Bạn đã nắm vững từ vựng này! Hãy tiếp tục với bài học tiếp theo.
            </Text>
          ) : (
            <Text style={styles.motivationText}>
              Đừng nản lòng! Hãy luyện tập thêm để cải thiện kết quả.
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
          <Text style={styles.actionText}>Học lại</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(FlashcardCompletionScreen);
