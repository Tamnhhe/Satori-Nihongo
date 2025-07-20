import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import FlashcardActions from './flashcard.reducer';

function* getFlashcard(api, action) {
  const { flashcardId } = action;
  // make the call to the api
  const apiCall = call(api.getFlashcard, flashcardId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(FlashcardActions.flashcardSuccess(response.data));
  } else {
    yield put(FlashcardActions.flashcardFailure(response.data));
  }
}

function* getAllFlashcards(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllFlashcards, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(FlashcardActions.flashcardAllSuccess(response.data, response.headers));
  } else {
    yield put(FlashcardActions.flashcardAllFailure(response.data));
  }
}

function* updateFlashcard(api, action) {
  const { flashcard } = action;
  // make the call to the api
  const idIsNotNull = !(flashcard.id === null || flashcard.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateFlashcard : api.createFlashcard, flashcard);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(FlashcardActions.flashcardUpdateSuccess(response.data));
  } else {
    yield put(FlashcardActions.flashcardUpdateFailure(response.data));
  }
}

function* deleteFlashcard(api, action) {
  const { flashcardId } = action;
  // make the call to the api
  const apiCall = call(api.deleteFlashcard, flashcardId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(FlashcardActions.flashcardDeleteSuccess());
  } else {
    yield put(FlashcardActions.flashcardDeleteFailure(response.data));
  }
}

export default {
  getAllFlashcards,
  getFlashcard,
  deleteFlashcard,
  updateFlashcard,
};
