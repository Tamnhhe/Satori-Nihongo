import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import CourseClassActions from './course-class.reducer';

import styles from './course-class-styles';

function CourseClassDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteCourseClass(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('CourseClass');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete CourseClass {entity.id}?</Text>
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
    courseClass: state.courseClasses.courseClass,
    fetching: state.courseClasses.fetchingOne,
    deleting: state.courseClasses.deleting,
    errorDeleting: state.courseClasses.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCourseClass: id => dispatch(CourseClassActions.courseClassRequest(id)),
    getAllCourseClasses: options => dispatch(CourseClassActions.courseClassAllRequest(options)),
    deleteCourseClass: id => dispatch(CourseClassActions.courseClassDeleteRequest(id)),
    resetCourseClasses: () => dispatch(CourseClassActions.courseClassReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseClassDeleteModal);
