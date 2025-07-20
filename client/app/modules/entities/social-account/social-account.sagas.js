import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import SocialAccountActions from './social-account.reducer';
import { convertDateTimeFromServer } from '../../../shared/util/date-transforms';

function* getSocialAccount(api, action) {
  const { socialAccountId } = action;
  // make the call to the api
  const apiCall = call(api.getSocialAccount, socialAccountId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(SocialAccountActions.socialAccountSuccess(response.data));
  } else {
    yield put(SocialAccountActions.socialAccountFailure(response.data));
  }
}

function* getAllSocialAccounts(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllSocialAccounts, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(SocialAccountActions.socialAccountAllSuccess(response.data, response.headers));
  } else {
    yield put(SocialAccountActions.socialAccountAllFailure(response.data));
  }
}

function* updateSocialAccount(api, action) {
  const { socialAccount } = action;
  // make the call to the api
  const idIsNotNull = !(socialAccount.id === null || socialAccount.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateSocialAccount : api.createSocialAccount, socialAccount);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(SocialAccountActions.socialAccountUpdateSuccess(response.data));
  } else {
    yield put(SocialAccountActions.socialAccountUpdateFailure(response.data));
  }
}

function* deleteSocialAccount(api, action) {
  const { socialAccountId } = action;
  // make the call to the api
  const apiCall = call(api.deleteSocialAccount, socialAccountId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(SocialAccountActions.socialAccountDeleteSuccess());
  } else {
    yield put(SocialAccountActions.socialAccountDeleteFailure(response.data));
  }
}
function mapDateFields(data) {
  data.tokenExpiry = convertDateTimeFromServer(data.tokenExpiry);
  return data;
}

export default {
  getAllSocialAccounts,
  getSocialAccount,
  deleteSocialAccount,
  updateSocialAccount,
};
