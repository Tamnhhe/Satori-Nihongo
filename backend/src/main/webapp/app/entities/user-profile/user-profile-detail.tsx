import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './user-profile.reducer';

export const UserProfileDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const userProfileEntity = useAppSelector(state => state.userProfile.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="userProfileDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.userProfile.detail.title">UserProfile</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.id}</dd>
          <dt>
            <span id="username">
              <Translate contentKey="onlineSatoriPlatformApp.userProfile.username">Username</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.username}</dd>
          <dt>
            <span id="passwordHash">
              <Translate contentKey="onlineSatoriPlatformApp.userProfile.passwordHash">Password Hash</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.passwordHash}</dd>
          <dt>
            <span id="email">
              <Translate contentKey="onlineSatoriPlatformApp.userProfile.email">Email</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.email}</dd>
          <dt>
            <span id="fullName">
              <Translate contentKey="onlineSatoriPlatformApp.userProfile.fullName">Full Name</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.fullName}</dd>
          <dt>
            <span id="gender">
              <Translate contentKey="onlineSatoriPlatformApp.userProfile.gender">Gender</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.gender ? 'true' : 'false'}</dd>
          <dt>
            <span id="role">
              <Translate contentKey="onlineSatoriPlatformApp.userProfile.role">Role</Translate>
            </span>
          </dt>
          <dd>{userProfileEntity.role}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.userProfile.teacherProfile">Teacher Profile</Translate>
          </dt>
          <dd>{userProfileEntity.teacherProfile ? userProfileEntity.teacherProfile.id : ''}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.userProfile.studentProfile">Student Profile</Translate>
          </dt>
          <dd>{userProfileEntity.studentProfile ? userProfileEntity.studentProfile.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/user-profile" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/user-profile/${userProfileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default UserProfileDetail;
