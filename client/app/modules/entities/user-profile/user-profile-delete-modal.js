import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import UserProfileActions from './user-profile.reducer';

import styles from './user-profile-styles';

function UserProfileDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteUserProfile(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('UserProfile');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete UserProfile {entity.id}?</Text>
          </View>
          <View style={[styles.flexRow]}>
            <TouchableHighlight
              style={[styles.openButton, styles.cancelButton]}
              onPress={() => {
                setVisible(false);
              }}
            >
              <Text style={styles.textStyle}>Cancel</Text>
            </TouchableHighlight>
            <TouchableHighlight style={[styles.openButton, styles.submitButton]} onPress={deleteEntity} testID="deleteButton">
              <Text style={styles.textStyle}>Delete</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const mapStateToProps = state => {
  return {
    userProfile: state.userProfiles.userProfile,
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

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileDeleteModal);
