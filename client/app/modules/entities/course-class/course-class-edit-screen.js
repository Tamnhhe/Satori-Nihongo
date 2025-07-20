import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import CourseClassActions from './course-class.reducer';
import CourseActions from '../course/course.reducer';
import TeacherProfileActions from '../teacher-profile/teacher-profile.reducer';
import StudentProfileActions from '../student-profile/student-profile.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './course-class-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  code: Yup.string().required(),
  name: Yup.string().required(),
  startDate: Yup.date().required(),
  endDate: Yup.date().required(),
});

function CourseClassEditScreen(props) {
  const {
    getCourseClass,
    updateCourseClass,
    route,
    courseClass,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllCourses,
    getAllTeacherProfiles,
    getAllStudentProfiles,
    courseList,
    teacherProfileList,
    studentProfileList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getCourseClass(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getCourseClass, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(courseClass));
    }
  }, [courseClass, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllCourses();
    getAllTeacherProfiles();
    getAllStudentProfiles();
  }, [getAllCourses, getAllTeacherProfiles, getAllStudentProfiles]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('CourseClassDetail', { entityId: courseClass?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateCourseClass(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const codeRef = createRef();
  const nameRef = createRef();
  const descriptionRef = createRef();
  const startDateRef = createRef();
  const endDateRef = createRef();
  const capacityRef = createRef();
  const courseRef = createRef();
  const teacherRef = createRef();
  const studentsRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="courseClassEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}
      >
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="code"
              ref={codeRef}
              label="Code"
              placeholder="Enter Code"
              testID="codeInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => nameRef.current?.focus()}
            />
            <FormField
              name="name"
              ref={nameRef}
              label="Name"
              placeholder="Enter Name"
              testID="nameInput"
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
              onSubmitEditing={() => startDateRef.current?.focus()}
            />
            <FormField
              name="startDate"
              ref={startDateRef}
              label="Start Date"
              placeholder="Enter Start Date"
              testID="startDateInput"
              inputType="datetime"
              onSubmitEditing={() => endDateRef.current?.focus()}
            />
            <FormField
              name="endDate"
              ref={endDateRef}
              label="End Date"
              placeholder="Enter End Date"
              testID="endDateInput"
              inputType="datetime"
              onSubmitEditing={() => capacityRef.current?.focus()}
            />
            <FormField
              name="capacity"
              ref={capacityRef}
              label="Capacity"
              placeholder="Enter Capacity"
              testID="capacityInput"
              inputType="number"
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
            <FormField
              name="teacher"
              inputType="select-one"
              ref={teacherRef}
              listItems={teacherProfileList}
              listItemLabelField="id"
              label="Teacher"
              placeholder="Select Teacher"
              testID="teacherProfileSelectInput"
            />
            <FormField
              name="students"
              inputType="select-multiple"
              ref={studentsRef}
              listItems={studentProfileList}
              listItemLabelField="id"
              label="Students"
              placeholder="Select Students"
              testID="studentProfileSelectInput"
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
    code: value.code ?? null,
    name: value.name ?? null,
    description: value.description ?? null,
    startDate: value.startDate ?? null,
    endDate: value.endDate ?? null,
    capacity: value.capacity ?? null,
    course: value.course && value.course.id ? value.course.id : null,
    teacher: value.teacher && value.teacher.id ? value.teacher.id : null,
    students: value.students?.map(i => i.id),
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    code: value.code ?? null,
    name: value.name ?? null,
    description: value.description ?? null,
    startDate: value.startDate ?? null,
    endDate: value.endDate ?? null,
    capacity: value.capacity ?? null,
  };
  entity.course = value.course ? { id: value.course } : null;
  entity.teacher = value.teacher ? { id: value.teacher } : null;
  entity.students = value.students.map(id => ({ id }));
  return entity;
};

const mapStateToProps = state => {
  return {
    courseList: state.courses.courseList ?? [],
    teacherProfileList: state.teacherProfiles.teacherProfileList ?? [],
    studentProfileList: state.studentProfiles.studentProfileList ?? [],
    courseClass: state.courseClasses.courseClass,
    fetching: state.courseClasses.fetchingOne,
    updating: state.courseClasses.updating,
    updateSuccess: state.courseClasses.updateSuccess,
    errorUpdating: state.courseClasses.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllCourses: options => dispatch(CourseActions.courseAllRequest(options)),
    getAllTeacherProfiles: options => dispatch(TeacherProfileActions.teacherProfileAllRequest(options)),
    getAllStudentProfiles: options => dispatch(StudentProfileActions.studentProfileAllRequest(options)),
    getCourseClass: id => dispatch(CourseClassActions.courseClassRequest(id)),
    getAllCourseClasses: options => dispatch(CourseClassActions.courseClassAllRequest(options)),
    updateCourseClass: courseClass => dispatch(CourseClassActions.courseClassUpdateRequest(courseClass)),
    reset: () => dispatch(CourseClassActions.courseClassReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseClassEditScreen);
