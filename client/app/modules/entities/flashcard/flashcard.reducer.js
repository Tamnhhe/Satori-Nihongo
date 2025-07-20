import { createReducer, createActions } from 'reduxsauce';
import Immutable from 'seamless-immutable';
import { loadMoreDataWhenScrolled } from '../../../shared/util/pagination-utils';
import { parseHeaderForLinks } from '../../../shared/util/url-utils';

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  flashcardRequest: ['flashcardId'],
  flashcardAllRequest: ['options'],
  flashcardUpdateRequest: ['flashcard'],
  flashcardDeleteRequest: ['flashcardId'],

  flashcardSuccess: ['flashcard'],
  flashcardAllSuccess: ['flashcardList', 'headers'],
  flashcardUpdateSuccess: ['flashcard'],
  flashcardDeleteSuccess: [],

  flashcardFailure: ['error'],
  flashcardAllFailure: ['error'],
  flashcardUpdateFailure: ['error'],
  flashcardDeleteFailure: ['error'],

  flashcardReset: [],
});

export const FlashcardTypes = Types;
export default Creators;

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  fetchingOne: false,
  fetchingAll: false,
  updating: false,
  deleting: false,
  updateSuccess: false,
  flashcard: { id: undefined },
  flashcardList: [],
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
    flashcard: INITIAL_STATE.flashcard,
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
  const { flashcard } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: null,
    flashcard,
  });
};
// successful api lookup for all entities
export const allSuccess = (state, action) => {
  const { flashcardList, headers } = action;
  const links = parseHeaderForLinks(headers.link);
  return state.merge({
    fetchingAll: false,
    errorAll: null,
    links,
    totalItems: parseInt(headers['x-total-count'], 10),
    flashcardList: loadMoreDataWhenScrolled(state.flashcardList, flashcardList, links),
  });
};
// successful api update
export const updateSuccess = (state, action) => {
  const { flashcard } = action;
  return state.merge({
    updateSuccess: true,
    updating: false,
    errorUpdating: null,
    flashcard,
  });
};
// successful api delete
export const deleteSuccess = state => {
  return state.merge({
    deleting: false,
    errorDeleting: null,
    flashcard: INITIAL_STATE.flashcard,
  });
};

// Something went wrong fetching a single entity.
export const failure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingOne: false,
    errorOne: error,
    flashcard: INITIAL_STATE.flashcard,
  });
};
// Something went wrong fetching all entities.
export const allFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    fetchingAll: false,
    errorAll: error,
    flashcardList: [],
  });
};
// Something went wrong updating.
export const updateFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    updateSuccess: false,
    updating: false,
    errorUpdating: error,
    flashcard: state.flashcard,
  });
};
// Something went wrong deleting.
export const deleteFailure = (state, action) => {
  const { error } = action;
  return state.merge({
    deleting: false,
    errorDeleting: error,
    flashcard: state.flashcard,
  });
};

export const reset = _state => INITIAL_STATE;

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.FLASHCARD_REQUEST]: request,
  [Types.FLASHCARD_ALL_REQUEST]: allRequest,
  [Types.FLASHCARD_UPDATE_REQUEST]: updateRequest,
  [Types.FLASHCARD_DELETE_REQUEST]: deleteRequest,

  [Types.FLASHCARD_SUCCESS]: success,
  [Types.FLASHCARD_ALL_SUCCESS]: allSuccess,
  [Types.FLASHCARD_UPDATE_SUCCESS]: updateSuccess,
  [Types.FLASHCARD_DELETE_SUCCESS]: deleteSuccess,

  [Types.FLASHCARD_FAILURE]: failure,
  [Types.FLASHCARD_ALL_FAILURE]: allFailure,
  [Types.FLASHCARD_UPDATE_FAILURE]: updateFailure,
  [Types.FLASHCARD_DELETE_FAILURE]: deleteFailure,
  [Types.FLASHCARD_RESET]: reset,
});
