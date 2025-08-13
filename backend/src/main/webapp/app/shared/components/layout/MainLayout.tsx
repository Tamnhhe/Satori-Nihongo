import React, { useState } from 'react';
import Navigation from './Navigation';
import TeacherDashboard from '../../../modules/teacher/teacher-dashboard';
import ScheduleManagement from '../../../modules/teacher/schedule-management';
import StudentProgressTracker from '../../../modules/teacher/student-progress-tracker';
import LessonLibrary from '../../../modules/teacher/lesson-library';
import AdminAnalytics from '../../../modules/admin/admin-analytics';

interface MainLayoutProps {
  userRole?: 'admin' | 'teacher' | 'student';
  initialPage?: string;
}

const MainLayout: React.FC<MainLayoutProps> = ({ userRole = 'teacher', initialPage = 'dashboard' }) => {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Mock user data - in real app this would come from authentication context
  const mockUser = {
    name: userRole === 'admin' ? 'Admin User' : 'Tanaka Hiroshi',
    avatar: userRole === 'admin' ? '/images/admin.jpg' : '/images/teachers/hiroshi.jpg',
    notifications: 3,
  };

  const renderCurrentPage = () => {
    if (userRole === 'admin') {
      switch (currentPage) {
        case 'dashboard':
          return <AdminAnalytics />;
        case 'analytics':
          return <AdminAnalytics />;
        case 'users':
          return <div className="p-8 text-center">User Management Component (Coming Soon)</div>;
        case 'courses':
          return <div className="p-8 text-center">Course Management Component (Coming Soon)</div>;
        case 'teachers':
          return <div className="p-8 text-center">Teacher Management Component (Coming Soon)</div>;
        default:
          return <AdminAnalytics />;
      }
    }

    if (userRole === 'teacher') {
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
    }

    // Default fallback
    return <TeacherDashboard />;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <Navigation
        userRole={userRole}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        userName={mockUser.name}
        userAvatar={mockUser.avatar}
        notifications={mockUser.notifications}
      />

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="min-h-screen">{renderCurrentPage()}</main>
      </div>
    </div>
  );
};

export default MainLayout;
