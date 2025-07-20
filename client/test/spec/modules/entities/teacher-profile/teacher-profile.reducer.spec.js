import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/teacher-profile/teacher-profile.reducer';

test('attempt retrieving a single teacherProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.teacherProfileRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.teacherProfile).toEqual({ id: undefined });
});

test('attempt retrieving a list of teacherProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.teacherProfileAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.teacherProfileList).toEqual([]);
});

test('attempt updating a teacherProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.teacherProfileUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a teacherProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.teacherProfileDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a teacherProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.teacherProfileSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.teacherProfile).toEqual({ id: 1 });
});

test('success retrieving a list of teacherProfile', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.teacherProfileAllSuccess([{ id: 1 }, { id: 2 }], {
      link: '</?page=1>; rel="last",</?page=0>; rel="first"',
      'x-total-count': 5,
    }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.teacherProfileList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a teacherProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.teacherProfileUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.teacherProfile).toEqual({ id: 1 });
});
test('success deleting a teacherProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.teacherProfileDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.teacherProfile).toEqual({ id: undefined });
});

test('failure retrieving a teacherProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.teacherProfileFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.teacherProfile).toEqual({ id: undefined });
});

test('failure retrieving a list of teacherProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.teacherProfileAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.teacherProfileList).toEqual([]);
});

test('failure updating a teacherProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.teacherProfileUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.teacherProfile).toEqual(INITIAL_STATE.teacherProfile);
});
test('failure deleting a teacherProfile', () => {
  const state = reducer(INITIAL_STATE, Actions.teacherProfileDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.teacherProfile).toEqual(INITIAL_STATE.teacherProfile);
});

test('resetting state for teacherProfile', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.teacherProfileReset());
  expect(state).toEqual(INITIAL_STATE);
});
