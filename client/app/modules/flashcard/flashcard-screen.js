import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Alert,
  PanResponder,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { ArrowLeft, RotateCw, X, Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LoadingScreen from '../../shared/components/loading-screen';
import styles from './flashcard-screen.styles';

const { width: screenWidth } = Dimensions.get('window');

function FlashcardScreen(props) {
  const { navigation, route } = props;
  const {
    flashcards = [],
    lessonTitle = 'Flashcard',
    mode = 'flashcard',
    restart = false,
  } = route.params || {};

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Animation values
  const flipAnimation = useState(new Animated.Value(0))[0];
  const swipeAnimation = useState(new Animated.Value(0))[0];
  const scaleAnimation = useState(new Animated.Value(1))[0];

  // Loading effect
  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (flashcards.length === 0) {
      Alert.alert('Lỗi', 'Không có flashcards để hiển thị', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    }
  }, [flashcards]);

  // Handle restart from completion screen
  useEffect(() => {
    if (restart) {
      resetSession();
    }
  }, [restart]);

  // Pan responder for swipe gestures
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (evt, gestureState) => {
      return Math.abs(gestureState.dx) > 20 || Math.abs(gestureState.dy) > 20;
    },
    onPanResponderGrant: () => {
      swipeAnimation.setOffset(swipeAnimation._value);
    },
    onPanResponderMove: (evt, gestureState) => {
      swipeAnimation.setValue(gestureState.dx);

      // Scale animation based on swipe distance
      const scale = Math.max(0.9, 1 - (Math.abs(gestureState.dx) / screenWidth) * 0.1);
      scaleAnimation.setValue(scale);
    },
    onPanResponderRelease: (evt, gestureState) => {
      swipeAnimation.flattenOffset();

      const threshold = screenWidth * 0.3;

      if (gestureState.dx > threshold) {
        // Swipe right - correct
        handleCorrect();
      } else if (gestureState.dx < -threshold) {
        // Swipe left - wrong
        handleWrong();
      } else {
        // Return to center
        Animated.parallel([
          Animated.spring(swipeAnimation, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.spring(scaleAnimation, {
            toValue: 1,
            useNativeDriver: true,
          }),
        ]).start();
      }
    },
  });

  const handleFlip = () => {
    console.debug('Flipping card, current state:', isFlipped);
    setIsFlipped(!isFlipped);
  };

  const handleCorrect = () => {
    setCorrectCount(correctCount + 1);
    nextCard();
  };

  const handleWrong = () => {
    setWrongCount(wrongCount + 1);
    nextCard();
  };

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      // Animate to next card
      Animated.sequence([
        Animated.timing(swipeAnimation, {
          toValue: screenWidth,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(swipeAnimation, {
          toValue: 0,
          duration: 0,
          useNativeDriver: true,
        }),
      ]).start();

      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
      flipAnimation.setValue(0);
      scaleAnimation.setValue(1);
    } else {
      // Show completion
      showCompletion();
    }
  };

  const showCompletion = () => {
    const accuracy = Math.round((correctCount / (correctCount + wrongCount)) * 100) || 0;
    const totalCards = flashcards.length;

    // Navigate to completion screen instead of showing alert
    navigation.navigate('FlashcardCompletion', {
      correctCount,
      wrongCount,
      totalCards,
      accuracy,
      lessonTitle: route.params?.lessonTitle || 'Flashcard',
    });
  };

  const resetSession = () => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setCorrectCount(0);
    setWrongCount(0);
    flipAnimation.setValue(0);
    swipeAnimation.setValue(0);
    scaleAnimation.setValue(1);
  };

  if (flashcards.length === 0) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Flashcard</Text>
          </View>
        </LinearGradient>
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Không có flashcards để hiển thị</Text>
        </View>
      </View>
    );
  }

  const currentCard = flashcards[currentIndex];
  const progress = ((currentIndex + 1) / flashcards.length) * 100;

  // Animation interpolations
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });

  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['180deg', '360deg'],
  });

  const frontOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [1, 0, 0],
  });

  const backOpacity = flipAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  // Show loading screen first
  if (isLoading) {
    return (
      <LoadingScreen
        onComplete={() => setIsLoading(false)}
        title="Đang chuẩn bị flashcards"
        subtitle="Vui lòng chờ một chút..."
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
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>{lessonTitle}</Text>
            <Text style={styles.headerSubtitle}>
              {currentIndex + 1}/{flashcards.length}
            </Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{correctCount}</Text>
            <Text style={styles.statLabel}>Đúng</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{wrongCount}</Text>
            <Text style={styles.statLabel}>Sai</Text>
          </View>
        </View>
      </LinearGradient>

      {/* Flashcard Container */}
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.cardTouchArea} activeOpacity={0.9} onPress={handleFlip}>
          <Animated.View
            style={[
              styles.card,
              {
                transform: [{ translateX: swipeAnimation }, { scale: scaleAnimation }],
              },
            ]}
            {...panResponder.panHandlers}
          >
            {/* Front Side - Japanese */}
            {!isFlipped && (
              <Animated.View style={[styles.cardSide, styles.cardFront]}>
                <TouchableOpacity
                  style={styles.cardContent}
                  activeOpacity={0.9}
                  onPress={handleFlip}
                >
                  <Text style={styles.cardJapanese}>{currentCard.japanese}</Text>
                  <Text style={styles.cardFurigana}>{currentCard.furigana}</Text>
                  <Text style={styles.tapToFlipHint}>Chạm để lật thẻ</Text>
                </TouchableOpacity>
              </Animated.View>
            )}

            {/* Back Side - Meaning */}
            {isFlipped && (
              <Animated.View style={[styles.cardSide, styles.cardBack]}>
                <TouchableOpacity
                  style={styles.cardContent}
                  activeOpacity={0.9}
                  onPress={handleFlip}
                >
                  <Text style={styles.cardMeaning}>{currentCard.meaning}</Text>
                  <Text style={styles.tapToFlipHint}>Chạm để lật lại</Text>
                </TouchableOpacity>
              </Animated.View>
            )}
          </Animated.View>
        </TouchableOpacity>

        {/* Instructions */}
        <Text style={styles.instructionText}>
          {!isFlipped ? 'Chạm vào thẻ để xem nghĩa' : 'Bạn có nhớ được từ này không?'}
        </Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionContainer}>
        <TouchableOpacity style={[styles.actionButton, styles.wrongButton]} onPress={handleWrong}>
          <X size={28} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.flipButton]} onPress={handleFlip}>
          <RotateCw size={32} color="#ffffff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.correctButton]}
          onPress={handleCorrect}
        >
          <Check size={28} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FlashcardScreen);
