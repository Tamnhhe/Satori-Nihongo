import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Title, Paragraph, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LoginActions from '../login/login.reducer';

function WelcomeScreen(props) {
  const navigation = useNavigation();
  const { resetLogoutFlag } = props;

  // Reset logout flag khi vào Welcome screen
  React.useEffect(() => {
    resetLogoutFlag();
  }, [resetLogoutFlag]);

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <MaterialCommunityIcons name="flower-tulip" size={100} color="#1976D2" />
        </View>

        {/* Welcome Card */}
        <Card style={styles.welcomeCard}>
          <Card.Content style={styles.cardContent}>
            <Title style={styles.welcomeTitle}>Chào mừng đến với</Title>
            <Title style={styles.appTitle}>Satori Nihongo</Title>
            <Paragraph style={styles.subtitle}>
              Khám phá và học tiếng Nhật một cách dễ dàng
            </Paragraph>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                contentStyle={styles.buttonContent}
                icon="login"
              >
                Đăng nhập
              </Button>

              <Button
                mode="outlined"
                onPress={handleRegister}
                style={styles.registerButton}
                contentStyle={styles.buttonContent}
                icon="account-plus"
              >
                Đăng ký
              </Button>
            </View>
          </Card.Content>
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 30,
    alignItems: 'center',
  },
  welcomeCard: {
    width: '100%',
    elevation: 4,
    borderRadius: 16,
  },
  cardContent: {
    alignItems: 'center',
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1976D2',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: '#666',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  loginButton: {
    borderRadius: 8,
  },
  registerButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
});

const mapStateToProps = (_state) => ({
  // No need to get account here since navigation handles auth state
});

const mapDispatchToProps = (dispatch) => ({
  resetLogoutFlag: () => dispatch(LoginActions.resetLogoutFlag()),
});

export default connect(mapStateToProps, mapDispatchToProps)(WelcomeScreen);
