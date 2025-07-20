import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import QuizActions from './quiz.reducer';
import styles from './quiz-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function QuizScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { quiz, quizList, getAllQuizzes, fetching } = props;
  const fetchQuizzes = React.useCallback(() => {
    getAllQuizzes({ page: page - 1, sort, size });
  }, [getAllQuizzes, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Quiz entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchQuizzes();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [quiz, fetchQuizzes]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('QuizDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Quizzes Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchQuizzes();
  };
  return (
    <View style={styles.container} testID="quizScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={quizList}
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
    quizList: state.quizzes.quizList,
    quiz: state.quizzes.quiz,
    fetching: state.quizzes.fetchingAll,
    error: state.quizzes.errorAll,
    links: state.quizzes.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllQuizzes: options => dispatch(QuizActions.quizAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizScreen);
