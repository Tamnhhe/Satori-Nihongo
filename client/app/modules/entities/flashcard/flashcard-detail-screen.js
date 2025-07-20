import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import FlashcardActions from './flashcard.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import FlashcardDeleteModal from './flashcard-delete-modal';
import styles from './flashcard-styles';

function FlashcardDetailScreen(props) {
  const { route, getFlashcard, navigation, flashcard, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = flashcard?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Flashcard');
      } else {
        setDeleteModalVisible(false);
        getFlashcard(routeEntityId);
      }
    }, [routeEntityId, getFlashcard, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Flashcard.</Text>
      </View>
    );
  }
  if (!entityId || fetching || !correctEntityLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="flashcardDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{flashcard.id}</Text>
      {/* Term Field */}
      <Text style={styles.label}>Term:</Text>
      <Text testID="term">{flashcard.term}</Text>
      {/* Definition Field */}
      <Text style={styles.label}>Definition:</Text>
      <Text testID="definition">{flashcard.definition}</Text>
      {/* ImageUrl Field */}
      <Text style={styles.label}>ImageUrl:</Text>
      <Text testID="imageUrl">{flashcard.imageUrl}</Text>
      {/* Hint Field */}
      <Text style={styles.label}>Hint:</Text>
      <Text testID="hint">{flashcard.hint}</Text>
      {/* Position Field */}
      <Text style={styles.label}>Position:</Text>
      <Text testID="position">{flashcard.position}</Text>
      <Text style={styles.label}>Lesson:</Text>
      <Text testID="lesson">{String(flashcard.lesson ? flashcard.lesson.id : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('FlashcardEdit', { entityId })}
          accessibilityLabel={'Flashcard Edit Button'}
          testID="flashcardEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Flashcard Delete Button'}
          testID="flashcardDeleteButton"
        />
        {deleteModalVisible && (
          <FlashcardDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={flashcard}
            testID="flashcardDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    flashcard: state.flashcards.flashcard,
    error: state.flashcards.errorOne,
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

export default connect(mapStateToProps, mapDispatchToProps)(FlashcardDetailScreen);
