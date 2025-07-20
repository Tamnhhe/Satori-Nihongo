import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import QuizActions from './quiz.reducer';
import CourseActions from '../course/course.reducer';
import LessonActions from '../lesson/lesson.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './quiz-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
  isTest: Yup.boolean().required(),
  isPractice: Yup.boolean().required(),
  quizType: Yup.string().required(),
});

const QuizType = [
  {
    label: 'COURSE',
    value: 'COURSE',
  },
  {
    label: 'LESSON',
    value: 'LESSON',
  },
];

function QuizEditScreen(props) {
  const {
    getQuiz,
    updateQuiz,
    route,
    quiz,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllCourses,
    getAllLessons,
    courseList,
    lessonList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getQuiz(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getQuiz, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(quiz));
    }
  }, [quiz, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllCourses();
    getAllLessons();
  }, [getAllCourses, getAllLessons]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('QuizDetail', { entityId: quiz?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateQuiz(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const titleRef = createRef();
  const descriptionRef = createRef();
  const isTestRef = createRef();
  const isPracticeRef = createRef();
  const quizTypeRef = createRef();
  const coursesRef = createRef();
  const lessonsRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="quizEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}
      >
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="title"
              ref={titleRef}
              label="Title"
              placeholder="Enter Title"
              testID="titleInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => descriptionRef.current?.focus()}
            />
            <FormField
              name="description"
              ref={descriptionRef}
              label="Description"
              placeholder="Enter Description"
              testID="descriptionInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => isTestRef.current?.focus()}
            />
            <FormField
              name="isTest"
              ref={isTestRef}
              label="Is Test"
              placeholder="Enter Is Test"
              testID="isTestInput"
              inputType="boolean"
              onSubmitEditing={() => isPracticeRef.current?.focus()}
            />
            <FormField
              name="isPractice"
              ref={isPracticeRef}
              label="Is Practice"
              placeholder="Enter Is Practice"
              testID="isPracticeInput"
              inputType="boolean"
            />
            <FormField
              name="quizType"
              ref={quizTypeRef}
              label="Quiz Type"
              placeholder="Enter Quiz Type"
              testID="quizTypeInput"
              inputType="select-one"
              listItems={QuizType}
            />
            <FormField
              name="courses"
              inputType="select-multiple"
              ref={coursesRef}
              listItems={courseList}
              listItemLabelField="id"
              label="Course"
              placeholder="Select Course"
              testID="courseSelectInput"
            />
            <FormField
              name="lessons"
              inputType="select-multiple"
              ref={lessonsRef}
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
    title: value.title ?? null,
    description: value.description ?? null,
    isTest: value.isTest ?? null,
    isPractice: value.isPractice ?? null,
    quizType: value.quizType ?? null,
    courses: value.courses?.map(i => i.id),
    lessons: value.lessons?.map(i => i.id),
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    title: value.title ?? null,
    description: value.description ?? null,
    isTest: value.isTest === null ? false : Boolean(value.isTest),
    isPractice: value.isPractice === null ? false : Boolean(value.isPractice),
    quizType: value.quizType ?? null,
  };
  entity.courses = value.courses.map(id => ({ id }));
  entity.lessons = value.lessons.map(id => ({ id }));
  return entity;
};

const mapStateToProps = state => {
  return {
    courseList: state.courses.courseList ?? [],
    lessonList: state.lessons.lessonList ?? [],
    quiz: state.quizzes.quiz,
    fetching: state.quizzes.fetchingOne,
    updating: state.quizzes.updating,
    updateSuccess: state.quizzes.updateSuccess,
    errorUpdating: state.quizzes.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllCourses: options => dispatch(CourseActions.courseAllRequest(options)),
    getAllLessons: options => dispatch(LessonActions.lessonAllRequest(options)),
    getQuiz: id => dispatch(QuizActions.quizRequest(id)),
    getAllQuizzes: options => dispatch(QuizActions.quizAllRequest(options)),
    updateQuiz: quiz => dispatch(QuizActions.quizUpdateRequest(quiz)),
    reset: () => dispatch(QuizActions.quizReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizEditScreen);
