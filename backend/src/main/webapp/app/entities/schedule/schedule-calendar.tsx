import React, { useState, useEffect } from 'react';
import { Button, Card, CardBody, CardHeader, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight, faVideo, faCalendarWeek, faCalendar, faList } from '@fortawesome/free-solid-svg-icons';
import { Translate } from 'react-jhipster';
import './schedule-calendar.scss';

export interface IScheduleCalendarProps {
  schedules: any[];
  onScheduleClick?: (schedule: any) => void;
  onMeetClick?: (meetLink: string) => void;
  viewMode?: 'month' | 'week' | 'list';
  onViewModeChange?: (mode: 'month' | 'week' | 'list') => void;
}

export const ScheduleCalendar = (props: IScheduleCalendarProps) => {
  const { schedules, onScheduleClick, onMeetClick, viewMode = 'month', onViewModeChange } = props;

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Get start of month for calendar grid
  const getStartOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  // Get start of week for calendar grid (Monday as first day)
  const getStartOfWeek = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Adjust for Monday start
    return new Date(start.setDate(diff));
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    if (viewMode === 'week') {
      return generateWeekDays();
    }
    return generateMonthDays();
  };

  const generateMonthDays = () => {
    const startOfMonth = getStartOfMonth(currentDate);
    const startOfWeek = getStartOfWeek(startOfMonth);
    const days = [];

    for (let i = 0; i < 42; i++) {
      // 6 weeks * 7 days
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }

    return days;
  };

  const generateWeekDays = () => {
    const startOfWeek = getStartOfWeek(currentDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      days.push(date);
    }

    return days;
  };

  // Get schedules for a specific date
  const getSchedulesForDate = (date: Date) => {
    return schedules.filter(schedule => {
      const scheduleDate = new Date(schedule.date);
      return (
        scheduleDate.getFullYear() === date.getFullYear() &&
        scheduleDate.getMonth() === date.getMonth() &&
        scheduleDate.getDate() === date.getDate()
      );
    });
  };

  // Navigation functions
  const navigatePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Format functions
  const formatMonth = (date: Date) => {
    return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
  };

  const formatWeek = (date: Date) => {
    const startOfWeek = getStartOfWeek(date);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return `${startOfWeek.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} - ${endOfWeek.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })}`;
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getFullYear() === today.getFullYear() && date.getMonth() === today.getMonth() && date.getDate() === today.getDate();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const handleMeetClick = (e: React.MouseEvent, meetLink: string) => {
    e.stopPropagation();
    if (onMeetClick) {
      onMeetClick(meetLink);
    } else {
      window.open(meetLink, '_blank', 'noopener,noreferrer');
    }
  };

  const renderCalendarHeader = () => (
    <div className="calendar-header d-flex justify-content-between align-items-center mb-3">
      <div className="d-flex align-items-center">
        <Button color="link" onClick={navigatePrevious} className="p-1 me-2">
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
        <h4 className="mb-0 me-2">{viewMode === 'month' ? formatMonth(currentDate) : formatWeek(currentDate)}</h4>
        <Button color="link" onClick={navigateNext} className="p-1 me-3">
          <FontAwesomeIcon icon={faChevronRight} />
        </Button>
        <Button color="secondary" size="sm" onClick={goToToday}>
          Hôm nay
        </Button>
      </div>

      <div className="view-toggle">
        <Button
          color={viewMode === 'month' ? 'primary' : 'outline-primary'}
          size="sm"
          onClick={() => onViewModeChange?.('month')}
          className="me-1"
        >
          <FontAwesomeIcon icon={faCalendar} /> Tháng
        </Button>
        <Button
          color={viewMode === 'week' ? 'primary' : 'outline-primary'}
          size="sm"
          onClick={() => onViewModeChange?.('week')}
          className="me-1"
        >
          <FontAwesomeIcon icon={faCalendarWeek} /> Tuần
        </Button>
        <Button color={viewMode === 'list' ? 'primary' : 'outline-primary'} size="sm" onClick={() => onViewModeChange?.('list')}>
          <FontAwesomeIcon icon={faList} /> Danh sách
        </Button>
      </div>
    </div>
  );

  const renderWeekHeader = () => (
    <div className="week-header">
      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
        <div key={day} className="week-day-header">
          {day}
        </div>
      ))}
    </div>
  );

  const renderCalendarGrid = () => {
    const days = generateCalendarDays();

    return (
      <div className={`calendar-grid ${viewMode}`}>
        {days.map((date, index) => {
          const daySchedules = getSchedulesForDate(date);
          const isCurrentMonthDate = isCurrentMonth(date);
          const isTodayDate = isToday(date);

          return (
            <div
              key={index}
              className={`calendar-day ${!isCurrentMonthDate ? 'other-month' : ''} ${isTodayDate ? 'today' : ''}`}
              onClick={() => setSelectedDate(date)}
            >
              <div className="day-number">{date.getDate()}</div>

              <div className="day-schedules">
                {daySchedules.slice(0, viewMode === 'week' ? 10 : 3).map((schedule, i) => (
                  <div
                    key={schedule.id}
                    className="schedule-item"
                    onClick={e => {
                      e.stopPropagation();
                      onScheduleClick?.(schedule);
                    }}
                  >
                    <div className="schedule-time">
                      {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                    </div>
                    <div className="schedule-info d-flex justify-content-between align-items-center">
                      <span className="schedule-location">{schedule.location || 'Online'}</span>
                      {schedule.meetLink && (
                        <Button
                          color="success"
                          size="sm"
                          className="meet-btn"
                          onClick={e => handleMeetClick(e, schedule.meetLink)}
                          title="Join Google Meet"
                        >
                          <FontAwesomeIcon icon={faVideo} />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {daySchedules.length > (viewMode === 'week' ? 10 : 3) && (
                  <div className="more-schedules">+{daySchedules.length - (viewMode === 'week' ? 10 : 3)} thêm</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderListView = () => (
    <div className="schedule-list-view">
      {schedules
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(schedule => (
          <Card key={schedule.id} className="mb-3 schedule-card">
            <CardBody className="d-flex justify-content-between align-items-center">
              <div className="schedule-details">
                <h6 className="mb-1">
                  {new Date(schedule.date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </h6>
                <div className="text-muted mb-2">
                  {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}
                </div>
                <div className="text-muted">
                  <strong>Địa điểm:</strong> {schedule.location || 'Online'}
                </div>
                {schedule.course && (
                  <Badge color="info" className="mt-1">
                    Khóa học #{schedule.course.id}
                  </Badge>
                )}
              </div>

              {schedule.meetLink && (
                <Button color="success" onClick={e => handleMeetClick(e, schedule.meetLink)}>
                  <FontAwesomeIcon icon={faVideo} /> Join Google Meet
                </Button>
              )}
            </CardBody>
          </Card>
        ))}
    </div>
  );

  return (
    <div className="schedule-calendar">
      {renderCalendarHeader()}

      {viewMode === 'list' ? (
        renderListView()
      ) : (
        <>
          {renderWeekHeader()}
          {renderCalendarGrid()}
        </>
      )}
    </div>
  );
};
