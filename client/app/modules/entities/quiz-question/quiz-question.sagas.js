import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import QuizQuestionActions from './quiz-question.reducer';

function* getQuizQuestion(api, action) {
  const { quizQuestionId } = action;
  // make the call to the api
  const apiCall = call(api.getQuizQuestion, quizQuestionId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(QuizQuestionActions.quizQuestionSuccess(response.data));
  } else {
    yield put(QuizQuestionActions.quizQuestionFailure(response.data));
  }
}

function* getAllQuizQuestions(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllQuizQuestions, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(QuizQuestionActions.quizQuestionAllSuccess(response.data, response.headers));
  } else {
    yield put(QuizQuestionActions.quizQuestionAllFailure(response.data));
  }
}

function* updateQuizQuestion(api, action) {
  const { quizQuestion } = action;
  // make the call to the api
  const idIsNotNull = !(quizQuestion.id === null || quizQuestion.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateQuizQuestion : api.createQuizQuestion, quizQuestion);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(QuizQuestionActions.quizQuestionUpdateSuccess(response.data));
  } else {
    yield put(QuizQuestionActions.quizQuestionUpdateFailure(response.data));
  }
}

function* deleteQuizQuestion(api, action) {
  const { quizQuestionId } = action;
  // make the call to the api
  const apiCall = call(api.deleteQuizQuestion, quizQuestionId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(QuizQuestionActions.quizQuestionDeleteSuccess());
  } else {
    yield put(QuizQuestionActions.quizQuestionDeleteFailure(response.data));
  }
}

export default {
  getAllQuizQuestions,
  getQuizQuestion,
  deleteQuizQuestion,
  updateQuizQuestion,
};
