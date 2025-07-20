import { call, put } from 'redux-saga/effects';
import { callApi } from '../../../shared/sagas/call-api.saga';
import StudentQuizActions from './student-quiz.reducer';
import { convertDateTimeFromServer } from '../../../shared/util/date-transforms';

function* getStudentQuiz(api, action) {
  const { studentQuizId } = action;
  // make the call to the api
  const apiCall = call(api.getStudentQuiz, studentQuizId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(StudentQuizActions.studentQuizSuccess(response.data));
  } else {
    yield put(StudentQuizActions.studentQuizFailure(response.data));
  }
}

function* getAllStudentQuizs(api, action) {
  const { options } = action;
  // make the call to the api
  const apiCall = call(api.getAllStudentQuizs, options);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(StudentQuizActions.studentQuizAllSuccess(response.data, response.headers));
  } else {
    yield put(StudentQuizActions.studentQuizAllFailure(response.data));
  }
}

function* updateStudentQuiz(api, action) {
  const { studentQuiz } = action;
  // make the call to the api
  const idIsNotNull = !(studentQuiz.id === null || studentQuiz.id === undefined);
  const apiCall = call(idIsNotNull ? api.updateStudentQuiz : api.createStudentQuiz, studentQuiz);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    response.data = mapDateFields(response.data);
    yield put(StudentQuizActions.studentQuizUpdateSuccess(response.data));
  } else {
    yield put(StudentQuizActions.studentQuizUpdateFailure(response.data));
  }
}

function* deleteStudentQuiz(api, action) {
  const { studentQuizId } = action;
  // make the call to the api
  const apiCall = call(api.deleteStudentQuiz, studentQuizId);
  const response = yield call(callApi, apiCall);

  // success?
  if (response.ok) {
    yield put(StudentQuizActions.studentQuizDeleteSuccess());
  } else {
    yield put(StudentQuizActions.studentQuizDeleteFailure(response.data));
  }
}
function mapDateFields(data) {
  data.startTime = convertDateTimeFromServer(data.startTime);
  data.endTime = convertDateTimeFromServer(data.endTime);
  return data;
}

export default {
  getAllStudentQuizs,
  getStudentQuiz,
  deleteStudentQuiz,
  updateStudentQuiz,
};
