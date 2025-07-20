import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import SocialAccountActions from './social-account.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import SocialAccountDeleteModal from './social-account-delete-modal';
import styles from './social-account-styles';

function SocialAccountDetailScreen(props) {
  const { route, getSocialAccount, navigation, socialAccount, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = socialAccount?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('SocialAccount');
      } else {
        setDeleteModalVisible(false);
        getSocialAccount(routeEntityId);
      }
    }, [routeEntityId, getSocialAccount, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the SocialAccount.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="socialAccountDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{socialAccount.id}</Text>
      {/* Provider Field */}
      <Text style={styles.label}>Provider:</Text>
      <Text testID="provider">{socialAccount.provider}</Text>
      {/* ProviderUserId Field */}
      <Text style={styles.label}>ProviderUserId:</Text>
      <Text testID="providerUserId">{socialAccount.providerUserId}</Text>
      {/* AccessToken Field */}
      <Text style={styles.label}>AccessToken:</Text>
      <Text testID="accessToken">{socialAccount.accessToken}</Text>
      {/* RefreshToken Field */}
      <Text style={styles.label}>RefreshToken:</Text>
      <Text testID="refreshToken">{socialAccount.refreshToken}</Text>
      {/* TokenExpiry Field */}
      <Text style={styles.label}>TokenExpiry:</Text>
      <Text testID="tokenExpiry">{String(socialAccount.tokenExpiry)}</Text>
      <Text style={styles.label}>User Profile:</Text>
      <Text testID="userProfile">{String(socialAccount.userProfile ? socialAccount.userProfile.id : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('SocialAccountEdit', { entityId })}
          accessibilityLabel={'SocialAccount Edit Button'}
          testID="socialAccountEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'SocialAccount Delete Button'}
          testID="socialAccountDeleteButton"
        />
        {deleteModalVisible && (
          <SocialAccountDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={socialAccount}
            testID="socialAccountDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    socialAccount: state.socialAccounts.socialAccount,
    error: state.socialAccounts.errorOne,
    fetching: state.socialAccounts.fetchingOne,
    deleting: state.socialAccounts.deleting,
    errorDeleting: state.socialAccounts.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getSocialAccount: id => dispatch(SocialAccountActions.socialAccountRequest(id)),
    getAllSocialAccounts: options => dispatch(SocialAccountActions.socialAccountAllRequest(options)),
    deleteSocialAccount: id => dispatch(SocialAccountActions.socialAccountDeleteRequest(id)),
    resetSocialAccounts: () => dispatch(SocialAccountActions.socialAccountReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SocialAccountDetailScreen);
