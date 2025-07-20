import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  courseClassRequest: ['courseClassId'],
  courseClassAllRequest: ['options'],
  courseClassUpdateRequest: ['courseClass'],
  courseClassDeleteRequest: ['courseClassId'],

  courseClassSuccess: ['courseClass'],
  courseClassAllSuccess: ['courseClassList', 'headers'],
  courseClassUpdateSuccess: ['courseClass'],
  courseClassDeleteSuccess: [],

  courseClassFailure: ['error'],
  courseClassAllFailure: ['error'],
  courseClassUpdateFailure: ['error'],
  courseClassDeleteFailure: ['error'],

  courseClassReset: [],
});

export const CourseClassTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  courseClass: { id: undefined },
  courseClassList: [],
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
    courseClass: INITIAL_STATE.courseClass,
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
  const { courseClass } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    courseClass,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { courseClassList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    courseClassList: loadMoreDataWhenScrolled(state.courseClassList, courseClassList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { courseClass } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    courseClass,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    courseClass: INITIAL_STATE.courseClass,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    courseClass: INITIAL_STATE.courseClass,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    courseClassList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    courseClass: state.courseClass,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    courseClass: state.courseClass,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.COURSE_CLASS_REQUEST]: request,
  [Types.COURSE_CLASS_ALL_REQUEST]: allRequest,
  [Types.COURSE_CLASS_UPDATE_REQUEST]: updateRequest,
  [Types.COURSE_CLASS_DELETE_REQUEST]: deleteRequest,

  [Types.COURSE_CLASS_SUCCESS]: success,
  [Types.COURSE_CLASS_ALL_SUCCESS]: allSuccess,
  [Types.COURSE_CLASS_UPDATE_SUCCESS]: updateSuccess,
  [Types.COURSE_CLASS_DELETE_SUCCESS]: deleteSuccess,

  [Types.COURSE_CLASS_FAILURE]: failure,
  [Types.COURSE_CLASS_ALL_FAILURE]: allFailure,
  [Types.COURSE_CLASS_UPDATE_FAILURE]: updateFailure,
  [Types.COURSE_CLASS_DELETE_FAILURE]: deleteFailure,
  [Types.COURSE_CLASS_RESET]: reset,
});
