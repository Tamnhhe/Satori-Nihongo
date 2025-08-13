import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Translate } from 'react-jhipster';
import { Row, Col, Card, CardBody, CardTitle, Button, Table, Badge, Spinner, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faChartBar, faClock, faDownload, faPlus, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { getReportTemplates, getScheduledReports, getExecutionHistory } from './reporting.reducer';
import { ReportType, ExecutionStatus } from 'app/shared/model/reporting.model';

const ReportingDashboard = () => {
  const dispatch = useAppDispatch();
  const { templates, scheduledReports, executionHistory, loading, errorMessage } = useAppSelector(state => state.reporting);

  useEffect(() => {
    dispatch(getReportTemplates());
    dispatch(getScheduledReports());
    dispatch(getExecutionHistory());
  }, [dispatch]);

  const getReportTypeIcon = (type: ReportType) => {
    switch (type) {
      case ReportType.STUDENT_PROGRESS:
        return faChartBar;
      case ReportType.COURSE_ANALYTICS:
        return faFileAlt;
      case ReportType.QUIZ_PERFORMANCE:
        return faChartBar;
      default:
        return faFileAlt;
    }
  };

  const getExecutionStatusBadge = (status: ExecutionStatus) => {
    switch (status) {
      case ExecutionStatus.SUCCESS:
        return <Badge color="success">Success</Badge>;
      case ExecutionStatus.FAILED:
        return <Badge color="danger">Failed</Badge>;
      case ExecutionStatus.RUNNING:
        return <Badge color="warning">Running</Badge>;
      default:
        return <Badge color="secondary">Unknown</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center">
        <Spinner color="primary" />
      </div>
    );
  }

  return (
    <div>
      <Row className="mb-4">
        <Col>
          <h2>
            <FontAwesomeIcon icon={faFileAlt} className="me-2" />
            <Translate contentKey="reporting.title">Reporting Dashboard</Translate>
          </h2>
          <p className="text-muted">
            <Translate contentKey="reporting.description">Generate, schedule, and manage reports for analytics and insights</Translate>
          </p>
        </Col>
      </Row>

      {errorMessage && (
        <Row className="mb-3">
          <Col>
            <Alert color="danger">{errorMessage}</Alert>
          </Col>
        </Row>
      )}

      {/* Quick Actions */}
      <Row className="mb-4">
        <Col>
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                <Translate contentKey="reporting.quickActions">Quick Actions</Translate>
              </CardTitle>
              <div className="d-flex gap-2">
                <Button color="primary" tag={Link} to="/admin/reporting/builder">
                  <FontAwesomeIcon icon={faPlus} className="me-1" />
                  <Translate contentKey="reporting.createReport">Create Report</Translate>
                </Button>
                <Button color="secondary" tag={Link} to="/admin/reporting/scheduled">
                  <FontAwesomeIcon icon={faCalendarAlt} className="me-1" />
                  <Translate contentKey="reporting.manageScheduled">Manage Scheduled</Translate>
                </Button>
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Report Templates */}
        <Col md="6" className="mb-4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                <Translate contentKey="reporting.templates">Report Templates</Translate>
              </CardTitle>
              {templates.length > 0 ? (
                <div className="list-group list-group-flush">
                  {templates.map((template, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-start">
                      <div className="ms-2 me-auto">
                        <div className="fw-bold d-flex align-items-center">
                          <FontAwesomeIcon icon={getReportTypeIcon(template.reportType)} className="me-2" />
                          {template.name}
                        </div>
                        <small className="text-muted">{template.description}</small>
                      </div>
                      <Button size="sm" color="outline-primary" tag={Link} to={`/admin/reporting/builder?template=${template.reportType}`}>
                        <Translate contentKey="reporting.useTemplate">Use</Translate>
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">
                  <Translate contentKey="reporting.noTemplates">No templates available</Translate>
                </p>
              )}
            </CardBody>
          </Card>
        </Col>

        {/* Scheduled Reports */}
        <Col md="6" className="mb-4">
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                <FontAwesomeIcon icon={faClock} className="me-2" />
                <Translate contentKey="reporting.scheduledReports">Scheduled Reports</Translate>
              </CardTitle>
              {scheduledReports.length > 0 ? (
                <div className="list-group list-group-flush">
                  {scheduledReports.slice(0, 5).map((report, index) => (
                    <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <div>
                        <div className="fw-bold">{report.name}</div>
                        <small className="text-muted">
                          {report.schedule?.frequency} - Next: {report.schedule?.nextRun}
                        </small>
                      </div>
                      <Badge color={report.schedule?.isActive ? 'success' : 'secondary'}>
                        {report.schedule?.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">
                  <Translate contentKey="reporting.noScheduledReports">No scheduled reports</Translate>
                </p>
              )}
              {scheduledReports.length > 5 && (
                <div className="text-center mt-2">
                  <Button size="sm" color="link" tag={Link} to="/admin/reporting/scheduled">
                    <Translate contentKey="reporting.viewAll">View All</Translate>
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Recent Execution History */}
      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                <FontAwesomeIcon icon={faClock} className="me-2" />
                <Translate contentKey="reporting.recentExecutions">Recent Executions</Translate>
              </CardTitle>
              {executionHistory.length > 0 ? (
                <Table responsive>
                  <thead>
                    <tr>
                      <th>
                        <Translate contentKey="reporting.reportName">Report Name</Translate>
                      </th>
                      <th>
                        <Translate contentKey="reporting.executionTime">Execution Time</Translate>
                      </th>
                      <th>
                        <Translate contentKey="reporting.status">Status</Translate>
                      </th>
                      <th>
                        <Translate contentKey="reporting.duration">Duration</Translate>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {executionHistory.slice(0, 10).map((execution, index) => (
                      <tr key={index}>
                        <td>{execution.reportName}</td>
                        <td>{new Date(execution.executionTime).toLocaleString()}</td>
                        <td>{getExecutionStatusBadge(execution.status)}</td>
                        <td>
                          {execution.completionTime
                            ? `${Math.round(
                                (new Date(execution.completionTime).getTime() - new Date(execution.executionTime).getTime()) / 1000,
                              )}s`
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <p className="text-muted">
                  <Translate contentKey="reporting.noExecutions">No recent executions</Translate>
                </p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ReportingDashboard;
