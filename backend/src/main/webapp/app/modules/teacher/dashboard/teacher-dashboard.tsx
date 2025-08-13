import React, { useEffect } from 'react';
import { Translate } from 'react-jhipster';
import { Row, Col, Card, CardBody } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getTeacherDashboardStats } from './teacher-dashboard.reducer';
import CourseOverviewWidget from './widgets/course-overview-widget';
import ActiveClassesWidget from './widgets/active-classes-widget';
import StudentProgressWidget from './widgets/student-progress-widget';
import QuickActionsWidget from './widgets/quick-actions-widget';

const TeacherDashboard = () => {
  const dispatch = useAppDispatch();

  const dashboardStats = useAppSelector(state => state.teacherDashboard.stats);
  const loading = useAppSelector(state => state.teacherDashboard.loading);

  useEffect(() => {
    dispatch(getTeacherDashboardStats());
  }, []);

  const refreshDashboard = () => {
    dispatch(getTeacherDashboardStats());
  };

  return (
    <div>
      <Row className="mb-3">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <h2 data-cy="teacherDashboardHeading">
              <Translate contentKey="teacherDashboard.title">Teacher Dashboard</Translate>
            </h2>
            <button className="btn btn-primary" onClick={refreshDashboard} disabled={loading}>
              <FontAwesomeIcon icon="sync" spin={loading} /> <Translate contentKey="teacherDashboard.refresh">Refresh</Translate>
            </button>
          </div>
        </Col>
      </Row>

      {/* Overview Stats Row */}
      <Row className="mb-4">
        <Col lg="3" md="6" className="mb-3">
          <Card className="text-center">
            <CardBody>
              <div className="h3 mb-0 text-primary">{dashboardStats?.totalCourses || 0}</div>
              <small className="text-muted">
                <Translate contentKey="teacherDashboard.totalCourses">Total Courses</Translate>
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col lg="3" md="6" className="mb-3">
          <Card className="text-center">
            <CardBody>
              <div className="h3 mb-0 text-success">{dashboardStats?.totalClasses || 0}</div>
              <small className="text-muted">
                <Translate contentKey="teacherDashboard.activeClasses">Active Classes</Translate>
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col lg="3" md="6" className="mb-3">
          <Card className="text-center">
            <CardBody>
              <div className="h3 mb-0 text-info">{dashboardStats?.totalStudents || 0}</div>
              <small className="text-muted">
                <Translate contentKey="teacherDashboard.totalStudents">Total Students</Translate>
              </small>
            </CardBody>
          </Card>
        </Col>
        <Col lg="3" md="6" className="mb-3">
          <Card className="text-center">
            <CardBody>
              <div className="h3 mb-0 text-warning">{dashboardStats?.averageClassCompletion || 0}%</div>
              <small className="text-muted">
                <Translate contentKey="teacherDashboard.avgCompletion">Avg Completion</Translate>
              </small>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Main Dashboard Content */}
      <Row>
        <Col lg="4" className="mb-4">
          <CourseOverviewWidget courses={dashboardStats?.assignedCourses} loading={loading} />
        </Col>
        <Col lg="4" className="mb-4">
          <ActiveClassesWidget classes={dashboardStats?.activeClasses} loading={loading} />
        </Col>
        <Col lg="4" className="mb-4">
          <QuickActionsWidget pendingQuizzes={dashboardStats?.pendingQuizzes} loading={loading} />
        </Col>
      </Row>

      <Row>
        <Col lg="12" className="mb-4">
          <StudentProgressWidget students={dashboardStats?.studentProgress} loading={loading} />
        </Col>
      </Row>
    </div>
  );
};

export default TeacherDashboard;
