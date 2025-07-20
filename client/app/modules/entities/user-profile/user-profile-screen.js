import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import UserProfileActions from './user-profile.reducer';
import styles from './user-profile-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function UserProfileScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { userProfile, userProfileList, getAllUserProfiles, fetching } = props;
  const fetchUserProfiles = React.useCallback(() => {
    getAllUserProfiles({ page: page - 1, sort, size });
  }, [getAllUserProfiles, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('UserProfile entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchUserProfiles();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [userProfile, fetchUserProfiles]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('UserProfileDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No UserProfiles Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchUserProfiles();
  };
  return (
    <View style={styles.container} testID="userProfileScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={userProfileList}
        renderItem={renderRow}
        keyExtractor={keyExtractor}
        initialNumToRender={oneScreensWorth}
        onEndReached={handleLoadMore}
        ListEmptyComponent={renderEmpty}
      />
    </View>
  );
}

const mapStateToProps = state => {
  return {
    // ...redux state to props here
    userProfileList: state.userProfiles.userProfileList,
    userProfile: state.userProfiles.userProfile,
    fetching: state.userProfiles.fetchingAll,
    error: state.userProfiles.errorAll,
    links: state.userProfiles.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllUserProfiles: options => dispatch(UserProfileActions.userProfileAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileScreen);
