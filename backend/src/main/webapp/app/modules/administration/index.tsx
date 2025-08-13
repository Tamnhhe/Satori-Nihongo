import React from 'react';

import { Route } from 'react-router';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import AdminDashboard from './dashboard/admin-dashboard';
import UserManagement from './user-management';
import EnhancedUserManagementRoutes from './user-management/enhanced';
import CourseManagementRoutes from './course-management';
import ClassManagementRoutes from './class-management';
import QuizManagementRoutes from './quiz-management';
import FileManagementRoutes from './file-management';
import StudentAnalyticsRoutes from './student-analytics';
import AnalyticsRoutes from './analytics';
import ReportingRoutes from './reporting';
import NotificationManagementRoutes from './notification-management';
import SystemConfigurationRoutes from './system-configuration';
import SystemMonitoringRoutes from './system-monitoring';
import { HelpDemo } from './help-demo/help-demo';
import Logs from './logs/logs';
import Health from './health/health';
import Metrics from './metrics/metrics';
import Configuration from './configuration/configuration';
import Docs from './docs/docs';

const AdministrationRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route index element={<AdminDashboard />} />
      <Route path="dashboard" element={<AdminDashboard />} />
      <Route path="user-management/*" element={<UserManagement />} />
      <Route path="enhanced-user-management/*" element={<EnhancedUserManagementRoutes />} />
      <Route path="course-management/*" element={<CourseManagementRoutes />} />
      <Route path="class-management/*" element={<ClassManagementRoutes />} />
      <Route path="quiz-management/*" element={<QuizManagementRoutes />} />
      <Route path="file-management/*" element={<FileManagementRoutes />} />
      <Route path="student-analytics/*" element={<StudentAnalyticsRoutes />} />
      <Route path="analytics/*" element={<AnalyticsRoutes />} />
      <Route path="reporting/*" element={<ReportingRoutes />} />
      <Route path="notifications/*" element={<NotificationManagementRoutes />} />
      <Route path="system-configuration/*" element={<SystemConfigurationRoutes />} />
      <Route path="system-monitoring/*" element={<SystemMonitoringRoutes />} />
      <Route path="help-demo" element={<HelpDemo />} />
      <Route path="health" element={<Health />} />
      <Route path="metrics" element={<Metrics />} />
      <Route path="configuration" element={<Configuration />} />
      <Route path="logs" element={<Logs />} />
      <Route path="docs" element={<Docs />} />
    </ErrorBoundaryRoutes>
  </div>
);

export default AdministrationRoutes;
