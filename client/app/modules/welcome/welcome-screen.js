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
import { ArrowRight } from 'lucide-react-native';
import LoginActions from '../login/login.reducer';

const { width, height } = Dimensions.get('window');

function WelcomeScreen(props) {
  const navigation = useNavigation();
  const { resetLogoutFlag } = props;

  // Reset logout flag khi vào Welcome screen
  React.useEffect(() => {
    resetLogoutFlag();
  }, [resetLogoutFlag]);

  const handleContinue = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F3F4F6" />

      {/* Main Content */}
      <View style={styles.content}>
        {/* Image Section */}
        <View style={styles.imageSection}>
          <View style={styles.imageContainer}>
            {/* Blue oval background with gradient */}
            <LinearGradient
              colors={['#F0F8FF', '#87CEEB', '#3B82F6']} // Từ trắng gần như -> sky blue -> blue
              style={styles.ovalBackground}
            >
              {/* Student image */}
              <Image
                source={require('../../../assets/IMG_3530.png')}
                style={styles.studentImage}
                resizeMode="contain"
              />
            </LinearGradient>
          </View>
        </View>

        {/* Text Section */}
        <View style={styles.textSection}>
          <Text style={styles.welcomeText}>Hãy đăng nhập để{'\n'}bắt đầu học!</Text>
        </View>

        {/* Continue Button */}
        <View style={styles.buttonSection}>
          <TouchableOpacity
            style={styles.continueButton}
            onPress={handleContinue}
            activeOpacity={0.8}
          >
            <ArrowRight size={32} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Home Indicator */}
        <View style={styles.homeIndicator}>
          <View style={styles.indicatorBar} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Light gray background
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageSection: {
    alignItems: 'center',
    marginTop: -50, // Đưa oval lên đỉnh app
  },
  imageContainer: {
    position: 'relative',
  },
  ovalBackground: {
    width: width * 0.7, // 70% width của màn hình
    height: height * 0.6, // 60% chiều cao màn hình
    borderTopLeftRadius: width * 0.15, // Vòng cung trên bên trái
    borderTopRightRadius: width * 0.15, // Vòng cung trên bên phải
    borderBottomLeftRadius: width * 0.35, // Vòng cung dưới bên trái
    borderBottomRightRadius: width * 0.35, // Vòng cung dưới bên phải
    marginTop: 0, // Dính lên đỉnh
    shadowColor: '#0EA5E9',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    justifyContent: 'center', // Center image vertically
    alignItems: 'center',
    overflow: 'hidden',
  },
  studentImage: {
    width: width * 1.4, // 240% width của màn hình (80% * 3)
    height: height * 1.5, // 150% height của màn hình (50% * 3)
    marginTop: 50, // Điều chỉnh vị trí bạn nữ trong oval
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingHorizontal: 24,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '500',
    color: '#4B5563', // Gray-700
    textAlign: 'center',
    lineHeight: 36,
  },
  buttonSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  continueButton: {
    width: 80,
    height: 80,
    backgroundColor: '#1E3A8A', // Navy blue
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E3A8A',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  homeIndicator: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  indicatorBar: {
    width: 128,
    height: 4,
    backgroundColor: '#9CA3AF', // Gray-400
    borderRadius: 2,
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
