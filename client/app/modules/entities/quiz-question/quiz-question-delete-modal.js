import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import QuizQuestionActions from './quiz-question.reducer';

import styles from './quiz-question-styles';

function QuizQuestionDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteQuizQuestion(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('QuizQuestion');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete QuizQuestion {entity.id}?</Text>
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
    quizQuestion: state.quizQuestions.quizQuestion,
    fetching: state.quizQuestions.fetchingOne,
    deleting: state.quizQuestions.deleting,
    errorDeleting: state.quizQuestions.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getQuizQuestion: id => dispatch(QuizQuestionActions.quizQuestionRequest(id)),
    getAllQuizQuestions: options => dispatch(QuizQuestionActions.quizQuestionAllRequest(options)),
    deleteQuizQuestion: id => dispatch(QuizQuestionActions.quizQuestionDeleteRequest(id)),
    resetQuizQuestions: () => dispatch(QuizQuestionActions.quizQuestionReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizQuestionDeleteModal);
