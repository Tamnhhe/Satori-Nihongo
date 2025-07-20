import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { mapIdList } from 'app/shared/util/entity-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getCourses } from 'app/entities/course/course.reducer';
import { getEntities as getLessons } from 'app/entities/lesson/lesson.reducer';
import { QuizType } from 'app/shared/model/enumerations/quiz-type.model';
import { createEntity, getEntity, reset, updateEntity } from './quiz.reducer';

export const QuizUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const courses = useAppSelector(state => state.course.entities);
  const lessons = useAppSelector(state => state.lesson.entities);
  const quizEntity = useAppSelector(state => state.quiz.entity);
  const loading = useAppSelector(state => state.quiz.loading);
  const updating = useAppSelector(state => state.quiz.updating);
  const updateSuccess = useAppSelector(state => state.quiz.updateSuccess);
  const quizTypeValues = Object.keys(QuizType);

  const handleClose = () => {
    navigate(`/quiz${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getCourses({}));
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

    const entity = {
      ...quizEntity,
      ...values,
      courses: mapIdList(values.courses),
      lessons: mapIdList(values.lessons),
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
          quizType: 'COURSE',
          ...quizEntity,
          courses: quizEntity?.courses?.map(e => e.id.toString()),
          lessons: quizEntity?.lessons?.map(e => e.id.toString()),
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="onlineSatoriPlatformApp.quiz.home.createOrEditLabel" data-cy="QuizCreateUpdateHeading">
            <Translate contentKey="onlineSatoriPlatformApp.quiz.home.createOrEditLabel">Create or edit a Quiz</Translate>
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
                  id="quiz-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.quiz.title')}
                id="quiz-title"
                name="title"
                data-cy="title"
                type="text"
                validate={{
                  required: { value: true, message: translate('entity.validation.required') },
                }}
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.quiz.description')}
                id="quiz-description"
                name="description"
                data-cy="description"
                type="text"
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.quiz.isTest')}
                id="quiz-isTest"
                name="isTest"
                data-cy="isTest"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.quiz.isPractice')}
                id="quiz-isPractice"
                name="isPractice"
                data-cy="isPractice"
                check
                type="checkbox"
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.quiz.quizType')}
                id="quiz-quizType"
                name="quizType"
                data-cy="quizType"
                type="select"
              >
                {quizTypeValues.map(quizType => (
                  <option value={quizType} key={quizType}>
                    {translate(`onlineSatoriPlatformApp.QuizType.${quizType}`)}
                  </option>
                ))}
              </ValidatedField>
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.quiz.course')}
                id="quiz-course"
                data-cy="course"
                type="select"
                multiple
                name="courses"
              >
                <option value="" key="0" />
                {courses
                  ? courses.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.quiz.lesson')}
                id="quiz-lesson"
                data-cy="lesson"
                type="select"
                multiple
                name="lessons"
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
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/quiz" replace color="info">
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

export default QuizUpdate;
