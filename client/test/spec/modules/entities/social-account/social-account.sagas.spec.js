import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import SocialAccountSagas from '../../../../../app/modules/entities/social-account/social-account.sagas';
import SocialAccountActions from '../../../../../app/modules/entities/social-account/social-account.reducer';

const { getSocialAccount, getAllSocialAccounts, updateSocialAccount, deleteSocialAccount } = SocialAccountSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getSocialAccount(1);
  const step = stepper(getSocialAccount(FixtureAPI, { socialAccountId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(SocialAccountActions.socialAccountSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getSocialAccount(FixtureAPI, { socialAccountId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(SocialAccountActions.socialAccountFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllSocialAccounts();
  const step = stepper(getAllSocialAccounts(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(SocialAccountActions.socialAccountAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllSocialAccounts(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(SocialAccountActions.socialAccountAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateSocialAccount({ id: 1 });
  const step = stepper(updateSocialAccount(FixtureAPI, { socialAccount: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(SocialAccountActions.socialAccountUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateSocialAccount(FixtureAPI, { socialAccount: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(SocialAccountActions.socialAccountUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteSocialAccount({ id: 1 });
  const step = stepper(deleteSocialAccount(FixtureAPI, { socialAccountId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(SocialAccountActions.socialAccountDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteSocialAccount(FixtureAPI, { socialAccountId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(SocialAccountActions.socialAccountDeleteFailure()));
});
