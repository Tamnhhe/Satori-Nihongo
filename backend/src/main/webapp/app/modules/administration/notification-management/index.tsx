import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import NotificationManagement from './notification-management';
import NotificationTemplateEditor from './notification-template-editor';
import NotificationScheduler from './notification-scheduler';
import DeliveryTracking from './delivery-tracking';
import NotificationAnalyticsDashboard from './notification-analytics-dashboard';
import UserPreferencesManagement from './user-preferences-management';

const NotificationManagementRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<NotificationManagement />} />
    <Route path="templates" element={<NotificationTemplateEditor />} />
    <Route path="templates/:id" element={<NotificationTemplateEditor />} />
    <Route path="schedules" element={<NotificationScheduler />} />
    <Route path="schedules/:id" element={<NotificationScheduler />} />
    <Route path="deliveries" element={<DeliveryTracking />} />
    <Route path="schedules/:id/deliveries" element={<DeliveryTracking />} />
    <Route path="analytics" element={<NotificationAnalyticsDashboard />} />
    <Route path="user-preferences" element={<UserPreferencesManagement />} />
  </ErrorBoundaryRoutes>
);

export default NotificationManagementRoutes;
