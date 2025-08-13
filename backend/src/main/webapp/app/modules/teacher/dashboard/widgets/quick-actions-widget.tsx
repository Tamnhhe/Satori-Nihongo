import React from 'react';
import { Translate } from 'react-jhipster';
import { Card, CardBody, CardHeader, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { PendingQuiz } from '../teacher-dashboard.reducer';

interface QuickActionsWidgetProps {
  pendingQuizzes?: PendingQuiz[];
  loading: boolean;
}

const QuickActionsWidget: React.FC<QuickActionsWidgetProps> = ({ pendingQuizzes, loading }) => {
  const handleCreateCourse = () => {
    // Navigate to course creation - placeholder for now
    // TODO: Implement navigation to course creation
  };

  const handleCreateQuiz = () => {
    // Navigate to quiz creation - placeholder for now
    // TODO: Implement navigation to quiz creation
  };

  const handleViewStudents = () => {
    // Navigate to student management - placeholder for now
    // TODO: Implement navigation to student management
  };

  const handleScheduleClass = () => {
    // Navigate to class scheduling - placeholder for now
    // TODO: Implement navigation to class scheduling
  };

  return (
    <Card className="h-100">
      <CardHeader>
        <FontAwesomeIcon icon="bolt" className="me-2" />
        <Translate contentKey="teacherDashboard.quickActions">Quick Actions</Translate>
      </CardHeader>
      <CardBody>
        <div className="d-grid gap-2">
          <Button color="primary" size="sm" onClick={handleCreateCourse}>
            <FontAwesomeIcon icon="plus" className="me-2" />
            <Translate contentKey="teacherDashboard.createCourse">Create Course</Translate>
          </Button>

          <Button color="info" size="sm" onClick={handleCreateQuiz}>
            <FontAwesomeIcon icon="question-circle" className="me-2" />
            <Translate contentKey="teacherDashboard.createQuiz">Create Quiz</Translate>
          </Button>

          <Button color="success" size="sm" onClick={handleScheduleClass}>
            <FontAwesomeIcon icon="calendar-plus" className="me-2" />
            <Translate contentKey="teacherDashboard.scheduleClass">Schedule Class</Translate>
          </Button>

          <Button color="secondary" size="sm" onClick={handleViewStudents}>
            <FontAwesomeIcon icon="users" className="me-2" />
            <Translate contentKey="teacherDashboard.viewStudents">View Students</Translate>
          </Button>
        </div>

        {pendingQuizzes && pendingQuizzes.length > 0 && (
          <div className="mt-4">
            <h6 className="mb-3">
              <FontAwesomeIcon icon="exclamation-triangle" className="me-2 text-warning" />
              <Translate contentKey="teacherDashboard.pendingQuizzes">Pending Quizzes</Translate>
            </h6>
            {pendingQuizzes.map((quiz, index) => (
              <div key={quiz.id} className={`small mb-2 p-2 border rounded ${index === pendingQuizzes.length - 1 ? '' : 'mb-2'}`}>
                <div className="fw-bold">{quiz.title}</div>
                <div className="text-muted">{quiz.courseName}</div>
                <div className="d-flex justify-content-between align-items-center mt-1">
                  <small className="text-muted">
                    {quiz.submissionsCount}/{quiz.totalStudents} submitted
                  </small>
                  {quiz.dueDate && (
                    <small className="text-warning">
                      <FontAwesomeIcon icon="clock" className="me-1" />
                      Due soon
                    </small>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default QuickActionsWidget;
