import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import StudentProfileSagas from '../../../../../app/modules/entities/student-profile/student-profile.sagas';
import StudentProfileActions from '../../../../../app/modules/entities/student-profile/student-profile.reducer';

const { getStudentProfile, getAllStudentProfiles, updateStudentProfile, deleteStudentProfile } = StudentProfileSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getStudentProfile(1);
  const step = stepper(getStudentProfile(FixtureAPI, { studentProfileId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(StudentProfileActions.studentProfileSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getStudentProfile(FixtureAPI, { studentProfileId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(StudentProfileActions.studentProfileFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllStudentProfiles();
  const step = stepper(getAllStudentProfiles(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(StudentProfileActions.studentProfileAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllStudentProfiles(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(StudentProfileActions.studentProfileAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateStudentProfile({ id: 1 });
  const step = stepper(updateStudentProfile(FixtureAPI, { studentProfile: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(StudentProfileActions.studentProfileUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateStudentProfile(FixtureAPI, { studentProfile: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(StudentProfileActions.studentProfileUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteStudentProfile({ id: 1 });
  const step = stepper(deleteStudentProfile(FixtureAPI, { studentProfileId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(StudentProfileActions.studentProfileDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteStudentProfile(FixtureAPI, { studentProfileId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(StudentProfileActions.studentProfileDeleteFailure()));
});
