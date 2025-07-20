import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  lessonRequest: ['lessonId'],
  lessonAllRequest: ['options'],
  lessonUpdateRequest: ['lesson'],
  lessonDeleteRequest: ['lessonId'],

  lessonSuccess: ['lesson'],
  lessonAllSuccess: ['lessonList', 'headers'],
  lessonUpdateSuccess: ['lesson'],
  lessonDeleteSuccess: [],

  lessonFailure: ['error'],
  lessonAllFailure: ['error'],
  lessonUpdateFailure: ['error'],
  lessonDeleteFailure: ['error'],

  lessonReset: [],
});

export const LessonTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  lesson: { id: undefined },
  lessonList: [],
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
    lesson: INITIAL_STATE.lesson,
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
  const { lesson } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    lesson,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { lessonList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    lessonList: loadMoreDataWhenScrolled(state.lessonList, lessonList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { lesson } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    lesson,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    lesson: INITIAL_STATE.lesson,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    lesson: INITIAL_STATE.lesson,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    lessonList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    lesson: state.lesson,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    lesson: state.lesson,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.LESSON_REQUEST]: request,
  [Types.LESSON_ALL_REQUEST]: allRequest,
  [Types.LESSON_UPDATE_REQUEST]: updateRequest,
  [Types.LESSON_DELETE_REQUEST]: deleteRequest,

  [Types.LESSON_SUCCESS]: success,
  [Types.LESSON_ALL_SUCCESS]: allSuccess,
  [Types.LESSON_UPDATE_SUCCESS]: updateSuccess,
  [Types.LESSON_DELETE_SUCCESS]: deleteSuccess,

  [Types.LESSON_FAILURE]: failure,
  [Types.LESSON_ALL_FAILURE]: allFailure,
  [Types.LESSON_UPDATE_FAILURE]: updateFailure,
  [Types.LESSON_DELETE_FAILURE]: deleteFailure,
  [Types.LESSON_RESET]: reset,
});
