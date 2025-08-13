import React, { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Button, Row, Col, Badge, Spinner, Alert } from 'reactstrap';
import { Translate, TextFormat } from 'react-jhipster';
import { useAppDispatch, useAppSelector } from 'app/config/store';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { APP_LOCAL_DATETIME_FORMAT, APP_LOCAL_DATE_FORMAT } from 'app/config/constants';
import { getClassSchedules, deleteClassSchedule } from './class-management.reducer';
import ClassScheduleModal from './class-schedule-modal';
import './class-schedule-calendar.scss';

interface ClassScheduleCalendarProps {
  classId: number;
  className: string;
  courseTitle: string;
}

const ClassScheduleCalendar: React.FC<ClassScheduleCalendarProps> = ({ classId, className, courseTitle }) => {
  const dispatch = useAppDispatch();

  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week');

  const { classSchedules, loading, totalItems, errorMessage } = useAppSelector(state => state.classManagement);

  useEffect(() => {
    dispatch(getClassSchedules({ classId, page: 0, size: 100 }));
  }, [dispatch, classId]);

  const handleCreateSchedule = () => {
    setSelectedSchedule(null);
    setIsEditMode(false);
    setShowScheduleModal(true);
  };

  const handleEditSchedule = (schedule: any) => {
    setSelectedSchedule(schedule);
    setIsEditMode(true);
    setShowScheduleModal(true);
  };

  const handleDeleteSchedule = (scheduleId: number) => {
    if (window.confirm('Are you sure you want to delete this schedule?')) {
      dispatch(deleteClassSchedule(scheduleId));
    }
  };

  const getWeekDates = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(startOfWeek);
      weekDay.setDate(startOfWeek.getDate() + i);
      week.push(weekDay);
    }
    return week;
  };

  const getSchedulesForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return classSchedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date).toISOString().split('T')[0];
      return scheduleDate === dateStr;
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  const navigateToToday = () => {
    setCurrentWeek(new Date());
  };

  const getScheduleStatusColor = (schedule: any) => {
    const now = new Date();
    const scheduleStart = new Date(schedule.startTime);
    const scheduleEnd = new Date(schedule.endTime);

    if (now > scheduleEnd) return 'secondary'; // Past
    if (now >= scheduleStart && now <= scheduleEnd) return 'success'; // Ongoing
    if (scheduleStart > now) return 'primary'; // Upcoming
    return 'light';
  };

  const weekDates = getWeekDates(currentWeek);
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card>
      <CardHeader>
        <Row className="align-items-center">
          <Col md={6}>
            <h5 className="mb-0">
              <FontAwesomeIcon icon="calendar" className="me-2" />
              <Translate contentKey="classManagement.schedule.title">Class Schedule</Translate>
            </h5>
            <small className="text-muted">
              {className} - {courseTitle}
            </small>
          </Col>
          <Col md={6} className="text-end">
            <div className="btn-group me-2">
              <Button color={viewMode === 'week' ? 'primary' : 'outline-primary'} size="sm" onClick={() => setViewMode('week')}>
                <FontAwesomeIcon icon="calendar-week" className="me-1" />
                <Translate contentKey="classManagement.schedule.weekView">Week</Translate>
              </Button>
              <Button color={viewMode === 'month' ? 'primary' : 'outline-primary'} size="sm" onClick={() => setViewMode('month')}>
                <FontAwesomeIcon icon="calendar-alt" className="me-1" />
                <Translate contentKey="classManagement.schedule.monthView">Month</Translate>
              </Button>
            </div>
            <Button color="primary" size="sm" onClick={handleCreateSchedule}>
              <FontAwesomeIcon icon="plus" className="me-1" />
              <Translate contentKey="classManagement.schedule.createSchedule">Create Schedule</Translate>
            </Button>
          </Col>
        </Row>
      </CardHeader>

      <CardBody>
        {errorMessage && (
          <Alert color="danger">
            <FontAwesomeIcon icon="exclamation-triangle" className="me-2" />
            {errorMessage}
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-4">
            <Spinner color="primary" />
          </div>
        ) : (
          <>
            {/* Week Navigation */}
            <Row className="mb-3">
              <Col className="d-flex justify-content-between align-items-center">
                <div className="btn-group">
                  <Button color="outline-secondary" size="sm" onClick={() => navigateWeek('prev')}>
                    <FontAwesomeIcon icon="chevron-left" />
                  </Button>
                  <Button color="outline-secondary" size="sm" onClick={navigateToToday}>
                    <Translate contentKey="classManagement.schedule.today">Today</Translate>
                  </Button>
                  <Button color="outline-secondary" size="sm" onClick={() => navigateWeek('next')}>
                    <FontAwesomeIcon icon="chevron-right" />
                  </Button>
                </div>
                <h6 className="mb-0">
                  <TextFormat value={weekDates[0]} type="date" format={APP_LOCAL_DATE_FORMAT} />
                  {' - '}
                  <TextFormat value={weekDates[6]} type="date" format={APP_LOCAL_DATE_FORMAT} />
                </h6>
                <div className="d-flex gap-2">
                  <Badge color="primary">
                    <FontAwesomeIcon icon="clock" className="me-1" />
                    Upcoming
                  </Badge>
                  <Badge color="success">
                    <FontAwesomeIcon icon="play" className="me-1" />
                    Ongoing
                  </Badge>
                  <Badge color="secondary">
                    <FontAwesomeIcon icon="check" className="me-1" />
                    Completed
                  </Badge>
                </div>
              </Col>
            </Row>

            {/* Calendar Grid */}
            <div className="class-schedule-calendar">
              <Row className="border-bottom pb-2 mb-2">
                {weekDays.map((day, index) => (
                  <Col key={day} className="text-center">
                    <strong>{day}</strong>
                    <div className="text-muted small">{weekDates[index].getDate()}</div>
                  </Col>
                ))}
              </Row>

              <Row>
                {weekDates.map((date, index) => {
                  const daySchedules = getSchedulesForDate(date);
                  const isToday = date.toDateString() === new Date().toDateString();

                  return (
                    <Col key={index} className={`schedule-day ${isToday ? 'today' : ''}`}>
                      <div className="day-schedules" style={{ minHeight: '200px', border: '1px solid #dee2e6', padding: '8px' }}>
                        {daySchedules.map(schedule => (
                          <div
                            key={schedule.id}
                            className={`schedule-item mb-2 p-2 border rounded schedule-${getScheduleStatusColor(schedule)}`}
                            style={{ cursor: 'pointer' }}
                            onClick={() => handleEditSchedule(schedule)}
                          >
                            <div className="d-flex justify-content-between align-items-start">
                              <div className="flex-grow-1">
                                <div className="fw-bold small">
                                  <TextFormat value={schedule.startTime} type="date" format="HH:mm" />
                                  {' - '}
                                  <TextFormat value={schedule.endTime} type="date" format="HH:mm" />
                                </div>
                                {schedule.location && (
                                  <div className="text-muted small">
                                    <FontAwesomeIcon icon="map-marker-alt" className="me-1" />
                                    {schedule.location}
                                  </div>
                                )}
                                {schedule.teacherName && (
                                  <div className="text-muted small">
                                    <FontAwesomeIcon icon="user" className="me-1" />
                                    {schedule.teacherName}
                                  </div>
                                )}
                                {schedule.isRecurring && (
                                  <div className="text-info small">
                                    <FontAwesomeIcon icon="repeat" className="me-1" />
                                    <Translate contentKey="classManagement.schedule.recurring">Recurring</Translate>
                                  </div>
                                )}
                                {schedule.hasConflicts && (
                                  <div className="text-warning small">
                                    <FontAwesomeIcon icon="exclamation-triangle" className="me-1" />
                                    <Translate contentKey="classManagement.schedule.hasConflicts">Conflicts</Translate>
                                  </div>
                                )}
                              </div>
                              <div className="dropdown">
                                <button
                                  className="btn btn-sm btn-outline-secondary dropdown-toggle"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  onClick={e => e.stopPropagation()}
                                >
                                  <FontAwesomeIcon icon="ellipsis-v" />
                                </button>
                                <ul className="dropdown-menu">
                                  <li>
                                    <button
                                      className="dropdown-item"
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleEditSchedule(schedule);
                                      }}
                                    >
                                      <FontAwesomeIcon icon="edit" className="me-2" />
                                      <Translate contentKey="entity.action.edit">Edit</Translate>
                                    </button>
                                  </li>
                                  {schedule.isRecurring && (
                                    <li>
                                      <button
                                        className="dropdown-item"
                                        onClick={e => {
                                          e.stopPropagation();
                                          // Handle edit series
                                        }}
                                      >
                                        <FontAwesomeIcon icon="calendar-alt" className="me-2" />
                                        <Translate contentKey="classManagement.schedule.editSeries">Edit Series</Translate>
                                      </button>
                                    </li>
                                  )}
                                  <li>
                                    <hr className="dropdown-divider" />
                                  </li>
                                  <li>
                                    <button
                                      className="dropdown-item text-danger"
                                      onClick={e => {
                                        e.stopPropagation();
                                        handleDeleteSchedule(schedule.id);
                                      }}
                                    >
                                      <FontAwesomeIcon icon="trash" className="me-2" />
                                      <Translate contentKey="entity.action.delete">Delete</Translate>
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                        ))}

                        {daySchedules.length === 0 && (
                          <div className="text-center text-muted py-4">
                            <small>
                              <Translate contentKey="classManagement.schedule.noSchedules">No schedules</Translate>
                            </small>
                          </div>
                        )}
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>

            {/* Schedule Statistics */}
            <Row className="mt-3">
              <Col>
                <div className="d-flex gap-3">
                  <Badge color="info">
                    <Translate contentKey="classManagement.schedule.totalSchedules">Total Schedules</Translate>: {totalItems}
                  </Badge>
                  <Badge color="success">
                    <Translate contentKey="classManagement.schedule.thisWeek">This Week</Translate>:{' '}
                    {weekDates.reduce((count, date) => count + getSchedulesForDate(date).length, 0)}
                  </Badge>
                  <Badge color="warning">
                    <Translate contentKey="classManagement.schedule.upcomingConflicts">Conflicts</Translate>:{' '}
                    {classSchedules.filter(s => s.hasConflicts).length}
                  </Badge>
                </div>
              </Col>
            </Row>
          </>
        )}
      </CardBody>

      {/* Schedule Modal */}
      <ClassScheduleModal
        isOpen={showScheduleModal}
        toggle={() => setShowScheduleModal(false)}
        classId={classId}
        className={className}
        courseTitle={courseTitle}
        schedule={selectedSchedule}
        isEdit={isEditMode}
      />
    </Card>
  );
};

export default ClassScheduleCalendar;
