import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, isNumber, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getLessons } from 'app/entities/lesson/lesson.reducer';
import { createEntity, getEntity, reset, updateEntity } from './flashcard.reducer';

export const FlashcardUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const lessons = useAppSelector(state => state.lesson.entities);
  const flashcardEntity = useAppSelector(state => state.flashcard.entity);
  const loading = useAppSelector(state => state.flashcard.loading);
  const updating = useAppSelector(state => state.flashcard.updating);
  const updateSuccess = useAppSelector(state => state.flashcard.updateSuccess);

  const handleClose = () => {
    navigate(`/flashcard${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getLessons({}));
  }, []);

  useEffect(() => {
    if (updateSuccess) {
      handleClose();
    }
  }, [updateSuccess]);

  const saveEntity = values => {
    if (values.id !== undefined && typeof values.id !== 'number') {
      values.id = Number(values.id);
    }
    if (values.position !== undefined && typeof values.position !== 'number') {
      values.position = Number(values.position);
    }

    const entity = {
      ...flashcardEntity,
      ...values,
      lesson: lessons.find(it => it.id.toString() === values.lesson?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {}
      : {
          ...flashcardEntity,
          lesson: flashcardEntity?.lesson?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="onlineSatoriPlatformApp.flashcard.home.createOrEditLabel" data-cy="FlashcardCreateUpdateHeading">
            <Translate contentKey="onlineSatoriPlatformApp.flashcard.home.createOrEditLabel">Create or edit a Flashcard</Translate>
          </h2>
        </Col>
      </Row>
      <Row className="justify-content-center">
        <Col md="8">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ValidatedForm defaultValues={defaultValues()} onSubmit={saveEntity}>
              {!isNew ? (
                <ValidatedField
                  name="id"
                  required
                  readOnly
                  id="flashcard-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.flashcard.term')}
                id="flashcard-term"
                name="term"
                data-cy="term"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.flashcard.definition')}
                id="flashcard-definition"
                name="definition"
                data-cy="definition"
                type="textarea"
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.flashcard.imageUrl')}
                id="flashcard-imageUrl"
                name="imageUrl"
                data-cy="imageUrl"
                type="text"
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.flashcard.hint')}
                id="flashcard-hint"
                name="hint"
                data-cy="hint"
                type="text"
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.flashcard.position')}
                id="flashcard-position"
                name="position"
                data-cy="position"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                  validate: v => isNumber(v) || translate('entity.validation.number'),
                }}
              />
              <ValidatedField
                id="flashcard-lesson"
                name="lesson"
                data-cy="lesson"
                label={translate('onlineSatoriPlatformApp.flashcard.lesson')}
                type="select"
              >
                <option value="" key="0" />
                {lessons
                  ? lessons.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/flashcard" replace color="info">
                <FontAwesomeIcon icon="arrow-left" />
                &nbsp;
                <span className="d-none d-md-inline">
                  <Translate contentKey="entity.action.back">Back</Translate>
                </span>
              </Button>
              &nbsp;
              <Button color="primary" id="save-entity" data-cy="entityCreateSaveButton" type="submit" disabled={updating}>
                <FontAwesomeIcon icon="save" />
                &nbsp;
                <Translate contentKey="entity.action.save">Save</Translate>
              </Button>
            </ValidatedForm>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default FlashcardUpdate;
