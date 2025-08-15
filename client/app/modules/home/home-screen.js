import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import {
  Bell,
  ChevronRight,
  Clock,
  BookOpen,
  User,
  Play,
  CheckCircle,
  Lock,
  FileText,
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import API from '../../shared/services/api';
import styles from './home-screen-new.styles';

function HomeScreen(props) {
  const { account, navigation } = props;
  const [scheduleData, setScheduleData] = useState([]);
  const [lessonsData, setLessonsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Create API instance
  const api = API.create();

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);

      // Load schedules and lessons in parallel
      const [schedulesResponse, lessonsResponse] = await Promise.all([
        api.getAllSchedules({ page: 0, size: 5 }),
        api.getAllLessons({ page: 0, size: 5 }),
      ]);

      console.log('Schedules response:', schedulesResponse);
      console.log('Lessons response:', lessonsResponse);

      // Xử lý Schedules
      if (schedulesResponse.ok && schedulesResponse.data) {
        const schedules = schedulesResponse.data?.content || schedulesResponse.data || [];
        console.log('Schedules data:', schedules);

        if (schedules.length > 0) {
          // Sắp xếp theo thời gian để lấy lịch học gần nhất
          const sortedSchedules = schedules.sort((a, b) => {
            const dateA = new Date(a.startTime || new Date());
            const dateB = new Date(b.startTime || new Date());
            return dateA - dateB;
          });
          setScheduleData(sortedSchedules);
        } else {
          // Không có data từ API, dùng mock
          setScheduleData([
            {
              id: 1,
              title: 'Luyện nghe JLPT',
              startTime: '2025-08-13T21:00:00',
              endTime: '2025-08-13T21:45:00',
              status: 'upcoming',
              level: 'N3',
              duration: '45',
            },
          ]);
        }
      } else {
        console.error('Schedule API error:', schedulesResponse);
        // API lỗi, dùng mock
        setScheduleData([
          {
            id: 1,
            title: 'Luyện nghe JLPT',
            startTime: '2025-08-13T21:00:00',
            endTime: '2025-08-13T21:45:00',
            status: 'upcoming',
            level: 'N3',
            duration: '45',
          },
        ]);
      }

      // Xử lý Lessons - Ưu tiên dữ liệu thật từ database
      if (lessonsResponse.ok && lessonsResponse.data) {
        const lessons = lessonsResponse.data?.content || lessonsResponse.data || [];
        console.log('Lessons data from API:', lessons);

        if (lessons.length > 0) {
          // Có dữ liệu thật từ database
          const sortedLessons = lessons.sort((a, b) => {
            // Ưu tiên bài học chưa hoàn thành
            if (a.completed !== b.completed) {
              return a.completed ? 1 : -1;
            }
            // Sau đó sắp xếp theo ID (bài học mới nhất)
            return (a.id || 0) - (b.id || 0);
          });

          setLessonsData(sortedLessons);
          console.log('Using real lessons data:', sortedLessons);
        } else {
          // Database trống, hiển thị thông báo
          setLessonsData([]);
          console.log('No lessons in database');
        }
      } else {
        console.error('Lesson API error:', lessonsResponse);
        // API lỗi, set rỗng để hiển thị empty state
        setLessonsData([]);
      }
    } catch (error) {
      console.error('Error loading home data:', error);

      // Chỉ set mock cho schedules, lessons để trống để hiển thị empty state
      setScheduleData([
        {
          id: 1,
          title: 'Luyện nghe JLPT',
          startTime: '2025-08-13T21:00:00',
          endTime: '2025-08-13T21:45:00',
          status: 'upcoming',
          level: 'N3',
          duration: '45',
        },
      ]);

      setLessonsData([]);

      Alert.alert(
        'Thông báo',
        'Không thể kết nối đến server. Một số dữ liệu có thể không được cập nhật.'
      );
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadHomeData();
    setRefreshing(false);
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const time = new Date(timeString);
      return time.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
    } catch (error) {
      return '21:00';
    }
  };

  const formatTimeRange = (startTime, endTime) => {
    const start = formatTime(startTime) || '21:00';
    const end = formatTime(endTime) || '21:45';
    return `${start} - ${end}`;
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'hoàn thành':
        return <CheckCircle size={32} color="#10B981" />;
      case 'available':
      case 'chưa học':
      case 'in_progress':
        return (
          <View style={styles.playIcon}>
            <Play size={16} color="#ffffff" />
          </View>
        );
      case 'locked':
      case 'khóa':
        return <Lock size={32} color="#9CA3AF" />;
      default:
        return (
          <View style={styles.playIcon}>
            <Play size={16} color="#ffffff" />
          </View>
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
      case 'sắp diễn ra':
        return '#FB923C';
      case 'completed':
      case 'hoàn thành':
        return '#10B981';
      case 'in_progress':
      case 'đang học':
        return '#3B82F6';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'completed':
        return 'Hoàn thành';
      case 'in_progress':
        return 'Đang học';
      default:
        return 'Sắp diễn ra';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Debug info
  console.log('Current scheduleData length:', scheduleData.length);
  console.log('Current lessonsData length:', lessonsData.length);
  console.log('First schedule:', scheduleData[0]);
  console.log('First lesson:', lessonsData[0]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <LinearGradient
            colors={['#FB923C', '#EF4444']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>👤</Text>
          </LinearGradient>
          <Text style={styles.greeting}>Chào bạn 👋</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Bell size={20} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Ready Card */}
      <LinearGradient
        colors={['#7DD3FC', '#93C5FD']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.readyCard}
      >
        <View style={styles.readyCardContent}>
          <View style={styles.readyTextContainer}>
            <Text style={styles.readyTitle}>✨ Bạn Đã Sẵn</Text>
            <Text style={styles.readyTitle}>Sàng Chưa</Text>
          </View>
          <View style={styles.eyesIcon}>
            <View style={styles.eyesContainer}>
              <View style={styles.eyeLeft} />
              <View style={styles.eyeRight} />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Debug Panel - Remove this in production */}
      {__DEV__ && (
        <View style={{ backgroundColor: '#f0f0f0', padding: 10, margin: 16, borderRadius: 8 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Debug Info:</Text>
          <Text>Schedules count: {scheduleData.length} (mock if API fails)</Text>
          <Text>Lessons count: {lessonsData.length} (from database only)</Text>
          <Text>Loading: {loading.toString()}</Text>
          <Text>First lesson ID: {lessonsData[0]?.id || 'N/A'}</Text>
          <Text>API URL: {API.create().axiosInstance?.defaults?.baseURL || 'N/A'}</Text>
        </View>
      )}

      {/* Schedule Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Lịch học</Text>
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => navigation.navigate('Schedule')}
          >
            <Text style={styles.seeMoreText}>Xem thêm</Text>
            <ChevronRight size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {scheduleData.length > 0 ? (
          // Hiển thị lịch học gần nhất (1 lịch đầu tiên)
          <TouchableOpacity
            style={styles.scheduleCard}
            onPress={() => navigation.navigate('Schedule')}
            activeOpacity={0.8}
          >
            <View style={styles.scheduleCardHeader}>
              <View style={styles.timeContainer}>
                <Text style={styles.scheduleTime}>
                  {formatTimeRange(scheduleData[0].startTime, scheduleData[0].endTime)}
                  <Text style={styles.timeZone}> (JST)</Text>
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(scheduleData[0].status) },
                ]}
              >
                <Text style={styles.statusText}>Sắp diễn ra</Text>
              </View>
            </View>

            <View style={styles.scheduleCardContent}>
              <View style={styles.scheduleInfo}>
                <Text style={styles.scheduleTitle}>
                  {scheduleData[0].title || scheduleData[0].lessonTitle || 'Luyện nghe JLPT'}
                </Text>
                <View style={styles.scheduleDetails}>
                  <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{scheduleData[0].level || 'N3'}</Text>
                  </View>
                  <Text style={styles.durationText}>{scheduleData[0].duration || '45'} phút</Text>
                </View>
              </View>
              <View style={styles.teacherAvatar}>
                <View style={styles.avatarPlaceholder} />
                <View style={styles.onlineIndicator} />
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.emptyCard}
            onPress={() => navigation.navigate('Schedule')}
            activeOpacity={0.8}
          >
            <Clock size={32} color="#6B7280" />
            <Text style={styles.emptyText}>Chưa có lịch học nào</Text>
            <Text style={styles.emptySubtext}>Lịch học sẽ được cập nhật sớm</Text>
            <View style={styles.emptyAction}>
              <Text style={styles.emptyActionText}>Xem tất cả lịch học</Text>
              <ChevronRight size={16} color="#3B82F6" />
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Lessons Section */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bài học</Text>
          <TouchableOpacity
            style={styles.seeMoreButton}
            onPress={() => navigation.navigate('MyLesson')}
          >
            <Text style={styles.seeMoreText}>Xem thêm</Text>
            <ChevronRight size={16} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {lessonsData.length > 0 ? (
          // Hiển thị bài học đầu tiên từ database với thiết kế mới
          <TouchableOpacity
            style={[
              styles.lessonCard,
              lessonsData[0].status === 'locked' ? styles.lockedCard : null,
            ]}
            onPress={() => navigation.navigate('LessonDetail', { lessonId: lessonsData[0].id })}
            disabled={lessonsData[0].status === 'locked'}
            activeOpacity={0.8}
          >
            <View style={styles.lessonCardContent}>
              <View style={styles.lessonInfo}>
                {/* Lesson Title */}
                <Text style={styles.lessonTitle}>
                  {lessonsData[0].title || lessonsData[0].name || 'Bài học tiếng Nhật'}
                </Text>

                {/* Lesson Description */}
                <Text style={styles.lessonDescription}>
                  {lessonsData[0].description || 'Mô tả bài học'}
                </Text>

                {/* Lesson Meta Info */}
                <View style={styles.lessonMeta}>
                  <View style={styles.metaItem}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.metaText}>
                      {lessonsData[0].duration || lessonsData[0].estimatedTime || '30'} phút
                    </Text>
                  </View>
                  <View style={styles.metaItem}>
                    <FileText size={16} color="#6B7280" />
                    <Text style={styles.metaText}>{lessonsData[0].type || 'Video + Slide'}</Text>
                  </View>
                </View>

                {/* Progress Bar - chỉ hiển thị cho bài available/completed */}
                {lessonsData[0].status !== 'locked' && (
                  <View style={styles.progressSection}>
                    <View style={styles.progressHeader}>
                      <Text style={styles.progressLabel}>
                        {lessonsData[0].completed ? 'Hoàn thành' : 'Tiến độ'}
                      </Text>
                      <Text style={styles.progressPercent}>
                        {lessonsData[0].progress || (lessonsData[0].completed ? '100' : '0')}%
                      </Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                      <View
                        style={[
                          styles.progressBar,
                          {
                            width: `${lessonsData[0].progress || (lessonsData[0].completed ? 100 : 0)}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>
                )}
              </View>

              {/* Status Icon */}
              <View style={styles.statusIconContainer}>
                {getStatusIcon(
                  lessonsData[0].status || (lessonsData[0].completed ? 'completed' : 'available')
                )}
              </View>
            </View>
          </TouchableOpacity>
        ) : (
          // Empty state với thiết kế tương tự như schedule card
          <TouchableOpacity
            style={styles.emptyCard}
            onPress={() => navigation.navigate('MyLesson')}
            activeOpacity={0.8}
          >
            <BookOpen size={32} color="#6B7280" />
            <Text style={styles.emptyText}>Chưa có bài học nào</Text>
            <Text style={styles.emptySubtext}>Bài học sẽ được cập nhật sớm</Text>
            <View style={styles.emptyAction}>
              <Text style={styles.emptyActionText}>Xem tất cả bài học</Text>
              <ChevronRight size={16} color="#3B82F6" />
            </View>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => ({
  account: state.account.account,
});

const mapDispatchToProps = (_dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
