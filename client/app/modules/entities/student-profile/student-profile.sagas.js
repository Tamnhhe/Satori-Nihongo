import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import StudentProfileActions from './student-profile.reducer';

function* getStudentProfile(api, action) {
  const { studentProfileId } = action;
  // make the call to the api
  const apiCall = call(api.getStudentProfile, studentProfileId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(StudentProfileActions.studentProfileSuccess(response.data));
  } else {
    yield put(StudentProfileActions.studentProfileFailure(response.data));
  }
}

function* getAllStudentProfiles(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllStudentProfiles, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(StudentProfileActions.studentProfileAllSuccess(response.data, response.headers));
  } else {
    yield put(StudentProfileActions.studentProfileAllFailure(response.data));
  }
}

function* updateStudentProfile(api, action) {
  const { studentProfile } = action;
  // make the call to the api
  const idIsNotNull = !(studentProfile.id === null || studentProfile.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateStudentProfile : api.createStudentProfile, studentProfile);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(StudentProfileActions.studentProfileUpdateSuccess(response.data));
  } else {
    yield put(StudentProfileActions.studentProfileUpdateFailure(response.data));
  }
}

function* deleteStudentProfile(api, action) {
  const { studentProfileId } = action;
  // make the call to the api
  const apiCall = call(api.deleteStudentProfile, studentProfileId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(StudentProfileActions.studentProfileDeleteSuccess());
  } else {
    yield put(StudentProfileActions.studentProfileDeleteFailure(response.data));
  }
}

export default {
  getAllStudentProfiles,
  getStudentProfile,
  deleteStudentProfile,
  updateStudentProfile,
};
