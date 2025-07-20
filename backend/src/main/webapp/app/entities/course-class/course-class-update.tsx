import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getCourses } from 'app/entities/course/course.reducer';
import { getEntities as getTeacherProfiles } from 'app/entities/teacher-profile/teacher-profile.reducer';
import { getEntities as getStudentProfiles } from 'app/entities/student-profile/student-profile.reducer';
import { createEntity, getEntity, reset, updateEntity } from './course-class.reducer';

export const CourseClassUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const courses = useAppSelector(state => state.course.entities);
  const teacherProfiles = useAppSelector(state => state.teacherProfile.entities);
  const studentProfiles = useAppSelector(state => state.studentProfile.entities);
  const courseClassEntity = useAppSelector(state => state.courseClass.entity);
  const loading = useAppSelector(state => state.courseClass.loading);
  const updating = useAppSelector(state => state.courseClass.updating);
  const updateSuccess = useAppSelector(state => state.courseClass.updateSuccess);

  const handleClose = () => {
    navigate(`/course-class${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getCourses({}));
    dispatch(getTeacherProfiles({}));
    dispatch(getStudentProfiles({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    values.startDate = convertDateTimeToServer(values.startDate);
    values.endDate = convertDateTimeToServer(values.endDate);
    if (values.capacity !== undefined && typeof values.capacity !== 'number') {
      values.capacity = Number(values.capacity);
    }

    const entity = {
      ...courseClassEntity,
      ...values,
      course: courses.find(it => it.id.toString() === values.course?.toString()),
      teacher: teacherProfiles.find(it => it.id.toString() === values.teacher?.toString()),
      students: mapIdList(values.students),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          startDate: displayDefaultDateTime(),
          endDate: displayDefaultDateTime(),
        }
      : {
          ...courseClassEntity,
          startDate: convertDateTimeFromServer(courseClassEntity.startDate),
          endDate: convertDateTimeFromServer(courseClassEntity.endDate),
          course: courseClassEntity?.course?.id,
          teacher: courseClassEntity?.teacher?.id,
          students: courseClassEntity?.students?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="onlineSatoriPlatformApp.courseClass.home.createOrEditLabel" data-cy="CourseClassCreateUpdateHeading">
            <Translate contentKey="onlineSatoriPlatformApp.courseClass.home.createOrEditLabel">Create or edit a CourseClass</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="course-class-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.courseClass.code')}
                id="course-class-code"
                name="code"
                data-cy="code"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.courseClass.name')}
                id="course-class-name"
                name="name"
                data-cy="name"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.courseClass.description')}
                id="course-class-description"
                name="description"
                data-cy="description"
                type="text"
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.courseClass.startDate')}
                id="course-class-startDate"
                name="startDate"
                data-cy="startDate"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.courseClass.endDate')}
                id="course-class-endDate"
                name="endDate"
                data-cy="endDate"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.courseClass.capacity')}
                id="course-class-capacity"
                name="capacity"
                data-cy="capacity"
                type="text"
              />
              <ValidatedField
                id="course-class-course"
                name="course"
                data-cy="course"
                label={translate('onlineSatoriPlatformApp.courseClass.course')}
                type="select"
              >
                <option value="" key="0" />
                {courses
                  ? courses.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="course-class-teacher"
                name="teacher"
                data-cy="teacher"
                label={translate('onlineSatoriPlatformApp.courseClass.teacher')}
                type="select"
              >
                <option value="" key="0" />
                {teacherProfiles
                  ? teacherProfiles.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.courseClass.students')}
                id="course-class-students"
                data-cy="students"
                type="select"
                multiple
                name="students"
              >
                <option value="" key="0" />
                {studentProfiles
                  ? studentProfiles.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/course-class" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default CourseClassUpdate;
