import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './course.reducer';

export const CourseDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const courseEntity = useAppSelector(state => state.course.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="courseDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.course.detail.title">Course</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{courseEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="onlineSatoriPlatformApp.course.title">Title</Translate>
            </span>
          </dt>
          <dd>{courseEntity.title}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="onlineSatoriPlatformApp.course.description">Description</Translate>
            </span>
          </dt>
          <dd>{courseEntity.description}</dd>
          <dt>
            <span id="courseCode">
              <Translate contentKey="onlineSatoriPlatformApp.course.courseCode">Course Code</Translate>
            </span>
          </dt>
          <dd>{courseEntity.courseCode}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.course.teacher">Teacher</Translate>
          </dt>
          <dd>{courseEntity.teacher ? courseEntity.teacher.id : ''}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.course.quiz">Quiz</Translate>
          </dt>
          <dd>
            {courseEntity.quizzes
              ? courseEntity.quizzes.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {courseEntity.quizzes && i === courseEntity.quizzes.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/course" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/course/${courseEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default CourseDetail;
