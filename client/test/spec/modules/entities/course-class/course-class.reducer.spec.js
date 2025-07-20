import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/course-class/course-class.reducer';

test('attempt retrieving a single courseClass', () => {
  const state = reducer(INITIAL_STATE, Actions.courseClassRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.courseClass).toEqual({ id: undefined });
});

test('attempt retrieving a list of courseClass', () => {
  const state = reducer(INITIAL_STATE, Actions.courseClassAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.courseClassList).toEqual([]);
});

test('attempt updating a courseClass', () => {
  const state = reducer(INITIAL_STATE, Actions.courseClassUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a courseClass', () => {
  const state = reducer(INITIAL_STATE, Actions.courseClassDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a courseClass', () => {
  const state = reducer(INITIAL_STATE, Actions.courseClassSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.courseClass).toEqual({ id: 1 });
});

test('success retrieving a list of courseClass', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.courseClassAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.courseClassList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a courseClass', () => {
  const state = reducer(INITIAL_STATE, Actions.courseClassUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.courseClass).toEqual({ id: 1 });
});
test('success deleting a courseClass', () => {
  const state = reducer(INITIAL_STATE, Actions.courseClassDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.courseClass).toEqual({ id: undefined });
});

test('failure retrieving a courseClass', () => {
  const state = reducer(INITIAL_STATE, Actions.courseClassFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.courseClass).toEqual({ id: undefined });
});

test('failure retrieving a list of courseClass', () => {
  const state = reducer(INITIAL_STATE, Actions.courseClassAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.courseClassList).toEqual([]);
});

test('failure updating a courseClass', () => {
  const state = reducer(INITIAL_STATE, Actions.courseClassUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.courseClass).toEqual(INITIAL_STATE.courseClass);
});
test('failure deleting a courseClass', () => {
  const state = reducer(INITIAL_STATE, Actions.courseClassDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.courseClass).toEqual(INITIAL_STATE.courseClass);
});

test('resetting state for courseClass', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.courseClassReset());
  expect(state).toEqual(INITIAL_STATE);
});
