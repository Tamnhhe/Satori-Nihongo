import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  studentProfileRequest: ['studentProfileId'],
  studentProfileAllRequest: ['options'],
  studentProfileUpdateRequest: ['studentProfile'],
  studentProfileDeleteRequest: ['studentProfileId'],

  studentProfileSuccess: ['studentProfile'],
  studentProfileAllSuccess: ['studentProfileList', 'headers'],
  studentProfileUpdateSuccess: ['studentProfile'],
  studentProfileDeleteSuccess: [],

  studentProfileFailure: ['error'],
  studentProfileAllFailure: ['error'],
  studentProfileUpdateFailure: ['error'],
  studentProfileDeleteFailure: ['error'],

  studentProfileReset: [],
});

export const StudentProfileTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  studentProfile: { id: undefined },
  studentProfileList: [],
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
    studentProfile: INITIAL_STATE.studentProfile,
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
  const { studentProfile } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    studentProfile,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { studentProfileList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    studentProfileList: loadMoreDataWhenScrolled(state.studentProfileList, studentProfileList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { studentProfile } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    studentProfile,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    studentProfile: INITIAL_STATE.studentProfile,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    studentProfile: INITIAL_STATE.studentProfile,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    studentProfileList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    studentProfile: state.studentProfile,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    studentProfile: state.studentProfile,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.STUDENT_PROFILE_REQUEST]: request,
  [Types.STUDENT_PROFILE_ALL_REQUEST]: allRequest,
  [Types.STUDENT_PROFILE_UPDATE_REQUEST]: updateRequest,
  [Types.STUDENT_PROFILE_DELETE_REQUEST]: deleteRequest,

  [Types.STUDENT_PROFILE_SUCCESS]: success,
  [Types.STUDENT_PROFILE_ALL_SUCCESS]: allSuccess,
  [Types.STUDENT_PROFILE_UPDATE_SUCCESS]: updateSuccess,
  [Types.STUDENT_PROFILE_DELETE_SUCCESS]: deleteSuccess,

  [Types.STUDENT_PROFILE_FAILURE]: failure,
  [Types.STUDENT_PROFILE_ALL_FAILURE]: allFailure,
  [Types.STUDENT_PROFILE_UPDATE_FAILURE]: updateFailure,
  [Types.STUDENT_PROFILE_DELETE_FAILURE]: deleteFailure,
  [Types.STUDENT_PROFILE_RESET]: reset,
});
