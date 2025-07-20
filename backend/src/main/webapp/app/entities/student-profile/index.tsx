import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import StudentProfile from './student-profile';
import StudentProfileDetail from './student-profile-detail';
import StudentProfileUpdate from './student-profile-update';
import StudentProfileDeleteDialog from './student-profile-delete-dialog';

const StudentProfileRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<StudentProfile />} />
    <Route path="new" element={<StudentProfileUpdate />} />
    <Route path=":id">
      <Route index element={<StudentProfileDetail />} />
      <Route path="edit" element={<StudentProfileUpdate />} />
      <Route path="delete" element={<StudentProfileDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default StudentProfileRoutes;
