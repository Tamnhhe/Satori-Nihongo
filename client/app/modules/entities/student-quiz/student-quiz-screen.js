import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import StudentQuizActions from './student-quiz.reducer';
import styles from './student-quiz-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function StudentQuizScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { studentQuiz, studentQuizList, getAllStudentQuizs, fetching } = props;
  const fetchStudentQuizs = React.useCallback(() => {
    getAllStudentQuizs({ page: page - 1, sort, size });
  }, [getAllStudentQuizs, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('StudentQuiz entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchStudentQuizs();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [studentQuiz, fetchStudentQuizs]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('StudentQuizDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No StudentQuizs Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchStudentQuizs();
  };
  return (
    <View style={styles.container} testID="studentQuizScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={studentQuizList}
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
    studentQuizList: state.studentQuizs.studentQuizList,
    studentQuiz: state.studentQuizs.studentQuiz,
    fetching: state.studentQuizs.fetchingAll,
    error: state.studentQuizs.errorAll,
    links: state.studentQuizs.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllStudentQuizs: options => dispatch(StudentQuizActions.studentQuizAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(StudentQuizScreen);
