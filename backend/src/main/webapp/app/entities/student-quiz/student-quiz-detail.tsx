import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './student-quiz.reducer';

export const StudentQuizDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const studentQuizEntity = useAppSelector(state => state.studentQuiz.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="studentQuizDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.studentQuiz.detail.title">StudentQuiz</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{studentQuizEntity.id}</dd>
          <dt>
            <span id="startTime">
              <Translate contentKey="onlineSatoriPlatformApp.studentQuiz.startTime">Start Time</Translate>
            </span>
          </dt>
          <dd>
            {studentQuizEntity.startTime ? <TextFormat value={studentQuizEntity.startTime} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="endTime">
              <Translate contentKey="onlineSatoriPlatformApp.studentQuiz.endTime">End Time</Translate>
            </span>
          </dt>
          <dd>
            {studentQuizEntity.endTime ? <TextFormat value={studentQuizEntity.endTime} type="date" format={APP_DATE_FORMAT} /> : null}
          </dd>
          <dt>
            <span id="score">
              <Translate contentKey="onlineSatoriPlatformApp.studentQuiz.score">Score</Translate>
            </span>
          </dt>
          <dd>{studentQuizEntity.score}</dd>
          <dt>
            <span id="completed">
              <Translate contentKey="onlineSatoriPlatformApp.studentQuiz.completed">Completed</Translate>
            </span>
          </dt>
          <dd>{studentQuizEntity.completed ? 'true' : 'false'}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.studentQuiz.quiz">Quiz</Translate>
          </dt>
          <dd>{studentQuizEntity.quiz ? studentQuizEntity.quiz.id : ''}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.studentQuiz.student">Student</Translate>
          </dt>
          <dd>{studentQuizEntity.student ? studentQuizEntity.student.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/student-quiz" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/student-quiz/${studentQuizEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default StudentQuizDetail;
