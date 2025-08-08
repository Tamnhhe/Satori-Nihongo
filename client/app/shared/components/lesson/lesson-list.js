import React, { useState } from 'react';
import { View, FlatList, RefreshControl, Linking, Alert } from 'react-native';
import { Text, Searchbar, Chip, FAB, useTheme, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LessonCard from './lesson-card';
import LessonStats from './lesson-stats';
import styles from './lesson-list.styles';

const LessonList = ({
  lessons = [],
  loading = false,
  onRefresh,
  onLessonPress,
  onLoadMore,
  hasMore = false,
  searchQuery = '',
  onSearchChange,
  selectedCourse = null,
  onCourseFilter,
  navigation,
  showStats = true,
}) => {
  const theme = useTheme();
  const [filteredLessons, setFilteredLessons] = useState(lessons);
  const [bookmarkedLessons, setBookmarkedLessons] = useState(new Set());

  // Filter lessons based on search and course
  React.useEffect(() => {
    let filtered = lessons;

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (lesson) =>
          lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lesson.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by course
    if (selectedCourse) {
      filtered = filtered.filter((lesson) => lesson.course?.id === selectedCourse);
    }

    setFilteredLessons(filtered);
  }, [lessons, searchQuery, selectedCourse]);

  // Get unique courses for filtering
  const getUniqueCourses = () => {
    const courses = lessons
      .filter((lesson) => lesson.course)
      .map((lesson) => lesson.course)
      .filter((course, index, self) => index === self.findIndex((c) => c.id === course.id));
    return courses;
  };

  const handleVideoPress = async (videoUrl) => {
    try {
      const supported = await Linking.canOpenURL(videoUrl);
      if (supported) {
        await Linking.openURL(videoUrl);
      } else {
        Alert.alert('Lỗi', 'Không thể mở video này');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở video này');
    }
  };

  const handleSlidePress = async (slideUrl) => {
    try {
      const supported = await Linking.canOpenURL(slideUrl);
      if (supported) {
        await Linking.openURL(slideUrl);
      } else {
        Alert.alert('Lỗi', 'Không thể mở slide này');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở slide này');
    }
  };

  const handleBookmarkPress = (lesson) => {
    const newBookmarked = new Set(bookmarkedLessons);
    if (newBookmarked.has(lesson.id)) {
      newBookmarked.delete(lesson.id);
    } else {
      newBookmarked.add(lesson.id);
    }
    setBookmarkedLessons(newBookmarked);
  };

  const renderLessonCard = ({ item }) => (
    <LessonCard
      lesson={item}
      onPress={onLessonPress}
      onVideoPress={handleVideoPress}
      onSlidePress={handleSlidePress}
      progress={Math.random()} // Mock progress - replace with real data
      isCompleted={Math.random() > 0.7} // Mock completion - replace with real data
      isBookmarked={bookmarkedLessons.has(item.id)}
      onBookmarkPress={handleBookmarkPress}
    />
  );

  const renderHeader = () => (
    <View>
      {/* Statistics section */}
      {showStats && lessons.length > 0 && (
        <>
          <LessonStats lessons={lessons} />
          <Divider style={{ marginHorizontal: 16, marginBottom: 16 }} />
        </>
      )}

      <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
        {/* Search bar */}
        <Searchbar
          placeholder="Tìm kiếm bài học..."
          onChangeText={onSearchChange}
          value={searchQuery}
          style={[styles.searchBar, { backgroundColor: theme.colors.surface }]}
          iconColor={theme.colors.onSurfaceVariant}
          placeholderTextColor={theme.colors.onSurfaceVariant}
        />

        {/* Course filter chips */}
        {getUniqueCourses().length > 0 && (
          <View style={styles.filterContainer}>
            <Text style={[styles.filterLabel, { color: theme.colors.onBackground }]}>
              Lọc theo khóa học:
            </Text>
            <View style={styles.chipContainer}>
              <Chip
                mode={selectedCourse === null ? 'flat' : 'outlined'}
                onPress={() => onCourseFilter(null)}
                style={[
                  styles.filterChip,
                  selectedCourse === null && { backgroundColor: theme.colors.primaryContainer },
                ]}
                textStyle={{
                  color:
                    selectedCourse === null
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSurface,
                }}
              >
                Tất cả
              </Chip>
              {getUniqueCourses().map((course) => (
                <Chip
                  key={course.id}
                  mode={selectedCourse === course.id ? 'flat' : 'outlined'}
                  onPress={() => onCourseFilter(course.id)}
                  style={[
                    styles.filterChip,
                    selectedCourse === course.id && {
                      backgroundColor: theme.colors.primaryContainer,
                    },
                  ]}
                  textStyle={{
                    color:
                      selectedCourse === course.id
                        ? theme.colors.onPrimaryContainer
                        : theme.colors.onSurface,
                  }}
                >
                  Khóa {course.id}
                </Chip>
              ))}
            </View>
          </View>
        )}

        {/* Results count */}
        <View style={styles.resultsContainer}>
          <Text style={[styles.resultsText, { color: theme.colors.onSurfaceVariant }]}>
            {filteredLessons.length} bài học
          </Text>
        </View>
      </View>
    </View>
  );

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons
        name="book-open-variant"
        size={64}
        color={theme.colors.onSurfaceVariant}
      />
      <Text style={[styles.emptyTitle, { color: theme.colors.onSurface }]}>
        {searchQuery || selectedCourse ? 'Không tìm thấy bài học' : 'Chưa có bài học nào'}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.colors.onSurfaceVariant }]}>
        {searchQuery || selectedCourse
          ? 'Hãy thử tìm kiếm với từ khóa khác'
          : 'Các bài học sẽ xuất hiện ở đây'}
      </Text>
    </View>
  );

  const renderFooter = () => {
    if (!loading || filteredLessons.length === 0) return null;

    return (
      <View style={styles.footerLoader}>
        <Text style={[styles.loadingText, { color: theme.colors.onSurfaceVariant }]}>
          Đang tải thêm...
        </Text>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <FlatList
        data={filteredLessons}
        renderItem={renderLessonCard}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        refreshControl={
          <RefreshControl
            refreshing={loading && filteredLessons.length === 0}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={hasMore ? onLoadMore : null}
        onEndReachedThreshold={0.1}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filteredLessons.length === 0 ? styles.emptyList : null}
      />

      {/* Add new lesson FAB */}
      <FAB
        icon="plus"
        onPress={() => navigation?.navigate('LessonEdit', { id: undefined })}
        style={[styles.fab, { backgroundColor: theme.colors.primary }]}
        customSize={56}
      />
    </View>
  );
};

export default LessonList;
