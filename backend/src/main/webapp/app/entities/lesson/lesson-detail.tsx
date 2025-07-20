import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './lesson.reducer';

export const LessonDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const lessonEntity = useAppSelector(state => state.lesson.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="lessonDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.lesson.detail.title">Lesson</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="onlineSatoriPlatformApp.lesson.title">Title</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.title}</dd>
          <dt>
            <span id="content">
              <Translate contentKey="onlineSatoriPlatformApp.lesson.content">Content</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.content}</dd>
          <dt>
            <span id="videoUrl">
              <Translate contentKey="onlineSatoriPlatformApp.lesson.videoUrl">Video Url</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.videoUrl}</dd>
          <dt>
            <span id="slideUrl">
              <Translate contentKey="onlineSatoriPlatformApp.lesson.slideUrl">Slide Url</Translate>
            </span>
          </dt>
          <dd>{lessonEntity.slideUrl}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.lesson.course">Course</Translate>
          </dt>
          <dd>{lessonEntity.course ? lessonEntity.course.id : ''}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.lesson.quiz">Quiz</Translate>
          </dt>
          <dd>
            {lessonEntity.quizzes
              ? lessonEntity.quizzes.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {lessonEntity.quizzes && i === lessonEntity.quizzes.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/lesson" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/lesson/${lessonEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default LessonDetail;
