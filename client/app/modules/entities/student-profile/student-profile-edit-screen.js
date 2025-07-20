import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import StudentProfileActions from './student-profile.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './student-profile-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  studentId: Yup.string().required(),
});

function StudentProfileEditScreen(props) {
  const {
    getStudentProfile,
    updateStudentProfile,
    route,
    studentProfile,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getStudentProfile(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getStudentProfile, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(studentProfile));
    }
  }, [studentProfile, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {}, []);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack()
          ? navigation.replace('StudentProfileDetail', { entityId: studentProfile?.id })
          : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateStudentProfile(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const studentIdRef = createRef();
  const gpaRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="studentProfileEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}
      >
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="studentId"
              ref={studentIdRef}
              label="Student Id"
              placeholder="Enter Student Id"
              testID="studentIdInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => gpaRef.current?.focus()}
            />
            <FormField name="gpa" ref={gpaRef} label="Gpa" placeholder="Enter Gpa" testID="gpaInput" inputType="number" />

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
    studentId: value.studentId ?? null,
    gpa: value.gpa ?? null,
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    studentId: value.studentId ?? null,
    gpa: value.gpa ?? null,
  };
  return entity;
};

const mapStateToProps = state => {
  return {
    studentProfile: state.studentProfiles.studentProfile,
    fetching: state.studentProfiles.fetchingOne,
    updating: state.studentProfiles.updating,
    updateSuccess: state.studentProfiles.updateSuccess,
    errorUpdating: state.studentProfiles.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getStudentProfile: id => dispatch(StudentProfileActions.studentProfileRequest(id)),
    getAllStudentProfiles: options => dispatch(StudentProfileActions.studentProfileAllRequest(options)),
    updateStudentProfile: studentProfile => dispatch(StudentProfileActions.studentProfileUpdateRequest(studentProfile)),
    reset: () => dispatch(StudentProfileActions.studentProfileReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfileEditScreen);
