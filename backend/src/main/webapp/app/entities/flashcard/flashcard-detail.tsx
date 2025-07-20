import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './flashcard.reducer';

export const FlashcardDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const flashcardEntity = useAppSelector(state => state.flashcard.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="flashcardDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.flashcard.detail.title">Flashcard</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{flashcardEntity.id}</dd>
          <dt>
            <span id="term">
              <Translate contentKey="onlineSatoriPlatformApp.flashcard.term">Term</Translate>
            </span>
          </dt>
          <dd>{flashcardEntity.term}</dd>
          <dt>
            <span id="definition">
              <Translate contentKey="onlineSatoriPlatformApp.flashcard.definition">Definition</Translate>
            </span>
          </dt>
          <dd>{flashcardEntity.definition}</dd>
          <dt>
            <span id="imageUrl">
              <Translate contentKey="onlineSatoriPlatformApp.flashcard.imageUrl">Image Url</Translate>
            </span>
          </dt>
          <dd>{flashcardEntity.imageUrl}</dd>
          <dt>
            <span id="hint">
              <Translate contentKey="onlineSatoriPlatformApp.flashcard.hint">Hint</Translate>
            </span>
          </dt>
          <dd>{flashcardEntity.hint}</dd>
          <dt>
            <span id="position">
              <Translate contentKey="onlineSatoriPlatformApp.flashcard.position">Position</Translate>
            </span>
          </dt>
          <dd>{flashcardEntity.position}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.flashcard.lesson">Lesson</Translate>
          </dt>
          <dd>{flashcardEntity.lesson ? flashcardEntity.lesson.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/flashcard" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/flashcard/${flashcardEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default FlashcardDetail;
