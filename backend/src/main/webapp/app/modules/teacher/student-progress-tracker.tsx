import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faChartLine,
  faAward,
  faClock,
  faBookOpen,
  faSearch,
  faFilter,
  faDownload,
  faSortAmountDown,
  faStar,
  faFire,
  faCalendarAlt,
} from '@fortawesome/free-solid-svg-icons';
import { Button, StatCard, LoadingSpinner } from '../../shared/components/ui';
import { mockStudents, mockCourses } from '../../shared/data/mockData';

interface StudentProgressTrackerProps {
  className?: string;
}

const StudentProgressTracker: React.FC<StudentProgressTrackerProps> = ({ className = '' }) => {
  const [loading, setLoading] = useState(true);
  const [studentsData, setStudentsData] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [sortBy, setSortBy] = useState('progress');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const loadStudentsData = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate extended mock data
      const extendedStudents = [
        ...mockStudents,
        {
          id: 3,
          name: 'Sarah Thompson',
          email: 'sarah.thompson@email.com',
          avatar: '/images/students/sarah.jpg',
          level: 'N5',
          enrolledCourses: 2,
          completedLessons: 23,
          totalStudyTime: '34h 45m',
          streak: 7,
          lastActivity: '2024-08-10T18:20:00Z',
          progress: 45,
          status: 'active',
          joinedDate: '2024-03-20',
        },
        {
          id: 4,
          name: 'Alex Rodriguez',
          email: 'alex.rodriguez@email.com',
          avatar: '/images/students/alex.jpg',
          level: 'N2',
          enrolledCourses: 4,
          completedLessons: 156,
          totalStudyTime: '245h 30m',
          streak: 45,
          lastActivity: '2024-08-11T07:00:00Z',
          progress: 95,
          status: 'active',
          joinedDate: '2023-08-15',
        },
        {
          id: 5,
          name: 'Lisa Wang',
          email: 'lisa.wang@email.com',
          avatar: '/images/students/lisa.jpg',
          level: 'N4',
          enrolledCourses: 3,
          completedLessons: 67,
          totalStudyTime: '89h 15m',
          streak: 18,
          lastActivity: '2024-08-09T20:30:00Z',
          progress: 72,
          status: 'inactive',
          joinedDate: '2024-01-10',
        },
      ];

      setStudentsData({
        students: extendedStudents,
        summary: {
          totalStudents: extendedStudents.length,
          activeStudents: extendedStudents.filter(s => s.status === 'active').length,
          averageProgress: Math.round(extendedStudents.reduce((acc, s) => acc + s.progress, 0) / extendedStudents.length),
          totalStudyHours: extendedStudents.reduce((acc, s) => acc + parseFloat(s.totalStudyTime.split('h')[0]), 0),
        },
      });
      setLoading(false);
    };

    loadStudentsData();
  }, []);

  const filteredAndSortedStudents = React.useMemo(() => {
    if (!studentsData) return [];

    const filtered = studentsData.students.filter((student: any) => {
      const matchesSearch =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLevel = filterLevel === 'all' || student.level === filterLevel;
      return matchesSearch && matchesLevel;
    });

    return filtered.sort((a: any, b: any) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'name':
          aValue = a.name;
          bValue = b.name;
          break;
        case 'progress':
          aValue = a.progress;
          bValue = b.progress;
          break;
        case 'streak':
          aValue = a.streak;
          bValue = b.streak;
          break;
        case 'studyTime':
          aValue = parseFloat(a.totalStudyTime.split('h')[0]);
          bValue = parseFloat(b.totalStudyTime.split('h')[0]);
          break;
        case 'lastActivity':
          aValue = new Date(a.lastActivity).getTime();
          bValue = new Date(b.lastActivity).getTime();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }, [studentsData, searchQuery, filterLevel, sortBy, sortOrder]);

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-primary-400';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return 'text-orange-600';
    if (streak >= 14) return 'text-primary-400';
    if (streak >= 7) return 'text-green-600';
    return 'text-gray-600';
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
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Student Progress Tracker</h1>
                <p className="text-gray-600">Monitor and analyze your students&apos; learning journey</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-4 lg:mt-0">
                <Button variant="outline" icon={faDownload} onClick={() => console.warn('Export progress report')}>
                  Export Report
                </Button>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Students" value={studentsData.summary.totalStudents} icon={faUser} color="primary" />
              <StatCard
                title="Active Students"
                value={studentsData.summary.activeStudents}
                icon={faChartLine}
                color="success"
                subtitle={`${Math.round((studentsData.summary.activeStudents / studentsData.summary.totalStudents) * 100)}% active`}
              />
              <StatCard title="Avg Progress" value={`${studentsData.summary.averageProgress}%`} icon={faAward} color="warning" />
              <StatCard
                title="Total Study Hours"
                value={studentsData.summary.totalStudyHours}
                icon={faClock}
                color="secondary"
                subtitle="This month"
              />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 bg-white rounded-lg p-4 shadow-soft">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search students by name or email..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faFilter} className="text-gray-400 w-4 h-4" />
                <select
                  value={filterLevel}
                  onChange={e => setFilterLevel(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                >
                  <option value="all">All Levels</option>
                  <option value="N5">N5 (Beginner)</option>
                  <option value="N4">N4 (Elementary)</option>
                  <option value="N3">N3 (Intermediate)</option>
                  <option value="N2">N2 (Upper Intermediate)</option>
                  <option value="N1">N1 (Advanced)</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faSortAmountDown} className="text-gray-400 w-4 h-4" />
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={e => {
                    const [field, order] = e.target.value.split('-');
                    setSortBy(field);
                    setSortOrder(order as 'asc' | 'desc');
                  }}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                >
                  <option value="progress-desc">Progress (High to Low)</option>
                  <option value="progress-asc">Progress (Low to High)</option>
                  <option value="name-asc">Name (A to Z)</option>
                  <option value="name-desc">Name (Z to A)</option>
                  <option value="streak-desc">Streak (High to Low)</option>
                  <option value="studyTime-desc">Study Time (High to Low)</option>
                  <option value="lastActivity-desc">Recently Active</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-lg shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Courses</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Study Time</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Streak</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Last Activity</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedStudents.map((student: any) => (
                  <tr
                    key={student.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => console.warn('View student details', student)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-full bg-gray-200 mr-4"
                          onError={e => {
                            e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&background=e2e8f0&color=475569&size=40`;
                          }}
                        />
                        <div>
                          <div className="text-sm font-medium text-gray-900">{student.name}</div>
                          <div className="text-sm text-gray-500">{student.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                        {student.level}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <span className="text-sm font-medium text-gray-900 mr-2">{student.progress}%</span>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(student.progress)}`}
                            style={{ width: `${student.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <FontAwesomeIcon icon={faBookOpen} className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{student.enrolledCourses}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <FontAwesomeIcon icon={faClock} className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-900">{student.totalStudyTime}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <FontAwesomeIcon icon={faFire} className={`w-4 h-4 mr-1 ${getStreakColor(student.streak)}`} />
                        <span className={`text-sm font-medium ${getStreakColor(student.streak)}`}>{student.streak}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end">
                        <FontAwesomeIcon icon={faCalendarAlt} className="w-4 h-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-500">{formatLastActivity(student.lastActivity)}</span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredAndSortedStudents.length === 0 && (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faUser} className="w-12 h-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No students found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProgressTracker;
