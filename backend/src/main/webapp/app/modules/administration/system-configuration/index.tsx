import React from 'react';
import { Route } from 'react-router-dom';

import SystemConfigurationPanel from './system-configuration-panel';

const SystemConfigurationRoutes = () => <Route path="system-configuration" element={<SystemConfigurationPanel />} />;

export default SystemConfigurationRoutes;
