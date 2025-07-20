import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import ScheduleActions from './schedule.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import ScheduleDeleteModal from './schedule-delete-modal';
import styles from './schedule-styles';

function ScheduleDetailScreen(props) {
  const { route, getSchedule, navigation, schedule, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = schedule?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Schedule');
      } else {
        setDeleteModalVisible(false);
        getSchedule(routeEntityId);
      }
    }, [routeEntityId, getSchedule, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Schedule.</Text>
      </View>
    );
  }
  if (!entityId || fetching || !correctEntityLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="scheduleDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{schedule.id}</Text>
      {/* Date Field */}
      <Text style={styles.label}>Date:</Text>
      <Text testID="date">{String(schedule.date)}</Text>
      {/* StartTime Field */}
      <Text style={styles.label}>StartTime:</Text>
      <Text testID="startTime">{String(schedule.startTime)}</Text>
      {/* EndTime Field */}
      <Text style={styles.label}>EndTime:</Text>
      <Text testID="endTime">{String(schedule.endTime)}</Text>
      {/* Location Field */}
      <Text style={styles.label}>Location:</Text>
      <Text testID="location">{schedule.location}</Text>
      <Text style={styles.label}>Course:</Text>
      <Text testID="course">{String(schedule.course ? schedule.course.id : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('ScheduleEdit', { entityId })}
          accessibilityLabel={'Schedule Edit Button'}
          testID="scheduleEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Schedule Delete Button'}
          testID="scheduleDeleteButton"
        />
        {deleteModalVisible && (
          <ScheduleDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={schedule}
            testID="scheduleDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    schedule: state.schedules.schedule,
    error: state.schedules.errorOne,
    fetching: state.schedules.fetchingOne,
    deleting: state.schedules.deleting,
    errorDeleting: state.schedules.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSchedule: id => dispatch(ScheduleActions.scheduleRequest(id)),
    getAllSchedules: options => dispatch(ScheduleActions.scheduleAllRequest(options)),
    deleteSchedule: id => dispatch(ScheduleActions.scheduleDeleteRequest(id)),
    resetSchedules: () => dispatch(ScheduleActions.scheduleReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDetailScreen);
