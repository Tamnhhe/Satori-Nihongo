import { put } from 'redux-saga/effects';

import FixtureAPI from '../../../../../app/shared/services/fixture-api';
import FlashcardSagas from '../../../../../app/modules/entities/flashcard/flashcard.sagas';
import FlashcardActions from '../../../../../app/modules/entities/flashcard/flashcard.reducer';

const { getFlashcard, getAllFlashcards, updateFlashcard, deleteFlashcard } = FlashcardSagas;
const stepper = fn => mock => fn.next(mock).value;

test('get success path', () => {
  const response = FixtureAPI.getFlashcard(1);
  const step = stepper(getFlashcard(FixtureAPI, { flashcardId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(FlashcardActions.flashcardSuccess(response.data)));
});

test('get failure path', () => {
  const response = { ok: false };
  const step = stepper(getFlashcard(FixtureAPI, { flashcardId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(FlashcardActions.flashcardFailure()));
});

test('getAll success path', () => {
  const response = FixtureAPI.getAllFlashcards();
  const step = stepper(getAllFlashcards(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(FlashcardActions.flashcardAllSuccess([{ id: 1 }, { id: 2 }])));
});

test('getAll failure path', () => {
  const response = { ok: false };
  const step = stepper(getAllFlashcards(FixtureAPI, { options: { page: 0, sort: 'id,asc', size: 20 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(FlashcardActions.flashcardAllFailure()));
});

test('update success path', () => {
  const response = FixtureAPI.updateFlashcard({ id: 1 });
  const step = stepper(updateFlashcard(FixtureAPI, { flashcard: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(FlashcardActions.flashcardUpdateSuccess(response.data)));
});

test('update failure path', () => {
  const response = { ok: false };
  const step = stepper(updateFlashcard(FixtureAPI, { flashcard: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(FlashcardActions.flashcardUpdateFailure()));
});

test('delete success path', () => {
  const response = FixtureAPI.deleteFlashcard({ id: 1 });
  const step = stepper(deleteFlashcard(FixtureAPI, { flashcardId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Successful return and data!
  expect(step(response)).toEqual(put(FlashcardActions.flashcardDeleteSuccess(response.data)));
});

test('delete failure path', () => {
  const response = { ok: false };
  const step = stepper(deleteFlashcard(FixtureAPI, { flashcardId: { id: 1 } }));
  // Step 1: Hit the api
  step();
  // Step 2: Failed response.
  expect(step(response)).toEqual(put(FlashcardActions.flashcardDeleteFailure()));
});
