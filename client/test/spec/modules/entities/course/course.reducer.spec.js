import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/course/course.reducer';

test('attempt retrieving a single course', () => {
  const state = reducer(INITIAL_STATE, Actions.courseRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.course).toEqual({ id: undefined });
});

test('attempt retrieving a list of course', () => {
  const state = reducer(INITIAL_STATE, Actions.courseAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.courseList).toEqual([]);
});

test('attempt updating a course', () => {
  const state = reducer(INITIAL_STATE, Actions.courseUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a course', () => {
  const state = reducer(INITIAL_STATE, Actions.courseDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a course', () => {
  const state = reducer(INITIAL_STATE, Actions.courseSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.course).toEqual({ id: 1 });
});

test('success retrieving a list of course', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.courseAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.courseList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a course', () => {
  const state = reducer(INITIAL_STATE, Actions.courseUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.course).toEqual({ id: 1 });
});
test('success deleting a course', () => {
  const state = reducer(INITIAL_STATE, Actions.courseDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.course).toEqual({ id: undefined });
});

test('failure retrieving a course', () => {
  const state = reducer(INITIAL_STATE, Actions.courseFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.course).toEqual({ id: undefined });
});

test('failure retrieving a list of course', () => {
  const state = reducer(INITIAL_STATE, Actions.courseAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.courseList).toEqual([]);
});

test('failure updating a course', () => {
  const state = reducer(INITIAL_STATE, Actions.courseUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.course).toEqual(INITIAL_STATE.course);
});
test('failure deleting a course', () => {
  const state = reducer(INITIAL_STATE, Actions.courseDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.course).toEqual(INITIAL_STATE.course);
});

test('resetting state for course', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.courseReset());
  expect(state).toEqual(INITIAL_STATE);
});
