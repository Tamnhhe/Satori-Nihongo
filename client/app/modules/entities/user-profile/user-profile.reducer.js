import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  userProfileRequest: ['userProfileId'],
  userProfileAllRequest: ['options'],
  userProfileUpdateRequest: ['userProfile'],
  userProfileDeleteRequest: ['userProfileId'],

  userProfileSuccess: ['userProfile'],
  userProfileAllSuccess: ['userProfileList', 'headers'],
  userProfileUpdateSuccess: ['userProfile'],
  userProfileDeleteSuccess: [],

  userProfileFailure: ['error'],
  userProfileAllFailure: ['error'],
  userProfileUpdateFailure: ['error'],
  userProfileDeleteFailure: ['error'],

  userProfileReset: [],
});

export const UserProfileTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  userProfile: { id: undefined },
  userProfileList: [],
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
    userProfile: INITIAL_STATE.userProfile,
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
  const { userProfile } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    userProfile,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { userProfileList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    userProfileList: loadMoreDataWhenScrolled(state.userProfileList, userProfileList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { userProfile } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    userProfile,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    userProfile: INITIAL_STATE.userProfile,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    userProfile: INITIAL_STATE.userProfile,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    userProfileList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    userProfile: state.userProfile,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    userProfile: state.userProfile,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.USER_PROFILE_REQUEST]: request,
  [Types.USER_PROFILE_ALL_REQUEST]: allRequest,
  [Types.USER_PROFILE_UPDATE_REQUEST]: updateRequest,
  [Types.USER_PROFILE_DELETE_REQUEST]: deleteRequest,

  [Types.USER_PROFILE_SUCCESS]: success,
  [Types.USER_PROFILE_ALL_SUCCESS]: allSuccess,
  [Types.USER_PROFILE_UPDATE_SUCCESS]: updateSuccess,
  [Types.USER_PROFILE_DELETE_SUCCESS]: deleteSuccess,

  [Types.USER_PROFILE_FAILURE]: failure,
  [Types.USER_PROFILE_ALL_FAILURE]: allFailure,
  [Types.USER_PROFILE_UPDATE_FAILURE]: updateFailure,
  [Types.USER_PROFILE_DELETE_FAILURE]: deleteFailure,
  [Types.USER_PROFILE_RESET]: reset,
});
