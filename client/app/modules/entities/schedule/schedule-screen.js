import React from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import ScheduleActions from './schedule.reducer';
import styles from './schedule-styles';
import AlertMessage from '../../../shared/components/alert-message/alert-message';

function ScheduleScreen(props) {
  const [page, setPage] = React.useState(0);
  const [sort /*, setSort*/] = React.useState('id,asc');
  const [size /*, setSize*/] = React.useState(20);

  const { schedule, scheduleList, getAllSchedules, fetching } = props;
  const fetchSchedules = React.useCallback(() => {
    getAllSchedules({ page: page - 1, sort, size });
  }, [getAllSchedules, page, sort, size]);

  useFocusEffect(
    React.useCallback(() => {
      console.debug('Schedule entity changed and the list screen is now in focus, refresh');
      setPage(0);
      fetchSchedules();
      /* eslint-disable-next-line react-hooks/exhaustive-deps */
    }, [schedule, fetchSchedules]),
  );

  const renderRow = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => props.navigation.navigate('ScheduleDetail', { entityId: item.id })}>
        <View style={styles.listRow}>
          <Text style={styles.whiteLabel}>ID: {item.id}</Text>
          {/* <Text style={styles.label}>{item.description}</Text> */}
        </View>
      </TouchableOpacity>
    );
  };

  // Render a header

  // Show this when data is empty
  const renderEmpty = () => <AlertMessage title="No Schedules Found" show={!fetching} />;

  const keyExtractor = (item, index) => `${index}`;

  // How many items should be kept im memory as we scroll?
  const oneScreensWorth = 20;

  const handleLoadMore = () => {
    if (page < props.links.next || props.links.next === undefined || fetching) {
      return;
    }
    setPage(page + 1);
    fetchSchedules();
  };
  return (
    <View style={styles.container} testID="scheduleScreen">
      <FlatList
        contentContainerStyle={styles.listContent}
        data={scheduleList}
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
    scheduleList: state.schedules.scheduleList,
    schedule: state.schedules.schedule,
    fetching: state.schedules.fetchingAll,
    error: state.schedules.errorAll,
    links: state.schedules.links,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getAllSchedules: options => dispatch(ScheduleActions.scheduleAllRequest(options)),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleScreen);
