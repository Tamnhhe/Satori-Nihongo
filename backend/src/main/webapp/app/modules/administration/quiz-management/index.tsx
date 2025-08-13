import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import QuizManagement from './quiz-management';
import QuizBuilder from './quiz-builder';
import QuizAnalyticsDashboard from './quiz-analytics-dashboard';

const QuizManagementRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<QuizManagement />} />
    <Route path="new" element={<QuizBuilder />} />
    <Route path=":id/edit" element={<QuizBuilder />} />
    <Route path=":id/analytics" element={<QuizAnalyticsDashboard />} />
  </ErrorBoundaryRoutes>
);

export default QuizManagementRoutes;
