import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import CourseActions from './course.reducer';
import styles from './course-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function CourseScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { course, courseList, getAllCourses, fetching } = props;
  const fetchCourses = React.useCallback(() => {
    getAllCourses({ page: page - 1, sort, size });
  }, [getAllCourses, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Course entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchCourses();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [course, fetchCourses]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('CourseDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Courses Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchCourses();
  };
  return (
    <View style={styles.container} testID="courseScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={courseList}
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
    courseList: state.courses.courseList,
    course: state.courses.course,
    fetching: state.courses.fetchingAll,
    error: state.courses.errorAll,
    links: state.courses.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllCourses: options => dispatch(CourseActions.courseAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseScreen);
