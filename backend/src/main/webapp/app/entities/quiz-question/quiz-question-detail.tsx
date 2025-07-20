import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './quiz-question.reducer';

export const QuizQuestionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const quizQuestionEntity = useAppSelector(state => state.quizQuestion.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="quizQuestionDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.quizQuestion.detail.title">QuizQuestion</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{quizQuestionEntity.id}</dd>
          <dt>
            <span id="position">
              <Translate contentKey="onlineSatoriPlatformApp.quizQuestion.position">Position</Translate>
            </span>
          </dt>
          <dd>{quizQuestionEntity.position}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.quizQuestion.quiz">Quiz</Translate>
          </dt>
          <dd>{quizQuestionEntity.quiz ? quizQuestionEntity.quiz.id : ''}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.quizQuestion.question">Question</Translate>
          </dt>
          <dd>{quizQuestionEntity.question ? quizQuestionEntity.question.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/quiz-question" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/quiz-question/${quizQuestionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default QuizQuestionDetail;
