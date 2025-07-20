import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  quizRequest: ['quizId'],
  quizAllRequest: ['options'],
  quizUpdateRequest: ['quiz'],
  quizDeleteRequest: ['quizId'],

  quizSuccess: ['quiz'],
  quizAllSuccess: ['quizList', 'headers'],
  quizUpdateSuccess: ['quiz'],
  quizDeleteSuccess: [],

  quizFailure: ['error'],
  quizAllFailure: ['error'],
  quizUpdateFailure: ['error'],
  quizDeleteFailure: ['error'],

  quizReset: [],
});

export const QuizTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  quiz: { id: undefined },
  quizList: [],
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
    quiz: INITIAL_STATE.quiz,
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
  const { quiz } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    quiz,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { quizList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    quizList: loadMoreDataWhenScrolled(state.quizList, quizList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { quiz } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    quiz,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    quiz: INITIAL_STATE.quiz,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    quiz: INITIAL_STATE.quiz,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    quizList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    quiz: state.quiz,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    quiz: state.quiz,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.QUIZ_REQUEST]: request,
  [Types.QUIZ_ALL_REQUEST]: allRequest,
  [Types.QUIZ_UPDATE_REQUEST]: updateRequest,
  [Types.QUIZ_DELETE_REQUEST]: deleteRequest,

  [Types.QUIZ_SUCCESS]: success,
  [Types.QUIZ_ALL_SUCCESS]: allSuccess,
  [Types.QUIZ_UPDATE_SUCCESS]: updateSuccess,
  [Types.QUIZ_DELETE_SUCCESS]: deleteSuccess,

  [Types.QUIZ_FAILURE]: failure,
  [Types.QUIZ_ALL_FAILURE]: allFailure,
  [Types.QUIZ_UPDATE_FAILURE]: updateFailure,
  [Types.QUIZ_DELETE_FAILURE]: deleteFailure,
  [Types.QUIZ_RESET]: reset,
});
