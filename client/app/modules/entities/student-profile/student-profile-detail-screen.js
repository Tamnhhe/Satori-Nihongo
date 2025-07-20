import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import StudentProfileActions from './student-profile.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import StudentProfileDeleteModal from './student-profile-delete-modal';
import styles from './student-profile-styles';

function StudentProfileDetailScreen(props) {
  const { route, getStudentProfile, navigation, studentProfile, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = studentProfile?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('StudentProfile');
      } else {
        setDeleteModalVisible(false);
        getStudentProfile(routeEntityId);
      }
    }, [routeEntityId, getStudentProfile, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the StudentProfile.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="studentProfileDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{studentProfile.id}</Text>
      {/* StudentId Field */}
      <Text style={styles.label}>StudentId:</Text>
      <Text testID="studentId">{studentProfile.studentId}</Text>
      {/* Gpa Field */}
      <Text style={styles.label}>Gpa:</Text>
      <Text testID="gpa">{studentProfile.gpa}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('StudentProfileEdit', { entityId })}
          accessibilityLabel={'StudentProfile Edit Button'}
          testID="studentProfileEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'StudentProfile Delete Button'}
          testID="studentProfileDeleteButton"
        />
        {deleteModalVisible && (
          <StudentProfileDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={studentProfile}
            testID="studentProfileDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    studentProfile: state.studentProfiles.studentProfile,
    error: state.studentProfiles.errorOne,
    fetching: state.studentProfiles.fetchingOne,
    deleting: state.studentProfiles.deleting,
    errorDeleting: state.studentProfiles.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getStudentProfile: id => dispatch(StudentProfileActions.studentProfileRequest(id)),
    getAllStudentProfiles: options => dispatch(StudentProfileActions.studentProfileAllRequest(options)),
    deleteStudentProfile: id => dispatch(StudentProfileActions.studentProfileDeleteRequest(id)),
    resetStudentProfiles: () => dispatch(StudentProfileActions.studentProfileReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfileDetailScreen);
