import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import LessonActions from './lesson.reducer';
import styles from './lesson-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function LessonScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { lesson, lessonList, getAllLessons, fetching } = props;
  const fetchLessons = React.useCallback(() => {
    getAllLessons({ page: page - 1, sort, size });
  }, [getAllLessons, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Lesson entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchLessons();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [lesson, fetchLessons]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('LessonDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Lessons Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchLessons();
  };
  return (
    <View style={styles.container} testID="lessonScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={lessonList}
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
    lessonList: state.lessons.lessonList,
    lesson: state.lessons.lesson,
    fetching: state.lessons.fetchingAll,
    error: state.lessons.errorAll,
    links: state.lessons.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllLessons: options => dispatch(LessonActions.lessonAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LessonScreen);
