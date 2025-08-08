import React, { useEffect } from 'react';
import { StyleSheet, Alert, ScrollView, View } from 'react-native';
import {
  Card,
  Avatar,
  Title,
  Paragraph,
  List,
  Divider,
  Button,
  Text,
  Badge,
} from 'react-native-paper';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import LoginActions from '../login/login.reducer';
import AccountActions from '../../shared/reducers/account.reducer';
import UserProfileActions from '../entities/user-profile/user-profile.reducer';
import { useDidUpdateEffect } from '../../shared/util/use-did-update-effect';

function ProfileScreen(props) {
  const { account, logout, loginState, getAllUserProfiles, userProfile, getAccount } = props;
  const navigation = useNavigation();

  // Load user profile when component mounts
  useEffect(() => {
    getAccount();
    // For now, get all user profiles and filter by current user
    // This is a temporary solution until the backend supports getUserProfileByUserId
    if (account?.id) {
      getAllUserProfiles();
    }
  }, [account?.id, getAccount, getAllUserProfiles]);

  // Find current user's profile from the list
  const currentUserProfile = userProfile?.userProfileList?.find(
    (profile) => profile.user?.id === account?.id
  );

  // Navigate to Welcome when logout is successful
  useDidUpdateEffect(() => {
    if (loginState.logoutSuccess) {
      // Logout thành công, navigate về Welcome screen
      navigation.navigate('Welcome');
    }
  }, [loginState.logoutSuccess, navigation]);

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất không?', [
      {
        text: 'Hủy',
        style: 'cancel',
      },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: () => logout(),
      },
    ]);
  };

  const handleEditProfile = () => {
    navigation.navigate('ProfileEdit', {
      userProfile: currentUserProfile || null,
      account,
    });
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const displayName =
    currentUserProfile?.firstName && currentUserProfile?.lastName
      ? `${currentUserProfile.firstName} ${currentUserProfile.lastName}`
      : account?.login || 'Người dùng';

  const profileComplete = currentUserProfile
    ? currentUserProfile.firstName &&
      currentUserProfile.lastName &&
      currentUserProfile.phoneNumber &&
      currentUserProfile.dateOfBirth
    : false;

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <Card style={styles.profileCard}>
        <Card.Content style={styles.profileHeader}>
          <Avatar.Text size={80} label={getInitials(displayName)} style={styles.avatar} />
          <Title style={styles.username}>{displayName}</Title>
          <Paragraph style={styles.email}>{account?.email || 'user@example.com'}</Paragraph>
          {!profileComplete && <Badge style={styles.incompleteBadge}>Hồ sơ chưa hoàn thiện</Badge>}
        </Card.Content>
      </Card>

      {/* Profile Details */}
      {currentUserProfile && (
        <Card style={styles.detailsCard}>
          <Card.Title title="Thông tin cá nhân" />
          <Card.Content>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Họ và tên:</Text>
              <Text style={styles.infoValue}>
                {currentUserProfile.firstName && currentUserProfile.lastName
                  ? `${currentUserProfile.firstName} ${currentUserProfile.lastName}`
                  : 'Chưa cập nhật'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số điện thoại:</Text>
              <Text style={styles.infoValue}>
                {currentUserProfile.phoneNumber || 'Chưa cập nhật'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Ngày sinh:</Text>
              <Text style={styles.infoValue}>
                {currentUserProfile.dateOfBirth
                  ? new Date(currentUserProfile.dateOfBirth).toLocaleDateString('vi-VN')
                  : 'Chưa cập nhật'}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Vai trò:</Text>
              <Text style={styles.infoValue}>{currentUserProfile.role || 'Học viên'}</Text>
            </View>
          </Card.Content>
          <Card.Actions>
            <Button mode="contained" onPress={handleEditProfile} style={styles.editButton}>
              Chỉnh sửa hồ sơ
            </Button>
          </Card.Actions>
        </Card>
      )}

      {/* Menu Items */}
      <Card style={styles.menuCard}>
        <List.Item
          title="Cài đặt tài khoản"
          left={(props) => <List.Icon {...props} icon="account-cog" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            navigation.navigate('AccountSettings');
          }}
        />
        <Divider />

        <List.Item
          title="Thống kê học tập"
          left={(props) => <List.Icon {...props} icon="chart-line" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            // Navigate to statistics
            console.log('Navigate to statistics');
          }}
        />
        <Divider />

        <List.Item
          title="Trợ giúp"
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            // Navigate to help
            console.log('Navigate to help');
          }}
        />
        <Divider />

        <List.Item
          title="Đăng xuất"
          titleStyle={styles.logoutText}
          left={(props) => <List.Icon {...props} icon="logout" color="#FF6B6B" />}
          onPress={handleLogout}
        />
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  profileCard: {
    marginBottom: 16,
    elevation: 2,
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    backgroundColor: '#1976D2',
    marginBottom: 12,
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  incompleteBadge: {
    backgroundColor: '#FF9800',
  },
  detailsCard: {
    marginBottom: 16,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    flex: 2,
    textAlign: 'right',
  },
  editButton: {
    margin: 8,
  },
  menuCard: {
    elevation: 2,
  },
  logoutText: {
    color: '#FF6B6B',
  },
});

const mapStateToProps = (state) => ({
  account: state.account.account,
  loginState: state.login,
  userProfile: state.userProfiles,
});

const mapDispatchToProps = (dispatch) => ({
  logout: () => dispatch(LoginActions.logoutRequest()),
  getAccount: () => dispatch(AccountActions.accountRequest()),
  getAllUserProfiles: () => dispatch(UserProfileActions.userProfileAllRequest()),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
