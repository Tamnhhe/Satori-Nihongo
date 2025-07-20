import React, { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Button, Col, Row } from 'reactstrap';
import { TextFormat, Translate } from 'react-jhipster';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { APP_DATE_FORMAT } from 'app/config/constants';
import { useAppDispatch, useAppSelector } from 'app/config/store';

import { getEntity } from './schedule.reducer';

export const ScheduleDetail = () => {
  const dispatch = useAppDispatch();

  const { id } = useParams<'id'>();

  useEffect(() => {
    dispatch(getEntity(id));
  }, []);

  const scheduleEntity = useAppSelector(state => state.schedule.entity);
  return (
    <Row>
      <Col md="8">
        <h2 data-cy="scheduleDetailsHeading">
          <Translate contentKey="onlineSatoriPlatformApp.schedule.detail.title">Schedule</Translate>
        </h2>
        <dl className="jh-entity-details">
          <dt>
            <span id="id">
              <Translate contentKey="global.field.id">ID</Translate>
            </span>
          </dt>
          <dd>{scheduleEntity.id}</dd>
          <dt>
            <span id="date">
              <Translate contentKey="onlineSatoriPlatformApp.schedule.date">Date</Translate>
            </span>
          </dt>
          <dd>{scheduleEntity.date ? <TextFormat value={scheduleEntity.date} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="startTime">
              <Translate contentKey="onlineSatoriPlatformApp.schedule.startTime">Start Time</Translate>
            </span>
          </dt>
          <dd>{scheduleEntity.startTime ? <TextFormat value={scheduleEntity.startTime} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="endTime">
              <Translate contentKey="onlineSatoriPlatformApp.schedule.endTime">End Time</Translate>
            </span>
          </dt>
          <dd>{scheduleEntity.endTime ? <TextFormat value={scheduleEntity.endTime} type="date" format={APP_DATE_FORMAT} /> : null}</dd>
          <dt>
            <span id="location">
              <Translate contentKey="onlineSatoriPlatformApp.schedule.location">Location</Translate>
            </span>
          </dt>
          <dd>{scheduleEntity.location}</dd>
          <dt>
            <Translate contentKey="onlineSatoriPlatformApp.schedule.course">Course</Translate>
          </dt>
          <dd>{scheduleEntity.course ? scheduleEntity.course.id : ''}</dd>
        </dl>
        <Button tag={Link} to="/schedule" replace color="info" data-cy="entityDetailsBackButton">
          <FontAwesomeIcon icon="arrow-left" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.back">Back</Translate>
          </span>
        </Button>
        &nbsp;
        <Button tag={Link} to={`/schedule/${scheduleEntity.id}/edit`} replace color="primary">
          <FontAwesomeIcon icon="pencil-alt" />{' '}
          <span className="d-none d-md-inline">
            <Translate contentKey="entity.action.edit">Edit</Translate>
          </span>
        </Button>
      </Col>
    </Row>
  );
};

export default ScheduleDetail;
