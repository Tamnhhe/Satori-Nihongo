import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import TeacherProfileActions from './teacher-profile.reducer';

function* getTeacherProfile(api, action) {
  const { teacherProfileId } = action;
  // make the call to the api
  const apiCall = call(api.getTeacherProfile, teacherProfileId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(TeacherProfileActions.teacherProfileSuccess(response.data));
  } else {
    yield put(TeacherProfileActions.teacherProfileFailure(response.data));
  }
}

function* getAllTeacherProfiles(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllTeacherProfiles, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(TeacherProfileActions.teacherProfileAllSuccess(response.data, response.headers));
  } else {
    yield put(TeacherProfileActions.teacherProfileAllFailure(response.data));
  }
}

function* updateTeacherProfile(api, action) {
  const { teacherProfile } = action;
  // make the call to the api
  const idIsNotNull = !(teacherProfile.id === null || teacherProfile.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateTeacherProfile : api.createTeacherProfile, teacherProfile);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(TeacherProfileActions.teacherProfileUpdateSuccess(response.data));
  } else {
    yield put(TeacherProfileActions.teacherProfileUpdateFailure(response.data));
  }
}

function* deleteTeacherProfile(api, action) {
  const { teacherProfileId } = action;
  // make the call to the api
  const apiCall = call(api.deleteTeacherProfile, teacherProfileId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(TeacherProfileActions.teacherProfileDeleteSuccess());
  } else {
    yield put(TeacherProfileActions.teacherProfileDeleteFailure(response.data));
  }
}

export default {
  getAllTeacherProfiles,
  getTeacherProfile,
  deleteTeacherProfile,
  updateTeacherProfile,
};
