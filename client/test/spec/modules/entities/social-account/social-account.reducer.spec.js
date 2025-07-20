import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/social-account/social-account.reducer';

test('attempt retrieving a single socialAccount', () => {
  const state = reducer(INITIAL_STATE, Actions.socialAccountRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.socialAccount).toEqual({ id: undefined });
});

test('attempt retrieving a list of socialAccount', () => {
  const state = reducer(INITIAL_STATE, Actions.socialAccountAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.socialAccountList).toEqual([]);
});

test('attempt updating a socialAccount', () => {
  const state = reducer(INITIAL_STATE, Actions.socialAccountUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a socialAccount', () => {
  const state = reducer(INITIAL_STATE, Actions.socialAccountDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a socialAccount', () => {
  const state = reducer(INITIAL_STATE, Actions.socialAccountSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.socialAccount).toEqual({ id: 1 });
});

test('success retrieving a list of socialAccount', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.socialAccountAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.socialAccountList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a socialAccount', () => {
  const state = reducer(INITIAL_STATE, Actions.socialAccountUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.socialAccount).toEqual({ id: 1 });
});
test('success deleting a socialAccount', () => {
  const state = reducer(INITIAL_STATE, Actions.socialAccountDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.socialAccount).toEqual({ id: undefined });
});

test('failure retrieving a socialAccount', () => {
  const state = reducer(INITIAL_STATE, Actions.socialAccountFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.socialAccount).toEqual({ id: undefined });
});

test('failure retrieving a list of socialAccount', () => {
  const state = reducer(INITIAL_STATE, Actions.socialAccountAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.socialAccountList).toEqual([]);
});

test('failure updating a socialAccount', () => {
  const state = reducer(INITIAL_STATE, Actions.socialAccountUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.socialAccount).toEqual(INITIAL_STATE.socialAccount);
});
test('failure deleting a socialAccount', () => {
  const state = reducer(INITIAL_STATE, Actions.socialAccountDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.socialAccount).toEqual(INITIAL_STATE.socialAccount);
});

test('resetting state for socialAccount', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.socialAccountReset());
  expect(state).toEqual(INITIAL_STATE);
});
