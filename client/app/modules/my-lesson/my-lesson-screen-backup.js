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
  const {
    lessonList,
    fetching,
    error,
    getAllLessons,
    navigation,
    links,
    totalItems
  } = props;

  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  // Transform backend data to match component expectations
  const transformLessonData = (lessons) => {
    return lessons.map(lesson => ({
      id: lesson.id,
      title: lesson.title,
      content: lesson.content,
      videoUrl: lesson.videoUrl,
      slideUrl: lesson.slideUrl,
      course: lesson.course ? {
        id: lesson.course.id,
        name: lesson.course.name,
        description: lesson.course.description
      } : null,
      // Add mock progress and bookmark for now since backend doesn't have these yet
      progress: Math.floor(Math.random() * 100),
      isBookmarked: Math.random() > 0.7,
      isCompleted: Math.random() > 0.5,
      status: Math.random() > 0.5 ? 'completed' : 'in-progress'
    }));
  };

  // Use backend data if available, fallback to mock data
  const displayLessons = lessonList.length > 0 
    ? transformLessonData(lessonList)
    : mockLessons;

  const loadLessons = useCallback((pageNumber = 0, append = false) => {
    console.debug(`Loading lessons - page: ${pageNumber}, append: ${append}`);
    
    if (append) {
      setLoadingMore(true);
    }
    
    const options = {
      page: pageNumber,
      size: 20,
      sort: 'id,desc'
    };
    
    getAllLessons(options);
  }, [getAllLessons]);

  // Handle loading more lessons for pagination
  const loadMoreLessons = useCallback(() => {
    if (!fetching && !loadingMore && links.next > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadLessons(nextPage, true);
    }
  }, [fetching, loadingMore, links.next, page, loadLessons]);

  // Show error message when API call fails
  useEffect(() => {
    if (error) {
      setShowError(true);
      setRefreshing(false);
      setLoadingMore(false);
      console.error('Error loading lessons:', error);
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
      console.debug('MyLesson screen focused, loading lessons from backend');
      setPage(0);
      setShowError(false);
      loadLessons(0, false);
    }, [loadLessons])
  );

  const handleRefresh = useCallback(() => {
    console.debug('Refreshing lessons');
    setRefreshing(true);
    setPage(0);
    setShowError(false);
    loadLessons(0, false);
  }, [loadLessons]);

  const handleLessonPress = useCallback((lesson) => {
    console.debug('Lesson pressed:', lesson.title);
    // Navigate to lesson detail or video player
    navigation.navigate('LessonDetail', { lessonId: lesson.id });
  }, [navigation]);

  const handleVideoPress = useCallback((lesson) => {
    console.debug('Video pressed for lesson:', lesson.title);
    if (lesson.videoUrl) {
      // Navigate to video player
      navigation.navigate('VideoPlayer', { 
        videoUrl: lesson.videoUrl, 
        lessonTitle: lesson.title 
      });
    } else {
      Alert.alert('Thông báo', 'Video chưa sẵn sàng cho bài học này');
    }
  }, [navigation]);

  const handleSlidePress = useCallback((lesson) => {
    console.debug('Slide pressed for lesson:', lesson.title);
    if (lesson.slideUrl) {
      // Navigate to slide viewer or web browser
      navigation.navigate('SlideViewer', { 
        slideUrl: lesson.slideUrl, 
        lessonTitle: lesson.title 
      });
    } else {
      Alert.alert('Thông báo', 'Slide chưa sẵn sàng cho bài học này');
    }
  }, [navigation]);

  const handleBookmark = useCallback((lessonId) => {
    console.debug('Bookmark toggled for lesson:', lessonId);
    // TODO: Implement bookmark API call to backend
    Alert.alert('Thông báo', 'Tính năng bookmark sẽ được cập nhật sau');
  }, []);

  if (fetching && !refreshing && !loadingMore && displayLessons.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator 
          size="large" 
          color={theme.colors.primary} 
        />
        <Text style={[styles.loadingText, { color: theme.colors.onBackground }]}>
          Đang tải bài học...
        </Text>
      </View>
    );
  }
    setRefreshing(true);
    setPage(0);
    loadLessons(0, false);
    setRefreshing(false);
  }, [loadLessons]);

  const handleLoadMore = useCallback(() => {
    if (!fetching && links?.next) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadLessons(nextPage, true);
    }
  }, [fetching, links, page, loadLessons]);

  const handleLessonPress = (lesson) => {
    navigation.navigate('LessonDetail', { entityId: lesson.id });
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleCourseFilter = (courseId) => {
    setSelectedCourse(courseId === selectedCourse ? null : courseId);
  };

  // Show loading on first load only if we don't have mock data to show
  if (fetching && lessonList.length === 0 && !refreshing && displayLessons.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.onBackground }]}>
          Đang tải bài học...
        </Text>
      </View>
    );
  }

  // Show error if failed to load and no cached data
  if (error && lessonList.length === 0) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Không thể tải danh sách bài học.
        </Text>
        <Text style={[styles.errorSubtext, { color: theme.colors.onSurfaceVariant }]}>
          Vui lòng thử lại sau.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <LessonList
        lessons={displayLessons}
        loading={fetching}
        onRefresh={handleRefresh}
        onLessonPress={handleLessonPress}
        onLoadMore={handleLoadMore}
        hasMore={!!links?.next}
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        selectedCourse={selectedCourse}
        onCourseFilter={handleCourseFilter}
        navigation={navigation}
      />
    </View>
  );
}

const mapStateToProps = state => {
  return {
    lessonList: state.lessons.lessonList || [],
    fetching: state.lessons.fetchingAll,
    error: state.lessons.errorAll,
    links: state.lessons.links,
    totalItems: state.lessons.totalItems,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllLessons: options => dispatch(LessonActions.lessonAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(MyLessonScreen);
