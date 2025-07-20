import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './quiz.reducer';

export const QuizDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const quizEntity = useAppSelector(state => state.quiz.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="quizDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.quiz.detail.title">Quiz</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{quizEntity.id}</dd>
          <dt>
            <span id="title">
              <Translate contentKey="onlineSatoriPlatformApp.quiz.title">Title</Translate>
            </span>
          </dt>
          <dd>{quizEntity.title}</dd>
          <dt>
            <span id="description">
              <Translate contentKey="onlineSatoriPlatformApp.quiz.description">Description</Translate>
            </span>
          </dt>
          <dd>{quizEntity.description}</dd>
          <dt>
            <span id="isTest">
              <Translate contentKey="onlineSatoriPlatformApp.quiz.isTest">Is Test</Translate>
            </span>
          </dt>
          <dd>{quizEntity.isTest ? 'true' : 'false'}</dd>
          <dt>
            <span id="isPractice">
              <Translate contentKey="onlineSatoriPlatformApp.quiz.isPractice">Is Practice</Translate>
            </span>
          </dt>
          <dd>{quizEntity.isPractice ? 'true' : 'false'}</dd>
          <dt>
            <span id="quizType">
              <Translate contentKey="onlineSatoriPlatformApp.quiz.quizType">Quiz Type</Translate>
            </span>
          </dt>
          <dd>{quizEntity.quizType}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.quiz.course">Course</Translate>
          </dt>
          <dd>
            {quizEntity.courses
              ? quizEntity.courses.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {quizEntity.courses && i === quizEntity.courses.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.quiz.lesson">Lesson</Translate>
          </dt>
          <dd>
            {quizEntity.lessons
              ? quizEntity.lessons.map((val, i) => (
                  <span key={val.id}>
                    <a>{val.id}</a>
                    {quizEntity.lessons && i === quizEntity.lessons.length - 1 ? '' : ', '}
                  </span>
                ))
              : null}
          </dd>
        </dl>
        <Button tag={Link} to="/quiz" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/quiz/${quizEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default QuizDetail;
