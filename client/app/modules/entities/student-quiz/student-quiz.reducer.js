import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  studentQuizRequest: ['studentQuizId'],
  studentQuizAllRequest: ['options'],
  studentQuizUpdateRequest: ['studentQuiz'],
  studentQuizDeleteRequest: ['studentQuizId'],

  studentQuizSuccess: ['studentQuiz'],
  studentQuizAllSuccess: ['studentQuizList', 'headers'],
  studentQuizUpdateSuccess: ['studentQuiz'],
  studentQuizDeleteSuccess: [],

  studentQuizFailure: ['error'],
  studentQuizAllFailure: ['error'],
  studentQuizUpdateFailure: ['error'],
  studentQuizDeleteFailure: ['error'],

  studentQuizReset: [],
});

export const StudentQuizTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  studentQuiz: { id: undefined },
  studentQuizList: [],
  errorOne: null,
  errorAll: null,
  errorUpdating: null,
  errorDeleting: null,
  links: { next: 0 },
  totalItems: 0,
});

/* ------------- Reducers ------------- */

// request the data from an api
export const request = state =>
  state.merge({
    fetchingOne: true,
    errorOne: false,
    studentQuiz: INITIAL_STATE.studentQuiz,
  });

// request the data from an api
export const allRequest = state =>
  state.merge({
    fetchingAll: true,
    errorAll: false,
  });

// request to update from an api
export const updateRequest = state =>
  state.merge({
    updateSuccess: false,
    updating: true,
  });
// request to delete from an api
export const deleteRequest = state =>
  state.merge({
    deleting: true,
  });

// successful api lookup for single entity
export const success = (state, action) => {
  const { studentQuiz } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    studentQuiz,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { studentQuizList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    studentQuizList: loadMoreDataWhenScrolled(state.studentQuizList, studentQuizList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { studentQuiz } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    studentQuiz,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    studentQuiz: INITIAL_STATE.studentQuiz,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    studentQuiz: INITIAL_STATE.studentQuiz,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    studentQuizList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    studentQuiz: state.studentQuiz,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    studentQuiz: state.studentQuiz,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.STUDENT_QUIZ_REQUEST]: request,
  [Types.STUDENT_QUIZ_ALL_REQUEST]: allRequest,
  [Types.STUDENT_QUIZ_UPDATE_REQUEST]: updateRequest,
  [Types.STUDENT_QUIZ_DELETE_REQUEST]: deleteRequest,

  [Types.STUDENT_QUIZ_SUCCESS]: success,
  [Types.STUDENT_QUIZ_ALL_SUCCESS]: allSuccess,
  [Types.STUDENT_QUIZ_UPDATE_SUCCESS]: updateSuccess,
  [Types.STUDENT_QUIZ_DELETE_SUCCESS]: deleteSuccess,

  [Types.STUDENT_QUIZ_FAILURE]: failure,
  [Types.STUDENT_QUIZ_ALL_FAILURE]: allFailure,
  [Types.STUDENT_QUIZ_UPDATE_FAILURE]: updateFailure,
  [Types.STUDENT_QUIZ_DELETE_FAILURE]: deleteFailure,
  [Types.STUDENT_QUIZ_RESET]: reset,
});
