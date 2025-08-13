import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import ComprehensiveAnalyticsDashboard from './comprehensive-analytics-dashboard';

const AnalyticsRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ComprehensiveAnalyticsDashboard />} />
    <Route path="teacher" element={<ComprehensiveAnalyticsDashboard isTeacherView={true} />} />
    <Route path="teacher/:teacherId" element={<ComprehensiveAnalyticsDashboard isTeacherView={true} />} />
  </ErrorBoundaryRoutes>
);

export default AnalyticsRoutes;
