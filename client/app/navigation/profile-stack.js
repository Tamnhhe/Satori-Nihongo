import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../modules/profile/profile-screen';
import ProfileEditScreen from '../modules/profile/profile-edit-screen';
import SettingsScreen from '../modules/account/settings/settings-screen';
import ChangePasswordScreen from '../modules/account/password/change-password-screen';

const Stack = createStackNavigator();

function ProfileStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1976D2' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
      }}
    >
      <Stack.Screen
        name="ProfileMain"
        component={ProfileScreen}
        options={{
          title: 'Thông tin cá nhân',
        }}
      />
      <Stack.Screen
        name="ProfileEdit"
        component={ProfileEditScreen}
        options={{
          title: 'Chỉnh sửa hồ sơ',
        }}
      />
      <Stack.Screen
        name="AccountSettings"
        component={SettingsScreen}
        options={{
          title: 'Cài đặt tài khoản',
        }}
      />
    </Stack.Navigator>
  );
}

export default ProfileStackNavigator;
