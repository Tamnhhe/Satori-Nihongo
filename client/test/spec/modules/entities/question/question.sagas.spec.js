import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import QuestionSagas from '../../../../../app/modules/entities/question/question.sagas';
import QuestionActions from '../../../../../app/modules/entities/question/question.reducer';

const { getQuestion, getAllQuestions, updateQuestion, deleteQuestion } = QuestionSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getQuestion(1);
  const step = stepper(getQuestion(FixtureAPI, { questionId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(QuestionActions.questionSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getQuestion(FixtureAPI, { questionId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(QuestionActions.questionFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllQuestions();
  const step = stepper(getAllQuestions(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(QuestionActions.questionAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllQuestions(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(QuestionActions.questionAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateQuestion({ id: 1 });
  const step = stepper(updateQuestion(FixtureAPI, { question: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(QuestionActions.questionUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateQuestion(FixtureAPI, { question: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(QuestionActions.questionUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteQuestion({ id: 1 });
  const step = stepper(deleteQuestion(FixtureAPI, { questionId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(QuestionActions.questionDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteQuestion(FixtureAPI, { questionId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(QuestionActions.questionDeleteFailure()));
});
