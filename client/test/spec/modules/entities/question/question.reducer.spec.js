import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/question/question.reducer';

test('attempt retrieving a single question', () => {
  const state = reducer(INITIAL_STATE, Actions.questionRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.question).toEqual({ id: undefined });
});

test('attempt retrieving a list of question', () => {
  const state = reducer(INITIAL_STATE, Actions.questionAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.questionList).toEqual([]);
});

test('attempt updating a question', () => {
  const state = reducer(INITIAL_STATE, Actions.questionUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a question', () => {
  const state = reducer(INITIAL_STATE, Actions.questionDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a question', () => {
  const state = reducer(INITIAL_STATE, Actions.questionSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.question).toEqual({ id: 1 });
});

test('success retrieving a list of question', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.questionAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.questionList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a question', () => {
  const state = reducer(INITIAL_STATE, Actions.questionUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.question).toEqual({ id: 1 });
});
test('success deleting a question', () => {
  const state = reducer(INITIAL_STATE, Actions.questionDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.question).toEqual({ id: undefined });
});

test('failure retrieving a question', () => {
  const state = reducer(INITIAL_STATE, Actions.questionFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.question).toEqual({ id: undefined });
});

test('failure retrieving a list of question', () => {
  const state = reducer(INITIAL_STATE, Actions.questionAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.questionList).toEqual([]);
});

test('failure updating a question', () => {
  const state = reducer(INITIAL_STATE, Actions.questionUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.question).toEqual(INITIAL_STATE.question);
});
test('failure deleting a question', () => {
  const state = reducer(INITIAL_STATE, Actions.questionDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.question).toEqual(INITIAL_STATE.question);
});

test('resetting state for question', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.questionReset());
  expect(state).toEqual(INITIAL_STATE);
});
