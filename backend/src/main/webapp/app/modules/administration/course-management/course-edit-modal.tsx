import React, { useState, useEffect } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Form, FormGroup, Label, Input, FormFeedback } from 'reactstrap';
import { Translate, translate } from 'react-jhipster';
import { useForm, Controller } from 'react-hook-form';
import { ICourse } from './course-management.reducer';

interface CourseEditModalProps {
  isOpen: boolean;
  course: ICourse | null;
  teachers: Array<{ id: number; fullName: string; username: string }>;
  onSave: (course: ICourse) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

interface CourseFormData {
  title: string;
  description: string;
  courseCode: string;
  teacherId: number | null;
}

const CourseEditModal: React.FC<CourseEditModalProps> = ({ isOpen, course, teachers, onSave, onClose, loading = false }) => {
  const [saving, setSaving] = useState(false);
  const isEditing = !!course?.id;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CourseFormData>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      description: '',
      courseCode: '',
      teacherId: null,
    },
  });

  useEffect(() => {
    if (course) {
      reset({
        title: course.title || '',
        description: course.description || '',
        courseCode: course.courseCode || '',
        teacherId: course.teacher?.id || null,
      });
    } else {
      reset({
        title: '',
        description: '',
        courseCode: '',
        teacherId: null,
      });
    }
  }, [course, reset]);

  const handleSave = async (formData: CourseFormData) => {
    setSaving(true);
    try {
      const courseData: ICourse = {
        ...course,
        title: formData.title,
        description: formData.description,
        courseCode: formData.courseCode,
        teacher: formData.teacherId ? teachers.find(t => t.id === formData.teacherId) : undefined,
      };

      await onSave(courseData);
      onClose();
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} toggle={handleClose} size="lg">
      <Form onSubmit={handleSubmit(handleSave)}>
        <ModalHeader toggle={handleClose}>
          <Translate contentKey={isEditing ? 'courseManagement.edit.title' : 'courseManagement.create.title'}>
            {isEditing ? 'Edit Course' : 'Create Course'}
          </Translate>
        </ModalHeader>

        <ModalBody>
          <FormGroup>
            <Label for="title">
              <Translate contentKey="courseManagement.form.title">Title</Translate>
              <span className="text-danger"> *</span>
            </Label>
            <Controller
              name="title"
              control={control}
              rules={{
                required: translate('courseManagement.validation.title.required'),
                minLength: {
                  value: 2,
                  message: translate('courseManagement.validation.title.minLength'),
                },
                maxLength: {
                  value: 100,
                  message: translate('courseManagement.validation.title.maxLength'),
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  id="title"
                  placeholder={translate('courseManagement.form.title.placeholder')}
                  invalid={!!errors.title}
                />
              )}
            />
            {errors.title && <FormFeedback>{errors.title.message}</FormFeedback>}
          </FormGroup>

          <FormGroup>
            <Label for="courseCode">
              <Translate contentKey="courseManagement.form.courseCode">Course Code</Translate>
            </Label>
            <Controller
              name="courseCode"
              control={control}
              rules={{
                pattern: {
                  value: /^[A-Z0-9_-]*$/,
                  message: translate('courseManagement.validation.courseCode.pattern'),
                },
                maxLength: {
                  value: 20,
                  message: translate('courseManagement.validation.courseCode.maxLength'),
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  id="courseCode"
                  placeholder={translate('courseManagement.form.courseCode.placeholder')}
                  invalid={!!errors.courseCode}
                />
              )}
            />
            {errors.courseCode && <FormFeedback>{errors.courseCode.message}</FormFeedback>}
          </FormGroup>

          <FormGroup>
            <Label for="description">
              <Translate contentKey="courseManagement.form.description">Description</Translate>
            </Label>
            <Controller
              name="description"
              control={control}
              rules={{
                maxLength: {
                  value: 500,
                  message: translate('courseManagement.validation.description.maxLength'),
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  type="textarea"
                  id="description"
                  rows={4}
                  placeholder={translate('courseManagement.form.description.placeholder')}
                  invalid={!!errors.description}
                />
              )}
            />
            {errors.description && <FormFeedback>{errors.description.message}</FormFeedback>}
          </FormGroup>

          <FormGroup>
            <Label for="teacherId">
              <Translate contentKey="courseManagement.form.teacher">Teacher</Translate>
            </Label>
            <Controller
              name="teacherId"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="select"
                  id="teacherId"
                  value={field.value || ''}
                  onChange={e => field.onChange(e.target.value ? parseInt(e.target.value, 10) : null)}
                >
                  <option value="">
                    <Translate contentKey="courseManagement.form.teacher.placeholder">Select a teacher</Translate>
                  </option>
                  {teachers.map(teacher => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.fullName} ({teacher.username})
                    </option>
                  ))}
                </Input>
              )}
            />
          </FormGroup>
        </ModalBody>

        <ModalFooter>
          <Button color="secondary" onClick={handleClose} disabled={saving}>
            <Translate contentKey="entity.action.cancel">Cancel</Translate>
          </Button>
          <Button color="primary" type="submit" disabled={!isValid || saving}>
            {saving && <span className="spinner-border spinner-border-sm me-2" />}
            <Translate contentKey="entity.action.save">Save</Translate>
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default CourseEditModal;
