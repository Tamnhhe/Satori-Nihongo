import React from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { connect } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';

import CourseClassActions from './course-class.reducer';
import RoundedButton from '../../../shared/components/rounded-button/rounded-button';
import CourseClassDeleteModal from './course-class-delete-modal';
import styles from './course-class-styles';

function CourseClassDetailScreen(props) {
  const { route, getCourseClass, navigation, courseClass, fetching, error } = props;
  const [deleteModalVisible, setDeleteModalVisible] = React.useState(false);
  // prevents display of stale reducer data
  const entityId = courseClass?.id ?? null;
  const routeEntityId = route.params?.entityId ?? null;
  const correctEntityLoaded = routeEntityId && entityId && routeEntityId.toString() === entityId.toString();

  useFocusEffect(
    React.useCallback(() => {
      if (!routeEntityId) {
        navigation.navigate('CourseClass');
      } else {
        setDeleteModalVisible(false);
        getCourseClass(routeEntityId);
      }
    }, [routeEntityId, getCourseClass, navigation]),
  );

  if (!entityId && !fetching && error) {
    return (
      <View style={styles.loading}>
        <Text>Something went wrong fetching the CourseClass.</Text>
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
    <ScrollView style={styles.container} contentContainerStyle={styles.paddedScrollView} testID="courseClassDetailScrollView">
      <Text style={styles.label}>Id:</Text>
      <Text>{courseClass.id}</Text>
      {/* Code Field */}
      <Text style={styles.label}>Code:</Text>
      <Text testID="code">{courseClass.code}</Text>
      {/* Name Field */}
      <Text style={styles.label}>Name:</Text>
      <Text testID="name">{courseClass.name}</Text>
      {/* Description Field */}
      <Text style={styles.label}>Description:</Text>
      <Text testID="description">{courseClass.description}</Text>
      {/* StartDate Field */}
      <Text style={styles.label}>StartDate:</Text>
      <Text testID="startDate">{String(courseClass.startDate)}</Text>
      {/* EndDate Field */}
      <Text style={styles.label}>EndDate:</Text>
      <Text testID="endDate">{String(courseClass.endDate)}</Text>
      {/* Capacity Field */}
      <Text style={styles.label}>Capacity:</Text>
      <Text testID="capacity">{courseClass.capacity}</Text>
      <Text style={styles.label}>Course:</Text>
      <Text testID="course">{String(courseClass.course ? courseClass.course.id : '')}</Text>
      <Text style={styles.label}>Teacher:</Text>
      <Text testID="teacher">{String(courseClass.teacher ? courseClass.teacher.id : '')}</Text>
      <Text style={styles.label}>Students:</Text>
      {courseClass.students &&
        courseClass.students.map((entity, index) => (
          <Text key={index} testID={`students-${index}`}>
            {String(entity.id || '')}
          </Text>
        ))}

      <View style={styles.entityButtons}>
        <RoundedButton
          text="Edit"
          onPress={() => navigation.navigate('CourseClassEdit', { entityId })}
          accessibilityLabel={'CourseClass Edit Button'}
          testID="courseClassEditButton"
        />
        <RoundedButton
          text="Delete"
          onPress={() => setDeleteModalVisible(true)}
          accessibilityLabel={'CourseClass Delete Button'}
          testID="courseClassDeleteButton"
        />
        {deleteModalVisible && (
          <CourseClassDeleteModal
            navigation={navigation}
            visible={deleteModalVisible}
            setVisible={setDeleteModalVisible}
            entity={courseClass}
            testID="courseClassDeleteModal"
          />
        )}
      </View>
    </ScrollView>
  );
}

const mapStateToProps = state => {
  return {
    courseClass: state.courseClasses.courseClass,
    error: state.courseClasses.errorOne,
    fetching: state.courseClasses.fetchingOne,
    deleting: state.courseClasses.deleting,
    errorDeleting: state.courseClasses.errorDeleting,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getCourseClass: id => dispatch(CourseClassActions.courseClassRequest(id)),
    getAllCourseClasses: options => dispatch(CourseClassActions.courseClassAllRequest(options)),
    deleteCourseClass: id => dispatch(CourseClassActions.courseClassDeleteRequest(id)),
    resetCourseClasses: () => dispatch(CourseClassActions.courseClassReset()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(CourseClassDetailScreen);
