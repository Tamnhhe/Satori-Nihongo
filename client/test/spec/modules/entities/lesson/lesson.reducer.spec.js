import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/lesson/lesson.reducer';

test('attempt retrieving a single lesson', () => {
  const state = reducer(INITIAL_STATE, Actions.lessonRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.lesson).toEqual({ id: undefined });
});

test('attempt retrieving a list of lesson', () => {
  const state = reducer(INITIAL_STATE, Actions.lessonAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.lessonList).toEqual([]);
});

test('attempt updating a lesson', () => {
  const state = reducer(INITIAL_STATE, Actions.lessonUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a lesson', () => {
  const state = reducer(INITIAL_STATE, Actions.lessonDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a lesson', () => {
  const state = reducer(INITIAL_STATE, Actions.lessonSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.lesson).toEqual({ id: 1 });
});

test('success retrieving a list of lesson', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.lessonAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.lessonList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a lesson', () => {
  const state = reducer(INITIAL_STATE, Actions.lessonUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.lesson).toEqual({ id: 1 });
});
test('success deleting a lesson', () => {
  const state = reducer(INITIAL_STATE, Actions.lessonDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.lesson).toEqual({ id: undefined });
});

test('failure retrieving a lesson', () => {
  const state = reducer(INITIAL_STATE, Actions.lessonFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.lesson).toEqual({ id: undefined });
});

test('failure retrieving a list of lesson', () => {
  const state = reducer(INITIAL_STATE, Actions.lessonAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.lessonList).toEqual([]);
});

test('failure updating a lesson', () => {
  const state = reducer(INITIAL_STATE, Actions.lessonUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.lesson).toEqual(INITIAL_STATE.lesson);
});
test('failure deleting a lesson', () => {
  const state = reducer(INITIAL_STATE, Actions.lessonDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.lesson).toEqual(INITIAL_STATE.lesson);
});

test('resetting state for lesson', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.lessonReset());
  expect(state).toEqual(INITIAL_STATE);
});
