import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import QuizQuestionActions from './quiz-question.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import QuizQuestionDeleteModal from './quiz-question-delete-modal';
import styles from './quiz-question-styles';

function QuizQuestionDetailScreen(props) {
  const { route, getQuizQuestion, navigation, quizQuestion, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = quizQuestion?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('QuizQuestion');
      } else {
        setDeleteModalVisible(false);
        getQuizQuestion(routeEntityId);
      }
    }, [routeEntityId, getQuizQuestion, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the QuizQuestion.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="quizQuestionDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{quizQuestion.id}</Text>
      {/* Position Field */}
      <Text style={styles.label}>Position:</Text>
      <Text testID="position">{quizQuestion.position}</Text>
      <Text style={styles.label}>Quiz:</Text>
      <Text testID="quiz">{String(quizQuestion.quiz ? quizQuestion.quiz.id : '')}</Text>
      <Text style={styles.label}>Question:</Text>
      <Text testID="question">{String(quizQuestion.question ? quizQuestion.question.id : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('QuizQuestionEdit', { entityId })}
          accessibilityLabel={'QuizQuestion Edit Button'}
          testID="quizQuestionEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'QuizQuestion Delete Button'}
          testID="quizQuestionDeleteButton"
        />
        {deleteModalVisible && (
          <QuizQuestionDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={quizQuestion}
            testID="quizQuestionDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    quizQuestion: state.quizQuestions.quizQuestion,
    error: state.quizQuestions.errorOne,
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

export default connect(mapStateToProps, mapDispatchToProps)(QuizQuestionDetailScreen);
