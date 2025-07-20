import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import TeacherProfileActions from './teacher-profile.reducer';

import styles from './teacher-profile-styles';

function TeacherProfileDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteTeacherProfile(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('TeacherProfile');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete TeacherProfile {entity.id}?</Text>
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
    teacherProfile: state.teacherProfiles.teacherProfile,
    fetching: state.teacherProfiles.fetchingOne,
    deleting: state.teacherProfiles.deleting,
    errorDeleting: state.teacherProfiles.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeacherProfile: id => dispatch(TeacherProfileActions.teacherProfileRequest(id)),
    getAllTeacherProfiles: options => dispatch(TeacherProfileActions.teacherProfileAllRequest(options)),
    deleteTeacherProfile: id => dispatch(TeacherProfileActions.teacherProfileDeleteRequest(id)),
    resetTeacherProfiles: () => dispatch(TeacherProfileActions.teacherProfileReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherProfileDeleteModal);
