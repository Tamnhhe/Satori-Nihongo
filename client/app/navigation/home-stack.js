/**
 * Home Stack Navigator
 * Contains Home screen and Japanese Learning screen
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useTheme } from 'react-native-paper';

import HomeScreen from '../modules/home/home-screen';
import JapaneseLearningScreen from '../modules/home/japanese-learning-screen';

const Stack = createStackNavigator();

export default function HomeStackNavigator() {
  const theme = useTheme();

  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.surface,
          elevation: 4,
          shadowOpacity: 0.1,
        },
        headerTintColor: theme.colors.onSurface,
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 18,
        },
        headerBackTitleVisible: false,
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false, // Home screen có header riêng
        }}
      />
      <Stack.Screen
        name="JapaneseLearning"
        component={JapaneseLearningScreen}
        options={({ route }) => ({
          title: route.params?.category ? `Học ${route.params.category}` : 'Học tiếng Nhật',
          headerShown: true,
        })}
      />
    </Stack.Navigator>
  );
}
