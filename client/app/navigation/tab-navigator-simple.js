import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from '../modules/home/home-screen';
import ScheduleScreen from '../modules/schedule/schedule-screen';
import MyLessonScreen from '../modules/my-lesson/my-lesson-screen';
import ProfileScreen from '../modules/profile/profile-screen';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={ScheduleScreen}
        options={{
          tabBarLabel: 'Lịch học',
        }}
      />
      <Tab.Screen
        name="MyLesson"
        component={MyLessonScreen}
        options={{
          tabBarLabel: 'Bài học',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Cá nhân',
        }}
      />
    </Tab.Navigator>
  );
}
