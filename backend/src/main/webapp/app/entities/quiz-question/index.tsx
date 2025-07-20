import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import QuizQuestion from './quiz-question';
import QuizQuestionDetail from './quiz-question-detail';
import QuizQuestionUpdate from './quiz-question-update';
import QuizQuestionDeleteDialog from './quiz-question-delete-dialog';

const QuizQuestionRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<QuizQuestion />} />
    <Route path="new" element={<QuizQuestionUpdate />} />
    <Route path=":id">
      <Route index element={<QuizQuestionDetail />} />
      <Route path="edit" element={<QuizQuestionUpdate />} />
      <Route path="delete" element={<QuizQuestionDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default QuizQuestionRoutes;
