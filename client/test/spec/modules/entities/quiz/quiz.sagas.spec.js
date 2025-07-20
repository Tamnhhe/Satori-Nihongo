import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import QuizSagas from '../../../../../app/modules/entities/quiz/quiz.sagas';
import QuizActions from '../../../../../app/modules/entities/quiz/quiz.reducer';

const { getQuiz, getAllQuizzes, updateQuiz, deleteQuiz } = QuizSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getQuiz(1);
  const step = stepper(getQuiz(FixtureAPI, { quizId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(QuizActions.quizSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getQuiz(FixtureAPI, { quizId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(QuizActions.quizFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllQuizzes();
  const step = stepper(getAllQuizzes(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(QuizActions.quizAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllQuizzes(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(QuizActions.quizAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateQuiz({ id: 1 });
  const step = stepper(updateQuiz(FixtureAPI, { quiz: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(QuizActions.quizUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateQuiz(FixtureAPI, { quiz: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(QuizActions.quizUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteQuiz({ id: 1 });
  const step = stepper(deleteQuiz(FixtureAPI, { quizId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(QuizActions.quizDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteQuiz(FixtureAPI, { quizId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(QuizActions.quizDeleteFailure()));
});
