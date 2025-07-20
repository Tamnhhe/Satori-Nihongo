import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import QuestionActions from './question.reducer';
import styles from './question-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function QuestionScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { question, questionList, getAllQuestions, fetching } = props;
  const fetchQuestions = React.useCallback(() => {
    getAllQuestions({ page: page - 1, sort, size });
  }, [getAllQuestions, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Question entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchQuestions();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [question, fetchQuestions]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('QuestionDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Questions Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchQuestions();
  };
  return (
    <View style={styles.container} testID="questionScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={questionList}
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
    questionList: state.questions.questionList,
    question: state.questions.question,
    fetching: state.questions.fetchingAll,
    error: state.questions.errorAll,
    links: state.questions.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllQuestions: options => dispatch(QuestionActions.questionAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(QuestionScreen);
