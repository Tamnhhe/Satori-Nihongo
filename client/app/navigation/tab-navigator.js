import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeStackNavigator from './home-stack';
import ScheduleScreen from '../modules/schedule/schedule-screen';
import MyLessonScreen from '../modules/my-lesson/my-lesson-screen';
import ProfileStackNavigator from './profile-stack';

const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const theme = useTheme();

  const getTabBarIcon = (route, focused, color, size) => {
    let iconName;

    switch (route.name) {
      case 'HomeTab':
        iconName = focused ? 'home' : 'home-outline';
        break;
      case 'Schedule':
        iconName = focused ? 'calendar' : 'calendar-outline';
        break;
      case 'MyLesson':
        iconName = focused ? 'book-open-page-variant' : 'book-open-page-variant-outline';
        break;
      case 'Profile':
        iconName = focused ? 'account' : 'account-outline';
        break;
      default:
        iconName = 'circle';
    }

    return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
  };

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => getTabBarIcon(route, focused, color, size),
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outlineVariant,
          paddingBottom: 5,
          paddingTop: 5,
          height: 60,
          elevation: 8,
          shadowColor: theme.colors.shadow,
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          fontFamily: theme.fonts.labelSmall.fontFamily,
        },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Home',
          title: 'Trang chủ',
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarLabel: 'Lịch học',
          title: 'Lịch học',
        }}
      />
      <Tab.Screen
        name="MyLesson"
        component={MyLessonScreen}
        options={{
          tabBarLabel: 'Bài học',
          title: 'Bài học của tôi',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStackNavigator}
        options={{
          tabBarLabel: 'Cá nhân',
          title: 'Thông tin cá nhân',
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

export default MainTabNavigator;
