import React, { useState, useCallback, useEffect } from 'react';
import { View, FlatList, ActivityIndicator, Alert } from 'react-native';
import {
  Text,
  useTheme,
  Searchbar,
  Chip,
  Menu,
  Button,
  IconButton,
  Snackbar,
  Surface,
} from 'react-native-paper';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LessonActions from '../entities/lesson/lesson.reducer';
import LessonCard from '../../shared/components/lesson/lesson-card';
import LessonStats from '../../shared/components/lesson/lesson-stats';
import styles from './all-lessons-screen.styles';

function AllLessonsScreen(props) {
  const { lessonList, fetching, error, getAllLessons, navigation, links, totalItems } = props;

  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLessons, setFilteredLessons] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('id');
  const [page, setPage] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showError, setShowError] = useState(false);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

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
      // Add mock progress and bookmark for now
      progress: Math.random(),
      isBookmarked: Math.random() > 0.7,
      isCompleted: Math.random() > 0.6,
      status: Math.random() > 0.5 ? 'completed' : 'in-progress',
    }));
  };

  const displayLessons = transformLessonData(lessonList);

  // Load lessons from backend
  const loadLessons = useCallback(
    (pageNumber = 0, append = false) => {
      console.debug(`Loading all lessons - page: ${pageNumber}, append: ${append}`);

      if (append) {
        setLoadingMore(true);
      }

      const options = {
        page: pageNumber,
        size: 20,
        sort: `${sortField},${sortOrder}`,
      };

      getAllLessons(options);
    },
    [getAllLessons, sortField, sortOrder]
  );

  // Filter and search lessons
  useEffect(() => {
    let filtered = [...displayLessons];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lesson) =>
          lesson.title.toLowerCase().includes(query) ||
          lesson.content.toLowerCase().includes(query) ||
          (lesson.course?.name && lesson.course.name.toLowerCase().includes(query))
      );
    }

    // Apply course filter
    if (selectedCourse) {
      filtered = filtered.filter((lesson) => lesson.course?.id === selectedCourse.id);
    }

    setFilteredLessons(filtered);
  }, [displayLessons, searchQuery, selectedCourse]);

  // Handle error states
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
      console.debug('AllLessons screen focused, loading from backend');
      setPage(0);
      setShowError(false);
      loadLessons(0, false);
    }, [loadLessons])
  );

  const handleRefresh = useCallback(() => {
    console.debug('Refreshing all lessons');
    setRefreshing(true);
    setPage(0);
    setShowError(false);
    loadLessons(0, false);
  }, [loadLessons]);

  const handleLoadMore = useCallback(() => {
    if (!fetching && !loadingMore && links && links.next > 0) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadLessons(nextPage, true);
    }
  }, [fetching, loadingMore, links, page, loadLessons]);

  const handleLessonPress = useCallback(
    (lesson) => {
      console.debug('Lesson pressed:', lesson.title);
      navigation.navigate('LessonDetail', { lessonId: lesson.id });
    },
    [navigation]
  );

  const handleVideoPress = useCallback((lesson) => {
    console.debug('Video pressed for lesson:', lesson.title);
    if (lesson.videoUrl) {
      // Navigate to video player
      Alert.alert('Video', `Opening video for: ${lesson.title}`);
    } else {
      Alert.alert('Thông báo', 'Video chưa sẵn sàng cho bài học này');
    }
  }, []);

  const handleSlidePress = useCallback((lesson) => {
    console.debug('Slide pressed for lesson:', lesson.title);
    if (lesson.slideUrl) {
      // Navigate to slide viewer
      Alert.alert('Slide', `Opening slide for: ${lesson.title}`);
    } else {
      Alert.alert('Thông báo', 'Slide chưa sẵn sàng cho bài học này');
    }
  }, []);

  const handleBookmark = useCallback((lesson) => {
    console.debug('Bookmark toggled for lesson:', lesson.id);
    Alert.alert('Thông báo', 'Tính năng bookmark sẽ được kết nối với backend sau');
  }, []);

  const handleSort = useCallback(
    (field, order) => {
      setSortField(field);
      setSortOrder(order);
      setShowSortMenu(false);
      setPage(0);
      loadLessons(0, false);
    },
    [loadLessons]
  );

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCourse(null);
    setSortField('id');
    setSortOrder('desc');
    setShowFilterMenu(false);
  }, []);

  const getUniqueCoursesFromLessons = () => {
    const courses = displayLessons
      .map((lesson) => lesson.course)
      .filter((course) => course && course.id !== 0);

    // Remove duplicates by id
    const uniqueCourses = courses.filter(
      (course, index, self) => index === self.findIndex((c) => c.id === course.id)
    );

    return uniqueCourses;
  };

  const renderLessonCard = ({ item }) => (
    <LessonCard
      lesson={item}
      onPress={handleLessonPress}
      onVideoPress={() => handleVideoPress(item)}
      onSlidePress={() => handleSlidePress(item)}
      onBookmarkPress={() => handleBookmark(item)}
      progress={item.progress}
      isCompleted={item.isCompleted}
      isBookmarked={item.isBookmarked}
    />
  );

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Search Bar */}
      <Searchbar
        placeholder="Tìm kiếm bài học..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
        iconColor={theme.colors.onSurfaceVariant}
      />

      {/* Filter Controls */}
      <View style={styles.filterControls}>
        <View style={styles.filterRow}>
          {/* Course Filter */}
          <Menu
            visible={showFilterMenu}
            onDismiss={() => setShowFilterMenu(false)}
            anchor={
              <Button
                mode="outlined"
                compact
                onPress={() => setShowFilterMenu(true)}
                icon="filter-variant"
                style={styles.filterButton}
              >
                {selectedCourse ? selectedCourse.name : 'Tất cả khóa học'}
              </Button>
            }
          >
            <Menu.Item
              onPress={() => {
                setSelectedCourse(null);
                setShowFilterMenu(false);
              }}
              title="Tất cả khóa học"
            />
            {getUniqueCoursesFromLessons().map((course) => (
              <Menu.Item
                key={course.id}
                onPress={() => {
                  setSelectedCourse(course);
                  setShowFilterMenu(false);
                }}
                title={course.name}
              />
            ))}
          </Menu>

          {/* Sort Menu */}
          <Menu
            visible={showSortMenu}
            onDismiss={() => setShowSortMenu(false)}
            anchor={
              <Button
                mode="outlined"
                compact
                onPress={() => setShowSortMenu(true)}
                icon="sort"
                style={styles.filterButton}
              >
                Sắp xếp
              </Button>
            }
          >
            <Menu.Item onPress={() => handleSort('id', 'desc')} title="Mới nhất" />
            <Menu.Item onPress={() => handleSort('id', 'asc')} title="Cũ nhất" />
            <Menu.Item onPress={() => handleSort('title', 'asc')} title="Tên A-Z" />
            <Menu.Item onPress={() => handleSort('title', 'desc')} title="Tên Z-A" />
          </Menu>

          {/* Clear Filters */}
          {(searchQuery || selectedCourse) && (
            <IconButton icon="close" size={20} onPress={clearFilters} style={styles.clearButton} />
          )}
        </View>

        {/* Active Filters */}
        {(searchQuery || selectedCourse) && (
          <View style={styles.activeFilters}>
            {searchQuery && (
              <Chip onClose={() => setSearchQuery('')} style={styles.filterChip}>
                Tìm: {searchQuery}
              </Chip>
            )}
            {selectedCourse && (
              <Chip onClose={() => setSelectedCourse(null)} style={styles.filterChip}>
                Khóa: {selectedCourse.name}
              </Chip>
            )}
          </View>
        )}
      </View>

      {/* Stats */}
      <LessonStats lessons={filteredLessons} />
    </View>
  );

  if (fetching && !refreshing && !loadingMore && displayLessons.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.onBackground }]}>
          Đang tải danh sách bài học...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredLessons}
        renderItem={renderLessonCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          !fetching && (
            <Surface
              style={[styles.emptyContainer, { backgroundColor: theme.colors.surfaceVariant }]}
            >
              <MaterialCommunityIcons
                name="book-open-page-variant"
                size={64}
                color={theme.colors.onSurfaceVariant}
              />
              <Text style={[styles.emptyText, { color: theme.colors.onSurfaceVariant }]}>
                {searchQuery || selectedCourse
                  ? 'Không tìm thấy bài học phù hợp'
                  : 'Chưa có bài học nào'}
              </Text>
              {(searchQuery || selectedCourse) && (
                <Button mode="outlined" onPress={clearFilters} style={styles.clearFiltersButton}>
                  Xóa bộ lọc
                </Button>
              )}
            </Surface>
          )
        }
        ListFooterComponent={
          loadingMore && (
            <View style={styles.loadMoreContainer}>
              <ActivityIndicator size="small" color={theme.colors.primary} />
              <Text style={[styles.loadMoreText, { color: theme.colors.onBackground }]}>
                Đang tải thêm...
              </Text>
            </View>
          )
        }
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
        {error ? `Lỗi tải dữ liệu: ${error}` : 'Có lỗi xảy ra khi tải danh sách bài học'}
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

export default connect(mapStateToProps, mapDispatchToProps)(AllLessonsScreen);
