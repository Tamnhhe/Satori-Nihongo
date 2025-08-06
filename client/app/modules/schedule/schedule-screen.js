import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import ScheduleActions from '../entities/schedule/schedule.reducer';
import ScheduleCalendar from '../../shared/components/calendar/schedule-calendar';
import styles from './schedule-screen.styles';

function ScheduleScreen(props) {
  const { scheduleList, fetching, error, getAllSchedules, navigation } = props;

  const theme = useTheme();
  const [viewMode, setViewMode] = useState('month');

  // Load schedules when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.debug('Schedule screen focused, loading schedules');
      getAllSchedules({ page: 0, size: 1000, sort: 'date,asc' });
    }, [getAllSchedules])
  );

  const handleSchedulePress = (schedule) => {
    console.debug(
      'ScheduleScreen: Schedule pressed, will open Google Meet and navigate to detail',
      {
        scheduleId: schedule.id,
        location: schedule.location,
        courseName: schedule.course?.title,
        meetUrl: schedule.meetUrl || 'Will extract from location',
      }
    );

    // Navigate to schedule detail (this happens before Google Meet opens)
    navigation.navigate('ScheduleDetail', { entityId: schedule.id });
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
  };

  if (fetching && scheduleList.length === 0) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.onBackground }]}>
          Đang tải lịch học...
        </Text>
      </View>
    );
  }

  if (error && scheduleList.length === 0) {
    return (
      <View style={[styles.errorContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.errorText, { color: theme.colors.error }]}>
          Không thể tải lịch học. Vui lòng thử lại.
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScheduleCalendar
        schedules={scheduleList}
        onSchedulePress={handleSchedulePress}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        navigation={navigation}
      />
    </View>
  );
}

const mapStateToProps = (state) => {
  return {
    scheduleList: state.schedules.scheduleList || [],
    fetching: state.schedules.fetchingAll,
    error: state.schedules.errorAll,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getAllSchedules: (options) => dispatch(ScheduleActions.scheduleAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleScreen);
