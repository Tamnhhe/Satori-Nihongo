import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';

import StudentQuizActions from './student-quiz.reducer';
import QuizActions from '../quiz/quiz.reducer';
import UserProfileActions from '../user-profile/user-profile.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './student-quiz-styles';

function StudentQuizEditScreen(props) {
  const {
    getStudentQuiz,
    updateStudentQuiz,
    route,
    studentQuiz,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllQuizzes,
    getAllUserProfiles,
    quizList,
    userProfileList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getStudentQuiz(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getStudentQuiz, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(studentQuiz));
    }
  }, [studentQuiz, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllQuizzes();
    getAllUserProfiles();
  }, [getAllQuizzes, getAllUserProfiles]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('StudentQuizDetail', { entityId: studentQuiz?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateStudentQuiz(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const startTimeRef = createRef();
  const endTimeRef = createRef();
  const scoreRef = createRef();
  const completedRef = createRef();
  const quizRef = createRef();
  const studentRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="studentQuizEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}
      >
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="startTime"
              ref={startTimeRef}
              label="Start Time"
              placeholder="Enter Start Time"
              testID="startTimeInput"
              inputType="datetime"
              onSubmitEditing={() => endTimeRef.current?.focus()}
            />
            <FormField
              name="endTime"
              ref={endTimeRef}
              label="End Time"
              placeholder="Enter End Time"
              testID="endTimeInput"
              inputType="datetime"
              onSubmitEditing={() => scoreRef.current?.focus()}
            />
            <FormField
              name="score"
              ref={scoreRef}
              label="Score"
              placeholder="Enter Score"
              testID="scoreInput"
              inputType="number"
              onSubmitEditing={() => completedRef.current?.focus()}
            />
            <FormField
              name="completed"
              ref={completedRef}
              label="Completed"
              placeholder="Enter Completed"
              testID="completedInput"
              inputType="boolean"
            />
            <FormField
              name="quiz"
              inputType="select-one"
              ref={quizRef}
              listItems={quizList}
              listItemLabelField="id"
              label="Quiz"
              placeholder="Select Quiz"
              testID="quizSelectInput"
            />
            <FormField
              name="student"
              inputType="select-one"
              ref={studentRef}
              listItems={userProfileList}
              listItemLabelField="id"
              label="Student"
              placeholder="Select Student"
              testID="userProfileSelectInput"
            />

            <FormButton title={'Save'} testID={'submitButton'} />
          </Form>
        )}
      </KeyboardAwareScrollView>
    </View>
  );
}

// convenience methods for customizing the mapping of the entity to/from the form value
const entityToFormValue = value => {
  if (!value) {
    return {};
  }
  return {
    id: value.id ?? null,
    startTime: value.startTime ?? null,
    endTime: value.endTime ?? null,
    score: value.score ?? null,
    completed: value.completed ?? null,
    quiz: value.quiz && value.quiz.id ? value.quiz.id : null,
    student: value.student && value.student.id ? value.student.id : null,
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    startTime: value.startTime ?? null,
    endTime: value.endTime ?? null,
    score: value.score ?? null,
    completed: value.completed === null ? false : Boolean(value.completed),
  };
  entity.quiz = value.quiz ? { id: value.quiz } : null;
  entity.student = value.student ? { id: value.student } : null;
  return entity;
};

const mapStateToProps = state => {
  return {
    quizList: state.quizzes.quizList ?? [],
    userProfileList: state.userProfiles.userProfileList ?? [],
    studentQuiz: state.studentQuizs.studentQuiz,
    fetching: state.studentQuizs.fetchingOne,
    updating: state.studentQuizs.updating,
    updateSuccess: state.studentQuizs.updateSuccess,
    errorUpdating: state.studentQuizs.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllQuizzes: options => dispatch(QuizActions.quizAllRequest(options)),
    getAllUserProfiles: options => dispatch(UserProfileActions.userProfileAllRequest(options)),
    getStudentQuiz: id => dispatch(StudentQuizActions.studentQuizRequest(id)),
    getAllStudentQuizs: options => dispatch(StudentQuizActions.studentQuizAllRequest(options)),
    updateStudentQuiz: studentQuiz => dispatch(StudentQuizActions.studentQuizUpdateRequest(studentQuiz)),
    reset: () => dispatch(StudentQuizActions.studentQuizReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentQuizEditScreen);
