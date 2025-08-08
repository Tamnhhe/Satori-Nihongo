import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Alert, Linking } from 'react-native';
import {
  Text,
  Card,
  Button,
  Chip,
  IconButton,
  useTheme,
  Divider,
  Surface,
} from 'react-native-paper';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LessonActions from '../entities/lesson/lesson.reducer';
import QuizService from '../../shared/services/quiz.service';
import styles from './lesson-detail-screen.styles';

function LessonDetailScreen(props) {
  const { route, navigation, lesson, fetching, error, getLesson, api } = props;

  const theme = useTheme();
  const [bookmarked, setBookmarked] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(false);

  const lessonId = route.params?.lessonId;
  const quizService = new QuizService(api);

  // Load lesson data when screen focuses
  useFocusEffect(
    useCallback(() => {
      if (lessonId) {
        console.debug('Loading lesson details for ID:', lessonId);
        getLesson(lessonId);
        loadQuizzes(lessonId);
      } else {
        navigation.goBack();
      }
    }, [lessonId, getLesson, navigation])
  );

  // Load quizzes for this lesson
  const loadQuizzes = useCallback(
    async (lessonId) => {
      setLoadingQuizzes(true);
      try {
        const result = await quizService.getQuizzesByLesson(lessonId);
        if (result.success) {
          setQuizzes(result.data);
          console.debug('Loaded quizzes for lesson:', result.data.length);
        } else {
          console.error('Failed to load quizzes:', result.message);
        }
      } catch (error) {
        console.error('Error loading quizzes:', error);
      }
      setLoadingQuizzes(false);
    },
    [quizService]
  );

  // Mock bookmark data (replace with backend calls later)
  useEffect(() => {
    if (lesson) {
      setBookmarked(Math.random() > 0.5);
    }
  }, [lesson]);

  const handleVideoPress = useCallback(() => {
    if (lesson?.videoUrl) {
      console.debug('Opening video:', lesson.videoUrl);
      // Navigate to video player or open external link
      Linking.openURL(lesson.videoUrl).catch(() => {
        Alert.alert('Lỗi', 'Không thể mở video');
      });
    } else {
      Alert.alert('Thông báo', 'Video chưa sẵn sàng cho bài học này');
    }
  }, [lesson]);

  const handleSlidePress = useCallback(() => {
    if (lesson?.slideUrl) {
      console.debug('Opening slide:', lesson.slideUrl);
      // Navigate to slide viewer or open external link
      Linking.openURL(lesson.slideUrl).catch(() => {
        Alert.alert('Lỗi', 'Không thể mở slide');
      });
    } else {
      Alert.alert('Thông báo', 'Slide chưa sẵn sàng cho bài học này');
    }
  }, [lesson]);

  const handleBookmark = useCallback(() => {
    setBookmarked(!bookmarked);
    Alert.alert('Thông báo', bookmarked ? 'Đã bỏ bookmark' : 'Đã thêm bookmark');
  }, [bookmarked]);

  const handleStartQuiz = useCallback(
    (quiz) => {
      console.debug('Starting quiz:', quiz.title);
      navigation.navigate('QuizScreen', {
        quiz,
        lesson: {
          id: lesson.id,
          title: lesson.title,
        },
      });
    },
    [navigation, lesson]
  );

  const handleStartFlashcard = useCallback(() => {
    console.debug('Starting flashcard for lesson:', lesson?.title);
    navigation.navigate('FlashcardScreen', {
      lessonId: lesson.id,
      lessonTitle: lesson.title,
    });
  }, [navigation, lesson]);

  if (fetching) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={{ color: theme.colors.onBackground }}>Đang tải chi tiết bài học...</Text>
      </View>
    );
  }

  if (error || !lesson) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <MaterialCommunityIcons name="alert-circle" size={64} color={theme.colors.error} />
        <Text style={[styles.errorText, { color: theme.colors.error }]}>Không thể tải bài học</Text>
        <Button mode="outlined" onPress={() => navigation.goBack()} style={styles.backButton}>
          Quay lại
        </Button>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton
          icon="arrow-left"
          size={24}
          iconColor={theme.colors.onBackground}
          onPress={() => navigation.goBack()}
        />
        <Text style={[styles.headerTitle, { color: theme.colors.onBackground }]}>
          Chi tiết bài học
        </Text>
        <IconButton
          icon={bookmarked ? 'bookmark' : 'bookmark-outline'}
          size={24}
          iconColor={bookmarked ? theme.colors.primary : theme.colors.onBackground}
          onPress={handleBookmark}
        />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* Title and Course Info */}
        <Card style={[styles.infoCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.lessonTitle, { color: theme.colors.onSurface }]}>
              {lesson.title}
            </Text>

            {lesson.course && (
              <View style={styles.courseInfo}>
                <Chip
                  mode="flat"
                  style={{ backgroundColor: theme.colors.primaryContainer }}
                  textStyle={{ color: theme.colors.onPrimaryContainer }}
                  icon="book-open-variant"
                >
                  {lesson.course.name || `Khóa học #${lesson.course.id}`}
                </Chip>
              </View>
            )}

            {/* Progress */}
            {progress > 0 && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={[styles.progressTitle, { color: theme.colors.onSurface }]}>
                    Tiến độ học tập
                  </Text>
                  <Text style={[styles.progressPercent, { color: theme.colors.primary }]}>
                    {Math.round(progress)}%
                  </Text>
                </View>
                <ProgressBar
                  progress={progress / 100}
                  color={theme.colors.primary}
                  style={styles.progressBar}
                />
              </View>
            )}
          </Card.Content>
        </Card>

        {/* Content */}
        {lesson.content && (
          <Card style={[styles.contentCard, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Nội dung bài học
              </Text>
              <Text style={[styles.contentText, { color: theme.colors.onSurfaceVariant }]}>
                {lesson.content}
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Media Resources */}
        <Card style={[styles.resourceCard, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <Text style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
              Tài liệu học tập
            </Text>

            <View style={styles.resourceButtons}>
              {lesson.videoUrl && (
                <Button
                  mode="contained"
                  icon="play-circle"
                  onPress={handleVideoPress}
                  style={[styles.resourceButton, { backgroundColor: theme.colors.error }]}
                  labelStyle={{ color: theme.colors.onError }}
                >
                  Xem Video
                </Button>
              )}

              {lesson.slideUrl && (
                <Button
                  mode="contained"
                  icon="presentation"
                  onPress={handleSlidePress}
                  style={[styles.resourceButton, { backgroundColor: theme.colors.tertiary }]}
                  labelStyle={{ color: theme.colors.onTertiary }}
                >
                  Xem Slide
                </Button>
              )}
            </View>

            {!lesson.videoUrl && !lesson.slideUrl && (
              <Surface
                style={[
                  styles.noResourceContainer,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <MaterialCommunityIcons
                  name="file-document-outline"
                  size={48}
                  color={theme.colors.onSurfaceVariant}
                />
                <Text style={[styles.noResourceText, { color: theme.colors.onSurfaceVariant }]}>
                  Tài liệu đang được cập nhật
                </Text>
              </Surface>
            )}
          </Card.Content>
        </Card>

        {/* Action Button */}
        <Button
          mode="contained"
          onPress={handleStartLesson}
          style={[styles.startButton, { backgroundColor: theme.colors.primary }]}
          labelStyle={{ color: theme.colors.onPrimary }}
          contentStyle={styles.startButtonContent}
          icon="play"
        >
          Bắt đầu học
        </Button>
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    lesson: state.lessons.lesson,
    fetching: state.lessons.fetchingOne,
    error: state.lessons.errorOne,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getLesson: (id) => dispatch(LessonActions.lessonRequest(id)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LessonDetailScreen);
