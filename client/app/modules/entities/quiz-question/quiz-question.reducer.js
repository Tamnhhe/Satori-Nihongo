import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  quizQuestionRequest: ['quizQuestionId'],
  quizQuestionAllRequest: ['options'],
  quizQuestionUpdateRequest: ['quizQuestion'],
  quizQuestionDeleteRequest: ['quizQuestionId'],

  quizQuestionSuccess: ['quizQuestion'],
  quizQuestionAllSuccess: ['quizQuestionList', 'headers'],
  quizQuestionUpdateSuccess: ['quizQuestion'],
  quizQuestionDeleteSuccess: [],

  quizQuestionFailure: ['error'],
  quizQuestionAllFailure: ['error'],
  quizQuestionUpdateFailure: ['error'],
  quizQuestionDeleteFailure: ['error'],

  quizQuestionReset: [],
});

export const QuizQuestionTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  quizQuestion: { id: undefined },
  quizQuestionList: [],
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
    quizQuestion: INITIAL_STATE.quizQuestion,
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
  const { quizQuestion } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    quizQuestion,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { quizQuestionList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    quizQuestionList: loadMoreDataWhenScrolled(state.quizQuestionList, quizQuestionList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { quizQuestion } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    quizQuestion,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    quizQuestion: INITIAL_STATE.quizQuestion,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    quizQuestion: INITIAL_STATE.quizQuestion,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    quizQuestionList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    quizQuestion: state.quizQuestion,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    quizQuestion: state.quizQuestion,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.QUIZ_QUESTION_REQUEST]: request,
  [Types.QUIZ_QUESTION_ALL_REQUEST]: allRequest,
  [Types.QUIZ_QUESTION_UPDATE_REQUEST]: updateRequest,
  [Types.QUIZ_QUESTION_DELETE_REQUEST]: deleteRequest,

  [Types.QUIZ_QUESTION_SUCCESS]: success,
  [Types.QUIZ_QUESTION_ALL_SUCCESS]: allSuccess,
  [Types.QUIZ_QUESTION_UPDATE_SUCCESS]: updateSuccess,
  [Types.QUIZ_QUESTION_DELETE_SUCCESS]: deleteSuccess,

  [Types.QUIZ_QUESTION_FAILURE]: failure,
  [Types.QUIZ_QUESTION_ALL_FAILURE]: allFailure,
  [Types.QUIZ_QUESTION_UPDATE_FAILURE]: updateFailure,
  [Types.QUIZ_QUESTION_DELETE_FAILURE]: deleteFailure,
  [Types.QUIZ_QUESTION_RESET]: reset,
});
