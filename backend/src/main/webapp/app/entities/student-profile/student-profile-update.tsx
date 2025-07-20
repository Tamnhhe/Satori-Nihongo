import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getCourseClasses } from 'app/entities/course-class/course-class.reducer';
import { createEntity, getEntity, reset, updateEntity } from './student-profile.reducer';

export const StudentProfileUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const courseClasses = useAppSelector(state => state.courseClass.entities);
  const studentProfileEntity = useAppSelector(state => state.studentProfile.entity);
  const loading = useAppSelector(state => state.studentProfile.loading);
  const updating = useAppSelector(state => state.studentProfile.updating);
  const updateSuccess = useAppSelector(state => state.studentProfile.updateSuccess);

  const handleClose = () => {
    navigate(`/student-profile${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getCourseClasses({}));
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
    if (values.gpa !== undefined && typeof values.gpa !== 'number') {
      values.gpa = Number(values.gpa);
    }

    const entity = {
      ...studentProfileEntity,
      ...values,
      classes: mapIdList(values.classes),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...studentProfileEntity,
          classes: studentProfileEntity?.classes?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="onlineSatoriPlatformApp.studentProfile.home.createOrEditLabel" data-cy="StudentProfileCreateUpdateHeading">
            <Translate contentKey="onlineSatoriPlatformApp.studentProfile.home.createOrEditLabel">
              Create or edit a StudentProfile
            </Translate>
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
                  id="student-profile-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.studentProfile.studentId')}
                id="student-profile-studentId"
                name="studentId"
                data-cy="studentId"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.studentProfile.gpa')}
                id="student-profile-gpa"
                name="gpa"
                data-cy="gpa"
                type="text"
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.studentProfile.classes')}
                id="student-profile-classes"
                data-cy="classes"
                type="select"
                multiple
                name="classes"
              >
                <option value="" key="0" />
                {courseClasses
                  ? courseClasses.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/student-profile" replace color="info">
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

export default StudentProfileUpdate;
