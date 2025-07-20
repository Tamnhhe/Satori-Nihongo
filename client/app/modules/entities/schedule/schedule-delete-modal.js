import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import ScheduleActions from './schedule.reducer';

import styles from './schedule-styles';

function ScheduleDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteSchedule(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Schedule');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Schedule {entity.id}?</Text>
          </View>
          <View style={[styles.flexRow]}>
            <TouchableHighlight
              style={[styles.openButton, styles.cancelButton]}
              onPress={() => {
                setVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.openButton, styles.submitButton]} onPress={deleteEntity} testID="deleteButton">
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const mapStateToProps = state => {
  return {
    schedule: state.schedules.schedule,
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

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleDeleteModal);
