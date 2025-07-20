import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import LessonActions from './lesson.reducer';
import CourseActions from '../course/course.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './lesson-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
});

function LessonEditScreen(props) {
  const {
    getLesson,
    updateLesson,
    route,
    lesson,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllCourses,
    courseList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getLesson(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getLesson, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(lesson));
    }
  }, [lesson, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllCourses();
  }, [getAllCourses]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('LessonDetail', { entityId: lesson?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateLesson(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const titleRef = createRef();
  const contentRef = createRef();
  const videoUrlRef = createRef();
  const slideUrlRef = createRef();
  const courseRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="lessonEditScrollView"
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
              onSubmitEditing={() => contentRef.current?.focus()}
            />
            <FormField
              name="content"
              ref={contentRef}
              label="Content"
              placeholder="Enter Content"
              testID="contentInput"
              onSubmitEditing={() => videoUrlRef.current?.focus()}
            />
            <FormField
              name="videoUrl"
              ref={videoUrlRef}
              label="Video Url"
              placeholder="Enter Video Url"
              testID="videoUrlInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => slideUrlRef.current?.focus()}
            />
            <FormField
              name="slideUrl"
              ref={slideUrlRef}
              label="Slide Url"
              placeholder="Enter Slide Url"
              testID="slideUrlInput"
              inputType="text"
              autoCapitalize="none"
            />
            <FormField
              name="course"
              inputType="select-one"
              ref={courseRef}
              listItems={courseList}
              listItemLabelField="id"
              label="Course"
              placeholder="Select Course"
              testID="courseSelectInput"
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
    content: value.content ?? null,
    videoUrl: value.videoUrl ?? null,
    slideUrl: value.slideUrl ?? null,
    course: value.course && value.course.id ? value.course.id : null,
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    title: value.title ?? null,
    content: value.content ?? null,
    videoUrl: value.videoUrl ?? null,
    slideUrl: value.slideUrl ?? null,
  };
  entity.course = value.course ? { id: value.course } : null;
  return entity;
};

const mapStateToProps = state => {
  return {
    courseList: state.courses.courseList ?? [],
    lesson: state.lessons.lesson,
    fetching: state.lessons.fetchingOne,
    updating: state.lessons.updating,
    updateSuccess: state.lessons.updateSuccess,
    errorUpdating: state.lessons.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllCourses: options => dispatch(CourseActions.courseAllRequest(options)),
    getLesson: id => dispatch(LessonActions.lessonRequest(id)),
    getAllLessons: options => dispatch(LessonActions.lessonAllRequest(options)),
    updateLesson: lesson => dispatch(LessonActions.lessonUpdateRequest(lesson)),
    reset: () => dispatch(LessonActions.lessonReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LessonEditScreen);
