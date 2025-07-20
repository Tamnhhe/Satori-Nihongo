import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import FlashcardActions from './flashcard.reducer';
import styles from './flashcard-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function FlashcardScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { flashcard, flashcardList, getAllFlashcards, fetching } = props;
  const fetchFlashcards = React.useCallback(() => {
    getAllFlashcards({ page: page - 1, sort, size });
  }, [getAllFlashcards, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Flashcard entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchFlashcards();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [flashcard, fetchFlashcards]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('FlashcardDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Flashcards Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchFlashcards();
  };
  return (
    <View style={styles.container} testID="flashcardScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={flashcardList}
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
    flashcardList: state.flashcards.flashcardList,
    flashcard: state.flashcards.flashcard,
    fetching: state.flashcards.fetchingAll,
    error: state.flashcards.errorAll,
    links: state.flashcards.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllFlashcards: options => dispatch(FlashcardActions.flashcardAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(FlashcardScreen);
