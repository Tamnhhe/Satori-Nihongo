import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/student-quiz/student-quiz.reducer';

test('attempt retrieving a single studentQuiz', () => {
  const state = reducer(INITIAL_STATE, Actions.studentQuizRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.studentQuiz).toEqual({ id: undefined });
});

test('attempt retrieving a list of studentQuiz', () => {
  const state = reducer(INITIAL_STATE, Actions.studentQuizAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.studentQuizList).toEqual([]);
});

test('attempt updating a studentQuiz', () => {
  const state = reducer(INITIAL_STATE, Actions.studentQuizUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a studentQuiz', () => {
  const state = reducer(INITIAL_STATE, Actions.studentQuizDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a studentQuiz', () => {
  const state = reducer(INITIAL_STATE, Actions.studentQuizSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.studentQuiz).toEqual({ id: 1 });
});

test('success retrieving a list of studentQuiz', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.studentQuizAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.studentQuizList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a studentQuiz', () => {
  const state = reducer(INITIAL_STATE, Actions.studentQuizUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.studentQuiz).toEqual({ id: 1 });
});
test('success deleting a studentQuiz', () => {
  const state = reducer(INITIAL_STATE, Actions.studentQuizDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.studentQuiz).toEqual({ id: undefined });
});

test('failure retrieving a studentQuiz', () => {
  const state = reducer(INITIAL_STATE, Actions.studentQuizFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.studentQuiz).toEqual({ id: undefined });
});

test('failure retrieving a list of studentQuiz', () => {
  const state = reducer(INITIAL_STATE, Actions.studentQuizAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.studentQuizList).toEqual([]);
});

test('failure updating a studentQuiz', () => {
  const state = reducer(INITIAL_STATE, Actions.studentQuizUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.studentQuiz).toEqual(INITIAL_STATE.studentQuiz);
});
test('failure deleting a studentQuiz', () => {
  const state = reducer(INITIAL_STATE, Actions.studentQuizDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.studentQuiz).toEqual(INITIAL_STATE.studentQuiz);
});

test('resetting state for studentQuiz', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.studentQuizReset());
  expect(state).toEqual(INITIAL_STATE);
});
