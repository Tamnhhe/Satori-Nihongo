import React, { useState, useCallback, useEffect } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { Text, useTheme, Snackbar } from 'react-native-paper';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import LessonActions from '../entities/lesson/lesson.reducer';
import LessonList from '../../shared/components/lesson/lesson-list';
import { mockLessons } from '../../shared/data/mock-data';
import styles from './my-lesson-screen.styles';

function MyLessonScreen(props) {
  const { lessonList, fetching, error, getAllLessons, navigation, links, totalItems } = props;

  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Transform backend data to match component expectations
  const transformLessonData = (lessons) => {
    if (!Array.isArray(lessons)) {
      return [];
    }

    return lessons.map((lesson) => ({
      id: lesson.id,
      title: lesson.title || 'Chưa có tiêu đề',
      content: lesson.content || '',
      videoUrl: lesson.videoUrl,
      slideUrl: lesson.slideUrl,
      course: lesson.course
        ? {
            id: lesson.course.id,
            name: lesson.course.name || 'Khóa học',
            description: lesson.course.description,
          }
        : {
            id: 0,
            name: 'Khóa học chung',
            description: '',
          },
      // Add mock progress and bookmark for now since backend doesn't have these yet
      progress: Math.floor(Math.random() * 100),
      isBookmarked: Math.random() > 0.7,
      isCompleted: Math.random() > 0.5,
      status: Math.random() > 0.5 ? 'completed' : 'in-progress',
    }));
  };

  // Use backend data if available, fallback to mock data
  const displayLessons =
    lessonList && lessonList.length > 0 ? transformLessonData(lessonList) : mockLessons;

  const loadLessons = useCallback(
    (pageNumber = 0, append = false) => {
      console.debug(`Loading lessons from backend - page: ${pageNumber}, append: ${append}`);

      if (append) {
        setLoadingMore(true);
      }

      const options = {
        page: pageNumber,
        size: 20,
        sort: 'id,desc',
      };

      getAllLessons(options);
    },
    [getAllLessons]
  );

  // Handle loading more lessons for pagination
  const loadMoreLessons = useCallback(() => {
    if (!fetching && !loadingMore && links && links.next > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadLessons(nextPage, true);
    }
  }, [fetching, loadingMore, links, page, loadLessons]);

  // Show error message when API call fails
  useEffect(() => {
    if (error) {
      setShowError(true);
      setRefreshing(false);
      setLoadingMore(false);
      console.error('Error loading lessons from backend:', error);
    }
  }, [error]);

  // Hide loading indicators when fetch completes
  useEffect(() => {
    if (!fetching) {
      setRefreshing(false);
      setLoadingMore(false);
    }
  }, [fetching]);

  // Load lessons when screen is focused
  useFocusEffect(
    useCallback(() => {
      console.debug('MyLesson screen focused, loading lessons from backend API');
      setPage(0);
      setShowError(false);
      loadLessons(0, false);
    }, [loadLessons])
  );

  const handleRefresh = useCallback(() => {
    console.debug('Refreshing lessons from backend');
    setRefreshing(true);
    setPage(0);
    setShowError(false);
    loadLessons(0, false);
  }, [loadLessons]);

  const handleLessonPress = useCallback(
    (lesson) => {
      console.debug('Lesson pressed:', lesson.title);
      // Navigate to lesson detail screen
      navigation.navigate('LessonDetail', { lessonId: lesson.id });
    },
    [navigation]
  );

  const handleVideoPress = useCallback(
    (lesson) => {
      console.debug('Video pressed for lesson:', lesson.title);
      if (lesson.videoUrl) {
        // Navigate to video player
        navigation.navigate('VideoPlayer', {
          videoUrl: lesson.videoUrl,
          lessonTitle: lesson.title,
        });
      } else {
        Alert.alert('Thông báo', 'Video chưa sẵn sàng cho bài học này');
      }
    },
    [navigation]
  );

  const handleSlidePress = useCallback(
    (lesson) => {
      console.debug('Slide pressed for lesson:', lesson.title);
      if (lesson.slideUrl) {
        // Navigate to slide viewer or web browser
        navigation.navigate('SlideViewer', {
          slideUrl: lesson.slideUrl,
          lessonTitle: lesson.title,
        });
      } else {
        Alert.alert('Thông báo', 'Slide chưa sẵn sàng cho bài học này');
      }
    },
    [navigation]
  );

  const handleBookmark = useCallback((lessonId) => {
    console.debug('Bookmark toggled for lesson:', lessonId);
    // TODO: Implement bookmark API call to backend
    Alert.alert('Thông báo', 'Tính năng bookmark sẽ được kết nối với backend sau');
  }, []);

  // Show loading state for initial load
  if (fetching && !refreshing && !loadingMore && displayLessons.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.onBackground }]}>
          Đang tải bài học từ server...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LessonList
        lessons={displayLessons}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCourse={selectedCourse}
        onCourseFilterChange={setSelectedCourse}
        onLessonPress={handleLessonPress}
        onVideoPress={handleVideoPress}
        onSlidePress={handleSlidePress}
        onBookmark={handleBookmark}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onLoadMore={loadMoreLessons}
        loading={loadingMore}
        totalItems={totalItems}
      />

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        duration={4000}
        action={{
          label: 'Thử lại',
          onPress: () => {
            setShowError(false);
            handleRefresh();
          },
        }}
      >
        {error ? `Lỗi tải bài học: ${error}` : 'Có lỗi xảy ra khi tải dữ liệu từ server'}
      </Snackbar>
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    lessonList: state.lessons.lessonList,
    fetching: state.lessons.fetchingAll,
    error: state.lessons.errorAll,
    links: state.lessons.links,
    totalItems: state.lessons.totalItems,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllLessons: (options) => dispatch(LessonActions.lessonAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyLessonScreen);
