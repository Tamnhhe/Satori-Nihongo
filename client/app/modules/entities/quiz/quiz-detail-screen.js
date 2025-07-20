import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import QuizActions from './quiz.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import QuizDeleteModal from './quiz-delete-modal';
import styles from './quiz-styles';

function QuizDetailScreen(props) {
  const { route, getQuiz, navigation, quiz, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = quiz?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Quiz');
      } else {
        setDeleteModalVisible(false);
        getQuiz(routeEntityId);
      }
    }, [routeEntityId, getQuiz, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Quiz.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="quizDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{quiz.id}</Text>
      {/* Title Field */}
      <Text style={styles.label}>Title:</Text>
      <Text testID="title">{quiz.title}</Text>
      {/* Description Field */}
      <Text style={styles.label}>Description:</Text>
      <Text testID="description">{quiz.description}</Text>
      {/* IsTest Field */}
      <Text style={styles.label}>IsTest:</Text>
      <Text testID="isTest">{String(quiz.isTest)}</Text>
      {/* IsPractice Field */}
      <Text style={styles.label}>IsPractice:</Text>
      <Text testID="isPractice">{String(quiz.isPractice)}</Text>
      {/* QuizType Field */}
      <Text style={styles.label}>QuizType:</Text>
      <Text testID="quizType">{quiz.quizType}</Text>
      <Text style={styles.label}>Course:</Text>
      {quiz.courses &&
        quiz.courses.map((entity, index) => (
          <Text key={index} testID={`courses-${index}`}>
            {String(entity.id || '')}
          </Text>
        ))}
      <Text style={styles.label}>Lesson:</Text>
      {quiz.lessons &&
        quiz.lessons.map((entity, index) => (
          <Text key={index} testID={`lessons-${index}`}>
            {String(entity.id || '')}
          </Text>
        ))}

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('QuizEdit', { entityId })}
          accessibilityLabel={'Quiz Edit Button'}
          testID="quizEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Quiz Delete Button'}
          testID="quizDeleteButton"
        />
        {deleteModalVisible && (
          <QuizDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={quiz}
            testID="quizDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    quiz: state.quizzes.quiz,
    error: state.quizzes.errorOne,
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

export default connect(mapStateToProps, mapDispatchToProps)(QuizDetailScreen);
