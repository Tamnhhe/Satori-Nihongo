import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import CourseActions from './course.reducer';
import UserProfileActions from '../user-profile/user-profile.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './course-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  title: Yup.string().required(),
});

function CourseEditScreen(props) {
  const {
    getCourse,
    updateCourse,
    route,
    course,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllUserProfiles,
    userProfileList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getCourse(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getCourse, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(course));
    }
  }, [course, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllUserProfiles();
  }, [getAllUserProfiles]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('CourseDetail', { entityId: course?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateCourse(formValueToEntity(data));

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
  const courseCodeRef = createRef();
  const teacherRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="courseEditScrollView"
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
              onSubmitEditing={() => courseCodeRef.current?.focus()}
            />
            <FormField
              name="courseCode"
              ref={courseCodeRef}
              label="Course Code"
              placeholder="Enter Course Code"
              testID="courseCodeInput"
              inputType="text"
              autoCapitalize="none"
            />
            <FormField
              name="teacher"
              inputType="select-one"
              ref={teacherRef}
              listItems={userProfileList}
              listItemLabelField="id"
              label="Teacher"
              placeholder="Select Teacher"
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
    title: value.title ?? null,
    description: value.description ?? null,
    courseCode: value.courseCode ?? null,
    teacher: value.teacher && value.teacher.id ? value.teacher.id : null,
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    title: value.title ?? null,
    description: value.description ?? null,
    courseCode: value.courseCode ?? null,
  };
  entity.teacher = value.teacher ? { id: value.teacher } : null;
  return entity;
};

const mapStateToProps = state => {
  return {
    userProfileList: state.userProfiles.userProfileList ?? [],
    course: state.courses.course,
    fetching: state.courses.fetchingOne,
    updating: state.courses.updating,
    updateSuccess: state.courses.updateSuccess,
    errorUpdating: state.courses.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllUserProfiles: options => dispatch(UserProfileActions.userProfileAllRequest(options)),
    getCourse: id => dispatch(CourseActions.courseRequest(id)),
    getAllCourses: options => dispatch(CourseActions.courseAllRequest(options)),
    updateCourse: course => dispatch(CourseActions.courseUpdateRequest(course)),
    reset: () => dispatch(CourseActions.courseReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseEditScreen);
