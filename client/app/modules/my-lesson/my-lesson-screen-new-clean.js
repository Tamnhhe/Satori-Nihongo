import React, { useState, useCallback, useEffect } from 'react';
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
import { Bell, Clock, Play, CheckCircle, Lock, FileText } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LessonActions from '../entities/lesson/lesson.reducer';
import API from '../../shared/services/api';
import styles from './my-lesson-screen.styles';

function MyLessonScreen(props) {
  const { navigation } = props;
  const [lessonsData, setLessonsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Create API instance
  const api = API.create();

  const loadLessonsData = async () => {
    try {
      setLoading(true);

      const lessonsResponse = await api.getAllLessons({ page: 0, size: 100 });
      console.log('Lessons response:', lessonsResponse);

      if (lessonsResponse.ok && lessonsResponse.data) {
        const lessons = lessonsResponse.data?.content || lessonsResponse.data || [];
        console.log('All lessons data:', lessons);

        // Transform backend data to match UI expectations
        const transformedLessons = lessons.map((lesson, index) => ({
          id: lesson.id,
          title: lesson.title || lesson.name || `Bài ${index + 1}: Tiếng Nhật cơ bản`,
          description: lesson.description || lesson.content?.substring(0, 50) || 'Mô tả bài học',
          duration: lesson.duration || lesson.estimatedTime || 30,
          type: lesson.type || 'Video + Slide',
          status: lesson.completed ? 'completed' : lesson.status?.toLowerCase() || 'available',
          progress: lesson.progress || (lesson.completed ? 100 : Math.floor(Math.random() * 80)),
          videoUrl: lesson.videoUrl,
          slideUrl: lesson.slideUrl,
        }));

        setLessonsData(transformedLessons);
      } else {
        console.error('Lessons API error:', lessonsResponse);
        setLessonsData([]);
      }
    } catch (error) {
      console.error('Error loading lessons data:', error);
      setLessonsData([]);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu bài học. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLessonsData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.debug('MyLesson screen focused, loading lessons');
      loadLessonsData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadLessonsData();
    setRefreshing(false);
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return <CheckCircle size={32} color="#10B981" />;
      case 'available':
      case 'in_progress':
        return (
          <View style={styles.playIconContainer}>
            <Play size={16} color="#ffffff" />
          </View>
        );
      case 'locked':
        return <Lock size={32} color="#9CA3AF" />;
      default:
        return (
          <View style={styles.playIconContainer}>
            <Play size={16} color="#ffffff" />
          </View>
        );
    }
  };

  const handleLessonPress = (lesson) => {
    if (lesson.status === 'locked') return;

    console.debug('Lesson pressed:', lesson.title);
    navigation.navigate('LessonDetail', { lessonId: lesson.id });
  };

  // Calculate progress statistics
  const completedLessons = lessonsData.filter((lesson) => lesson.status === 'completed').length;
  const totalLessons = lessonsData.length || 1; // Avoid division by zero

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Đang tải bài học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={['#1E3A8A', '#3B82F6']} style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Bài học 📖</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Progress Section */}
        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Tiến độ hoàn thành</Text>
            <Text style={styles.progressCount}>
              {completedLessons}/{totalLessons}
            </Text>
          </View>
          <View style={styles.progressBarBackground}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${(completedLessons / totalLessons) * 100}%` },
              ]}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Lessons List */}
      <ScrollView
        style={styles.lessonsContainer}
        contentContainerStyle={styles.lessonsContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {lessonsData.length > 0 ? (
          lessonsData.map((lesson) => (
            <TouchableOpacity
              key={lesson.id}
              style={[styles.lessonCard, lesson.status === 'locked' ? styles.lockedCard : null]}
              onPress={() => handleLessonPress(lesson)}
              disabled={lesson.status === 'locked'}
            >
              <View style={styles.lessonCardContent}>
                <View style={styles.lessonInfo}>
                  {/* Lesson Title */}
                  <Text style={styles.lessonTitle}>{lesson.title}</Text>

                  {/* Lesson Description */}
                  <Text style={styles.lessonDescription}>{lesson.description}</Text>

                  {/* Lesson Meta Info */}
                  <View style={styles.lessonMeta}>
                    <View style={styles.metaItem}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.metaText}>{lesson.duration} phút</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <FileText size={16} color="#6B7280" />
                      <Text style={styles.metaText}>{lesson.type}</Text>
                    </View>
                  </View>

                  {/* Progress Bar - only show for available/completed lessons */}
                  {lesson.status !== 'locked' && (
                    <View style={styles.lessonProgressSection}>
                      <View style={styles.lessonProgressHeader}>
                        <Text style={styles.lessonProgressLabel}>
                          {lesson.status === 'completed' ? 'Hoàn thành' : 'Tiến độ'}
                        </Text>
                        <Text style={styles.lessonProgressPercent}>{lesson.progress}%</Text>
                      </View>
                      <View style={styles.lessonProgressBarContainer}>
                        <View
                          style={[styles.lessonProgressBar, { width: `${lesson.progress}%` }]}
                        />
                      </View>
                    </View>
                  )}
                </View>

                {/* Status Icon */}
                <View style={styles.statusIconContainer}>{getStatusIcon(lesson.status)}</View>
              </View>
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyState}>
            <FileText size={48} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>Chưa có bài học nào</Text>
            <Text style={styles.emptyDescription}>Bài học sẽ được cập nhật sớm</Text>
          </View>
        )}
      </ScrollView>
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
