import { put } from 'redux-saga/effects';
import AppStateActions from '../reducers/app-state.reducer';
import LoginActions from '../../modules/login/login.reducer';
import AccountActions from '../reducers/account.reducer';

// process STARTUP actions
export function* startup(_action) {
  yield put(LoginActions.loginLoad());
  // Không tự động gọi AccountActions.accountRequest() để tránh auto-login
  // User phải login thủ công qua Welcome screen
  // yield put(AccountActions.accountRequest());
  yield put(AppStateActions.setRehydrationComplete());
}
