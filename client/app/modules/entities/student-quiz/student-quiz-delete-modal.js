import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import StudentQuizActions from './student-quiz.reducer';

import styles from './student-quiz-styles';

function StudentQuizDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteStudentQuiz(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('StudentQuiz');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete StudentQuiz {entity.id}?</Text>
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
    studentQuiz: state.studentQuizs.studentQuiz,
    fetching: state.studentQuizs.fetchingOne,
    deleting: state.studentQuizs.deleting,
    errorDeleting: state.studentQuizs.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getStudentQuiz: id => dispatch(StudentQuizActions.studentQuizRequest(id)),
    getAllStudentQuizs: options => dispatch(StudentQuizActions.studentQuizAllRequest(options)),
    deleteStudentQuiz: id => dispatch(StudentQuizActions.studentQuizDeleteRequest(id)),
    resetStudentQuizs: () => dispatch(StudentQuizActions.studentQuizReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentQuizDeleteModal);
