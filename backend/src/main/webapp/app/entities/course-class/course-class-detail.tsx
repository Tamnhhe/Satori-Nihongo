import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './course-class.reducer';

export const CourseClassDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const courseClassEntity = useAppSelector(state => state.courseClass.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="courseClassDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.courseClass.detail.title">CourseClass</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{courseClassEntity.id}</dd>
          <dt>
            <span id="code">
              <Translate contentKey="onlineSatoriPlatformApp.courseClass.code">Code</Translate>
            </span>
          </dt>
          <dd>{courseClassEntity.code}</dd>
          <dt>
            <span id="name">
              <Translate contentKey="onlineSatoriPlatformApp.courseClass.name">Name</Translate>
            </span>
          </dt>
          <dd>{courseClassEntity.name}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="onlineSatoriPlatformApp.courseClass.description">Description</Translate>
            </span>
          </dt>
          <dd>{courseClassEntity.description}</dd>
          <dt>
            <span id="startDate">
              <Translate contentKey="onlineSatoriPlatformApp.courseClass.startDate">Start Date</Translate>
            </span>
          </dt>
          <dd>
            {courseClassEntity.startDate ? <TextFormat value={courseClassEntity.startDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="endDate">
              <Translate contentKey="onlineSatoriPlatformApp.courseClass.endDate">End Date</Translate>
            </span>
          </dt>
          <dd>
            {courseClassEntity.endDate ? <TextFormat value={courseClassEntity.endDate} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="capacity">
              <Translate contentKey="onlineSatoriPlatformApp.courseClass.capacity">Capacity</Translate>
            </span>
          </dt>
          <dd>{courseClassEntity.capacity}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.courseClass.course">Course</Translate>
          </dt>
          <dd>{courseClassEntity.course ? courseClassEntity.course.id : ''}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.courseClass.teacher">Teacher</Translate>
          </dt>
          <dd>{courseClassEntity.teacher ? courseClassEntity.teacher.id : ''}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.courseClass.students">Students</Translate>
          </dt>
          <dd>
            {courseClassEntity.students
              ? courseClassEntity.students.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {courseClassEntity.students && i === courseClassEntity.students.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/course-class" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/course-class/${courseClassEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default CourseClassDetail;
