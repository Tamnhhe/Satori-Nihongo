import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import LessonSagas from '../../../../../app/modules/entities/lesson/lesson.sagas';
import LessonActions from '../../../../../app/modules/entities/lesson/lesson.reducer';

const { getLesson, getAllLessons, updateLesson, deleteLesson } = LessonSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getLesson(1);
  const step = stepper(getLesson(FixtureAPI, { lessonId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(LessonActions.lessonSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getLesson(FixtureAPI, { lessonId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(LessonActions.lessonFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllLessons();
  const step = stepper(getAllLessons(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(LessonActions.lessonAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllLessons(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(LessonActions.lessonAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateLesson({ id: 1 });
  const step = stepper(updateLesson(FixtureAPI, { lesson: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(LessonActions.lessonUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateLesson(FixtureAPI, { lesson: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(LessonActions.lessonUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteLesson({ id: 1 });
  const step = stepper(deleteLesson(FixtureAPI, { lessonId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(LessonActions.lessonDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteLesson(FixtureAPI, { lessonId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(LessonActions.lessonDeleteFailure()));
});
