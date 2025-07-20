import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import LessonActions from './lesson.reducer';

import styles from './lesson-styles';

function LessonDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteLesson(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Lesson');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Lesson {entity.id}?</Text>
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
    lesson: state.lessons.lesson,
    fetching: state.lessons.fetchingOne,
    deleting: state.lessons.deleting,
    errorDeleting: state.lessons.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getLesson: id => dispatch(LessonActions.lessonRequest(id)),
    getAllLessons: options => dispatch(LessonActions.lessonAllRequest(options)),
    deleteLesson: id => dispatch(LessonActions.lessonDeleteRequest(id)),
    resetLessons: () => dispatch(LessonActions.lessonReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LessonDeleteModal);
