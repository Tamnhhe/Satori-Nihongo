import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './flashcard-list-screen.styles';

// Mock flashcard data - should come from API
const mockFlashcardData = {
  vocabulary: [
    { japanese: 'こんにちは', meaning: 'Xin chào', furigana: 'こんにちは' },
    { japanese: 'ありがとう', meaning: 'Cảm ơn', furigana: 'ありがとう' },
    { japanese: 'さようなら', meaning: 'Tạm biệt', furigana: 'さようなら' },
    { japanese: 'おはよう', meaning: 'Chào buổi sáng', furigana: 'おはよう' },
    { japanese: 'すみません', meaning: 'Xin lỗi', furigana: 'すみません' },
  ],
};

function FlashcardListScreen(props) {
  const { navigation, route } = props;
  const { lessonId, practiceType, lessonTitle } = route.params || {};

  console.debug('FlashcardListScreen loaded with params:', { lessonId, practiceType, lessonTitle });

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flashcards, setFlashcards] = useState(mockFlashcardData.vocabulary);

  useFocusEffect(
    React.useCallback(() => {
      loadFlashcards();
    }, [lessonId])
  );

  const loadFlashcards = async () => {
    try {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setFlashcards(mockFlashcardData.vocabulary);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error loading flashcards:', error);
      Alert.alert('Lỗi', 'Không thể tải flashcards. Sử dụng dữ liệu mẫu.');
      setFlashcards(mockFlashcardData.vocabulary);
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadFlashcards();
    setRefreshing(false);
  };

  const handlePracticeMode = (mode) => {
    switch (mode) {
      case 'flashcard':
        navigation.navigate('Flashcard', {
          flashcards,
          lessonTitle,
          mode: 'flashcard',
        });
        break;
      case 'quiz':
        navigation.navigate('Quiz', {
          lessonId,
          lessonTitle,
          practiceType: 'Trắc nghiệm',
          flashcards,
        });
        break;
      case 'test':
        Alert.alert('Đang phát triển', 'Chế độ Test sẽ được cập nhật sớm!');
        break;
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const goToNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Đang tải flashcards...</Text>
      </View>
    );
  }

  if (!flashcards || flashcards.length === 0) {
    return (
      <View style={styles.container}>
        {/* Header */}
        <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>{lessonTitle || 'Từ vựng'}</Text>
              <Text style={styles.headerSubtitle}>Flashcards</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Chưa có flashcards</Text>
          <Text style={styles.emptyDescription}>
            Không có từ vựng nào được tìm thấy cho bài học này
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadFlashcards}>
            <RotateCcw size={16} color="#3B82F6" />
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const currentCard = flashcards[currentIndex];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <ArrowLeft size={24} color="#ffffff" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>{lessonTitle || 'Từ vựng'}</Text>
              <Text style={styles.headerSubtitle}>{flashcards.length} flashcards</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Flashcard Preview */}
        <View style={styles.previewContainer}>
          <Text style={styles.previewTitle}>Xem trước</Text>

          <View style={styles.flashcardPreview}>
            <Text style={styles.previewJapanese}>{currentCard.japanese}</Text>
            <Text style={styles.previewFurigana}>{currentCard.furigana}</Text>
            <View style={styles.divider} />
            <Text style={styles.previewMeaning}>{currentCard.meaning}</Text>
          </View>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressDots}>
              {flashcards.map((_, index) => (
                <View
                  key={index}
                  style={[styles.progressDot, index === currentIndex && styles.progressDotActive]}
                />
              ))}
            </View>
            <Text style={styles.progressText}>
              {currentIndex + 1}/{flashcards.length}
            </Text>
          </View>

          {/* Navigation */}
          <View style={styles.navigationContainer}>
            <TouchableOpacity
              style={[styles.navButton, currentIndex === 0 && styles.navButtonDisabled]}
              onPress={goToPrevious}
              disabled={currentIndex === 0}
            >
              <ArrowLeft size={20} color={currentIndex === 0 ? '#9CA3AF' : '#3B82F6'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.navButton,
                currentIndex === flashcards.length - 1 && styles.navButtonDisabled,
              ]}
              onPress={goToNext}
              disabled={currentIndex === flashcards.length - 1}
            >
              <ArrowRight
                size={20}
                color={currentIndex === flashcards.length - 1 ? '#9CA3AF' : '#3B82F6'}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Practice Modes */}
        <View style={styles.practiceModesContainer}>
          <Text style={styles.practiceTitle}>Chọn chế độ luyện tập</Text>

          <TouchableOpacity
            style={styles.practiceModeCard}
            onPress={() => handlePracticeMode('flashcard')}
          >
            <View style={styles.modeIcon}>
              <Text style={styles.modeIconText}>🧠</Text>
            </View>
            <View style={styles.modeContent}>
              <Text style={styles.modeTitle}>Thẻ ghi nhớ</Text>
              <Text style={styles.modeDescription}>Học từ vựng với thẻ flashcard tương tác</Text>
            </View>
            <ArrowRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.practiceModeCard}
            onPress={() => handlePracticeMode('quiz')}
          >
            <View style={styles.modeIcon}>
              <Text style={styles.modeIconText}>❓</Text>
            </View>
            <View style={styles.modeContent}>
              <Text style={styles.modeTitle}>Quiz</Text>
              <Text style={styles.modeDescription}>Trả lời câu hỏi trắc nghiệm về từ vựng</Text>
            </View>
            <ArrowRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.practiceModeCard}
            onPress={() => handlePracticeMode('test')}
          >
            <View style={styles.modeIcon}>
              <Text style={styles.modeIconText}>📝</Text>
            </View>
            <View style={styles.modeContent}>
              <Text style={styles.modeTitle}>Kiểm tra</Text>
              <Text style={styles.modeDescription}>
                Kiểm tra khả năng ghi nhớ từ vựng toàn diện
              </Text>
            </View>
            <ArrowRight size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(FlashcardListScreen);
