import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import ScheduleSagas from '../../../../../app/modules/entities/schedule/schedule.sagas';
import ScheduleActions from '../../../../../app/modules/entities/schedule/schedule.reducer';

const { getSchedule, getAllSchedules, updateSchedule, deleteSchedule } = ScheduleSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getSchedule(1);
  const step = stepper(getSchedule(FixtureAPI, { scheduleId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(ScheduleActions.scheduleSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getSchedule(FixtureAPI, { scheduleId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(ScheduleActions.scheduleFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllSchedules();
  const step = stepper(getAllSchedules(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(ScheduleActions.scheduleAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllSchedules(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(ScheduleActions.scheduleAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateSchedule({ id: 1 });
  const step = stepper(updateSchedule(FixtureAPI, { schedule: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(ScheduleActions.scheduleUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateSchedule(FixtureAPI, { schedule: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(ScheduleActions.scheduleUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteSchedule({ id: 1 });
  const step = stepper(deleteSchedule(FixtureAPI, { scheduleId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(ScheduleActions.scheduleDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteSchedule(FixtureAPI, { scheduleId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(ScheduleActions.scheduleDeleteFailure()));
});
