import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import QuestionActions from './question.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import QuestionDeleteModal from './question-delete-modal';
import styles from './question-styles';

function QuestionDetailScreen(props) {
  const { route, getQuestion, navigation, question, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = question?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Question');
      } else {
        setDeleteModalVisible(false);
        getQuestion(routeEntityId);
      }
    }, [routeEntityId, getQuestion, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Question.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="questionDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{question.id}</Text>
      {/* Content Field */}
      <Text style={styles.label}>Content:</Text>
      <Text testID="content">{question.content}</Text>
      {/* ImageUrl Field */}
      <Text style={styles.label}>ImageUrl:</Text>
      <Text testID="imageUrl">{question.imageUrl}</Text>
      {/* Suggestion Field */}
      <Text style={styles.label}>Suggestion:</Text>
      <Text testID="suggestion">{question.suggestion}</Text>
      {/* AnswerExplanation Field */}
      <Text style={styles.label}>AnswerExplanation:</Text>
      <Text testID="answerExplanation">{question.answerExplanation}</Text>
      {/* CorrectAnswer Field */}
      <Text style={styles.label}>CorrectAnswer:</Text>
      <Text testID="correctAnswer">{question.correctAnswer}</Text>
      {/* Type Field */}
      <Text style={styles.label}>Type:</Text>
      <Text testID="type">{question.type}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('QuestionEdit', { entityId })}
          accessibilityLabel={'Question Edit Button'}
          testID="questionEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Question Delete Button'}
          testID="questionDeleteButton"
        />
        {deleteModalVisible && (
          <QuestionDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={question}
            testID="questionDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    question: state.questions.question,
    error: state.questions.errorOne,
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

export default connect(mapStateToProps, mapDispatchToProps)(QuestionDetailScreen);
