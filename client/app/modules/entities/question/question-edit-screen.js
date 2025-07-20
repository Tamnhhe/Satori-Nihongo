import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import QuestionActions from './question.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './question-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  content: Yup.string().required(),
  correctAnswer: Yup.string().required(),
  type: Yup.string().required(),
});

function QuestionEditScreen(props) {
  const { getQuestion, updateQuestion, route, question, fetching, updating, errorUpdating, updateSuccess, navigation, reset } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getQuestion(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getQuestion, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(question));
    }
  }, [question, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {}, []);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('QuestionDetail', { entityId: question?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateQuestion(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const contentRef = createRef();
  const imageUrlRef = createRef();
  const suggestionRef = createRef();
  const answerExplanationRef = createRef();
  const correctAnswerRef = createRef();
  const typeRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="questionEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}
      >
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="content"
              ref={contentRef}
              label="Content"
              placeholder="Enter Content"
              testID="contentInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => imageUrlRef.current?.focus()}
            />
            <FormField
              name="imageUrl"
              ref={imageUrlRef}
              label="Image Url"
              placeholder="Enter Image Url"
              testID="imageUrlInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => suggestionRef.current?.focus()}
            />
            <FormField
              name="suggestion"
              ref={suggestionRef}
              label="Suggestion"
              placeholder="Enter Suggestion"
              testID="suggestionInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => answerExplanationRef.current?.focus()}
            />
            <FormField
              name="answerExplanation"
              ref={answerExplanationRef}
              label="Answer Explanation"
              placeholder="Enter Answer Explanation"
              testID="answerExplanationInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => correctAnswerRef.current?.focus()}
            />
            <FormField
              name="correctAnswer"
              ref={correctAnswerRef}
              label="Correct Answer"
              placeholder="Enter Correct Answer"
              testID="correctAnswerInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => typeRef.current?.focus()}
            />
            <FormField
              name="type"
              ref={typeRef}
              label="Type"
              placeholder="Enter Type"
              testID="typeInput"
              inputType="text"
              autoCapitalize="none"
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
    content: value.content ?? null,
    imageUrl: value.imageUrl ?? null,
    suggestion: value.suggestion ?? null,
    answerExplanation: value.answerExplanation ?? null,
    correctAnswer: value.correctAnswer ?? null,
    type: value.type ?? null,
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    content: value.content ?? null,
    imageUrl: value.imageUrl ?? null,
    suggestion: value.suggestion ?? null,
    answerExplanation: value.answerExplanation ?? null,
    correctAnswer: value.correctAnswer ?? null,
    type: value.type ?? null,
  };
  return entity;
};

const mapStateToProps = state => {
  return {
    question: state.questions.question,
    fetching: state.questions.fetchingOne,
    updating: state.questions.updating,
    updateSuccess: state.questions.updateSuccess,
    errorUpdating: state.questions.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getQuestion: id => dispatch(QuestionActions.questionRequest(id)),
    getAllQuestions: options => dispatch(QuestionActions.questionAllRequest(options)),
    updateQuestion: question => dispatch(QuestionActions.questionUpdateRequest(question)),
    reset: () => dispatch(QuestionActions.questionReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionEditScreen);
