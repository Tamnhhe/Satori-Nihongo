import React from 'react';
import { Route } from 'react-router';

import ErrorBoundaryRoutes from 'app/shared/error/error-boundary-routes';

import Lesson from './lesson';
import LessonDetail from './lesson-detail';
import LessonUpdate from './lesson-update';
import LessonDeleteDialog from './lesson-delete-dialog';

const LessonRoutes = () => (
  <ErrorBoundaryRoutes>
    <Route index element={<Lesson />} />
    <Route path="new" element={<LessonUpdate />} />
    <Route path=":id">
      <Route index element={<LessonDetail />} />
      <Route path="edit" element={<LessonUpdate />} />
      <Route path="delete" element={<LessonDeleteDialog />} />
    </Route>
  </ErrorBoundaryRoutes>
);

export default LessonRoutes;
