import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import StudentQuizSagas from '../../../../../app/modules/entities/student-quiz/student-quiz.sagas';
import StudentQuizActions from '../../../../../app/modules/entities/student-quiz/student-quiz.reducer';

const { getStudentQuiz, getAllStudentQuizs, updateStudentQuiz, deleteStudentQuiz } = StudentQuizSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getStudentQuiz(1);
  const step = stepper(getStudentQuiz(FixtureAPI, { studentQuizId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(StudentQuizActions.studentQuizSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getStudentQuiz(FixtureAPI, { studentQuizId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(StudentQuizActions.studentQuizFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllStudentQuizs();
  const step = stepper(getAllStudentQuizs(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(StudentQuizActions.studentQuizAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllStudentQuizs(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(StudentQuizActions.studentQuizAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateStudentQuiz({ id: 1 });
  const step = stepper(updateStudentQuiz(FixtureAPI, { studentQuiz: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(StudentQuizActions.studentQuizUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateStudentQuiz(FixtureAPI, { studentQuiz: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(StudentQuizActions.studentQuizUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteStudentQuiz({ id: 1 });
  const step = stepper(deleteStudentQuiz(FixtureAPI, { studentQuizId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(StudentQuizActions.studentQuizDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteStudentQuiz(FixtureAPI, { studentQuizId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(StudentQuizActions.studentQuizDeleteFailure()));
});
