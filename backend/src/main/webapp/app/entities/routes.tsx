import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import UserProfile from './user-profile';
import SocialAccount from './social-account';
import TeacherProfile from './teacher-profile';
import StudentProfile from './student-profile';
import Course from './course';
import CourseClass from './course-class';
import Lesson from './lesson';
import Schedule from './schedule';
import Quiz from './quiz';
import Question from './question';
import QuizQuestion from './quiz-question';
import StudentQuiz from './student-quiz';
import Flashcard from './flashcard';
/* jhipster-needle-add-route-import - JHipster will add routes here */

export default () => {
  return (
    <div>
      <ErrorBoundaryRoutes>
        {/* prettier-ignore */}
        <Route path="user-profile/*" element={<UserProfile />} />
        <Route path="social-account/*" element={<SocialAccount />} />
        <Route path="teacher-profile/*" element={<TeacherProfile />} />
        <Route path="student-profile/*" element={<StudentProfile />} />
        <Route path="course/*" element={<Course />} />
        <Route path="course-class/*" element={<CourseClass />} />
        <Route path="lesson/*" element={<Lesson />} />
        <Route path="schedule/*" element={<Schedule />} />
        <Route path="quiz/*" element={<Quiz />} />
        <Route path="question/*" element={<Question />} />
        <Route path="quiz-question/*" element={<QuizQuestion />} />
        <Route path="student-quiz/*" element={<StudentQuiz />} />
        <Route path="flashcard/*" element={<Flashcard />} />
        {/* jhipster-needle-add-route-path - JHipster will add routes here */}
      </ErrorBoundaryRoutes>
    </div>
  );
};
