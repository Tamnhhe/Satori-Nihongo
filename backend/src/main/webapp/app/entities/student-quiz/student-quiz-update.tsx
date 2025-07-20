import React, { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { Translate, ValidatedField, ValidatedForm, translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { convertDateTimeFromServer, convertDateTimeToServer, displayDefaultDateTime } from 'app/shared/util/date-utils';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntities as getQuizzes } from 'app/entities/quiz/quiz.reducer';
import { getEntities as getUserProfiles } from 'app/entities/user-profile/user-profile.reducer';
import { createEntity, getEntity, reset, updateEntity } from './student-quiz.reducer';

export const StudentQuizUpdate = () => {
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const { id } = useParams<'id'>();
  const isNew = id === undefined;

  const quizzes = useAppSelector(state => state.quiz.entities);
  const userProfiles = useAppSelector(state => state.userProfile.entities);
  const studentQuizEntity = useAppSelector(state => state.studentQuiz.entity);
  const loading = useAppSelector(state => state.studentQuiz.loading);
  const updating = useAppSelector(state => state.studentQuiz.updating);
  const updateSuccess = useAppSelector(state => state.studentQuiz.updateSuccess);

  const handleClose = () => {
    navigate(`/student-quiz${location.search}`);
  };

  useEffect(() => {
    if (isNew) {
      dispatch(reset());
    } else {
      dispatch(getEntity(id));
    }

    dispatch(getQuizzes({}));
    dispatch(getUserProfiles({}));
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
    values.startTime = convertDateTimeToServer(values.startTime);
    values.endTime = convertDateTimeToServer(values.endTime);
    if (values.score !== undefined && typeof values.score !== 'number') {
      values.score = Number(values.score);
    }

    const entity = {
      ...studentQuizEntity,
      ...values,
      quiz: quizzes.find(it => it.id.toString() === values.quiz?.toString()),
      student: userProfiles.find(it => it.id.toString() === values.student?.toString()),
    };

    if (isNew) {
      dispatch(createEntity(entity));
    } else {
      dispatch(updateEntity(entity));
    }
  };

  const defaultValues = () =>
    isNew
      ? {
          startTime: displayDefaultDateTime(),
          endTime: displayDefaultDateTime(),
        }
      : {
          ...studentQuizEntity,
          startTime: convertDateTimeFromServer(studentQuizEntity.startTime),
          endTime: convertDateTimeFromServer(studentQuizEntity.endTime),
          quiz: studentQuizEntity?.quiz?.id,
          student: studentQuizEntity?.student?.id,
        };

  return (
    <div>
      <Row className="justify-content-center">
        <Col md="8">
          <h2 id="onlineSatoriPlatformApp.studentQuiz.home.createOrEditLabel" data-cy="StudentQuizCreateUpdateHeading">
            <Translate contentKey="onlineSatoriPlatformApp.studentQuiz.home.createOrEditLabel">Create or edit a StudentQuiz</Translate>
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
                  id="student-quiz-id"
                  label={translate('global.field.id')}
                  validate={{ required: true }}
                />
              ) : null}
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.studentQuiz.startTime')}
                id="student-quiz-startTime"
                name="startTime"
                data-cy="startTime"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.studentQuiz.endTime')}
                id="student-quiz-endTime"
                name="endTime"
                data-cy="endTime"
                type="datetime-local"
                placeholder="YYYY-MM-DD HH:mm"
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.studentQuiz.score')}
                id="student-quiz-score"
                name="score"
                data-cy="score"
                type="text"
              />
              <ValidatedField
                label={translate('onlineSatoriPlatformApp.studentQuiz.completed')}
                id="student-quiz-completed"
                name="completed"
                data-cy="completed"
                check
                type="checkbox"
              />
              <ValidatedField
                id="student-quiz-quiz"
                name="quiz"
                data-cy="quiz"
                label={translate('onlineSatoriPlatformApp.studentQuiz.quiz')}
                type="select"
              >
                <option value="" key="0" />
                {quizzes
                  ? quizzes.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <ValidatedField
                id="student-quiz-student"
                name="student"
                data-cy="student"
                label={translate('onlineSatoriPlatformApp.studentQuiz.student')}
                type="select"
              >
                <option value="" key="0" />
                {userProfiles
                  ? userProfiles.map(otherEntity => (
                      <option value={otherEntity.id} key={otherEntity.id}>
                        {otherEntity.id}
                      </option>
                    ))
                  : null}
              </ValidatedField>
              <Button tag={Link} id="cancel-save" data-cy="entityCreateCancelButton" to="/student-quiz" replace color="info">
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

export default StudentQuizUpdate;
