import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StatusBar, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

function LoadingScreen({ onComplete, title = 'Đang tải...', subtitle = 'Vui lòng chờ' }) {
  const spinValue = useRef(new Animated.Value(0)).current;
  const fadeValue = useRef(new Animated.Value(0)).current;
  const scaleValue = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Start animations
    Animated.parallel([
      // Fade in animation
      Animated.timing(fadeValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      // Scale up animation
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Spinning animation
    const spinAnimation = Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    );
    spinAnimation.start();

    // Auto transition after 3 seconds
    const timer = setTimeout(() => {
      if (onComplete) {
        onComplete();
      }
    }, 3000);

    return () => {
      clearTimeout(timer);
      spinAnimation.stop();
    };
  }, [onComplete]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A8A" />

      {/* Background Gradient */}
      <LinearGradient colors={['#1E3A8A', '#3B82F6', '#60A5FA']} style={styles.gradientBackground}>
        {/* Status Bar Space */}
        <View style={styles.statusBarSpace} />

        {/* Main Content */}
        <Animated.View
          style={[
            styles.content,
            {
              opacity: fadeValue,
              transform: [{ scale: scaleValue }],
            },
          ]}
        >
          {/* Loading Spinner Container */}
          <View style={styles.spinnerContainer}>
            {/* Outer Spinning Ring */}
            <Animated.View style={[styles.spinnerRing, { transform: [{ rotate: spin }] }]}>
              <View style={styles.outerRing} />
            </Animated.View>

            {/* Logo in Center */}
            <View style={styles.logoContainer}>
              <Image
                source={require('../../../assets/loading.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Loading Text */}
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {/* Dots Animation */}
          <View style={styles.dotsContainer}>
            <Animated.View style={[styles.dot, { opacity: fadeValue }]} />
            <Animated.View style={[styles.dot, { opacity: fadeValue }]} />
            <Animated.View style={[styles.dot, { opacity: fadeValue }]} />
          </View>
        </Animated.View>

        {/* Bottom Space */}
        <View style={styles.bottomSpace} />
      </LinearGradient>
    </View>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#1E3A8A',
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statusBarSpace: {
    height: 50,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  spinnerContainer: {
    width: 120,
    height: 120,
    marginBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerRing: {
    position: 'absolute',
    width: 120,
    height: 120,
  },
  outerRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: 'transparent',
    borderTopColor: '#ffffff',
    borderRightColor: '#ffffff',
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: {
    width: 50,
    height: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#E5E7EB',
    textAlign: 'center',
    marginBottom: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ffffff',
  },
  bottomSpace: {
    height: 80,
  },
};

export default LoadingScreen;
