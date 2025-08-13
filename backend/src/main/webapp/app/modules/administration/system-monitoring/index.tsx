import React from 'react';
import { Routes, Route } from 'react-router-dom';

import SystemMonitoringDashboard from './system-monitoring-dashboard';

const SystemMonitoringRoutes = () => (
  <Routes>
    <Route path="*" element={<SystemMonitoringDashboard />} />
  </Routes>
);

export default SystemMonitoringRoutes;
