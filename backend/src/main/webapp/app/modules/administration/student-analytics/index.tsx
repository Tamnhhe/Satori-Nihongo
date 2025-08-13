import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import StudentProgressAnalytics from './student-progress-analytics';

const StudentAnalyticsRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<StudentProgressAnalytics />} />
  </ErrorBoundaryRoutes>
);

export default StudentAnalyticsRoutes;
