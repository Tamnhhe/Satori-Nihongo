import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import UserProfileSagas from '../../../../../app/modules/entities/user-profile/user-profile.sagas';
import UserProfileActions from '../../../../../app/modules/entities/user-profile/user-profile.reducer';

const { getUserProfile, getAllUserProfiles, updateUserProfile, deleteUserProfile } = UserProfileSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getUserProfile(1);
  const step = stepper(getUserProfile(FixtureAPI, { userProfileId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(UserProfileActions.userProfileSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getUserProfile(FixtureAPI, { userProfileId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(UserProfileActions.userProfileFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllUserProfiles();
  const step = stepper(getAllUserProfiles(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(UserProfileActions.userProfileAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllUserProfiles(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(UserProfileActions.userProfileAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateUserProfile({ id: 1 });
  const step = stepper(updateUserProfile(FixtureAPI, { userProfile: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(UserProfileActions.userProfileUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateUserProfile(FixtureAPI, { userProfile: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(UserProfileActions.userProfileUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteUserProfile({ id: 1 });
  const step = stepper(deleteUserProfile(FixtureAPI, { userProfileId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(UserProfileActions.userProfileDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteUserProfile(FixtureAPI, { userProfileId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(UserProfileActions.userProfileDeleteFailure()));
});
