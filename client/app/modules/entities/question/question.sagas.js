import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import QuestionActions from './question.reducer';

function* getQuestion(api, action) {
  const { questionId } = action;
  // make the call to the api
  const apiCall = call(api.getQuestion, questionId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(QuestionActions.questionSuccess(response.data));
  } else {
    yield put(QuestionActions.questionFailure(response.data));
  }
}

function* getAllQuestions(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllQuestions, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(QuestionActions.questionAllSuccess(response.data, response.headers));
  } else {
    yield put(QuestionActions.questionAllFailure(response.data));
  }
}

function* updateQuestion(api, action) {
  const { question } = action;
  // make the call to the api
  const idIsNotNull = !(question.id === null || question.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateQuestion : api.createQuestion, question);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(QuestionActions.questionUpdateSuccess(response.data));
  } else {
    yield put(QuestionActions.questionUpdateFailure(response.data));
  }
}

function* deleteQuestion(api, action) {
  const { questionId } = action;
  // make the call to the api
  const apiCall = call(api.deleteQuestion, questionId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(QuestionActions.questionDeleteSuccess());
  } else {
    yield put(QuestionActions.questionDeleteFailure(response.data));
  }
}

export default {
  getAllQuestions,
  getQuestion,
  deleteQuestion,
  updateQuestion,
};
