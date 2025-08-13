import React from 'react';
import { Route } from 'react-router-dom';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import ClassManagementTable from './class-management-table';
import ClassSchedulePage from './class-schedule-page';

const ClassManagementRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ClassManagementTable />} />
    <Route path=":id/schedule" element={<ClassSchedulePage />} />
  </ErrorBoundaryRoutes>
);

export default ClassManagementRoutes;
