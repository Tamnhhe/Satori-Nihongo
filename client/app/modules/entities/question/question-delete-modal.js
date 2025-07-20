import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import QuestionActions from './question.reducer';

import styles from './question-styles';

function QuestionDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteQuestion(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Question');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Question {entity.id}?</Text>
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
    question: state.questions.question,
    fetching: state.questions.fetchingOne,
    deleting: state.questions.deleting,
    errorDeleting: state.questions.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getQuestion: id => dispatch(QuestionActions.questionRequest(id)),
    getAllQuestions: options => dispatch(QuestionActions.questionAllRequest(options)),
    deleteQuestion: id => dispatch(QuestionActions.questionDeleteRequest(id)),
    resetQuestions: () => dispatch(QuestionActions.questionReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionDeleteModal);
