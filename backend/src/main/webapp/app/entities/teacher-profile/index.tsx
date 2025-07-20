import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import TeacherProfile from './teacher-profile';
import TeacherProfileDetail from './teacher-profile-detail';
import TeacherProfileUpdate from './teacher-profile-update';
import TeacherProfileDeleteDialog from './teacher-profile-delete-dialog';

const TeacherProfileRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<TeacherProfile />} />
    <Route path="new" element={<TeacherProfileUpdate />} />
    <Route path=":id">
      <Route index element={<TeacherProfileDetail />} />
      <Route path="edit" element={<TeacherProfileUpdate />} />
      <Route path="delete" element={<TeacherProfileDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default TeacherProfileRoutes;
