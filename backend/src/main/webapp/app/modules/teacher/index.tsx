import React from 'react';
import { Route } from 'react-router';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import TeacherDashboard from './dashboard/teacher-dashboard';

const TeacherRoutes = () => (
  <div>
    <ErrorBoundaryRoutes>
      <Route index element={<TeacherDashboard />} />
      <Route path="dashboard" element={<TeacherDashboard />} />
      {/* Additional teacher routes will be added here as features are implemented */}
    </ErrorBoundaryRoutes>
  </div>
);

export default TeacherRoutes;
