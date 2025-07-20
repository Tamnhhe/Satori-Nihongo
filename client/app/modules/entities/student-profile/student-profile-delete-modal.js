import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import StudentProfileActions from './student-profile.reducer';

import styles from './student-profile-styles';

function StudentProfileDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteStudentProfile(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('StudentProfile');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete StudentProfile {entity.id}?</Text>
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
    studentProfile: state.studentProfiles.studentProfile,
    fetching: state.studentProfiles.fetchingOne,
    deleting: state.studentProfiles.deleting,
    errorDeleting: state.studentProfiles.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getStudentProfile: id => dispatch(StudentProfileActions.studentProfileRequest(id)),
    getAllStudentProfiles: options => dispatch(StudentProfileActions.studentProfileAllRequest(options)),
    deleteStudentProfile: id => dispatch(StudentProfileActions.studentProfileDeleteRequest(id)),
    resetStudentProfiles: () => dispatch(StudentProfileActions.studentProfileReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfileDeleteModal);
