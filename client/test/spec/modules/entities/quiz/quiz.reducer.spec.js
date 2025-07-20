import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/quiz/quiz.reducer';

test('attempt retrieving a single quiz', () => {
  const state = reducer(INITIAL_STATE, Actions.quizRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.quiz).toEqual({ id: undefined });
});

test('attempt retrieving a list of quiz', () => {
  const state = reducer(INITIAL_STATE, Actions.quizAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.quizList).toEqual([]);
});

test('attempt updating a quiz', () => {
  const state = reducer(INITIAL_STATE, Actions.quizUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a quiz', () => {
  const state = reducer(INITIAL_STATE, Actions.quizDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a quiz', () => {
  const state = reducer(INITIAL_STATE, Actions.quizSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.quiz).toEqual({ id: 1 });
});

test('success retrieving a list of quiz', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.quizAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.quizList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a quiz', () => {
  const state = reducer(INITIAL_STATE, Actions.quizUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.quiz).toEqual({ id: 1 });
});
test('success deleting a quiz', () => {
  const state = reducer(INITIAL_STATE, Actions.quizDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.quiz).toEqual({ id: undefined });
});

test('failure retrieving a quiz', () => {
  const state = reducer(INITIAL_STATE, Actions.quizFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.quiz).toEqual({ id: undefined });
});

test('failure retrieving a list of quiz', () => {
  const state = reducer(INITIAL_STATE, Actions.quizAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.quizList).toEqual([]);
});

test('failure updating a quiz', () => {
  const state = reducer(INITIAL_STATE, Actions.quizUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.quiz).toEqual(INITIAL_STATE.quiz);
});
test('failure deleting a quiz', () => {
  const state = reducer(INITIAL_STATE, Actions.quizDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.quiz).toEqual(INITIAL_STATE.quiz);
});

test('resetting state for quiz', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.quizReset());
  expect(state).toEqual(INITIAL_STATE);
});
