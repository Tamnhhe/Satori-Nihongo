import { ReducersMapObject } from '@reduxjs/toolkit';
import { loadingBarReducer as loadingBar } from 'react-redux-loading-bar';

import administration from 'app/modules/administration/administration.reducer';
import adminDashboard from 'app/modules/administration/dashboard/admin-dashboard.reducer';
import teacherDashboard from 'app/modules/teacher/dashboard/teacher-dashboard.reducer';
import userManagement from 'app/modules/administration/user-management/user-management.reducer';
import enhancedUserManagement from 'app/modules/administration/user-management/enhanced/enhanced-user-management.reducer';
import courseManagement from 'app/modules/administration/course-management/course-management.reducer';
import courseAssignment from 'app/modules/administration/course-management/course-assignment.reducer';
import scheduleManagement from 'app/modules/administration/course-management/schedule-management.reducer';
import classManagement from 'app/modules/administration/class-management/class-management.reducer';
import quizManagement from 'app/modules/administration/quiz-management/quiz-management.reducer';
import fileManagement from 'app/modules/administration/file-management/file-management.reducer';
import { reportingReducer as reporting } from 'app/modules/administration/reporting/reporting.reducer';
import notificationManagement from 'app/modules/administration/notification-management/notification-management.reducer';
import notificationAnalytics from 'app/modules/administration/notification-management/notification-analytics.reducer';
import systemConfiguration from 'app/modules/administration/system-configuration/system-configuration.reducer';
import systemMonitoring from 'app/modules/administration/system-monitoring/system-monitoring.reducer';
import register from 'app/modules/account/register/register.reducer';
import activate from 'app/modules/account/activate/activate.reducer';
import password from 'app/modules/account/password/password.reducer';
import settings from 'app/modules/account/settings/settings.reducer';
import passwordReset from 'app/modules/account/password-reset/password-reset.reducer';
import entitiesReducers from 'app/entities/reducers';
import applicationProfile from './application-profile';
import authentication from './authentication';
import locale from './locale';
/* jhipster-needle-add-reducer-import - JHipster will add reducer here */

const rootReducer: ReducersMapObject = {
  authentication,
  locale,
  applicationProfile,
  administration,
  adminDashboard,
  teacherDashboard,
  userManagement,
  enhancedUserManagement,
  courseManagement,
  courseAssignment,
  scheduleManagement,
  classManagement,
  quizManagement,
  fileManagement,
  reporting,
  notificationManagement,
  notificationAnalytics,
  systemConfiguration,
  systemMonitoring,
  register,
  activate,
  passwordReset,
  password,
  settings,
  loadingBar,
  /* jhipster-needle-add-reducer-combine - JHipster will add reducer here */
  ...entitiesReducers,
};

export default rootReducer;
