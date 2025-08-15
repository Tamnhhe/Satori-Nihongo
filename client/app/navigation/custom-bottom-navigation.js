import React, { useRef, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Home, Calendar, BookOpen, Dumbbell, User } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const CustomBottomNavigation = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  // Animation values for each tab
  const scaleAnimations = useRef(
    Array(5)
      .fill()
      .map(() => new Animated.Value(1))
  ).current;

  const colorAnimations = useRef(
    Array(5)
      .fill()
      .map(() => new Animated.Value(0))
  ).current;

  const navItems = [
    {
      id: 'HomeTab',
      icon: Home,
      label: 'Trang chủ',
    },
    {
      id: 'Schedule',
      icon: Calendar,
      label: 'Lịch học',
    },
    {
      id: 'MyLesson',
      icon: BookOpen,
      label: 'Bài học',
      isCenter: true,
    },
    {
      id: 'Practice',
      icon: Dumbbell,
      label: 'Luyện tập',
    },
    {
      id: 'Profile',
      icon: User,
      label: 'Cá nhân',
    },
  ];

  // Effect to handle animation when tab changes
  useEffect(() => {
    scaleAnimations.forEach((anim, index) => {
      Animated.spring(anim, {
        toValue: state.index === index ? 1.1 : 1,
        useNativeDriver: true,
        tension: 300,
        friction: 10,
      }).start();
    });

    colorAnimations.forEach((anim, index) => {
      Animated.timing(anim, {
        toValue: state.index === index ? 1 : 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
    });
  }, [state.index]);

  // Function to handle press animation
  const handlePressIn = (index) => {
    Animated.spring(scaleAnimations[index], {
      toValue: 0.95,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const handlePressOut = (index) => {
    Animated.spring(scaleAnimations[index], {
      toValue: state.index === index ? 1.1 : 1,
      useNativeDriver: true,
      tension: 300,
      friction: 10,
    }).start();
  };

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      width: width, // Full screen width
      zIndex: 50,
    },
    outerContainer: {
      position: 'relative',
    },
    navigationWrapper: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: -4,
      },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 20,
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      position: 'relative',
    },
    notchContainer: {
      position: 'absolute',
      top: 0,
      left: '50%',
      transform: [{ translateX: -40 }, { translateY: -16 }], // Center and move up
      width: 80,
      height: 40,
      zIndex: 1,
    },
    // Left curve of notch
    leftCurve: {
      position: 'absolute',
      left: 0,
      top: 16,
      width: 24,
      height: 24,
      backgroundColor: '#FFFFFF',
    },
    leftCurveOverlay: {
      position: 'absolute',
      left: 0,
      top: 16,
      width: 24,
      height: 24,
      backgroundColor: '#F9FAFB',
      borderBottomRightRadius: 24,
    },
    // Center space of notch
    centerNotchSpace: {
      position: 'absolute',
      left: 24,
      top: 16,
      width: 32,
      height: 24,
      backgroundColor: '#F9FAFB',
    },
    // Right curve of notch
    rightCurve: {
      position: 'absolute',
      right: 0,
      top: 16,
      width: 24,
      height: 24,
      backgroundColor: '#FFFFFF',
    },
    rightCurveOverlay: {
      position: 'absolute',
      right: 0,
      top: 16,
      width: 24,
      height: 24,
      backgroundColor: '#F9FAFB',
      borderBottomLeftRadius: 24,
    },
    navContentContainer: {
      position: 'relative',
      paddingHorizontal: 16,
      paddingVertical: 12,
      paddingBottom: Math.max(insets.bottom, 12),
    },
    navContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    navItem: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 8,
      paddingHorizontal: 4, // Add horizontal padding to prevent clipping
      flex: 1,
      overflow: 'visible', // Ensure content is not clipped
    },
    animatedIconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 32, // Ensure minimum height to prevent clipping
      minWidth: 32, // Ensure minimum width to prevent clipping
    },
    centerSpace: {
      flex: 1,
      alignItems: 'center',
      paddingVertical: 24, // Extra padding for center space
    },
    labelText: {
      fontSize: 12,
      marginTop: 4,
      textAlign: 'center',
    },
    activeLabel: {
      color: '#F97316', // Orange-500
      fontWeight: '500',
    },
    inactiveLabel: {
      color: '#9CA3AF', // Gray-400
      fontWeight: 'normal',
    },
    // Center floating button - positioned closer to other tabs
    centerFloatingButton: {
      position: 'absolute',
      top: -16,
      left: '50%',
      transform: [{ translateX: -32 }], // Center the 64px wide button
      zIndex: 10,
    },
    centerButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: '#FB923C', // Orange-400
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 8,
      },
      shadowOpacity: 0.25,
      shadowRadius: 16,
      elevation: 16,
      borderWidth: 4,
      borderColor: '#FFFFFF',
      overflow: 'visible', // Prevent clipping
    },
    centerButtonActive: {
      backgroundColor: '#F97316', // Orange-500
    },
    centerButtonHover: {
      backgroundColor: '#F97316', // Orange-500
      transform: [{ scale: 1.05 }],
    },
    // Home indicator
    homeIndicator: {
      backgroundColor: '#FFFFFF',
      paddingBottom: 12,
      paddingTop: 4,
      alignItems: 'center',
      borderBottomLeftRadius: 16,
      borderBottomRightRadius: 16,
    },
    homeIndicatorBar: {
      width: 128,
      height: 4,
      backgroundColor: '#000000',
      borderRadius: 2,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.outerContainer}>
        {/* Main navigation background with curved edges */}
        <View style={styles.navigationWrapper}>
          {/* Create notch effect */}
          <View style={styles.notchContainer}>
            {/* Left curve */}
            <View style={styles.leftCurve} />
            <View style={styles.leftCurveOverlay} />

            {/* Center space */}
            <View style={styles.centerNotchSpace} />

            {/* Right curve */}
            <View style={styles.rightCurve} />
            <View style={styles.rightCurveOverlay} />
          </View>

          <View style={styles.navContentContainer}>
            {/* Navigation items */}
            <View style={styles.navContainer}>
              {navItems.map((item, index) => {
                const isFocused = state.index === index;
                const isCenter = item.isCenter;
                const IconComponent = item.icon;

                if (isCenter) {
                  // Center item - empty space with padding for the button
                  return <View key={item.id} style={styles.centerSpace} />;
                }

                const onPress = () => {
                  const event = navigation.emit({
                    type: 'tabPress',
                    target: state.routes[index].key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(state.routes[index].name, state.routes[index].params);
                  }
                };

                const onLongPress = () => {
                  navigation.emit({
                    type: 'tabLongPress',
                    target: state.routes[index].key,
                  });
                };

                // Animated color interpolation
                const animatedColor = colorAnimations[index].interpolate({
                  inputRange: [0, 1],
                  outputRange: ['#9CA3AF', '#F97316'], // Gray-400 to Orange-500
                });

                return (
                  <TouchableOpacity
                    key={item.id}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    onPressIn={() => handlePressIn(index)}
                    onPressOut={() => handlePressOut(index)}
                    style={styles.navItem}
                    activeOpacity={1} // Remove default opacity to use our custom animation
                  >
                    <Animated.View
                      style={[
                        styles.animatedIconContainer,
                        {
                          transform: [{ scale: scaleAnimations[index] }],
                        },
                      ]}
                    >
                      <IconComponent size={24} color={isFocused ? '#F97316' : '#9CA3AF'} />
                    </Animated.View>
                    <Animated.Text
                      style={[
                        styles.labelText,
                        {
                          color: animatedColor,
                          fontWeight: isFocused ? '500' : 'normal',
                        },
                      ]}
                    >
                      {item.label}
                    </Animated.Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* Center floating button - positioned closer to other tabs */}
        <View style={styles.centerFloatingButton}>
          <Animated.View
            style={{
              transform: [{ scale: scaleAnimations[2] }], // Index 2 is center button
            }}
          >
            <TouchableOpacity
              style={[
                styles.centerButton,
                state.index === 2 && styles.centerButtonActive, // Index 2 is MyLesson
              ]}
              onPress={() => {
                const event = navigation.emit({
                  type: 'tabPress',
                  target: state.routes[2].key,
                  canPreventDefault: true,
                });

                if (!event.defaultPrevented) {
                  navigation.navigate(state.routes[2].name, state.routes[2].params);
                }
              }}
              onLongPress={() => {
                navigation.emit({
                  type: 'tabLongPress',
                  target: state.routes[2].key,
                });
              }}
              onPressIn={() => handlePressIn(2)}
              onPressOut={() => handlePressOut(2)}
              activeOpacity={1} // Remove default opacity for custom animation
            >
              <BookOpen size={32} color="#FFFFFF" />
            </TouchableOpacity>
          </Animated.View>
        </View>
      </View>

      {/* Home indicator */}
      <View style={styles.homeIndicator}>
        <View style={styles.homeIndicatorBar} />
      </View>
    </View>
  );
};

export default CustomBottomNavigation;
