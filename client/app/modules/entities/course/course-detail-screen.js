import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import CourseActions from './course.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import CourseDeleteModal from './course-delete-modal';
import styles from './course-styles';

function CourseDetailScreen(props) {
  const { route, getCourse, navigation, course, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = course?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('Course');
      } else {
        setDeleteModalVisible(false);
        getCourse(routeEntityId);
      }
    }, [routeEntityId, getCourse, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the Course.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="courseDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{course.id}</Text>
      {/* Title Field */}
      <Text style={styles.label}>Title:</Text>
      <Text testID="title">{course.title}</Text>
      {/* Description Field */}
      <Text style={styles.label}>Description:</Text>
      <Text testID="description">{course.description}</Text>
      {/* CourseCode Field */}
      <Text style={styles.label}>CourseCode:</Text>
      <Text testID="courseCode">{course.courseCode}</Text>
      <Text style={styles.label}>Teacher:</Text>
      <Text testID="teacher">{String(course.teacher ? course.teacher.id : '')}</Text>

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('CourseEdit', { entityId })}
          accessibilityLabel={'Course Edit Button'}
          testID="courseEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'Course Delete Button'}
          testID="courseDeleteButton"
        />
        {deleteModalVisible && (
          <CourseDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={course}
            testID="courseDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    course: state.courses.course,
    error: state.courses.errorOne,
    fetching: state.courses.fetchingOne,
    deleting: state.courses.deleting,
    errorDeleting: state.courses.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCourse: id => dispatch(CourseActions.courseRequest(id)),
    getAllCourses: options => dispatch(CourseActions.courseAllRequest(options)),
    deleteCourse: id => dispatch(CourseActions.courseDeleteRequest(id)),
    resetCourses: () => dispatch(CourseActions.courseReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseDetailScreen);
