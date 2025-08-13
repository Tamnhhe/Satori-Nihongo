import React from 'react';
import { Translate, TextFormat } from 'react-jhipster';
import { Card, CardBody, CardHeader, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_LOCAL_DATETIME_FORMAT } from 'app/config/constants';
import { StudentProgressSummary } from '../teacher-dashboard.reducer';

interface StudentProgressWidgetProps {
  students?: StudentProgressSummary[];
  loading: boolean;
}

const StudentProgressWidget: React.FC<StudentProgressWidgetProps> = ({ students, loading }) => {
  const getProgressColor = (rate: number) => {
    if (rate >= 80) return 'success';
    if (rate >= 60) return 'warning';
    return 'danger';
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-danger';
  };

  return (
    <Card className="h-100">
      <CardHeader>
        <FontAwesomeIcon icon="chart-line" className="me-2" />
        <Translate contentKey="teacherDashboard.studentProgress">Student Progress</Translate>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="text-center text-muted">
            <FontAwesomeIcon icon="spinner" spin /> <Translate contentKey="teacherDashboard.loading">Loading...</Translate>
          </div>
        ) : students && students.length > 0 ? (
          <div>
            {students.map((student, index) => (
              <div key={student.studentId} className={`mb-3 ${index === students.length - 1 ? '' : 'border-bottom pb-3'}`}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{student.studentName}</h6>
                    <small className="text-muted">{student.courseName}</small>
                  </div>
                  <div className="text-end">
                    <div className={`fw-bold ${getScoreColor(student.averageScore)}`}>{student.averageScore}%</div>
                    <small className="text-muted">
                      <Translate contentKey="teacherDashboard.avgScore">Avg Score</Translate>
                    </small>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted">
                      <Translate contentKey="teacherDashboard.completion">Completion</Translate>
                    </small>
                    <small className="fw-bold">{student.completionRate}%</small>
                  </div>
                  <Progress value={student.completionRate} color={getProgressColor(student.completionRate)} size="sm" />
                </div>

                <div className="small text-muted">
                  <FontAwesomeIcon icon="clock" className="me-1" />
                  <Translate contentKey="teacherDashboard.lastActivity">Last Activity</Translate>:{' '}
                  <TextFormat value={student.lastActivity} type="date" format={APP_LOCAL_DATETIME_FORMAT} />
                </div>
              </div>
            ))}

            <div className="text-center mt-3">
              <small className="text-muted">
                <Translate contentKey="teacherDashboard.viewAllStudents">View all students</Translate>
              </small>
            </div>
          </div>
        ) : (
          <div className="text-center text-muted">
            <FontAwesomeIcon icon="user-graduate" className="mb-2" size="2x" />
            <div>
              <Translate contentKey="teacherDashboard.noStudents">No student data available</Translate>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default StudentProgressWidget;
