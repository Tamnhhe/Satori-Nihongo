import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import LessonActions from './lesson.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import LessonDeleteModal from './lesson-delete-modal';
import styles from './lesson-styles';

function LessonDetailScreen(props) {
  const { route, getLesson, navigation, lesson, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = lesson?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Lesson');
      } else {
        setDeleteModalVisible(false);
        getLesson(routeEntityId);
      }
    }, [routeEntityId, getLesson, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Lesson.</Text>
      </View>
    );
  }
  if (!entityId || fetching || !correctEntityLoaded) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="lessonDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{lesson.id}</Text>
      {/* Title Field */}
      <Text style={styles.label}>Title:</Text>
      <Text testID="title">{lesson.title}</Text>
      {/* Content Field */}
      <Text style={styles.label}>Content:</Text>
      <Text testID="content">{lesson.content}</Text>
      {/* VideoUrl Field */}
      <Text style={styles.label}>VideoUrl:</Text>
      <Text testID="videoUrl">{lesson.videoUrl}</Text>
      {/* SlideUrl Field */}
      <Text style={styles.label}>SlideUrl:</Text>
      <Text testID="slideUrl">{lesson.slideUrl}</Text>
      <Text style={styles.label}>Course:</Text>
      <Text testID="course">{String(lesson.course ? lesson.course.id : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('LessonEdit', { entityId })}
          accessibilityLabel={'Lesson Edit Button'}
          testID="lessonEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Lesson Delete Button'}
          testID="lessonDeleteButton"
        />
        {deleteModalVisible && (
          <LessonDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={lesson}
            testID="lessonDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    lesson: state.lessons.lesson,
    error: state.lessons.errorOne,
    fetching: state.lessons.fetchingOne,
    deleting: state.lessons.deleting,
    errorDeleting: state.lessons.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getLesson: id => dispatch(LessonActions.lessonRequest(id)),
    getAllLessons: options => dispatch(LessonActions.lessonAllRequest(options)),
    deleteLesson: id => dispatch(LessonActions.lessonDeleteRequest(id)),
    resetLessons: () => dispatch(LessonActions.lessonReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(LessonDetailScreen);
