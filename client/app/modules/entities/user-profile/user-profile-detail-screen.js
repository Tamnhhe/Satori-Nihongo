import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import UserProfileActions from './user-profile.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import UserProfileDeleteModal from './user-profile-delete-modal';
import styles from './user-profile-styles';

function UserProfileDetailScreen(props) {
  const { route, getUserProfile, navigation, userProfile, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = userProfile?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('UserProfile');
      } else {
        setDeleteModalVisible(false);
        getUserProfile(routeEntityId);
      }
    }, [routeEntityId, getUserProfile, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the UserProfile.</Text>
      </View>
    );
  }
  if (!entityId || fetching || !correctEntityLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="userProfileDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{userProfile.id}</Text>
      {/* Username Field */}
      <Text style={styles.label}>Username:</Text>
      <Text testID="username">{userProfile.username}</Text>
      {/* PasswordHash Field */}
      <Text style={styles.label}>PasswordHash:</Text>
      <Text testID="passwordHash">{userProfile.passwordHash}</Text>
      {/* Email Field */}
      <Text style={styles.label}>Email:</Text>
      <Text testID="email">{userProfile.email}</Text>
      {/* FullName Field */}
      <Text style={styles.label}>FullName:</Text>
      <Text testID="fullName">{userProfile.fullName}</Text>
      {/* Gender Field */}
      <Text style={styles.label}>Gender:</Text>
      <Text testID="gender">{String(userProfile.gender)}</Text>
      {/* Role Field */}
      <Text style={styles.label}>Role:</Text>
      <Text testID="role">{userProfile.role}</Text>
      <Text style={styles.label}>Teacher Profile:</Text>
      <Text testID="teacherProfile">{String(userProfile.teacherProfile ? userProfile.teacherProfile.id : '')}</Text>
      <Text style={styles.label}>Student Profile:</Text>
      <Text testID="studentProfile">{String(userProfile.studentProfile ? userProfile.studentProfile.id : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('UserProfileEdit', { entityId })}
          accessibilityLabel={'UserProfile Edit Button'}
          testID="userProfileEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'UserProfile Delete Button'}
          testID="userProfileDeleteButton"
        />
        {deleteModalVisible && (
          <UserProfileDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={userProfile}
            testID="userProfileDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    userProfile: state.userProfiles.userProfile,
    error: state.userProfiles.errorOne,
    fetching: state.userProfiles.fetchingOne,
    deleting: state.userProfiles.deleting,
    errorDeleting: state.userProfiles.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getUserProfile: id => dispatch(UserProfileActions.userProfileRequest(id)),
    getAllUserProfiles: options => dispatch(UserProfileActions.userProfileAllRequest(options)),
    deleteUserProfile: id => dispatch(UserProfileActions.userProfileDeleteRequest(id)),
    resetUserProfiles: () => dispatch(UserProfileActions.userProfileReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileDetailScreen);
