import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import UserProfileActions from './user-profile.reducer';

function* getUserProfile(api, action) {
  const { userProfileId } = action;
  // make the call to the api
  const apiCall = call(api.getUserProfile, userProfileId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(UserProfileActions.userProfileSuccess(response.data));
  } else {
    yield put(UserProfileActions.userProfileFailure(response.data));
  }
}

function* getAllUserProfiles(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllUserProfiles, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(UserProfileActions.userProfileAllSuccess(response.data, response.headers));
  } else {
    yield put(UserProfileActions.userProfileAllFailure(response.data));
  }
}

function* updateUserProfile(api, action) {
  const { userProfile } = action;
  // make the call to the api
  const idIsNotNull = !(userProfile.id === null || userProfile.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateUserProfile : api.createUserProfile, userProfile);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(UserProfileActions.userProfileUpdateSuccess(response.data));
  } else {
    yield put(UserProfileActions.userProfileUpdateFailure(response.data));
  }
}

function* deleteUserProfile(api, action) {
  const { userProfileId } = action;
  // make the call to the api
  const apiCall = call(api.deleteUserProfile, userProfileId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(UserProfileActions.userProfileDeleteSuccess());
  } else {
    yield put(UserProfileActions.userProfileDeleteFailure(response.data));
  }
}

export default {
  getAllUserProfiles,
  getUserProfile,
  deleteUserProfile,
  updateUserProfile,
};
