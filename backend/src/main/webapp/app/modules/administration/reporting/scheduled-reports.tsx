import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { Translate } from 'react-jhipster';
import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  Table,
  Button,
  Badge,
  Spinner,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faPlay, faStop, faTrash, faEye, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import { getScheduledReports, getExecutionHistory, unscheduleReport } from './reporting.reducer';
import { IReportConfiguration, ExecutionStatus } from 'app/shared/model/reporting.model';

const ScheduledReports = () => {
  const dispatch = useAppDispatch();
  const { scheduledReports, executionHistory, loading, errorMessage } = useAppSelector(state => state.reporting);

  const [selectedReport, setSelectedReport] = useState<IReportConfiguration | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    dispatch(getScheduledReports());
    dispatch(getExecutionHistory());
  }, [dispatch]);

  const handleUnscheduleReport = async () => {
    if (!selectedReport?.id) return;

    try {
      await dispatch(unscheduleReport(selectedReport.id)).unwrap();
      setShowDeleteModal(false);
      setSelectedReport(null);
      dispatch(getScheduledReports());
    } catch (error) {
      console.error('Error unscheduling report:', error);
    }
  };

  const getStatusBadge = (isActive: boolean) => {
    return <Badge color={isActive ? 'success' : 'secondary'}>{isActive ? 'Active' : 'Inactive'}</Badge>;
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getReportExecutions = (reportName: string) => {
    return executionHistory.filter(execution => execution.reportName === reportName);
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
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center">
              <Button color="link" tag={Link} to="/admin/reporting" className="p-0 me-3">
                <FontAwesomeIcon icon={faArrowLeft} />
              </Button>
              <h2>
                <FontAwesomeIcon icon={faCalendarAlt} className="me-2" />
                <Translate contentKey="reporting.scheduled.title">Scheduled Reports</Translate>
              </h2>
            </div>
            <Button color="primary" tag={Link} to="/admin/reporting/builder">
              <Translate contentKey="reporting.scheduled.createNew">Create New Report</Translate>
            </Button>
          </div>
        </Col>
      </Row>

      {errorMessage && (
        <Row className="mb-3">
          <Col>
            <Alert color="danger">{errorMessage}</Alert>
          </Col>
        </Row>
      )}

      <Row>
        <Col>
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                <Translate contentKey="reporting.scheduled.list">Scheduled Reports</Translate>
              </CardTitle>

              {scheduledReports.length > 0 ? (
                <div className="table-responsive">
                  <Table striped>
                    <thead>
                      <tr>
                        <th>
                          <Translate contentKey="reporting.scheduled.name">Name</Translate>
                        </th>
                        <th>
                          <Translate contentKey="reporting.scheduled.type">Type</Translate>
                        </th>
                        <th>
                          <Translate contentKey="reporting.scheduled.frequency">Frequency</Translate>
                        </th>
                        <th>
                          <Translate contentKey="reporting.scheduled.nextRun">Next Run</Translate>
                        </th>
                        <th>
                          <Translate contentKey="reporting.scheduled.status">Status</Translate>
                        </th>
                        <th>
                          <Translate contentKey="reporting.scheduled.recipients">Recipients</Translate>
                        </th>
                        <th>
                          <Translate contentKey="reporting.scheduled.actions">Actions</Translate>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {scheduledReports.map((report, index) => (
                        <tr key={index}>
                          <td>
                            <div>
                              <strong>{report.name}</strong>
                              {report.description && (
                                <div>
                                  <small className="text-muted">{report.description}</small>
                                </div>
                              )}
                            </div>
                          </td>
                          <td>
                            <Badge color="info">{report.reportType}</Badge>
                          </td>
                          <td>{report.schedule?.frequency}</td>
                          <td>{report.schedule?.nextRun ? formatDate(report.schedule.nextRun) : '-'}</td>
                          <td>{getStatusBadge(report.schedule?.isActive || false)}</td>
                          <td>
                            <small>{report.schedule?.recipients?.length || 0} recipients</small>
                          </td>
                          <td>
                            <div className="btn-group" role="group">
                              <Button
                                size="sm"
                                color="info"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setShowDetailsModal(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </Button>
                              <Button
                                size="sm"
                                color="danger"
                                onClick={() => {
                                  setSelectedReport(report);
                                  setShowDeleteModal(true);
                                }}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted">
                    <Translate contentKey="reporting.scheduled.noReports">No scheduled reports found</Translate>
                  </p>
                  <Button color="primary" tag={Link} to="/admin/reporting/builder">
                    <Translate contentKey="reporting.scheduled.createFirst">Create Your First Scheduled Report</Translate>
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Execution History */}
      <Row className="mt-4">
        <Col>
          <Card>
            <CardBody>
              <CardTitle tag="h5">
                <Translate contentKey="reporting.scheduled.executionHistory">Execution History</Translate>
              </CardTitle>

              {executionHistory.length > 0 ? (
                <div className="table-responsive">
                  <Table striped size="sm">
                    <thead>
                      <tr>
                        <th>
                          <Translate contentKey="reporting.scheduled.reportName">Report</Translate>
                        </th>
                        <th>
                          <Translate contentKey="reporting.scheduled.executionTime">Execution Time</Translate>
                        </th>
                        <th>
                          <Translate contentKey="reporting.scheduled.duration">Duration</Translate>
                        </th>
                        <th>
                          <Translate contentKey="reporting.scheduled.status">Status</Translate>
                        </th>
                        <th>
                          <Translate contentKey="reporting.scheduled.error">Error</Translate>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {executionHistory.slice(0, 20).map((execution, index) => (
                        <tr key={index}>
                          <td>{execution.reportName}</td>
                          <td>{formatDate(execution.executionTime)}</td>
                          <td>
                            {execution.completionTime
                              ? `${Math.round(
                                  (new Date(execution.completionTime).getTime() - new Date(execution.executionTime).getTime()) / 1000,
                                )}s`
                              : '-'}
                          </td>
                          <td>{getExecutionStatusBadge(execution.status)}</td>
                          <td>
                            {execution.errorMessage && (
                              <small className="text-danger" title={execution.errorMessage}>
                                {execution.errorMessage.length > 50
                                  ? `${execution.errorMessage.substring(0, 50)}...`
                                  : execution.errorMessage}
                              </small>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted">
                  <Translate contentKey="reporting.scheduled.noExecutions">No execution history available</Translate>
                </p>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={showDeleteModal} toggle={() => setShowDeleteModal(false)}>
        <ModalHeader toggle={() => setShowDeleteModal(false)}>
          <Translate contentKey="reporting.scheduled.confirmDelete">Confirm Delete</Translate>
        </ModalHeader>
        <ModalBody>
          <p>
            <Translate contentKey="reporting.scheduled.deleteWarning">
              Are you sure you want to unschedule this report? This action cannot be undone.
            </Translate>
          </p>
          {selectedReport && (
            <div className="alert alert-warning">
              <strong>{selectedReport.name}</strong>
              <br />
              <small>{selectedReport.description}</small>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowDeleteModal(false)}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button color="danger" onClick={handleUnscheduleReport}>
            <Translate contentKey="reporting.scheduled.unschedule">Unschedule</Translate>
          </Button>
        </ModalFooter>
      </Modal>

      {/* Details Modal */}
      <Modal isOpen={showDetailsModal} toggle={() => setShowDetailsModal(false)} size="lg">
        <ModalHeader toggle={() => setShowDetailsModal(false)}>
          <Translate contentKey="reporting.scheduled.details">Report Details</Translate>
        </ModalHeader>
        <ModalBody>
          {selectedReport && (
            <div>
              <Row>
                <Col md="6">
                  <h6>
                    <Translate contentKey="reporting.scheduled.basicInfo">Basic Information</Translate>
                  </h6>
                  <p>
                    <strong>Name:</strong> {selectedReport.name}
                  </p>
                  <p>
                    <strong>Type:</strong> {selectedReport.reportType}
                  </p>
                  <p>
                    <strong>Format:</strong> {selectedReport.format}
                  </p>
                  {selectedReport.description && (
                    <p>
                      <strong>Description:</strong> {selectedReport.description}
                    </p>
                  )}
                </Col>
                <Col md="6">
                  <h6>
                    <Translate contentKey="reporting.scheduled.scheduleInfo">Schedule Information</Translate>
                  </h6>
                  <p>
                    <strong>Frequency:</strong> {selectedReport.schedule?.frequency}
                  </p>
                  <p>
                    <strong>Status:</strong> {getStatusBadge(selectedReport.schedule?.isActive || false)}
                  </p>
                  {selectedReport.schedule?.nextRun && (
                    <p>
                      <strong>Next Run:</strong> {formatDate(selectedReport.schedule.nextRun)}
                    </p>
                  )}
                </Col>
              </Row>

              {selectedReport.schedule?.recipients && (
                <div className="mt-3">
                  <h6>
                    <Translate contentKey="reporting.scheduled.recipients">Recipients</Translate>
                  </h6>
                  <ul>
                    {selectedReport.schedule.recipients.map((recipient, index) => (
                      <li key={index}>{recipient}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recent Executions for this report */}
              <div className="mt-3">
                <h6>
                  <Translate contentKey="reporting.scheduled.recentExecutions">Recent Executions</Translate>
                </h6>
                {(() => {
                  const reportExecutions = getReportExecutions(selectedReport.name);
                  return reportExecutions.length > 0 ? (
                    <Table size="sm">
                      <thead>
                        <tr>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportExecutions.slice(0, 5).map((execution, index) => (
                          <tr key={index}>
                            <td>{formatDate(execution.executionTime)}</td>
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
                    <p className="text-muted">No executions yet</p>
                  );
                })()}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowDetailsModal(false)}>
            <Translate contentKey="entity.action.close">Close</Translate>
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ScheduledReports;
