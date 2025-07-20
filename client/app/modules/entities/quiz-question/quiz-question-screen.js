import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import QuizQuestionActions from './quiz-question.reducer';
import styles from './quiz-question-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function QuizQuestionScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { quizQuestion, quizQuestionList, getAllQuizQuestions, fetching } = props;
  const fetchQuizQuestions = React.useCallback(() => {
    getAllQuizQuestions({ page: page - 1, sort, size });
  }, [getAllQuizQuestions, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('QuizQuestion entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchQuizQuestions();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [quizQuestion, fetchQuizQuestions]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('QuizQuestionDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No QuizQuestions Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchQuizQuestions();
  };
  return (
    <View style={styles.container} testID="quizQuestionScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={quizQuestionList}
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
    quizQuestionList: state.quizQuestions.quizQuestionList,
    quizQuestion: state.quizQuestions.quizQuestion,
    fetching: state.quizQuestions.fetchingAll,
    error: state.quizQuestions.errorAll,
    links: state.quizQuestions.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllQuizQuestions: options => dispatch(QuizQuestionActions.quizQuestionAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuizQuestionScreen);
