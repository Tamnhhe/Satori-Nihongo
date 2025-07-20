import React from 'react';
import { TouchableHighlight, Modal, Text, View } from 'react-native';
import { connect } from 'react-redux';

import SocialAccountActions from './social-account.reducer';

import styles from './social-account-styles';

function SocialAccountDeleteModal(props) {
  const { visible, setVisible, entity, navigation, testID } = props;

  const deleteEntity = () => {
    props.deleteSocialAccount(entity.id);
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate('SocialAccount');
  };
  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View testID={testID} style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={[styles.flex, styles.flexRow]}>
            <Text style={styles.modalText}>Delete SocialAccount {entity.id}?</Text>
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
    socialAccount: state.socialAccounts.socialAccount,
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

export default connect(mapStateToProps, mapDispatchToProps)(SocialAccountDeleteModal);
