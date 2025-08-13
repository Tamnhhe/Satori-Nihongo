import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import EnhancedUserManagement from './enhanced-user-management';
import UserManagementDetail from '../user-management-detail';
import UserManagementUpdate from '../user-management-update';
import UserManagementDeleteDialog from '../user-management-delete-dialog';

const EnhancedUserManagementRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<EnhancedUserManagement />} />
    <Route path="new" element={<UserManagementUpdate />} />
    <Route path=":login">
      <Route index element={<UserManagementDetail />} />
      <Route path="edit" element={<UserManagementUpdate />} />
      <Route path="delete" element={<UserManagementDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default EnhancedUserManagementRoutes;
