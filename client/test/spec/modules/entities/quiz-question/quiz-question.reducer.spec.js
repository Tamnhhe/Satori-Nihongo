import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/quiz-question/quiz-question.reducer';

test('attempt retrieving a single quizQuestion', () => {
  const state = reducer(INITIAL_STATE, Actions.quizQuestionRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.quizQuestion).toEqual({ id: undefined });
});

test('attempt retrieving a list of quizQuestion', () => {
  const state = reducer(INITIAL_STATE, Actions.quizQuestionAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.quizQuestionList).toEqual([]);
});

test('attempt updating a quizQuestion', () => {
  const state = reducer(INITIAL_STATE, Actions.quizQuestionUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a quizQuestion', () => {
  const state = reducer(INITIAL_STATE, Actions.quizQuestionDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a quizQuestion', () => {
  const state = reducer(INITIAL_STATE, Actions.quizQuestionSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.quizQuestion).toEqual({ id: 1 });
});

test('success retrieving a list of quizQuestion', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.quizQuestionAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.quizQuestionList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a quizQuestion', () => {
  const state = reducer(INITIAL_STATE, Actions.quizQuestionUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.quizQuestion).toEqual({ id: 1 });
});
test('success deleting a quizQuestion', () => {
  const state = reducer(INITIAL_STATE, Actions.quizQuestionDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.quizQuestion).toEqual({ id: undefined });
});

test('failure retrieving a quizQuestion', () => {
  const state = reducer(INITIAL_STATE, Actions.quizQuestionFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.quizQuestion).toEqual({ id: undefined });
});

test('failure retrieving a list of quizQuestion', () => {
  const state = reducer(INITIAL_STATE, Actions.quizQuestionAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.quizQuestionList).toEqual([]);
});

test('failure updating a quizQuestion', () => {
  const state = reducer(INITIAL_STATE, Actions.quizQuestionUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.quizQuestion).toEqual(INITIAL_STATE.quizQuestion);
});
test('failure deleting a quizQuestion', () => {
  const state = reducer(INITIAL_STATE, Actions.quizQuestionDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.quizQuestion).toEqual(INITIAL_STATE.quizQuestion);
});

test('resetting state for quizQuestion', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.quizQuestionReset());
  expect(state).toEqual(INITIAL_STATE);
});
