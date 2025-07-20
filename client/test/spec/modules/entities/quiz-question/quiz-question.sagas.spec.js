import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import QuizQuestionSagas from '../../../../../app/modules/entities/quiz-question/quiz-question.sagas';
import QuizQuestionActions from '../../../../../app/modules/entities/quiz-question/quiz-question.reducer';

const { getQuizQuestion, getAllQuizQuestions, updateQuizQuestion, deleteQuizQuestion } = QuizQuestionSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getQuizQuestion(1);
  const step = stepper(getQuizQuestion(FixtureAPI, { quizQuestionId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(QuizQuestionActions.quizQuestionSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getQuizQuestion(FixtureAPI, { quizQuestionId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(QuizQuestionActions.quizQuestionFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllQuizQuestions();
  const step = stepper(getAllQuizQuestions(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(QuizQuestionActions.quizQuestionAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllQuizQuestions(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(QuizQuestionActions.quizQuestionAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateQuizQuestion({ id: 1 });
  const step = stepper(updateQuizQuestion(FixtureAPI, { quizQuestion: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(QuizQuestionActions.quizQuestionUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateQuizQuestion(FixtureAPI, { quizQuestion: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(QuizQuestionActions.quizQuestionUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteQuizQuestion({ id: 1 });
  const step = stepper(deleteQuizQuestion(FixtureAPI, { quizQuestionId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(QuizQuestionActions.quizQuestionDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteQuizQuestion(FixtureAPI, { quizQuestionId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(QuizQuestionActions.quizQuestionDeleteFailure()));
});
