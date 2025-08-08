import React, { createRef } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { connect } from 'react-redux';
import * as Yup from 'yup';

import LoginActions from './login.reducer';
import { useDidUpdateEffect } from '../../shared/util/use-did-update-effect';
import FormButton from '../../shared/components/form/jhi-form-button';
import FormField from '../../shared/components/form/jhi-form-field';
import Form from '../../shared/components/form/jhi-form';
import styles from './login-screen.styles';

function LoginScreen(props) {
  const { account, navigation, fetching, loginError, attemptLogin } = props;
  // setup error state for displaying error messages
  const [error, setError] = React.useState('');

  // Navigate to Home when login is successful
  useDidUpdateEffect(() => {
    if (account !== null) {
      // Login thành công, navigate đến Home
      navigation.navigate('Home');
    }
  }, [account, navigation]);

  // skip the first render but check for API responses and show error if not fetching
  useDidUpdateEffect(() => {
    if (!fetching && loginError) {
      setError(loginError);
    }
  }, [fetching]);

  // submit handler
  const onSubmit = (data) => {
    setError('');
    attemptLogin(data.login, data.password);
  };

  // create refs for handling onSubmit functionality
  const passwordRef = createRef();
  const formRef = createRef();

  // set up validation schema for the form
  const validationSchema = Yup.object().shape({
    login: Yup.string().required('Vui lòng nhập tên đăng nhập').label('Tên đăng nhập'),
    password: Yup.string().required('Vui lòng nhập mật khẩu').label('Mật khẩu'),
  });

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      testID="loginScreen"
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
    >
      {!!error && (
        <Text testID="loginErrorMessage" style={styles.errorText}>
          {error}
        </Text>
      )}
      <Form
        initialValues={{ login: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        ref={formRef}
      >
        <FormField
          name="login"
          testID="loginScreenUsername"
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập"
          onSubmitEditing={() => passwordRef?.current?.focus()}
          autoCapitalize="none"
          textContentType="username"
        />
        <FormField
          ref={passwordRef}
          name="password"
          testID="loginScreenPassword"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          onSubmitEditing={() => formRef?.current?.submitForm()}
          textContentType="password"
        />
        <FormButton testID="loginScreenLoginButton" title={'Đăng nhập'} />
      </Form>

      {/* Nút quên mật khẩu */}
      <TouchableOpacity
        style={styles.forgotPasswordLink}
        onPress={() => navigation.navigate('Forgot Password')}
      >
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {/* Nút đăng ký */}
      <TouchableOpacity style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.registerLinkText}>Chưa có tài khoản? Đăng ký ngay</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const mapStateToProps = (state) => {
  return {
    account: state.account.account,
    fetching: state.login.fetching,
    loginError: state.login.error,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    attemptLogin: (username, password) => dispatch(LoginActions.loginRequest(username, password)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen);
