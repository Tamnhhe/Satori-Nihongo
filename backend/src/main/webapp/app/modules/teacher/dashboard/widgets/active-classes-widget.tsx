import React from 'react';
import { Translate, TextFormat } from 'react-jhipster';
import { Card, CardBody, CardHeader, Progress } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_LOCAL_DATETIME_FORMAT } from 'app/config/constants';
import { ActiveClass } from '../teacher-dashboard.reducer';

interface ActiveClassesWidgetProps {
  classes?: ActiveClass[];
  loading: boolean;
}

const ActiveClassesWidget: React.FC<ActiveClassesWidgetProps> = ({ classes, loading }) => {
  const getEnrollmentPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'success';
  };

  return (
    <Card className="h-100">
      <CardHeader>
        <FontAwesomeIcon icon="users" className="me-2" />
        <Translate contentKey="teacherDashboard.activeClasses">Active Classes</Translate>
      </CardHeader>
      <CardBody>
        {loading ? (
          <div className="text-center text-muted">
            <FontAwesomeIcon icon="spinner" spin /> <Translate contentKey="teacherDashboard.loading">Loading...</Translate>
          </div>
        ) : classes && classes.length > 0 ? (
          <div>
            {classes.map((classItem, index) => (
              <div key={classItem.id} className={`mb-3 ${index === classes.length - 1 ? '' : 'border-bottom pb-3'}`}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div className="flex-grow-1">
                    <h6 className="mb-1">{classItem.name}</h6>
                    <small className="text-muted">
                      {classItem.code} • {classItem.courseName}
                    </small>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small className="text-muted">
                      <Translate contentKey="teacherDashboard.enrollment">Enrollment</Translate>
                    </small>
                    <small className="fw-bold">
                      {classItem.currentEnrollment}/{classItem.capacity}
                    </small>
                  </div>
                  <Progress
                    value={getEnrollmentPercentage(classItem.currentEnrollment, classItem.capacity)}
                    color={getProgressColor(getEnrollmentPercentage(classItem.currentEnrollment, classItem.capacity))}
                    size="sm"
                  />
                </div>

                {classItem.nextSession && (
                  <div className="small text-muted">
                    <FontAwesomeIcon icon="clock" className="me-1" />
                    <Translate contentKey="teacherDashboard.nextSession">Next Session</Translate>:{' '}
                    <TextFormat value={classItem.nextSession} type="date" format={APP_LOCAL_DATETIME_FORMAT} />
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted">
            <FontAwesomeIcon icon="chalkboard" className="mb-2" size="2x" />
            <div>
              <Translate contentKey="teacherDashboard.noClasses">No active classes</Translate>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default ActiveClassesWidget;
