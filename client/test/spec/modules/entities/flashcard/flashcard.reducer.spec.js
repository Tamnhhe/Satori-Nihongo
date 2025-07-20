import Actions, { reducer, INITIAL_STATE } from '../../../../../app/modules/entities/flashcard/flashcard.reducer';

test('attempt retrieving a single flashcard', () => {
  const state = reducer(INITIAL_STATE, Actions.flashcardRequest({ id: 1 }));

  expect(state.fetchingOne).toBe(true);
  expect(state.flashcard).toEqual({ id: undefined });
});

test('attempt retrieving a list of flashcard', () => {
  const state = reducer(INITIAL_STATE, Actions.flashcardAllRequest({ id: 1 }));

  expect(state.fetchingAll).toBe(true);
  expect(state.flashcardList).toEqual([]);
});

test('attempt updating a flashcard', () => {
  const state = reducer(INITIAL_STATE, Actions.flashcardUpdateRequest({ id: 1 }));

  expect(state.updating).toBe(true);
});
test('attempt to deleting a flashcard', () => {
  const state = reducer(INITIAL_STATE, Actions.flashcardDeleteRequest({ id: 1 }));

  expect(state.deleting).toBe(true);
});

test('success retrieving a flashcard', () => {
  const state = reducer(INITIAL_STATE, Actions.flashcardSuccess({ id: 1 }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toBe(null);
  expect(state.flashcard).toEqual({ id: 1 });
});

test('success retrieving a list of flashcard', () => {
  const state = reducer(
    INITIAL_STATE,
    Actions.flashcardAllSuccess([{ id: 1 }, { id: 2 }], { link: '</?page=1>; rel="last",</?page=0>; rel="first"', 'x-total-count': 5 }),
  );

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toBe(null);
  expect(state.flashcardList).toEqual([{ id: 1 }, { id: 2 }]);
  expect(state.links).toEqual({ first: 0, last: 1 });
  expect(state.totalItems).toEqual(5);
});

test('success updating a flashcard', () => {
  const state = reducer(INITIAL_STATE, Actions.flashcardUpdateSuccess({ id: 1 }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toBe(null);
  expect(state.flashcard).toEqual({ id: 1 });
});
test('success deleting a flashcard', () => {
  const state = reducer(INITIAL_STATE, Actions.flashcardDeleteSuccess());

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toBe(null);
  expect(state.flashcard).toEqual({ id: undefined });
});

test('failure retrieving a flashcard', () => {
  const state = reducer(INITIAL_STATE, Actions.flashcardFailure({ error: 'Not found' }));

  expect(state.fetchingOne).toBe(false);
  expect(state.errorOne).toEqual({ error: 'Not found' });
  expect(state.flashcard).toEqual({ id: undefined });
});

test('failure retrieving a list of flashcard', () => {
  const state = reducer(INITIAL_STATE, Actions.flashcardAllFailure({ error: 'Not found' }));

  expect(state.fetchingAll).toBe(false);
  expect(state.errorAll).toEqual({ error: 'Not found' });
  expect(state.flashcardList).toEqual([]);
});

test('failure updating a flashcard', () => {
  const state = reducer(INITIAL_STATE, Actions.flashcardUpdateFailure({ error: 'Not found' }));

  expect(state.updating).toBe(false);
  expect(state.errorUpdating).toEqual({ error: 'Not found' });
  expect(state.flashcard).toEqual(INITIAL_STATE.flashcard);
});
test('failure deleting a flashcard', () => {
  const state = reducer(INITIAL_STATE, Actions.flashcardDeleteFailure({ error: 'Not found' }));

  expect(state.deleting).toBe(false);
  expect(state.errorDeleting).toEqual({ error: 'Not found' });
  expect(state.flashcard).toEqual(INITIAL_STATE.flashcard);
});

test('resetting state for flashcard', () => {
  const state = reducer({ ...INITIAL_STATE, deleting: true }, Actions.flashcardReset());
  expect(state).toEqual(INITIAL_STATE);
});
