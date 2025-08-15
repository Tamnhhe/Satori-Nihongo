import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import PracticeScreen from '../modules/practice/practice-screen';

const Stack = createStackNavigator();

function PracticeStackNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="PracticeHome"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="PracticeHome"
        component={PracticeScreen}
        options={{
          title: 'Luyện tập',
        }}
      />
    </Stack.Navigator>
  );
}

export default PracticeStackNavigator;
