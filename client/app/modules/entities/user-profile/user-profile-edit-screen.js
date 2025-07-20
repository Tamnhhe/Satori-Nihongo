import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import UserProfileActions from './user-profile.reducer';
import TeacherProfileActions from '../teacher-profile/teacher-profile.reducer';
import StudentProfileActions from '../student-profile/student-profile.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './user-profile-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  username: Yup.string().required(),
  passwordHash: Yup.string().required(),
  email: Yup.string().required(),
  fullName: Yup.string().required(),
  role: Yup.string().required(),
});

const Role = [
  {
    label: 'ADMIN',
    value: 'ADMIN',
  },
  {
    label: 'GIANG_VIEN',
    value: 'GIANG_VIEN',
  },
  {
    label: 'HOC_VIEN',
    value: 'HOC_VIEN',
  },
];

function UserProfileEditScreen(props) {
  const {
    getUserProfile,
    updateUserProfile,
    route,
    userProfile,
    fetching,
    updating,
    errorUpdating,
    updateSuccess,
    navigation,
    reset,
    getAllTeacherProfiles,
    getAllStudentProfiles,
    teacherProfileList,
    studentProfileList,
  } = props;

  const [formValue, setFormValue] = React.useState();
  const [error, setError] = React.useState('');

  const isNewEntity = !(route.params && route.params.entityId);

  React.useEffect(() => {
    if (!isNewEntity) {
      getUserProfile(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getUserProfile, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(userProfile));
    }
  }, [userProfile, fetching, isNewEntity]);

  // fetch related entities
  React.useEffect(() => {
    getAllTeacherProfiles();
    getAllStudentProfiles();
  }, [getAllTeacherProfiles, getAllStudentProfiles]);

  useDidUpdateEffect(() => {
    if (updating === false) {
      if (errorUpdating) {
        setError(errorUpdating && errorUpdating.detail ? errorUpdating.detail : 'Something went wrong updating the entity');
      } else if (updateSuccess) {
        setError('');
        isNewEntity || !navigation.canGoBack() ? navigation.replace('UserProfileDetail', { entityId: userProfile?.id }) : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateUserProfile(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const usernameRef = createRef();
  const passwordHashRef = createRef();
  const emailRef = createRef();
  const fullNameRef = createRef();
  const genderRef = createRef();
  const roleRef = createRef();
  const teacherProfileRef = createRef();
  const studentProfileRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="userProfileEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}
      >
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="username"
              ref={usernameRef}
              label="Username"
              placeholder="Enter Username"
              testID="usernameInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => passwordHashRef.current?.focus()}
            />
            <FormField
              name="passwordHash"
              ref={passwordHashRef}
              label="Password Hash"
              placeholder="Enter Password Hash"
              testID="passwordHashInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            <FormField
              name="email"
              ref={emailRef}
              label="Email"
              placeholder="Enter Email"
              testID="emailInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => fullNameRef.current?.focus()}
            />
            <FormField
              name="fullName"
              ref={fullNameRef}
              label="Full Name"
              placeholder="Enter Full Name"
              testID="fullNameInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => genderRef.current?.focus()}
            />
            <FormField name="gender" ref={genderRef} label="Gender" placeholder="Enter Gender" testID="genderInput" inputType="boolean" />
            <FormField
              name="role"
              ref={roleRef}
              label="Role"
              placeholder="Enter Role"
              testID="roleInput"
              inputType="select-one"
              listItems={Role}
            />
            <FormField
              name="teacherProfile"
              inputType="select-one"
              ref={teacherProfileRef}
              listItems={teacherProfileList}
              listItemLabelField="id"
              label="Teacher Profile"
              placeholder="Select Teacher Profile"
              testID="teacherProfileSelectInput"
            />
            <FormField
              name="studentProfile"
              inputType="select-one"
              ref={studentProfileRef}
              listItems={studentProfileList}
              listItemLabelField="id"
              label="Student Profile"
              placeholder="Select Student Profile"
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
    username: value.username ?? null,
    passwordHash: value.passwordHash ?? null,
    email: value.email ?? null,
    fullName: value.fullName ?? null,
    gender: value.gender ?? null,
    role: value.role ?? null,
    teacherProfile: value.teacherProfile && value.teacherProfile.id ? value.teacherProfile.id : null,
    studentProfile: value.studentProfile && value.studentProfile.id ? value.studentProfile.id : null,
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    username: value.username ?? null,
    passwordHash: value.passwordHash ?? null,
    email: value.email ?? null,
    fullName: value.fullName ?? null,
    gender: value.gender === null ? false : Boolean(value.gender),
    role: value.role ?? null,
  };
  entity.teacherProfile = value.teacherProfile ? { id: value.teacherProfile } : null;
  entity.studentProfile = value.studentProfile ? { id: value.studentProfile } : null;
  return entity;
};

const mapStateToProps = state => {
  return {
    teacherProfileList: state.teacherProfiles.teacherProfileList ?? [],
    studentProfileList: state.studentProfiles.studentProfileList ?? [],
    userProfile: state.userProfiles.userProfile,
    fetching: state.userProfiles.fetchingOne,
    updating: state.userProfiles.updating,
    updateSuccess: state.userProfiles.updateSuccess,
    errorUpdating: state.userProfiles.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllTeacherProfiles: options => dispatch(TeacherProfileActions.teacherProfileAllRequest(options)),
    getAllStudentProfiles: options => dispatch(StudentProfileActions.studentProfileAllRequest(options)),
    getUserProfile: id => dispatch(UserProfileActions.userProfileRequest(id)),
    getAllUserProfiles: options => dispatch(UserProfileActions.userProfileAllRequest(options)),
    updateUserProfile: userProfile => dispatch(UserProfileActions.userProfileUpdateRequest(userProfile)),
    reset: () => dispatch(UserProfileActions.userProfileReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileEditScreen);
