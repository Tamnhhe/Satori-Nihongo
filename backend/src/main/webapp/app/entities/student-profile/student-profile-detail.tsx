import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './student-profile.reducer';

export const StudentProfileDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const studentProfileEntity = useAppSelector(state => state.studentProfile.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="studentProfileDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.studentProfile.detail.title">StudentProfile</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{studentProfileEntity.id}</dd>
          <dt>
            <span id="studentId">
              <Translate contentKey="onlineSatoriPlatformApp.studentProfile.studentId">Student Id</Translate>
            </span>
          </dt>
          <dd>{studentProfileEntity.studentId}</dd>
          <dt>
            <span id="gpa">
              <Translate contentKey="onlineSatoriPlatformApp.studentProfile.gpa">Gpa</Translate>
            </span>
          </dt>
          <dd>{studentProfileEntity.gpa}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.studentProfile.classes">Classes</Translate>
          </dt>
          <dd>
            {studentProfileEntity.classes
              ? studentProfileEntity.classes.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {studentProfileEntity.classes && i === studentProfileEntity.classes.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/student-profile" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/student-profile/${studentProfileEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default StudentProfileDetail;
