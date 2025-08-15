import React, { useState, createRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import LoginActions from './login.reducer';
import { useDidUpdateEffect } from '../../shared/util/use-did-update-effect';
import { authService } from '../../../utils/auth';

const { width, height } = Dimensions.get('window');

function LoginScreen(props) {
  const navigation = useNavigation();
  const { account, fetching, loginError, attemptLogin } = props;

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const passwordRef = createRef();

  // Navigate to Home when login is successful
  useDidUpdateEffect(() => {
    if (account !== null) {
      navigation.navigate('Home');
    }
  }, [account, navigation]);

  // Handle login error
  useDidUpdateEffect(() => {
    if (!fetching && loginError) {
      Alert.alert('Lỗi đăng nhập', loginError);
    }
  }, [fetching, loginError]);

  const handleEmailLogin = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setIsLoading(true);
    try {
      const success = await authService.login(formData.email, formData.password);
      if (success) {
        // Login with Redux
        attemptLogin(formData.email, formData.password);
      } else {
        Alert.alert('Lỗi', 'Thông tin đăng nhập không chính xác');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng nhập thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const success = await authService.loginWithGoogle();
      if (success) {
        navigation.navigate('Home');
      } else {
        Alert.alert('Lỗi', 'Đăng nhập Google thất bại');
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng nhập Google thất bại');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const goBack = () => {
    navigation.goBack();
  };

  const handleForgotPassword = () => {
    Alert.alert('Quên mật khẩu', 'Chức năng khôi phục mật khẩu sẽ được thêm sau!');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={goBack}>
          <ArrowLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng nhập</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <TextInput
              value={formData.email}
              onChangeText={(value) => handleInputChange('email', value)}
              placeholder="Email hoặc tên người dùng"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              style={styles.inputField}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <View style={styles.passwordContainer}>
              <TextInput
                ref={passwordRef}
                style={styles.passwordInput}
                value={formData.password}
                onChangeText={(value) => handleInputChange('password', value)}
                placeholder="Mật khẩu"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={handleEmailLogin}
              />
              <TouchableOpacity
                style={styles.eyeButton}
                onPress={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={20} color="#6B7280" />
                ) : (
                  <Eye size={20} color="#6B7280" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* Continue Button */}
          <TouchableOpacity
            style={[
              styles.continueButton,
              (!formData.email || !formData.password || isLoading) && styles.continueButtonDisabled,
            ]}
            onPress={handleEmailLogin}
            disabled={isLoading || !formData.email || !formData.password}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.continueButtonText}>Đăng nhập</Text>
            )}
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={handleForgotPassword}
            activeOpacity={0.7}
          >
            <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Section - Google Button */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.googleButton}
          onPress={handleGoogleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          <View style={styles.googleIconContainer}>
            <View style={styles.googleIconRed} />
            <View style={styles.googleIconBlue} />
            <View style={styles.googleIconYellow} />
            <View style={styles.googleIconGreen} />
          </View>
          <Text style={styles.googleButtonText}>Tiếp tục với Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#F8FAFC',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  form: {
    marginBottom: 40,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputField: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#FFFFFF',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  eyeButton: {
    padding: 16,
  },
  continueButton: {
    height: 56,
    backgroundColor: '#1E40AF',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  continueButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  forgotPasswordContainer: {
    alignItems: 'center',
  },
  forgotPasswordText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#3B82F6',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 56,
    backgroundColor: '#87CEEB',
    borderRadius: 16,
    paddingHorizontal: 20,
  },
  googleButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginLeft: 12,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    position: 'relative',
  },
  googleIconRed: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#EA4335',
    borderRadius: 2,
    top: 0,
    left: 0,
  },
  googleIconBlue: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#4285F4',
    borderRadius: 2,
    top: 0,
    right: 0,
  },
  googleIconYellow: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#FBBC04',
    borderRadius: 2,
    bottom: 0,
    left: 0,
  },
  googleIconGreen: {
    position: 'absolute',
    width: 12,
    height: 12,
    backgroundColor: '#34A853',
    borderRadius: 2,
    bottom: 0,
    right: 0,
  },
});

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
