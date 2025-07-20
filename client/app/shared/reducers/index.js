import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';

import configureStore from './create-store';
import rootSaga from '../sagas';
import ReduxPersist from '../../config/redux-persist';

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  appState: require('./app-state.reducer').reducer,
  users: require('./user.reducer').reducer,
  userProfiles: require('../../modules/entities/user-profile/user-profile.reducer').reducer,
  socialAccounts: require('../../modules/entities/social-account/social-account.reducer').reducer,
  teacherProfiles: require('../../modules/entities/teacher-profile/teacher-profile.reducer').reducer,
  studentProfiles: require('../../modules/entities/student-profile/student-profile.reducer').reducer,
  courses: require('../../modules/entities/course/course.reducer').reducer,
  courseClasses: require('../../modules/entities/course-class/course-class.reducer').reducer,
  lessons: require('../../modules/entities/lesson/lesson.reducer').reducer,
  schedules: require('../../modules/entities/schedule/schedule.reducer').reducer,
  quizzes: require('../../modules/entities/quiz/quiz.reducer').reducer,
  questions: require('../../modules/entities/question/question.reducer').reducer,
  quizQuestions: require('../../modules/entities/quiz-question/quiz-question.reducer').reducer,
  studentQuizs: require('../../modules/entities/student-quiz/student-quiz.reducer').reducer,
  flashcards: require('../../modules/entities/flashcard/flashcard.reducer').reducer,
  // jhipster-react-native-redux-store-import-needle
  account: require('./account.reducer').reducer,
  login: require('../../modules/login/login.reducer').reducer,
  register: require('../../modules/account/register/register.reducer').reducer,
  changePassword: require('../../modules/account/password/change-password.reducer').reducer,
  forgotPassword: require('../../modules/account/password-reset/forgot-password.reducer').reducer,
});

export default () => {
  let finalReducers = reducers;
  // If rehydration is on use persistReducer otherwise default combineReducers
  if (ReduxPersist.active) {
    const persistConfig = ReduxPersist.storeConfig;
    finalReducers = persistReducer(persistConfig, reducers);
  }

  let { store, sagasManager, sagaMiddleware } = configureStore(finalReducers, rootSaga);

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./index').reducers;
      store.replaceReducer(nextRootReducer);

      const newYieldedSagas = require('../sagas').default;
      sagasManager.cancel();
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas);
      });
    });
  }

  return store;
};
