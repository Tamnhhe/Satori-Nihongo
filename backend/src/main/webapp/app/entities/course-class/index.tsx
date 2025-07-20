import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import CourseClass from './course-class';
import CourseClassDetail from './course-class-detail';
import CourseClassUpdate from './course-class-update';
import CourseClassDeleteDialog from './course-class-delete-dialog';

const CourseClassRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<CourseClass />} />
    <Route path="new" element={<CourseClassUpdate />} />
    <Route path=":id">
      <Route index element={<CourseClassDetail />} />
      <Route path="edit" element={<CourseClassUpdate />} />
      <Route path="delete" element={<CourseClassDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default CourseClassRoutes;
