import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, Button, Row, Col, Alert } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { createEntity, updateEntity } from './class-management.reducer';
import { getEntities as getCourses } from '../course-management/course-management.reducer';

interface ClassEditModalProps {
  isOpen: boolean;
  toggle: () => void;
  classEntity: any;
}

const ClassEditModal: React.FC<ClassEditModalProps> = ({ isOpen, toggle, classEntity }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    courseId: '',
    teacherId: '',
    startDate: '',
    endDate: '',
    capacity: '',
  });
  const [errors, setErrors] = useState<any>({});

  const courses = useAppSelector(state => state.courseManagement?.entities || []);
  const updating = useAppSelector(state => state.classManagement.updating);
  const updateSuccess = useAppSelector(state => state.classManagement.updateSuccess);

  useEffect(() => {
    if (isOpen) {
      dispatch(getCourses({ page: 0, size: 1000, sort: 'title,asc' }));
    }
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (classEntity) {
      setFormData({
        code: classEntity.code || '',
        name: classEntity.name || '',
        description: classEntity.description || '',
        courseId: classEntity.course?.id || '',
        teacherId: classEntity.teacher?.id || '',
        startDate: classEntity.startDate ? new Date(classEntity.startDate).toISOString().split('T')[0] : '',
        endDate: classEntity.endDate ? new Date(classEntity.endDate).toISOString().split('T')[0] : '',
        capacity: classEntity.capacity || '',
      });
    } else {
      setFormData({
        code: '',
        name: '',
        description: '',
        courseId: '',
        teacherId: '',
        startDate: '',
        endDate: '',
        capacity: '',
      });
    }
    setErrors({});
  }, [classEntity]);

  useEffect(() => {
    if (updateSuccess) {
      toggle();
    }
  }, [updateSuccess, toggle]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.code.trim()) {
      newErrors.code = translate('entity.validation.required');
    }
    if (!formData.name.trim()) {
      newErrors.name = translate('entity.validation.required');
    }
    if (!formData.courseId) {
      newErrors.courseId = translate('entity.validation.required');
    }
    if (!formData.startDate) {
      newErrors.startDate = translate('entity.validation.required');
    }
    if (!formData.endDate) {
      newErrors.endDate = translate('entity.validation.required');
    }
    if (!formData.capacity || parseInt(formData.capacity, 10) < 1) {
      newErrors.capacity = translate('entity.validation.required');
    }

    if (formData.startDate && formData.endDate && new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const entityData: any = {
      ...formData,
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      capacity: parseInt(formData.capacity, 10),
      course: { id: parseInt(formData.courseId, 10) },
      teacher: formData.teacherId ? { id: parseInt(formData.teacherId, 10) } : null,
    };

    if (classEntity) {
      entityData.id = classEntity.id;
      dispatch(updateEntity(entityData));
    } else {
      dispatch(createEntity(entityData));
    }
  };

  return (
    <Modal isOpen={isOpen} toggle={toggle} size="lg">
      <Form onSubmit={handleSubmit}>
        <ModalHeader toggle={toggle}>
          {classEntity ? (
            <Translate contentKey="classManagement.edit.title">Edit Class</Translate>
          ) : (
            <Translate contentKey="classManagement.create.title">Create Class</Translate>
          )}
        </ModalHeader>
        <ModalBody>
          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="code">
                  <Translate contentKey="classManagement.code">Code</Translate> *
                </Label>
                <Input
                  type="text"
                  name="code"
                  id="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  invalid={!!errors.code}
                  placeholder={translate('classManagement.placeholder.code')}
                />
                {errors.code && <div className="invalid-feedback">{errors.code}</div>}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="name">
                  <Translate contentKey="classManagement.name">Name</Translate> *
                </Label>
                <Input
                  type="text"
                  name="name"
                  id="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  invalid={!!errors.name}
                  placeholder={translate('classManagement.placeholder.name')}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </FormGroup>
            </Col>
          </Row>

          <FormGroup>
            <Label for="description">
              <Translate contentKey="classManagement.description">Description</Translate>
            </Label>
            <Input
              type="textarea"
              name="description"
              id="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              placeholder={translate('classManagement.placeholder.description')}
            />
          </FormGroup>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="courseId">
                  <Translate contentKey="classManagement.course">Course</Translate> *
                </Label>
                <Input
                  type="select"
                  name="courseId"
                  id="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  invalid={!!errors.courseId}
                >
                  <option value="">{translate('classManagement.placeholder.course')}</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.courseCode})
                    </option>
                  ))}
                </Input>
                {errors.courseId && <div className="invalid-feedback">{errors.courseId}</div>}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="capacity">
                  <Translate contentKey="classManagement.capacity">Capacity</Translate> *
                </Label>
                <Input
                  type="number"
                  name="capacity"
                  id="capacity"
                  min="1"
                  max="1000"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  invalid={!!errors.capacity}
                  placeholder={translate('classManagement.placeholder.capacity')}
                />
                {errors.capacity && <div className="invalid-feedback">{errors.capacity}</div>}
              </FormGroup>
            </Col>
          </Row>

          <Row>
            <Col md="6">
              <FormGroup>
                <Label for="startDate">
                  <Translate contentKey="classManagement.startDate">Start Date</Translate> *
                </Label>
                <Input
                  type="date"
                  name="startDate"
                  id="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  invalid={!!errors.startDate}
                />
                {errors.startDate && <div className="invalid-feedback">{errors.startDate}</div>}
              </FormGroup>
            </Col>
            <Col md="6">
              <FormGroup>
                <Label for="endDate">
                  <Translate contentKey="classManagement.endDate">End Date</Translate> *
                </Label>
                <Input
                  type="date"
                  name="endDate"
                  id="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  invalid={!!errors.endDate}
                />
                {errors.endDate && <div className="invalid-feedback">{errors.endDate}</div>}
              </FormGroup>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button color="primary" type="submit" disabled={updating}>
            {updating ? (
              'Saving...'
            ) : classEntity ? (
              <Translate contentKey="entity.action.save">Save</Translate>
            ) : (
              <Translate contentKey="entity.action.create">Create</Translate>
            )}
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default ClassEditModal;
