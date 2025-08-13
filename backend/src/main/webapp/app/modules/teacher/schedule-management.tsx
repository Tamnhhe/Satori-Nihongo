import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCalendarWeek,
  faList,
  faPlus,
  faVideo,
  faUsers,
  faClock,
  faMapMarkerAlt,
  faFilter,
  faSearch,
  faChevronLeft,
  faChevronRight,
} from '@fortawesome/free-solid-svg-icons';
import { Button, LoadingSpinner } from '../../shared/components/ui';
import { mockClasses, mockSchedule } from '../../shared/data/mockData';

interface ScheduleManagementProps {
  className?: string;
}

type ViewMode = 'calendar' | 'list';

const ScheduleManagement: React.FC<ScheduleManagementProps> = ({ className = '' }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [scheduleData, setScheduleData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    const loadScheduleData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));

      setScheduleData({
        upcomingClasses: mockClasses,
        weeklySchedule: mockSchedule,
        timeSlots: generateTimeSlots(),
      });
      setLoading(false);
    };

    loadScheduleData();
  }, []);

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 20; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
    }
    return slots;
  };

  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
    startOfWeek.setDate(diff);

    for (let i = 0; i < 7; i++) {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + i);
      week.push(currentDay);
    }
    return week;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentDate(newDate);
  };

  const filteredClasses =
    scheduleData?.upcomingClasses.filter((classItem: any) => {
      const matchesSearch =
        classItem.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        classItem.teacher.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesFilter = filterStatus === 'all' || classItem.status === filterStatus;
      return matchesSearch && matchesFilter;
    }) || [];

  if (loading) {
    return (
      <div className={`min-h-screen bg-gray-50 ${className}`}>
        <div className="container mx-auto px-4 py-8">
          <LoadingSpinner size="lg" className="h-64" />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-white rounded-lg p-6 shadow-soft">
            <div className="mb-4 lg:mb-0">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Schedule Management</h1>
              <p className="text-gray-600">Manage your classes and appointments</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex rounded-lg border border-gray-300 overflow-hidden">
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'calendar' ? 'bg-primary-400 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faCalendarWeek} className="mr-2" />
                  Calendar
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    viewMode === 'list' ? 'bg-primary-400 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FontAwesomeIcon icon={faList} className="mr-2" />
                  List
                </button>
              </div>

              <Button icon={faPlus} onClick={() => console.warn('Schedule new class')}>
                Schedule Class
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-soft">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search classes, teachers..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={faFilter} className="text-gray-400 w-4 h-4" />
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="scheduled">Scheduled</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            {/* Calendar Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigateWeek('prev')}
                  className="p-2 text-gray-600 hover:text-primary-400 transition-colors"
                  aria-label="Previous week"
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                >
                  Today
                </button>
                <button
                  onClick={() => navigateWeek('next')}
                  className="p-2 text-gray-600 hover:text-primary-400 transition-colors"
                  aria-label="Next week"
                >
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>

            {/* Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Days Header */}
                <div className="grid grid-cols-8 border-b border-gray-200">
                  <div className="p-4 text-sm font-medium text-gray-600">Time</div>
                  {getWeekDays(currentDate).map((day, index) => (
                    <div key={index} className="p-4 text-center border-l border-gray-200">
                      <div className="text-sm font-medium text-gray-900">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div className="text-lg font-semibold text-gray-700 mt-1">{day.getDate()}</div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                <div className="divide-y divide-gray-200">
                  {scheduleData.timeSlots.map((timeSlot: string) => (
                    <div key={timeSlot} className="grid grid-cols-8 h-16">
                      <div className="p-4 text-sm text-gray-600 border-r border-gray-200">{timeSlot}</div>
                      {getWeekDays(currentDate).map((day, dayIndex) => (
                        <div key={dayIndex} className="border-l border-gray-200 p-2 relative">
                          {/* Render classes for this time slot and day */}
                          {filteredClasses
                            .filter((classItem: any) => {
                              const classDate = new Date(classItem.nextSession);
                              const classTime = formatTime(classItem.nextSession);
                              return classDate.toDateString() === day.toDateString() && classTime.startsWith(timeSlot.substring(0, 2));
                            })
                            .map((classItem: any) => (
                              <div
                                key={classItem.id}
                                className="bg-primary-100 border-l-4 border-primary-400 rounded p-2 text-xs mb-1 cursor-pointer hover:bg-primary-200 transition-colors"
                                onClick={() => console.warn('Class details', classItem)}
                              >
                                <div className="font-medium text-primary-900 truncate">{classItem.name}</div>
                                <div className="text-primary-700 flex items-center mt-1">
                                  <FontAwesomeIcon icon={faUsers} className="w-3 h-3 mr-1" />
                                  {classItem.students}
                                </div>
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="bg-white rounded-lg shadow-soft">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredClasses.map((classItem: any) => (
                <div key={classItem.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex items-start lg:items-center mb-4 lg:mb-0">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                        <FontAwesomeIcon icon={faVideo} className="w-5 h-5 text-primary-400" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{classItem.name}</h3>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-1" />
                            {formatTime(classItem.nextSession)} • {classItem.duration}
                          </div>
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-1" />
                            {classItem.students}/{classItem.capacity} students
                          </div>
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="w-4 h-4 mr-1" />
                            {classItem.level}
                          </div>
                        </div>

                        <div className="mt-2">
                          <span className="text-sm text-gray-700">
                            Teacher: <span className="font-medium">{classItem.teacher}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          classItem.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {classItem.status}
                      </span>

                      <Button size="sm" icon={faVideo} onClick={() => window.open(classItem.meetingUrl, '_blank')}>
                        Join Class
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleManagement;
