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
import { Bell, ChevronDown, Calendar, Clock, Video, User } from 'lucide-react-native';
import ScheduleActions from '../entities/schedule/schedule.reducer';
import API from '../../shared/services/api';
import styles from './schedule-screen.styles';

function ScheduleScreen(props) {
  const { navigation } = props;
  const [scheduleData, setScheduleData] = useState([]);
  const [tomorrowData, setTomorrowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedCard, setExpandedCard] = useState(0); // First card expanded by default

  // Create API instance
  const api = API.create();

  const loadScheduleData = async () => {
    try {
      setLoading(true);

      const schedulesResponse = await api.getAllSchedules({ page: 0, size: 100 });
      console.log('Schedules response:', schedulesResponse);

      if (schedulesResponse.ok && schedulesResponse.data) {
        const schedules = schedulesResponse.data?.content || schedulesResponse.data || [];

        // Transform backend data to match UI expectations
        const transformedSchedules = schedules.map((schedule, index) => ({
          id: schedule.id,
          time: formatTimeRange(schedule.startTime, schedule.endTime),
          timezone: 'JST',
          title: schedule.title || schedule.lessonTitle || `Luyện nghe JLPT`,
          level: schedule.level || 'N3',
          duration: `${schedule.duration || '45'} phút`,
          status: getScheduleStatus(schedule.startTime, schedule.endTime),
          statusText: getStatusText(getScheduleStatus(schedule.startTime, schedule.endTime)),
          teacher: {
            avatar: schedule.teacherAvatar || null,
            online: Math.random() > 0.5, // Random online status
          },
          description: schedule.description || 'Chi tiết buổi học',
          subtitle:
            schedule.subtitle ||
            'Học cách giao tiếp với đồng nghiệp và cấp trên trong môi trường công sở Nhật Bản.',
          tags: schedule.tags || ['敬語', '會議', '報告', '+5 từ vựng'],
          actionType: getActionType(getScheduleStatus(schedule.startTime, schedule.endTime)),
        }));

        // Separate today and tomorrow
        const today = transformedSchedules.filter((s) => s.status !== 'tomorrow');
        const tomorrow = transformedSchedules.filter((s) => s.status === 'tomorrow');

        setScheduleData(today.length > 0 ? today : getMockTodayData());
        setTomorrowData(tomorrow.length > 0 ? tomorrow : getMockTomorrowData());
      } else {
        console.error('Schedules API error:', schedulesResponse);
        // Set mock data when API fails
        setScheduleData(getMockTodayData());
        setTomorrowData(getMockTomorrowData());
      }
    } catch (error) {
      console.error('Error loading schedule data:', error);
      // Set mock data even on error
      setScheduleData(getMockTodayData());
      setTomorrowData(getMockTomorrowData());
      Alert.alert('Thông báo', 'Không thể kết nối server. Hiển thị dữ liệu mẫu.');
    } finally {
      setLoading(false);
    }
  };

  const getMockTodayData = () => [
    {
      id: 1,
      time: '19:30 - 20:15',
      timezone: 'JST',
      title: 'Giao tiếp khi đi làm',
      level: 'N4',
      duration: '45 phút',
      status: 'ongoing',
      statusText: 'Đang diễn ra',
      teacher: {
        avatar: null,
        online: true,
      },
      description: 'Chi tiết buổi học',
      subtitle: 'Học cách giao tiếp với đồng nghiệp và cấp trên trong môi trường công sở Nhật Bản.',
      tags: ['敬語', '會議', '報告', '+5 từ vựng'],
      actionType: 'join',
    },
    {
      id: 2,
      time: '21:00 - 21:45',
      timezone: 'JST',
      title: 'Luyện nghe JLPT',
      level: 'N3',
      duration: '45 phút',
      status: 'upcoming',
      statusText: 'Sắp diễn ra',
      teacher: {
        avatar: null,
        online: false,
      },
      actionType: 'remind',
    },
  ];

  const getMockTomorrowData = () => [
    {
      id: 3,
      time: '08:00 - 08:45',
      timezone: 'JST',
      title: 'Ngữ pháp cơ bản',
      level: '',
      duration: '45 phút',
      status: 'tomorrow',
      statusText: 'Ngày mai',
      teacher: {
        avatar: null,
        online: false,
      },
      actionType: 'none',
    },
  ];

  const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return '21:00 - 21:45';
    try {
      const start = new Date(startTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const end = new Date(endTime).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      return `${start} - ${end}`;
    } catch (error) {
      return '21:00 - 21:45';
    }
  };

  const getScheduleStatus = (startTime, endTime) => {
    const now = new Date();
    const start = new Date(startTime);
    const end = new Date(endTime);

    if (now >= start && now <= end) return 'ongoing';
    if (now < start) return 'upcoming';
    return 'tomorrow'; // Simplified logic
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ongoing':
        return 'Đang diễn ra';
      case 'upcoming':
        return 'Sắp diễn ra';
      case 'tomorrow':
        return 'Ngày mai';
      default:
        return 'Sắp diễn ra';
    }
  };

  const getActionType = (status) => {
    switch (status) {
      case 'ongoing':
        return 'join';
      case 'upcoming':
        return 'remind';
      default:
        return 'none';
    }
  };

  useEffect(() => {
    loadScheduleData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.debug('Schedule screen focused, loading schedules');
      loadScheduleData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadScheduleData();
    setRefreshing(false);
  };

  const handleJoinClass = (schedule) => {
    console.debug('Joining class:', schedule.title);
    // Navigate to video call or open meet URL
    Alert.alert('Tham gia lớp học', `Đang kết nối đến ${schedule.title}...`);
  };

  const handleSetReminder = (schedule) => {
    console.debug('Setting reminder for:', schedule.title);
    Alert.alert('Nhắc nhở', `Đã đặt nhắc nhở cho ${schedule.title} trước 15 phút.`);
  };

  const handleAddToCalendar = (schedule) => {
    console.debug('Adding to calendar:', schedule.title);
    Alert.alert('Thêm vào lịch', `Đã thêm ${schedule.title} vào lịch của bạn.`);
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text style={styles.loadingText}>Đang tải lịch học...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Lịch học</Text>
            <View style={styles.daysBadge}>
              <Text style={styles.daysBadgeText}>7 ngày</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Bell size={20} color="#ffffff" />
          </TouchableOpacity>
        </View>

        {/* Date Selector */}
        <View style={styles.dateSelector}>
          <View style={styles.dateSelectorLeft}>
            <Text style={styles.dateLabel}>Ngày:</Text>
            <TouchableOpacity style={styles.dateButton}>
              <Text style={styles.dateButtonText}>Hôm nay</Text>
              <ChevronDown size={16} color="#000000" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.calendarButton}>
            <Calendar size={20} color="#F97316" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Schedule List */}
      <ScrollView
        style={styles.scheduleContainer}
        contentContainerStyle={styles.scheduleContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      >
        {/* Today's Schedule */}
        {scheduleData.map((item, index) => (
          <ScheduleCard
            key={item.id}
            item={item}
            isExpanded={index === expandedCard}
            onJoinClass={() => handleJoinClass(item)}
            onSetReminder={() => handleSetReminder(item)}
            onAddToCalendar={() => handleAddToCalendar(item)}
          />
        ))}

        {/* Tomorrow Section */}
        <View style={styles.dividerSection}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Ngày mai</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Tomorrow's Schedule */}
        {tomorrowData.map((item) => (
          <ScheduleCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

// Schedule Card Component
const ScheduleCard = ({
  item,
  isExpanded = false,
  onJoinClass,
  onSetReminder,
  onAddToCalendar,
}) => (
  <View style={styles.scheduleCard}>
    {/* Time and Status */}
    <View style={styles.cardHeader}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>
          {item.time} <Text style={styles.timezoneText}>({item.timezone})</Text>
        </Text>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
        <Text style={styles.statusText}>{item.statusText}</Text>
      </View>
    </View>

    {/* Title and Teacher */}
    <View style={styles.cardContent}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.cardMeta}>
          {item.level ? (
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>{item.level}</Text>
            </View>
          ) : null}
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
      </View>
      <TeacherAvatar teacher={item.teacher} />
    </View>

    {/* Action Buttons */}
    {item.actionType === 'join' && (
      <>
        <TouchableOpacity style={styles.joinButton} onPress={onJoinClass}>
          <Video size={20} color="#ffffff" />
          <Text style={styles.joinButtonText}>Tham gia ngay</Text>
        </TouchableOpacity>

        {/* Expanded Details */}
        {isExpanded && (
          <View style={styles.expandedContent}>
            <View style={styles.expandedHeader}>
              <Text style={styles.expandedTitle}>{item.description}</Text>
              <TouchableOpacity style={styles.calendarAddButton} onPress={onAddToCalendar}>
                <Calendar size={16} color="#3B82F6" />
                <Text style={styles.calendarAddText}>Thêm vào lịch</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.expandedSubtitle}>{item.subtitle}</Text>

            {/* Tags */}
            <View style={styles.tagsContainer}>
              {item.tags?.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </>
    )}

    {item.actionType === 'remind' && (
      <TouchableOpacity style={styles.remindButton} onPress={onSetReminder}>
        <Clock size={20} color="#3B82F6" />
        <Text style={styles.remindButtonText}>Nhắc trước 15 phút</Text>
      </TouchableOpacity>
    )}
  </View>
);

// Teacher Avatar Component
const TeacherAvatar = ({ teacher }) => (
  <View style={styles.teacherContainer}>
    <View style={styles.teacherAvatar}>
      <User size={28} color="#6B7280" />
    </View>
    <View
      style={[styles.onlineIndicator, { backgroundColor: teacher.online ? '#10B981' : '#EF4444' }]}
    />
  </View>
);

// Helper function for status colors
const getStatusColor = (status) => {
  switch (status) {
    case 'ongoing':
      return '#EF4444';
    case 'upcoming':
      return '#FB923C';
    case 'tomorrow':
      return '#10B981';
    default:
      return '#6B7280';
  }
};

const mapStateToProps = (state) => ({
  scheduleList: state.schedules.scheduleList || [],
  fetching: state.schedules.fetchingAll,
  error: state.schedules.errorAll,
});

const mapDispatchToProps = (dispatch) => ({
  getAllSchedules: (options) => dispatch(ScheduleActions.scheduleAllRequest(options)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleScreen);
