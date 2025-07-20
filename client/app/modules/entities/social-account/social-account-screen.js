import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import SocialAccountActions from './social-account.reducer';
import styles from './social-account-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function SocialAccountScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { socialAccount, socialAccountList, getAllSocialAccounts, fetching } = props;
  const fetchSocialAccounts = React.useCallback(() => {
    getAllSocialAccounts({ page: page - 1, sort, size });
  }, [getAllSocialAccounts, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('SocialAccount entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchSocialAccounts();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [socialAccount, fetchSocialAccounts]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('SocialAccountDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No SocialAccounts Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchSocialAccounts();
  };
  return (
    <View style={styles.container} testID="socialAccountScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={socialAccountList}
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
    socialAccountList: state.socialAccounts.socialAccountList,
    socialAccount: state.socialAccounts.socialAccount,
    fetching: state.socialAccounts.fetchingAll,
    error: state.socialAccounts.errorAll,
    links: state.socialAccounts.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllSocialAccounts: options => dispatch(SocialAccountActions.socialAccountAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SocialAccountScreen);
