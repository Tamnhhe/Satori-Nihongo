import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import QuizQuestionActions from './quiz-question.reducer';
import QuizActions from '../quiz/quiz.reducer';
import QuestionActions from '../question/question.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './quiz-question-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  position: Yup.number().required(),
});

function QuizQuestionEditScreen(props) {
  const {
    getQuizQuestion,
    updateQuizQuestion,
    route,
    quizQuestion,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllQuizzes,
    getAllQuestions,
    quizList,
    questionList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getQuizQuestion(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getQuizQuestion, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(quizQuestion));
    }
  }, [quizQuestion, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllQuizzes();
    getAllQuestions();
  }, [getAllQuizzes, getAllQuestions]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack()
          ? navigation.replace('QuizQuestionDetail', { entityId: quizQuestion?.id })
          : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateQuizQuestion(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const positionRef = createRef();
  const quizRef = createRef();
  const questionRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="quizQuestionEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}
      >
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="position"
              ref={positionRef}
              label="Position"
              placeholder="Enter Position"
              testID="positionInput"
              inputType="number"
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
              name="question"
              inputType="select-one"
              ref={questionRef}
              listItems={questionList}
              listItemLabelField="id"
              label="Question"
              placeholder="Select Question"
              testID="questionSelectInput"
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
    position: value.position ?? null,
    quiz: value.quiz && value.quiz.id ? value.quiz.id : null,
    question: value.question && value.question.id ? value.question.id : null,
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    position: value.position ?? null,
  };
  entity.quiz = value.quiz ? { id: value.quiz } : null;
  entity.question = value.question ? { id: value.question } : null;
  return entity;
};

const mapStateToProps = state => {
  return {
    quizList: state.quizzes.quizList ?? [],
    questionList: state.questions.questionList ?? [],
    quizQuestion: state.quizQuestions.quizQuestion,
    fetching: state.quizQuestions.fetchingOne,
    updating: state.quizQuestions.updating,
    updateSuccess: state.quizQuestions.updateSuccess,
    errorUpdating: state.quizQuestions.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllQuizzes: options => dispatch(QuizActions.quizAllRequest(options)),
    getAllQuestions: options => dispatch(QuestionActions.questionAllRequest(options)),
    getQuizQuestion: id => dispatch(QuizQuestionActions.quizQuestionRequest(id)),
    getAllQuizQuestions: options => dispatch(QuizQuestionActions.quizQuestionAllRequest(options)),
    updateQuizQuestion: quizQuestion => dispatch(QuizQuestionActions.quizQuestionUpdateRequest(quizQuestion)),
    reset: () => dispatch(QuizQuestionActions.quizQuestionReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizQuestionEditScreen);
