import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Button, Row, Col, Card, CardBody, Alert, Spinner } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { getEntity } from './class-management.reducer';
import ClassScheduleCalendar from './class-schedule-calendar';

const ClassSchedulePage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const classEntity = useAppSelector(state => state.classManagement.entity);
  const loading = useAppSelector(state => state.classManagement.loading);
  const errorMessage = useAppSelector(state => state.classManagement.errorMessage);

  useEffect(() => {
    if (id) {
      dispatch(getEntity(id));
    }
  }, [dispatch, id]);

  const handleBack = () => {
    navigate('/admin/class-management');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner color="primary" />
      </div>
    );
  }

  if (errorMessage) {
    return (
      <Alert color="danger">
        <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
        {errorMessage}
      </Alert>
    );
  }

  if (!classEntity || !classEntity.id) {
    return (
      <Alert color="warning">
        <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
        <Translate contentKey="classManagement.notFound">Class not found</Translate>
      </Alert>
    );
  }

  return (
    <div>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2>
                <FontAwesomeIcon icon="calendar" className="me-2" />
                <Translate contentKey="classManagement.schedule.pageTitle">Class Schedule Management</Translate>
              </h2>
              <div className="text-muted">
                <strong>{classEntity.name}</strong> ({classEntity.code})
                {classEntity.course && (
                  <>
                    {' - '}
                    <span>{classEntity.course.title}</span>
                  </>
                )}
              </div>
            </div>
            <div>
              <Button color="secondary" onClick={handleBack}>
                <FontAwesomeIcon icon="arrow-left" className="me-1" />
                <Translate contentKey="entity.action.back">Back</Translate>
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Class Information Card */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardBody>
              <Row>
                <Col md="3">
                  <div className="text-center">
                    <FontAwesomeIcon icon="users" size="2x" className="text-primary mb-2" />
                    <h5>{classEntity.currentEnrollment || 0}</h5>
                    <small className="text-muted">
                      <Translate contentKey="classManagement.enrollment.current">Current Enrollment</Translate>
                      {classEntity.capacity && ` / ${classEntity.capacity}`}
                    </small>
                  </div>
                </Col>
                <Col md="3">
                  <div className="text-center">
                    <FontAwesomeIcon icon="calendar-alt" size="2x" className="text-success mb-2" />
                    <h5>{classEntity.startDate ? new Date(classEntity.startDate).toLocaleDateString() : '-'}</h5>
                    <small className="text-muted">
                      <Translate contentKey="classManagement.startDate">Start Date</Translate>
                    </small>
                  </div>
                </Col>
                <Col md="3">
                  <div className="text-center">
                    <FontAwesomeIcon icon="calendar-check" size="2x" className="text-info mb-2" />
                    <h5>{classEntity.endDate ? new Date(classEntity.endDate).toLocaleDateString() : '-'}</h5>
                    <small className="text-muted">
                      <Translate contentKey="classManagement.endDate">End Date</Translate>
                    </small>
                  </div>
                </Col>
                <Col md="3">
                  <div className="text-center">
                    <FontAwesomeIcon icon="user-tie" size="2x" className="text-warning mb-2" />
                    <h5>{classEntity.teacher?.userProfile?.fullName || '-'}</h5>
                    <small className="text-muted">
                      <Translate contentKey="classManagement.teacher">Teacher</Translate>
                    </small>
                  </div>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Schedule Calendar */}
      <Row>
        <Col>
          <ClassScheduleCalendar classId={parseInt(id, 10)} className={classEntity.name} courseTitle={classEntity.course?.title || ''} />
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row className="mt-4">
        <Col>
          <Card>
            <CardBody>
              <h6 className="mb-3">
                <FontAwesomeIcon icon="bolt" className="me-2" />
                <Translate contentKey="classManagement.schedule.quickActions">Quick Actions</Translate>
              </h6>
              <div className="d-flex gap-2 flex-wrap">
                <Button tag={Link} to={`/admin/class-management/${id}/edit`} color="outline-primary" size="sm">
                  <FontAwesomeIcon icon="edit" className="me-1" />
                  <Translate contentKey="classManagement.edit.title">Edit Class</Translate>
                </Button>
                <Button tag={Link} to={`/admin/class-management/${id}/enrollment`} color="outline-success" size="sm">
                  <FontAwesomeIcon icon="user-plus" className="me-1" />
                  <Translate contentKey="classManagement.manageEnrollment">Manage Enrollment</Translate>
                </Button>
                <Button color="outline-info" size="sm" onClick={() => window.print()}>
                  <FontAwesomeIcon icon="print" className="me-1" />
                  <Translate contentKey="classManagement.schedule.print">Print Schedule</Translate>
                </Button>
                <Button
                  color="outline-secondary"
                  size="sm"
                  onClick={() => {
                    // Export schedule functionality
                    alert('Export functionality would be implemented here');
                  }}
                >
                  <FontAwesomeIcon icon="download" className="me-1" />
                  <Translate contentKey="classManagement.schedule.export">Export Schedule</Translate>
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ClassSchedulePage;
