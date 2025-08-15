import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
  TextInput,
  Animated,
} from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { Bell, Search, ChevronDown, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import styles from './practice-screen.styles';

const practiceData = [
  {
    id: 1,
    title: 'Bài 1',
    description: 'Giới thiệu bản thân',
    isExpanded: true,
    items: [
      {
        type: 'Từ vựng',
        count: '24 từ vựng',
      },
      {
        type: 'Ngữ pháp',
        count: '',
      },
    ],
  },
  {
    id: 2,
    title: 'Bài 2',
    description: 'Số đếm và thời gian',
    isExpanded: false,
    items: [
      {
        type: 'Từ vựng',
        count: '18 từ vựng',
      },
      {
        type: 'Ngữ pháp',
        count: '5 cấu trúc',
      },
    ],
  },
  {
    id: 3,
    title: 'Bài 3',
    description: 'Gia đình và người thân',
    isExpanded: false,
    items: [
      {
        type: 'Từ vựng',
        count: '20 từ vựng',
      },
      {
        type: 'Ngữ pháp',
        count: '3 cấu trúc',
      },
    ],
  },
  {
    id: 4,
    title: 'Bài 4',
    description: 'Đi mua sắm',
    isExpanded: false,
    items: [
      {
        type: 'Từ vựng',
        count: '15 từ vựng',
      },
      {
        type: 'Ngữ pháp',
        count: '4 cấu trúc',
      },
    ],
  },
  {
    id: 5,
    title: 'Bài 5',
    description: 'Ăn uống',
    isExpanded: false,
    items: [
      {
        type: 'Từ vựng',
        count: '22 từ vựng',
      },
      {
        type: 'Ngữ pháp',
        count: '6 cấu trúc',
      },
    ],
  },
  {
    id: 6,
    title: 'Bài 6',
    description: 'Giao thông và di chuyển',
    isExpanded: false,
    items: [
      {
        type: 'Từ vựng',
        count: '16 từ vựng',
      },
      {
        type: 'Ngữ pháp',
        count: '5 cấu trúc',
      },
    ],
  },
];

function PracticeScreen(props) {
  const { navigation } = props;
  const [lessons, setLessons] = useState(practiceData);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const toggleLesson = (id) => {
    setLessons(
      lessons.map((lesson) =>
        lesson.id === id ? { ...lesson, isExpanded: !lesson.isExpanded } : lesson
      )
    );
  };

  const handleItemPress = (lesson, item) => {
    console.debug('Practice item pressed:', lesson.title, item.type);

    // Direct navigation for vocabulary
    if (item.type === 'Từ vựng') {
      startPractice(lesson, item);
      return;
    }

    Alert.alert(
      `${item.type} - ${lesson.title}`,
      `Bắt đầu luyện tập ${item.type.toLowerCase()} cho ${lesson.title}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { text: 'Bắt đầu', onPress: () => startPractice(lesson, item) },
      ]
    );
  };

  const startPractice = (lesson, item) => {
    // Navigate to appropriate screen based on practice type
    console.debug('Starting practice:', lesson.title, item.type);
    console.debug('Navigation available:', navigation);

    const itemType = item.type?.trim();

    if (itemType === 'Từ vựng') {
      console.debug('Navigating to FlashcardList...');
      try {
        // Navigate to the main stack FlashcardList screen (outside tabs)
        navigation.getParent()?.navigate('FlashcardList', {
          lessonId: lesson.id,
          practiceType: itemType,
          lessonTitle: lesson.title,
        });
      } catch (error) {
        console.error('Navigation error:', error);
        Alert.alert('Lỗi', 'Không thể điều hướng đến màn hình flashcard');
      }
    } else {
      console.debug('Navigating to PracticeDetail...');
      navigation.navigate('PracticeDetail', {
        lessonId: lesson.id,
        practiceType: itemType,
        lessonTitle: lesson.title,
      });
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate loading
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  // Filter lessons based on search query
  const filteredLessons = lessons.filter(
    (lesson) =>
      lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Đang tải bài luyện tập...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Luyện tập 🧩</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search size={20} color="#9CA3AF" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm bài học"
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Title */}
        <Text style={styles.courseTitle}>Tiếng Nhật N5</Text>

        {/* Lessons List */}
        <View style={styles.lessonsContainer}>
          {filteredLessons.map((lesson) => (
            <View key={lesson.id} style={styles.lessonCard}>
              {/* Lesson Header */}
              <TouchableOpacity
                style={styles.lessonHeader}
                onPress={() => toggleLesson(lesson.id)}
                activeOpacity={0.7}
              >
                <View style={styles.lessonHeaderLeft}>
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>
                  <Text style={styles.lessonDescription}>{lesson.description}</Text>
                </View>
                <Animated.View
                  style={[{ transform: [{ rotate: lesson.isExpanded ? '180deg' : '0deg' }] }]}
                >
                  <ChevronDown size={20} color="#9CA3AF" />
                </Animated.View>
              </TouchableOpacity>

              {/* Expanded Content */}
              {lesson.isExpanded && lesson.items.length > 0 && (
                <View style={styles.expandedContent}>
                  {lesson.items.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.practiceItem}
                      onPress={() => handleItemPress(lesson, item)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.practiceItemLeft}>
                        <Text style={styles.practiceItemType}>{item.type}</Text>
                        {item.count && <Text style={styles.practiceItemCount}>{item.count}</Text>}
                      </View>
                      <ChevronRight size={20} color="#3B82F6" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}
        </View>

        {/* No results message */}
        {filteredLessons.length === 0 && searchQuery && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Không tìm thấy kết quả</Text>
            <Text style={styles.emptyDescription}>
              Không có bài học nào phù hợp với từ khóa "{searchQuery}"
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state) => ({
  // Add practice-related state here if needed
});

const mapDispatchToProps = (dispatch) => ({
  // Add practice-related actions here if needed
});

export default connect(mapStateToProps, mapDispatchToProps)(PracticeScreen);
