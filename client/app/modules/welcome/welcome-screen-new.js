import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, ArrowRight } from 'lucide-react-native';
import LoginActions from '../login/login.reducer';

const { width, height } = Dimensions.get('window');

function WelcomeScreen(props) {
  const navigation = useNavigation();
  const { resetLogoutFlag } = props;

  // Reset logout flag khi vào Welcome screen
  React.useEffect(() => {
    resetLogoutFlag();
  }, [resetLogoutFlag]);

  const handleEmailLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient colors={['#1B1B1F', '#2A2A2F', '#1B1B1F']} style={styles.gradient}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appTitle}>Satori Nihongo</Text>
          <Text style={styles.subtitle}>Khám phá và học tiếng Nhật một cách dễ dàng</Text>
        </View>

        {/* Login Options */}
        <View style={styles.loginContainer}>
          <TouchableOpacity
            style={styles.emailButton}
            onPress={handleEmailLogin}
            activeOpacity={0.8}
          >
            <View style={styles.buttonContent}>
              <Mail size={20} color="#FFFFFF" />
              <Text style={styles.buttonText}>Đăng nhập với Email</Text>
              <ArrowRight size={20} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.line} />
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleRegister}
            activeOpacity={0.8}
          >
            <Text style={styles.registerButtonText}>Tạo tài khoản mới</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Bằng cách tiếp tục, bạn đồng ý với {'\n'}
            <Text style={styles.linkText}>Điều khoản dịch vụ</Text> và{' '}
            <Text style={styles.linkText}>Chính sách bảo mật</Text>
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: StatusBar.currentHeight + 60,
    paddingBottom: 40,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 24,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  loginContainer: {
    marginTop: 40,
  },
  emailButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 24,
    shadowColor: '#4F46E5',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#404040',
  },
  dividerText: {
    color: '#B0B0B0',
    fontSize: 14,
    marginHorizontal: 16,
  },
  registerButton: {
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginTop: 32,
  },
  footerText: {
    fontSize: 14,
    color: '#B0B0B0',
    textAlign: 'center',
    lineHeight: 20,
  },
  linkText: {
    color: '#4F46E5',
    fontWeight: '600',
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
    resetLogoutFlag: () => dispatch(LoginActions.resetLogoutFlag()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
