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
            {/* Blue oval background */}
            <View style={styles.ovalBackground}>
              {/* Student image */}
              <Image
                source={require('../../../assets/IMG_3530.png')}
                style={styles.studentImage}
                resizeMode="contain"
              />
            </View>
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
    paddingHorizontal: 24,
    paddingTop: StatusBar.currentHeight + 40,
    paddingBottom: 32,
    justifyContent: 'space-between',
  },
  imageSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
  },
  ovalBackground: {
    width: 320,
    height: 380,
    borderRadius: 160,
    backgroundColor: '#87CEEB', // Light blue gradient start
    // Add gradient effect with multiple views if needed
    shadowColor: '#0EA5E9',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
    overflow: 'hidden',
  },
  studentImage: {
    width: 280,
    height: 350,
  },
  textSection: {
    alignItems: 'center',
    marginBottom: 64,
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
