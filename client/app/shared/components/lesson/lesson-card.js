import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Card, Text, Chip, IconButton, useTheme, ProgressBar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './lesson-card.styles';

const LessonCard = ({
  lesson,
  onPress,
  onVideoPress,
  onSlidePress,
  progress = 0, // 0-1 for progress bar (from backend or calculated)
  isCompleted = false,
  isBookmarked = false,
  onBookmarkPress,
}) => {
  const theme = useTheme();

  // Extract progress from lesson data or use prop
  const lessonProgress = lesson.progress !== undefined ? lesson.progress : progress;
  const completed = lesson.isCompleted !== undefined ? lesson.isCompleted : isCompleted;
  const bookmarked = lesson.isBookmarked !== undefined ? lesson.isBookmarked : isBookmarked;

  const getCardStyle = () => [
    styles.card,
    {
      backgroundColor: theme.colors.surface,
      borderLeftWidth: completed ? 3 : 0,
      borderLeftColor: completed ? theme.colors.primary : 'transparent',
    },
  ];

  const getTitleStyle = () => [styles.title, { color: theme.colors.onSurface }];

  const getContentStyle = () => [styles.content, { color: theme.colors.onSurfaceVariant }];

  const getCourseChipStyle = () => [
    styles.courseChip,
    { backgroundColor: theme.colors.primaryContainer },
  ];

  const getStatusChipStyle = (status) => {
    if (status === 'completed') {
      return { backgroundColor: theme.colors.primary };
    } else if (status === 'in-progress') {
      return { backgroundColor: theme.colors.tertiary };
    }
    return { backgroundColor: theme.colors.surfaceVariant };
  };

  const getStatusText = () => {
    if (completed) return 'Đã hoàn thành';
    if (lessonProgress > 0) return 'Đang học';
    return 'Chưa học';
  };

  const getStatusColor = () => {
    if (completed) return theme.colors.onPrimary;
    if (lessonProgress > 0) return theme.colors.onTertiary;
    return theme.colors.onSurfaceVariant;
  };

  return (
    <TouchableOpacity onPress={() => onPress(lesson)} style={styles.container}>
      <Card style={getCardStyle()} elevation={2}>
        <Card.Content>
          {/* Header với title và bookmark */}
          <View style={styles.header}>
            <View style={styles.titleContainer}>
              <Text style={getTitleStyle()} numberOfLines={2}>
                {lesson.title || `Bài học #${lesson.id}`}
              </Text>
              <View style={styles.headerActions}>
                {' '}
                {/* Bookmark button */}
                {onBookmarkPress && (
                  <IconButton
                    icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
                    size={20}
                    iconColor={bookmarked ? theme.colors.primary : theme.colors.onSurfaceVariant}
                    onPress={() => onBookmarkPress(lesson)}
                    style={styles.bookmarkButton}
                  />
                )}
              </View>
            </View>

            {/* Chips for course and status */}
            <View style={styles.chipRow}>
              {lesson.course && lesson.course.id !== 0 && (
                <Chip
                  mode="flat"
                  compact
                  style={getCourseChipStyle()}
                  textStyle={{ color: theme.colors.onPrimaryContainer }}
                  icon="book-open-variant"
                >
                  {lesson.course.name || `Khóa học #${lesson.course.id}`}
                </Chip>
              )}

              <Chip
                mode="flat"
                compact
                style={[
                  styles.statusChip,
                  getStatusChipStyle(
                    completed ? 'completed' : lessonProgress > 0 ? 'in-progress' : 'not-started'
                  ),
                ]}
                textStyle={{ color: getStatusColor(), fontSize: 11 }}
                icon={
                  completed ? 'check-circle' : lessonProgress > 0 ? 'play-circle' : 'circle-outline'
                }
              >
                {getStatusText()}
              </Chip>
            </View>
          </View>

          {/* Progress bar */}
          {lessonProgress > 0 && (
            <View style={styles.progressContainer}>
              <ProgressBar
                progress={lessonProgress}
                color={theme.colors.primary}
                style={styles.progressBar}
              />
              <Text style={[styles.progressText, { color: theme.colors.onSurfaceVariant }]}>
                {Math.round(lessonProgress * 100)}% hoàn thành
              </Text>
            </View>
          )}

          {/* Content preview */}
          {lesson.content && (
            <Text style={getContentStyle()} numberOfLines={3}>
              {lesson.content}
            </Text>
          )}

          {/* Action buttons */}
          <View style={styles.actions}>
            <View style={styles.mediaButtons}>
              {lesson.videoUrl && (
                <TouchableOpacity
                  onPress={() => onVideoPress(lesson)}
                  style={[styles.mediaButton, { backgroundColor: theme.colors.errorContainer }]}
                >
                  <MaterialCommunityIcons
                    name="play-circle"
                    size={20}
                    color={theme.colors.onErrorContainer}
                  />
                  <Text style={[styles.mediaButtonText, { color: theme.colors.onErrorContainer }]}>
                    Video
                  </Text>
                </TouchableOpacity>
              )}

              {lesson.slideUrl && (
                <TouchableOpacity
                  onPress={() => onSlidePress(lesson)}
                  style={[styles.mediaButton, { backgroundColor: theme.colors.tertiaryContainer }]}
                >
                  <MaterialCommunityIcons
                    name="presentation"
                    size={20}
                    color={theme.colors.onTertiaryContainer}
                  />
                  <Text
                    style={[styles.mediaButtonText, { color: theme.colors.onTertiaryContainer }]}
                  >
                    Slide
                  </Text>
                </TouchableOpacity>
              )}

              {/* Show placeholder if no media available */}
              {!lesson.videoUrl && !lesson.slideUrl && (
                <Text style={[styles.noMediaText, { color: theme.colors.onSurfaceVariant }]}>
                  Tài liệu đang cập nhật
                </Text>
              )}
            </View>

            <IconButton
              icon="chevron-right"
              size={20}
              iconColor={theme.colors.onSurfaceVariant}
              onPress={() => onPress(lesson)}
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

export default LessonCard;
