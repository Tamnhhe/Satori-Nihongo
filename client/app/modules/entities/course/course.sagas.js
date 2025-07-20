import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import CourseActions from './course.reducer';

function* getCourse(api, action) {
  const { courseId } = action;
  // make the call to the api
  const apiCall = call(api.getCourse, courseId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(CourseActions.courseSuccess(response.data));
  } else {
    yield put(CourseActions.courseFailure(response.data));
  }
}

function* getAllCourses(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllCourses, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(CourseActions.courseAllSuccess(response.data, response.headers));
  } else {
    yield put(CourseActions.courseAllFailure(response.data));
  }
}

function* updateCourse(api, action) {
  const { course } = action;
  // make the call to the api
  const idIsNotNull = !(course.id === null || course.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateCourse : api.createCourse, course);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(CourseActions.courseUpdateSuccess(response.data));
  } else {
    yield put(CourseActions.courseUpdateFailure(response.data));
  }
}

function* deleteCourse(api, action) {
  const { courseId } = action;
  // make the call to the api
  const apiCall = call(api.deleteCourse, courseId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(CourseActions.courseDeleteSuccess());
  } else {
    yield put(CourseActions.courseDeleteFailure(response.data));
  }
}

export default {
  getAllCourses,
  getCourse,
  deleteCourse,
  updateCourse,
};
