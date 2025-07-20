import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import StudentQuizActions from './student-quiz.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import StudentQuizDeleteModal from './student-quiz-delete-modal';
import styles from './student-quiz-styles';

function StudentQuizDetailScreen(props) {
  const { route, getStudentQuiz, navigation, studentQuiz, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = studentQuiz?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('StudentQuiz');
      } else {
        setDeleteModalVisible(false);
        getStudentQuiz(routeEntityId);
      }
    }, [routeEntityId, getStudentQuiz, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the StudentQuiz.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="studentQuizDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{studentQuiz.id}</Text>
      {/* StartTime Field */}
      <Text style={styles.label}>StartTime:</Text>
      <Text testID="startTime">{String(studentQuiz.startTime)}</Text>
      {/* EndTime Field */}
      <Text style={styles.label}>EndTime:</Text>
      <Text testID="endTime">{String(studentQuiz.endTime)}</Text>
      {/* Score Field */}
      <Text style={styles.label}>Score:</Text>
      <Text testID="score">{studentQuiz.score}</Text>
      {/* Completed Field */}
      <Text style={styles.label}>Completed:</Text>
      <Text testID="completed">{String(studentQuiz.completed)}</Text>
      <Text style={styles.label}>Quiz:</Text>
      <Text testID="quiz">{String(studentQuiz.quiz ? studentQuiz.quiz.id : '')}</Text>
      <Text style={styles.label}>Student:</Text>
      <Text testID="student">{String(studentQuiz.student ? studentQuiz.student.id : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('StudentQuizEdit', { entityId })}
          accessibilityLabel={'StudentQuiz Edit Button'}
          testID="studentQuizEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'StudentQuiz Delete Button'}
          testID="studentQuizDeleteButton"
        />
        {deleteModalVisible && (
          <StudentQuizDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={studentQuiz}
            testID="studentQuizDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    studentQuiz: state.studentQuizs.studentQuiz,
    error: state.studentQuizs.errorOne,
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

export default connect(mapStateToProps, mapDispatchToProps)(StudentQuizDetailScreen);
