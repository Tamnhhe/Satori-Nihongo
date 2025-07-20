import React, { createRef } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import SocialAccountActions from './social-account.reducer';
import UserProfileActions from '../user-profile/user-profile.reducer';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './social-account-styles';

// set up validation schema for the form
const validationSchema = Yup.object().shape({
  provider: Yup.string().required(),
  providerUserId: Yup.string().required().max(100),
  accessToken: Yup.string().max(500),
  refreshToken: Yup.string().max(500),
});

const AuthProvider = [
  {
    label: 'LOCAL',
    value: 'LOCAL',
  },
  {
    label: 'GOOGLE',
    value: 'GOOGLE',
  },
  {
    label: 'FACEBOOK',
    value: 'FACEBOOK',
  },
  {
    label: 'GITHUB',
    value: 'GITHUB',
  },
];

function SocialAccountEditScreen(props) {
  const {
    getSocialAccount,
    updateSocialAccount,
    route,
    socialAccount,
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
      getSocialAccount(route.params.entityId);
    } else {
      reset();
    }
  }, [isNewEntity, getSocialAccount, route, reset]);

  React.useEffect(() => {
    if (isNewEntity) {
      setFormValue(entityToFormValue({}));
    } else if (!fetching) {
      setFormValue(entityToFormValue(socialAccount));
    }
  }, [socialAccount, fetching, isNewEntity]);

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
        isNewEntity || !navigation.canGoBack()
          ? navigation.replace('SocialAccountDetail', { entityId: socialAccount?.id })
          : navigation.pop();
      }
    }
  }, [updateSuccess, errorUpdating, navigation]);

  const onSubmit = data => updateSocialAccount(formValueToEntity(data));

  if (fetching) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const formRef = createRef();
  const providerRef = createRef();
  const providerUserIdRef = createRef();
  const accessTokenRef = createRef();
  const refreshTokenRef = createRef();
  const tokenExpiryRef = createRef();
  const userProfileRef = createRef();

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        enableResetScrollToCoords={false}
        testID="socialAccountEditScrollView"
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.paddedScrollView}
      >
        {!!error && <Text style={styles.errorText}>{error}</Text>}
        {formValue && (
          <Form initialValues={formValue} validationSchema={validationSchema} onSubmit={onSubmit} ref={formRef}>
            <FormField
              name="provider"
              ref={providerRef}
              label="Provider"
              placeholder="Enter Provider"
              testID="providerInput"
              inputType="select-one"
              listItems={AuthProvider}
              onSubmitEditing={() => providerUserIdRef.current?.focus()}
            />
            <FormField
              name="providerUserId"
              ref={providerUserIdRef}
              label="Provider User Id"
              placeholder="Enter Provider User Id"
              testID="providerUserIdInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => accessTokenRef.current?.focus()}
            />
            <FormField
              name="accessToken"
              ref={accessTokenRef}
              label="Access Token"
              placeholder="Enter Access Token"
              testID="accessTokenInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => refreshTokenRef.current?.focus()}
            />
            <FormField
              name="refreshToken"
              ref={refreshTokenRef}
              label="Refresh Token"
              placeholder="Enter Refresh Token"
              testID="refreshTokenInput"
              inputType="text"
              autoCapitalize="none"
              onSubmitEditing={() => tokenExpiryRef.current?.focus()}
            />
            <FormField
              name="tokenExpiry"
              ref={tokenExpiryRef}
              label="Token Expiry"
              placeholder="Enter Token Expiry"
              testID="tokenExpiryInput"
              inputType="datetime"
            />
            <FormField
              name="userProfile"
              inputType="select-one"
              ref={userProfileRef}
              listItems={userProfileList}
              listItemLabelField="id"
              label="User Profile"
              placeholder="Select User Profile"
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
    provider: value.provider ?? null,
    providerUserId: value.providerUserId ?? null,
    accessToken: value.accessToken ?? null,
    refreshToken: value.refreshToken ?? null,
    tokenExpiry: value.tokenExpiry ?? null,
    userProfile: value.userProfile && value.userProfile.id ? value.userProfile.id : null,
  };
};
const formValueToEntity = value => {
  const entity = {
    id: value.id ?? null,
    provider: value.provider ?? null,
    providerUserId: value.providerUserId ?? null,
    accessToken: value.accessToken ?? null,
    refreshToken: value.refreshToken ?? null,
    tokenExpiry: value.tokenExpiry ?? null,
  };
  entity.userProfile = value.userProfile ? { id: value.userProfile } : null;
  return entity;
};

const mapStateToProps = state => {
  return {
    userProfileList: state.userProfiles.userProfileList ?? [],
    socialAccount: state.socialAccounts.socialAccount,
    fetching: state.socialAccounts.fetchingOne,
    updating: state.socialAccounts.updating,
    updateSuccess: state.socialAccounts.updateSuccess,
    errorUpdating: state.socialAccounts.errorUpdating,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllUserProfiles: options => dispatch(UserProfileActions.userProfileAllRequest(options)),
    getSocialAccount: id => dispatch(SocialAccountActions.socialAccountRequest(id)),
    getAllSocialAccounts: options => dispatch(SocialAccountActions.socialAccountAllRequest(options)),
    updateSocialAccount: socialAccount => dispatch(SocialAccountActions.socialAccountUpdateRequest(socialAccount)),
    reset: () => dispatch(SocialAccountActions.socialAccountReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SocialAccountEditScreen);
