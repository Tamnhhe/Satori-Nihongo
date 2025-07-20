import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import CourseClassSagas from '../../../../../app/modules/entities/course-class/course-class.sagas';
import CourseClassActions from '../../../../../app/modules/entities/course-class/course-class.reducer';

const { getCourseClass, getAllCourseClasses, updateCourseClass, deleteCourseClass } = CourseClassSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getCourseClass(1);
  const step = stepper(getCourseClass(FixtureAPI, { courseClassId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(CourseClassActions.courseClassSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getCourseClass(FixtureAPI, { courseClassId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(CourseClassActions.courseClassFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllCourseClasses();
  const step = stepper(getAllCourseClasses(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(CourseClassActions.courseClassAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllCourseClasses(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(CourseClassActions.courseClassAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateCourseClass({ id: 1 });
  const step = stepper(updateCourseClass(FixtureAPI, { courseClass: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(CourseClassActions.courseClassUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateCourseClass(FixtureAPI, { courseClass: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(CourseClassActions.courseClassUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteCourseClass({ id: 1 });
  const step = stepper(deleteCourseClass(FixtureAPI, { courseClassId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(CourseClassActions.courseClassDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteCourseClass(FixtureAPI, { courseClassId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(CourseClassActions.courseClassDeleteFailure()));
});
