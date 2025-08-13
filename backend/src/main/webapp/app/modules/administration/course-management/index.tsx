import React from 'react';
import { Route } from 'react-router-dom';
import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import CourseManagementGrid from './course-management-grid';

const CourseManagementRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<CourseManagementGrid />} />
  </ErrorBoundaryRoutes>
);

export default CourseManagementRoutes;
