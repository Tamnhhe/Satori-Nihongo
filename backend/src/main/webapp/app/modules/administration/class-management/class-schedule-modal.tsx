import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner, Badge, FormGroup, Label, Input } from 'reactstrap';
import { Translate, translate, TextFormat } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_LOCAL_DATETIME_FORMAT } from 'app/config/constants';
import { createClassSchedule, updateClassSchedule, checkClassScheduleConflicts } from './class-management.reducer';

interface ClassScheduleModalProps {
  isOpen: boolean;
  toggle: () => void;
  classId: number;
  className: string;
  courseTitle: string;
  schedule?: any;
  isEdit?: boolean;
}

const ClassScheduleModal: React.FC<ClassScheduleModalProps> = ({
  isOpen,
  toggle,
  classId,
  className,
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
    isRecurring: false,
    recurringType: 'weekly', // weekly, biweekly, monthly
    recurringEndDate: '',
    recurringDays: [] as string[], // for weekly recurring: ['monday', 'wednesday', 'friday']
    maxOccurrences: '',
    description: '',
  });
  const [conflicts, setConflicts] = useState<any>(null);
  const [showConflicts, setShowConflicts] = useState(false);
  const [validationErrors, setValidationErrors] = useState<any>({});

  const { loading, scheduleSuccess, errorMessage, conflictCheckResult } = useAppSelector(state => state.classManagement);

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
          isRecurring: schedule.isRecurring || false,
          recurringType: schedule.recurringType || 'weekly',
          recurringEndDate: schedule.recurringEndDate ? new Date(schedule.recurringEndDate).toISOString().split('T')[0] : '',
          recurringDays: schedule.recurringDays || [],
          maxOccurrences: schedule.maxOccurrences || '',
          description: schedule.description || '',
        });
      } else {
        // Reset form for new schedule
        resetForm();
      }
      setConflicts(null);
      setShowConflicts(false);
      setValidationErrors({});
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

  const resetForm = () => {
    setFormData({
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      isRecurring: false,
      recurringType: 'weekly',
      recurringEndDate: '',
      recurringDays: [],
      maxOccurrences: '',
      description: '',
    });
  };

  const handleClose = () => {
    resetForm();
    setConflicts(null);
    setShowConflicts(false);
    setValidationErrors({});
    toggle();
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));

    // Clear validation errors for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null,
      }));
    }

    // Clear conflicts when form changes
    if (conflicts) {
      setConflicts(null);
      setShowConflicts(false);
    }
  };

  const handleRecurringDayToggle = (day: string) => {
    const updatedDays = formData.recurringDays.includes(day)
      ? formData.recurringDays.filter(d => d !== day)
      : [...formData.recurringDays, day];

    handleInputChange('recurringDays', updatedDays);
  };

  const validateForm = () => {
    const errors: any = {};

    if (!formData.date) {
      errors.date = translate('entity.validation.required');
    }

    if (!formData.startTime) {
      errors.startTime = translate('entity.validation.required');
    }

    if (!formData.endTime) {
      errors.endTime = translate('entity.validation.required');
    }

    if (formData.startTime && formData.endTime && formData.startTime >= formData.endTime) {
      errors.endTime = translate('classManagement.schedule.validation.endTimeAfterStart');
    }

    if (formData.isRecurring) {
      if (!formData.recurringEndDate && !formData.maxOccurrences) {
        errors.recurringEnd = translate('classManagement.schedule.validation.recurringEndRequired');
      }

      if (formData.recurringType === 'weekly' && formData.recurringDays.length === 0) {
        errors.recurringDays = translate('classManagement.schedule.validation.recurringDaysRequired');
      }

      if (formData.recurringEndDate && formData.recurringEndDate <= formData.date) {
        errors.recurringEndDate = translate('classManagement.schedule.validation.recurringEndAfterStart');
      }

      if (formData.maxOccurrences && (parseInt(formData.maxOccurrences, 10) < 1 || parseInt(formData.maxOccurrences, 10) > 100)) {
        errors.maxOccurrences = translate('classManagement.schedule.validation.maxOccurrencesRange');
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleCheckConflicts = () => {
    if (!validateForm()) return;

    const scheduleData = createScheduleData();
    dispatch(checkClassScheduleConflicts(scheduleData));
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
      classId,
      date: dateTime.toISOString(),
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      location: formData.location.trim(),
      isRecurring: formData.isRecurring,
      recurringType: formData.isRecurring ? formData.recurringType : null,
      recurringEndDate: formData.isRecurring && formData.recurringEndDate ? new Date(formData.recurringEndDate).toISOString() : null,
      recurringDays: formData.isRecurring ? formData.recurringDays : [],
      maxOccurrences: formData.isRecurring && formData.maxOccurrences ? parseInt(formData.maxOccurrences, 10) : null,
      description: formData.description.trim(),
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const scheduleData = createScheduleData();

    if (isEdit) {
      dispatch(updateClassSchedule({ id: schedule.id, scheduleData }));
    } else {
      dispatch(createClassSchedule(scheduleData));
    }
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

  const weekDays = [
    { key: 'monday', label: 'Monday' },
    { key: 'tuesday', label: 'Tuesday' },
    { key: 'wednesday', label: 'Wednesday' },
    { key: 'thursday', label: 'Thursday' },
    { key: 'friday', label: 'Friday' },
    { key: 'saturday', label: 'Saturday' },
    { key: 'sunday', label: 'Sunday' },
  ];

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <div className="modal-header">
        <h4 className="modal-title">
          <FontAwesomeIcon icon="calendar-plus" className="me-2" />
          {isEdit ? (
            <Translate contentKey="classManagement.schedule.editTitle">Edit Class Schedule</Translate>
          ) : (
            <Translate contentKey="classManagement.schedule.createTitle">Create Class Schedule</Translate>
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
                <Translate contentKey="classManagement.schedule.conflictsDetected">Schedule Conflicts Detected</Translate>
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
                  <Translate contentKey="classManagement.schedule.class">Class</Translate>
                </label>
                <div className="form-control-plaintext">
                  <strong>{className}</strong> - {courseTitle}
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <FormGroup>
                <Label for="date">
                  <Translate contentKey="classManagement.schedule.date">Date</Translate>
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  type="date"
                  id="date"
                  value={formData.date}
                  onChange={e => handleInputChange('date', e.target.value)}
                  invalid={!!validationErrors.date}
                />
                {validationErrors.date && <div className="invalid-feedback">{validationErrors.date}</div>}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="startTime">
                  <Translate contentKey="classManagement.schedule.startTime">Start Time</Translate>
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  type="time"
                  id="startTime"
                  value={formData.startTime}
                  onChange={e => handleInputChange('startTime', e.target.value)}
                  invalid={!!validationErrors.startTime}
                />
                {validationErrors.startTime && <div className="invalid-feedback">{validationErrors.startTime}</div>}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="endTime">
                  <Translate contentKey="classManagement.schedule.endTime">End Time</Translate>
                  <span className="text-danger">*</span>
                </Label>
                <Input
                  type="time"
                  id="endTime"
                  value={formData.endTime}
                  onChange={e => handleInputChange('endTime', e.target.value)}
                  invalid={!!validationErrors.endTime}
                />
                {validationErrors.endTime && <div className="invalid-feedback">{validationErrors.endTime}</div>}
              </FormGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <FormGroup>
                <Label for="location">
                  <Translate contentKey="classManagement.schedule.location">Location</Translate>
                </Label>
                <Input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={e => handleInputChange('location', e.target.value)}
                  placeholder={translate('classManagement.schedule.locationPlaceholder')}
                />
              </FormGroup>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <FormGroup>
                <Label for="description">
                  <Translate contentKey="classManagement.schedule.description">Description</Translate>
                </Label>
                <Input
                  type="textarea"
                  id="description"
                  rows={2}
                  value={formData.description}
                  onChange={e => handleInputChange('description', e.target.value)}
                  placeholder={translate('classManagement.schedule.descriptionPlaceholder')}
                />
              </FormGroup>
            </Col>
          </Row>

          {/* Recurring Schedule Options */}
          <Row className="mb-3">
            <Col md={12}>
              <FormGroup check>
                <Input
                  type="checkbox"
                  id="isRecurring"
                  checked={formData.isRecurring}
                  onChange={e => handleInputChange('isRecurring', e.target.checked)}
                />
                <Label check for="isRecurring">
                  <FontAwesomeIcon icon="repeat" className="me-2" />
                  <Translate contentKey="classManagement.schedule.isRecurring">Make this a recurring schedule</Translate>
                </Label>
              </FormGroup>
            </Col>
          </Row>

          {formData.isRecurring && (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <FormGroup>
                    <Label for="recurringType">
                      <Translate contentKey="classManagement.schedule.recurringType">Recurring Type</Translate>
                    </Label>
                    <Input
                      type="select"
                      id="recurringType"
                      value={formData.recurringType}
                      onChange={e => handleInputChange('recurringType', e.target.value)}
                    >
                      <option value="weekly">
                        <Translate contentKey="classManagement.schedule.recurringType.weekly">Weekly</Translate>
                      </option>
                      <option value="biweekly">
                        <Translate contentKey="classManagement.schedule.recurringType.biweekly">Bi-weekly</Translate>
                      </option>
                      <option value="monthly">
                        <Translate contentKey="classManagement.schedule.recurringType.monthly">Monthly</Translate>
                      </option>
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label for="recurringEndDate">
                      <Translate contentKey="classManagement.schedule.recurringEndDate">End Date</Translate>
                    </Label>
                    <Input
                      type="date"
                      id="recurringEndDate"
                      value={formData.recurringEndDate}
                      onChange={e => handleInputChange('recurringEndDate', e.target.value)}
                      invalid={!!validationErrors.recurringEndDate}
                    />
                    {validationErrors.recurringEndDate && <div className="invalid-feedback">{validationErrors.recurringEndDate}</div>}
                  </FormGroup>
                </Col>
              </Row>

              {formData.recurringType === 'weekly' && (
                <Row className="mb-3">
                  <Col md={12}>
                    <FormGroup>
                      <Label>
                        <Translate contentKey="classManagement.schedule.recurringDays">Recurring Days</Translate>
                        <span className="text-danger">*</span>
                      </Label>
                      <div className="d-flex flex-wrap gap-2">
                        {weekDays.map(day => (
                          <div key={day.key} className="form-check form-check-inline">
                            <Input
                              type="checkbox"
                              id={`day-${day.key}`}
                              checked={formData.recurringDays.includes(day.key)}
                              onChange={() => handleRecurringDayToggle(day.key)}
                            />
                            <Label check for={`day-${day.key}`} className="form-check-label">
                              {day.label}
                            </Label>
                          </div>
                        ))}
                      </div>
                      {validationErrors.recurringDays && <div className="text-danger small">{validationErrors.recurringDays}</div>}
                    </FormGroup>
                  </Col>
                </Row>
              )}

              <Row className="mb-3">
                <Col md={6}>
                  <FormGroup>
                    <Label for="maxOccurrences">
                      <Translate contentKey="classManagement.schedule.maxOccurrences">Max Occurrences</Translate>
                    </Label>
                    <Input
                      type="number"
                      id="maxOccurrences"
                      min="1"
                      max="100"
                      value={formData.maxOccurrences}
                      onChange={e => handleInputChange('maxOccurrences', e.target.value)}
                      placeholder={translate('classManagement.schedule.maxOccurrencesPlaceholder')}
                      invalid={!!validationErrors.maxOccurrences}
                    />
                    {validationErrors.maxOccurrences && <div className="invalid-feedback">{validationErrors.maxOccurrences}</div>}
                    <small className="form-text text-muted">
                      <Translate contentKey="classManagement.schedule.maxOccurrencesHelp">Leave empty to use end date only</Translate>
                    </small>
                  </FormGroup>
                </Col>
              </Row>

              {validationErrors.recurringEnd && (
                <Alert color="warning">
                  <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
                  {validationErrors.recurringEnd}
                </Alert>
              )}
            </>
          )}
        </div>

        <div className="modal-footer">
          <Button color="info" type="button" onClick={handleCheckConflicts} disabled={loading}>
            <FontAwesomeIcon icon="search" className="me-1" />
            <Translate contentKey="classManagement.schedule.checkConflicts">Check Conflicts</Translate>
          </Button>

          <Button color="secondary" onClick={handleClose}>
            <FontAwesomeIcon icon="times" className="me-1" />
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>

          <Button color="primary" type="submit" disabled={loading}>
            {loading && <Spinner size="sm" className="me-1" />}
            <FontAwesomeIcon icon="save" className="me-1" />
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default ClassScheduleModal;
