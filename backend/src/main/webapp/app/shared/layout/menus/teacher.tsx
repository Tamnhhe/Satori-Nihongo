import React from 'react';
import MenuItem from 'app/shared/layout/menus/menu-item';
import { Translate, translate } from 'react-jhipster';
import { NavDropdown } from './menu-components';

const teacherMenuItems = () => (
  <>
    <MenuItem icon="tachometer-alt" to="/teacher/dashboard">
      <Translate contentKey="global.menu.teacher.dashboard">Dashboard</Translate>
    </MenuItem>
    {/* Additional teacher menu items will be added here as features are implemented */}
  </>
);

export const TeacherMenu = () => (
  <NavDropdown icon="chalkboard-teacher" name={translate('global.menu.teacher.main')} id="teacher-menu" data-cy="teacherMenu">
    {teacherMenuItems()}
  </NavDropdown>
);

export default TeacherMenu;
