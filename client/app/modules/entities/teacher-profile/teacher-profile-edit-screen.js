import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import TeacherProfileActions from './teacher-profile.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './teacher-profile-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  teacherCode: Yup.string().required(),
});

function TeacherProfileEditScreen(props) {
  const {
    getTeacherProfile,
    updateTeacherProfile,
    route,
    teacherProfile,
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
      getTeacherProfile(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getTeacherProfile, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(teacherProfile));
    }
  }, [teacherProfile, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {}, []);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack()
          ? navigation.replace('TeacherProfileDetail', { entityId: teacherProfile?.id })
          : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateTeacherProfile(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const teacherCodeRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="teacherProfileEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}
      >
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="teacherCode"
              ref={teacherCodeRef}
              label="Teacher Code"
              placeholder="Enter Teacher Code"
              testID="teacherCodeInput"
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
    teacherCode: value.teacherCode ?? null,
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    teacherCode: value.teacherCode ?? null,
  };
  return entity;
};

const mapStateToProps = state => {
  return {
    teacherProfile: state.teacherProfiles.teacherProfile,
    fetching: state.teacherProfiles.fetchingOne,
    updating: state.teacherProfiles.updating,
    updateSuccess: state.teacherProfiles.updateSuccess,
    errorUpdating: state.teacherProfiles.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeacherProfile: id => dispatch(TeacherProfileActions.teacherProfileRequest(id)),
    getAllTeacherProfiles: options => dispatch(TeacherProfileActions.teacherProfileAllRequest(options)),
    updateTeacherProfile: teacherProfile => dispatch(TeacherProfileActions.teacherProfileUpdateRequest(teacherProfile)),
    reset: () => dispatch(TeacherProfileActions.teacherProfileReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherProfileEditScreen);
