import React from 'react';
import { Translate } from 'react-jhipster';

import MenuItem from 'app/shared/layout/menus/menu-item';

const EntitiesMenu = () => {
  return (
    <>
      {/* prettier-ignore */}
      <MenuItem icon="asterisk" to="/user-profile">
        <Translate contentKey="global.menu.entities.userProfile" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/social-account">
        <Translate contentKey="global.menu.entities.socialAccount" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/teacher-profile">
        <Translate contentKey="global.menu.entities.teacherProfile" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/student-profile">
        <Translate contentKey="global.menu.entities.studentProfile" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/course">
        <Translate contentKey="global.menu.entities.course" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/course-class">
        <Translate contentKey="global.menu.entities.courseClass" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/lesson">
        <Translate contentKey="global.menu.entities.lesson" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/schedule">
        <Translate contentKey="global.menu.entities.schedule" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/quiz">
        <Translate contentKey="global.menu.entities.quiz" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/question">
        <Translate contentKey="global.menu.entities.question" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/quiz-question">
        <Translate contentKey="global.menu.entities.quizQuestion" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/student-quiz">
        <Translate contentKey="global.menu.entities.studentQuiz" />
      </MenuItem>
      <MenuItem icon="asterisk" to="/flashcard">
        <Translate contentKey="global.menu.entities.flashcard" />
      </MenuItem>
      {/* jhipster-needle-add-entity-to-menu - JHipster will add entities to the menu here */}
    </>
  );
};

export default EntitiesMenu;
