import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import TeacherProfileActions from './teacher-profile.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import TeacherProfileDeleteModal from './teacher-profile-delete-modal';
import styles from './teacher-profile-styles';

function TeacherProfileDetailScreen(props) {
  const { route, getTeacherProfile, navigation, teacherProfile, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = teacherProfile?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('TeacherProfile');
      } else {
        setDeleteModalVisible(false);
        getTeacherProfile(routeEntityId);
      }
    }, [routeEntityId, getTeacherProfile, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the TeacherProfile.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="teacherProfileDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{teacherProfile.id}</Text>
      {/* TeacherCode Field */}
      <Text style={styles.label}>TeacherCode:</Text>
      <Text testID="teacherCode">{teacherProfile.teacherCode}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('TeacherProfileEdit', { entityId })}
          accessibilityLabel={'TeacherProfile Edit Button'}
          testID="teacherProfileEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'TeacherProfile Delete Button'}
          testID="teacherProfileDeleteButton"
        />
        {deleteModalVisible && (
          <TeacherProfileDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={teacherProfile}
            testID="teacherProfileDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    teacherProfile: state.teacherProfiles.teacherProfile,
    error: state.teacherProfiles.errorOne,
    fetching: state.teacherProfiles.fetchingOne,
    deleting: state.teacherProfiles.deleting,
    errorDeleting: state.teacherProfiles.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getTeacherProfile: id => dispatch(TeacherProfileActions.teacherProfileRequest(id)),
    getAllTeacherProfiles: options => dispatch(TeacherProfileActions.teacherProfileAllRequest(options)),
    deleteTeacherProfile: id => dispatch(TeacherProfileActions.teacherProfileDeleteRequest(id)),
    resetTeacherProfiles: () => dispatch(TeacherProfileActions.teacherProfileReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherProfileDetailScreen);
