import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/schedule/schedule.reducer';

test('attempt retrieving a single schedule', () => {
  const state = reducer(INITIAL_STATE, Actions.scheduleRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.schedule).toEqual({ id: undefined });
});

test('attempt retrieving a list of schedule', () => {
  const state = reducer(INITIAL_STATE, Actions.scheduleAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.scheduleList).toEqual([]);
});

test('attempt updating a schedule', () => {
  const state = reducer(INITIAL_STATE, Actions.scheduleUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a schedule', () => {
  const state = reducer(INITIAL_STATE, Actions.scheduleDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a schedule', () => {
  const state = reducer(INITIAL_STATE, Actions.scheduleSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.schedule).toEqual({ id: 1 });
});

test('success retrieving a list of schedule', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.scheduleAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.scheduleList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a schedule', () => {
  const state = reducer(INITIAL_STATE, Actions.scheduleUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.schedule).toEqual({ id: 1 });
});
test('success deleting a schedule', () => {
  const state = reducer(INITIAL_STATE, Actions.scheduleDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.schedule).toEqual({ id: undefined });
});

test('failure retrieving a schedule', () => {
  const state = reducer(INITIAL_STATE, Actions.scheduleFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.schedule).toEqual({ id: undefined });
});

test('failure retrieving a list of schedule', () => {
  const state = reducer(INITIAL_STATE, Actions.scheduleAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.scheduleList).toEqual([]);
});

test('failure updating a schedule', () => {
  const state = reducer(INITIAL_STATE, Actions.scheduleUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.schedule).toEqual(INITIAL_STATE.schedule);
});
test('failure deleting a schedule', () => {
  const state = reducer(INITIAL_STATE, Actions.scheduleDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.schedule).toEqual(INITIAL_STATE.schedule);
});

test('resetting state for schedule', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.scheduleReset());
  expect(state).toEqual(INITIAL_STATE);
});
