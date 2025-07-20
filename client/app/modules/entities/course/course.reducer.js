import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  courseRequest: ['courseId'],
  courseAllRequest: ['options'],
  courseUpdateRequest: ['course'],
  courseDeleteRequest: ['courseId'],

  courseSuccess: ['course'],
  courseAllSuccess: ['courseList', 'headers'],
  courseUpdateSuccess: ['course'],
  courseDeleteSuccess: [],

  courseFailure: ['error'],
  courseAllFailure: ['error'],
  courseUpdateFailure: ['error'],
  courseDeleteFailure: ['error'],

  courseReset: [],
});

export const CourseTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  course: { id: undefined },
  courseList: [],
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
    course: INITIAL_STATE.course,
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
  const { course } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    course,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { courseList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    courseList: loadMoreDataWhenScrolled(state.courseList, courseList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { course } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    course,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    course: INITIAL_STATE.course,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    course: INITIAL_STATE.course,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    courseList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    course: state.course,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    course: state.course,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.COURSE_REQUEST]: request,
  [Types.COURSE_ALL_REQUEST]: allRequest,
  [Types.COURSE_UPDATE_REQUEST]: updateRequest,
  [Types.COURSE_DELETE_REQUEST]: deleteRequest,

  [Types.COURSE_SUCCESS]: success,
  [Types.COURSE_ALL_SUCCESS]: allSuccess,
  [Types.COURSE_UPDATE_SUCCESS]: updateSuccess,
  [Types.COURSE_DELETE_SUCCESS]: deleteSuccess,

  [Types.COURSE_FAILURE]: failure,
  [Types.COURSE_ALL_FAILURE]: allFailure,
  [Types.COURSE_UPDATE_FAILURE]: updateFailure,
  [Types.COURSE_DELETE_FAILURE]: deleteFailure,
  [Types.COURSE_RESET]: reset,
});
