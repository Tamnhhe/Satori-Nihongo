import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';

import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';

const adminMenuItems = () => (
  <>
    <MenuItem icon="tachometer-alt" to="/admin/dashboard">
      <Translate contentKey="global.menu.admin.dashboard">Dashboard</Translate>
    </MenuItem>
    <MenuItem icon="users" to="/admin/user-management">
      <Translate contentKey="global.menu.admin.userManagement">User management</Translate>
    </MenuItem>
    <MenuItem icon="users-cog" to="/admin/enhanced-user-management">
      <Translate contentKey="global.menu.admin.enhancedUserManagement">Enhanced User Management</Translate>
    </MenuItem>
    <MenuItem icon="graduation-cap" to="/admin/course-management">
      <Translate contentKey="global.menu.admin.courseManagement">Course Management</Translate>
    </MenuItem>
    <MenuItem icon="chalkboard-teacher" to="/admin/class-management">
      <Translate contentKey="global.menu.admin.classManagement">Class Management</Translate>
    </MenuItem>
    <MenuItem icon="question-circle" to="/admin/quiz-management">
      <Translate contentKey="global.menu.admin.quizManagement">Quiz Management</Translate>
    </MenuItem>
    <MenuItem icon="folder-open" to="/admin/file-management">
      <Translate contentKey="global.menu.admin.fileManagement">File Management</Translate>
    </MenuItem>
    <MenuItem icon="chart-line" to="/admin/student-analytics">
      <Translate contentKey="global.menu.admin.studentAnalytics">Student Analytics</Translate>
    </MenuItem>
    <MenuItem icon="chart-area" to="/admin/analytics">
      <Translate contentKey="global.menu.admin.comprehensiveAnalytics">Comprehensive Analytics</Translate>
    </MenuItem>
    <MenuItem icon="file-alt" to="/admin/reporting">
      <Translate contentKey="global.menu.admin.reporting">Reporting</Translate>
    </MenuItem>
    <MenuItem icon="bell" to="/admin/notifications">
      <Translate contentKey="global.menu.admin.notificationManagement">Notification Management</Translate>
    </MenuItem>
    <MenuItem icon="cog" to="/admin/system-configuration">
      <Translate contentKey="global.menu.admin.systemConfiguration">System Configuration</Translate>
    </MenuItem>
    <MenuItem icon="chart-line" to="/admin/system-monitoring">
      <Translate contentKey="global.menu.admin.systemMonitoring">System Monitoring</Translate>
    </MenuItem>
    <MenuItem icon="question-circle" to="/admin/help-demo">
      <Translate contentKey="global.menu.admin.helpDemo">Help System Demo</Translate>
    </MenuItem>
    <MenuItem icon="tachometer-alt" to="/admin/metrics">
      <Translate contentKey="global.menu.admin.metrics">Metrics</Translate>
    </MenuItem>
    <MenuItem icon="heart" to="/admin/health">
      <Translate contentKey="global.menu.admin.health">Health</Translate>
    </MenuItem>
    <MenuItem icon="cogs" to="/admin/configuration">
      <Translate contentKey="global.menu.admin.configuration">Configuration</Translate>
    </MenuItem>
    <MenuItem icon="tasks" to="/admin/logs">
      <Translate contentKey="global.menu.admin.logs">Logs</Translate>
    </MenuItem>
    {/* jhipster-needle-add-element-to-admin-menu - JHipster will add entities to the admin menu here */}
  </>
);

const openAPIItem = () => (
  <MenuItem icon="book" to="/admin/docs">
    <Translate contentKey="global.menu.admin.apidocs">API</Translate>
  </MenuItem>
);

export const AdminMenu = ({ showOpenAPI }) => (
  <NavDropdown icon="users-cog" name={translate('global.menu.admin.main')} id="admin-menu" data-cy="adminMenu">
    {adminMenuItems()}
    {showOpenAPI && openAPIItem()}
  </NavDropdown>
);

export default AdminMenu;
