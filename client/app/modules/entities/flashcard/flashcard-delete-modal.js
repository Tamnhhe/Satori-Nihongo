import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import FlashcardActions from './flashcard.reducer';

import styles from './flashcard-styles';

function FlashcardDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteFlashcard(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('Flashcard');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete Flashcard {entity.id}?</Text>
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
    flashcard: state.flashcards.flashcard,
    fetching: state.flashcards.fetchingOne,
    deleting: state.flashcards.deleting,
    errorDeleting: state.flashcards.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getFlashcard: id => dispatch(FlashcardActions.flashcardRequest(id)),
    getAllFlashcards: options => dispatch(FlashcardActions.flashcardAllRequest(options)),
    deleteFlashcard: id => dispatch(FlashcardActions.flashcardDeleteRequest(id)),
    resetFlashcards: () => dispatch(FlashcardActions.flashcardReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FlashcardDeleteModal);
