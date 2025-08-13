import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Row, Col, Alert, Spinner } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Select from 'react-select';
import {
  assignCourseToTeacher,
  assignCourseToClasses,
  getAvailableTeachers,
  getAvailableClasses,
} from 'app/modules/administration/course-management/course-assignment.reducer';

interface CourseAssignmentModalProps {
  isOpen: boolean;
  toggle: () => void;
  courseId: number;
  courseTitle: string;
  currentTeacherId?: number;
}

interface SelectOption {
  value: number;
  label: string;
}

const CourseAssignmentModal: React.FC<CourseAssignmentModalProps> = ({ isOpen, toggle, courseId, courseTitle, currentTeacherId }) => {
  const dispatch = useAppDispatch();

  const [assignmentType, setAssignmentType] = useState<'teacher' | 'classes'>('teacher');
  const [selectedTeacher, setSelectedTeacher] = useState<SelectOption | null>(null);
  const [selectedClasses, setSelectedClasses] = useState<SelectOption[]>([]);
  const [notes, setNotes] = useState('');

  const { availableTeachers, availableClasses, loading, assignmentSuccess, errorMessage } = useAppSelector(state => state.courseAssignment);

  useEffect(() => {
    if (isOpen) {
      dispatch(getAvailableTeachers());
      dispatch(getAvailableClasses());

      // Set current teacher if exists
      if (currentTeacherId && availableTeachers.length > 0) {
        const currentTeacher = availableTeachers.find(t => t.id === currentTeacherId);
        if (currentTeacher) {
          setSelectedTeacher({
            value: currentTeacher.id,
            label: currentTeacher.fullName,
          });
        }
      }
    }
  }, [isOpen, dispatch, currentTeacherId, availableTeachers]);

  useEffect(() => {
    if (assignmentSuccess) {
      handleClose();
    }
  }, [assignmentSuccess]);

  const handleClose = () => {
    setAssignmentType('teacher');
    setSelectedTeacher(null);
    setSelectedClasses([]);
    setNotes('');
    toggle();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (assignmentType === 'teacher' && selectedTeacher) {
      dispatch(
        assignCourseToTeacher({
          courseId,
          teacherId: selectedTeacher.value,
          assignmentType: 'TEACHER',
          notes,
        }),
      );
    } else if (assignmentType === 'classes' && selectedClasses.length > 0) {
      dispatch(
        assignCourseToClasses({
          courseId,
          classIds: selectedClasses.map(c => c.value),
          assignmentType: 'CLASS',
          notes,
        }),
      );
    }
  };

  const teacherOptions: SelectOption[] = availableTeachers.map(teacher => ({
    value: teacher.id,
    label: teacher.fullName,
  }));

  const classOptions: SelectOption[] = availableClasses.map(courseClass => ({
    value: courseClass.id,
    label: `${courseClass.code} - ${courseClass.name}`,
  }));

  const isFormValid = () => {
    if (assignmentType === 'teacher') {
      return selectedTeacher !== null;
    } else {
      return selectedClasses.length > 0;
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <div className="modal-header">
        <h4 className="modal-title">
          <FontAwesomeIcon icon="user-plus" className="me-2" />
          <Translate contentKey="courseManagement.assignment.title">Assign Course</Translate>
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

          <Row className="mb-3">
            <Col md={12}>
              <div className="form-group">
                <label className="form-label">
                  <Translate contentKey="courseManagement.assignment.course">Course</Translate>
                </label>
                <div className="form-control-plaintext">
                  <strong>{courseTitle}</strong>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={12}>
              <div className="form-group">
                <label className="form-label">
                  <Translate contentKey="courseManagement.assignment.type">Assignment Type</Translate>
                </label>
                <div className="d-flex gap-3">
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="assignmentType"
                      id="assignTeacher"
                      checked={assignmentType === 'teacher'}
                      onChange={() => setAssignmentType('teacher')}
                    />
                    <label className="form-check-label" htmlFor="assignTeacher">
                      <Translate contentKey="courseManagement.assignment.assignTeacher">Assign to Teacher</Translate>
                    </label>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="assignmentType"
                      id="assignClasses"
                      checked={assignmentType === 'classes'}
                      onChange={() => setAssignmentType('classes')}
                    />
                    <label className="form-check-label" htmlFor="assignClasses">
                      <Translate contentKey="courseManagement.assignment.assignClasses">Assign to Classes</Translate>
                    </label>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {assignmentType === 'teacher' && (
            <Row className="mb-3">
              <Col md={12}>
                <div className="form-group">
                  <label className="form-label">
                    <Translate contentKey="courseManagement.assignment.selectTeacher">Select Teacher</Translate>
                    <span className="text-danger">*</span>
                  </label>
                  <Select
                    value={selectedTeacher}
                    onChange={setSelectedTeacher}
                    options={teacherOptions}
                    placeholder={translate('courseManagement.assignment.selectTeacherPlaceholder')}
                    isClearable
                    isSearchable
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </Col>
            </Row>
          )}

          {assignmentType === 'classes' && (
            <Row className="mb-3">
              <Col md={12}>
                <div className="form-group">
                  <label className="form-label">
                    <Translate contentKey="courseManagement.assignment.selectClasses">Select Classes</Translate>
                    <span className="text-danger">*</span>
                  </label>
                  <Select
                    value={selectedClasses}
                    onChange={newValue => setSelectedClasses(newValue as SelectOption[])}
                    options={classOptions}
                    placeholder={translate('courseManagement.assignment.selectClassesPlaceholder')}
                    isMulti
                    isClearable
                    isSearchable
                    className="react-select-container"
                    classNamePrefix="react-select"
                  />
                </div>
              </Col>
            </Row>
          )}

          <Row className="mb-3">
            <Col md={12}>
              <div className="form-group">
                <label className="form-label">
                  <Translate contentKey="courseManagement.assignment.notes">Notes</Translate>
                </label>
                <textarea
                  className="form-control"
                  rows={3}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={translate('courseManagement.assignment.notesPlaceholder')}
                />
              </div>
            </Col>
          </Row>
        </div>

        <div className="modal-footer">
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

export default CourseAssignmentModal;
