import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBars,
  faTimes,
  faHome,
  faCalendarAlt,
  faChartLine,
  faBookOpen,
  faUsers,
  faUser,
  faCog,
  faSignOutAlt,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import { Button } from '../ui';

interface NavigationProps {
  userRole: 'admin' | 'teacher' | 'student';
  currentPage: string;
  onNavigate: (page: string) => void;
  userName?: string;
  userAvatar?: string;
  notifications?: number;
}

const Navigation: React.FC<NavigationProps> = ({ userRole, currentPage, onNavigate, userName = 'User', userAvatar, notifications = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getNavigationItems = () => {
    const commonItems = [{ id: 'dashboard', label: 'Dashboard', icon: faHome }];

    if (userRole === 'admin') {
      return [
        ...commonItems,
        { id: 'analytics', label: 'Analytics', icon: faChartLine },
        { id: 'users', label: 'User Management', icon: faUsers },
        { id: 'courses', label: 'Course Management', icon: faBookOpen },
        { id: 'teachers', label: 'Teacher Management', icon: faUser },
      ];
    }

    if (userRole === 'teacher') {
      return [
        ...commonItems,
        { id: 'schedule', label: 'Schedule', icon: faCalendarAlt },
        { id: 'students', label: 'Student Progress', icon: faChartLine },
        { id: 'lessons', label: 'Lesson Library', icon: faBookOpen },
      ];
    }

    return commonItems;
  };

  const navigationItems = getNavigationItems();

  const NavItem: React.FC<{ item: any; mobile?: boolean }> = ({ item, mobile = false }) => {
    const isActive = currentPage === item.id;
    const baseClasses = mobile
      ? 'flex items-center w-full px-4 py-3 text-left transition-colors duration-200'
      : 'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200';

    const activeClasses = isActive
      ? mobile
        ? 'bg-primary-50 text-primary-700 border-r-4 border-primary-400'
        : 'bg-primary-100 text-primary-700'
      : mobile
        ? 'text-gray-700 hover:bg-gray-50'
        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100';

    return (
      <button
        onClick={() => {
          onNavigate(item.id);
          if (mobile) setIsMobileMenuOpen(false);
        }}
        className={`${baseClasses} ${activeClasses}`}
        aria-current={isActive ? 'page' : undefined}
      >
        <FontAwesomeIcon icon={item.icon} className={`${mobile ? 'w-5 h-5 mr-3' : 'w-4 h-4 mr-2'}`} />
        {item.label}
      </button>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:bg-white lg:border-r lg:border-gray-200">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Satori</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navigationItems.map(item => (
            <NavItem key={item.id} item={item} />
          ))}
        </nav>

        {/* User Profile */}
        <div className="flex-shrink-0 border-t border-gray-200 p-4">
          <div className="flex items-center">
            <img
              src={userAvatar}
              alt={userName}
              className="w-8 h-8 rounded-full bg-gray-200"
              onError={e => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f3aa1c&color=fff&size=32`;
              }}
            />
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
              <p className="text-xs text-gray-500 capitalize">{userRole}</p>
            </div>
            <button
              onClick={() => console.warn('Settings')}
              className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Settings"
            >
              <FontAwesomeIcon icon={faCog} className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="flex items-center justify-between h-16 px-4">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <FontAwesomeIcon icon={faBars} className="w-5 h-5" />
          </button>

          {/* Logo */}
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Satori</span>
          </div>

          {/* Notifications */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => console.warn('Notifications')}
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Notifications"
            >
              <FontAwesomeIcon icon={faBell} className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />

          {/* Menu Panel */}
          <div className="relative flex flex-col w-full max-w-xs bg-white shadow-xl">
            {/* Header */}
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary-400 rounded-lg flex items-center justify-center mr-3">
                  <span className="text-white font-bold text-lg">S</span>
                </div>
                <span className="text-xl font-bold text-gray-900">Satori</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                aria-label="Close menu"
              >
                <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile */}
            <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center">
                <img
                  src={userAvatar}
                  alt={userName}
                  className="w-10 h-10 rounded-full bg-gray-200"
                  onError={e => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=f3aa1c&color=fff&size=40`;
                  }}
                />
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">{userName}</p>
                  <p className="text-xs text-gray-500 capitalize">{userRole}</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-0 py-4 overflow-y-auto">
              {navigationItems.map(item => (
                <NavItem key={item.id} item={item} mobile />
              ))}
            </nav>

            {/* Footer Actions */}
            <div className="border-t border-gray-200 p-4 space-y-2">
              <button
                onClick={() => console.warn('Settings')}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faCog} className="w-4 h-4 mr-3" />
                Settings
              </button>
              <button
                onClick={() => console.warn('Sign out')}
                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="w-4 h-4 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navigation;
