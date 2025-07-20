import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import StudentProfileActions from './student-profile.reducer';
import styles from './student-profile-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function StudentProfileScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { studentProfile, studentProfileList, getAllStudentProfiles, fetching } = props;
  const fetchStudentProfiles = React.useCallback(() => {
    getAllStudentProfiles({ page: page - 1, sort, size });
  }, [getAllStudentProfiles, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('StudentProfile entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchStudentProfiles();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [studentProfile, fetchStudentProfiles]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('StudentProfileDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No StudentProfiles Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchStudentProfiles();
  };
  return (
    <View style={styles.container} testID="studentProfileScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={studentProfileList}
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
    studentProfileList: state.studentProfiles.studentProfileList,
    studentProfile: state.studentProfiles.studentProfile,
    fetching: state.studentProfiles.fetchingAll,
    error: state.studentProfiles.errorAll,
    links: state.studentProfiles.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllStudentProfiles: options => dispatch(StudentProfileActions.studentProfileAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentProfileScreen);
