import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUsers,
  faCalendarDay,
  faChartLine,
  faVideo,
  faBookOpen,
  faClipboardCheck,
  faClock,
  faArrowRight,
  faPlay,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { Button, StatCard, LoadingSpinner } from '../../shared/components/ui';
import { mockClasses, mockStudents, mockAnalytics } from '../../shared/data/mockData';

interface TeacherDashboardProps {
  teacherId?: number;
  className?: string;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ teacherId = 1, className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);

  // Simulate API call
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const data = {
        teacher: {
          name: 'Tanaka Hiroshi',
          avatar: '/images/teachers/hiroshi.jpg',
          greeting: getTimeBasedGreeting(),
        },
        stats: {
          activeStudents: 156,
          todayClasses: 3,
          weeklyProgress: 89,
          averageRating: 4.9,
        },
        upcomingClasses: mockClasses.slice(0, 3),
        recentStudentProgress: mockStudents.slice(0, 4),
        weeklyPerformance: mockAnalytics.coursePerformance.slice(0, 3),
      };

      setDashboardData(data);
      setLoading(false);
    };

    loadDashboardData();
  }, [teacherId]);

  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

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
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white rounded-lg p-6 shadow-soft">
            <div className="flex items-center mb-4 sm:mb-0">
              <img
                src={dashboardData.teacher.avatar}
                alt={dashboardData.teacher.name}
                className="w-12 h-12 rounded-full bg-gray-200 mr-4"
                onError={e => {
                  e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(dashboardData.teacher.name)}&background=f3aa1c&color=fff`;
                }}
              />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {dashboardData.teacher.greeting}, {dashboardData.teacher.name}!
                </h1>
                <p className="text-gray-600">Ready to inspire your students today?</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" icon={faCalendarDay} onClick={() => console.warn('View schedule')} className="w-full sm:w-auto">
                View Schedule
              </Button>
              <Button icon={faVideo} onClick={() => console.warn('Start class')} className="w-full sm:w-auto">
                Start Class
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Active Students"
            value={dashboardData.stats.activeStudents}
            icon={faUsers}
            color="primary"
            trend={{
              value: 12,
              label: 'vs last month',
              direction: 'up' as const,
            }}
          />
          <StatCard
            title="Today's Classes"
            value={dashboardData.stats.todayClasses}
            icon={faCalendarDay}
            color="secondary"
            subtitle="2 completed, 1 upcoming"
          />
          <StatCard
            title="Weekly Progress"
            value={`${dashboardData.stats.weeklyProgress}%`}
            icon={faChartLine}
            color="success"
            trend={{
              value: 5,
              label: 'vs last week',
              direction: 'up' as const,
            }}
          />
          <StatCard
            title="Average Rating"
            value={dashboardData.stats.averageRating}
            icon={faStar}
            color="warning"
            subtitle="Based on 89 reviews"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upcoming Classes */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Classes</h2>
                <Button variant="ghost" size="sm" icon={faArrowRight}>
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {dashboardData.upcomingClasses.map((classItem: any) => (
                  <div
                    key={classItem.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-400 transition-colors duration-250"
                  >
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center mr-4">
                        <FontAwesomeIcon icon={faVideo} className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{classItem.name}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FontAwesomeIcon icon={faClock} className="w-4 h-4 mr-1" />
                          {formatTime(classItem.nextSession)} • {classItem.duration}
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <FontAwesomeIcon icon={faUsers} className="w-4 h-4 mr-1" />
                          {classItem.students}/{classItem.capacity} students
                        </div>
                      </div>
                    </div>
                    <Button size="sm" icon={faPlay} onClick={() => window.open(classItem.meetingUrl, '_blank')}>
                      Join
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Actions & Student Progress */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Button variant="outline" fullWidth icon={faBookOpen} onClick={() => console.warn('Create lesson')}>
                  Create Lesson
                </Button>
                <Button variant="outline" fullWidth icon={faClipboardCheck} onClick={() => console.warn('Grade assignments')}>
                  Grade Assignments
                </Button>
                <Button variant="outline" fullWidth icon={faUsers} onClick={() => console.warn('View students')}>
                  View Students
                </Button>
              </div>
            </div>

            {/* Recent Student Progress */}
            <div className="bg-white rounded-lg shadow-soft p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Student Progress</h2>
                <Button variant="ghost" size="sm" icon={faArrowRight}>
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {dashboardData.recentStudentProgress.map((student: any) => (
                  <div key={student.id} className="flex items-center">
                    <img
                      src={student.avatar}
                      alt={student.name}
                      className="w-8 h-8 rounded-full bg-gray-200 mr-3"
                      onError={e => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=e2e8f0&color=475569&size=32`;
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{student.name}</p>
                      <div className="flex items-center mt-1">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div
                            className="bg-primary-400 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500">{student.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Performance Chart */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Weekly Performance</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardData.weeklyPerformance.map((course: any, index: number) => (
                <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{course.course}</h3>
                  <div className="text-2xl font-bold text-primary-400 mb-1">{course.completion}%</div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <div className="flex items-center justify-center mt-2">
                    <FontAwesomeIcon icon={faStar} className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm text-gray-600">{course.satisfaction}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDashboard;
