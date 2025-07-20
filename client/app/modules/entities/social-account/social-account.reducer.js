import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  socialAccountRequest: ['socialAccountId'],
  socialAccountAllRequest: ['options'],
  socialAccountUpdateRequest: ['socialAccount'],
  socialAccountDeleteRequest: ['socialAccountId'],

  socialAccountSuccess: ['socialAccount'],
  socialAccountAllSuccess: ['socialAccountList', 'headers'],
  socialAccountUpdateSuccess: ['socialAccount'],
  socialAccountDeleteSuccess: [],

  socialAccountFailure: ['error'],
  socialAccountAllFailure: ['error'],
  socialAccountUpdateFailure: ['error'],
  socialAccountDeleteFailure: ['error'],

  socialAccountReset: [],
});

export const SocialAccountTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  socialAccount: { id: undefined },
  socialAccountList: [],
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
    socialAccount: INITIAL_STATE.socialAccount,
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
  const { socialAccount } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    socialAccount,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { socialAccountList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    socialAccountList: loadMoreDataWhenScrolled(state.socialAccountList, socialAccountList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { socialAccount } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    socialAccount,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    socialAccount: INITIAL_STATE.socialAccount,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    socialAccount: INITIAL_STATE.socialAccount,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    socialAccountList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    socialAccount: state.socialAccount,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    socialAccount: state.socialAccount,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SOCIAL_ACCOUNT_REQUEST]: request,
  [Types.SOCIAL_ACCOUNT_ALL_REQUEST]: allRequest,
  [Types.SOCIAL_ACCOUNT_UPDATE_REQUEST]: updateRequest,
  [Types.SOCIAL_ACCOUNT_DELETE_REQUEST]: deleteRequest,

  [Types.SOCIAL_ACCOUNT_SUCCESS]: success,
  [Types.SOCIAL_ACCOUNT_ALL_SUCCESS]: allSuccess,
  [Types.SOCIAL_ACCOUNT_UPDATE_SUCCESS]: updateSuccess,
  [Types.SOCIAL_ACCOUNT_DELETE_SUCCESS]: deleteSuccess,

  [Types.SOCIAL_ACCOUNT_FAILURE]: failure,
  [Types.SOCIAL_ACCOUNT_ALL_FAILURE]: allFailure,
  [Types.SOCIAL_ACCOUNT_UPDATE_FAILURE]: updateFailure,
  [Types.SOCIAL_ACCOUNT_DELETE_FAILURE]: deleteFailure,
  [Types.SOCIAL_ACCOUNT_RESET]: reset,
});
