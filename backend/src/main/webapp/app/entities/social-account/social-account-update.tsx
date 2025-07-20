import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getUserProfiles } from 'app/entities/user-profile/user-profile.reducer';
import { AuthProvider } from 'app/shared/model/enumerations/auth-provider.model';
import { createEntity, getEntity, reset, updateEntity } from './social-account.reducer';

export const SocialAccountUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const userProfiles = useAppSelector(state => state.userProfile.entities);
  const socialAccountEntity = useAppSelector(state => state.socialAccount.entity);
  const loading = useAppSelector(state => state.socialAccount.loading);
  const updating = useAppSelector(state => state.socialAccount.updating);
  const updateSuccess = useAppSelector(state => state.socialAccount.updateSuccess);
  const authProviderValues = Object.keys(AuthProvider);

  const handleClose = () => {
    navigate(`/social-account${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getUserProfiles({}));
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
    values.tokenExpiry = convertDateTimeToServer(values.tokenExpiry);

    const entity = {
      ...socialAccountEntity,
      ...values,
      userProfile: userProfiles.find(it => it.id.toString() === values.userProfile?.toString()),
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
          tokenExpiry: displayDefaultDateTime(),
        }
      : {
          provider: 'LOCAL',
          ...socialAccountEntity,
          tokenExpiry: convertDateTimeFromServer(socialAccountEntity.tokenExpiry),
          userProfile: socialAccountEntity?.userProfile?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="onlineSatoriPlatformApp.socialAccount.home.createOrEditLabel" data-cy="SocialAccountCreateUpdateHeading">
            <Translate contentKey="onlineSatoriPlatformApp.socialAccount.home.createOrEditLabel">Create or edit a SocialAccount</Translate>
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
                  id="social-account-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.socialAccount.provider')}
                id="social-account-provider"
                name="provider"
                data-cy="provider"
                type="select"
              >
                {authProviderValues.map(authProvider => (
                  <option value={authProvider} key={authProvider}>
                    {translate(`onlineSatoriPlatformApp.AuthProvider.${authProvider}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.socialAccount.providerUserId')}
                id="social-account-providerUserId"
                name="providerUserId"
                data-cy="providerUserId"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  maxLength: { value: 100, message: translate('entity.validation.maxlength', { max: 100 }) },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.socialAccount.accessToken')}
                id="social-account-accessToken"
                name="accessToken"
                data-cy="accessToken"
                type="text"
                validate={{
                  maxLength: { value: 500, message: translate('entity.validation.maxlength', { max: 500 }) },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.socialAccount.refreshToken')}
                id="social-account-refreshToken"
                name="refreshToken"
                data-cy="refreshToken"
                type="text"
                validate={{
                  maxLength: { value: 500, message: translate('entity.validation.maxlength', { max: 500 }) },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.socialAccount.tokenExpiry')}
                id="social-account-tokenExpiry"
                name="tokenExpiry"
                data-cy="tokenExpiry"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                id="social-account-userProfile"
                name="userProfile"
                data-cy="userProfile"
                label={translate('onlineSatoriPlatformApp.socialAccount.userProfile')}
                type="select"
              >
                <option value="" key="0" />
                {userProfiles
                  ? userProfiles.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/social-account" replace color="info">
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

export default SocialAccountUpdate;
