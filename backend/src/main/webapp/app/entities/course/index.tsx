import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Course from './course';
import CourseDetail from './course-detail';
import CourseUpdate from './course-update';
import CourseDeleteDialog from './course-delete-dialog';

const CourseRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Course />} />
    <Route path="new" element={<CourseUpdate />} />
    <Route path=":id">
      <Route index element={<CourseDetail />} />
      <Route path="edit" element={<CourseUpdate />} />
      <Route path="delete" element={<CourseDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default CourseRoutes;
