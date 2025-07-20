import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import QuizActions from './quiz.reducer';

import styles from './quiz-styles';

function QuizDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteQuiz(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Quiz');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Quiz {entity.id}?</Text>
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
    quiz: state.quizzes.quiz,
    fetching: state.quizzes.fetchingOne,
    deleting: state.quizzes.deleting,
    errorDeleting: state.quizzes.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getQuiz: id => dispatch(QuizActions.quizRequest(id)),
    getAllQuizzes: options => dispatch(QuizActions.quizAllRequest(options)),
    deleteQuiz: id => dispatch(QuizActions.quizDeleteRequest(id)),
    resetQuizzes: () => dispatch(QuizActions.quizReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizDeleteModal);
