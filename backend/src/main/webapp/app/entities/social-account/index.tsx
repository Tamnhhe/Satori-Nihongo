import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import SocialAccount from './social-account';
import SocialAccountDetail from './social-account-detail';
import SocialAccountUpdate from './social-account-update';
import SocialAccountDeleteDialog from './social-account-delete-dialog';

const SocialAccountRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<SocialAccount />} />
    <Route path="new" element={<SocialAccountUpdate />} />
    <Route path=":id">
      <Route index element={<SocialAccountDetail />} />
      <Route path="edit" element={<SocialAccountUpdate />} />
      <Route path="delete" element={<SocialAccountDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default SocialAccountRoutes;
