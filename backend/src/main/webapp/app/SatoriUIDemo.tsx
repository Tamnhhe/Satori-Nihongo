import React, { useState } from 'react';
import TeacherDashboard from './modules/teacher/teacher-dashboard';
import ScheduleManagement from './modules/teacher/schedule-management';
import StudentProgressTracker from './modules/teacher/student-progress-tracker';
import LessonLibrary from './modules/teacher/lesson-library';
import AdminAnalytics from './modules/admin/admin-analytics';
import Navigation from './shared/components/layout/Navigation';
import { Button } from './shared/components/ui';

/**
 * Demo application showcasing the improved Satori admin/teacher UI
 */
const SatoriUIDemo: React.FC = () => {
  const [userRole, setUserRole] = useState<'admin' | 'teacher'>('teacher');
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    if (userRole === 'admin') {
      switch (currentPage) {
        case 'analytics':
          return <AdminAnalytics />;
        default:
          return <AdminAnalytics />;
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return <TeacherDashboard />;
      case 'schedule':
        return <ScheduleManagement />;
      case 'students':
        return <StudentProgressTracker />;
      case 'lessons':
        return <LessonLibrary />;
      default:
        return <TeacherDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Controls */}
      <div className="fixed top-4 right-4 z-50 bg-white rounded-lg shadow-lg p-4 border border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Demo Mode</div>
        <div className="flex gap-2">
          <Button size="sm" variant={userRole === 'teacher' ? 'primary' : 'outline'} onClick={() => setUserRole('teacher')}>
            Teacher
          </Button>
          <Button size="sm" variant={userRole === 'admin' ? 'primary' : 'outline'} onClick={() => setUserRole('admin')}>
            Admin
          </Button>
        </div>
      </div>

      <div className="flex h-screen">
        {/* Navigation */}
        <Navigation userRole={userRole} currentPage={currentPage} onNavigate={setCurrentPage} userName="Demo User" notifications={3} />

        {/* Main Content */}
        <main className="flex-1 lg:ml-64">
          <div className="p-4 lg:p-8">{renderPage()}</div>
        </main>
      </div>
    </div>
  );
};

export default SatoriUIDemo;
