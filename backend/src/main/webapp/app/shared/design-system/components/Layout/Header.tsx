import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser, faChevronDown, faSearch, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { IconButton, Button } from '../Button/Button';
import { Input } from '../Input/Input';
import { QuickHelpButton } from '../../../components/help';
import './Header.scss';

export interface HeaderNotification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  type?: 'info' | 'success' | 'warning' | 'error';
}

export interface HeaderUserMenuAction {
  id: string;
  label: string;
  icon?: IconDefinition;
  onClick: () => void;
  divider?: boolean;
}

export interface HeaderProps {
  title?: string;
  user?: {
    name: string;
    email?: string;
    avatar?: string;
    role?: string;
  };
  notifications?: HeaderNotification[];
  userMenuActions?: HeaderUserMenuAction[];
  onNotificationClick?: (notification: HeaderNotification) => void;
  onNotificationMarkAllRead?: () => void;
  showSearch?: boolean;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  onMobileMenuToggle?: () => void;
  showMobileMenuToggle?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  user,
  notifications = [],
  userMenuActions = [],
  onNotificationClick,
  onNotificationMarkAllRead,
  showSearch = false,
  onSearch,
  searchPlaceholder = 'Search...',
  onMobileMenuToggle,
  showMobileMenuToggle = false,
  className = '',
  children,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notificationRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleNotificationClick = (notification: HeaderNotification) => {
    if (onNotificationClick) {
      onNotificationClick(notification);
    }
    setShowNotifications(false);
  };

  const headerClasses = ['satori-header', className].filter(Boolean).join(' ');

  return (
    <header className={headerClasses}>
      <div className="satori-header__content">
        {/* Left section */}
        <div className="satori-header__left">
          {showMobileMenuToggle && (
            <IconButton
              icon={faBars}
              variant="ghost"
              size="md"
              onClick={onMobileMenuToggle}
              aria-label="Toggle mobile menu"
              className="satori-header__mobile-toggle"
            />
          )}

          {title && <h1 className="satori-header__title">{title}</h1>}
        </div>

        {/* Center section */}
        <div className="satori-header__center">
          {showSearch && (
            <form onSubmit={handleSearchSubmit} className="satori-header__search">
              <Input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                leftIcon={faSearch}
                size="sm"
                className="satori-header__search-input"
              />
            </form>
          )}
          {children}
        </div>

        {/* Right section */}
        <div className="satori-header__right">
          {/* Help Button */}
          <QuickHelpButton className="satori-header__help-button" />

          {/* Notifications */}
          {notifications.length > 0 && (
            <div className="satori-header__notifications" ref={notificationRef}>
              <IconButton
                icon={faBell}
                variant="ghost"
                size="md"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
                className="satori-header__notification-button"
              />

              {unreadCount > 0 && <span className="satori-header__notification-badge">{unreadCount > 99 ? '99+' : unreadCount}</span>}

              {showNotifications && (
                <div className="satori-header__notification-dropdown">
                  <div className="satori-header__notification-header">
                    <h3>Notifications</h3>
                    {unreadCount > 0 && onNotificationMarkAllRead && (
                      <Button variant="ghost" size="sm" onClick={onNotificationMarkAllRead}>
                        Mark all read
                      </Button>
                    )}
                  </div>

                  <div className="satori-header__notification-list">
                    {notifications.length === 0 ? (
                      <div className="satori-header__notification-empty">No notifications</div>
                    ) : (
                      notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`satori-header__notification-item ${!notification.read ? 'satori-header__notification-item--unread' : ''}`}
                          onClick={() => handleNotificationClick(notification)}
                        >
                          <div className="satori-header__notification-content">
                            <h4>{notification.title}</h4>
                            <p>{notification.message}</p>
                            <span className="satori-header__notification-time">{notification.timestamp.toLocaleDateString()}</span>
                          </div>
                          {!notification.read && <div className="satori-header__notification-dot" />}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User menu */}
          {user && (
            <div className="satori-header__user-menu" ref={userMenuRef}>
              <button className="satori-header__user-button" onClick={() => setShowUserMenu(!showUserMenu)} aria-label="User menu">
                <div className="satori-header__user-avatar">
                  {user.avatar ? <img src={user.avatar} alt={user.name} /> : <FontAwesomeIcon icon={faUser} />}
                </div>

                <div className="satori-header__user-info">
                  <span className="satori-header__user-name">{user.name}</span>
                  {user.role && <span className="satori-header__user-role">{user.role}</span>}
                </div>

                <FontAwesomeIcon icon={faChevronDown} className="satori-header__user-chevron" />
              </button>

              {showUserMenu && (
                <div className="satori-header__user-dropdown">
                  <div className="satori-header__user-dropdown-header">
                    <div className="satori-header__user-avatar satori-header__user-avatar--large">
                      {user.avatar ? <img src={user.avatar} alt={user.name} /> : <FontAwesomeIcon icon={faUser} />}
                    </div>
                    <div>
                      <div className="satori-header__user-name">{user.name}</div>
                      {user.email && <div className="satori-header__user-email">{user.email}</div>}
                    </div>
                  </div>

                  <div className="satori-header__user-actions">
                    {userMenuActions.map((action, index) => (
                      <React.Fragment key={action.id}>
                        {action.divider && index > 0 && <div className="satori-header__user-divider" />}
                        <button
                          className="satori-header__user-action"
                          onClick={() => {
                            action.onClick();
                            setShowUserMenu(false);
                          }}
                        >
                          {action.icon && <FontAwesomeIcon icon={action.icon} />}
                          {action.label}
                        </button>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
