import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import QuizActions from './quiz.reducer';

function* getQuiz(api, action) {
  const { quizId } = action;
  // make the call to the api
  const apiCall = call(api.getQuiz, quizId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(QuizActions.quizSuccess(response.data));
  } else {
    yield put(QuizActions.quizFailure(response.data));
  }
}

function* getAllQuizzes(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllQuizzes, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(QuizActions.quizAllSuccess(response.data, response.headers));
  } else {
    yield put(QuizActions.quizAllFailure(response.data));
  }
}

function* updateQuiz(api, action) {
  const { quiz } = action;
  // make the call to the api
  const idIsNotNull = !(quiz.id === null || quiz.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateQuiz : api.createQuiz, quiz);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(QuizActions.quizUpdateSuccess(response.data));
  } else {
    yield put(QuizActions.quizUpdateFailure(response.data));
  }
}

function* deleteQuiz(api, action) {
  const { quizId } = action;
  // make the call to the api
  const apiCall = call(api.deleteQuiz, quizId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(QuizActions.quizDeleteSuccess());
  } else {
    yield put(QuizActions.quizDeleteFailure(response.data));
  }
}

export default {
  getAllQuizzes,
  getQuiz,
  deleteQuiz,
  updateQuiz,
};
