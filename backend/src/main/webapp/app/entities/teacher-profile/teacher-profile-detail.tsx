import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './teacher-profile.reducer';

export const TeacherProfileDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const teacherProfileEntity = useAppSelector(state => state.teacherProfile.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="teacherProfileDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.teacherProfile.detail.title">TeacherProfile</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{teacherProfileEntity.id}</dd>
          <dt>
            <span id="teacherCode">
              <Translate contentKey="onlineSatoriPlatformApp.teacherProfile.teacherCode">Teacher Code</Translate>
            </span>
          </dt>
          <dd>{teacherProfileEntity.teacherCode}</dd>
        </dl>
        <Button tag={Link} to="/teacher-profile" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/teacher-profile/${teacherProfileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default TeacherProfileDetail;
