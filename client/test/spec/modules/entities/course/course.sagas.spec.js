import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import CourseSagas from '../../../../../app/modules/entities/course/course.sagas';
import CourseActions from '../../../../../app/modules/entities/course/course.reducer';

const { getCourse, getAllCourses, updateCourse, deleteCourse } = CourseSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getCourse(1);
  const step = stepper(getCourse(FixtureAPI, { courseId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(CourseActions.courseSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getCourse(FixtureAPI, { courseId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(CourseActions.courseFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllCourses();
  const step = stepper(getAllCourses(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(CourseActions.courseAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllCourses(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(CourseActions.courseAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateCourse({ id: 1 });
  const step = stepper(updateCourse(FixtureAPI, { course: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(CourseActions.courseUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateCourse(FixtureAPI, { course: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(CourseActions.courseUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteCourse({ id: 1 });
  const step = stepper(deleteCourse(FixtureAPI, { courseId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(CourseActions.courseDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteCourse(FixtureAPI, { courseId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(CourseActions.courseDeleteFailure()));
});
