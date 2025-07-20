import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import CourseClassActions from './course-class.reducer';
import styles from './course-class-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function CourseClassScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { courseClass, courseClassList, getAllCourseClasses, fetching } = props;
  const fetchCourseClasses = React.useCallback(() => {
    getAllCourseClasses({ page: page - 1, sort, size });
  }, [getAllCourseClasses, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('CourseClass entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchCourseClasses();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [courseClass, fetchCourseClasses]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('CourseClassDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No CourseClasses Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchCourseClasses();
  };
  return (
    <View style={styles.container} testID="courseClassScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={courseClassList}
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
    courseClassList: state.courseClasses.courseClassList,
    courseClass: state.courseClasses.courseClass,
    fetching: state.courseClasses.fetchingAll,
    error: state.courseClasses.errorAll,
    links: state.courseClasses.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllCourseClasses: options => dispatch(CourseClassActions.courseClassAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseClassScreen);
