import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import FlashcardActions from './flashcard.reducer';
import LessonActions from '../lesson/lesson.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './flashcard-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  term: Yup.string().required(),
  position: Yup.number().required(),
});

function FlashcardEditScreen(props) {
  const {
    getFlashcard,
    updateFlashcard,
    route,
    flashcard,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllLessons,
    lessonList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getFlashcard(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getFlashcard, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(flashcard));
    }
  }, [flashcard, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllLessons();
  }, [getAllLessons]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('FlashcardDetail', { entityId: flashcard?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateFlashcard(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const termRef = createRef();
  const definitionRef = createRef();
  const imageUrlRef = createRef();
  const hintRef = createRef();
  const positionRef = createRef();
  const lessonRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="flashcardEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}
      >
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="term"
              ref={termRef}
              label="Term"
              placeholder="Enter Term"
              testID="termInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => definitionRef.current?.focus()}
            />
            <FormField
              name="definition"
              ref={definitionRef}
              label="Definition"
              placeholder="Enter Definition"
              testID="definitionInput"
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
              onSubmitEditing={() => hintRef.current?.focus()}
            />
            <FormField
              name="hint"
              ref={hintRef}
              label="Hint"
              placeholder="Enter Hint"
              testID="hintInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => positionRef.current?.focus()}
            />
            <FormField
              name="position"
              ref={positionRef}
              label="Position"
              placeholder="Enter Position"
              testID="positionInput"
              inputType="number"
            />
            <FormField
              name="lesson"
              inputType="select-one"
              ref={lessonRef}
              listItems={lessonList}
              listItemLabelField="id"
              label="Lesson"
              placeholder="Select Lesson"
              testID="lessonSelectInput"
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
    term: value.term ?? null,
    definition: value.definition ?? null,
    imageUrl: value.imageUrl ?? null,
    hint: value.hint ?? null,
    position: value.position ?? null,
    lesson: value.lesson && value.lesson.id ? value.lesson.id : null,
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    term: value.term ?? null,
    definition: value.definition ?? null,
    imageUrl: value.imageUrl ?? null,
    hint: value.hint ?? null,
    position: value.position ?? null,
  };
  entity.lesson = value.lesson ? { id: value.lesson } : null;
  return entity;
};

const mapStateToProps = state => {
  return {
    lessonList: state.lessons.lessonList ?? [],
    flashcard: state.flashcards.flashcard,
    fetching: state.flashcards.fetchingOne,
    updating: state.flashcards.updating,
    updateSuccess: state.flashcards.updateSuccess,
    errorUpdating: state.flashcards.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllLessons: options => dispatch(LessonActions.lessonAllRequest(options)),
    getFlashcard: id => dispatch(FlashcardActions.flashcardRequest(id)),
    getAllFlashcards: options => dispatch(FlashcardActions.flashcardAllRequest(options)),
    updateFlashcard: flashcard => dispatch(FlashcardActions.flashcardUpdateRequest(flashcard)),
    reset: () => dispatch(FlashcardActions.flashcardReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FlashcardEditScreen);
