import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import CourseActions from './course.reducer';

import styles from './course-styles';

function CourseDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteCourse(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Course');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Course {entity.id}?</Text>
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
    course: state.courses.course,
    fetching: state.courses.fetchingOne,
    deleting: state.courses.deleting,
    errorDeleting: state.courses.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCourse: id => dispatch(CourseActions.courseRequest(id)),
    getAllCourses: options => dispatch(CourseActions.courseAllRequest(options)),
    deleteCourse: id => dispatch(CourseActions.courseDeleteRequest(id)),
    resetCourses: () => dispatch(CourseActions.courseReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseDeleteModal);
