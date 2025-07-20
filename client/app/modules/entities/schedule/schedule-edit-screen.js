import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import ScheduleActions from './schedule.reducer';
import CourseActions from '../course/course.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './schedule-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  date: Yup.date().required(),
  startTime: Yup.date().required(),
  endTime: Yup.date().required(),
});

function ScheduleEditScreen(props) {
  const {
    getSchedule,
    updateSchedule,
    route,
    schedule,
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
      getSchedule(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getSchedule, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(schedule));
    }
  }, [schedule, fetching, isNewEntity]);

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
        isNewEntity || !navigation.canGoBack() ? navigation.replace('ScheduleDetail', { entityId: schedule?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateSchedule(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const dateRef = createRef();
  const startTimeRef = createRef();
  const endTimeRef = createRef();
  const locationRef = createRef();
  const courseRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="scheduleEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}
      >
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="date"
              ref={dateRef}
              label="Date"
              placeholder="Enter Date"
              testID="dateInput"
              inputType="datetime"
              onSubmitEditing={() => startTimeRef.current?.focus()}
            />
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
              onSubmitEditing={() => locationRef.current?.focus()}
            />
            <FormField
              name="location"
              ref={locationRef}
              label="Location"
              placeholder="Enter Location"
              testID="locationInput"
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
    date: value.date ?? null,
    startTime: value.startTime ?? null,
    endTime: value.endTime ?? null,
    location: value.location ?? null,
    course: value.course && value.course.id ? value.course.id : null,
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    date: value.date ?? null,
    startTime: value.startTime ?? null,
    endTime: value.endTime ?? null,
    location: value.location ?? null,
  };
  entity.course = value.course ? { id: value.course } : null;
  return entity;
};

const mapStateToProps = state => {
  return {
    courseList: state.courses.courseList ?? [],
    schedule: state.schedules.schedule,
    fetching: state.schedules.fetchingOne,
    updating: state.schedules.updating,
    updateSuccess: state.schedules.updateSuccess,
    errorUpdating: state.schedules.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllCourses: options => dispatch(CourseActions.courseAllRequest(options)),
    getSchedule: id => dispatch(ScheduleActions.scheduleRequest(id)),
    getAllSchedules: options => dispatch(ScheduleActions.scheduleAllRequest(options)),
    updateSchedule: schedule => dispatch(ScheduleActions.scheduleUpdateRequest(schedule)),
    reset: () => dispatch(ScheduleActions.scheduleReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleEditScreen);
