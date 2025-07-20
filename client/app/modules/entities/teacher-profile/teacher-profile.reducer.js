import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  teacherProfileRequest: ['teacherProfileId'],
  teacherProfileAllRequest: ['options'],
  teacherProfileUpdateRequest: ['teacherProfile'],
  teacherProfileDeleteRequest: ['teacherProfileId'],

  teacherProfileSuccess: ['teacherProfile'],
  teacherProfileAllSuccess: ['teacherProfileList', 'headers'],
  teacherProfileUpdateSuccess: ['teacherProfile'],
  teacherProfileDeleteSuccess: [],

  teacherProfileFailure: ['error'],
  teacherProfileAllFailure: ['error'],
  teacherProfileUpdateFailure: ['error'],
  teacherProfileDeleteFailure: ['error'],

  teacherProfileReset: [],
});

export const TeacherProfileTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  teacherProfile: { id: undefined },
  teacherProfileList: [],
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
    teacherProfile: INITIAL_STATE.teacherProfile,
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
  const { teacherProfile } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    teacherProfile,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { teacherProfileList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    teacherProfileList: loadMoreDataWhenScrolled(state.teacherProfileList, teacherProfileList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { teacherProfile } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    teacherProfile,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    teacherProfile: INITIAL_STATE.teacherProfile,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    teacherProfile: INITIAL_STATE.teacherProfile,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    teacherProfileList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    teacherProfile: state.teacherProfile,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    teacherProfile: state.teacherProfile,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.TEACHER_PROFILE_REQUEST]: request,
  [Types.TEACHER_PROFILE_ALL_REQUEST]: allRequest,
  [Types.TEACHER_PROFILE_UPDATE_REQUEST]: updateRequest,
  [Types.TEACHER_PROFILE_DELETE_REQUEST]: deleteRequest,

  [Types.TEACHER_PROFILE_SUCCESS]: success,
  [Types.TEACHER_PROFILE_ALL_SUCCESS]: allSuccess,
  [Types.TEACHER_PROFILE_UPDATE_SUCCESS]: updateSuccess,
  [Types.TEACHER_PROFILE_DELETE_SUCCESS]: deleteSuccess,

  [Types.TEACHER_PROFILE_FAILURE]: failure,
  [Types.TEACHER_PROFILE_ALL_FAILURE]: allFailure,
  [Types.TEACHER_PROFILE_UPDATE_FAILURE]: updateFailure,
  [Types.TEACHER_PROFILE_DELETE_FAILURE]: deleteFailure,
  [Types.TEACHER_PROFILE_RESET]: reset,
});
