import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import TeacherProfileSagas from '../../../../../app/modules/entities/teacher-profile/teacher-profile.sagas';
import TeacherProfileActions from '../../../../../app/modules/entities/teacher-profile/teacher-profile.reducer';

const { getTeacherProfile, getAllTeacherProfiles, updateTeacherProfile, deleteTeacherProfile } = TeacherProfileSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getTeacherProfile(1);
  const step = stepper(getTeacherProfile(FixtureAPI, { teacherProfileId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(TeacherProfileActions.teacherProfileSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getTeacherProfile(FixtureAPI, { teacherProfileId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(TeacherProfileActions.teacherProfileFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllTeacherProfiles();
  const step = stepper(getAllTeacherProfiles(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(TeacherProfileActions.teacherProfileAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllTeacherProfiles(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(TeacherProfileActions.teacherProfileAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateTeacherProfile({ id: 1 });
  const step = stepper(updateTeacherProfile(FixtureAPI, { teacherProfile: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(TeacherProfileActions.teacherProfileUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateTeacherProfile(FixtureAPI, { teacherProfile: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(TeacherProfileActions.teacherProfileUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteTeacherProfile({ id: 1 });
  const step = stepper(deleteTeacherProfile(FixtureAPI, { teacherProfileId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(TeacherProfileActions.teacherProfileDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteTeacherProfile(FixtureAPI, { teacherProfileId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(TeacherProfileActions.teacherProfileDeleteFailure()));
});
