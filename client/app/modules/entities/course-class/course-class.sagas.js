import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import CourseClassActions from './course-class.reducer';
import { convertDateTimeFromServer } from '../../../shared/util/date-transforms';

function* getCourseClass(api, action) {
  const { courseClassId } = action;
  // make the call to the api
  const apiCall = call(api.getCourseClass, courseClassId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(CourseClassActions.courseClassSuccess(response.data));
  } else {
    yield put(CourseClassActions.courseClassFailure(response.data));
  }
}

function* getAllCourseClasses(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllCourseClasses, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(CourseClassActions.courseClassAllSuccess(response.data, response.headers));
  } else {
    yield put(CourseClassActions.courseClassAllFailure(response.data));
  }
}

function* updateCourseClass(api, action) {
  const { courseClass } = action;
  // make the call to the api
  const idIsNotNull = !(courseClass.id === null || courseClass.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateCourseClass : api.createCourseClass, courseClass);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(CourseClassActions.courseClassUpdateSuccess(response.data));
  } else {
    yield put(CourseClassActions.courseClassUpdateFailure(response.data));
  }
}

function* deleteCourseClass(api, action) {
  const { courseClassId } = action;
  // make the call to the api
  const apiCall = call(api.deleteCourseClass, courseClassId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(CourseClassActions.courseClassDeleteSuccess());
  } else {
    yield put(CourseClassActions.courseClassDeleteFailure(response.data));
  }
}
function mapDateFields(data) {
  data.startDate = convertDateTimeFromServer(data.startDate);
  data.endDate = convertDateTimeFromServer(data.endDate);
  return data;
}

export default {
  getAllCourseClasses,
  getCourseClass,
  deleteCourseClass,
  updateCourseClass,
};
