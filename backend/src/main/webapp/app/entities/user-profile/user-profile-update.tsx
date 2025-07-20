import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getTeacherProfiles } from 'app/entities/teacher-profile/teacher-profile.reducer';
import { getEntities as getStudentProfiles } from 'app/entities/student-profile/student-profile.reducer';
import { Role } from 'app/shared/model/enumerations/role.model';
import { createEntity, getEntity, reset, updateEntity } from './user-profile.reducer';

export const UserProfileUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const teacherProfiles = useAppSelector(state => state.teacherProfile.entities);
  const studentProfiles = useAppSelector(state => state.studentProfile.entities);
  const userProfileEntity = useAppSelector(state => state.userProfile.entity);
  const loading = useAppSelector(state => state.userProfile.loading);
  const updating = useAppSelector(state => state.userProfile.updating);
  const updateSuccess = useAppSelector(state => state.userProfile.updateSuccess);
  const roleValues = Object.keys(Role);

  const handleClose = () => {
    navigate(`/user-profile${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

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

    const entity = {
      ...userProfileEntity,
      ...values,
      teacherProfile: teacherProfiles.find(it => it.id.toString() === values.teacherProfile?.toString()),
      studentProfile: studentProfiles.find(it => it.id.toString() === values.studentProfile?.toString()),
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
          role: 'ADMIN',
          ...userProfileEntity,
          teacherProfile: userProfileEntity?.teacherProfile?.id,
          studentProfile: userProfileEntity?.studentProfile?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="onlineSatoriPlatformApp.userProfile.home.createOrEditLabel" data-cy="UserProfileCreateUpdateHeading">
            <Translate contentKey="onlineSatoriPlatformApp.userProfile.home.createOrEditLabel">Create or edit a UserProfile</Translate>
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
                  id="user-profile-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.userProfile.username')}
                id="user-profile-username"
                name="username"
                data-cy="username"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.userProfile.passwordHash')}
                id="user-profile-passwordHash"
                name="passwordHash"
                data-cy="passwordHash"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.userProfile.email')}
                id="user-profile-email"
                name="email"
                data-cy="email"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.userProfile.fullName')}
                id="user-profile-fullName"
                name="fullName"
                data-cy="fullName"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.userProfile.gender')}
                id="user-profile-gender"
                name="gender"
                data-cy="gender"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.userProfile.role')}
                id="user-profile-role"
                name="role"
                data-cy="role"
                type="select"
              >
                {roleValues.map(role => (
                  <option value={role} key={role}>
                    {translate(`onlineSatoriPlatformApp.Role.${role}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                id="user-profile-teacherProfile"
                name="teacherProfile"
                data-cy="teacherProfile"
                label={translate('onlineSatoriPlatformApp.userProfile.teacherProfile')}
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
                id="user-profile-studentProfile"
                name="studentProfile"
                data-cy="studentProfile"
                label={translate('onlineSatoriPlatformApp.userProfile.studentProfile')}
                type="select"
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/user-profile" replace color="info">
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

export default UserProfileUpdate;
