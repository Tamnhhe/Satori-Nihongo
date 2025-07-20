import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import TeacherProfileActions from './teacher-profile.reducer';
import styles from './teacher-profile-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function TeacherProfileScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { teacherProfile, teacherProfileList, getAllTeacherProfiles, fetching } = props;
  const fetchTeacherProfiles = React.useCallback(() => {
    getAllTeacherProfiles({ page: page - 1, sort, size });
  }, [getAllTeacherProfiles, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('TeacherProfile entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchTeacherProfiles();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [teacherProfile, fetchTeacherProfiles]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('TeacherProfileDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No TeacherProfiles Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchTeacherProfiles();
  };
  return (
    <View style={styles.container} testID="teacherProfileScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={teacherProfileList}
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
    teacherProfileList: state.teacherProfiles.teacherProfileList,
    teacherProfile: state.teacherProfiles.teacherProfile,
    fetching: state.teacherProfiles.fetchingAll,
    error: state.teacherProfiles.errorAll,
    links: state.teacherProfiles.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllTeacherProfiles: options => dispatch(TeacherProfileActions.teacherProfileAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(TeacherProfileScreen);
