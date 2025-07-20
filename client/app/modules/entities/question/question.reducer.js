import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  questionRequest: ['questionId'],
  questionAllRequest: ['options'],
  questionUpdateRequest: ['question'],
  questionDeleteRequest: ['questionId'],

  questionSuccess: ['question'],
  questionAllSuccess: ['questionList', 'headers'],
  questionUpdateSuccess: ['question'],
  questionDeleteSuccess: [],

  questionFailure: ['error'],
  questionAllFailure: ['error'],
  questionUpdateFailure: ['error'],
  questionDeleteFailure: ['error'],

  questionReset: [],
});

export const QuestionTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  question: { id: undefined },
  questionList: [],
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
    question: INITIAL_STATE.question,
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
  const { question } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    question,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { questionList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    questionList: loadMoreDataWhenScrolled(state.questionList, questionList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { question } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    question,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    question: INITIAL_STATE.question,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    question: INITIAL_STATE.question,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    questionList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    question: state.question,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    question: state.question,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.QUESTION_REQUEST]: request,
  [Types.QUESTION_ALL_REQUEST]: allRequest,
  [Types.QUESTION_UPDATE_REQUEST]: updateRequest,
  [Types.QUESTION_DELETE_REQUEST]: deleteRequest,

  [Types.QUESTION_SUCCESS]: success,
  [Types.QUESTION_ALL_SUCCESS]: allSuccess,
  [Types.QUESTION_UPDATE_SUCCESS]: updateSuccess,
  [Types.QUESTION_DELETE_SUCCESS]: deleteSuccess,

  [Types.QUESTION_FAILURE]: failure,
  [Types.QUESTION_ALL_FAILURE]: allFailure,
  [Types.QUESTION_UPDATE_FAILURE]: updateFailure,
  [Types.QUESTION_DELETE_FAILURE]: deleteFailure,
  [Types.QUESTION_RESET]: reset,
});
