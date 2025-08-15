import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Animated, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');

const SplashScreenComponent = () => {
  const navigation = useNavigation();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Keep splash screen visible
    SplashScreen.preventAutoHideAsync();

    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
    ]).start();

    // Navigate to Welcome screen after delay
    const timer = setTimeout(() => {
      try {
        SplashScreen.hideAsync();
        navigation.navigate('Auth');
      } catch (error) {
        console.log('Navigation error:', error);
        // Fallback: try again after a short delay
        setTimeout(() => {
          navigation.navigate('Auth');
        }, 500);
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [navigation, fadeAnim, scaleAnim]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#1E3A8A', '#1E40AF', '#1E3A8A']} // Navy blue gradient
        style={styles.gradient}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Image
            source={require('../../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
  },
});

export default SplashScreenComponent;
