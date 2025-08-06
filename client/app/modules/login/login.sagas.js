import { call, put, select } from 'redux-saga/effects';

import LoginActions from './login.reducer';
import AccountActions from '../../shared/reducers/account.reducer';
import notificationService from '../../shared/services/notification.service';
import LessonService from '../../shared/services/lesson.service';

export const selectAuthToken = (state) => state.login.authToken;
// attempts to login
export function* login(api, { username, password }) {
  const authObj = {
    username: username,
    password: password,
    rememberMe: true,
  };

  const response = yield call(api.login, authObj);

  // success?
  if (response.ok) {
    yield call(api.setAuthToken, response.data.id_token);
    yield put(LoginActions.loginSuccess(response.data.id_token));
    yield put(AccountActions.accountRequest());
    yield put({ type: 'RELOGIN_OK' });

    // Send welcome notification with incomplete lessons count
    try {
      const lessonService = new LessonService(api);

      // Initialize notification service (only if needed)
      yield call([notificationService, 'initialize']);

      // Get user's lesson progress
      const lessonsResult = yield call([lessonService, 'getAllLessons'], {
        page: 0,
        size: 100, // Get more lessons to get accurate count
      });

      if (lessonsResult.success && lessonsResult.data.length > 0) {
        // For now, assume all lessons are incomplete (you can enhance this later with real progress data)
        const totalLessons = lessonsResult.data.length;
        const completedLessons = 0; // TODO: Get actual completion data from backend
        const incompleteLessons = totalLessons - completedLessons;

        // Send welcome notification
        yield call(
          [notificationService, 'sendWelcomeNotification'],
          username,
          totalLessons,
          completedLessons
        );

        console.log(`Welcome notification sent: ${incompleteLessons} lessons remaining`);
      }
    } catch (notificationError) {
      console.warn('Failed to send welcome notification:', notificationError);
      // Don't fail login if notification fails
    }
  } else {
    const errorMessage = !response.data
      ? 'Failed to reach backend API'
      : response.data && response.data.detail
        ? response.data.detail
        : 'Bad credentials';
    yield put(LoginActions.loginFailure(errorMessage));
  }
}
// attempts to logout
export function* logout(api) {
  yield call(api.removeAuthToken);
  yield put(AccountActions.accountReset());
  yield put(AccountActions.accountRequest());
  yield put(LoginActions.logoutSuccess());
  yield put({ type: 'RELOGIN_ABORT' });
}

// loads the login
export function* loginLoad(api) {
  const authToken = yield select(selectAuthToken);
  // only set the token if we have it
  if (authToken) {
    yield call(api.setAuthToken, authToken);
  }
  yield put(LoginActions.loginLoadSuccess());
}
