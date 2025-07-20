import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/student-profile/student-profile.reducer';

test('attempt retrieving a single studentProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.studentProfileRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.studentProfile).toEqual({ id: undefined });
});

test('attempt retrieving a list of studentProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.studentProfileAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.studentProfileList).toEqual([]);
});

test('attempt updating a studentProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.studentProfileUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a studentProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.studentProfileDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a studentProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.studentProfileSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.studentProfile).toEqual({ id: 1 });
});

test('success retrieving a list of studentProfile', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.studentProfileAllSuccess([{ id: 1 }, { id: 2 }], {
      link: '</?page=1>; rel="last",</?page=0>; rel="first"',
      'x-total-count': 5,
    }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.studentProfileList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a studentProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.studentProfileUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.studentProfile).toEqual({ id: 1 });
});
test('success deleting a studentProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.studentProfileDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.studentProfile).toEqual({ id: undefined });
});

test('failure retrieving a studentProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.studentProfileFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.studentProfile).toEqual({ id: undefined });
});

test('failure retrieving a list of studentProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.studentProfileAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.studentProfileList).toEqual([]);
});

test('failure updating a studentProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.studentProfileUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.studentProfile).toEqual(INITIAL_STATE.studentProfile);
});
test('failure deleting a studentProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.studentProfileDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.studentProfile).toEqual(INITIAL_STATE.studentProfile);
});

test('resetting state for studentProfile', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.studentProfileReset());
  expect(state).toEqual(INITIAL_STATE);
});
