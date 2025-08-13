import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChartLine,
  faUsers,
  faDollarSign,
  faGraduationCap,
  faArrowUp,
  faArrowDown,
  faDownload,
  faCalendarAlt,
  faTrophy,
  faBookOpen,
  faUserGraduate,
  faClock,
  faStar,
} from '@fortawesome/free-solid-svg-icons';
import { Button, StatCard, LoadingSpinner } from '../../shared/components/ui';
import { mockAnalytics, mockTeachers } from '../../shared/data/mockData';

interface AdminAnalyticsProps {
  className?: string;
}

const AdminAnalytics: React.FC<AdminAnalyticsProps> = ({ className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    const loadAnalyticsData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1200));

      const data = {
        revenue: {
          current: 145600,
          previous: 134500,
          growth: 8.2,
          coursesSold: 423,
          subscriptions: 1234,
        },
        users: {
          totalStudents: 1934,
          activeStudents: 1687,
          newStudents: 156,
          studentGrowth: 12.5,
          totalTeachers: 47,
          activeTeachers: 42,
          newTeachers: 3,
          teacherGrowth: 6.8,
        },
        engagement: {
          averageSessionTime: '24.5m',
          completionRate: 78,
          lessonViews: 12450,
          quizCompleted: 3240,
        },
        topCourses: [
          {
            id: 1,
            title: 'Japanese for Beginners',
            revenue: 45200,
            students: 234,
            rating: 4.8,
            growth: 15.2,
          },
          {
            id: 2,
            title: 'Business Japanese',
            revenue: 38900,
            students: 89,
            rating: 4.9,
            growth: 22.1,
          },
          {
            id: 3,
            title: 'JLPT N3 Preparation',
            revenue: 32400,
            students: 156,
            rating: 4.7,
            growth: -3.5,
          },
          {
            id: 4,
            title: 'Kanji Mastery',
            revenue: 28900,
            students: 123,
            rating: 4.5,
            growth: 8.7,
          },
        ],
        topTeachers: mockTeachers.map(teacher => ({
          ...teacher,
          revenue: Math.floor(Math.random() * 20000) + 15000,
          growth: Math.random() * 30 - 10,
        })),
        chartData: mockAnalytics.userGrowth,
      };

      setAnalyticsData(data);
      setLoading(false);
    };

    loadAnalyticsData();
  }, [timeRange]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
  };

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? faArrowUp : faArrowDown;
  };

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? 'text-green-600' : 'text-red-600';
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
        <div className="mb-6">
          <div className="bg-white rounded-lg p-6 shadow-soft">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
                <p className="text-gray-600">Monitor platform performance and key metrics</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <select
                  value={timeRange}
                  onChange={e => setTimeRange(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                >
                  <option value="7days">Last 7 days</option>
                  <option value="30days">Last 30 days</option>
                  <option value="90days">Last 90 days</option>
                  <option value="1year">Last year</option>
                </select>

                <Button variant="outline" icon={faDownload} onClick={() => console.warn('Export analytics report')}>
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={formatCurrency(analyticsData.revenue.current)}
            icon={faDollarSign}
            color="success"
            trend={{
              value: analyticsData.revenue.growth,
              label: 'vs last month',
              direction: analyticsData.revenue.growth >= 0 ? 'up' : 'down',
            }}
            subtitle={`${analyticsData.revenue.coursesSold} courses sold`}
          />
          <StatCard
            title="Total Students"
            value={analyticsData.users.totalStudents}
            icon={faUsers}
            color="primary"
            trend={{
              value: analyticsData.users.studentGrowth,
              label: 'vs last month',
              direction: 'up',
            }}
            subtitle={`${analyticsData.users.newStudents} new this month`}
          />
          <StatCard
            title="Active Teachers"
            value={analyticsData.users.activeTeachers}
            icon={faGraduationCap}
            color="secondary"
            trend={{
              value: analyticsData.users.teacherGrowth,
              label: 'vs last month',
              direction: 'up',
            }}
            subtitle={`${analyticsData.users.newTeachers} new this month`}
          />
          <StatCard
            title="Completion Rate"
            value={`${analyticsData.engagement.completionRate}%`}
            icon={faTrophy}
            color="warning"
            subtitle="Average across all courses"
          />
        </div>

        {/* Charts and Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* User Growth Chart */}
          <div className="bg-white rounded-lg shadow-soft p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">User Growth</h2>
              <div className="flex items-center text-sm text-gray-500">
                <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 mr-1" />
                {timeRange.replace('days', ' days').replace('year', ' year')}
              </div>
            </div>

            <div className="h-64 flex items-end justify-between space-x-2">
              {analyticsData.chartData.map((data: any, index: number) => (
                <div key={`chart-data-${data.month || index}`} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-t relative flex flex-col-reverse">
                    <div
                      className="bg-primary-400 rounded-t transition-all duration-500"
                      style={{ height: `${(data.students / Math.max(...analyticsData.chartData.map((d: any) => d.students))) * 200}px` }}
                    ></div>
                    <div
                      className="bg-secondary-900 rounded-t transition-all duration-500"
                      style={{ height: `${(data.teachers / Math.max(...analyticsData.chartData.map((d: any) => d.teachers))) * 200}px` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-center">
                    <div className="font-medium text-gray-900">{data.month}</div>
                    <div className="text-gray-500">{data.students}s</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center space-x-6 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-primary-400 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Students</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-secondary-900 rounded mr-2"></div>
                <span className="text-sm text-gray-600">Teachers</span>
              </div>
            </div>
          </div>

          {/* Engagement Metrics */}
          <div className="bg-white rounded-lg shadow-soft p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">Engagement Metrics</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Average Session Time</div>
                  <div className="text-2xl font-bold text-gray-900">{analyticsData.engagement.averageSessionTime}</div>
                </div>
                <div className="w-16 h-16 bg-primary-50 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faClock} className="w-6 h-6 text-primary-400" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Lesson Views</div>
                  <div className="text-2xl font-bold text-gray-900">{analyticsData.engagement.lessonViews.toLocaleString()}</div>
                </div>
                <div className="w-16 h-16 bg-secondary-50 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faBookOpen} className="w-6 h-6 text-secondary-900" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-600">Quizzes Completed</div>
                  <div className="text-2xl font-bold text-gray-900">{analyticsData.engagement.quizCompleted.toLocaleString()}</div>
                </div>
                <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                  <FontAwesomeIcon icon={faUserGraduate} className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Performing Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Courses */}
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Performing Courses</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.topCourses.map((course: any, index: number) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className="w-2 h-8 bg-primary-400 rounded mr-3"
                            style={{ backgroundColor: `hsl(${index * 60}, 70%, 50%)` }}
                          ></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{course.title}</div>
                            <div className="flex items-center text-sm text-gray-500">
                              <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-yellow-400 mr-1" />
                              {course.rating}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(course.revenue)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">{course.students}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className={`text-sm font-medium flex items-center justify-end ${getGrowthColor(course.growth)}`}>
                          <FontAwesomeIcon icon={getGrowthIcon(course.growth)} className="w-3 h-3 mr-1" />
                          {formatPercentage(course.growth)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Teachers */}
          <div className="bg-white rounded-lg shadow-soft overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Top Teachers</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teacher</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Students</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {analyticsData.topTeachers.map((teacher: any) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-8 h-8 rounded-full bg-gray-200 mr-3"
                            onError={e => {
                              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(teacher.name)}&background=e2e8f0&color=475569&size=32`;
                            }}
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                            <div className="text-sm text-gray-500">{teacher.specialization}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(teacher.revenue)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="text-sm text-gray-900">{teacher.students}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end">
                          <FontAwesomeIcon icon={faStar} className="w-3 h-3 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-900">{teacher.rating}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
