import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import LessonActions from './lesson.reducer';

function* getLesson(api, action) {
  const { lessonId } = action;
  // make the call to the api
  const apiCall = call(api.getLesson, lessonId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(LessonActions.lessonSuccess(response.data));
  } else {
    yield put(LessonActions.lessonFailure(response.data));
  }
}

function* getAllLessons(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllLessons, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(LessonActions.lessonAllSuccess(response.data, response.headers));
  } else {
    yield put(LessonActions.lessonAllFailure(response.data));
  }
}

function* updateLesson(api, action) {
  const { lesson } = action;
  // make the call to the api
  const idIsNotNull = !(lesson.id === null || lesson.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateLesson : api.createLesson, lesson);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(LessonActions.lessonUpdateSuccess(response.data));
  } else {
    yield put(LessonActions.lessonUpdateFailure(response.data));
  }
}

function* deleteLesson(api, action) {
  const { lessonId } = action;
  // make the call to the api
  const apiCall = call(api.deleteLesson, lessonId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(LessonActions.lessonDeleteSuccess());
  } else {
    yield put(LessonActions.lessonDeleteFailure(response.data));
  }
}

export default {
  getAllLessons,
  getLesson,
  deleteLesson,
  updateLesson,
};
