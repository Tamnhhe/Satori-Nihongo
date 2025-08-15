import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import HomeStackNavigator from './home-stack';
import ScheduleScreen from '../modules/schedule/schedule-screen';
import MyLessonScreen from '../modules/my-lesson/my-lesson-screen';
import PracticeStackNavigator from './practice-stack';
import ProfileStackNavigator from './profile-stack';
import CustomBottomNavigation from './custom-bottom-navigation';

const Tab = createBottomTabNavigator();

function MainTabNavigator() {
  const theme = useTheme();

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      tabBar={(props) => <CustomBottomNavigation {...props} />}
      screenOptions={{
        headerShown: false,
      }}
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
        name="Practice"
        component={PracticeStackNavigator}
        options={{
          tabBarLabel: 'Luyện tập',
          title: 'Luyện tập',
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
