import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Card, Button, Text, useTheme } from 'react-native-paper';
import { connect } from 'react-redux';
import AccountActions from '../../shared/reducers/account.reducer';
import LoginActions from '../login/login.reducer';
import AsyncStorage from '@react-native-async-storage/async-storage';

function DeveloperScreen(props) {
  const theme = useTheme();
  const { account, authToken, logout } = props;

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      logout();
      Alert.alert('Thành công', 'Đã xóa toàn bộ dữ liệu. App sẽ restart về màn login.');
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể xóa dữ liệu: ' + error.message);
    }
  };

  const showStorageInfo = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const result = await AsyncStorage.multiGet(keys);
      console.log('Storage Keys:', keys);
      console.log('Storage Data:', result);
      Alert.alert('Storage Info', `Keys: ${keys.length}\n${keys.join(', ')}`);
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đọc storage: ' + error.message);
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={{ padding: 16 }}>
        <Card elevation={2} style={{ marginBottom: 16 }}>
          <Card.Title title="Authentication Debug" />
          <Card.Content>
            <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>Account:</Text>{' '}
              {account ? 'Logged In' : 'Not Logged In'}
            </Text>
            <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>Auth Token:</Text>{' '}
              {authToken ? 'Present' : 'None'}
            </Text>
            {account && (
              <Text variant="bodyMedium" style={{ marginBottom: 8 }}>
                <Text style={{ fontWeight: 'bold' }}>User:</Text> {account.login || 'Unknown'}
              </Text>
            )}
          </Card.Content>
        </Card>

        <Card elevation={2} style={{ marginBottom: 16 }}>
          <Card.Title title="Debug Actions" />
          <Card.Content>
            <Button
              mode="outlined"
              onPress={showStorageInfo}
              style={{ marginBottom: 12 }}
              icon="information"
            >
              Xem Storage Info
            </Button>

            <Button
              mode="contained"
              onPress={clearAllData}
              buttonColor={theme.colors.error}
              icon="delete"
              style={{ marginBottom: 12 }}
            >
              Clear All Data & Logout
            </Button>

            <Button mode="outlined" onPress={logout} icon="logout">
              Logout Only
            </Button>
          </Card.Content>
        </Card>

        <Card elevation={2}>
          <Card.Title title="Hướng dẫn" />
          <Card.Content>
            <Text variant="bodyMedium">
              • Nếu bạn đang thấy màn này mà chưa login, có nghĩa là app đang tự động login từ token
              đã lưu
            </Text>
            <Text variant="bodyMedium" style={{ marginTop: 8 }}>
              • Nhấn "Clear All Data & Logout" để xóa hoàn toàn và test lại flow login
            </Text>
            <Text variant="bodyMedium" style={{ marginTop: 8 }}>
              • App sẽ redirect về màn Welcome/Login sau khi logout
            </Text>
          </Card.Content>
        </Card>
      </View>
    </ScrollView>
  );
}

const mapStateToProps = (state) => ({
  account: state.account.account,
  authToken: state.login.authToken,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => {
    dispatch(LoginActions.logoutRequest());
    dispatch(AccountActions.accountReset());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DeveloperScreen);
