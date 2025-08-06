import React, { createRef } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Yup from 'yup';

import RegisterActions from '../register/register.reducer';
import FormButton from '../../../shared/components/form/jhi-form-button';
import FormField from '../../../shared/components/form/jhi-form-field';
import Form from '../../../shared/components/form/jhi-form';
import { useDidUpdateEffect } from '../../../shared/util/use-did-update-effect';
import styles from './register-screen.styles';

function RegisterScreen(props) {
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const { navigation } = props;

  // set up validation schema for the form
  const validationSchema = Yup.object().shape({
    login: Yup.string().required('Vui lòng nhập tên đăng nhập').label('Tên đăng nhập'),
    password: Yup.string().required('Vui lòng nhập mật khẩu').label('Mật khẩu'),
    confirmPassword: Yup.string().required('Vui lòng xác nhận mật khẩu').label('Xác nhận mật khẩu'),
    email: Yup.string().required('Vui lòng nhập email').email('Email không hợp lệ').label('Email'),
  });

  const onSubmit = data => {
    setSuccess('');
    setError('');
    if (data.password !== data.confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }
    props.register(data);
  };

  useDidUpdateEffect(() => {
    if (!props.fetching) {
      if (props.error) {
        setError(props.error);
      } else {
        setSuccess('Vui lòng kiểm tra email của bạn');
      }
    }
  }, [props.fetching]);

  // create refs for handling onSubmit functionality
  const formRef = createRef();
  const emailRef = createRef();
  const passwordRef = createRef();
  const confirmPasswordRef = createRef();

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
      {!!error && <Text style={styles.errorText}>{error}</Text>}
      {!!success && <Text style={styles.successText}>{success}</Text>}
      <Form
        initialValues={{ login: '', email: '', confirmPassword: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        ref={formRef}
      >
        <FormField
          name="login"
          label="Tên đăng nhập"
          placeholder="Nhập tên đăng nhập"
          onSubmitEditing={() => emailRef?.current?.focus()}
          autoCapitalize="none"
          textContentType="username"
        />
        <FormField
          name="email"
          ref={emailRef}
          label="Email"
          placeholder="Nhập email"
          onSubmitEditing={() => passwordRef?.current?.focus()}
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="username"
        />
        <FormField
          ref={passwordRef}
          name="password"
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          onSubmitEditing={() => confirmPasswordRef?.current?.focus()}
          textContentType="password"
        />
        <FormField
          ref={confirmPasswordRef}
          name="confirmPassword"
          label="Xác nhận mật khẩu"
          placeholder="Nhập lại mật khẩu"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          onSubmitEditing={() => formRef?.current?.submitForm()}
          textContentType="password"
        />
        <FormButton title={'Đăng ký'} />
      </Form>

      {/* Nút đăng nhập */}
      <TouchableOpacity style={styles.loginLink} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.loginLinkText}>Đã có tài khoản? Đăng nhập ngay</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const mapStateToProps = state => {
  return {
    fetching: state.register.fetching,
    error: state.register.error,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    register: account => dispatch(RegisterActions.registerRequest(account)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterScreen);
