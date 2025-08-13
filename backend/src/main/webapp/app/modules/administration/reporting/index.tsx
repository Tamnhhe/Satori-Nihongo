import React from 'react';
import { Route } from 'react-router-dom';
import { ReducersMapObject } from '@reduxjs/toolkit';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';
import ReportingDashboard from './reporting-dashboard';
import ReportBuilder from './report-builder';
import ScheduledReports from './scheduled-reports';
import { reportingReducer } from './reporting.reducer';

const ReportingRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<ReportingDashboard />} />
    <Route path="builder" element={<ReportBuilder />} />
    <Route path="scheduled" element={<ScheduledReports />} />
  </ErrorBoundaryRoutes>
);

export const reportingReducers: ReducersMapObject = {
  reporting: reportingReducer,
};

export default ReportingRoutes;
