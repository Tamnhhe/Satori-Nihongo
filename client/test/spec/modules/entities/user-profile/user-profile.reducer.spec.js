import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/user-profile/user-profile.reducer';

test('attempt retrieving a single userProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.userProfileRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.userProfile).toEqual({ id: undefined });
});

test('attempt retrieving a list of userProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.userProfileAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.userProfileList).toEqual([]);
});

test('attempt updating a userProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.userProfileUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a userProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.userProfileDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a userProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.userProfileSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.userProfile).toEqual({ id: 1 });
});

test('success retrieving a list of userProfile', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.userProfileAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.userProfileList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a userProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.userProfileUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.userProfile).toEqual({ id: 1 });
});
test('success deleting a userProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.userProfileDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.userProfile).toEqual({ id: undefined });
});

test('failure retrieving a userProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.userProfileFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.userProfile).toEqual({ id: undefined });
});

test('failure retrieving a list of userProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.userProfileAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.userProfileList).toEqual([]);
});

test('failure updating a userProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.userProfileUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.userProfile).toEqual(INITIAL_STATE.userProfile);
});
test('failure deleting a userProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.userProfileDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.userProfile).toEqual(INITIAL_STATE.userProfile);
});

test('resetting state for userProfile', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.userProfileReset());
  expect(state).toEqual(INITIAL_STATE);
});
