import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner, Badge } from 'reactstrap';
import { Translate, translate, TextFormat } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_LOCAL_DATETIME_FORMAT } from 'app/config/constants';
import { createSchedule, updateSchedule, checkScheduleConflicts, getSchedulesByCourse } from './schedule-management.reducer';

interface ScheduleManagementModalProps {
  isOpen: boolean;
  toggle: () => void;
  courseId: number;
  courseTitle: string;
  schedule?: any;
  isEdit?: boolean;
}

const ScheduleManagementModal: React.FC<ScheduleManagementModalProps> = ({
  isOpen,
  toggle,
  courseId,
  courseTitle,
  schedule,
  isEdit = false,
}) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    location: '',
  });
  const [conflicts, setConflicts] = useState<any>(null);
  const [showConflicts, setShowConflicts] = useState(false);

  const { loading, scheduleSuccess, errorMessage, conflictCheckResult } = useAppSelector(state => state.scheduleManagement);

  useEffect(() => {
    if (isOpen) {
      if (isEdit && schedule) {
        // Convert schedule data for editing
        const scheduleDate = new Date(schedule.date);
        const startTime = new Date(schedule.startTime);
        const endTime = new Date(schedule.endTime);

        setFormData({
          date: scheduleDate.toISOString().split('T')[0],
          startTime: startTime.toTimeString().slice(0, 5),
          endTime: endTime.toTimeString().slice(0, 5),
          location: schedule.location || '',
        });
      } else {
        // Reset form for new schedule
        setFormData({
          date: '',
          startTime: '',
          endTime: '',
          location: '',
        });
      }
      setConflicts(null);
      setShowConflicts(false);
    }
  }, [isOpen, isEdit, schedule]);

  useEffect(() => {
    if (scheduleSuccess) {
      handleClose();
    }
  }, [scheduleSuccess]);

  useEffect(() => {
    if (conflictCheckResult) {
      setConflicts(conflictCheckResult);
      setShowConflicts(conflictCheckResult.hasConflicts);
    }
  }, [conflictCheckResult]);

  const handleClose = () => {
    setFormData({
      date: '',
      startTime: '',
      endTime: '',
      location: '',
    });
    setConflicts(null);
    setShowConflicts(false);
    toggle();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear conflicts when form changes
    if (conflicts) {
      setConflicts(null);
      setShowConflicts(false);
    }
  };

  const handleCheckConflicts = () => {
    if (!isFormValid()) return;

    const scheduleData = createScheduleData();
    dispatch(checkScheduleConflicts(scheduleData));
  };

  const createScheduleData = () => {
    const dateTime = new Date(formData.date);
    const [startHour, startMinute] = formData.startTime.split(':');
    const [endHour, endMinute] = formData.endTime.split(':');

    const startDateTime = new Date(dateTime);
    startDateTime.setHours(parseInt(startHour, 10), parseInt(startMinute, 10));

    const endDateTime = new Date(dateTime);
    endDateTime.setHours(parseInt(endHour, 10), parseInt(endMinute, 10));

    return {
      id: isEdit ? schedule?.id : null,
      courseId,
      date: dateTime.toISOString(),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      location: formData.location.trim(),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) return;

    const scheduleData = createScheduleData();

    if (isEdit) {
      dispatch(updateSchedule({ id: schedule.id, scheduleData }));
    } else {
      dispatch(createSchedule(scheduleData));
    }
  };

  const isFormValid = () => {
    return formData.date && formData.startTime && formData.endTime && formData.startTime < formData.endTime;
  };

  const getConflictBadgeColor = (conflictType: string) => {
    switch (conflictType) {
      case 'TEACHER':
        return 'danger';
      case 'LOCATION':
        return 'warning';
      case 'CLASS':
        return 'info';
      default:
        return 'secondary';
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <div className="modal-header">
        <h4 className="modal-title">
          <FontAwesomeIcon icon="calendar-plus" className="me-2" />
          {isEdit ? (
            <Translate contentKey="scheduleManagement.editTitle">Edit Schedule</Translate>
          ) : (
            <Translate contentKey="scheduleManagement.createTitle">Create Schedule</Translate>
          )}
        </h4>
        <button type="button" className="btn-close" onClick={handleClose} />
      </div>

      <Form onSubmit={handleSubmit}>
        <div className="modal-body">
          {errorMessage && (
            <Alert color="danger">
              <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
              {errorMessage}
            </Alert>
          )}

          {showConflicts && conflicts && conflicts.hasConflicts && (
            <Alert color="warning">
              <h6>
                <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
                <Translate contentKey="scheduleManagement.conflictsDetected">Schedule Conflicts Detected</Translate>
              </h6>
              <p className="mb-2">{conflicts.message}</p>
              {conflicts.conflicts.map((conflict: any, index: number) => (
                <div key={index} className="mb-2">
                  <Badge color={getConflictBadgeColor(conflict.conflictType)} className="me-2">
                    {conflict.conflictType}
                  </Badge>
                  <small>{conflict.description}</small>
                  {conflict.conflictingStartTime && (
                    <div className="text-muted small">
                      <TextFormat value={conflict.conflictingStartTime} type="date" format={APP_LOCAL_DATETIME_FORMAT} />
                      {' - '}
                      <TextFormat value={conflict.conflictingEndTime} type="date" format={APP_LOCAL_DATETIME_FORMAT} />
                    </div>
                  )}
                </div>
              ))}
            </Alert>
          )}

          <Row className="mb-3">
            <Col md={12}>
              <div className="form-group">
                <label className="form-label">
                  <Translate contentKey="scheduleManagement.course">Course</Translate>
                </label>
                <div className="form-control-plaintext">
                  <strong>{courseTitle}</strong>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <div className="form-group">
                <label className="form-label">
                  <Translate contentKey="scheduleManagement.date">Date</Translate>
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.date}
                  onChange={e => handleInputChange('date', e.target.value)}
                  required
                />
              </div>
            </Col>
            <Col md={4}>
              <div className="form-group">
                <label className="form-label">
                  <Translate contentKey="scheduleManagement.startTime">Start Time</Translate>
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.startTime}
                  onChange={e => handleInputChange('startTime', e.target.value)}
                  required
                />
              </div>
            </Col>
            <Col md={4}>
              <div className="form-group">
                <label className="form-label">
                  <Translate contentKey="scheduleManagement.endTime">End Time</Translate>
                  <span className="text-danger">*</span>
                </label>
                <input
                  type="time"
                  className="form-control"
                  value={formData.endTime}
                  onChange={e => handleInputChange('endTime', e.target.value)}
                  required
                />
              </div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <div className="form-group">
                <label className="form-label">
                  <Translate contentKey="scheduleManagement.location">Location</Translate>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.location}
                  onChange={e => handleInputChange('location', e.target.value)}
                  placeholder={translate('scheduleManagement.locationPlaceholder')}
                />
              </div>
            </Col>
          </Row>

          {formData.startTime && formData.endTime && formData.startTime >= formData.endTime && (
            <Alert color="danger">
              <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
              <Translate contentKey="scheduleManagement.invalidTimeRange">End time must be after start time</Translate>
            </Alert>
          )}
        </div>

        <div className="modal-footer">
          <Button color="info" type="button" onClick={handleCheckConflicts} disabled={!isFormValid() || loading}>
            <FontAwesomeIcon icon="search" className="me-1" />
            <Translate contentKey="scheduleManagement.checkConflicts">Check Conflicts</Translate>
          </Button>

          <Button color="secondary" onClick={handleClose}>
            <FontAwesomeIcon icon="times" className="me-1" />
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>

          <Button color="primary" type="submit" disabled={!isFormValid() || loading}>
            {loading && <Spinner size="sm" className="me-1" />}
            <FontAwesomeIcon icon="save" className="me-1" />
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ScheduleManagementModal;
