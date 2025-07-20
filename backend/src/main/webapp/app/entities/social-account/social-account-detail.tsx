import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './social-account.reducer';

export const SocialAccountDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const socialAccountEntity = useAppSelector(state => state.socialAccount.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="socialAccountDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.socialAccount.detail.title">SocialAccount</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{socialAccountEntity.id}</dd>
          <dt>
            <span id="provider">
              <Translate contentKey="onlineSatoriPlatformApp.socialAccount.provider">Provider</Translate>
            </span>
          </dt>
          <dd>{socialAccountEntity.provider}</dd>
          <dt>
            <span id="providerUserId">
              <Translate contentKey="onlineSatoriPlatformApp.socialAccount.providerUserId">Provider User Id</Translate>
            </span>
          </dt>
          <dd>{socialAccountEntity.providerUserId}</dd>
          <dt>
            <span id="accessToken">
              <Translate contentKey="onlineSatoriPlatformApp.socialAccount.accessToken">Access Token</Translate>
            </span>
          </dt>
          <dd>{socialAccountEntity.accessToken}</dd>
          <dt>
            <span id="refreshToken">
              <Translate contentKey="onlineSatoriPlatformApp.socialAccount.refreshToken">Refresh Token</Translate>
            </span>
          </dt>
          <dd>{socialAccountEntity.refreshToken}</dd>
          <dt>
            <span id="tokenExpiry">
              <Translate contentKey="onlineSatoriPlatformApp.socialAccount.tokenExpiry">Token Expiry</Translate>
            </span>
          </dt>
          <dd>
            {socialAccountEntity.tokenExpiry ? (
              <TextFormat value={socialAccountEntity.tokenExpiry} type="date" format={APP_DATE_FORMAT} />
            ) : null}
          </dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.socialAccount.userProfile">User Profile</Translate>
          </dt>
          <dd>{socialAccountEntity.userProfile ? socialAccountEntity.userProfile.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/social-account" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/social-account/${socialAccountEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default SocialAccountDetail;
