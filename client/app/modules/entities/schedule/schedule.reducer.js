import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  scheduleRequest: ['scheduleId'],
  scheduleAllRequest: ['options'],
  scheduleUpdateRequest: ['schedule'],
  scheduleDeleteRequest: ['scheduleId'],

  scheduleSuccess: ['schedule'],
  scheduleAllSuccess: ['scheduleList', 'headers'],
  scheduleUpdateSuccess: ['schedule'],
  scheduleDeleteSuccess: [],

  scheduleFailure: ['error'],
  scheduleAllFailure: ['error'],
  scheduleUpdateFailure: ['error'],
  scheduleDeleteFailure: ['error'],

  scheduleReset: [],
});

export const ScheduleTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  schedule: { id: undefined },
  scheduleList: [],
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
    schedule: INITIAL_STATE.schedule,
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
  const { schedule } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    schedule,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { scheduleList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    scheduleList: loadMoreDataWhenScrolled(state.scheduleList, scheduleList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { schedule } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    schedule,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    schedule: INITIAL_STATE.schedule,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    schedule: INITIAL_STATE.schedule,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    scheduleList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    schedule: state.schedule,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    schedule: state.schedule,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SCHEDULE_REQUEST]: request,
  [Types.SCHEDULE_ALL_REQUEST]: allRequest,
  [Types.SCHEDULE_UPDATE_REQUEST]: updateRequest,
  [Types.SCHEDULE_DELETE_REQUEST]: deleteRequest,

  [Types.SCHEDULE_SUCCESS]: success,
  [Types.SCHEDULE_ALL_SUCCESS]: allSuccess,
  [Types.SCHEDULE_UPDATE_SUCCESS]: updateSuccess,
  [Types.SCHEDULE_DELETE_SUCCESS]: deleteSuccess,

  [Types.SCHEDULE_FAILURE]: failure,
  [Types.SCHEDULE_ALL_FAILURE]: allFailure,
  [Types.SCHEDULE_UPDATE_FAILURE]: updateFailure,
  [Types.SCHEDULE_DELETE_FAILURE]: deleteFailure,
  [Types.SCHEDULE_RESET]: reset,
});
