import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './question.reducer';

export const QuestionDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const questionEntity = useAppSelector(state => state.question.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="questionDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.question.detail.title">Question</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{questionEntity.id}</dd>
          <dt>
            <span id="content">
              <Translate contentKey="onlineSatoriPlatformApp.question.content">Content</Translate>
            </span>
          </dt>
          <dd>{questionEntity.content}</dd>
          <dt>
            <span id="imageUrl">
              <Translate contentKey="onlineSatoriPlatformApp.question.imageUrl">Image Url</Translate>
            </span>
          </dt>
          <dd>{questionEntity.imageUrl}</dd>
          <dt>
            <span id="suggestion">
              <Translate contentKey="onlineSatoriPlatformApp.question.suggestion">Suggestion</Translate>
            </span>
          </dt>
          <dd>{questionEntity.suggestion}</dd>
          <dt>
            <span id="answerExplanation">
              <Translate contentKey="onlineSatoriPlatformApp.question.answerExplanation">Answer Explanation</Translate>
            </span>
          </dt>
          <dd>{questionEntity.answerExplanation}</dd>
          <dt>
            <span id="correctAnswer">
              <Translate contentKey="onlineSatoriPlatformApp.question.correctAnswer">Correct Answer</Translate>
            </span>
          </dt>
          <dd>{questionEntity.correctAnswer}</dd>
          <dt>
            <span id="type">
              <Translate contentKey="onlineSatoriPlatformApp.question.type">Type</Translate>
            </span>
          </dt>
          <dd>{questionEntity.type}</dd>
        </dl>
        <Button tag={Link} to="/question" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/question/${questionEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default QuestionDetail;
