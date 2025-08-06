import React, { createRef, useState, useEffect } from 'react';
import { StyleSheet, Alert, View } from 'react-native';
import { Card, Title, Button, Text, Divider, ActivityIndicator } from 'react-native-paper';
import { connect } from 'react-redux';
import { useNavigation, useRoute } from '@react-navigation/native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

import UserProfileActions from '../entities/user-profile/user-profile.reducer';
import AccountActions from '../../shared/reducers/account.reducer';
import { useDidUpdateEffect } from '../../shared/util/use-did-update-effect';
import FormButton from '../../shared/components/form/jhi-form-button';
import FormField from '../../shared/components/form/jhi-form-field';
import Form from '../../shared/components/form/jhi-form';

function ProfileEditScreen(props) {
  const {
    account,
    updateUserProfile,
    createUserProfile,
    updating,
    updateSuccess,
    error,
    getAccount,
  } = props;
  const navigation = useNavigation();
  const route = useRoute();
  const { userProfile: existingProfile } = route.params || {};

  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Validation schema
  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required('Họ là bắt buộc').label('Họ'),
    lastName: Yup.string().required('Tên là bắt buộc').label('Tên'),
    phoneNumber: Yup.string()
      .matches(/^[0-9+\-\s]+$/, 'Số điện thoại không hợp lệ')
      .min(10, 'Số điện thoại phải có ít nhất 10 số')
      .label('Số điện thoại'),
    dateOfBirth: Yup.date().max(new Date(), 'Ngày sinh không thể là tương lai').label('Ngày sinh'),
  });

  // Form refs
  const formRef = createRef();
  const firstNameRef = createRef();
  const lastNameRef = createRef();
  const phoneNumberRef = createRef();
  const dateOfBirthRef = createRef();

  // Initial form data
  const getInitialData = () => ({
    firstName: existingProfile?.firstName || '',
    lastName: existingProfile?.lastName || '',
    phoneNumber: existingProfile?.phoneNumber || '',
    dateOfBirth: existingProfile?.dateOfBirth ? new Date(existingProfile.dateOfBirth) : null,
    role: existingProfile?.role || 'STUDENT',
  });

  useEffect(() => {
    if (!account) {
      getAccount();
    }
  }, [account, getAccount]);

  // Handle update/create success
  useDidUpdateEffect(() => {
    if (!updating) {
      if (error) {
        setFormError(error);
        setFormSuccess('');
      } else if (updateSuccess) {
        setFormSuccess('Cập nhật hồ sơ thành công!');
        setFormError('');
        // Navigate back after 2 seconds
        setTimeout(() => {
          navigation.goBack();
        }, 2000);
      }
    }
  }, [updating, error, updateSuccess]);

  const onSubmit = (data) => {
    setFormError('');
    setFormSuccess('');

    // Prepare data for submission
    const profileData = {
      ...data,
      dateOfBirth: data.dateOfBirth ? data.dateOfBirth.toISOString().split('T')[0] : null,
      user: account ? { id: account.id } : null,
    };

    if (existingProfile?.id) {
      // Update existing profile
      updateUserProfile({ ...profileData, id: existingProfile.id });
    } else {
      // Create new profile
      createUserProfile(profileData);
    }
  };

  const handleCancel = () => {
    Alert.alert('Hủy chỉnh sửa', 'Bạn có chắc chắn muốn hủy? Các thay đổi sẽ không được lưu.', [
      { text: 'Tiếp tục chỉnh sửa', style: 'cancel' },
      { text: 'Hủy', style: 'destructive', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      enableOnAndroid
    >
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>
            {existingProfile ? 'Chỉnh sửa hồ sơ' : 'Tạo hồ sơ cá nhân'}
          </Title>
          <Divider style={styles.divider} />

          {formError ? <Text style={styles.errorText}>{formError}</Text> : null}

          {formSuccess ? <Text style={styles.successText}>{formSuccess}</Text> : null}

          <Form
            initialValues={getInitialData()}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            ref={formRef}
          >
            <FormField
              name="firstName"
              ref={firstNameRef}
              label="Họ *"
              placeholder="Nhập họ của bạn"
              testID="firstNameInput"
              inputType="text"
              autoCapitalize="words"
              onSubmitEditing={() => lastNameRef.current?.focus()}
              blurOnSubmit={false}
            />

            <FormField
              name="lastName"
              ref={lastNameRef}
              label="Tên *"
              placeholder="Nhập tên của bạn"
              testID="lastNameInput"
              inputType="text"
              autoCapitalize="words"
              onSubmitEditing={() => phoneNumberRef.current?.focus()}
              blurOnSubmit={false}
            />

            <FormField
              name="phoneNumber"
              ref={phoneNumberRef}
              label="Số điện thoại"
              placeholder="Nhập số điện thoại"
              testID="phoneNumberInput"
              inputType="text"
              keyboardType="phone-pad"
              onSubmitEditing={() => dateOfBirthRef.current?.focus()}
              blurOnSubmit={false}
            />

            <FormField
              name="dateOfBirth"
              ref={dateOfBirthRef}
              label="Ngày sinh"
              placeholder="Chọn ngày sinh"
              testID="dateOfBirthInput"
              inputType="date"
            />

            <View style={styles.buttonContainer}>
              <Button
                mode="outlined"
                onPress={handleCancel}
                style={[styles.button, styles.cancelButton]}
                disabled={updating}
              >
                Hủy
              </Button>

              <FormButton
                title={existingProfile ? 'Cập nhật' : 'Tạo hồ sơ'}
                testID="submitButton"
                style={[styles.button, styles.submitButton]}
                disabled={updating}
              />
            </View>

            {updating && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1976D2" />
                <Text style={styles.loadingText}>Đang xử lý...</Text>
              </View>
            )}
          </Form>
        </Card.Content>
      </Card>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  card: {
    elevation: 2,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  divider: {
    marginBottom: 20,
  },
  errorText: {
    color: '#F44336',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  successText: {
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
  },
  cancelButton: {
    borderColor: '#F44336',
  },
  submitButton: {
    backgroundColor: '#1976D2',
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  loadingText: {
    marginTop: 8,
    color: '#666',
  },
});

const mapStateToProps = (state) => ({
  account: state.account.account,
  userProfile: state.userProfiles,
  updating: state.userProfiles.updating,
  updateSuccess: state.userProfiles.updateSuccess,
  error: state.userProfiles.errorUpdating,
});

const mapDispatchToProps = (dispatch) => ({
  updateUserProfile: (userProfile) =>
    dispatch(UserProfileActions.userProfileUpdateRequest(userProfile)),
  createUserProfile: (userProfile) =>
    dispatch(UserProfileActions.userProfileUpdateRequest(userProfile)),
  getAccount: () => dispatch(AccountActions.accountRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileEditScreen);
