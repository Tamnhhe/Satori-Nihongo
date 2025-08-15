import React, { useEffect } from 'react';
import { ScrollView, View, Text, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { Settings, Trophy, BookOpen, Mail, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LoginActions from '../login/login.reducer';
import AccountActions from '../../shared/reducers/account.reducer';
import UserProfileActions from '../entities/user-profile/user-profile.reducer';
import { useDidUpdateEffect } from '../../shared/util/use-did-update-effect';
import styles from './profile-screen.styles';

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

  const handleMenuPress = (menuType) => {
    switch (menuType) {
      case 'settings':
        // navigation.navigate('Settings');
        console.log('Navigate to Settings');
        break;
      case 'achievements':
        navigation.navigate('Achievements');
        break;
      case 'support':
        // navigation.navigate('Support');
        console.log('Navigate to Support');
        break;
      case 'feedback':
        // navigation.navigate('Feedback');
        console.log('Navigate to Feedback');
        break;
      default:
        break;
    }
  };

  const displayName =
    currentUserProfile?.firstName && currentUserProfile?.lastName
      ? `${currentUserProfile.firstName} ${currentUserProfile.lastName}`
      : account?.login || 'Nguyễn Văn A';

  const userLevel = currentUserProfile?.level || 'N5';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          {/* Coin Badge */}
          <View style={styles.coinBadge}>
            <Text style={styles.coinIcon}>🪙</Text>
          </View>

          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <LinearGradient colors={['#F59E0B', '#F97316']} style={styles.avatar}>
              <Text style={styles.avatarEmoji}>👨‍💼</Text>
            </LinearGradient>
          </View>

          {/* User Info */}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{displayName}</Text>
            <Text style={styles.userLevel}>Trình độ: {userLevel}</Text>
          </View>

          {/* Achievement Badges */}
          <View style={styles.achievementContainer}>
            <View style={[styles.achievementBadge, styles.achievementBadge1]}>
              <Text style={styles.achievementIcon}>📝</Text>
              <Text style={styles.achievementText}>Hiragana Master</Text>
            </View>
            <View style={[styles.achievementBadge, styles.achievementBadge2]}>
              <Text style={styles.achievementIcon}>📊</Text>
              <Text style={styles.achievementText}>Kiên trì</Text>
            </View>
            <View style={[styles.achievementBadge, styles.achievementBadge3]}>
              <Text style={styles.achievementIcon}>📚</Text>
              <Text style={styles.achievementText}>Từ vựng cơ bản</Text>
            </View>
          </View>

          {/* Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>47</Text>
              <Text style={styles.statLabel}>Giờ học</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>23</Text>
              <Text style={styles.statLabel}>Thành tựu</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statPlaceholder} />
            </View>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {/* Settings */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuPress('settings')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Settings size={20} color="#3B82F6" />
              </View>
              <Text style={styles.menuText}>Cài đặt</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Achievements */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuPress('achievements')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Trophy size={20} color="#3B82F6" />
              </View>
              <Text style={styles.menuText}>Thành tựu</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Support */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuPress('support')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <BookOpen size={20} color="#3B82F6" />
              </View>
              <Text style={styles.menuText}>Hỗ trợ</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Feedback */}
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleMenuPress('feedback')}
            activeOpacity={0.7}
          >
            <View style={styles.menuItemLeft}>
              <View style={styles.menuIcon}>
                <Mail size={20} color="#3B82F6" />
              </View>
              <Text style={styles.menuText}>Phản hồi</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Logout Section */}
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <Text style={styles.logoutText}>Đăng xuất</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Phiên bản hiện tại: 1.0.1</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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
