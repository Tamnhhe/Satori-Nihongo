import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import StudentQuiz from './student-quiz';
import StudentQuizDetail from './student-quiz-detail';
import StudentQuizUpdate from './student-quiz-update';
import StudentQuizDeleteDialog from './student-quiz-delete-dialog';

const StudentQuizRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<StudentQuiz />} />
    <Route path="new" element={<StudentQuizUpdate />} />
    <Route path=":id">
      <Route index element={<StudentQuizDetail />} />
      <Route path="edit" element={<StudentQuizUpdate />} />
      <Route path="delete" element={<StudentQuizDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default StudentQuizRoutes;
